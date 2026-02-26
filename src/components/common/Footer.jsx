import React from 'react';

const Footer = () => (
  <footer className="w-full text-black dark:text-white relative z-20">
    <div className="container mx-auto px-6 md:px-12 lg:px-20 py-12">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <p className="text-lg font-bold text-gray-500 dark:text-white">&copy; {new Date().getFullYear()} Nirmal</p>
        <div className="flex mt-4 md:mt-0 space-x-8 text-lg font-bold">
          <a href="https://www.linkedin.com/in/nirmalsudish/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-black dark:text-white dark:hover:text-gray-300 transition-colors">LinkedIn</a>
          <a href="https://www.instagram.com/nirmellow/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-black dark:text-white dark:hover:text-gray-300 transition-colors">Instagram</a>
          <a href="https://www.behance.net/nirmalsudish" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-black dark:text-white dark:hover:text-gray-300 transition-colors">Behance</a>
        </div>
      </div>
    </div>
  </footer>
);
export default Footer;
