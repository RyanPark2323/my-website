import React, { useState, useEffect, useRef } from 'react';
import { projectsData } from '../data/projectsdata';
import { timelineData } from '../data/timelineData';

const HomePage = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const historyRef = useRef(null);
  const inputRef = useRef(null);

  const asciiHeader = `
 ____                     ____            _    
|  _ \\ _   _  __ _ _ __  |  _ \\ __ _ _ __| | __
| |_) | | | |/ _\` | '_ \\ | |_) / _\` | '__| |/ /
|  _ <| |_| | (_| | | | ||  __/ (_| | |  |   < 
|_| \\_\\\\__, |\\__,_|_| |_||_|   \\__,_|_|  |_|\\_\\
       |___/                                    
      `;

  useEffect(() => {
    const welcomeMessage = [
      { type: 'output', content: 'Welcome to Ryan Park\'s Portfolio v2.0' },
      { type: 'output', content: 'Type \'help\' for available commands.' },
      { type: 'output', content: '' }
    ];
    setHistory(welcomeMessage);
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, [history]);

  useEffect(() => {
    // Focus on input
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const commands = {
    help: () => [
      { type: 'output', content: `Available commands:
        about          - Learn about me
        skills         - View my technical skills
        projects       - Browse my projects
        project &lt;num&gt;  - View specific project details
        experience     - Show work/education timeline
        exp &lt;num&gt;      - View specific experience details
        contact        - Get in touch
        resume         - Download my resume
        clear          - Clear terminal
        matrix         - Toggle matrix rain effect
        pwd            - Show current directory
        date           - Display current date/time
        echo &lt;text&gt;    - Echo text back

        Use help and clear to navigate, even if used already` 
      }
    ],

    about: () => [
      { type: 'output', content: `
┌─ ABOUT ME ─────────────────────────────────────┐
│ Name:       Ryan Park                          │
│ Role:       Computer Science Student           │
│ Focus:      AI, Cybersecurity, Web Development │
│ Location:   Salt Lake City, Utah               │
│                                                │
│ I'm passionate about innovative soulutions     │
│ at the intersection of cybersecurity and       │
│ next-gen tech like AI and Quantum Computing.   │
│                                                │
│ I am currently pursuing my BS in CS with an    │
│ emphasis in AI at the University of Utah,      │
│ expected to graduate in Spring 2026. I also    │
│ work as an IT support intern for the VPR at    │
│ the U of U.                                    │
│                                                │
│ When not working or learning, you'll find me:  │
│ - Solving CTF challenges                       │
│ - At the gym                                   │
│ - Reading sci-fi (currently: Dune series)      │
└────────────────────────────────────────────────┘` }
    ],

    skills: () => [
      { type: 'output', content: `
┌─ TECHNICAL SKILLS ────────────────────────────────┐
│                                                   │
│ Languages                                         │
│ ─────────                                         │
│ Python • Java • JavaScript • Typescript • C++     │
│ C# • Java • SQL                                   │
│                                                   │
│ Web Development                                   │
│ ───────────────                                   │
│ React • Node.js • HTML/CSS • Tailwind CSS         │
│ REST APIs • SupaBase • Vercel • Expo              │
│                                                   │
│ Tools & Technologies                              │
│ ────────────────────                              │
│ Git • Docker • Linux • VS Code • AI Tools         │
│ Qt Creator • .NET                                 │
│                                                   │
│ AI & Machine Learning                             │
│ ─────────────────────                             │
│ TensorFlow • Neural Networks • Data Analysis      │
│ Machine Learning Algorithms                       │
│                                                   │
│ Cybersecurity                                     │
│ ─────────────                                     │
│ Penetration Testing • CTF Challenges              │
│ Network Security • Cryptography                   │
│                                                   │
│ IT                                                │
│ ─────────────────────                             │
│ Qualys • Server Maintence • SOP • Intune          │
│ Endpoint Management                               │
└───────────────────────────────────────────────────┘` }
    ],

    projects: () => {
      const projectList = projectsData.map((project, index) => 
        `  ${index + 1}. ${project.title.padEnd(40)} - ${project.brief}`
      ).join('\n');

      return [
        { type: 'output', content: 'Loading projects...' },
        { type: 'output', content: `\nUse 'project <number>' to view details:\n\n${projectList}` }
      ];
    },

    experience: () => [
      { type: 'output', content: `
┌─ EXPERIENCE LOG ────────────────────────────────┐
│                                                 │
│ $ git log --oneline --graph --all               │
│                                                 │
│ * 1. [2026]     B.S. Computer Science           │
│ |               University of Utah              │
│ |                                               │
│ * 2. [2025]     Hinckley Leadership Scholar     │
│ |               University of Utah              │
│ |                                               │
│ * 3. [2024]     Dean's List                     │
│ |               Spring 2024                     │
│ |                                               │
│ * 4. [2023-24]  STEM Tutor                      │
│ |               U of U REFUGEES Program         │
│ |                                               │
│ * 5. [2023]     Intro to CS Teacher             │
│ |               Local High School               │
│ |                                               │
│ * 6. [2022]     Started University of Utah      │
│ |               Presidential Scholar            │
│ |                                               │
│ * 7. [2026]     Graduated High School           │
│ |               Boneville High School           │
│ |                                               │
│ * 8. [2022]     Associates Degree               │
│ |               Weber State University          │
│ |                                               │
│ * 9. [2021]     State Debate Champion           │
│ |               Public Forum Debate             │
│ |                                               │
│ * 10. [2004]    System Initialization           │
│                 Born in Murray, Utah            │
│                                                 │
│ Use 'exp <number>' for details                  │
└─────────────────────────────────────────────────┘` }
    ],

    contact: () => [
      { type: 'output', content: `
┌─ CONTACT ────────────────────────────────────┐
│                                              │
│ Email:      ryan.park2322@gmail.com          │
│ LinkedIn:   <a href="https://linkedin.com/in/ryan-park23" target="_blank" style="color: #00ff00; text-decoration: underline;">linkedin.com/in/ryan-park23</a>      │
│ GitHub:     <a href="https://github.com/RyanPark2323" target="_blank" style="color: #00ff00; text-decoration: underline;">github.com/RyanPark2323</a>          │
│                                              │
│ Preferred method: Email                      │
└──────────────────────────────────────────────┘` }
    ],

    resume: () => {
      // Create a temporary link element to trigger download
      const link = document.createElement('a');
      link.href = '/assets/Ryan Park - Resume.pdf';
      link.download = 'Ryan_Park_Resume.pdf';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      return [
        { type: 'output', content: 'Downloading resume...' },
        { type: 'output', content: 'Resume download started. Check your downloads folder.' }
      ];
    },

    clear: () => {
      // Return a special clear command
      return [{ type: 'clear' }];
    },

    matrix: () => {
      document.body.classList.toggle('matrix-mode');
      const isActive = document.body.classList.contains('matrix-mode');
      
      if (isActive) {
        // Create digital rain effect
        const canvas = document.createElement('canvas');
        canvas.id = 'matrix-canvas';
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '999';
        canvas.style.opacity = '0.1';
        document.body.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
        const matrixArray = matrix.split("");
        const fontSize = 10;
        const columns = canvas.width / fontSize;
        const drops = [];
        
        for(let x = 0; x < columns; x++) {
          drops[x] = 1;
        }
        
        const draw = () => {
          ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          ctx.fillStyle = '#0F0';
          ctx.font = fontSize + 'px monospace';
          
          for(let i = 0; i < drops.length; i++) {
            const text = matrixArray[Math.floor(Math.random() * matrixArray.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            if(drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
              drops[i] = 0;
            }
            drops[i]++;
          }
        };
        
        window.matrixInterval = setInterval(draw, 35);
        
        return [
          { type: 'output', content: '> MATRIX MODE ACTIVATED' },
        ];
      } else {
        // Remove matrix effect
        const canvas = document.getElementById('matrix-canvas');
        if (canvas) {
          canvas.remove();
        }
        if (window.matrixInterval) {
          clearInterval(window.matrixInterval);
        }
        
        return [
          { type: 'output', content: '> Returning to reality...' },
          { type: 'output', content: '> Matrix mode deactivated' }
        ];
      }
    },

    whoami: () => [
      { type: 'output', content: 'a cool person' }
    ],

    ls: () => [
      { type: 'output', content: `about.txt    contact.txt    experience.txt    projects/    skills.txt    resume.pdf` }
    ],

    pwd: () => [
      { type: 'output', content: '/home/ryan/portfolio' }
    ],

    date: () => [
      { type: 'output', content: new Date().toString() }
    ],

    echo: (args) => [
      { type: 'output', content: args }
    ]
  };

  // Add individual experience commands
  commands['exp 1'] = () => [
  { type: 'output', content: `
┌─ B.S. COMPUTER SCIENCE ─────────────────────────────┐
│ Date:       2026 (Expected)                         │
│ Location:   Salt Lake City                          │
│                                                     │
│ Description:                                        │
│ Currently pursuing Bachelor of Science in Computer  │
│ Science at the University of Utah with an emphasis  │
│ in Artificial Intelligence. Maintaining strong      │
│ academic performance while engaging in various      │
│ projects and extracurricular activities.            │
│                                                     │
│ Key Highlights:                                     │
│ • AI/ML Emphasis Track                              │
│ • Expected Graduation: Spring 2026                  │
│ • Relevant Coursework: Data Structures,             │
│   Algorithms, Machine Learning, Cybersecurity       │
└─────────────────────────────────────────────────────┘` }
];
commands['exp 2'] = () => [
  { type: 'output', content: `
┌─ Hinckley Leadership Scholar ───────────────────────┐
│ Date:       2025                                    │
│ Location:   Salt Lake City                          │
│                                                     │
│ Description:                                        │
│ Selected for the Hinckley Leadership Scholarship    │
│ which helps students with their ongoing commitment  │
│ to active citizenship and public service.           │
│                                                     │
│ Key Highlights:                                     │
│ • Community Support and Leadership                  │
│ • Academic and Community Excellence                 │
│                                                     │
└─────────────────────────────────────────────────────┘` }
];
commands['exp 3'] = () => [
  { type: 'output', content: `
┌─ Dean's List ───────────────────────────────────────┐
│ Date:       2024                                    │
│ Location:   Salt Lake City                          │
│                                                     │
│ Description:                                        │
│ Recognized for outstanding academic performance     │
│ during the Spring 2024 semester. This achievement   │
│ reflects consistent dedication to academic          │
│ excellence while balancing multiple projects and    │
│ responsibilities.                                   │
│                                                     │
│ Key Highlights:                                     │
│ • Excellent Academic Performance                    │
│ • Maintenence of GPA while working on side projects │
└─────────────────────────────────────────────────────┘`}
];
commands['exp 4'] = () => [
  { type: 'output', content: `
┌─ STEM Tutor ────────────────────────────────────────┐
│ Date:       2023 - 2024                             │
│ Location:   Salt Lake City                          │
│                                                     │
│ Description:                                        │
│ Served as a STEM Tutor for the University of Utah's │
│ REFUGEES program, helping refugee children catch up │
│ academically and adapt to the U.S. education system.│
│ Focused on mathematics, science, and basic computer │
│ skills.                                             │
│                                                     │
│ Key Highlights:                                     │
│ • Worked with Refugee Children to give them the     │
│   best academic experience possible                 │
│ • Tutored in CS, Math, and Science                  │
│ • Raised Class Average GPA by 0.2 points            │
└─────────────────────────────────────────────────────┘`}
];
commands['exp 5'] = () => [
  { type: 'output', content: `
┌─ Intro to CS Teacher ───────────────────────────────┐
│ Date:       2023                                    │
│ Location:   Salt Lake City                          │
│                                                     │
│ Description:                                        │
│ Taught Introduction to Computer Science as an       │
│ elective course at the Salt Lake Center for Science │
│ Education using the Minecraft Education Platform.   │
│ Made programming concepts accessible and engaging   │
│ for students with no prior coding experience.       │
│                                                     │
│ Key Highlights:                                     │
│ • Designed curriculum using Minecraft Education     │
│ • Taught basic programming concepts                 │
│ • 8 students obtained their official programming    │
│   certification                                     │
└─────────────────────────────────────────────────────┘`}
];
commands['exp 6'] = () => [
  { type: 'output', content: `
┌─ Started CS Degree at the University of Utah ───────┐
│ Date:       2022                                    │
│ Location:   Salt Lake City                          │
│                                                     │
│ Description:                                        │
│ Began my journey at the University of Utah as a     │
│ Computer Science major. Awarded the Presidential    │
│ Merit Scholarship for academic excellence and       │
│ leadership potential.                               │
│                                                     │
│ Key Highlights:                                     │
│ • AI/ML Emphasis Track                              │
│ • Presidential Scholarship Recipient                │
│ • Joined the Chess Club                             │
└─────────────────────────────────────────────────────┘` }
];
commands['exp 7'] = () => [
  { type: 'output', content: `
┌─ Graduated From High School ────────────────────────┐
│ Date:       2022                                    │
│ Location:   Washington Terrace, U                   │
│                                                     │
│ Description:                                        │
│ Graduated from Bonneville High School with a 3.95   │
│ GPA. Founded the Bonneville High School Chess Club. │
│ Was a 3 sport varsity athlete in football, track,   │
│ and wrestling. I also received the Academic         │
│ All-State award for academic excellence. Was the    │
│ 2021 Utah Public Forum Debate State Champion and a  │
│ National Qualifier for the National HOSA            │
│ competition in Biomedical Debate.                   │
│                                                     │
│ Key Highlights:                                     │
│ • 3 Sport Varsity Athlete                           │
│ • Academic All State                                │
│ • 2022 Utah Debate Champion                         │
│ • Founder of the Bonneville Highschool Chess Club   │
└─────────────────────────────────────────────────────┘` }
];
commands['exp 8'] = () => [
  { type: 'output', content: `
┌─ Associates of Science in General Studies with High Honors─┐
│ Date:       2022                                           │
│ Location:   Ogden, UT                                      │
│                                                            │
│ Description:                                               │
│ Graduated from Weber State University with an Associate of │
│ Science in General Studies, achieving a perfect 4.0 GPA.   │
│ Completed degree while still in high school through        │
│ concurrent enrollment.                                     │
│                                                            │
│ Key Highlights:                                            │
│ • Graduated with a 4.0 and High Honors                     │
│ • Emphasis in STEM and CS fundamentals and principles      │
└────────────────────────────────────────────────────────────┘` }
];
commands['exp 9'] = () => [
  { type: 'output', content: `
┌─ State Debate Champion ─────────────────────────────┐
│ Date:       2021                                    │
│ Location:   Washington Terrace, UT                  │
│                                                     │
│ Description:                                        │
│ Utah 2021 Public Forum State Debate Champion.       │
│ This experience honed critical thinking, public     │
│ speaking, and argumentation skills that translate   │
│ directly to technical presentations and team        │
│ collaboration.                                      │
│                                                     │
│ Key Highlights:                                     │
│ • Debate Champion                                   │
│ • Development of strong communication skills        │
└─────────────────────────────────────────────────────┘` }
];
commands['exp 10'] = () => [
  { type: 'output', content: `
┌─ The Day I was Born ────────────────────────────────┐
│ Date:       Jan 2, 2004                             │
│ Location:   Murray, UT                              │
│                                                     │
│ Description:                                        │
│ The day I was born. Easy way to remember my birthday│
│                                                     │
│ Key Highlights:                                     │
│ • I entered the world                               │      
└─────────────────────────────────────────────────────┘` }
];

// Add individual project commands
commands['project 1'] = () => [
  { type: 'output', content: `
┌─ GIFTHINT ──────────────────────────────────────────┐
│ ML Gift Recommendation App                          │
│                                                     │
│ Role: Founding Engineer and Project Lead            │
│                                                     │
│ Description:                                        │
│ Led the development of a full-stack mobile          │
│ application using React Native and Node.js.         │
│ Managed a team of two developers, overseeing        │
│ project timelines, architecture decisions, and      │
│ feature implementation. Designed and integrated a   │
│ machine learning algorithm to deliver personalized  │
│ gift suggestions, improving user engagement and     │
│ recommendation accuracy.                            │
│                                                     │
│ Key Achievements:                                   │
│ • Team leadership and project management            │
│ • ML algorithm for personalized recommendations     │
│ • End-to-end development and deployment             │
│                                                     │
│ Tech Stack:                                         │
│ • React Native • Node.js • TypeScript               │
│ • JavaScript • Machine Learning                     │
└─────────────────────────────────────────────────────┘` }
];

commands['project 2'] = () => [
  { type: 'output', content: `
┌─ A BREATH OF FRESH AIR HACKATHON ───────────────────┐
│ AI managed cap and trade system                     │
│                                                     │
│ Role: Developer and Project Lead                    │
│                                                     │
│ Description:                                        │
│ Participated in the A Breath of Fresh Air           │
│ Hackathon, developing an AI-managed cap-and-trade   │
│ system to reduce Utah's air pollution by 1%         │
│ annually. Designed a scalable, data-driven          │
│ solution that automates emission tracking, credit   │
│ allocation, and compliance forecasting.             │
│                                                     │
│ Key Achievements:                                   │
│ • Earned Honorable Mention                          │
│ • Innovative environmental policy approach          │
│ • Integrated multiple AWS services                  │
│ • Automated emission tracking system                │
│                                                     │
│ Tech Stack:                                         │
│ • Python • AWS S3 • Snowflake • Bedrock             │
│ • SageMaker • Machine Learning                      │
└─────────────────────────────────────────────────────┘` }
];

commands['project 3'] = () => [
  { type: 'output', content: `
┌─ PERSONAL WEBSITE ──────────────────────────────────┐
│ What do you think of it so far?                     │
│                                                     │
│ Role: Developer                                     │
│                                                     │
│ Description:                                        │
│ Currently developing a personal website to          │
│ showcase projects and professional experience.      │
│ Designed and implemented responsive layouts using   │
│ a React framework. Focused on cool tech aesthetic   │
│ with a unique terminal-based interface.             │
│                                                     │
│ Key Features:                                       │
│ • Interactive terminal interface                    │
│ • Responsive design                                 │
│ • Project showcase                                  │
│ • Professional portfolio                            │
│                                                     │
│ Tech Stack:                                         │
│ • HTML • CSS • JavaScript • React                   │
│ • Web Design • Terminal UI                          │
│                                                     │
│ You're looking at it right now!                     │
└─────────────────────────────────────────────────────┘` }
];

commands['project 4'] = () => [
  { type: 'output', content: `
┌─ CAPTURE THE FLAG CHALLENGES ───────────────────────┐
│ Cybersecurity challenges to obtain flag from        │
│ systems or code                                     │
│                                                     │
│ Role: Security Researcher and CTF Player            │
│                                                     │
│ Description:                                        │
│ Exploring web application security through courses  │
│ on TryHackMe, information security fundamentals     │
│ on Hack the Box, and overall CTF knowledge with     │
│ PicoCTF. Learning foundational concepts in          │
│ penetration testing, vulnerability analysis, and    │
│ secure coding practices.                            │
│                                                     │
│ Key Skills Developed:                               │
│ • Web application security                          │
│ • Penetration testing                               │
│ • Vulnerability analysis                            │
│ • Secure coding practices                           │
│ • Network security fundamentals                     │
│                                                     │
│ Platforms:                                          │
│ • TryHackMe • Hack the Box • PicoCTF                │
└─────────────────────────────────────────────────────┘` }
];

commands['project 5'] = () => [
  { type: 'output', content: `
┌─ EDUCATIONAL GOLF SIMULATOR ────────────────────────┐
│ Physics-based golf simulator to teach course        │
│ strategy                                            │
│                                                     │
│ Role: Developer                                     │
│                                                     │
│ Description:                                        │
│ Developed a golf course simulator to teach course   │
│ management strategies like club selection,          │
│ distance control, terrain navigation, and obstacle  │
│ avoidance. Implemented physics-based gameplay with  │
│ Box2D and an interactive design using Qt.           │
│                                                     │
│ Key Features:                                       │
│ • Realistic physics simulation                      │
│ • Course management teaching tools                  │
│ • Interactive gameplay                              │
│ • Agile development methodology                     │
│                                                     │
│ Tech Stack:                                         │
│ • C++ • Qt • Box2D Physics Engine                   │
└─────────────────────────────────────────────────────┘` }
];

commands['project 6'] = () => [
  { type: 'output', content: `
┌─ PISKEL (SPRITE) EDITOR ────────────────────────────┐
│ Pixel art editor with animation capabilities        │
│                                                     │
│ Role: Developer                                     │
│                                                     │
│ Description:                                        │
│ Developed a pixel art editor with features for      │
│ creating, editing, and animating sprite graphics.   │
│ Designed user-friendly interfaces with Qt, which    │
│ includes tools for pixel-by-pixel editing,          │
│ frame-by-frame animation, dynamic size adjustment,  │
│ and saving and loading capabilities.                │
│                                                     │
│ Key Features:                                       │
│ • Pixel-by-pixel editing                            │
│ • Frame-by-frame animation                          │
│ • Dynamic canvas updates                            │
│ • Custom drawing algorithm                          │
│ • Save/load functionality                           │
│                                                     │
│ Tech Stack:                                         │
│ • C++ • Qt                                          │
└─────────────────────────────────────────────────────┘` }
];

commands['project 7'] = () => [
  { type: 'output', content: `
┌─ ECOMMERCE BUSINESS ────────────────────────────────┐
│ Ecommerce store with data-driven product and        │
│ marketing strategy                                  │
│                                                     │
│ Role: Founder and Operator                          │
│                                                     │
│ Description:                                        │
│ Founded and managed an online ecommerce store to    │
│ gain hands-on experience in business operations,    │
│ product management, and digital marketing.          │
│ Conducted market research to identify profitable    │
│ product niches and optimize pricing strategies      │
│ based on competitor analysis.                       │
│                                                     │
│ Key Achievements:                                   │
│ • Generated over $2,000 in first year               │
│ • Data-driven decision making                       │
│ • Market research and analysis                      │
│ • Sustained profitability strategies                │
│                                                     │
│ Business Skills:                                    │
│ • Product Management • Marketing                    │
│ • Business Strategy • Data Analysis                 │
└─────────────────────────────────────────────────────┘` }
];

commands['project 8'] = () => [
  { type: 'output', content: `
┌─ SPREADSHEET APPLICATION (EXCEL CLONE) ─────────────┐
│ Functional spreadsheet with formula evaluation      │
│                                                     │
│ Role: Developer                                     │
│                                                     │
│ Description:                                        │
│ Built a fully functional spreadsheet application    │
│ similar to Microsoft Excel. Implemented core        │
│ features including cell editing, formula            │
│ evaluation, and dynamic recalculation. Created a    │
│ custom expression parser for mathematical           │
│ operations and cell references.                     │
│                                                     │
│ Key Features:                                       │
│ • Formula evaluation engine                         │
│ • Cell reference system                             │
│ • Dynamic recalculation                             │
│ • Mathematical operations                           │
│ • Grid-based interface                              │
│                                                     │
│ Tech Stack:                                         │
│ • C# • .NET • Data Structures • Algorithms          │
└─────────────────────────────────────────────────────┘` }
];

commands['project 9'] = () => [
  { type: 'output', content: `
┌─ WEB SCRAPER ───────────────────────────────────────┐
│ Python Web Scraper for static HTML sites            │
│                                                     │
│ Role: Developer                                     │
│                                                     │
│ Description:                                        │
│ Developed a Python-based web scraping tool to       │
│ extract data from static HTML websites. The         │
│ scraper efficiently parses HTML content, extracts   │
│ relevant information, and exports data in           │
│ structured formats.                                 │
│                                                     │
│ Key Features:                                       │
│ • HTML parsing and data extraction                  │
│ • Structured data export (CSV/JSON)                 │
│ • Error handling and recovery                       │
│                                                     │
│ Tech Stack:                                         │
│ • Python • BeautifulSoup • Requests                 │
│ • Data Processing                                   │
└─────────────────────────────────────────────────────┘` }
];

commands['project 10'] = () => [
  { type: 'output', content: `
┌─ ASP.NET CORE WEATHER FORECAST API ─────────────────┐
│ RESTful API with Entity Framework                   │
│                                                     │
│ Role: Developer                                     │
│                                                     │
│ Description:                                        │
│ Built a comprehensive web API for weather           │
│ forecasting using ASP.NET Core. The API provides   │
│ RESTful endpoints for CRUD operations, leveraging  │
│ Entity Framework Core for database interactions.    │
│ Implemented authentication, data validation, and    │
│ comprehensive API documentation with Swagger.       │
│                                                     │
│ Key Features:                                       │
│ • RESTful API design                                │
│ • Entity Framework integration                      │
│ • CRUD operations                                   │
│ • Swagger documentation                             │
│ • Data validation and error handling                │
│                                                     │
│ Tech Stack:                                         │
│ • C# • ASP.NET Core • Entity Framework              │
│ • REST API • Swagger                                │
└─────────────────────────────────────────────────────┘` }
];

  const handleCommand = (cmd) => {
    const trimmedCmd = cmd.trim();
    const lowerCmd = trimmedCmd.toLowerCase();
    
    // Handle echo command with arguments
    if (lowerCmd.startsWith('echo ')) {
      const args = trimmedCmd.substring(5);
      const newHistory = [
        ...history,
        { type: 'command', content: cmd },
        ...commands.echo(args)
      ];
      setHistory(newHistory);
      setCommandHistory([...commandHistory, cmd]);
      setHistoryIndex(-1);
      return;
    }

    const newHistory = [
      ...history,
      { type: 'command', content: cmd }
    ];

    if (commands[lowerCmd]) {
      const result = commands[lowerCmd]();
      
      // Handle clear command specially
      if (result[0]?.type === 'clear') {
        setHistory([]);
      } else {
        setHistory([...newHistory, ...result]);
      }
    } else if (trimmedCmd === '') {
      setHistory(newHistory);
    } else {
      setHistory([
        ...newHistory,
        { type: 'error', content: `bash: ${cmd}: command not found\nType 'help' for available commands.` }
      ]);
    }

    setCommandHistory([...commandHistory, cmd]);
    setHistoryIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Simple autocomplete
      const possibleCommands = Object.keys(commands).filter(cmd => 
        cmd.startsWith(input.toLowerCase())
      );
      if (possibleCommands.length === 1) {
        setInput(possibleCommands[0]);
      } else if (possibleCommands.length > 1) {
        const newHistory = [
          ...history,
          { type: 'command', content: input },
          { type: 'output', content: possibleCommands.join('  ') }
        ];
        setHistory(newHistory);
      }
    } else if (e.ctrlKey && e.key === 'l') {
      e.preventDefault();
      setHistory([
        { type: 'output', content: 'Terminal cleared.\n' }
      ]);
    }
  };

  const handleTerminalClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div className="terminal-container" onClick={handleTerminalClick}>
      <div className="terminal">
        <div className="terminal-header">
          <div className="terminal-button close"></div>
          <div className="terminal-button minimize"></div>
          <div className="terminal-button maximize"></div>
          <span className="terminal-title">ryan@portfolio</span>
        </div>
        <div className="terminal-body" ref={historyRef}>
          {/* Permanent ASCII header */}
          <div className="terminal-header-ascii">
            <pre>{asciiHeader}</pre>
          </div>
          
          {/* Command history */}
          {history.map((item, index) => (
            <div key={index} className={`terminal-line ${item.type}`}>
              {item.type === 'command' && (
                <span className="prompt">ryan@portfolio:~$ </span>
              )}
              {item.type === 'output' ? (
                <span className="content" dangerouslySetInnerHTML={{ __html: item.content }} />
              ) : (
                <span className="content">{item.content}</span>
              )}
            </div>
          ))}
          
          {/* Input line */}
          <div className="terminal-line input-line">
            <span className="prompt">ryan@portfolio:~$ </span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="terminal-input"
              spellCheck="false"
              autoComplete="off"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;