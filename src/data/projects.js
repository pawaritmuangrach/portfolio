// Add new work by appending an object to this array — no other code changes needed.
//
// category: 'Project' | 'Hackathon' | 'Intern' | 'Others'
// cover:    { bg, fg } colors for the generated cover art (used when `images` is empty)
// images:   optional array of image URLs (put files in /public/work/...)
// links:    optional array of { label, url }

export const CATEGORIES = ['Project', 'Hackathon', 'Intern', 'Others']

export const projects = [
  {
    id: 'botnoi-internship',
    title: 'Botnoi',
    category: 'Intern',
    year: '',
    period: '2 months',
    status: 'Completed',
    role: 'Chat Bot & Voice Bot Engineer — Intern',
    summary: 'Two-month internship building chat bots and voice bots.',
    description: [
      'A two-month internship at Botnoi as a chat bot and voice bot engineer.',
      'Details, responsibilities and results will be added here soon.',
    ],
    stack: [],
    highlights: [],
    links: [],
    images: [],
    cover: { bg: '#14110e', fg: '#f6f4ef' },
  },
  {
    id: 'lab-box',
    title: 'Lab Box',
    category: 'Project',
    year: '',
    period: '',
    status: 'Completed',
    role: '',
    summary: 'A school project about sorting and separating chemicals.',
    description: [
      'Lab Box is a school project built around separating and organising chemicals used in school.',
      'More details, photos and the build story will be added here soon.',
    ],
    stack: [],
    highlights: [],
    links: [],
    images: [],
    cover: { bg: '#ff5b1f', fg: '#14110e' },
  },
  {
    id: 'sky-ict',
    title: 'SKY ICT',
    category: 'Hackathon',
    year: '2026',
    period: '',
    status: 'In progress',
    role: '',
    summary: 'Currently competing — results coming soon.',
    description: [
      'SKY ICT is an ongoing competition I’m currently taking part in.',
      'The project, team and final result will be added once the competition ends.',
    ],
    stack: [],
    highlights: [],
    links: [],
    images: [],
    cover: { bg: '#ffd9c7', fg: '#14110e' },
  },
  {
    id: 'kibo',
    title: 'KIBO',
    category: 'Hackathon',
    year: '',
    period: '',
    status: 'Completed',
    role: '',
    summary: 'Hackathon project.',
    description: [
      'A hackathon I took part in.',
      'Project details, team and results will be added here soon.',
    ],
    stack: [],
    highlights: [],
    links: [],
    images: [],
    cover: { bg: '#e8e2d6', fg: '#14110e' },
  },
  {
    id: 'etsy-store',
    title: 'Etsy Store',
    category: 'Others',
    year: '',
    period: '',
    status: 'Live',
    role: 'Owner',
    summary: 'My online store on Etsy.',
    description: [
      'An online store I run on Etsy.',
      'Store link, products and what I learned will be added here soon.',
    ],
    stack: [],
    highlights: [],
    links: [],
    images: [],
    cover: { bg: '#14110e', fg: '#ff5b1f' },
  },
]

export const getProject = (id) => projects.find((p) => p.id === id)
