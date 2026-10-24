import type { SimpleRealm } from '../types';

export const breathOfFreshAir: SimpleRealm = {
  id: 'breath-of-fresh-air',
  kind: 'simple',
  title: 'A Breath of Fresh Air',
  tagline: 'AI-managed cap-and-trade system to reduce Utah air pollution by 1% annually',
  status: 'built',
  order: 3,
  longDescription:
    'Developed during a hackathon, this scalable data-driven solution automates emission tracking, credit allocation, and compliance forecasting using AWS infrastructure and Python-based machine learning models. Earned Honorable Mention for innovative approach to environmental policy.',
  technologies: ['Python', 'AWS S3', 'Snowflake', 'AWS Bedrock', 'AWS SageMaker'],
  highlights: [
    'Designed system targeting 1% annual reduction in air pollution',
    'Leveraged AWS cloud services for scalable ML infrastructure',
    'Earned Honorable Mention at hackathon',
    'Automated emission tracking and compliance forecasting',
  ],
};
