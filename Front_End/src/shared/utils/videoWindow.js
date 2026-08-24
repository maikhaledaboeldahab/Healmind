/**
 * Centralized Video Call Window & Eligibility Utility
 * 
 * Business rules:
 * - Join window opens EXACTLY 10 minutes before the scheduled session time.
 * - Session window remains active for 60 minutes after the scheduled start time.
 * - Sessions with status "cancelled" or "rejected" or unpaid are ineligible.
 */

export const VIDEO_JOIN_WINDOW_MINUTES = 10;
export const SESSION_DURATION_MINUTES = 60;

/**
 * Parses session date and time into a reliable Date object.
 * Supports both ISO `scheduledTime` and combined `date` + `time` strings.
 * 
 * @param {object} session
 * @returns {Date|null}
 */
export function parseSessionDateTime(session) {
  if (!session) return null;

  if (session.scheduledTime) {
    const d = new Date(session.scheduledTime);
    if (!isNaN(d.getTime())) return d;
  }

  if (session.date && session.time) {
    const timeStr = String(session.time).trim();
    const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
    if (match) {
      let hours = parseInt(match[1], 10);
      const minutes = parseInt(match[2], 10);
      const meridiem = match[3]?.toUpperCase();
      if (meridiem === 'PM' && hours < 12) hours += 12;
      if (meridiem === 'AM' && hours === 12) hours = 0;

      if (session.date.includes('-')) {
        const [year, month, day] = session.date.split('-').map((v) => parseInt(v, 10));
        return new Date(year, month - 1, day, hours, minutes, 0, 0);
      }
    }
    const combined = new Date(`${session.date} ${session.time}`);
    if (!isNaN(combined.getTime())) return combined;
  }

  if (session.date) {
    const d = new Date(session.date);
    if (!isNaN(d.getTime())) return d;
  }

  return null;
}

/**
 * Evaluates whether a given session is eligible for video calling at the given timestamp.
 * 
 * @param {object} session
 * @param {Date} [now=new Date()]
 * @returns {{ isAvailable: boolean, status: 'available'|'too_early'|'expired'|'inactive'|'invalid_time', session: object, scheduledTime?: Date, windowStart?: Date, windowEnd?: Date }}
 */
export function evaluateSessionVideoEligibility(session, now = new Date()) {
  if (!session) {
    return { isAvailable: false, status: 'inactive', session: null };
  }

  const normalizedStatus = String(session.status || '').toLowerCase();
  if (normalizedStatus === 'cancelled' || normalizedStatus === 'rejected' || normalizedStatus === 'pending') {
    return { isAvailable: false, status: 'inactive', session };
  }

  if (session.depositPaid === false) {
    return { isAvailable: false, status: 'inactive', session };
  }

  const scheduledTime = parseSessionDateTime(session);
  if (!scheduledTime || isNaN(scheduledTime.getTime())) {
    return { isAvailable: false, status: 'invalid_time', session };
  }

  const windowStart = new Date(scheduledTime.getTime() - VIDEO_JOIN_WINDOW_MINUTES * 60 * 1000);
  const windowEnd = new Date(scheduledTime.getTime() + SESSION_DURATION_MINUTES * 60 * 1000);

  if (now < windowStart) {
    return {
      isAvailable: false,
      status: 'too_early',
      session,
      scheduledTime,
      windowStart,
      windowEnd,
    };
  }

  if (now > windowEnd) {
    return {
      isAvailable: false,
      status: 'expired',
      session,
      scheduledTime,
      windowStart,
      windowEnd,
    };
  }

  return {
    isAvailable: true,
    status: 'available',
    session,
    scheduledTime,
    windowStart,
    windowEnd,
  };
}

/**
 * Finds the most relevant session for video calling with a specific doctor.
 * Prioritizes confirmed/paid sessions currently inside the 10-minute active join window,
 * followed by the earliest upcoming session.
 * 
 * @param {Array<object>} allSessions - Combined upcoming and historical sessions
 * @param {string|number} doctorId - ID of the active doctor
 * @param {Date} [now=new Date()]
 * @returns {{ isAvailable: boolean, status: string, session: object|null, scheduledTime?: Date, windowStart?: Date, windowEnd?: Date }}
 */
export function getEligibleDoctorSession(allSessions = [], doctorId, now = new Date()) {
  if (!doctorId || !Array.isArray(allSessions)) {
    return { isAvailable: false, status: 'inactive', session: null };
  }

  const doctorSessions = allSessions.filter(
    (s) => String(s.doctorId) === String(doctorId)
  );

  if (doctorSessions.length === 0) {
    return { isAvailable: false, status: 'inactive', session: null };
  }

  const evaluated = doctorSessions.map((session) => ({
    session,
    result: evaluateSessionVideoEligibility(session, now),
  }));

  // 1. If any session is currently active/available, pick it immediately
  const activeMatch = evaluated.find((item) => item.result.isAvailable);
  if (activeMatch) {
    return activeMatch.result;
  }

  // 2. Next, look for the closest upcoming confirmed session that is 'too_early'
  const upcomingMatches = evaluated
    .filter((item) => item.result.status === 'too_early')
    .sort((a, b) => a.result.scheduledTime.getTime() - b.result.scheduledTime.getTime());

  if (upcomingMatches.length > 0) {
    return upcomingMatches[0].result;
  }

  // 3. Otherwise no valid upcoming/active session found
  return { isAvailable: false, status: 'inactive', session: null };
}
