import React, { useState, useEffect, useRef } from 'react';
import { projectsData } from '../data/projectsData';

const HomePage = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const historyRef = useRef(null);
  const inputRef = useRef(null);

  // ASCII header that stays permanent
  const asciiHeader = `
 ____                     ____            _    
|  _ \\ _   _  __ _ _ __  |  _ \\ __ _ _ __| | __
| |_) | | | |/ _\` | '_ \\ | |_) / _\` | '__| |/ /
|  _ <| |_| | (_| | | | ||  __/ (_| | |  |   < 
|_| \\_\\\\__, |\\__,_|_| |_||_|   \\__,_|_|  |_|\\_\\
       |___/                                    
      `;

  useEffect(() => {
    // Initial welcome message (no ASCII header here)
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
  project <num>  - View specific project details
  experience     - Show work/education timeline
  exp <num>      - View specific experience details
  contact        - Get in touch
  resume         - Download my resume
  clear          - Clear terminal
  matrix         - Toggle matrix rain effect
  ls             - List available sections
  pwd            - Show current directory
  date           - Display current date/time
  echo <text>    - Echo text back` }
    ],

    about: () => [
      { type: 'output', content: `
┌─ ABOUT ME ─────────────────────────────────────┐
│ Name:     Ryan Park                            │
│ Role:     Computer Science Student             │
│ Focus:    AI, Cybersecurity, Web Development   │
│ Location: Salt Lake City, Utah                 │
│                                                │
│ I'm passionate about building innovative       │
│ solutions at the intersection of AI and        │
│ security. Currently pursuing my BS in CS       │
│ at the University of Utah.                     │
│                                                │
│ When not coding, you'll find me:               │
│ - Solving CTF challenges                       │
│ - At the gym                                   │
│ - Reading sci-fi (currently: Dune series)      │
└────────────────────────────────────────────────┘` }
    ],

    skills: () => [
      { type: 'output', content: `
┌─ TECHNICAL SKILLS ──────────────────────────────┐
│                                                 │
│ Languages                                       │
│ ─────────                                       │
│ Python • JavaScript • C++ • Java • C# • SQL     │
│                                                 │
│ Web Development                                 │
│ ───────────────                                 │
│ React • Node.js • HTML/CSS • Tailwind CSS      │
│ REST APIs • Express • MongoDB                   │
│                                                 │
│ Tools & Technologies                            │
│ ────────────────────                            │
│ Git • Docker • Linux • VS Code • Agile         │
│ Qt Creator • .NET • Entity Framework            │
│                                                 │
│ AI & Machine Learning                           │
│ ─────────────────────                           │
│ TensorFlow • Neural Networks • Data Analysis    │
│ Machine Learning Algorithms                     │
│                                                 │
│ Cybersecurity                                   │
│ ─────────────                                   │
│ Penetration Testing • CTF Challenges            │
│ Network Security • Cryptography                 │
│                                                 │
└─────────────────────────────────────────────────┘` }
    ],

    projects: () => {
      const projectList = projectsData.map((project, index) => 
        `  ${index + 1}. ${project.title.padEnd(30)} - ${project.brief}`
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
│ $ git log --oneline --graph --all              │
│                                                 │
│ * 1. [2026]     B.S. Computer Science          │
│ |               University of Utah              │
│ |                                               │
│ * 2. [2024]     Dean's List                    │
│ |               Spring 2024                     │
│ |                                               │
│ * 3. [2023-24]  STEM Tutor                     │
│ |               U of U REFUGEES Program         │
│ |                                               │
│ * 4. [2023]     Intro to CS Teacher            │
│ |               Local High School               │
│ |                                               │
│ * 5. [2022]     Started University of Utah     │
│ |               Presidential Scholar            │
│ |                                               │
│ * 6. [2022]     Associates Degree              │
│ |               Weber State University          │
│ |                                               │
│ * 7. [2021]     State Debate Champion          │
│ |               Public Forum Debate             │
│ |                                               │
│ * 8. [2004]     System Initialization          │
│                 Born in Murray, Utah            │
│                                                 │
│ Use 'exp <number>' for details                  │
└─────────────────────────────────────────────────┘` }
    ],

    contact: () => [
      { type: 'output', content: `
┌─ CONTACT ───────────────────────────────────────┐
│                                                 │
│ 📧 Email:    ryan.park2322@gmail.com           │
│ 📱 Phone:    (385) 347-1636                    │
│ 💼 LinkedIn: linkedin.com/in/ryan-park23       │
│ 🐙 GitHub:   github.com/ryanpark               │
│                                                 │
│ Preferred method: Email                         │
│ Response time: Within 24 hours                  │
└─────────────────────────────────────────────────┘` }
    ],

    resume: () => {
      // Create a temporary link element to trigger download
      const link = document.createElement('a');
      link.href = '/assets/Resume - Base (WEB).docx.pdf';
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
          { type: 'output', content: '> Reality.exe has stopped responding...' },
          { type: 'output', content: '> Follow the white rabbit 🐇' }
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
      { type: 'output', content: 'ryan - Computer Science student at University of Utah' }
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

  // Dynamic experience commands
  const experiences = [
    {
      title: "B.S. Computer Science",
      date: "2026 (Expected)",
      type: "EDUCATION",
      description: `Currently pursuing Bachelor of Science in Computer Science at the University of Utah with an emphasis in Artificial Intelligence. Maintaining strong academic performance while engaging in various projects and extracurricular activities.`,
      highlights: [
        "AI/ML Emphasis Track",
        "Expected Graduation: 2026",
        "Relevant Coursework: Data Structures, Algorithms, Machine Learning, Cybersecurity"
      ]
    },
    {
      title: "Dean's List",
      date: "Spring 2024",
      type: "ACHIEVEMENT",
      description: `Recognized for outstanding academic performance during the Spring 2024 semester. This achievement reflects consistent dedication to academic excellence while balancing multiple projects and responsibilities.`,
      highlights: [
        "Top academic performance",
        "Recognition for excellence",
        "Maintained high GPA while working on projects"
      ]
    },
    {
      title: "STEM Tutor",
      date: "2023-2024",
      type: "ROLE",
      description: `Served as a STEM Tutor for the University of Utah's REFUGEES program, helping refugee children catch up academically and adapt to the U.S. education system. Focused on mathematics, science, and basic computer skills.`,
      highlights: [
        "Taught mathematics and science fundamentals",
        "Helped students overcome language barriers",
        "Developed culturally sensitive teaching methods",
        "Improved student performance by average of 30%"
      ]
    },
    {
      title: "Intro to CS Teacher",
      date: "2023",
      type: "ROLE",
      description: `Taught Introduction to Computer Science as an elective course at a local high school using the Minecraft Education Platform. Made programming concepts accessible and engaging for students with no prior coding experience.`,
      highlights: [
        "Designed curriculum using Minecraft Education",
        "Taught basic programming concepts",
        "100% student satisfaction rating",
        "Many students pursued further CS courses"
      ]
    },
    {
      title: "Started University of Utah",
      date: "August 2022",
      type: "MILESTONE",
      description: `Began my journey at the University of Utah as a Computer Science major. Awarded the Presidential Merit Scholarship for academic excellence and leadership potential.`,
      highlights: [
        "Presidential Merit Scholarship recipient",
        "Declared CS major with AI emphasis",
        "Joined various tech clubs and organizations"
      ]
    },
    {
      title: "Associates Degree",
      date: "May 2022",
      type: "EDUCATION",
      description: `Graduated from Weber State University with an Associate of Science in General Studies, achieving a perfect 4.0 GPA. Completed degree while still in high school through concurrent enrollment.`,
      highlights: [
        "Perfect 4.0 GPA",
        "Graduated with High Honors",
        "Concurrent enrollment while in high school",
        "Strong foundation in math and sciences"
      ]
    },
    {
      title: "State Debate Champion",
      date: "2021",
      type: "ACHIEVEMENT",
      description: `Won first place in the Utah State Public Forum Debate Championship. This experience honed critical thinking, public speaking, and argumentation skills that translate directly to technical presentations and team collaboration.`,
      highlights: [
        "1st Place - State Championship",
        "Developed strong communication skills",
        "Led team to multiple tournament victories",
        "Skills applicable to technical presentations"
      ]
    },
    {
      title: "System Initialization",
      date: "January 1, 2004",
      type: "INIT",
      description: `Hello, World! Born in Murray, Utah. Early fascination with technology, starting with taking apart electronics and eventually leading to programming and computer science.`,
      highlights: [
        "Native Utahn",
        "Early interest in technology",
        "First computer at age 8",
        "Self-taught basic programming by age 12"
      ]
    }
  ];

  // Add individual experience commands
  for (let i = 1; i <= experiences.length; i++) {
    commands[`exp ${i}`] = () => {
      const exp = experiences[i - 1];
      const highlights = exp.highlights.map(h => `│ • ${h}`).join('\n');
      return [
        { type: 'output', content: `
┌─ ${exp.title.toUpperCase()} ─────────────────────────────────┐
│ Type: ${exp.type}
│ Date: ${exp.date}
│                                                 
│ Description:                                    
│ ${exp.description.match(/.{1,45}/g).join('\n│ ')}
│                                                 
│ Key Highlights:                                 
${highlights}
│                                                 
│ $ cd /experience/${exp.title.toLowerCase().replace(/\s+/g, '-')}
└─────────────────────────────────────────────────┘` }
      ];
    };
  }

  // Dynamic project commands
  for (let i = 1; i <= projectsData.length; i++) {
    commands[`project ${i}`] = () => {
      const project = projectsData[i - 1];
      const techStack = project.techStack.join(', ');
      return [
        { type: 'output', content: `
┌─ ${project.title.toUpperCase()} ─────────────────────────────────┐
│ ${project.brief}
│                                                 
│ Tech Stack: ${techStack}
│ Status: ████████████████████ Complete          
│                                                 
│ Description:                                    
│ ${project.description.match(/.{1,45}/g).join('\n│ ')}
│                                                 
${project.demoLink ? `│ Demo: ${project.demoLink}\n│` : '│'}                                                 
│ $ git clone github.com/ryanpark/${project.title.toLowerCase().replace(/\s+/g, '-')}
│ $ cd ${project.title.toLowerCase().replace(/\s+/g, '-')}
│ $ npm start                                     
└─────────────────────────────────────────────────┘` }
      ];
    };
  }

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
        setHistory([
          { type: 'output', content: 'Terminal cleared.\n' }
        ]);
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
          <span className="terminal-title">ryan@portfolio — bash</span>
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
              <span className="content">{item.content}</span>
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