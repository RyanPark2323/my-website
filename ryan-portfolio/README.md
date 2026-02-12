# Ryan Park - Portfolio Website

Modern, elegant portfolio website built with React, TypeScript, Three.js, and Tailwind CSS. Features interactive 3D elements, smooth animations, and a responsive design optimized for recruiters and hiring managers.

## 🎨 Design Philosophy

- **Elegant & Professional**: Clean design with sophisticated micro-interactions
- **Performance-First**: Optimized for fast load times and smooth animations
- **Accessibility**: WCAG AA compliant with keyboard navigation support
- **Responsive**: Mobile-first design that works perfectly on all devices

## 🚀 Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **3D Graphics**: Three.js + React Three Fiber
- **Animations**: Framer Motion
- **Icons**: Lucide React

## 📁 Project Structure

```
ryan-portfolio/
├── src/
│   ├── components/
│   │   ├── layout/           # Navigation, Footer, ScrollIndicator
│   │   ├── sections/         # Hero, Projects, Skills, About
│   │   └── ui/               # Reusable components (ProjectCard)
│   ├── three/                # 3D scene components
│   │   └── GeometricConstellation.tsx
│   ├── data/                 # Content data (EDIT THESE TO UPDATE CONTENT)
│   │   ├── projects.ts       # Project information
│   │   └── skills.ts         # Skills and tech stack
│   ├── App.tsx               # Main app component
│   ├── main.tsx              # App entry point
│   └── index.css             # Global styles
├── public/
│   ├── projects/             # Project screenshots
│   └── resume.pdf            # Your resume PDF
└── package.json
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📝 Updating Content

### Adding/Editing Projects

Edit `src/data/projects.ts`:

```typescript
{
  id: 'project-slug',
  title: 'Project Name',
  description: 'Short description for card',
  longDescription: 'Detailed description',
  technologies: ['React', 'Node.js', 'AWS'],
  image: '/projects/screenshot.jpg',  // Add image to public/projects/
  github: 'https://github.com/...',   // Optional
  demo: 'https://demo-link.com',      // Optional
  highlights: [
    'Achievement 1',
    'Achievement 2'
  ]
}
```

**Steps to add a new project:**
1. Add your project data to the `projects` array in `src/data/projects.ts`
2. Place project screenshot in `public/projects/` folder
3. Update the `image` field with the correct path
4. Site will automatically update!

### Adding/Editing Skills

Edit `src/data/skills.ts`:

```typescript
{
  category: 'Category Name',
  color: '#60A5FA',  // Hex color for category accent
  skills: [
    { name: 'Skill Name', proficiency: 'advanced' }
  ]
}
```

**Proficiency levels**: `beginner`, `intermediate`, `advanced`, `expert`

### Updating Personal Information

**Hero Section** - Edit `src/components/sections/Hero.tsx`:
- Name, title, tagline
- CTA button text

**About Section** - Edit `src/components/sections/About.tsx`:
- Biography text
- Education, location info

**Navigation** - Edit `src/components/layout/Navigation.tsx`:
- Social links (GitHub, LinkedIn)
- Email address

### Updating Resume

Replace `public/resume.pdf` with your latest resume. The download link will automatically use the new file.

## 🎨 Customizing Design

### Colors

Edit `tailwind.config.js` to change the color scheme:

```javascript
colors: {
  'bg-base': '#0A0E27',           // Main background
  'bg-elevated': '#121729',       // Cards/elevated surfaces
  'accent-primary': '#60A5FA',    // Primary accent (blue)
  'accent-secondary': '#34D399',  // Secondary accent (green)
  'accent-tertiary': '#8B5CF6',   // Tertiary accent (purple)
  'text-primary': '#F1F5F9',      // Main text
  'text-secondary': '#94A3B8',    // Secondary text
  'border': '#1E293B',            // Borders/dividers
}
```

### Typography

Edit `tailwind.config.js` to change fonts:

```javascript
fontFamily: {
  sans: ['Inter', 'system-ui', 'sans-serif'],
  display: ['Inter', 'system-ui', 'sans-serif'],
  mono: ['JetBrains Mono', 'monospace'],
}
```

Update the Google Fonts import in `src/index.css` accordingly.

### 3D Constellation

Edit `src/three/GeometricConstellation.tsx` to customize:
- Number of shapes
- Shape types (Sphere, Torus, Octahedron, etc.)
- Colors
- Animation speed
- Positions

## 📱 Adding Project Screenshots

1. Take screenshots of your projects (recommended: 1920x1080 or 16:9 aspect ratio)
2. Save them in `public/projects/` with descriptive names
3. Update the `image` field in `src/data/projects.ts`

Example:
```typescript
image: '/projects/gifthint-screenshot.jpg'
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Vercel will auto-detect Vite and deploy

### Netlify

1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Import your repository
4. Build command: `npm run build`
5. Publish directory: `dist`

### GitHub Pages

```bash
npm run build
# Deploy the dist/ folder to GitHub Pages
```

## 🔧 Maintenance Checklist

- [ ] Update projects as you complete them
- [ ] Keep resume.pdf current
- [ ] Update skills when you learn new technologies
- [ ] Add project screenshots for better visual impact
- [ ] Update social links if they change
- [ ] Test on mobile devices regularly

## 📊 Performance Tips

- Optimize images before uploading (use WebP format)
- Keep the number of 3D shapes reasonable (5-7 max)
- Test on slow connections periodically
- Run Lighthouse audits in Chrome DevTools

## 🐛 Troubleshooting

**Build fails:**
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

**3D scene not rendering:**
- Check browser console for WebGL errors
- Ensure your browser supports WebGL 2.0

**Animations laggy:**
- Reduce number of animated elements
- Simplify 3D constellation (fewer shapes)

## 📞 Support

If you have questions or need help customizing:
- Check the comments in each file
- Refer to component documentation
- Review Tailwind CSS docs: tailwindcss.com
- Review Framer Motion docs: framer.com/motion

## 📄 License

This project is open source and available for personal use.

---

Built with ❤️ by Ryan Park using React, TypeScript, Three.js, and Tailwind CSS
