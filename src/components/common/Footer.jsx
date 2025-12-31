import React from 'react';

const Footer = () => (
  <footer className="bg-black text-white relative z-20">
    <div className="container mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <p className="text-lg text-gray-500 font-bold">&copy; {new Date().getFullYear()} Nirmal</p>
        <div className="flex mt-4 md:mt-0 space-x-8 text-lg">
          <a href="#" className="text-gray-500 hover:text-white transition-colors">Twitter</a>
          <a href="#" className="text-gray-500 hover:text-white transition-colors">Instagram</a>
          <a href="#" className="text-gray-500 hover:text-white transition-colors">Dribbble</a>
        </div>
      </div>
    </div>
  </footer>
);
export default Footer;
