import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import api from '../../../shared/services/api';

const DoctorContext = createContext(null);

const INITIAL_PATIENTS = [
  {
    id: 1,
    patientName: 'Arlo Sterling',
    age: 29,
    gender: 'Male',
    phone: '+20 100 123 4567',
    email: 'arlo.sterling@email.com',
    therapyType: 'Cognitive Behavioral Therapy',
    status: 'Approved',
    communityStatus: 'Approved',
    patientSince: 'Jan 2023',
    lastSession: 'Today, 10:30 AM',
    diagnosis: 'Generalized Anxiety Disorder with mild depressive episodes. Responding well to weekly CBT grounding techniques.',
    notes: [
      { id: 1, date: 'Oct 24, 2023', text: 'Patient reports improved sleep patterns. Continuing current treatment plan.' },
      { id: 2, date: 'Oct 10, 2023', text: 'Discussed coping strategies for work-related stress triggers.' },
    ],
    nextSession: {
      date: 'In 3 days',
      title: 'Reviewing Anxiety Triggers',
      goal: 'Goal: Finalize the list of environmental stressors and practice Level 2 grounding.',
      isLive: false,
    },
    pastSessions: [
      { id: 101, date: 'Oct 12, 2023', duration: '45 minutes', title: 'Introduction to Breathwork', summary: 'Successful identification of physiological precursors to panic episodes. Arlo responded well to box breathing.' },
      { id: 102, date: 'Sep 28, 2023', duration: '50 minutes', title: 'Initial Assessment', summary: 'First session — established baseline anxiety triggers and treatment goals.' },
    ],
  },
  {
    id: 2,
    patientName: 'Sarah Jenkins',
    age: 28,
    gender: 'Female',
    phone: '+20 101 234 5678',
    email: 'sarah.j@example.com',
    therapyType: 'Weekly Therapy • Anxiety Management',
    status: 'Approved',
    communityStatus: 'Approved',
    patientSince: 'Mar 2023',
    lastSession: 'Yesterday, 4:30 PM',
    diagnosis: 'Mild Social Anxiety and Performance Apprehension. Practicing assertive communication skills.',
    notes: [
      { id: 1, date: 'Oct 20, 2023', text: 'Notable reduction in panic spikes before team meetings.' },
    ],
    nextSession: {
      date: 'Tomorrow, 09:00 AM',
      title: 'Grounding & Boundary Setting',
      goal: 'Goal: Review workplace communication logs.',
      isLive: false,
    },
    pastSessions: [
      { id: 201, date: 'Oct 15, 2023', duration: '50 minutes', title: 'Weekly Therapy', summary: 'Patient reported notable reduction in stress.' },
    ],
  },
  {
    id: 3,
    patientName: 'Evelyn Thorne',
    age: 64,
    gender: 'Female',
    phone: '+20 102 345 6789',
    email: 'evelyn.t@example.com',
    therapyType: 'Grief Counseling',
    status: 'Pending',
    communityStatus: 'Pending',
    patientSince: 'Jun 2023',
    lastSession: 'Oct 21, 2023',
    diagnosis: 'Complicated Bereavement Support. Ongoing emotional processing sessions.',
    notes: [
      { id: 1, date: 'Oct 21, 2023', text: 'Patient expressed readiness to start gentle social activities.' },
    ],
    nextSession: {
      date: 'Next Week',
      title: 'Emotional Integration',
      goal: 'Goal: Structured reflection exercises.',
      isLive: false,
    },
    pastSessions: [
      { id: 301, date: 'Oct 07, 2023', duration: '40 minutes', title: 'Grief Counseling Follow-up', summary: 'Explored legacy memory books.' },
    ],
  },
  {
    id: 4,
    patientName: 'Marcus Vane',
    age: 42,
    gender: 'Male',
    phone: '+20 103 456 7890',
    email: 'marcus.v@example.com',
    therapyType: 'Mindfulness Training',
    status: 'Needs Another Session',
    communityStatus: 'Rejected',
    patientSince: 'Aug 2023',
    lastSession: 'Oct 19, 2023',
    diagnosis: 'Occupational Burnout Syndrome. Mindfulness and sleep hygiene restructuring.',
    notes: [
      { id: 1, date: 'Oct 19, 2023', text: 'Workload remains heavy; scheduled extra check-in session.' },
    ],
    nextSession: null,
    pastSessions: [
      { id: 401, date: 'Oct 05, 2023', duration: '45 minutes', title: 'Mindfulness Basics', summary: 'Introduced progressive muscle relaxation.' },
    ],
  },
];

const INITIAL_REQUESTS = [
  { id: 1, patientName: 'Nora Sami', age: 31, gender: 'Female', requestedDate: 'Tomorrow', requestedTime: '01:00 PM', message: 'I have been struggling with sleep and constant worry about work. I would like to talk through some coping strategies.', status: 'pending', therapyType: 'Stress Management' },
  { id: 2, patientName: 'Omar Khalil', age: 35, gender: 'Male', requestedDate: 'In 2 days', requestedTime: '10:00 AM', message: 'First-time session — looking for support with managing stress after a recent job change.', status: 'pending', therapyType: 'Anxiety Management' },
];

const INITIAL_TODAY_SESSIONS = [
  { id: 1, time: '09:00 AM', duration: '50 mins', patientName: 'Sarah Jenkins', sessionType: 'Weekly Therapy • Anxiety Management', status: 'Confirmed', sessionId: 'ses-101' },
  { id: 2, time: '10:30 AM', duration: '40 mins', patientName: 'Arlo Sterling', sessionType: 'Cognitive Behavioral Therapy', status: 'Confirmed', sessionId: 'ses-102' },
  { id: 3, time: '01:45 PM', duration: '45 mins', patientName: 'Evelyn Thorne', sessionType: 'Grief Counseling', status: 'Pending', sessionId: 'ses-103' },
];

const INITIAL_UPCOMING_SESSIONS = [
  { id: 4, time: '09:30 AM', duration: '50 mins', patientName: 'Marcus Vane', sessionType: 'Mindfulness Training', status: 'Confirmed', sessionId: 'ses-104' },
  { id: 5, time: '12:00 PM', duration: '45 mins', patientName: 'Layla Hassan', sessionType: 'Follow-up • Anxiety Management', status: 'Confirmed', sessionId: 'ses-105' },
];

const INITIAL_CERTIFICATIONS = [
  {
    id: 1,
    name: 'Board Certified Clinical Psychologist',
    issueDate: 'March 2018',
    docId: 'BCP-9920-EG',
    issuer: 'Egyptian Board of Psychology & Mental Health',
    fileUrl: 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?w=800&auto=format&fit=crop&q=80',
    fileName: 'Board_Certification_Farah.pdf',
    type: 'pdf',
  },
  {
    id: 2,
    name: 'Cognitive Behavioral Therapy (CBT) Master Specialist',
    issueDate: 'June 2021',
    docId: 'CBT-4412-INTL',
    issuer: 'International Institute of Cognitive Therapy',
    fileUrl: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=800&auto=format&fit=crop&q=80',
    fileName: 'CBT_Master_Certificate.pdf',
    type: 'pdf',
  },
];

export const DoctorProvider = ({ children }) => {
  const [patients, setPatients] = useState(() => {
    const saved = localStorage.getItem('healmind_doctor_patients');
    return saved ? JSON.parse(saved) : INITIAL_PATIENTS;
  });

  const [requests, setRequests] = useState(() => {
    const saved = localStorage.getItem('healmind_doctor_requests');
    return saved ? JSON.parse(saved) : INITIAL_REQUESTS;
  });

  const [todaysSessions, setTodaysSessions] = useState(INITIAL_TODAY_SESSIONS);
  const [upcomingSessions, setUpcomingSessions] = useState(INITIAL_UPCOMING_SESSIONS);
  const [certifications, setCertifications] = useState(INITIAL_CERTIFICATIONS);

  // Fetch real data from Backend if available
  useEffect(() => {
    let isMounted = true;
    async function fetchDoctorData() {
      try {
        const [patientsRes, sessionsRes] = await Promise.allSettled([
          api.get('/doctor/my-patients'),
          api.get('/session/doctor/my-sessions'),
        ]);

        if (isMounted && patientsRes.status === 'fulfilled' && patientsRes.value.data) {
          const livePatients = patientsRes.value.data.patients || patientsRes.value.data.data;
          if (Array.isArray(livePatients) && livePatients.length > 0) {
            setPatients(livePatients);
          }
        }

        if (isMounted && sessionsRes.status === 'fulfilled' && sessionsRes.value.data) {
          const liveSessions = sessionsRes.value.data.sessions || sessionsRes.value.data.data;
          if (Array.isArray(liveSessions)) {
            setTodaysSessions(liveSessions.filter((s) => s.isToday));
            setUpcomingSessions(liveSessions.filter((s) => !s.isToday));
          }
        }
      } catch {
        // Maintain fallback states
      }
    }
    fetchDoctorData();
    return () => { isMounted = false; };
  }, []);

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
  const acceptSessionRequest = (requestId) => {
    const targetRequest = requests.find((r) => r.id === requestId);
    if (!targetRequest) return;

    // 1. Mark request as accepted
    setRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'accepted' } : r))
    );

    // 2. Add to upcoming sessions
    const newSession = {
      id: Date.now(),
      time: targetRequest.requestedTime || '11:00 AM',
      duration: '45 mins',
      patientName: targetRequest.patientName,
      sessionType: targetRequest.therapyType || 'Clinical Session',
      status: 'Confirmed',
      sessionId: `ses-${Date.now()}`,
    };
    setTodaysSessions((prev) => [newSession, ...prev]);

    // 3. Add / update patient in the patients directory
    setPatients((prev) => {
      const exists = prev.find((p) => p.patientName.toLowerCase() === targetRequest.patientName.toLowerCase());
      if (exists) {
        return prev.map((p) =>
          p.patientName.toLowerCase() === targetRequest.patientName.toLowerCase()
            ? { ...p, status: 'Approved', communityStatus: p.communityStatus || 'Approved' }
            : p
        );
      }

      const newPatient = {
        id: Date.now(),
        patientName: targetRequest.patientName,
        age: targetRequest.age || 30,
        gender: targetRequest.gender || 'Female',
        phone: '+20 100 000 0000',
        email: `${targetRequest.patientName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
        therapyType: targetRequest.therapyType || 'Clinical Therapy',
        status: 'Approved',
        communityStatus: 'Approved',
        patientSince: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        lastSession: 'Session Scheduled',
        diagnosis: targetRequest.message || 'New intake session scheduled.',
        notes: [
          {
            id: 1,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            text: `Intake Request Message: "${targetRequest.message}"`,
          },
        ],
        nextSession: {
          date: targetRequest.requestedDate,
          title: `${targetRequest.therapyType || 'Therapy'} Intake`,
          goal: 'Initial clinical assessment & goal setting.',
          isLive: false,
        },
        pastSessions: [],
      };

      return [newPatient, ...prev];
    });
  };

  // Reject a session request
  const rejectSessionRequest = (requestId) => {
    setRequests((prev) => prev.filter((r) => r.id !== requestId));
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
    patients,
    requests,
    todaysSessions,
    upcomingSessions,
    certifications,
    recentPatients,
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
