const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY || "sk_test_dummy");
const { Doctor } = require("../models/User");
const Session = require("../models/session.model");

/**
 * Initiate booking and create a Stripe Checkout Session or return mock booking details.
 * POST /api/payments/checkout-session
 */
exports.createCheckoutSession = async (req, res) => {
  try {
    const { doctorId, slotId, type, mode, depositAmount } = req.body;

    if (!doctorId || !slotId) {
      return res.status(400).json({
        success: false,
        message: "Doctor ID and Slot ID are required."
      });
    }

    // 1. Verify doctor and slot
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found."
      });
    }

    const slot = doctor.slots.id(slotId);
    if (!slot) {
      return res.status(404).json({
        success: false,
        message: "Slot not found in doctor's profile."
      });
    }

    if (slot.isBooked) {
      return res.status(400).json({
        success: false,
        message: "This slot is already booked."
      });
    }

    // 2. Determine session amount (deposit)
    // Default to doctor's session price, or 50 if sessionPrice is not set/zero.
    const finalAmount = depositAmount !== undefined 
      ? Number(depositAmount) 
      : (doctor.sessionPrice > 0 ? doctor.sessionPrice : 50);

    if (isNaN(finalAmount) || finalAmount < 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid deposit amount."
      });
    }

    // 3. Create a pending Session document in the database
    // We reserve the slot for the patient in 'pending' status
    const sessionType = type || "followup";
    const sessionMode = mode || "visit";

    const sessionData = {
      patientId: req.user.id,
      patientname: req.user.name,
      doctorId: doctor._id,
      doctorname: doctor.name,
      type: sessionType,
      mode: sessionMode,
      scheduledTime: slot.day,
      status: "pending",
      depositAmount: finalAmount,
      depositPaid: false,
      slotId: slot._id,
    };

    if (sessionMode === "visit" && slot.location) {
      sessionData.location = { address: slot.location };
    }

    const newSession = await Session.create(sessionData);

    // 4. If Stripe secret key is configured, create a Stripe Checkout Session
    if (process.env.STRIPE_SECRET_KEY) {
      const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
      
      const stripeSession = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: `Deposit for Doctor ${doctor.name}`,
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
          sessionId: newSession._id.toString(),
          doctorId: doctor._id.toString(),
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

    // Double-check if slot is already booked by someone else
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

    if (slot.isBooked) {
      // Release or delete the pending session since it can't be booked anymore
      session.status = "cancelled";
      await session.save();
      return res.status(400).json({
        success: false,
        message: "This slot has already been booked by another patient."
      });
    }

    // 1. Confirm session payment
    session.depositPaid = true;
    session.status = "confirmed";
    await session.save();

    // 2. Mark the slot as booked
    slot.isBooked = true;
    await doctor.save();

    return res.status(200).json({
      success: true,
      message: "Mock payment successful. Slot is reserved and reservation is confirmed.",
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
    const rawBody = req.body; // Needs to be raw buffer for signature verification
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
    const { sessionId, doctorId, slotId } = stripeSession.metadata || {};

    if (sessionId && doctorId && slotId) {
      try {
        console.log(`Processing successful payment for session: ${sessionId}`);
        
        // 1. Find and update the Session
        const session = await Session.findById(sessionId);
        if (session && session.status === "pending") {
          session.depositPaid = true;
          session.status = "confirmed";
          await session.save();

          // 2. Find and update the Doctor's Slot
          const doctor = await Doctor.findById(doctorId);
          if (doctor) {
            const slot = doctor.slots.id(slotId);
            if (slot) {
              slot.isBooked = true;
              await doctor.save();
              console.log(`Slot ${slotId} for Doctor ${doctorId} marked as booked.`);
            } else {
              console.error(`Slot ${slotId} not found in Doctor ${doctorId} profile.`);
            }
          } else {
            console.error(`Doctor ${doctorId} not found.`);
          }
        } else {
          console.log(`Session ${sessionId} not found or not in pending status.`);
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
