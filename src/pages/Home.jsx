import React, { useState, useRef, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import Hero from '../components/home/Hero';
import BrandSection from '../components/home/BrandSection';
import WorkSection from '../components/home/WorkSection';
import About from '../components/home/About';
import Contact from '../components/home/Contact';
import Footer from '../components/common/Footer';
import MotionBackground from '../components/background/MotionBackground';
import BottomProgress from '../components/common/BottomProgress';

const Home = () => {
  const [activeSection, setActiveSection] = useState(0);
  const containerRef = useRef(null);
  const sectionRefs = useRef([]);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
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


  const scrollToSection = (index) => {
    if (sectionRefs.current[index]) {
      sectionRefs.current[index].scrollIntoView({ behavior: 'smooth' });
    }
  };

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
        <section ref={el => sectionRefs.current[0] = el} className="snap-section flex justify-center w-full h-full">
          <Hero />
        </section>

        <section ref={el => sectionRefs.current[1] = el} className="snap-section w-full h-full flex flex-col justify-center items-center">
          <BrandSection />
        </section>

        <section ref={el => sectionRefs.current[2] = el} className="snap-section w-full h-full">
          <WorkSection />
        </section>

        <section ref={el => sectionRefs.current[3] = el} className="snap-section w-full h-full flex flex-col justify-center items-center">
          <About />
        </section>

        <section ref={el => sectionRefs.current[4] = el} className="snap-section w-full h-full">
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