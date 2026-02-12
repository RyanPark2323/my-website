export interface Skill {
  name: string;
  icon?: string; // Can add custom icon names later
  proficiency?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
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
      { name: 'Python', proficiency: 'advanced' },
      { name: 'JavaScript/TypeScript', proficiency: 'advanced' },
      { name: 'Java', proficiency: 'advanced' },
      { name: 'C#', proficiency: 'intermediate' },
      { name: 'C++', proficiency: 'intermediate' },
      { name: 'HTML/CSS', proficiency: 'advanced' },
    ]
  },
  {
    category: 'Frontend',
    color: '#34D399', // accent-secondary emerald
    skills: [
      { name: 'React', proficiency: 'advanced' },
      { name: 'React Native', proficiency: 'advanced' },
      { name: 'Tailwind CSS', proficiency: 'advanced' },
      { name: 'Responsive Design', proficiency: 'advanced' },
    ]
  },
  {
    category: 'Backend',
    color: '#8B5CF6', // accent-tertiary purple
    skills: [
      { name: 'Node.js', proficiency: 'advanced' },
      { name: '.NET', proficiency: 'intermediate' },
      { name: 'ASP.NET Core', proficiency: 'intermediate' },
      { name: 'Express', proficiency: 'advanced' },
    ]
  },
  {
    category: 'Cloud & ML',
    color: '#60A5FA',
    skills: [
      { name: 'AWS (S3, SageMaker, Bedrock)', proficiency: 'intermediate' },
      { name: 'Azure', proficiency: 'intermediate' },
      { name: 'PyTorch', proficiency: 'intermediate' },
      { name: 'Machine Learning', proficiency: 'intermediate' },
      { name: 'AI Prompting', proficiency: 'advanced' },
    ]
  },
  {
    category: 'DevOps & Tools',
    color: '#34D399',
    skills: [
      { name: 'Docker', proficiency: 'intermediate' },
      { name: 'GitHub', proficiency: 'advanced' },
      { name: 'CI/CD', proficiency: 'intermediate' },
      { name: 'Agile/Scrum', proficiency: 'advanced' },
    ]
  },
  {
    category: 'Security',
    color: '#8B5CF6',
    skills: [
      { name: 'Secure Coding', proficiency: 'intermediate' },
      { name: 'Penetration Testing', proficiency: 'beginner' },
      { name: 'CSRF Vulnerability Assessment', proficiency: 'intermediate' },
      { name: 'CTF Challenges', proficiency: 'beginner' },
    ]
  }
];

// Get all unique skills as a flat array
export const getAllSkills = (): string[] => {
  return skillsData.flatMap(category => category.skills.map(skill => skill.name));
};

// Get skills by proficiency level
export const getSkillsByProficiency = (level: string): Skill[] => {
  return skillsData
    .flatMap(category => category.skills)
    .filter(skill => skill.proficiency === level);
};
