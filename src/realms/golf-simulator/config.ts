import type { SimpleRealm } from '../types';

export const golfSimulator: SimpleRealm = {
  id: 'golf-simulator',
  kind: 'simple',
  title: 'Educational Golf Simulator',
  tagline: 'Physics-based golf course simulator teaching course management strategies',
  status: 'built',
  order: 4,
  longDescription:
    'Developed using C++, Qt, and Box2D Physics Engine to create an interactive educational tool. Implemented realistic physics simulation for club selection, distance control, and terrain navigation while collaborating with a team using Agile/Scrum methodologies.',
  technologies: ['C++', 'Qt', 'Box2D', 'Physics Engine', 'Agile/Scrum'],
  highlights: [
    'Implemented realistic physics simulation with Box2D',
    'Created interactive UI with Qt framework',
    'Collaborated using Agile methodologies (sprints, stand-ups)',
    'Teaches strategic decision-making through gameplay',
  ],
};
