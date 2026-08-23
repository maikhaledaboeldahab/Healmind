import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import VideoCall from '../../components/VideoCall/VideoCall';

export default function DoctorVideoSession() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLeaveCall = () => {
    navigate('/doctor/sessions');
  };

  return (
    <div className="d-flex flex-column gap-3">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
        <div>
          <h3 className="fw-bold mb-1">Clinical Video Consultation</h3>
          <p className="text-muted mb-0">Session #{sessionId} • Active WebRTC Session</p>
        </div>
        <div className="d-flex align-items-center gap-2">
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={() => navigate('/doctor/livechat')}
          >
            <i className="fa-regular fa-comments me-2"></i>
            Live Chat
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={() => navigate('/doctor/sessions')}
          >
            <i className="fa-solid fa-arrow-left me-2"></i>
            Back to Sessions
          </button>
        </div>
      </div>

      <div className="bg-white rounded-4 shadow-sm p-3 p-md-4">
        <VideoCall
          sessionId={sessionId}
          onLeave={handleLeaveCall}
          fallbackDisplayName={user?.fullName || user?.name || 'Dr. Farah'}
        />
      </div>
    </div>
  );
}
