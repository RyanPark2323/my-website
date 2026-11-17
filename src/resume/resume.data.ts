import resumePdf from './ryan-park-resume.pdf';

/**
 * The resume, transcribed from the PDF it links to. Kept as data rather than
 * markup so the rendered page and the download stay the same document, and so
 * a layout change never means retyping the content.
 *
 * Project headers are stored as three fields rather than one line, so the page
 * renders them consistently. The PDF's own punctuation between role and stack
 * varies entry to entry; that difference does not survive the transcription.
 */

export const RESUME_PDF = resumePdf;

/** Shown on the page so a stale copy is visible rather than silent. */
export const RESUME_UPDATED = 'November 2026';

export interface ResumeBullet {
  /** A leading label, as on "Awards:" or "GPA:". */
  label?: string;
  text: string;
}

export interface ResumeEntry {
  title: string;
  /** Employer, school, or the role and stack for a project. */
  subtitle: string;
  /** Right-hand column: a location or a date range. */
  meta?: string;
  metaSecondary?: string;
  bullets: ResumeBullet[];
}

export interface ResumeSection {
  heading: string;
  entries: ResumeEntry[];
}

export const resumeHeader = {
  name: 'Ryan Park',
  location: 'Salt Lake City, UT',
  email: 'ryan.park2322@gmail.com',
  linkedin: 'https://www.linkedin.com/in/ryan-park23',
  website: 'https://ryanpark2323.github.io/my-website/',
};

export const resumeSections: ResumeSection[] = [
  {
    heading: 'EDUCATION',
    entries: [
      {
        title: 'Bachelor of Science in Computer Science with an Emphasis in AI',
        subtitle: 'University of Utah',
        meta: 'Salt Lake City, UT',
        metaSecondary: 'Graduated Spring 2026',
        bullets: [
          { label: 'Awards', text: "Presidential Merit Scholar, Hinckley Leadership Scholar, Dean's List" },
          { label: 'Organizations', text: 'Chess Club, Cybersecurity Club' },
          {
            label: 'Relevant Coursework',
            text: 'Introduction to Object Oriented Programming (Java, Python), Data Structures and Algorithms (Java), Computer Organization (MIPS), Software Practice 1 and 2 (C# and C++), Foundations of Data Analysis (Python), Computational Computing, Operating Systems, Databases, Computer Security, Practical Machine Learning, Artificial Intelligence, Advanced Artificial Intelligence',
          },
        ],
      },
      {
        title: 'Associate of Science in General Studies with High Honors',
        subtitle: 'Weber State University',
        meta: 'Ogden, UT',
        metaSecondary: 'Graduated Spring 2022',
        bullets: [
          { label: 'GPA', text: '4.0' },
          { label: 'Organizations', text: 'Chess Club' },
          {
            label: 'Relevant Coursework',
            text: 'Foundations of Computing (Python), Intro to Computer Applications (Python)',
          },
        ],
      },
    ],
  },
  {
    heading: 'EXPERIENCE',
    entries: [
      {
        title: 'Technical Business Analyst, Product Support Specialist',
        subtitle: 'University of Utah, Vice President of Research',
        meta: 'Salt Lake City, Utah',
        metaSecondary: 'May 2026 – Present',
        bullets: [
          {
            text: 'Serve as technical business analyst and product support specialist, assisting in the design and support of ERICA, BRR, EMMA, and other research compliance applications used by over 10,000 researchers, reviewers, and administrators across the country.',
          },
          {
            text: 'Turn stakeholder needs into clear specs for developers, then see them through testing, training, and deployment',
          },
          {
            text: 'Bridge users and engineering: resolve tier-two issues and escalate defects through ServiceNow',
          },
        ],
      },
      {
        title: 'IT Support Intern',
        subtitle: 'University of Utah, Vice President of Research',
        meta: 'Salt Lake City, Utah',
        metaSecondary: 'May 2025 – May 2026',
        bullets: [
          {
            text: 'Delivered daily tech support, resolving hardware/software issues, and user access problems for over 250 users and multiple departments',
          },
          {
            text: 'Leveraged Microsoft Intune to automate patch management, device remediation, and software upgrades on user endpoints',
          },
          {
            text: 'Conducted security assessments of the VPR digital assets, identified and remediated a CSRF vulnerability',
          },
          { text: 'Remediated vulnerabilities across 10+ Windows servers to improve security posture' },
          {
            text: 'Co-authored SOP for international loaner laptops to strengthen cybersecurity policy',
          },
        ],
      },
    ],
  },
  {
    heading: 'TECHNICAL PROJECTS',
    entries: [
      {
        title: 'Deadline (Capstone Project)',
        subtitle: 'Lead Developer · Next.js, TypeScript, React, Supabase, OpenAI, Git',
        bullets: [
          {
            text: 'Architected and developed a full-stack academic deadline management web app with Google Calendar integration for scheduling conflict detection and personalized study recommendations',
          },
          {
            text: 'Built a Supabase/PostgreSQL backend with row-level security, user authentication, and middleware-enforced onboarding to gate access until profile setup was complete',
          },
          {
            text: 'Designed and implemented a semantic routing layer to resolve hallucination issues by routing each query to a purpose-built task-specific prompt',
          },
          { text: 'Collaborated with a cross-functional team to ship iterative features' },
        ],
      },
      {
        title: 'Evaluator Stress Test (EST) Framework',
        subtitle: 'Developer · Python, MuJoCo, Reinforcement Learning',
        bullets: [
          {
            text: 'Engineered a pre-training diagnostic framework that stress-tests RL reward functions by using Bayesian Optimization to systematically search for environment configurations where a reward function scores highly despite zero actual task progress',
          },
          {
            text: "Designed a normalized Robustness Score (0–1) that quantifies each reward function's resistance to adversarial physics perturbations across gravity, friction, and joint damping parameters, enabling researchers to rank and filter candidates before committing to expensive training runs",
          },
          {
            text: 'Validated the framework on the MuJoCo Shadow Hand dexterous manipulation task, targeting LLM-generated reward pipelines such as EUREKA to complete the loop from AI-assisted reward generation to AI-validated reward selection',
          },
        ],
      },
      {
        title: 'A Breath of Fresh Air Hackathon',
        subtitle: 'Developer · Python, AWS',
        bullets: [
          {
            text: 'Led a three-person team to an Honorable Mention, designing a permit allocation model that distributes a fixed pool of emissions credits across Utah counties by weighting emissions, population, and economic output against a cap that contracts 1% annually',
          },
          {
            text: 'Packaged the model for AWS SageMaker with the policy weights exposed as training-job hyperparameters, so retuning who the allocation favors becomes a configuration change rather than a rewrite',
          },
          {
            text: 'Built an interactive dashboard that recomputes allocations and per-capita distribution as the weights move, and returned a per-county breakdown of which factor drove each allocation so the result can be audited',
          },
        ],
      },
      {
        title: 'Spider-Trap for Malicious Web Crawlers',
        subtitle: 'Developer · Python, HTML/CSS, Web Security',
        bullets: [
          {
            text: 'Developed a defensive spider-trap targeting web crawlers that ignore robots.txt, trapping them in an infinite recursive link loop that wastes crawler resources without affecting legitimate users',
          },
          {
            text: 'Designed the honeypot link structure so that compliant bots following robots.txt directives are never exposed to the trap, ensuring the tool only ensnares non-compliant crawlers',
          },
          {
            text: 'Strengthened web application security through a passive, low-overhead defense mechanism requiring no IP handling or external dependencies',
          },
        ],
      },
      {
        title: 'Capture the Flag Challenges',
        subtitle: 'CyberSecurity · TryHackMe, Hack the Box, PicoCTF',
        bullets: [
          {
            text: 'Exploring web application security through courses on TryHackMe, information security fundamentals on Hack the Box, and overall CTF knowledge with PicoCTF',
          },
          {
            text: 'Learning foundational concepts in penetration testing, vulnerability analysis, and secure coding practices',
          },
          { text: 'Building a strong base in cybersecurity through hands-on challenges and guided exercises' },
        ],
      },
    ],
  },
];
