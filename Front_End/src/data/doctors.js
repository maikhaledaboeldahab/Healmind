export const specialties = [
  'All',
  'Anxiety',
  'Depression',
  'Relationship',
  'CBT',
  'Mindfulness',
  'Family Counseling',
];

export const doctors = [
  {
    id: 'doc-01',
    name: 'Dr. Sarah Jenkins',
    specialization: 'Clinical Psychologist',
    tags: ['Anxiety', 'Depression'],
    rating: 4.9,
    experience: 12,
    fee: 45,
    verified: true,
    image:
      'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=500&h=500&fit=crop&crop=faces',
    about:
      'Dr. Sarah Jenkins helps patients navigate anxiety and mood disorders using evidence-based, compassionate care tailored to each person\u2019s life circumstances.',
    stats: { patients: 480, sessions: 2100, yearsActive: 12 },
  },
  {
    id: 'doc-02',
    name: 'Dr. Marcus Chen',
    specialization: 'Psychiatrist & Therapist',
    tags: ['Depression', 'CBT'],
    rating: 4.8,
    experience: 15,
    fee: 60,
    verified: true,
    image:
      'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=500&h=500&fit=crop&crop=faces',
    about:
      'Dr. Marcus Chen combines psychiatric care with structured therapy to support long-term mental wellness for adults facing depression and burnout.',
    stats: { patients: 610, sessions: 3400, yearsActive: 15 },
  },
  {
    id: 'doc-03',
    name: 'Dr. Elena Rodriguez',
    specialization: 'CBT Specialist',
    tags: ['CBT', 'Anxiety'],
    rating: 5.0,
    experience: 8,
    fee: 40,
    verified: true,
    image:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&h=500&fit=crop&crop=faces',
    about:
      'Dr. Elena Rodriguez specializes in Cognitive Behavioral Therapy, guiding patients to reframe unhelpful thought patterns with practical tools.',
    stats: { patients: 320, sessions: 1500, yearsActive: 8 },
  },
  {
    id: 'doc-04',
    name: 'Dr. Julian Thorne',
    specialization: 'Anxiety Specialist',
    tags: ['Anxiety'],
    rating: 4.7,
    experience: 10,
    fee: 42,
    verified: true,
    image:
      'https://images.unsplash.com/photo-1615109398623-88346a601842?w=500&h=500&fit=crop&crop=faces',
    about:
      'Dr. Julian Thorne focuses on anxiety and panic disorders, blending mindfulness techniques with structured exposure-based approaches.',
    stats: { patients: 275, sessions: 1180, yearsActive: 10 },
  },
  {
    id: 'doc-05',
    name: 'Dr. Amara Okafor',
    specialization: 'Family Counselor',
    tags: ['Relationship', 'Family Counseling'],
    rating: 4.9,
    experience: 14,
    fee: 50,
    verified: true,
    image:
      'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=500&h=500&fit=crop&crop=faces&flip=h',
    about:
      'Dr. Amara Okafor works with individuals and families to strengthen communication and resolve relationship conflict in a safe, guided space.',
    stats: { patients: 390, sessions: 1950, yearsActive: 14 },
  },
  {
    id: 'doc-06',
    name: "Dr. Liam O'Connell",
    specialization: 'Mindfulness Coach',
    tags: ['Mindfulness', 'Anxiety'],
    rating: 4.9,
    experience: 9,
    fee: 38,
    verified: true,
    image:
      'https://images.unsplash.com/photo-1637059824899-a441006a6875?w=500&h=500&fit=crop&crop=faces',
    about:
      'Dr. Liam O\u2019Connell teaches mindfulness-based stress reduction techniques to help patients build lasting calm and resilience.',
    stats: { patients: 210, sessions: 900, yearsActive: 9 },
  },
];

export const getDoctorById = (id) => doctors.find((doc) => doc.id === id);

export const getAvailableSlots = () => [
  {
    date: '2026-07-14',
    label: 'Tue, Jul 14',
    slots: ['09:00 AM', '10:30 AM', '02:00 PM', '04:30 PM'],
  },
  {
    date: '2026-07-15',
    label: 'Wed, Jul 15',
    slots: ['11:00 AM', '01:00 PM', '03:30 PM'],
  },
  {
    date: '2026-07-16',
    label: 'Thu, Jul 16',
    slots: ['09:30 AM', '12:00 PM', '05:00 PM'],
  },
];
