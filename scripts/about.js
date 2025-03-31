// Menu Toggle Script
document.getElementById('menu-icon').addEventListener('click', function() {
    document.getElementById('menu').classList.toggle('hidden');
  });
  
  // Timeline Data
  const timelineData = [
    {
      date: 'January 1, 2004',
      title: 'The Beginning',
      description: 'I was born in Murray Utah'
    },
    {
      date: 'May 2022',
      title: 'High School Graduation',
      description: 'Graduated from Bonneville High School. Served as Chess Club President and Founder, 2021 Public Forum State Debate Champion, Varsity Athlete in Football, Track, Wrestling'
    },
    {
      date: ' May 2022',
      title: 'Associates of Science in General Studies with High Honors',
      description: 'Graduated from Weber State University with a 4.0 GPA.'
    },
    {
      date: 'August 2022',
      title: 'Acceptance into the University of Utah',
      description: 'Declared for a B.S in Computer Science with an Emphasis in AI. Received the Presidential Merit Scholarship.'
    },
    {
      date: '2023 - 2024',
      title: 'STEM Tutor',
      description: 'Worked as a STEM Tutor at the Center for Math and Science Education at the University of Utah\'s REFUGEEs program, helping refugee children get back on track academically.'
    },
    {
      date: '2023',
      title: 'Intro to CS Teacher',
      description: 'Worked at a local highschool to teach Intro to CS as an elective course utilizing the Minecraft Education Platform'
    },
    {
        date: '2024',
        title: 'Dean\'s List',
        description: 'Qualified for the Spring 2024 Dean\'s List for great grades'
    },
    {
      date: '2026 (Expected)',
      title: 'Bachelor\'s Degree',
      description: 'Expected graduation with a B.S. in Computer Science with an emphasis in AI from the University of Utah.'
    }
  ];
  
  // Timeline Initialization
  const timelineItemsContainer = document.getElementById('timeline-items');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  
  let currentIndex = 0;
  let isAnimating = false;
  
  // Generate timeline items
  function createTimelineItems() {
    timelineData.forEach((item, index) => {
      const timelineItem = document.createElement('div');
      timelineItem.className = 'timeline-item' + (index === 0 ? ' active' : '');
      timelineItem.setAttribute('data-index', index);
  
      timelineItem.innerHTML = `
        <div class="timeline-point"></div>
        <div class="timeline-date">${item.date}</div>
        <div class="timeline-content">
          <h3>${item.title}</h3>
          <p>${item.description}</p>
        </div>
      `;
  
      timelineItemsContainer.appendChild(timelineItem);
  
      // Add click event to timeline points
      timelineItem.querySelector('.timeline-point').addEventListener('click', function() {
        if (isAnimating) return;
        navigateToItem(index);
      });
    });
  }
  
  // Navigate to a specific timeline item with improved positioning for the first and last items
  function navigateToItem(index) {
    if (index < 0 || index >= timelineData.length || isAnimating) return;
    
    isAnimating = true;
    currentIndex = index;
    
    // Update active class
    document.querySelectorAll('.timeline-item').forEach(item => {
      item.classList.remove('active');
    });
    
    const activeItem = document.querySelector(`.timeline-item[data-index="${index}"]`);
    activeItem.classList.add('active');
    
    // Calculate position to center the active item
    const containerWidth = timelineItemsContainer.parentElement.offsetWidth;
    let offset = 0;
    
    if (index === 0) {
      offset = 0; // For the first item, no offset so it stays visible
    } else if (index === timelineData.length - 1) {
      offset = timelineItemsContainer.scrollWidth - containerWidth; // For the last item, align to the right
    } else {
      const itemWidth = activeItem.offsetWidth;
      offset = (activeItem.offsetLeft + (itemWidth / 2)) - (containerWidth / 2);
    }
    
    // Animate scrolling
    timelineItemsContainer.style.transform = `translateX(-${offset}px)`;
    
    // Update navigation buttons state
    updateButtonStates();
    
    // Reset animation flag after the transition
    setTimeout(() => {
      isAnimating = false;
    }, 500);
  }
  
  // Update navigation buttons state
  function updateButtonStates() {
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === timelineData.length - 1;
  }
  
  // Navigation button event listeners
  prevBtn.addEventListener('click', function() {
    if (currentIndex > 0 && !isAnimating) {
      navigateToItem(currentIndex - 1);
    }
  });
  
  nextBtn.addEventListener('click', function() {
    if (currentIndex < timelineData.length - 1 && !isAnimating) {
      navigateToItem(currentIndex + 1);
    }
  });
  
  // Initialize timeline and center the first item explicitly
  createTimelineItems();
  navigateToItem(0);
  
  // Handle window resize by recalculating position
  window.addEventListener('resize', function() {
    if (!isAnimating) {
      navigateToItem(currentIndex);
    }
  });
  
  // Keyboard navigation support
  document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft' && !prevBtn.disabled) {
      prevBtn.click();
    } else if (e.key === 'ArrowRight' && !nextBtn.disabled) {
      nextBtn.click();
    }
  });
  