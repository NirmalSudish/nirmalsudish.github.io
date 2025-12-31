import React, { useEffect } from 'react';
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
