import React, { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import Navbar from '../components/common/Navbar';
import Hero from '../components/home/Hero';
import BrandSection from '../components/home/BrandSection';
import WorkSection from '../components/home/WorkSection';
import About from '../components/home/About';
import Contact from '../components/home/Contact';
import Footer from '../components/common/Footer';
import MotionBackground from '../components/background/MotionBackground';
import BottomProgress from '../components/common/BottomProgress';

import { useNavigationType } from 'react-router-dom';

const Home = () => {
  // Mobile layout fix: removed h-full from sections to prevent clipping
  const [activeSection, setActiveSection] = useState(0);
  const containerRef = useRef(null);
  const sectionRefs = useRef([]);
  const [isDesktop, setIsDesktop] = useState(false);
  const navType = useNavigationType();
  const saveTimeoutRef = useRef(null);

  // Debounced scroll position save - prevents excessive writes
  const debouncedSaveScroll = useCallback(() => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      const container = containerRef.current;
      if (container) {
        sessionStorage.setItem('homeScrollPosition', container.scrollTop.toString());
      }
    }, 150);
  }, []);

  // Restore and save scroll position
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Restore scroll position only if navigating back (POP)
    const savedPosition = sessionStorage.getItem('homeScrollPosition');
    if (savedPosition && navType === 'POP') {
      container.scrollTop = parseInt(savedPosition, 10);
    }

    // Add scroll listener with passive flag for better scroll performance
    container.addEventListener('scroll', debouncedSaveScroll, { passive: true });

    // Save scroll position on unmount
    return () => {
      container.removeEventListener('scroll', debouncedSaveScroll);
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      // Final save on unmount
      sessionStorage.setItem('homeScrollPosition', container.scrollTop.toString());
    };
  }, [navType, debouncedSaveScroll]);

  // Debounced resize handler
  useEffect(() => {
    let resizeTimeout;
    const checkScreenSize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        setIsDesktop(window.innerWidth >= 1024);
      }, 100);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize, { passive: true });

    return () => {
      window.removeEventListener('resize', checkScreenSize);
      clearTimeout(resizeTimeout);
    };
  }, []);

  // Use IntersectionObserver to track active section
  useEffect(() => {
    if (!isDesktop) return;

    const observerOptions = {
      root: containerRef.current,
      threshold: 0.5, // Trigger when 50% of the section is visible
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = sectionRefs.current.indexOf(entry.target);
          if (index !== -1) {
            setActiveSection(index);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sectionRefs.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, [isDesktop]);


  const scrollToSection = useCallback((index) => {
    if (sectionRefs.current[index]) {
      sectionRefs.current[index].scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <MotionBackground />
      <div className="fixed top-0 left-0 w-full z-50"><Navbar /></div>

      {isDesktop && (
        <BottomProgress
          activeSection={activeSection}
          totalSections={5}
          onLineClick={scrollToSection}
        />
      )}

      {/* Main Container with Scroll Snap */}
      <main
        ref={containerRef}
        className="snap-container no-scrollbar relative z-10 w-full h-full overflow-y-auto scroll-smooth"
      >
        <section ref={el => sectionRefs.current[0] = el} className="snap-section flex justify-center w-full h-[100dvh]">
          <Hero />
        </section>

        <section ref={el => sectionRefs.current[1] = el} className="snap-section w-full flex flex-col justify-center items-center h-[100dvh]">
          <BrandSection />
        </section>

        <section ref={el => sectionRefs.current[2] = el} className="snap-section w-full min-h-[100dvh] flex flex-col justify-center">
          <WorkSection />
        </section>

        <section ref={el => sectionRefs.current[3] = el} className="snap-section w-full flex flex-col justify-center items-center min-h-[100dvh]">
          <About />
        </section>

        <section ref={el => sectionRefs.current[4] = el} className="snap-section w-full h-[100dvh]">
          <div id="contact" className="flex-grow flex items-center justify-center h-full">
            <Contact />
          </div>
          <Footer />
        </section>
      </main>
    </div>
  );
};

export default Home;