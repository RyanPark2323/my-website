// Projects data - replace with your actual project details
const projectsData = [
  {
    id: 1,
    title: "ASP.NET Core Weather Forecast API",
    brief: "RESTful API with Entity Framework",
    description: "Built a comprehensive web API for weather forecasting using ASP.NET Core following the Microsoft Learn tutorial. The API provides CRUD operations through RESTful endpoints, leveraging Entity Framework Core for database interactions, and implemented Swagger for API documentation.",
    images: [],
    techStack: ["C#", "ASP.NET Core", "Entity Framework", "Swagger", "REST API"],
    demoLink: "https://learn.microsoft.com/en-us/aspnet/core/tutorials/first-web-api?view=aspnetcore-9.0&tabs=visual-studio",
    demoLinkText: "Tutorial Link" // Custom link text
  },
  {
    id: 2,
    title: "Python Web Scraper",
    brief: "Data extraction tool using BeautifulSoup",
    description: "Developed a web scraper in Python that extracts and filters job listings from various websites following the Geek for Geeks tutorial. The tool uses BeautifulSoup and Requests libraries to parse HTML content and extract relevant information such as job titles, descriptions, locations, and salary ranges. Data is processed and exported to CSV format for further analysis.",
    images: [],
    techStack: ["Python", "BeautifulSoup", "Requests", "Pandas", "Data Processing"],
    demoLink: "https://www.geeksforgeeks.org/python-web-scraping-tutorial/",
    demoLinkText: "Tutorial Link" // Custom link text
  },
  {
    id: 3,
    title: "Capture the Flag Challenges",
    brief: "Cybersecurity challenges on TryHackMe & HackTheBox",
    description: "Participated in various Capture The Flag (CTF) cybersecurity challenges on platforms like TryHackMe, HackTheBox, and PicoCTF. Developed skills in web vulnerabilities, vulnerability assessment, forensics, and cryptography. Solved challenges involving web exploitation, reverse engineering, and system hacking.",
    images: [],
    techStack: ["CTF", "Penetration Testing", "Network Security", "Web Exploitation", "Reverse Engineering"],
  },
  {
    id: 4,
    title: "Educational Golf Simulator",
    brief: "Physics-based golf simulator for course strategy",
    description: "Created a physics-based golf simulator application using C++ and Qt framework, with Box2D providing realistic physics calculations. The simulator helps players learn course management strategies by simulating different scenarios and conditions. Features include custom terrain generation, course obstacles, and club selection analysis.",
    images: ["assets/img3.png", "assets/img4.png"],
    techStack: ["C++", "Qt", "Box2D", "Physics Simulation", "Game Development"],
    demoLink: "https://www.youtube.com/watch?v=-29tpyfcKdo",
    demoLinkText: "Live Demo" // Default link text
  },
  {
    id: 5,
    title: "Piskel Editor",
    brief: "Pixel art editor with animation capabilities",
    description: "Developed a pixel art creation and editing tool inspired by Piskel. The application allows users to create sprite animations frame by frame with a custom drawing algorithm. Features include layering, palette management, animation preview, and export to various formats including sprite sheets and animated GIFs.",
    images: ["assets/img1.png", "assets/img2.png"],
    techStack: ["C++", "Qt Creator"],
    demoLink: "https://www.youtube.com/watch?v=14uxdovD2HY",
    demoLinkText: "Live Demo" // Default link text
  },
  {
    id: 6,
    title: "Spreadsheet Application (Excel Clone)",
    brief: "Functional spreadsheet with formula evaluation",
    description: "Built an Excel-like spreadsheet application in C# using .NET and WPF. The application features cell editing, formula evaluation with a custom parser, and dynamic recalculations using dependency graphs. Implemented functions for mathematical operations, string manipulation, and conditional logic similar to those found in Microsoft Excel.",
    images: [],
    techStack: ["C#", "Data Structures", "Algorithms"],
  },
  {
    id: 7,
    title: "Ecommerce Business Founder",
    brief: "Ecommerce store with data-driven product and marketing strategy",
    description: "Launched and grew an onine store to gain hands-on experience in business strategy, product management, ad marketing. Applied market reaserch and cutomer insights to optimize offerings and drive $2,000+ in first year revenue.",
    images: [],
    techStack: ["Product Management", "Marketing", "Business Operations"],
    demoLink: "https://www.etsy.com/shop/MemewearCreations?ref=shop-header-name&listing_id=1522885956&from_page=listing",
    demoLinkText: "Store Link" // Custom link text
  }
];

// Removed view toggle functionality

// Modal Functionality
const modal = document.getElementById('project-modal');
const modalBody = modal.querySelector('.modal-body');
const closeModalBtn = modal.querySelector('.close-modal');

// Open modal when clicking on a project card
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach(card => {
  card.addEventListener('click', function() {
    const projectId = parseInt(this.getAttribute('data-id'));
    const project = projectsData.find(p => p.id === projectId);
    
    if (project) {
      // Determine gallery class based on number of images
      const galleryClass = project.images.length === 1 ? 'modal-gallery single-image' : 'modal-gallery';
      
      // Get custom link text or use defaults
      const repoLinkText = project.repoLinkText || "View Repository";
      const demoLinkText = project.demoLinkText || "Live Demo";
      
      // Populate modal with project details
      modalBody.innerHTML = `
        <div class="modal-header">
          <h2 class="modal-title">${project.title}</h2>
          <p class="modal-subtitle">${project.brief}</p>
        </div>
        
        <p class="modal-description">${project.description}</p>
        
        <div class="${galleryClass}">
          ${project.images.map(img => `
            <div class="gallery-item">
              <img src="${img}" alt="${project.title}">
            </div>
          `).join('')}
        </div>
        
        <div class="modal-tech-stack">
          <h4>Technologies Used</h4>
          <div class="modal-tech-list">
            ${project.techStack.map(tech => `<span>${tech}</span>`).join('')}
          </div>
        </div>
        
        <div class="modal-links">
          ${project.repoLink ? `
            <a href="${project.repoLink}" target="_blank" rel="noopener noreferrer" class="secondary">
              <i class="fas fa-external-link-alt"></i> ${repoLinkText}
            </a>
        ` : ''}
  
        ${project.demoLink ? `
          <a href="${project.demoLink}" class="secondary" target="_blank" rel="noopener noreferrer">
            <i class="fas fa-external-link-alt"></i> ${demoLinkText}
          </a>
        ` : ''}
    </div>
      `;
      
      // Show modal
      modal.style.display = 'block';
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
  });
});

// Close modal functionality
closeModalBtn.addEventListener('click', function() {
  modal.style.display = 'none';
  document.body.style.overflow = 'auto'; // Re-enable scrolling
});

// Close modal when clicking outside the content
window.addEventListener('click', function(event) {
  if (event.target === modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
});

// Close modal on escape key
document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape' && modal.style.display === 'block') {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
});