import { useEffect, useRef, useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPhoneSlash,
  faTriangleExclamation,
  faRotateRight,
  faArrowLeft,
  faLock,
} from '@fortawesome/free-solid-svg-icons';
import { getVideoCallSession } from '../../services/sessions.service';
import { loadJitsiScript } from '../../utils/jitsiLoader';
import { useAuth } from '../../context/AuthContext';
import Button from '../Button/Button';
import Loader from '../Loader/Loader';
import styles from './VideoCall.module.css';

/**
 * Unified Reusable Jitsi Video Call Component.
 * 
 * @param {Object} props
 * @param {string|number} props.sessionId - The ID of the session to join
 * @param {Function} [props.onLeave] - Callback when user leaves or closes the call
 * @param {string} [props.fallbackDisplayName] - Fallback user display name if not in auth or backend
 * @param {boolean} [props.showTopBar=true] - Whether to show the top mini control bar
 */
export default function VideoCall({
  sessionId,
  onLeave,
  fallbackDisplayName = 'HealMind User',
  showTopBar = true,
}) {
  const { user, isAuthenticated } = useAuth();

  const containerRef = useRef(null);
  const jitsiApiRef = useRef(null);

  const [callState, setCallState] = useState('loading'); // 'loading' | 'active' | 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const [sessionData, setSessionData] = useState(null);

  // Clean up existing Jitsi instance safely
  const cleanupJitsi = useCallback(() => {
    if (jitsiApiRef.current) {
      try {
        jitsiApiRef.current.dispose();
      } catch (err) {
        console.warn('Error while disposing Jitsi instance:', err);
      }
      jitsiApiRef.current = null;
    }
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
    }
  }, []);

  const handleLeaveCall = useCallback(() => {
    cleanupJitsi();
    if (onLeave) {
      onLeave();
    }
  }, [cleanupJitsi, onLeave]);

  const initSession = useCallback(async () => {
    if (!sessionId) {
      setErrorMessage('Invalid or missing session ID.');
      setCallState('error');
      return;
    }

    setCallState('loading');
    setErrorMessage('');
    cleanupJitsi();

    try {
      // 1. Fetch room details from backend
      let roomName = '';
      let jitsiDomain = 'meet.jit.si';
      let displayName = user?.fullName || user?.name || fallbackDisplayName;

      try {
        const response = await getVideoCallSession(sessionId);
        const data = response?.data || response;

        if (data?.roomName) {
          roomName = data.roomName;
        }
        if (data?.jitsiDomain) {
          jitsiDomain = data.jitsiDomain;
        }
        if (data?.displayName) {
          displayName = data.displayName;
        }
      } catch (apiErr) {
        // Parse backend error responses gracefully
        const status = apiErr?.response?.status;
        const backendMsg =
          apiErr?.response?.data?.message ||
          apiErr?.response?.data?.error;

        if (backendMsg) {
          throw new Error(backendMsg);
        }

        if (status === 401) {
          throw new Error('Unauthorized: Please log in to join this session.');
        } else if (status === 403) {
          throw new Error('You are not authorized or not a participant in this session.');
        } else if (status === 404) {
          throw new Error('Session not found or has expired.');
        } else if (status === 400) {
          throw new Error('Session is not open yet or has already ended.');
        } else {
          // If backend is unreachable or offline during local frontend development,
          // create a safe fallback room name matching the required pattern
          // so developer/user can still test the Jitsi call interface.
          console.warn('Backend session endpoint unavailable, falling back for development:', apiErr.message);
          roomName = `healmind-session-${sessionId}`;
        }
      }

      if (!roomName) {
        throw new Error('Unable to obtain a valid room name for this session.');
      }

      setSessionData({ roomName, jitsiDomain, displayName });

      // 2. Load Jitsi external_api.js dynamically
      const JitsiMeetAPI = await loadJitsiScript(jitsiDomain);

      // Verify container is present
      if (!containerRef.current) {
        throw new Error('Video call container is not ready.');
      }

      // 3. Initialize Jitsi external API instance
      containerRef.current.innerHTML = '';
      const options = {
        roomName,
        parentNode: containerRef.current,
        width: '100%',
        height: '100%',
        userInfo: {
          displayName,
        },
        configOverwrite: {
          startWithAudioMuted: false,
          startWithVideoMuted: false,
          prejoinPageEnabled: true,
        },
        interfaceConfigOverwrite: {
          SHOW_JITSI_WATERMARK: false,
        },
      };

      const jitsiInstance = new JitsiMeetAPI(jitsiDomain, options);
      jitsiApiRef.current = jitsiInstance;

      // 4. Attach event listeners
      jitsiInstance.addEventListener('videoConferenceLeft', () => {
        handleLeaveCall();
      });

      jitsiInstance.addEventListener('readyToClose', () => {
        handleLeaveCall();
      });

      setCallState('active');
    } catch (err) {
      console.error('Failed to initialize video call session:', err);
      setErrorMessage(err.message || 'Unable to join the session. Please try again.');
      setCallState('error');
    }
  }, [sessionId, user, fallbackDisplayName, cleanupJitsi, handleLeaveCall]);

  useEffect(() => {
    initSession();

    return () => {
      cleanupJitsi();
    };
  }, [sessionId]);

  return (
    <div className={styles.container}>
      {/* Top Bar for active call */}
      {callState === 'active' && showTopBar && (
        <div className={styles.topBar}>
          <div className={styles.topBarLeft}>
            <span className={styles.liveDot} />
            <span className={styles.roomBadge}>Session #{sessionId}</span>
          </div>
          <button
            type="button"
            className={styles.leaveBtn}
            onClick={handleLeaveCall}
            title="Leave Session"
          >
            <FontAwesomeIcon icon={faPhoneSlash} />
            <span>Leave Call</span>
          </button>
        </div>
      )}

      {/* Active Jitsi Frame */}
      <div
        ref={containerRef}
        className={styles.jitsiFrame}
        style={{ display: callState === 'active' ? 'block' : 'none' }}
      />

      {/* Loading State */}
      {callState === 'loading' && (
        <div className={styles.centerState}>
          <div className={styles.loadingSpinnerWrap}>
            <Loader label="Joining session..." />
            <p className={styles.loadingText}>Connecting to secure video room...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {callState === 'error' && (
        <div className={styles.centerState}>
          <FontAwesomeIcon icon={faTriangleExclamation} className={styles.errorIcon} />
          <h3 className={styles.errorTitle}>Unable to Join Session</h3>
          <p className={styles.errorMessage}>{errorMessage}</p>
          <div className={styles.errorActions}>
            <Button
              variant="outline"
              icon={<FontAwesomeIcon icon={faArrowLeft} />}
              onClick={handleLeaveCall}
            >
              Back to Sessions
            </Button>
            <Button
              variant="primary"
              icon={<FontAwesomeIcon icon={faRotateRight} />}
              onClick={initSession}
            >
              Retry Connection
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
