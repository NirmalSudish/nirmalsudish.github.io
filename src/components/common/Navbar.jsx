import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const logoRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (logoRef.current) {
        // Get scroll position from the snap container or window
        const scrollContainer = document.querySelector('.snap-container');
        const scrollY = scrollContainer ? scrollContainer.scrollTop : window.scrollY;
        const rotation = scrollY / 3;
        logoRef.current.style.transform = `rotate(${rotation}deg)`;
      }
    };

    // Listen to both window scroll and container scroll
    const scrollContainer = document.querySelector('.snap-container');
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
    }
    window.addEventListener('scroll', handleScroll);

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll);
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/0 backdrop-blur-sm transition-all duration-300">
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="focus:outline-none cursor-pointer relative z-50">
            <svg ref={logoRef} className="w-10 h-10 md:w-12 md:h-12 will-change-transform" viewBox="5 10.21 272.38 392.93" xmlns="http://www.w3.org/2000/svg">
              <g>
                <path fill="none" stroke="currentColor" strokeMiterlimit="10" strokeWidth="15" d="M5 21.53v381.61l194.89-178.66-139.48-45.96 43.16-33.49L5 21.53z" />
                <path fill="none" stroke="currentColor" strokeMiterlimit="10" strokeWidth="15" d="M277.38 10.21 60.41 178.52l139.48 45.96-32.3 29.61 109.79 145.17V10.21z" />
              </g>
            </svg>
          </Link>
          <nav className="hidden md:flex items-center space-x-8 relative z-50">
            <a href="/#work" className="font-bold hover:opacity-75 transition-opacity uppercase tracking-widest text-sm cursor-pointer">Work</a>
            <a href="/#about" className="font-bold hover:opacity-75 transition-opacity uppercase tracking-widest text-sm cursor-pointer">About</a>
            <a href="/#contact" className="bg-white text-black font-bold px-6 py-3 rounded-full hover:bg-gray-200 transition-colors uppercase tracking-widest text-sm cursor-pointer flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
              </svg>
              Let's Chat
            </a>
            <ThemeToggle />
          </nav>
          <div className="flex items-center gap-4 md:hidden z-50">
            <ThemeToggle />
            <button onClick={() => setIsOpen(!isOpen)} className="text-white cursor-pointer mix-blend-difference">
              {isOpen ? 'CLOSE' : <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>}
            </button>
          </div>
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
