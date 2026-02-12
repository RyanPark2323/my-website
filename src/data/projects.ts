export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  technologies: string[];
  image: string;
  github?: string;
  demo?: string;
  highlights: string[];
}

export const projects: Project[] = [
  {
    id: 'gifthint',
    title: 'Gifthint',
    description: 'Full-stack mobile application with ML-powered personalized gift recommendations',
    longDescription: 'Led the development of a production-ready mobile app using React Native and Node.js. Managed a team of two developers while overseeing architecture decisions, implementing machine learning algorithms for personalized recommendations, and coordinating deployment to App Store readiness.',
    technologies: ['React Native', 'Node.js', 'TypeScript', 'JavaScript', 'Machine Learning'],
    image: '/projects/gifthint-placeholder.jpg', // Replace with actual screenshot
    highlights: [
      'Led team of 2 developers through full development lifecycle',
      'Integrated ML recommendation engine for personalized suggestions',
      'Coordinated UI/UX design, backend infrastructure, and deployment',
      'Achieved App Store readiness with production-grade code quality'
    ]
  },
  {
    id: 'breath-of-fresh-air',
    title: 'A Breath of Fresh Air',
    description: 'AI-managed cap-and-trade system to reduce Utah air pollution by 1% annually',
    longDescription: 'Developed during a hackathon, this scalable data-driven solution automates emission tracking, credit allocation, and compliance forecasting using AWS infrastructure and Python-based machine learning models. Earned Honorable Mention for innovative approach to environmental policy.',
    technologies: ['Python', 'AWS S3', 'Snowflake', 'AWS Bedrock', 'AWS SageMaker'],
    image: '/projects/breath-placeholder.jpg', // Replace with actual screenshot
    github: '', // Add if public
    highlights: [
      'Designed system targeting 1% annual reduction in air pollution',
      'Leveraged AWS cloud services for scalable ML infrastructure',
      'Earned Honorable Mention at hackathon',
      'Automated emission tracking and compliance forecasting'
    ]
  },
  {
    id: 'golf-simulator',
    title: 'Educational Golf Simulator',
    description: 'Physics-based golf course simulator teaching course management strategies',
    longDescription: 'Developed using C++, Qt, and Box2D Physics Engine to create an interactive educational tool. Implemented realistic physics simulation for club selection, distance control, and terrain navigation while collaborating with a team using Agile/Scrum methodologies.',
    technologies: ['C++', 'Qt', 'Box2D', 'Physics Engine', 'Agile/Scrum'],
    image: '/projects/golf-placeholder.jpg', // Replace with actual screenshot
    highlights: [
      'Implemented realistic physics simulation with Box2D',
      'Created interactive UI with Qt framework',
      'Collaborated using Agile methodologies (sprints, stand-ups)',
      'Teaches strategic decision-making through gameplay'
    ]
  }
];

// Helper function to get project by ID
export const getProjectById = (id: string): Project | undefined => {
  return projects.find(project => project.id === id);
};
