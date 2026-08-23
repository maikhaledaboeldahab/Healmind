export const upcomingSessions = [
  {
    id: 'ses-201',
    doctorId: 'doc-01',
    doctorName: 'Dr. Sarah Jenkins',
    doctorImage:
      'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200&h=200&fit=crop&crop=faces',
    date: '2026-07-14',
    time: '09:00 AM',
    status: 'Confirmed',
  },
  {
    id: 'ses-202',
    doctorId: 'doc-03',
    doctorName: 'Dr. Elena Rodriguez',
    doctorImage:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=faces',
    date: '2026-07-18',
    time: '02:00 PM',
    status: 'Pending',
  },
];

export const sessionHistory = [
  {
    id: 'ses-190',
    doctorId: 'doc-02',
    doctorName: 'Dr. Marcus Chen',
    date: '2026-06-22',
    time: '11:00 AM',
    status: 'Completed',
  },
  {
    id: 'ses-181',
    doctorId: 'doc-01',
    doctorName: 'Dr. Sarah Jenkins',
    date: '2026-06-10',
    time: '10:00 AM',
    status: 'Completed',
  },
];

export const sessionReport = {
  sessionId: 'ses-190',
  summary:
    'Session focused on identifying stress triggers at work and building a weekly coping routine.',
  notes:
    'Patient reported improved sleep since the last session. Discussed boundary-setting strategies for workplace stress.',
  recommendations: [
    'Practice the 4-7-8 breathing technique before bed.',
    'Continue the daily 10-minute journaling habit.',
    'Schedule a follow-up session in 2 weeks.',
  ],
};
