import React, { useState, useMemo, memo, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { resolvePath } from '../../utils/imagePath';
import { AnimatePresence, motion } from 'framer-motion';
import ScrollReveal from '../common/ScrollReveal';
import {
  projects, visuals, motionVideos, threeD,
  experiments, brandingAssets, packagingAssets
} from '../../data/portfolioData';

const SECONDS_PER_ITEM = 12;

const categoryLogos = {
  'ux-branding': (<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8m-4-4v4" /></svg>),
  'packaging-print': (<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M21 8l-9-4-9 4m18 0l-9 4m9-4v8l-9 4m0-12L3 8m9 4v8m-9-12v8l9 4" /></svg>),
  'visual': (<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><path d="M21 15l-5-5L5 21" /></svg>),
  '3d': (<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 2L3 7v10l9 5 9-5V7l-9-5zM12 22V12M21 7l-9 5L3 7" /></svg>),
  'motion': (<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3" /></svg>),
  'experimental': (<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M9 3h6M10 3v7l-4 8a2 2 0 002 2h8a2 2 0 002-2l-4-8V3" /></svg>)
};

const ProjectCard = memo(({ item, onMouseEnter, onMouseLeave, onSelect, index }) => {
  const isProject = item.client !== undefined;
  const isVideo = typeof item.src === 'string' && item.src.endsWith('.mp4');
  return (
    <div className="project-card flex-shrink-0 relative group/card cursor-pointer" onMouseEnter={() => isProject && onMouseEnter(item.bgColor || '#1d1d1d')} onMouseLeave={onMouseLeave} onClick={() => !isProject && onSelect(item, index)}>
      {isProject ? (
        <Link to={`/project/${item.id}`} className="block transition-all duration-500 w-full md:w-[50vw] lg:w-[40vw] xl:w-[40vw]">
          <div className="rounded-xl overflow-hidden mb-2 md:mb-6 bg-zinc-900 h-[180px] md:h-[40vh] lg:h-[45vh] xl:h-[55vh] w-full relative">
            <img src={resolvePath(item.mainImageUrl)} loading="lazy" className="h-full w-full object-cover dark:group-hover/card:scale-105 transition-all duration-1000" alt={item.client} />
          </div>
          <div className="flex justify-between items-start px-1 w-full">
            <div className="text-left"><h3 className="font-bold text-base md:text-xl lg:text-2xl uppercase tracking-tighter leading-none mb-1">{item.client}</h3><p className="text-[10px] opacity-60 uppercase tracking-widest font-medium">{item.project}</p></div>
            <div className="text-right"><span className="text-[10px] text-purple-600 dark:text-[#c792ff] font-black uppercase tracking-[0.2em]">{item.categories.join(' / ')}</span></div>
          </div>
        </Link>
      ) : (
        <div className="h-[260px] md:h-[40vh] lg:h-[50vh] xl:h-[60vh] w-auto rounded-xl overflow-hidden bg-zinc-900 border border-white/5">
          {isVideo ? <video src={resolvePath(item.src)} muted loop playsInline preload="none" className="h-full w-auto object-contain" onMouseEnter={e => e.target.play()} onMouseLeave={e => e.target.pause()} /> : <img src={resolvePath(item.src)} loading="lazy" className="h-full w-auto object-contain" alt="" />}
        </div>
      )}
    </div>
  );
});

const WorkSection = () => {
  const [activeFilter, setActiveFilter] = useState('ux-branding');
  const [isPaused, setIsPaused] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null); // Track index for navigation
  const scrollContainerRef = useRef(null);
  const pauseTimeoutRef = useRef(null);

  useEffect(() => {
    document.body.classList.toggle('lightbox-open', !!selectedAsset);
    return () => document.body.classList.remove('lightbox-open');
  }, [selectedAsset]);

  const handleSelect = (item, index) => {
    setSelectedAsset(item);
    setSelectedIndex(index);
  };

  const handleCloseModal = () => {
    setSelectedAsset(null);
    setSelectedIndex(null);
  };

  // Lightbox Navigation Logic
  const navigateAsset = (direction, e) => {
    e.stopPropagation();
    const newIndex = direction === 'next'
      ? (selectedIndex + 1) % filteredItems.length
      : (selectedIndex - 1 + filteredItems.length) % filteredItems.length;

    // Only navigate to assets (non-projects)
    const nextItem = filteredItems[newIndex];
    if (nextItem.client === undefined) {
      setSelectedAsset(nextItem);
      setSelectedIndex(newIndex);
    } else {
      // If it's a project, skip it
      setSelectedIndex(newIndex);
      navigateAsset(direction, e);
    }
  };

  const handleScroll = (dir) => {
    setIsPaused(true);
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: (dir === 'left' ? -1 : 1) * window.innerWidth * 0.6, behavior: 'smooth' });
    }
    pauseTimeoutRef.current = setTimeout(() => setIsPaused(false), 8000);
  };

  const filteredItems = useMemo(() => {
    const pMatched = projects.filter(p => activeFilter === 'ux-branding' ? (p.categories.includes('ux-ui') || p.categories.includes('branding')) : (activeFilter === 'packaging-print' ? p.categories.includes('print') : p.categories.includes(activeFilter)));
    const aMap = { 'ux-branding': brandingAssets, 'packaging-print': packagingAssets, 'visual': visuals, 'motion': motionVideos, '3d': threeD, 'experimental': experiments };
    const aMatched = (aMap[activeFilter] || []).map(src => ({ src, id: src }));
    // For indexing, we only use one set (no duplication)
    return [...pMatched, ...aMatched];
  }, [activeFilter]);

  return (
    <section id="work" className="relative h-auto md:h-screen flex flex-col items-center pt-16 pb-8 md:pt-24 md:pb-0 bg-transparent z-10 overflow-hidden justify-center">

      <AnimatePresence>
        {selectedAsset && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/90 backdrop-blur-3xl" onClick={handleCloseModal} />

            {/* CLOSE BUTTON */}
            <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute top-10 right-10 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white z-[250] shadow-2xl active:scale-90" onClick={handleCloseModal}>
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg>
            </motion.button>

            {/* LEFT NAVIGATION BUTTON */}
            <motion.button initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="absolute left-6 md:left-12 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white z-[250] transition-all active:scale-90" onClick={(e) => navigateAsset('prev', e)}>
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" /></svg>
            </motion.button>

            {/* RIGHT NAVIGATION BUTTON */}
            <motion.button initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white z-[250] transition-all active:scale-90" onClick={(e) => navigateAsset('next', e)}>
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" /></svg>
            </motion.button>

            <motion.div key={selectedAsset.src} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative z-[210] max-w-[90vw] max-h-[85vh] pointer-events-none">
              {selectedAsset.src.endsWith('.mp4') ? <video src={resolvePath(selectedAsset.src)} controls autoPlay className="max-h-[85vh] rounded-lg pointer-events-auto shadow-2xl" /> : <img src={resolvePath(selectedAsset.src)} className="max-h-[85vh] object-contain rounded-lg pointer-events-auto shadow-2xl" alt="" />}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-6 md:px-12 lg:px-20 text-center mb-2 md:mb-4">
        <ScrollReveal>
          <h2 className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-2 md:mb-3 uppercase tracking-tighter leading-none text-black dark:!text-white">Featured Work</h2>
        </ScrollReveal>
        <ScrollReveal delay={0.2}>
          <div className="flex flex-col md:flex-row md:flex-wrap justify-center items-stretch md:items-center gap-2.5 md:gap-3 lg:gap-4 w-full max-w-4xl mx-auto">
            {[
              { id: 'ux-branding', label: 'UI / UX and BRANDING' },
              { id: 'packaging-print', label: 'PRINT & PACKAGING' },
              { id: '3d', label: '3D DESIGN' },
              { id: 'visual', label: 'VISUAL DESIGN' },
              { id: 'experimental', label: 'EXPERIMENTAL DESIGN' },
              { id: 'motion', label: 'MOTION DESIGN' }
            ].map(f => (
              <button key={f.id} onClick={() => { setActiveFilter(f.id); setIsPaused(false); }} className={`group relative flex items-center justify-center gap-1.5 px-3.5 py-1.5 md:px-5 md:py-2.5 rounded-full md:rounded-full transition-all duration-500 text-[9px] md:text-[10px] font-black uppercase tracking-widest transform-gpu w-full md:w-auto ${activeFilter === f.id ? 'bg-black text-white dark:bg-white dark:text-black ring-2 ring-transparent dark:ring-1 dark:ring-white scale-105 shadow-lg shadow-purple-500/30' : 'bg-white/5 ring-2 ring-inset ring-black/10 dark:ring-[0.5px] dark:ring-white/50 text-black dark:!text-white hover:bg-black/5 dark:hover:bg-white/10'}`}>
                <span className="relative z-10">{categoryLogos[f.id]}</span><span className="relative z-10">{f.label}</span>
              </button>
            ))}
          </div>
        </ScrollReveal>
      </div>

      {/* Desktop: Horizontal Marquee */}
      <div className="w-full relative group/marquee flex-grow flex-col justify-center hidden md:flex">
        <button onClick={() => handleScroll('left')} className="absolute left-6 md:left-12 top-1/2 -translate-y-1/2 z-50 w-16 h-16 rounded-full border border-black/20 dark:border-white/20 bg-black/5 dark:bg-white/5 backdrop-blur-2xl opacity-0 group-hover/marquee:opacity-100 transition-all duration-500 flex items-center justify-center active:scale-90 shadow-2xl"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6"><path d="M15 18l-6-6 6-6" /></svg></button>
        <button onClick={() => handleScroll('right')} className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 z-50 w-16 h-16 rounded-full border border-black/20 dark:border-white/20 bg-black/5 dark:bg-white/5 backdrop-blur-2xl opacity-0 group-hover/marquee:opacity-100 transition-all duration-500 flex items-center justify-center active:scale-90 shadow-2xl"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6"><path d="M9 18l6-6-6-6" /></svg></button>

        <div className="w-full overflow-hidden">
          <div ref={scrollContainerRef} className="overflow-x-auto no-scrollbar">
            <div
              className={`flex min-w-full w-max gap-12 md:gap-24 px-[5vw] will-change-transform ${!isPaused ? 'animate-marquee-slow' : ''}`}
              style={{ animationPlayState: isPaused ? 'paused' : 'running', animationDuration: `${(filteredItems.length * 2) * SECONDS_PER_ITEM}s` }}
            >
              <AnimatePresence mode="popLayout">
                {[...filteredItems, ...filteredItems].map((item, idx) => (
                  <motion.div
                    key={`${item.id}-${idx}`}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ProjectCard index={idx % filteredItems.length} item={item} onMouseEnter={c => { document.body.style.backgroundColor = c; }} onMouseLeave={() => { document.body.style.backgroundColor = ''; }} onSelect={handleSelect} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: Vertical Block List */}
      <div className="w-full flex-grow flex flex-col justify-start md:hidden px-6 overflow-y-auto">
        <div className="flex flex-col gap-6 pb-8">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, idx) => (
              <motion.div
                key={`${item.id}-mobile`}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="w-full"
              >
                <ProjectCard index={idx} item={item} onMouseEnter={c => { document.body.style.backgroundColor = c; }} onMouseLeave={() => { document.body.style.backgroundColor = ''; }} onSelect={handleSelect} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default WorkSection;