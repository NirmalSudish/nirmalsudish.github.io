import os

project_files = {
    # -------------------------------------------------------------------------
    # 1. TAILWIND CONFIG: Ultra Slow Animation (120s)
    # -------------------------------------------------------------------------
    "tailwind.config.js": """/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        // CHANGED TO 120s FOR VERY SLOW, ELEGANT SCROLL
        marquee: 'marquee 120s linear infinite', 
        'spin-slow': 'spin 12s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        spin: {
          'from': { transform: 'rotate(0deg)' },
          'to': { transform: 'rotate(360deg)' },
        }
      }
    },
  },
  plugins: [],
}""",

    # -------------------------------------------------------------------------
    # 2. WORK SECTION: Unified Logic (Mixes Projects & Images) + Better Loop
    # -------------------------------------------------------------------------
    "src/components/home/WorkSection.jsx": """import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { projects, visuals, illustrations, threeD, motionVideos } from '../../data/portfolioData';

const filters = [
  { id: 'ux-ui', label: 'UX / UI' },
  { id: 'branding', label: 'Branding' },
  { id: 'packaging', label: 'Packaging' },
  { id: 'visual', label: 'Visuals' },
  { id: 'illustration', label: 'Illustration' },
  { id: '3d', label: '3D' },
  { id: 'motion', label: 'Motion' },
  { id: 'experiments', label: 'Experiments' }
];

const WorkSection = () => {
  const [activeFilter, setActiveFilter] = useState('ux-ui');

  const filteredItems = useMemo(() => {
    // 1. Gather all PROJECTS that match this category
    const matchingProjects = projects
      .filter(p => p.categories.includes(activeFilter))
      .map(p => ({ ...p, type: 'project' }));

    // 2. Gather all RAW ASSETS (Images/Gifs/Videos) that match this category
    let matchingAssets = [];
    if (activeFilter === 'visual') {
        matchingAssets = visuals.map((src, i) => ({ id: `vis-${i}`, src, type: 'img' }));
    } else if (activeFilter === 'illustration') {
        matchingAssets = illustrations.map((src, i) => ({ id: `ill-${i}`, src, type: 'img' }));
    } else if (activeFilter === '3d') {
        matchingAssets = threeD.map((src, i) => ({ id: `3d-${i}`, src, type: 'img' }));
    } else if (activeFilter === 'motion') {
        matchingAssets = motionVideos.map((src, i) => ({ id: `mot-${i}`, src, type: 'video' }));
    }

    // 3. COMBINE THEM into one list
    let items = [...matchingProjects, ...matchingAssets];

    // 4. Safety Check
    if (items.length === 0) return [];

    // 5. INFINITE LOOP LOGIC
    // We clone the list until we have enough items to span a huge width.
    // Minimum 12 items ensures that even 1 project repeats 12 times, filling any screen.
    let loopItems = [...items];
    while (loopItems.length < 12) {
        loopItems = [...loopItems, ...items];
    }
    
    // Double it one last time for the CSS translate(-50%) effect
    return [...loopItems, ...loopItems];

  }, [activeFilter]);

  const handleMouseEnter = (color) => {
    if (color) document.body.style.backgroundColor = color;
  };

  const handleMouseLeave = () => {
    document.body.style.backgroundColor = '#111111';
  };

  return (
    <section id="work" className="relative pt-0 pb-8 md:py-24 min-h-0 md:min-h-screen flex flex-col justify-center bg-transparent z-10">
      <div className="container mx-auto px-6 pt-0 md:pt-24 z-20 relative">
        <h2 className="text-5xl md:text-8xl font-black text-white text-center mb-8 md:mb-16 uppercase tracking-tighter leading-none" data-aos="fade-down">
            Featured Work
        </h2>
        
        <div className="flex justify-center w-full mb-8 md:mb-16" data-aos="fade-up" data-aos-delay="100">
            <div className="flex flex-wrap justify-center gap-4 max-w-full z-10 px-0 w-full">
            {filters.map(f => (
                <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`flex-shrink-0 px-4 py-2 md:px-6 md:py-3 rounded-full border flex items-center gap-2 transition-all duration-300 text-sm md:text-base font-bold uppercase tracking-wider cursor-pointer relative z-50
                    ${activeFilter === f.id 
                    ? 'bg-white text-black border-white' 
                    : 'border-gray-600 text-gray-400 hover:border-white hover:text-white'}`}
                >
                {f.label}
                </button>
            ))}
            </div>
        </div>
      </div>

      <div className="w-full overflow-hidden py-8 group relative z-10">
        <div className="flex gap-6 md:gap-20 w-max animate-marquee group-hover:[animation-play-state:paused] pl-[5vw]">
          {filteredItems.length > 0 ? (
              filteredItems.map((item, idx) => (
                <div 
                    key={`${item.id}-${idx}`} 
                    className="project-card flex-shrink-0 relative transition-opacity duration-500"
                    onMouseEnter={() => handleMouseEnter(item.bgColor)}
                    onMouseLeave={handleMouseLeave}
                >
                  
                  {item.type === 'project' ? (
                    /* PROJECT CARD */
                    <Link to={`/project/${item.id}`} className="block w-[85vw] md:w-[500px] text-white h-full group cursor-pointer">
                      <div className="card-image-container w-full h-[280px] md:h-[350px] overflow-hidden rounded-xl mb-4 relative bg-gray-900">
                        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
                        <img 
                          src={item.mainImageUrl} 
                          className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-105" 
                          alt={item.client} 
                        />
                      </div>
                      <div className="space-y-1 px-2">
                        <h3 className="text-3xl md:text-4xl font-black leading-tight text-white">{item.client}</h3>
                        <div className="flex justify-between items-end border-t border-white/20 pt-3 mt-2">
                            <div>
                                <p className="text-xs uppercase tracking-wider opacity-60 font-bold mb-1 text-gray-400">Role</p>
                                <p className="text-sm md:text-base font-medium text-gray-300">{item.role ? item.role.split(',')[0] : ''}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs uppercase tracking-wider opacity-60 font-bold mb-1 text-gray-400">Year</p>
                                <p className="text-sm md:text-base font-medium text-gray-300">{item.year}</p>
                            </div>
                        </div>
                      </div>
                    </Link>
                  ) : (
                    /* RAW IMAGE/VIDEO CARD (For Illustrations, 3D, etc) */
                    <div className="h-[280px] md:h-[350px] w-auto">
                       {item.type === 'video' ? (
                         <video src={item.src} autoPlay muted loop playsInline className="h-full w-auto rounded-lg object-contain bg-black" />
                       ) : (
                         <img src={item.src} className="h-full w-auto rounded-lg object-contain bg-black" alt="" />
                       )}
                    </div>
                  )}
                </div>
              ))
          ) : (
             <div className="text-white text-xl opacity-50 w-screen text-center">No projects found in this category.</div>
          )}
        </div>
      </div>
    </section>
  );
};
export default WorkSection;
""",

    # -------------------------------------------------------------------------
    # 3. DATA: Updated Illustration/Branding Categories
    # -------------------------------------------------------------------------
    "src/data/portfolioData.js": """
export const projects = [
  {
    id: 0,
    client: 'Kaapi District',
    project: 'Brand Identity & Web Design',
    role: 'Art direction, Design, Web design',
    year: '2022',
    description: "Kaapi District's branding evokes South India's traditional roasting houses with a vintage wordmark.",
    bgColor: '#465d2f',
    logoUrl: 'https://placehold.co/200x200/465d2f/FFFFFF?text=Logo', 
    mainImageUrl: 'https://placehold.co/1200x800/465d2f/FFFFFF?text=Main+Image',
    detailImages: [ 
        'https://placehold.co/1200x800/465d2f/FFFFFF?text=Detail+1',
        'https://placehold.co/1200x800/465d2f/FFFFFF?text=Detail+2'
    ],
    categories: ['branding', 'visual', 'ux-ui', 'packaging']
  },
  {
    id: 1,
    client: 'Northern Escape',
    project: 'Air Max Campaign',
    role: 'Art Direction / Branding',
    year: '2023',
    description: 'A global campaign for the launch of the new Air Max silhouette.',
    bgColor: '#394b72',
    logoUrl: 'https://placehold.co/200x200/394b72/FFFFFF?text=Logo',
    mainImageUrl: 'https://placehold.co/1200x800/394b72/FFFFFF?text=Main+Image',
    detailImages: [
        'https://placehold.co/1200x800/394b72/FFFFFF?text=Detail+1'
    ],
    // ADDED 'branding' here so it shows in loop
    categories: ['motion', 'visual', 'experiments', 'ux-ui', 'branding']
  },
  {
    id: 2,
    client: 'Wisebot',
    project: 'AI Chat Interface',
    role: 'Product Design, UI/UX',
    year: '2023',
    description: 'WiseBot, an AI-powered help-line app.',
    bgColor: '#5B6FA3',
    logoUrl: 'https://placehold.co/200x200/5B6FA3/FFFFFF?text=Logo',
    mainImageUrl: 'https://placehold.co/1200x800/5B6FA3/FFFFFF?text=Main+Image',
    detailImages: [],
    categories: ['ux-ui']
  },
  {
    id: 3,
    client: 'Icons of Kerala',
    project: 'Digital Art Collection',
    role: 'Illustration, Visual Design',
    year: '2024',
    description: 'The concept behind this project was to pay homage to the place from which both of us draw our roots, Kerala.',
    bgColor: '#5F9E2F',
    logoUrl: 'https://placehold.co/200x200/5F9E2F/FFFFFF?text=Logo',
    mainImageUrl: 'https://placehold.co/1200x800/5F9E2F/FFFFFF?text=Kerala+Main',
    detailImages: [
        'https://placehold.co/1200x800/5F9E2F/FFFFFF?text=Art+Piece+1',
        'https://placehold.co/1200x800/5F9E2F/FFFFFF?text=Art+Piece+2'
    ],
    // Ensures this project appears in Illustration tab
    categories: ['ux-ui', 'illustration']
  }
];

// RAW ASSETS (These mix with Projects in the loops)

export const illustrations = [
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=80&w=1000&auto=format&fit=crop',
];

export const threeD = [
    'https://media.giphy.com/media/3o7TKrEzvJbsQNtF5u/giphy.gif',
    'https://images.unsplash.com/photo-1633596683562-4a4697de8377?q=80&w=1000&auto=format&fit=crop',
    'https://media.giphy.com/media/l3vR16pONsV8cKkWk/giphy.gif', 
    'https://media.giphy.com/media/26uf43dkw9bYZnBT2/giphy.gif'
];

export const visuals = [
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcWw5bnZ4eWw5bnZ4eWw5bnZ4eWw5bnZ4eCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7TKSjRrfIPjeiVyM/giphy.gif',
  'https://media.giphy.com/media/l41lFj8afpBN7X3Vu/giphy.gif',
];

export const motionVideos = [
  'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
  'https://www.w3schools.com/html/mov_bbb.mp4'
];
""",

    # -------------------------------------------------------------------------
    # 4. REMAINING FILES (Required for completeness)
    # -------------------------------------------------------------------------
    "package.json": """{
  "name": "portfolio-v12",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "aos": "^2.3.4",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.22.3",
    "framer-motion": "^11.0.8",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.1"
  },
  "devDependencies": {
    "@types/react": "^18.2.66",
    "@types/react-dom": "^18.2.22",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.18",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.1",
    "vite": "^5.2.0"
  }
}""",

    "vite.config.js": """import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})""",

    "postcss.config.js": """export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}""",

    "index.html": """<!doctype html>
<html lang="en" class="scroll-smooth">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Nirmal | Graphic Designer</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;900&display.swap" rel="stylesheet">
  </head>
  <body class="bg-[#111111] text-white">
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>""",

    "src/main.jsx": """import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)""",

    "src/styles/index.css": """@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  background-color: #111111;
  color: #e5e7eb;
  overflow-x: hidden;
  transition: background-color 0.6s ease-in-out;
  cursor: none;
}

#glass-cursor {
    pointer-events: none !important;
}

@media (pointer: coarse) {
  body { cursor: auto; }
  #glass-cursor { display: none !important; }
}

.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

.hero-title-responsive {
    font-size: clamp(3rem, 13vw, 16rem);
    line-height: 1.05;
    letter-spacing: -0.04em;
}
""",

    "src/App.jsx": """import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

import CustomCursor from './components/common/CustomCursor';
import MotionBackground from './components/background/MotionBackground';
import TransitionCurtain from './components/common/TransitionCurtain';

import Home from './pages/Home';
import ProjectDetail from './pages/ProjectDetail';

const AppContent = () => {
  const location = useLocation();

  useEffect(() => {
    AOS.init({ duration: 1000, once: true, easing: 'ease-out-cubic' });
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      <CustomCursor />
      <TransitionCurtain key={location.pathname} />
      <MotionBackground />

      <main className="relative z-10">
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
        </Routes>
      </main>
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;
""",

    "src/pages/Home.jsx": """import React from 'react';
import Navbar from '../components/common/Navbar';
import Hero from '../components/home/Hero';
import WorkSection from '../components/home/WorkSection';
import About from '../components/home/About';
import Contact from '../components/home/Contact';
import Footer from '../components/common/Footer';

const Home = () => {
  return (
    <div className="relative">
      <Navbar />
      <Hero />
      <WorkSection />
      <About />
      <Contact />
      <Footer />
    </div>
  );
};
export default Home;
""",

    "src/pages/ProjectDetail.jsx": """import React, { useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { projects } from '../data/portfolioData';
import AOS from 'aos';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = projects.find(p => p.id.toString() === id);
  const footerRef = useRef(null);
  const projectLogoRef = useRef(null);

  useEffect(() => {
    if (!project) {
        navigate('/');
        return;
    }
    
    document.body.style.backgroundColor = project.bgColor;
    window.scrollTo(0, 0);
    setTimeout(() => AOS.refreshHard(), 100);

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                document.body.style.backgroundColor = '#111111';
            } else {
                document.body.style.backgroundColor = project.bgColor;
            }
        });
    }, { threshold: 0.1 });

    if (footerRef.current) observer.observe(footerRef.current);

    const handleScroll = () => {
        if (projectLogoRef.current) {
            const rotation = window.scrollY / 3;
            projectLogoRef.current.style.transform = `rotate(${rotation}deg)`;
        }
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
      document.body.style.backgroundColor = '#111111';
    };
  }, [project, navigate]);

  if (!project) return null;

  const nextProjectId = (parseInt(id) + 1) % projects.length;
  const prevProjectId = (parseInt(id) - 1 + projects.length) % projects.length;

  return (
    <div id="project-detail-view" className="min-h-screen text-white relative z-20">
        <header className="fixed top-0 left-0 right-0 z-50 mix-blend-difference w-full pointer-events-none">
            <div className="container mx-auto px-6 py-6 flex justify-between items-center pointer-events-auto">
                <Link to="/" className="text-white hover:opacity-75 transition-opacity cursor-pointer">
                    <svg ref={projectLogoRef} className="w-10 h-10 will-change-transform" viewBox="5 10.21 272.38 392.93" xmlns="http://www.w3.org/2000/svg">
                        <path fill="none" stroke="currentColor" strokeMiterlimit="10" strokeWidth="15" d="M5 21.53v381.61l194.89-178.66-139.48-45.96 43.16-33.49L5 21.53z"/>
                        <path fill="none" stroke="currentColor" strokeMiterlimit="10" strokeWidth="15" d="M277.38 10.21 60.41 178.52l139.48 45.96-32.3 29.61 109.79 145.17V10.21z"/>
                    </svg>
                </Link>
                <Link to="/" className="text-white hover:scale-110 transition-transform cursor-pointer">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </Link>
            </div>
        </header>

        <div className="pt-32 pb-20">
            <div className="container mx-auto max-w-7xl text-center">
                <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 sm:px-8">
                    <div data-aos="fade-up" className="max-w-4xl w-full">
                        <img src={project.logoUrl} alt="Logo" className="h-48 w-auto mx-auto mb-12 object-contain" />
                        <h2 className="text-5xl md:text-8xl font-black mb-8 leading-tight uppercase">{project.client}</h2>
                        <p className="text-xl md:text-3xl leading-relaxed text-gray-200 font-light">{project.description}</p>
                        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-left border-t border-white/20 pt-8">
                            <div><p className="text-xs text-gray-300 uppercase tracking-widest mb-2 font-bold">Client</p><p className="font-bold text-lg">{project.client}</p></div>
                            <div><p className="text-xs text-gray-300 uppercase tracking-widest mb-2 font-bold">Project</p><p className="font-bold text-lg">{project.project}</p></div>
                            <div><p className="text-xs text-gray-300 uppercase tracking-widest mb-2 font-bold">Role</p><p className="font-bold text-lg">{project.role}</p></div>
                            <div><p className="text-xs text-gray-300 uppercase tracking-widest mb-2 font-bold">Year</p><p className="font-bold text-lg">{project.year}</p></div>
                        </div>
                    </div>
                </div>

                <div className="py-12 md:py-24" data-aos="fade-up">
                    <img src={project.mainImageUrl} className="rounded-lg w-full shadow-2xl" alt="Main" />
                </div>

                <div className="pb-16 md:pb-24 space-y-8 md:space-y-12 max-w-5xl mx-auto">
                    {project.detailImages.map((img, i) => (
                        <div key={i} data-aos="fade-up">
                            <img src={img} className="rounded-lg w-full shadow-lg" alt="Detail" />
                        </div>
                    ))}
                </div>

                <div ref={footerRef} className="py-32 mt-12 text-white">
                    <nav className="flex justify-between items-center max-w-7xl mx-auto border-t border-white/10 pt-12">
                        <Link to={`/project/${prevProjectId}`} className="group flex flex-col items-start text-left cursor-pointer">
                            <span className="text-xs uppercase tracking-widest text-gray-400 mb-2 font-bold">Previous</span>
                            <div className="relative overflow-hidden h-10 md:h-16">
                                <span className="block text-3xl md:text-6xl font-black uppercase transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-full">Prev</span>
                                <span className="absolute top-0 left-0 block text-3xl md:text-6xl font-black uppercase transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] translate-y-full group-hover:translate-y-0 text-gray-500">Prev</span>
                            </div>
                        </Link>
                        <Link to={`/project/${nextProjectId}`} className="group flex flex-col items-end text-right cursor-pointer">
                            <span className="text-xs uppercase tracking-widest text-gray-400 mb-2 font-bold">Next</span>
                            <div className="relative overflow-hidden h-10 md:h-16">
                                <span className="block text-3xl md:text-6xl font-black uppercase transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-full">Next</span>
                                <span className="absolute top-0 right-0 block text-3xl md:text-6xl font-black uppercase transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] translate-y-full group-hover:translate-y-0 text-gray-500">Next</span>
                            </div>
                        </Link>
                    </nav>
                </div>
            </div>
        </div>
    </div>
  );
};
export default ProjectDetail;
""",

    "src/components/common/Navbar.jsx": """import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const logoRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
        if (logoRef.current) {
            const rotation = window.scrollY / 3;
            logoRef.current.style.transform = `rotate(${rotation}deg)`;
        }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/0 backdrop-blur-sm transition-all duration-300">
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-white focus:outline-none cursor-pointer relative z-50">
             <svg ref={logoRef} className="w-10 h-10 md:w-12 md:h-12 will-change-transform" viewBox="5 10.21 272.38 392.93" xmlns="http://www.w3.org/2000/svg">
                <g>
                   <path fill="none" stroke="currentColor" strokeMiterlimit="10" strokeWidth="15" d="M5 21.53v381.61l194.89-178.66-139.48-45.96 43.16-33.49L5 21.53z"/>
                   <path fill="none" stroke="currentColor" strokeMiterlimit="10" strokeWidth="15" d="M277.38 10.21 60.41 178.52l139.48 45.96-32.3 29.61 109.79 145.17V10.21z"/>
                </g>
             </svg>
          </Link>
          <nav className="hidden md:flex items-center space-x-12 relative z-50">
            <a href="/#work" className="text-white font-bold hover:opacity-75 transition-opacity uppercase tracking-widest text-sm cursor-pointer">Work</a>
            <a href="/#about" className="text-white font-bold hover:opacity-75 transition-opacity uppercase tracking-widest text-sm cursor-pointer">About</a>
            <a href="/#contact" className="bg-white text-black font-bold px-6 py-3 rounded-full hover:bg-gray-200 transition-colors uppercase tracking-widest text-sm cursor-pointer">Let's Chat</a>
          </nav>
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-white z-50 cursor-pointer">
             {isOpen ? 'CLOSE' : <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>}
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center z-40 min-h-screen">
           <a href="/#work" onClick={() => setIsOpen(false)} className="block py-4 text-4xl font-black text-gray-300 hover:text-white uppercase">Work</a>
           <a href="/#about" onClick={() => setIsOpen(false)} className="block py-4 text-4xl font-black text-gray-300 hover:text-white uppercase">About</a>
           <a href="/#contact" onClick={() => setIsOpen(false)} className="block py-4 text-4xl font-black text-gray-300 hover:text-white uppercase">Contact</a>
        </div>
      )}
    </header>
  );
};
export default Navbar;
""",

    "src/components/common/CustomCursor.jsx": """import React, { useEffect, useRef } from 'react';

const CustomCursor = () => {
  const cursorRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const moveCursor = (e) => {
      if (cursor) {
        cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }
    };

    const addHover = () => cursor?.classList.add('hovered');
    const removeHover = () => cursor?.classList.remove('hovered');

    window.addEventListener('mousemove', moveCursor);

    const handleMouseOver = (e) => {
      if (e.target.closest('a, button, .project-card, .cursor-hover')) {
        addHover();
      } else {
        removeHover();
      }
    };

    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <>
      <style>{`
        #glass-cursor {
          position: fixed;
          top: 0; left: 0;
          width: 20px; height: 20px;
          border-radius: 50%;
          background-color: white;
          mix-blend-mode: difference;
          pointer-events: none;
          z-index: 9999;
          transition: width 0.3s ease, height 0.3s ease;
          will-change: transform;
        }
        #glass-cursor.hovered {
          width: 80px;
          height: 80px;
        }
      `}</style>
      <div id="glass-cursor" ref={cursorRef} />
    </>
  );
};
export default CustomCursor;
""",

    "src/components/common/TransitionCurtain.jsx": """import React from 'react';
import { motion } from 'framer-motion';

const TransitionCurtain = () => {
  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: '-100%' }}
      transition={{ duration: 1.2, ease: [0.77, 0, 0.175, 1] }}
      className="fixed inset-0 bg-black z-[9998] pointer-events-none"
    />
  );
};
export default TransitionCurtain;
""",

    "src/components/common/Footer.jsx": """import React from 'react';

const Footer = () => (
  <footer className="bg-black text-white relative z-20">
    <div className="container mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <p className="text-lg text-gray-500 font-bold">&copy; {new Date().getFullYear()} Nirmal</p>
        <div className="flex mt-4 md:mt-0 space-x-8 text-lg">
          <a href="#" className="text-gray-500 hover:text-white transition-colors">Twitter</a>
          <a href="#" className="text-gray-500 hover:text-white transition-colors">Instagram</a>
          <a href="#" className="text-gray-500 hover:text-white transition-colors">Dribbble</a>
        </div>
      </div>
    </div>
  </footer>
);
export default Footer;
""",

    "src/components/background/MotionBackground.jsx": """import React, { useEffect, useRef } from 'react';

const MotionBackground = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let grid = [];
    const gridSize = 30;
    let time = 0;
    const mouse = { x: undefined, y: undefined, radius: 100 };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      createGrid();
    };

    const createGrid = () => {
      grid = [];
      for (let x = 0; x < canvas.width + gridSize; x += gridSize) {
        for (let y = 0; y < canvas.height + gridSize; y += gridSize) {
          grid.push({ x, y, originalX: x, originalY: y, vx: 0, vy: 0 });
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.005;
      
      for (let i = 0; i < grid.length; i++) {
        const point = grid[i];
        let forceX = 0;
        let forceY = 0;
        const springForceX = (point.originalX - point.x) * 0.02;
        const springForceY = (point.originalY - point.y) * 0.02;
        forceX += springForceX;
        forceY += springForceY;

        let color = '255, 255, 255';
        let finalOpacity = 0.1;
        let radius = 1.5;

        if (mouse.x !== undefined) {
            const dx = mouse.x - point.x;
            const dy = mouse.y - point.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < mouse.radius) {
                const force = (mouse.radius - dist) / mouse.radius;
                const angle = Math.atan2(dy, dx);
                forceX -= Math.cos(angle) * force * 1.5;
                forceY -= Math.sin(angle) * force * 1.5;
                color = '199, 146, 255';
                finalOpacity = force + 0.1;
                radius = 2 + force * 2;
            }
        }

        forceX += Math.sin(point.originalY / 60 + time) * 0.02;
        forceY += Math.cos(point.originalX / 60 + time) * 0.02;

        point.vx = (point.vx + forceX) * 0.9;
        point.vy = (point.vy + forceY) * 0.9;
        point.x += point.vx;
        point.y += point.vy;

        ctx.beginPath();
        ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color}, ${finalOpacity})`;
        ctx.fill();
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resizeCanvas);
    const handleMouseMove = (e) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    const handleMouseOut = () => { mouse.x = undefined; mouse.y = undefined; };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', handleMouseOut);
    
    resizeCanvas();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseOut);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }} />;
};
export default MotionBackground;
""",

    "src/components/home/Hero.jsx": """import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const flipWords = ["communicate", "captivate", "inspire", "engage", "tell stories"];

const Hero = () => {
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % flipWords.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="hero" className="color-trigger-section min-h-0 md:min-h-[100dvh] relative flex flex-col justify-start pt-28 pb-0 md:justify-center md:pt-0 md:pb-0 z-10">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-center md:justify-between h-auto md:h-full gap-2 md:gap-0">
        <div className="w-full md:w-2/3 lg:w-3/4 z-10 text-center md:text-left">
          <h1 className="font-black hero-title-responsive text-white uppercase tracking-tighter leading-none">
            HI, I'm<br />NIRMAL.
          </h1>
        </div>
        <div className="w-full md:w-1/3 lg:w-1/4 text-center md:text-right z-10 flex flex-col items-center md:items-end md:mt-32">
          <p className="text-xl md:text-2xl text-gray-400 font-light leading-relaxed max-w-lg">
            I’m a graphic designer passionate about creating visuals that{' '}
            <span className="relative inline-block w-40 text-left font-bold text-white align-top">
              <AnimatePresence mode="wait">
                <motion.span
                  key={wordIndex}
                  initial={{ opacity: 0, y: 10, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -20, filter: 'blur(8px)' }}
                  transition={{ duration: 0.3 }}
                  className="absolute left-0 top-0 whitespace-nowrap"
                >
                  {flipWords[wordIndex]}
                </motion.span>
              </AnimatePresence>
            </span>
          </p>
        </div>
        <div className="relative md:absolute md:bottom-8 md:left-1/2 md:-translate-x-1/2 z-20 transform scale-75 md:scale-100 flex justify-center w-full md:w-auto pointer-events-auto mt-8 md:mt-0">
            <a href="#work" className="group relative flex items-center justify-center w-32 h-32 rounded-full border border-white/10 hover:border-white/30 hover:bg-white/5 transition-all duration-500 backdrop-blur-[2px]">
                <svg className="absolute inset-0 w-full h-full animate-spin-slow opacity-70 group-hover:opacity-100 transition-opacity duration-300" viewBox="0 0 100 100">
                    <path id="curve" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="transparent" />
                    <text className="text-[9.5px] uppercase font-bold tracking-[3px] fill-white" dominantBaseline="middle" textAnchor="middle">
                        <textPath href="#curve" startOffset="50%">WORKS • WORKS • WORKS •</textPath>
                    </text>
                </svg>
                <div className="text-white transform transition-transform duration-300 group-hover:translate-y-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 13l-7 7-7-7m14-8l-7 7-7-7" />
                    </svg>
                </div>
            </a>
        </div>
      </div>
    </section>
  );
};
export default Hero;
""",

    "src/components/home/About.jsx": """import React from 'react';

const About = () => (
  <section id="about" className="color-trigger-section pt-0 pb-8 md:py-32 relative z-10" data-bg-color="#000000">
    <div className="container mx-auto px-6">
      <div className="flex flex-col md:flex-row items-center gap-12">
        <div className="w-full md:w-1/2" data-aos="fade-up" data-aos-delay="200">
          <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop" className="rounded-lg shadow-2xl w-full transition-all duration-700 hover:scale-[1.02]" alt="Portrait" />
        </div>
        <div className="w-full md:w-1/2 space-y-12 mt-8 md:mt-0 text-center md:text-left" data-aos="fade-up">
          <div>
            <h4 className="font-bold text-3xl mb-4 text-white">About</h4>
            <p className="text-gray-400 text-lg leading-relaxed">I'm Nirmal. Multi-disciplinary designer based in Dubai. Currently designing beautiful experiences at Google. When I'm not designing stuff you can catch me watching my son's soccer practice, playing Magic: The Gathering, or being disappointed with the Washington Commanders.</p>
          </div>
          <div>
            <h4 className="font-bold text-3xl mb-4 text-white">Current</h4>
            <p className="text-gray-300 text-lg">Lorem ipsum dolor sit amet</p>
          </div>
          <div className="pt-4">
            <a href="resume.pdf" target="_blank" className="inline-block bg-white text-black font-bold uppercase tracking-wider px-10 py-4 rounded-full hover:bg-gray-200 transition-transform hover:scale-105">Download Resume</a>
          </div>
        </div>
      </div>
    </div>
  </section>
);
export default About;
""",

    "src/components/home/Contact.jsx": """import React from 'react';

const Contact = () => (
  <section id="contact" className="color-trigger-section py-12 md:py-32 relative z-10" data-bg-color="#111111">
    <div className="container mx-auto px-6 text-center" data-aos="zoom-in">
      <h2 className="text-4xl sm:text-6xl md:text-8xl font-black text-white leading-none">Let's work<br />together.</h2>
      <p className="mt-8 text-xl sm:text-2xl text-gray-400 hover:text-white transition-colors border-b-2 border-gray-700 hover:border-white inline-block pb-2"><a href="mailto:hello@nirmal.com">hello@nirmal.com</a></p>
    </div>
  </section>
);
export default Contact;
"""
}

def install_full_project():
    print("🚀 Rebuilding V10 Complete Project...")
    
    # 1. Ensure Directories
    directories = [
        "src",
        "src/styles",
        "src/data",
        "src/pages",
        "src/components/common",
        "src/components/home",
        "src/components/background",
        "src/components/project"
    ]
    
    for d in directories:
        if not os.path.exists(d):
            os.makedirs(d)
            print(f"📁 Created: {d}")

    # 2. Write Files
    for path, content in project_files.items():
        with open(path, "w", encoding="utf-8") as f:
            f.write(content)
            print(f"✅ Created: {path}")

    print("\n✅ PROJECT RESET COMPLETE.")
    print("------------------------------------------------")
    print("👉 IMPORTANT NEXT STEPS:")
    print("1. Run: npm install")
    print("2. Run: npm run dev")
    print("------------------------------------------------")

if __name__ == "__main__":
    install_full_project()