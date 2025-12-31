import React from 'react';

const About = () => (
  <section id="about" className="color-trigger-section pt-0 pb-8 md:py-32 relative z-10" data-bg-color="#000000">
    <div className="container mx-auto px-6">
      <div className="flex flex-col md:flex-row items-center gap-12">
        <div className="w-full md:w-1/2" data-aos="fade-up" data-aos-delay="200">
<img 
    src="/images/about-me.jpg" 
    className="rounded-lg shadow-2xl w-full transition-all duration-700 hover:scale-[1.02]" 
    alt="Portrait" 
/>
        </div>
        <div className="w-full md:w-1/2 space-y-12 mt-8 md:mt-0 text-center md:text-left" data-aos="fade-up">
          <div>
            <h4 className="font-bold text-3xl mb-4 text-white">About</h4>
            <p className="text-gray-400 text-lg leading-relaxed">I'm Nirmal Multi-disciplinary designer based in Dubai. Currently designing beautiful experiences at Google. When I'm not designing stuff you can catch me watching my son's soccer practice, playing Magic: The Gathering, or being disappointed with the Washington Commanders.</p>
          </div>
          <div>
            <h4 className="font-bold text-3xl mb-4 text-white">Current</h4>
            <p className="text-gray-300 text-lg">Lorem ipsum dolor sit amet</p>
          </div>
          <div className="pt-4">
            <a href="resume.pdf" target="_blank" className="inline-block bg-white text-black font-bold uppercase tracking-wider px-10 py-4 rounded-full hover:bg-gray-200 transition-transform hover:scale-105">Download Resume</a>
          </div>
        </div>
      </div>
    </div>
  </section>
);
export default About;
