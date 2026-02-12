export interface Skill {
  name: string;
  icon?: string; // Can add custom icon names later
}

export interface SkillCategory {
  category: string;
  skills: Skill[];
  color: string; // Accent color for the category
}

export const skillsData: SkillCategory[] = [
  {
    category: 'Languages',
    color: '#60A5FA', // accent-primary blue
    skills: [
      { name: 'Python' },
      { name: 'JavaScript/TypeScript' },
      { name: 'Java' },
      { name: 'C#' },
      { name: 'C++' },
      { name: 'HTML/CSS' },
    ]
  },
  {
    category: 'Frontend',
    color: '#34D399', // accent-secondary emerald
    skills: [
      { name: 'React' },
      { name: 'React Native' },
      { name: 'Tailwind CSS' },
      { name: 'Responsive Design' },
    ]
  },
  {
    category: 'Backend',
    color: '#8B5CF6', // accent-tertiary purple
    skills: [
      { name: 'Node.js' },
      { name: '.NET' },
      { name: 'ASP.NET Core' },
      { name: 'Express' },
    ]
  },
  {
    category: 'Cloud & ML',
    color: '#60A5FA',
    skills: [
      { name: 'AWS (S3, SageMaker, Bedrock)' },
      { name: 'Azure' },
      { name: 'PyTorch' },
      { name: 'Machine Learning' },
      { name: 'AI Prompting' },
    ]
  },
  {
    category: 'DevOps & Tools',
    color: '#34D399',
    skills: [
      { name: 'Docker' },
      { name: 'GitHub' },
      { name: 'CI/CD' },
      { name: 'Agile/Scrum' },
    ]
  },
  {
    category: 'Security',
    color: '#8B5CF6',
    skills: [
      { name: 'Secure Coding' },
      { name: 'Penetration Testing' },
      { name: 'CSRF Vulnerability Assessment' },
      { name: 'CTF Challenges' },
    ]
  }
];

// Get all unique skills as a flat array
export const getAllSkills = (): string[] => {
  return skillsData.flatMap(category => category.skills.map(skill => skill.name));
};
