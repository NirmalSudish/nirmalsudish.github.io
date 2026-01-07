import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

// 1. Remove AOS imports to keep the project light
import CustomCursor from './components/common/CustomCursor';
import MotionBackground from './components/background/MotionBackground';
import TransitionCurtain from './components/common/TransitionCurtain';

import Home from './pages/Home';
import ProjectDetail from './pages/ProjectDetail';

const AppContent = () => {
  const location = useLocation();

  useEffect(() => {
    // Keep window scroll to top on route change
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      <CustomCursor />
      {/* key triggers the curtain animation on every path change */}
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