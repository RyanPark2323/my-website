import React, { useState, useEffect, useRef } from 'react';
import { projectsData } from '../data/projectsData';
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
        project <num>  - View specific project details
        experience     - Show work/education timeline
        exp <num>      - View specific experience details
        contact        - Get in touch
        resume         - Download my resume
        clear          - Clear terminal
        matrix         - Toggle matrix rain effect
        pwd            - Show current directory
        date           - Display current date/time
        echo <text>    - Echo text back

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
│ LinkedIn:   linkedin.com/in/ryan-park23      │
│ GitHub:     https://github.com/RyanPark2323  │
│                                              │
│ Preferred method: Email                      │
└──────────────────────────────────────────────┘` }
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
  for (let i = 1; i <= timelineData.length; i++) {
    commands[`exp ${i}`] = () => {
      const exp = timelineData[i - 1];
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