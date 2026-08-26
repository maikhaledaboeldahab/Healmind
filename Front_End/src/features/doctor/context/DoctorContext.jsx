import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import api from '../../../shared/services/api';

const DoctorContext = createContext(null);

const INITIAL_PATIENTS = [];
const INITIAL_REQUESTS = [];
const INITIAL_TODAY_SESSIONS = [];
const INITIAL_UPCOMING_SESSIONS = [];
const INITIAL_CERTIFICATIONS = [];

function normalizePatientDoc(p) {
  if (!p) return null;
  const birthYear = p.dateOfBirth ? new Date(p.dateOfBirth).getFullYear() : null;
  const age = birthYear ? new Date().getFullYear() - birthYear : (p.age || 25);
  const statusStr = p.communityAccess === 'approved' || p.status === 'Approved' 
    ? 'Approved' 
    : (p.communityAccess === 'rejected' ? 'Rejected' : 'Pending');

  return {
    id: p._id || p.id,
    patientName: p.name || p.fullName || `Patient ${p.email?.split('@')[0]}`,
    age,
    gender: p.gender ? (p.gender.charAt(0).toUpperCase() + p.gender.slice(1)) : 'Patient',
    phone: p.phone || '+20 100 000 0000',
    email: p.email || '',
    therapyType: p.therapyType || 'Clinical Therapy',
    status: statusStr,
    communityStatus: statusStr,
    patientSince: p.createdAt ? new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Recent',
    lastSession: 'Registered Patient',
    diagnosis: p.medicalNotes || 'Patient registered in HealMind system.',
    notes: [],
    pastSessions: [],
  };
}

export const DoctorProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [slots, setSlotsState] = useState([]);
  const [patients, setPatients] = useState([]);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    try {
      localStorage.removeItem('healmind_doctor_patients');
      localStorage.removeItem('healmind_doctor_requests');
    } catch {
      // Ignore storage errors
    }
  }, []);

  const [allSessions, setAllSessions] = useState([]);
  const [todaysSessions, setTodaysSessions] = useState(INITIAL_TODAY_SESSIONS);
  const [upcomingSessions, setUpcomingSessions] = useState(INITIAL_UPCOMING_SESSIONS);
  const [certifications, setCertifications] = useState(INITIAL_CERTIFICATIONS);

  // Fetch real data from Backend APIs
  const fetchDoctorData = async () => {
    try {
      const [profileRes, slotsRes, sessionsRes, ticketsRes, patientsRes] = await Promise.allSettled([
        api.get('/doctor'),
        api.get('/doctor/slots'),
        api.get('/session/my-sessions'),
        api.get('/ticket/admin/pending'),
        api.get('/admin/patients'),
      ]);

      if (profileRes.status === 'fulfilled' && profileRes.value.data) {
        const d = profileRes.value.data.data || profileRes.value.data.user || profileRes.value.data;
        setProfile(d);
        if (d.certificate) {
          const certUrl = d.certificate.startsWith('http')
            ? d.certificate
            : `http://localhost:3000/${d.certificate.replace(/^\//, '')}`;
          setCertifications([
            {
              id: 1,
              name: `${d.specialization || 'Medical'} Professional Certificate`,
              issueDate: 'Verified',
              docId: d.licenseNumber || 'LIC-VERIFIED',
              issuer: 'Ministry of Health / Medical Syndicate',
              fileUrl: certUrl,
              fileName: 'Doctor_Certificate.pdf',
              type: 'pdf',
            },
          ]);
        }
      }

      if (slotsRes.status === 'fulfilled' && slotsRes.value.data) {
        const liveSlots = slotsRes.value.data.slots || slotsRes.value.data.data || [];
        setSlotsState(liveSlots);
      }

      if (patientsRes.status === 'fulfilled' && patientsRes.value.data) {
        const rawPatients = patientsRes.value.data.data || patientsRes.value.data;
        if (Array.isArray(rawPatients) && rawPatients.length > 0) {
          setPatients(rawPatients.map(normalizePatientDoc));
        }
      }

      if (sessionsRes.status === 'fulfilled' && sessionsRes.value.data) {
        const liveSessions = sessionsRes.value.data.sessions || sessionsRes.value.data.data || sessionsRes.value.data;
        if (Array.isArray(liveSessions)) {
          const formatted = liveSessions.map((s, idx) => ({
            id: s._id || s.id || idx + 1,
            sessionId: s._id || s.id || `ses-${idx + 1}`,
            patientName: s.patientId?.name || s.patientName || `Patient ${idx + 1}`,
            date: s.scheduledTime ? new Date(s.scheduledTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Scheduled',
            time: s.scheduledTime ? new Date(s.scheduledTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '10:00 AM',
            sessionType: s.type || s.sessionType || 'Therapy Session',
            status: s.status ? (s.status.charAt(0).toUpperCase() + s.status.slice(1)) : 'Confirmed',
            decision: s.doctorDecision || 'Approved',
          }));
          setAllSessions(formatted);
          const today = new Date().toISOString().split('T')[0];
          setTodaysSessions(formatted.filter((s) => s.scheduledTime?.startsWith(today) || s.isToday));
          setUpcomingSessions(formatted.filter((s) => !s.scheduledTime?.startsWith(today) && !s.isToday));

          // Also merge patients from sessions if not already added
          const sessionPatients = liveSessions.map((s) => s.patientId).filter(Boolean);
          if (sessionPatients.length > 0) {
            setPatients((prev) => {
              const existingIds = new Set(prev.map((p) => String(p.id)));
              const newDocs = sessionPatients
                .filter((p) => !existingIds.has(String(p._id || p.id)))
                .map(normalizePatientDoc);
              return [...prev, ...newDocs];
            });
          }
        }
      }

      if (ticketsRes.status === 'fulfilled' && ticketsRes.value.data) {
        const liveTickets = ticketsRes.value.data.data || ticketsRes.value.data;
        if (Array.isArray(liveTickets) && liveTickets.length > 0) {
          setRequests(
            liveTickets.map((t) => ({
              id: t._id || t.id,
              patientName: t.patientId?.name || t.patientName || 'Patient Request',
              age: 30,
              gender: t.patientId?.gender || 'Unknown',
              requestedDate: t.createdAt ? new Date(t.createdAt).toLocaleDateString() : 'Pending',
              requestedTime: '10:00 AM',
              message: t.description || t.notes || 'Community mental health access request.',
              status: t.status || 'pending',
              therapyType: 'Clinical Assessment',
            }))
          );
        }
      }
    } catch (err) {
      console.warn('Backend API fetch error in DoctorContext:', err.message);
    }
  };

  useEffect(() => {
    fetchDoctorData();
  }, []);

  // Update profile via API
  const updateProfile = async (updateData) => {
    try {
      const res = await api.patch('/doctor', updateData);
      const updated = res.data?.data || updateData;
      setProfile((prev) => ({ ...prev, ...updated }));
      return updated;
    } catch (err) {
      setProfile((prev) => ({ ...prev, ...updateData }));
    }
  };

  // Availability Slot Operations
  const addSlot = async (slotData) => {
    try {
      const res = await api.post('/doctor/slots', { slots: [slotData] });
      const newSlots = res.data?.data || res.data?.slots;
      if (Array.isArray(newSlots)) {
        setSlotsState(newSlots);
      } else {
        setSlotsState((prev) => [...prev, { _id: Date.now(), ...slotData }]);
      }
    } catch {
      setSlotsState((prev) => [...prev, { _id: Date.now(), ...slotData }]);
    }
  };

  const deleteSlot = async (slotId) => {
    try {
      await api.delete(`/doctor/slots/${slotId}`);
      setSlotsState((prev) => prev.filter((s) => (s._id || s.id) !== slotId));
    } catch {
      setSlotsState((prev) => prev.filter((s) => (s._id || s.id) !== slotId));
    }
  };

  const editSlot = async (slotId, slotData) => {
    try {
      const res = await api.patch(`/doctor/slots/${slotId}`, slotData);
      const updated = res.data?.data;
      setSlotsState((prev) =>
        prev.map((s) => ((s._id || s.id) === slotId ? { ...s, ...updated } : s))
      );
    } catch {
      setSlotsState((prev) =>
        prev.map((s) => ((s._id || s.id) === slotId ? { ...s, ...slotData } : s))
      );
    }
  };

  const updateSessionStatus = async (sessionId, status) => {
    try {
      await api.patch(`/session/${sessionId}`, { status });
    } catch (err) {
      console.warn('Update session status API error:', err.message);
    }
  };

  const submitSessionReport = async (sessionId, reportData) => {
    try {
      await api.post(`/session/${sessionId}/report`, reportData);
    } catch (err) {
      console.warn('Submit session report API error:', err.message);
    }
  };

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('healmind_doctor_patients', JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem('healmind_doctor_requests', JSON.stringify(requests));
  }, [requests]);

  // Update community access status for a patient
  const updatePatientCommunityStatus = (patientId, newStatus) => {
    setPatients((prev) =>
      prev.map((p) =>
        String(p.id) === String(patientId)
          ? { ...p, communityStatus: newStatus, status: newStatus }
          : p
      )
    );
  };

  // Add session history log (e.g., when ending live chat or video session)
  const addPatientSessionHistory = (patientNameOrId, sessionRecord) => {
    const nowStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const nowTimeStr = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

    setPatients((prev) =>
      prev.map((p) => {
        const matches = String(p.id) === String(patientNameOrId) || p.patientName.toLowerCase() === String(patientNameOrId).toLowerCase();
        if (!matches) return p;

        const newPastSession = {
          id: Date.now(),
          date: sessionRecord.date || nowStr,
          duration: sessionRecord.duration || '45 mins',
          title: sessionRecord.title || sessionRecord.type || 'Live Clinical Session',
          summary: sessionRecord.summary || sessionRecord.note || 'Clinical session completed with doctor.',
        };

        const newNotes = sessionRecord.note
          ? [
              {
                id: Date.now(),
                date: nowStr,
                text: `Session (${sessionRecord.duration || 'Live'}): ${sessionRecord.note}`,
              },
              ...(p.notes || []),
            ]
          : p.notes;

        return {
          ...p,
          lastSession: `Today, ${nowTimeStr}`,
          pastSessions: [newPastSession, ...(p.pastSessions || [])],
          notes: newNotes,
        };
      })
    );
  };

  // Accept a session request: updates request, adds to sessions, and ensures patient is in patient directory
  const acceptSessionRequest = async (requestId) => {
    try {
      await api.patch(`/session/${requestId}`, { status: 'confirmed' });
    } catch (err) {
      console.warn('Accept session API call fallback:', err.message);
    }

    const targetRequest = requests.find((r) => r.id === requestId);
    if (targetRequest) {
      setRequests((prev) => prev.map((r) => (r.id === requestId ? { ...r, status: 'accepted' } : r)));
    }

    fetchDoctorData();
  };

  // Reject a session request
  const rejectSessionRequest = async (requestId) => {
    try {
      await api.patch(`/session/${requestId}`, { status: 'rejected' });
    } catch (err) {
      console.warn('Reject session API call fallback:', err.message);
    }

    setRequests((prev) => prev.filter((r) => r.id !== requestId));
    fetchDoctorData();
  };

  // Dynamically calculate recent patients based on active list & latest interactions
  const recentPatients = useMemo(() => {
    return patients.slice(0, 4).map((p) => ({
      id: p.id,
      patientName: p.patientName,
      note: p.notes?.[0]?.text || p.therapyType || 'Active patient record',
      lastVisit: p.lastSession || 'Recent',
    }));
  }, [patients]);

  const value = {
    profile,
    slots,
    patients,
    requests,
    allSessions,
    todaysSessions,
    upcomingSessions,
    certifications,
    recentPatients,
    updateProfile,
    addSlot,
    deleteSlot,
    editSlot,
    updateSessionStatus,
    submitSessionReport,
    updatePatientCommunityStatus,
    addPatientSessionHistory,
    acceptSessionRequest,
    rejectSessionRequest,
    setCertifications,
  };

  return <DoctorContext.Provider value={value}>{children}</DoctorContext.Provider>;
};

export const useDoctor = () => {
  const context = useContext(DoctorContext);
  if (!context) {
    throw new Error('useDoctor must be used within a DoctorProvider');
  }
  return context;
};

export default DoctorContext;
