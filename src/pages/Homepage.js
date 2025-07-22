import { useState, useEffect, useRef } from 'react';
import { projectsData } from '../data/projectsData';

const HomePage = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const terminalRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    // Initial welcome message
    const welcomeMessage = [
      { type: 'ascii', content: `
 ____                     ____            _    
|  _ \\ _   _  __ _ _ __  |  _ \\ __ _ _ __| | __
| |_) | | | |/ _\` | '_ \\ | |_) / _\` | '__| |/ /
|  _ <| |_| | (_| | | | ||  __/ (_| | |  |   < 
|_| \\_\\\\__, |\\__,_|_| |_||_|   \\__,_|_|  |_|\\_\\
       |___/                                    
      ` },
      { type: 'output', content: 'Welcome to Ryan Park\'s Portfolio v2.0' },
      { type: 'output', content: 'Type \'help\' for available commands.' },
      { type: 'output', content: '' }
    ];
    setHistory(welcomeMessage);
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
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
      contact        - Get in touch
      resume         - Download my resume
      clear          - Clear terminal
      matrix         - Toggle matrix rain effect
      sudo hire me   - Why you should hire me
      whoami         - Quick intro
      ls             - List available sections
      cat <section>  - View section details` }
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
Technical Skills:

Languages:
  Python.........[████████████████████░░░] 90%
  JavaScript.....[████████████████░░░░░░] 80%
  C++............[███████████████░░░░░░░] 75%
  Java...........[██████████████░░░░░░░░] 70%
  C#.............[██████████████░░░░░░░░] 70%
  SQL............[████████████░░░░░░░░░░] 60%

Frameworks & Tools:
  React..........[████████████████░░░░░░] 80%
  Node.js........[██████████████░░░░░░░░] 70%
  Tailwind CSS...[████████████████░░░░░░] 80%
  Git............[████████████████████░░░] 90%

Specialties:
  AI/ML..........[███████████████░░░░░░░] 75%
  Cybersecurity..[██████████████░░░░░░░░] 70%
  Web Dev........[████████████████░░░░░░] 80%` }
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
┌─ TIMELINE ──────────────────────────────────────┐
│                                                 │
│ 2026  ━━━━━━━━━━━━┓ B.S. Computer Science      │
│                   ┃ (Expected)                  │
│ 2024  ━━━━━━━━━━━━┫ Dean's List                │
│                   ┃                             │
│ 2023  ━━━━━━━━━━━━┫ STEM Tutor                 │
│                   ┃ CS Teacher                  │
│ 2022  ━━━━━━━━━━━━┫ Started at U of U          │
│                   ┃ Presidential Scholar        │
│                   ┃ Weber State (4.0 GPA)      │
│ 2021  ━━━━━━━━━━━━┫ State Debate Champion      │
│                   ┃                             │
│ 2004  ━━━━━━━━━━━━┛ Born in Murray, Utah       │
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
      // In a real implementation, this would trigger a download
      window.open('/assets/Resume - Base (WEB).docx.pdf', '_blank');
      return [
        { type: 'output', content: 'Downloading resume...' },
        { type: 'output', content: 'Opening resume in new tab...' }
      ];
    },

    clear: () => {
      // Return a special clear command
      return [{ type: 'clear' }];
    },

    'sudo hire me': () => [
      { type: 'output', content: `[sudo] password for recruiter: ****

Access granted. Executing hire_ryan.sh...

#!/bin/bash
# Why you should hire Ryan Park

reasons=(
  "✓ Passionate about cutting-edge technology"
  "✓ Strong foundation in CS fundamentals"
  "✓ Experience with full-stack development"
  "✓ Active in cybersecurity community"
  "✓ Excellent problem-solving skills"
  "✓ Team player with leadership experience"
  "✓ Always learning and improving"
)

for reason in "\${reasons[@]}"; do
  echo "$reason"
  sleep 0.1
done

echo "
Hiring Ryan Park... ████████████████████ 100%
Status: HIGHLY RECOMMENDED
"` }
    ],

    matrix: () => {
      document.body.classList.toggle('matrix-mode');
      return [
        { type: 'output', content: 'Matrix mode toggled' }
      ];
    },

    whoami: () => [
      { type: 'output', content: 'ryan - Computer Science student at University of Utah' }
    ],

    ls: () => [
      { type: 'output', content: `about/    contact/    experience/    projects/    skills/    resume.pdf` }
    ],

    'cat about': () => commands.about(),
    'cat skills': () => commands.skills(),
    'cat contact': () => commands.contact(),
    'cat experience': () => commands.experience(),

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
        <div className="terminal-body" ref={terminalRef}>
          {history.map((item, index) => (
            <div key={index} className={`terminal-line ${item.type}`}>
              {item.type === 'command' && (
                <span className="prompt">ryan@portfolio:~$ </span>
              )}
              <span className="content">{item.content}</span>
            </div>
          ))}
          <div className="terminal-line">
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
            <span className="cursor">▊</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;