const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY || "sk_test_dummy");
const { Doctor } = require("../models/User");
const Session = require("../models/session.model");
const { createNotification } = require("../utils/notificationService");

/**
 * Initiate booking and create a Stripe Checkout Session or return mock booking details.
 * POST /api/payments/checkout-session
 */
exports.createCheckoutSession = async (req, res) => {
  try {
    const { doctorId, slotId, type, mode } = req.body;

    if (!doctorId || !slotId) {
      return res.status(400).json({
        success: false,
        message: "Doctor ID and Slot ID are required."
      });
    }

    // 1. Atomically reserve the slot
    const updatedDoctor = await Doctor.findOneAndUpdate(
      {
        _id: doctorId,
        slots: {
          $elemMatch: {
            _id: slotId,
            isBooked: { $ne: true }
          }
        }
      },
      {
        $set: { "slots.$.isBooked": true }
      },
      { new: true }
    );

    if (!updatedDoctor) {
      // Find out why it failed
      const checkDoctor = await Doctor.findById(doctorId);
      if (!checkDoctor) {
        return res.status(404).json({
          success: false,
          message: "Doctor not found."
        });
      }
      const checkSlot = checkDoctor.slots.id(slotId);
      if (!checkSlot) {
        return res.status(404).json({
          success: false,
          message: "Slot not found in doctor's profile."
        });
      }
      return res.status(400).json({
        success: false,
        message: "This slot is already booked."
      });
    }

    const slot = updatedDoctor.slots.id(slotId);

    // Calculate amounts dynamically from the doctor's sessionPrice
    const basePrice = updatedDoctor.sessionPrice || 0;
    const finalAmount = basePrice * 0.20;
    const balance = basePrice - finalAmount;
    const isBalancePrepaid = basePrice <= finalAmount;

    // 3. Create a pending Session document in the database
    const sessionType = type || "followup";
    const sessionMode = mode || "visit";

    const sessionData = {
      patientId: req.user.id,
      patientname: req.user.name,
      doctorId: updatedDoctor._id,
      doctorname: updatedDoctor.name,
      type: sessionType,
      mode: sessionMode,
      scheduledTime: slot.day,
      status: "pending",
      sessionPrice: basePrice,
      depositAmount: finalAmount,
      balance: balance,
      depositPaid: false,
      balancePaid: isBalancePrepaid,
      slotId: slot._id,
    };

    if (sessionMode === "visit" && slot.location) {
      sessionData.location = { address: slot.location };
    }

    let newSession;
    try {
      newSession = await Session.create(sessionData);
    } catch (dbError) {
      // Rollback the slot reservation on DB error
      await Doctor.updateOne(
        { _id: doctorId, "slots._id": slotId },
        { $set: { "slots.$.isBooked": false } }
      );
      throw dbError;
    }

    // 4. If Stripe secret key is configured, create a Stripe Checkout Session
    if (process.env.STRIPE_SECRET_KEY) {
      const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

      try {
        const stripeSession = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: [
            {
              price_data: {
                currency: "usd",
                product_data: {
                  name: `Deposit for Doctor ${updatedDoctor.name}`,
                  description: `Scheduled for ${new Date(slot.day).toLocaleDateString()} at ${slot.time || "scheduled time"}.`,
                },
                unit_amount: Math.round(finalAmount * 100), // in cents
              },
              quantity: 1,
            },
          ],
          mode: "payment",
          success_url: `${clientUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}&app_session_id=${newSession._id}`,
          cancel_url: `${clientUrl}/payment-cancelled?app_session_id=${newSession._id}`,
          metadata: {
            paymentType: "deposit",
            sessionId: newSession._id.toString(),
            doctorId: updatedDoctor._id.toString(),
            slotId: slot._id.toString(),
          },
        });

        return res.status(201).json({
          success: true,
          message: "Stripe checkout session created successfully.",
          stripeSessionId: stripeSession.id,
          checkoutUrl: stripeSession.url,
          session: newSession
        });
      } catch (stripeError) {
        // Rollback the session creation and the slot reservation
        await Session.findByIdAndDelete(newSession._id);
        await Doctor.updateOne(
          { _id: doctorId, "slots._id": slotId },
          { $set: { "slots.$.isBooked": false } }
        );
        throw stripeError;
      }
    }

    // 5. If Stripe is not configured, fall back to mock checkout info
    return res.status(201).json({
      success: true,
      message: "Session reservation initiated (Stripe is not configured in environment). Use mock charge API to complete payment.",
      requiresMockCharge: true,
      session: newSession
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error initiating checkout session.",
      error: error.message
    });
  }
};

/**
 * Simulate completing the payment.
 * POST /api/payments/mock-charge
 */
exports.mockCharge = async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: "Session ID is required."
      });
    }

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found."
      });
    }

    if (session.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: `Cannot pay for a session that is already ${session.status}.`
      });
    }

    // Verify doctor and slot exist
    const doctor = await Doctor.findById(session.doctorId);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Associated doctor not found."
      });
    }

    const slot = doctor.slots.id(session.slotId);
    if (!slot) {
      return res.status(404).json({
        success: false,
        message: "Associated slot not found."
      });
    }

    // 1. Confirm session payment
    session.depositPaid = true;
    session.status = "pending"; // Keep pending until balance is paid and doctor confirms
    await session.save();

    // Notify the doctor that a new session request has deposit paid
    const io = req.app.get("io");
    await createNotification(io, {
      recipientId: session.doctorId,
      recipientModel: "doctor",
      type: "session_booked",
      title: "New Session Request",
      message: `${session.patientname} has requested a new session with you (deposit paid).`,
    });

    return res.status(200).json({
      success: true,
      message: "Mock payment successful. Slot is reserved and reservation is pending doctor booking confirmation.",
      data: session
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error processing mock charge.",
      error: error.message
    });
  }
};

/**
 * Webhook handler for Stripe payment events.
 * POST /api/payments/webhook
 */
exports.stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    const rawBody = req.rawBody || req.body; // Needs to be raw buffer for signature verification
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (webhookSecret && sig) {
      event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
    } else {
      // Fallback for testing/development if no secret is set
      // parse from rawBody assuming it was already parsed as JSON by some fallback or raw buffer converted to string
      const payloadString = Buffer.isBuffer(rawBody) ? rawBody.toString("utf8") : JSON.stringify(rawBody);
      event = JSON.parse(payloadString);
    }
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === "checkout.session.completed") {
    const stripeSession = event.data.object;
    const { paymentType, sessionId, doctorId, slotId } = stripeSession.metadata || {};

    if (sessionId) {
      try {
        console.log(`Processing successful ${paymentType || "deposit"} payment for session: ${sessionId}`);

        // 1. Find and update the Session
        const session = await Session.findById(sessionId);
        if (session) {
          const io = req.app.get("io");
          if (paymentType === "balance") {
            session.balancePaid = true;
            await session.save();
            console.log(`Session ${sessionId} remaining balance marked as paid.`);

            // Notify the doctor that the balance is paid
            await createNotification(io, {
              recipientId: session.doctorId,
              recipientModel: "doctor",
              type: "session_confirmed",
              title: "Session Confirmed",
              message: `The session with ${session.patientname} is fully paid and confirmed.`,
            });
            // Also notify the patient
            await createNotification(io, {
              recipientId: session.patientId,
              recipientModel: "patient",
              type: "session_status_changed",
              title: "Session Confirmed",
              message: `Your session with Dr. ${session.doctorname} has been confirmed.`,
            });
          } else {
            // Default to deposit payment
            if (session.status === "pending" || session.status === "cancelled") {
              session.depositPaid = true;
              session.status = "pending";
              await session.save();

              // 2. Find and update the Doctor's Slot
              if (doctorId && slotId) {
                await Doctor.updateOne(
                  { _id: doctorId, "slots._id": slotId },
                  { $set: { "slots.$.isBooked": true } }
                );
                console.log(`Slot ${slotId} for Doctor ${doctorId} marked as booked.`);
              }

              // Notify the doctor that a new session request has deposit paid
              await createNotification(io, {
                recipientId: session.doctorId,
                recipientModel: "doctor",
                type: "session_booked",
                title: "New Session Request",
                message: `${session.patientname} has requested a new session with you (deposit paid).`,
              });
            } else {
              console.log(`Session ${sessionId} not in pending or cancelled status during deposit webhook.`);
            }
          }
        } else {
          console.log(`Session ${sessionId} not found.`);
        }
      } catch (err) {
        console.error(`Error updating booking status from webhook: ${err.message}`);
        return res.status(500).json({ success: false, error: err.message });
      }
    } else {
      console.warn("Stripe webhook checkout.session.completed event is missing metadata fields.");
    }
  }

  // Return a 200 response to acknowledge receipt of the event
  return res.status(200).json({ received: true });
};

/**
 * Initiate balance payment and create a Stripe Checkout Session or return mock details.
 * POST /api/payments/balance-checkout-session
 */
exports.createBalanceCheckoutSession = async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: "Session ID is required."
      });
    }

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found."
      });
    }

    // Verify it belongs to the patient
    if (session.patientId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Access denied. This session does not belong to you."
      });
    }

    if (session.balancePaid) {
      return res.status(400).json({
        success: false,
        message: "Balance for this session is already paid."
      });
    }

    const doctor = await Doctor.findById(session.doctorId);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor associated with session not found."
      });
    }

    // Remaining balance
    const balance = doctor.sessionPrice - session.depositAmount;

    if (balance <= 0) {
      session.balancePaid = true;
      session.status = "confirmed";
      await session.save();

      // Notify doctor and patient
      const io = req.app.get("io");
      await createNotification(io, {
        recipientId: session.doctorId,
        recipientModel: "doctor",
        type: "session_confirmed",
        title: "Session Confirmed",
        message: `The session with ${session.patientname} is fully paid and confirmed.`,
      });
      await createNotification(io, {
        recipientId: session.patientId,
        recipientModel: "patient",
        type: "session_status_changed",
        title: "Session Confirmed",
        message: `Your session with Dr. ${session.doctorname} has been confirmed.`,
      });

      return res.status(200).json({
        success: true,
        message: "Remaining balance is 0 or less. Balance marked as fully paid.",
        session
      });
    }

    // If Stripe is configured
    if (process.env.STRIPE_SECRET_KEY) {
      const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

      const stripeSession = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: `Remaining Balance for Session with Dr. ${doctor.name}`,
                description: `Remaining balance payment for scheduled appointment.`,
              },
              unit_amount: Math.round(balance * 100), // in cents
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${clientUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}&app_session_id=${session._id}`,
        cancel_url: `${clientUrl}/payment-cancelled?app_session_id=${session._id}`,
        metadata: {
          paymentType: "balance",
          sessionId: session._id.toString(),
          doctorId: doctor._id.toString(),
          slotId: session.slotId ? session.slotId.toString() : "",
        },
      });

      return res.status(201).json({
        success: true,
        message: "Stripe balance checkout session created successfully.",
        stripeSessionId: stripeSession.id,
        checkoutUrl: stripeSession.url,
        session
      });
    }

    return res.status(200).json({
      success: true,
      message: "Balance payment initiated (Stripe is not configured in environment). Use mock charge balance API to complete payment.",
      requiresMockCharge: true,
      balance,
      session
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error creating balance checkout session.",
      error: error.message
    });
  }
};

/**
 * Simulate completing the balance payment.
 * POST /api/payments/mock-charge-balance
 */
exports.mockChargeBalance = async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: "Session ID is required."
      });
    }

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found."
      });
    }

    if (session.patientId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Access denied. This session does not belong to you."
      });
    }

    if (session.balancePaid) {
      return res.status(400).json({
        success: false,
        message: "Balance has already been paid for this session."
      });
    }

    session.balancePaid = true;
    session.status = "confirmed";
    await session.save();

    // Notify the doctor that the balance is paid
    const io = req.app.get("io");
    await createNotification(io, {
      recipientId: session.doctorId,
      recipientModel: "doctor",
      type: "session_confirmed",
      title: "Session Confirmed",
      message: `The session with ${session.patientname} is fully paid and confirmed.`,
    });
    await createNotification(io, {
      recipientId: session.patientId,
      recipientModel: "patient",
      type: "session_status_changed",
      title: "Session Confirmed",
      message: `Your session with Dr. ${session.doctorname} has been confirmed.`,
    });

    return res.status(200).json({
      success: true,
      message: "Mock balance payment successful. Remaining balance is marked as paid.",
      data: session
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error processing mock charge balance.",
      error: error.message
    });
  }
};
