import React, { useState, useEffect, useRef } from 'react';
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
