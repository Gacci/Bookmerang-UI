// src/app/constants/subject-constants.ts
export const SUBJECTS = [
  { code: 'BIO', name: 'Biology', weight: 10 }, // Highly popular
  { code: 'PHYS', name: 'Physics', weight: 5 }, // Popular
  { code: 'ACCT', name: 'Accounting', weight: 4 },
  { code: 'ECON', name: 'Economics', weight: 6 },
  { code: 'MATH', name: 'Mathematics', weight: 9 }, // Highly popular
  { code: 'CHEM', name: 'Chemistry', weight: 5 },
  { code: 'ENG', name: 'English', weight: 8 }, // Highly popular
  { code: 'HIST', name: 'History', weight: 3 },
  { code: 'PSYC', name: 'Psychology', weight: 4 },
  { code: 'CS', name: 'Computer Science', weight: 10 }, // Highly popular
  { code: 'SOC', name: 'Sociology', weight: 2 },
  { code: 'PHIL', name: 'Philosophy', weight: 2 },
  { code: 'POLI', name: 'Political Science', weight: 3 },
  { code: 'ART', name: 'Art', weight: 2 },
  { code: 'MUS', name: 'Music', weight: 3 },
  { code: 'BUS', name: 'Business', weight: 4 },
  { code: 'FIN', name: 'Finance', weight: 5 },
  { code: 'MGMT', name: 'Management', weight: 4 },
  { code: 'MARK', name: 'Marketing', weight: 3 },
  { code: 'COMM', name: 'Communications', weight: 3 },
  { code: 'EDU', name: 'Education', weight: 2 },
  { code: 'GEOG', name: 'Geography', weight: 2 },
  { code: 'GEO', name: 'Geology', weight: 1 },
  { code: 'ANTH', name: 'Anthropology', weight: 1 },
  { code: 'ASTR', name: 'Astronomy', weight: 2 },
  { code: 'NURS', name: 'Nursing', weight: 5 },
  { code: 'ENV', name: 'Environmental Science', weight: 3 },
  { code: 'LAW', name: 'Law', weight: 2 },
  { code: 'MED', name: 'Medicine', weight: 10 }, // Highly popular
  { code: 'PHAR', name: 'Pharmacy', weight: 4 },
  { code: 'KINE', name: 'Kinesiology', weight: 2 },
  { code: 'THEA', name: 'Theater', weight: 1 },
  { code: 'LING', name: 'Linguistics', weight: 1 },
  { code: 'FREN', name: 'French', weight: 2 },
  { code: 'SPAN', name: 'Spanish', weight: 3 },
  { code: 'GER', name: 'German', weight: 1 },
  { code: 'ITAL', name: 'Italian', weight: 1 },
  { code: 'CHIN', name: 'Chinese', weight: 1 },
  { code: 'JAPN', name: 'Japanese', weight: 1 },
  { code: 'LAT', name: 'Latin', weight: 1 },
  { code: 'REL', name: 'Religious Studies', weight: 1 },
  { code: 'SOCW', name: 'Social Work', weight: 1 }
];

export const LEVELS = [
  ...Array.from({ length: 99 }).map((v, i) => ({ level: i + 100, weight: 10 })),
  ...Array.from({ length: 99 }).map((v, i) => ({ level: i + 200, weight: 8 })),
  ...Array.from({ length: 99 }).map((v, i) => ({ level: i + 300, weight: 5 })),
  ...Array.from({ length: 99 }).map((v, i) => ({ level: i + 400, weight: 4 })),
  ...Array.from({ length: 99 }).map((v, i) => ({ level: i + 500, weight: 3 })),
  ...Array.from({ length: 99 }).map((v, i) => ({ level: i + 600, weight: 3 })),
  ...Array.from({ length: 99 }).map((v, i) => ({ level: i + 700, weight: 2 })),
  ...Array.from({ length: 99 }).map((v, i) => ({ level: i + 800, weight: 1 })),
  ...Array.from({ length: 99 }).map((v, i) => ({ level: i + 900, weight: 1 }))
];
