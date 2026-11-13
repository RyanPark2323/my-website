import type { CaseStudy } from '../types';
import dashboard from './dashboard.webp';

export const utahCapAndTrade: CaseStudy = {
  id: 'utah-cap-and-trade',
  kind: 'case-study',
  title: 'Cap and Trade System for Better Air in Utah',
  tagline: "Reducing Utah's air pollution with a cap-and-trade system that shrinks the cap 1% a year.",
  image: dashboard,
  status: 'built',
  order: 2,
  longDescription: [
    "Utah has an air quality problem, and cap and trade is one of the standard tools for it. You set a total cap on emissions, hand out permits up to that cap, let whoever needs more buy them from whoever needs less, and shrink the cap a little every year. The hard part is deciding how many permits each county gets to start with. Salt Lake County has roughly twenty times the population and twenty times the economic output of Iron County, so there's no split that's obviously fair.",
    "So I built a system that makes the call and shows its work. It takes each county's emissions, population, and economic output, normalizes them against the largest county, and combines them under weights that default to 40% emissions and 30% each for population and economic output. That score sets the county's share of a 100,000 permit pool, and the pool shrinks 1% a year. The model is deterministic rather than learned, and that's deliberate. Every allocation comes back with a breakdown of which factor drove it and by how much, so the number can be audited instead of trusted.",
    "The whole thing is built to run as a deployed model rather than a script someone runs once. It's packaged for a SageMaker endpoint, and the policy weights are exposed as model hyperparameters, so changing who the system favors is a configuration change rather than a rewrite. An allocation like this has to run every year on new numbers, for whoever asks, without the people who built it in the loop, and that constraint shaped more of the design than the formula did. It ran on synthetic county data, which is enough to exercise the system but not enough to say anything about real policy.",
  ],
  highlights: [
    "Honorable Mention at the AWS-sponsored A Breath of Fresh Air AI Hackathon, hosted by the University of Utah's One-U Responsible AI Initiative at the Scientific Computing & Imaging Institute — June 2025.",
    'Led the three-person team and built the allocation model, the SageMaker deployment path, and the dashboard.',
    'Exposed the policy weights as model hyperparameters, so changing who the system favors is a configuration change rather than a rewrite.',
  ],
  technologies: ['Python', 'pandas', 'AWS SageMaker', 'JavaScript', 'Chart.js'],
};
