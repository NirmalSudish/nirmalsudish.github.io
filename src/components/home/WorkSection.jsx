import React, { useState, useMemo, useEffect, memo, useRef } from 'react';
import { createPortal } from 'react-dom'; 
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion'; 
import { projects, visuals, threeD, motionVideos, experiments, brandingAssets, packagingAssets } from '../../data/portfolioData';

const filters = [
  { id: 'ux-branding', label: 'UI / UX and BRANDING' }, 
  { id: 'packaging-print', label: 'Print/Packaging' }, 
  { id: 'visual', label: 'Visual Design' },
  { id: '3d', label: '3D Design' },
  { id: 'motion', label: 'Motion Design' },
  { id: 'experiments', label: 'Experiential Design' }
];

const ProjectCard = memo(({ item, isBigCategory, activeFilter, onMouseEnter, onMouseLeave, onSelect }) => {
  return (
    <div 
      className="project-card flex-shrink-0 relative group/card"
      onMouseEnter={() => onMouseEnter(item.bgColor)}
      onMouseLeave={onMouseLeave}
    >
      {item.type === 'project' ? (
        <Link 
          to={`/project/${item.id}`} 
          className={`block text-white h-full cursor-pointer transition-all duration-500 ${isBigCategory ? 'w-[90vw] md:w-[700px]' : 'w-[85vw] md:w-[500px]'}`}
        >
          <div className={`card-image-container w-full overflow-hidden rounded-xl mb-4 relative bg-zinc-900 shadow-2xl transition-all duration-500 ${isBigCategory ? 'h-[320px] md:h-[450px]' : 'h-[280px] md:h-[350px]'}`}>
            <img src={item.mainImageUrl} className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-700 ease-out" alt={item.client} loading="lazy" />
          </div>
          <div className="space-y-1 px-2 text-left">
            <div className="flex justify-between items-start mb-1">
               <p className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-gray-400 font-bold">{item.project}</p>
               <p className="text-[10px] md:text-xs text-gray-500 font-medium">{item.year}</p>
            </div>
            <h3 className="font-black leading-tight text-white text-xl md:text-3xl uppercase tracking-tighter">{item.client}</h3>
            <p className="text-xs md:text-sm text-gray-400 font-medium italic opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">{item.role}</p>
          </div>
        </Link>
      ) : (
        <div className="flex flex-col" onClick={() => onSelect(item)}>
            <div className={`w-auto cursor-pointer hover:opacity-90 transition-all duration-500 hover:scale-[1.03] mb-4 ${['packaging-print', 'ux-branding', 'motion', 'visual', 'experiments', '3d'].includes(activeFilter) ? 'h-[400px] md:h-[600px]' : 'h-[280px] md:h-[350px]'}`}>
            {item.type === 'video' ? (
                <video src={item.src} autoPlay muted loop playsInline preload="metadata" className="h-full w-auto rounded-lg object-contain bg-zinc-900 shadow-xl" />
            ) : (
                <img src={item.src} className="h-full w-auto rounded-lg object-contain bg-zinc-900 shadow-xl" alt="" loading="lazy" />
            )}
            </div>
            <div className="px-2">
                <p className="text-[10px] uppercase tracking-widest text-gray-600 font-bold">{activeFilter.replace('-', ' ')} Asset</p>
            </div>
        </div>
      )}
    </div>
  );
});

const WorkSection = () => {
  const [activeFilter, setActiveFilter] = useState('ux-branding');
  const [selectedItem, setSelectedItem] = useState(null);
  const [isManual, setIsManual] = useState(false); // Controls the auto-stop
  const scrollContainerRef = useRef(null);

  const isBigCategory = ['ux-branding', 'packaging-print'].includes(activeFilter);

  // Stop auto-movement and scroll manually
  const scroll = (direction) => {
    setIsManual(true); // Stop the marquee
    if (scrollContainerRef.current) {
      const scrollAmount = window.innerWidth * 0.4;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Reset to auto-mode when filter changes
  useEffect(() => {
    setIsManual(false);
  }, [activeFilter]);

  const filteredItems = useMemo(() => {
    const matchingProjects = projects.filter(p => {
        if (activeFilter === 'ux-branding') return p.categories.includes('ux-ui') || p.categories.includes('branding');
        if (activeFilter === 'packaging-print') return p.categories.includes('packaging') || p.categories.includes('print');
        return p.categories.includes(activeFilter);
    }).map(p => ({ ...p, type: 'project' }));

    let matchingAssets = [];
    if (activeFilter === 'ux-branding') matchingAssets = brandingAssets?.map((src, i) => ({ id: `brand-asset-${i}`, src, type: 'img' })) || [];
    else if (activeFilter === 'packaging-print') matchingAssets = packagingAssets?.map((src, i) => ({ id: `pack-asset-${i}`, src, type: 'img' })) || [];
    else if (activeFilter === 'visual') matchingAssets = visuals?.map((src, i) => ({ id: `vis-${i}`, src, type: 'img' })) || [];
    else if (activeFilter === '3d') matchingAssets = threeD?.map((src, i) => ({ id: `3d-${i}`, src, type: 'img' })) || [];
    else if (activeFilter === 'motion') matchingAssets = motionVideos?.map((src, i) => ({ id: `mot-${i}`, src, type: 'video' })) || [];
    else if (activeFilter === 'experiments') matchingAssets = experiments?.map((src, i) => ({ id: `exp-${i}`, src, type: 'img' })) || [];

    let items = [...matchingProjects, ...matchingAssets];
    if (items.length === 0) return [];

    let loopItems = [...items];
    if (loopItems.length > 0 && loopItems.length < 10) {
        while (loopItems.length < 10) { loopItems = [...loopItems, ...items]; }
    }
    // We only double the items for auto-marquee. If manual, single list is cleaner.
    return isManual ? loopItems : [...loopItems, ...loopItems];
  }, [activeFilter, isManual]);

  const dynamicDuration = useMemo(() => {
    return Math.max(filteredItems.length * 15, 20); 
  }, [filteredItems.length]);

  return (
    <section id="work" className="relative pt-0 pb-8 md:py-24 min-h-screen flex flex-col justify-center bg-transparent z-10">
      <div className="container mx-auto px-6 pt-0 md:pt-24 z-20 relative text-center">
        <h2 className="text-5xl md:text-8xl font-black text-white mb-8 md:mb-16 uppercase tracking-tighter leading-none">Featured Work</h2>
        <div className="flex justify-center w-full mb-8 md:mb-16">
          <div className="flex flex-wrap justify-center gap-4 w-full">
            {filters.map(f => (
              <button key={f.id} onClick={() => { setActiveFilter(f.id); setIsManual(false); }}
                className={`px-4 py-2 md:px-6 md:py-3 rounded-full border transition-all text-sm md:text-base font-bold uppercase cursor-pointer ${activeFilter === f.id ? 'bg-white text-black border-white' : 'border-gray-600 text-gray-400 hover:text-white'}`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full overflow-hidden py-8 group/marquee relative z-10 min-h-[400px]">
        {/* Left Circular Glass Button */}
        <button 
          onClick={() => scroll('left')}
          className="absolute left-6 top-1/2 -translate-y-1/2 z-50 w-16 h-16 md:w-20 md:h-20 flex items-center justify-center rounded-full glass-round-btn opacity-0 group-hover/marquee:opacity-100 transition-all duration-500 active:scale-90"
        >
          <svg className="w-6 h-6 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
        </button>

        {/* Right Circular Glass Button */}
        <button 
          onClick={() => scroll('right')}
          className="absolute right-6 top-1/2 -translate-y-1/2 z-50 w-16 h-16 md:w-20 md:h-20 flex items-center justify-center rounded-full glass-round-btn opacity-0 group-hover/marquee:opacity-100 transition-all duration-500 active:scale-90"
        >
          <svg className="w-6 h-6 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
        </button>

        <AnimatePresence mode="wait">
          {filteredItems.length > 0 ? (
            <motion.div 
              key={activeFilter + isManual} 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              ref={scrollContainerRef}
              className="overflow-x-auto no-scrollbar"
            >
              <div 
                style={!isManual ? { animationDuration: `${dynamicDuration}s`, animationTimingFunction: 'linear' } : {}}
                className={`flex w-max gap-10 md:gap-24 px-10 ${!isManual ? 'animate-marquee' : ''}`}
              >
                {filteredItems.map((item, idx) => (
                  <ProjectCard 
                    key={`${item.id}-${idx}`} 
                    item={item} 
                    isBigCategory={isBigCategory} 
                    activeFilter={activeFilter} 
                    onMouseEnter={(color) => { if(color) document.body.style.backgroundColor = color }}
                    onMouseLeave={() => document.body.style.backgroundColor = '#111111'}
                    onSelect={setSelectedItem}
                  />
                ))}
              </div>
            </motion.div>
          ) : (
            <div className="text-white text-center opacity-50">Coming Soon...</div>
          )}
        </AnimatePresence>
      </div>

      {createPortal(
        <AnimatePresence>
          {selectedItem && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[99999] bg-black/95 flex items-center justify-center p-4"
              onClick={() => setSelectedItem(null)}
            >
              <div className="relative max-h-[85vh] max-w-screen" onClick={(e) => e.stopPropagation()}>
                {selectedItem.type === 'video' ? (
                  <video src={selectedItem.src} controls autoPlay className="max-h-[85vh] w-auto rounded-lg" />
                ) : (
                  <img src={selectedItem.src} alt="" className="max-h-[85vh] w-auto rounded-lg" />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </section>
  );
};

export default WorkSection;