import React, { useState, useMemo, memo, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { resolvePath, getOptimizedImagePath, getFallbackImagePath } from '../../utils/imagePath';
import { AnimatePresence, motion } from 'framer-motion';
import ScrollReveal from '../common/ScrollReveal';
import {
  projects, visuals, motionVideos, threeD,
  experiments, brandingAssets, packagingAssets
} from '../../data/portfolioData';

const SECONDS_PER_ITEM = 12;

const categoryLogos = {
  'ux-branding': (<svg className="w-3 h-3 md:w-5 md:h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8m-4-4v4" /></svg>),
  'packaging-print': (<svg className="w-3 h-3 md:w-5 md:h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M21 8l-9-4-9 4m18 0l-9 4m9-4v8l-9 4m0-12L3 8m9 4v8m-9-12v8l9 4" /></svg>),
  'visual': (<svg className="w-3 h-3 md:w-5 md:h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><path d="M21 15l-5-5L5 21" /></svg>),
  '3d': (<svg className="w-3 h-3 md:w-5 md:h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 2L3 7v10l9 5 9-5V7l-9-5zM12 22V12M21 7l-9 5L3 7" /></svg>),
  'motion': (<svg className="w-3 h-3 md:w-5 md:h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3" /></svg>),
  'experimental': (<svg className="w-3 h-3 md:w-5 md:h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M9 3h6M10 3v7l-4 8a2 2 0 002 2h8a2 2 0 002-2l-4-8V3" /></svg>)
};

// Mobile-optimized card component for the gallery slider
// CRITICAL: Videos are NOT preloaded to prevent memory crashes on mobile
const MobileProjectCard = memo(({ item, onSelect, index, isVisible = false, isPreload = false }) => {
  const isProject = item.client !== undefined;
  const isVideo = typeof item.src === 'string' && item.src.endsWith('.mp4');
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);

  const mediaSrc = isProject ? item.mainImageUrl : item.src;

  // Handle visibility and preloading
  useEffect(() => {
    if (isVisible && !hasLoaded) {
      setHasLoaded(true);
      setIsLoading(false);
    }
  }, [isVisible, hasLoaded]);

  // Handle tap for videos - Open full screen modal
  const handleVideoTap = (e) => {
    e.stopPropagation();
    onSelect(item, index);
  };

  // Render preload cards invisibly (for background loading)
  if (isPreload) {
    // Skip rendering for preload items to save memory
    return null;
  }

  return (
    <div
      className="mobile-project-card w-full flex flex-col items-center cursor-pointer px-2"
      onClick={() => !isProject && !isVideo && onSelect(item, index)}
    >
      {/* Media Container */}
      <div className="w-full rounded-2xl overflow-hidden bg-zinc-900/50 border border-white/10 relative">

        {/* Only render media if visible (lazy loading) */}
        {hasLoaded ? (
          isVideo ? (
            <div className="relative" onClick={handleVideoTap}>
              {/* Video preview - adapts to portrait/landscape aspect ratio */}
              <div className={`w-full bg-zinc-900 flex items-center justify-center overflow-hidden rounded-lg relative ${isLoading ? 'aspect-video' : ''}`}>
                <video
                  src={resolvePath(mediaSrc)}
                  muted
                  playsInline
                  preload="metadata"
                  className="w-full h-auto max-h-[50vh] object-contain"
                  onLoadedMetadata={(e) => {
                    // Force a seek to render the first frame on iOS/mobile
                    e.target.currentTime = 0.1;
                  }}
                  onSeeked={() => setIsLoading(false)}
                  onLoadedData={() => setIsLoading(false)}
                />
                {/* Loading indicator while video metadata loads */}
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
                    <div className="w-8 h-8 border-2 border-white/20 border-t-purple-500 rounded-full animate-spin" />
                  </div>
                )}
              </div>
              {/* Play button overlay - always visible for tap to open modal */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center border border-white/40 active:scale-90 shadow-xl">
                  <svg className="w-7 h-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>
          ) : (
            <img
              src={getOptimizedImagePath(mediaSrc)}
              onLoad={() => setIsLoading(false)}
              onError={(e) => { e.target.src = getFallbackImagePath(mediaSrc); }}
              loading="lazy"
              decoding="async"
              className={`w-full h-auto max-h-[45vh] object-contain transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
              alt={isProject ? item.client : ''}
              onClick={() => !isProject && onSelect(item, index)}
            />
          )
        ) : (
          // Placeholder before lazy load
          <div className="w-full aspect-video bg-zinc-800/30 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-white/10 border-t-purple-500/50 rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Text Content */}
      {isProject ? (
        <Link to={`/project/${item.id}`} className="block w-full mt-4 px-2">
          <div className="flex flex-col gap-1 text-center">
            <h3 className="font-bold text-sm uppercase tracking-tight leading-tight text-black dark:text-white line-clamp-2">
              {item.client}
            </h3>
            <p className="text-[10px] opacity-60 uppercase tracking-wide font-medium line-clamp-1">
              {item.project}
            </p>
            <span className="text-[9px] text-purple-600 dark:text-purple-400 font-bold uppercase tracking-wider mt-1">
              {item.categories.join(' / ')}
            </span>
          </div>
        </Link>
      ) : (
        <div className="mt-3 text-center">
          <span className="text-[10px] text-white/40 uppercase tracking-wider">
            {isVideo ? 'Tap to load & play' : 'Tap to view full size'}
          </span>
        </div>
      )}
    </div>
  );
});

// Desktop card component - OPTIMIZED with IntersectionObserver for videos
const ProjectCard = memo(({ item, onMouseEnter, onMouseLeave, onSelect, index, priority = false }) => {
  const isProject = item.client !== undefined;
  const isVideo = typeof item.src === 'string' && item.src.endsWith('.mp4');
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  // IntersectionObserver for lazy video loading and playback
  useEffect(() => {
    if (!isVideo || isProject) return;

    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);

        if (entry.isIntersecting) {
          // Only play when visible
          video.play().catch(() => { });
        } else {
          // Pause and reset when not visible to save memory
          video.pause();
        }
      },
      { threshold: 0.3, rootMargin: '50px' }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [isVideo, isProject]);

  // Reverted to previous specific dimensions as requested
  return (
    <div
      ref={containerRef}
      className="project-card flex-shrink-0 relative group/card cursor-pointer"
      onMouseEnter={() => isProject && onMouseEnter(item.bgColor || '#1d1d1d')}
      onMouseLeave={onMouseLeave}
      onClick={() => !isProject && onSelect(item, index)}
    >
      {isProject ? (
        <Link to={`/project/${item.id}`} className="block transition-all duration-500 w-full md:w-[60vw] lg:w-[50vw] xl:w-[45vw] 2xl:w-[40vw] max-w-[850px]">
          {/* Main Image Container - Increased width ratio for rectangular look */}
          <div className="rounded-xl overflow-hidden mb-3 md:mb-6 bg-zinc-900 aspect-video md:aspect-auto h-auto max-h-[30vh] md:max-h-none md:h-[35vh] lg:h-[40vh] xl:h-[45vh] 2xl:h-[48vh] w-full relative border border-white/5">
            <img
              src={resolvePath(item.mainImageUrl)}
              loading="lazy"
              className="h-full w-full object-contain md:object-cover transition-transform duration-1000 dark:group-hover/card:scale-105"
              alt={item.client}
            />
          </div>

          {/* Text Content - Restored previous layout */}
          <div className="flex justify-between items-start px-1 w-full">
            <div className="text-left">
              <h3 className="font-bold text-base md:text-xl lg:text-2xl uppercase tracking-tighter leading-none mb-1 text-black dark:text-white">{item.client}</h3>
              <p className="text-[10px] opacity-60 uppercase tracking-widest font-medium text-black dark:text-white">{item.project}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-purple-600 dark:text-[#c792ff] font-black uppercase tracking-[0.2em]">{item.categories.join(' / ')}</span>
            </div>
          </div>
        </Link>
      ) : (
        <div className="h-[30vh] md:h-[35vh] lg:h-[40vh] xl:h-[45vh] 2xl:h-[48vh] w-full md:w-auto rounded-xl overflow-hidden bg-zinc-900 border border-white/5 relative flex items-center justify-center">
          {/* Non-project asset (Video/Image) */}
          {isVideo ? (
            <>
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center z-0">
                  <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                </div>
              )}
              <video
                ref={videoRef}
                src={isVisible ? resolvePath(item.src) : undefined}
                muted
                loop
                playsInline
                preload="none"
                onLoadedData={() => setIsLoading(false)}
                onWaiting={() => setIsLoading(true)}
                onPlaying={() => setIsLoading(false)}
                className={`w-full h-auto md:h-full md:w-auto md:object-contain relative z-10 transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
              />
            </>
          ) : (
            <img
              src={resolvePath(item.src)}
              loading={priority ? "eager" : "lazy"}
              className="w-full h-auto md:h-full md:w-auto md:object-contain"
              alt=""
            />
          )}
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
  const [mobileGalleryIndex, setMobileGalleryIndex] = useState(0); // Track mobile gallery position
  const scrollContainerRef = useRef(null);
  const pauseTimeoutRef = useRef(null);
  const mobileAutoAdvanceRef = useRef(null); // Ref for mobile auto-advance interval

  // Swipe State
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

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
      scrollContainerRef.current.scrollBy({ left: (dir === 'left' ? -1 : 1) * window.innerWidth * 0.4, behavior: 'smooth' });
    }
    // Resume auto-scroll after interaction
    pauseTimeoutRef.current = setTimeout(() => setIsPaused(false), 5000);
  };

  // Define filteredItems FIRST (before any hooks/functions that reference it)
  const filteredItems = useMemo(() => {
    const pMatched = projects.filter(p => activeFilter === 'ux-branding' ? (p.categories.includes('ux-ui') || p.categories.includes('branding')) : (activeFilter === 'packaging-print' ? p.categories.includes('print') : p.categories.includes(activeFilter)));
    const aMap = { 'ux-branding': brandingAssets, 'packaging-print': packagingAssets, 'visual': visuals, 'motion': motionVideos, '3d': threeD, 'experimental': experiments };
    const aMatched = (aMap[activeFilter] || []).map(src => ({ src, id: src }));
    // For indexing, we only use one set (no duplication)
    return [...pMatched, ...aMatched];
  }, [activeFilter]);

  // Helper to reset mobile auto-advance timer
  const resetMobileAutoAdvance = () => {
    if (mobileAutoAdvanceRef.current) {
      clearInterval(mobileAutoAdvanceRef.current);
    }
    // Disable auto-advance for Motion Design category (user request)
    if (activeFilter === 'motion') return;

    if (filteredItems.length > 0) {
      mobileAutoAdvanceRef.current = setInterval(() => {
        setMobileGalleryIndex((prev) => (prev + 1) % filteredItems.length);
      }, 10000);
    }
  };

  // Mobile Gallery Navigation - resets auto-advance on user interaction
  const handleMobileGalleryNav = (direction) => {
    if (direction === 'next') {
      setMobileGalleryIndex((prev) => (prev + 1) % filteredItems.length);
    } else {
      setMobileGalleryIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
    }
    // Reset auto-advance timer when user manually navigates
    resetMobileAutoAdvance();
  };

  // Touch/Swipe Handlers for Mobile Gallery
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 75;
    const isRightSwipe = distance < -75;

    if (isLeftSwipe) {
      handleMobileGalleryNav('next');
    }
    if (isRightSwipe) {
      handleMobileGalleryNav('prev');
    }
  };

  // Reset mobile gallery index when filter changes
  useEffect(() => {
    setMobileGalleryIndex(0);
  }, [activeFilter]);

  // Auto-advance mobile gallery every 10 seconds
  useEffect(() => {
    if (filteredItems.length === 0) return;

    // Disable auto-advance for Motion Design category (user request)
    if (activeFilter === 'motion') return;

    // Start the auto-advance interval
    mobileAutoAdvanceRef.current = setInterval(() => {
      setMobileGalleryIndex((prev) => (prev + 1) % filteredItems.length);
    }, 10000);

    // Cleanup on unmount or when filteredItems changes
    return () => {
      if (mobileAutoAdvanceRef.current) {
        clearInterval(mobileAutoAdvanceRef.current);
      }
    };
  }, [filteredItems.length, activeFilter]);

  return (
    <section id="work" className="relative h-[100dvh] flex flex-col items-center pt-24 pb-4 md:pt-20 md:pb-0 lg:pt-24 bg-transparent z-10 overflow-hidden justify-center">

      <AnimatePresence>
        {selectedAsset && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center">
            {/* Modal backdrop - NO blur on mobile for performance */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/95 md:bg-black/90 md:backdrop-blur-xl" onClick={handleCloseModal} />

            {/* CLOSE BUTTON - Adjusted for mobile */}
            <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute top-4 right-4 md:top-10 md:right-10 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white z-[250] shadow-2xl active:scale-90" onClick={handleCloseModal}>
              <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg>
            </motion.button>

            {/* LEFT NAVIGATION BUTTON */}
            <motion.button initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="absolute left-2 md:left-12 top-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white z-[250] transition-all active:scale-90" onClick={(e) => navigateAsset('prev', e)}>
              <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" /></svg>
            </motion.button>

            {/* RIGHT NAVIGATION BUTTON */}
            <motion.button initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="absolute right-2 md:right-12 top-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white z-[250] transition-all active:scale-90" onClick={(e) => navigateAsset('next', e)}>
              <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" /></svg>
            </motion.button>

            {/* Video/Image Container - Optimized for mobile */}
            <motion.div key={selectedAsset.src} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="relative z-[210] w-full md:w-auto md:max-w-[90vw] max-h-[80vh] md:max-h-[85vh] px-4 md:px-0 flex items-center justify-center">
              {selectedAsset.src.endsWith('.mp4') ? (
                <video
                  src={resolvePath(selectedAsset.src)}
                  controls
                  playsInline
                  muted
                  autoPlay
                  preload="metadata"
                  className="w-full h-auto max-h-[75vh] md:max-h-[85vh] object-contain rounded-lg pointer-events-auto shadow-2xl bg-black"
                />
              ) : (
                <img src={resolvePath(selectedAsset.src)} className="w-full h-auto max-h-[80vh] md:max-h-[85vh] object-contain rounded-lg pointer-events-auto shadow-2xl" alt="" />
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 md:px-12 lg:px-20 text-center mb-4 md:mb-12">
        <ScrollReveal className="mb-3 md:mb-10 lg:mb-12 xl:mb-14">
          <h2 className="text-2xl md:text-5xl lg:text-6xl xl:text-7xl font-black uppercase tracking-tighter leading-none text-black dark:!text-white">Featured Work</h2>
        </ScrollReveal>
        <ScrollReveal delay={0.2}>
          <div className="grid grid-cols-2 md:flex md:flex-row md:flex-wrap justify-center items-stretch md:items-center gap-2 md:gap-3 lg:gap-4 w-full max-w-4xl mx-auto">
            {[
              { id: 'ux-branding', label: 'UI / UX and BRANDING' },
              { id: 'packaging-print', label: 'PRINT & PACKAGING' },
              { id: '3d', label: '3D DESIGN' },
              { id: 'visual', label: 'VISUAL DESIGN' },
              { id: 'experimental', label: 'EXPERIMENTAL DESIGN' },
              { id: 'motion', label: 'MOTION DESIGN' }
            ].map(f => (
              <button key={f.id} onClick={() => { setActiveFilter(f.id); setIsPaused(false); }} className={`group relative flex items-center justify-center gap-0.5 md:gap-1.5 px-1.5 py-1 md:px-5 md:py-2.5 rounded-full transition-all duration-500 text-[7px] md:text-[10px] font-black uppercase tracking-wider md:tracking-widest transform-gpu md:w-auto ${activeFilter === f.id ? 'bg-black text-white dark:bg-white dark:text-black ring-2 ring-transparent dark:ring-1 dark:ring-white scale-105 shadow-lg shadow-purple-500/30' : 'bg-white/5 ring-2 ring-inset ring-black/10 dark:ring-[0.5px] dark:ring-white/50 text-black dark:!text-white hover:bg-black/5 dark:hover:bg-white/10'}`}>
                <span className="relative z-10">{categoryLogos[f.id]}</span><span className="relative z-10">{f.label}</span>
              </button>
            ))}
          </div>
        </ScrollReveal>
      </div>

      {/* Desktop: Horizontal Marquee - SMOOTH & STABLE */}
      <div className="w-full relative group/marquee flex-grow flex-col justify-center hidden md:flex overflow-hidden">
        {/* Navigation Buttons for Manual Scroll */}
        <button onClick={() => handleScroll('left')} className="absolute left-6 md:left-12 top-1/2 -translate-y-1/2 z-50 w-16 h-16 rounded-full border border-black/20 dark:border-white/20 bg-black/5 dark:bg-white/5 backdrop-blur-2xl opacity-0 group-hover/marquee:opacity-100 transition-all duration-500 flex items-center justify-center active:scale-90 shadow-2xl hover:bg-white/10"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6 text-white"><path d="M15 18l-6-6 6-6" /></svg></button>
        <button onClick={() => handleScroll('right')} className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 z-50 w-16 h-16 rounded-full border border-black/20 dark:border-white/20 bg-black/5 dark:bg-white/5 backdrop-blur-2xl opacity-0 group-hover/marquee:opacity-100 transition-all duration-500 flex items-center justify-center active:scale-90 shadow-2xl hover:bg-white/10"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6 text-white"><path d="M9 18l6-6-6-6" /></svg></button>

        <div ref={scrollContainerRef} className="w-full overflow-x-auto no-scrollbar flex items-center h-full">
          <div
            className="flex gap-8 md:gap-16 px-[5vw] h-max"
            style={{
              /* Use CSS Animation for silky smooth auto-scroll */
              animation: isPaused ? 'none' : `marquee ${filteredItems.length * 15}s linear infinite`,
              width: 'max-content'
            }}
          >
            {/* Duplicate items for infinite loop illusion */}
            {[...filteredItems, ...filteredItems, ...filteredItems].map((item, idx) => (
              <ProjectCard
                key={`${item.id}-${idx}`}
                index={idx}
                item={item}
                onMouseEnter={c => { document.body.style.backgroundColor = c; }}
                onMouseLeave={() => { document.body.style.backgroundColor = ''; }}
                onSelect={handleSelect}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Mobile: Mini Gallery/Slider with Navigation */}
      <div className="w-full flex-grow flex flex-col justify-center md:hidden relative px-4">
        {filteredItems.length > 0 && (
          <>
            {/* Gallery Container with Navigation */}
            <div
              className="relative w-full"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              {/* Left Navigation Button */}
              <button
                onClick={() => handleMobileGalleryNav('prev')}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-50 w-10 h-10 rounded-full border border-black/20 dark:border-white/30 bg-white/90 dark:bg-black/70 backdrop-blur-xl flex items-center justify-center active:scale-90 transition-all shadow-xl -translate-x-1"
                aria-label="Previous item"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>

              {/* Right Navigation Button */}
              <button
                onClick={() => handleMobileGalleryNav('next')}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-50 w-10 h-10 rounded-full border border-black/20 dark:border-white/30 bg-white/90 dark:bg-black/70 backdrop-blur-xl flex items-center justify-center active:scale-90 transition-all shadow-xl translate-x-1"
                aria-label="Next item"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>

              {/* Gallery Slide Area */}
              <div className="w-full px-8 overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`mobile-${filteredItems[mobileGalleryIndex]?.id}-${mobileGalleryIndex}`}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="w-full"
                  >
                    <MobileProjectCard
                      index={mobileGalleryIndex}
                      item={filteredItems[mobileGalleryIndex]}
                      isVisible={true}
                      onSelect={handleSelect}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Pagination Indicator */}
            <div className="flex flex-col items-center gap-3 mt-4 pb-4">
              {/* Progress Bar Style Pagination */}
              <div className="flex items-center gap-1.5 max-w-[280px] overflow-x-auto no-scrollbar">
                {filteredItems.length <= 10 ? (
                  // Dots for small number of items - smaller size
                  filteredItems.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setMobileGalleryIndex(idx)}
                      className={`transition-all duration-300 rounded-full flex-shrink-0 min-w-0 min-h-0 ${idx === mobileGalleryIndex
                        ? 'w-4 h-1.5 bg-purple-500'
                        : 'w-1.5 h-1.5 bg-black/20 dark:bg-white/30 hover:bg-black/40 dark:hover:bg-white/50'
                        }`}
                      aria-label={`Go to item ${idx + 1}`}
                    />
                  ))
                ) : (
                  // Numeric indicator for many items
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-purple-500 font-bold">{mobileGalleryIndex + 1}</span>
                    <span className="text-black/40 dark:text-white/40">/</span>
                    <span className="text-black/60 dark:text-white/60">{filteredItems.length}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Hidden Preloader: Pre-fetch next item for instant playback */}
            <div className="hidden" aria-hidden="true">
              {[
                (mobileGalleryIndex + 1) % filteredItems.length
              ].map(nextIdx => {
                const item = filteredItems[nextIdx];
                if (!item) return null;
                // Preload next item (including videos) for instant playback
                return (
                  <MobileProjectCard
                    key={`preload-${nextIdx}`}
                    index={nextIdx}
                    item={item}
                    isVisible={true}
                    isPreload={true}
                    onSelect={() => { }}
                  />
                );
              })}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default WorkSection;