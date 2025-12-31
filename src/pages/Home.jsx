import React from 'react';
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
