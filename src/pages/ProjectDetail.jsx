import React, { useEffect, useRef, useState } from 'react'; // Added useState
import { useParams, Link, useNavigate } from 'react-router-dom';
import { resolvePath } from '../utils/imagePath';
import { projects } from '../data/portfolioData';
import { motion, AnimatePresence } from 'framer-motion'; // Added Framer Motion for the button
import ScrollReveal from '../components/common/ScrollReveal';

const ProjectDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const project = projects.find(p => p.id.toString() === id);
    const footerRef = useRef(null);
    const projectLogoRef = useRef(null);

    // State for Back to Top button visibility
    const [showTopBtn, setShowTopBtn] = useState(false);

    useEffect(() => {
        if (!project) {
            navigate('/');
            return;
        }

        const updateBackgroundColor = () => {
            const isDark = document.documentElement.classList.contains('dark');
            // If in light mode, clear inline style to let CSS var(--bg-primary) take over (White)
            // If in dark mode, apply project color
            if (!isDark) {
                document.body.style.backgroundColor = '';
            } else {
                document.body.style.backgroundColor = project.bgColor;
            }
        };

        // Initial apply
        updateBackgroundColor();
        window.scrollTo(0, 0);

        // Listen for theme changes
        const themeObserver = new MutationObserver(updateBackgroundColor);
        themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const isDark = document.documentElement.classList.contains('dark');
                if (!isDark) {
                    document.body.style.backgroundColor = '';
                    return;
                }

                if (entry.isIntersecting) {
                    document.body.style.backgroundColor = '#111111';
                } else {
                    document.body.style.backgroundColor = project.bgColor;
                }
            });
        }, { threshold: 0.1 });

        if (footerRef.current) observer.observe(footerRef.current);

        const handleScroll = () => {
            // Handle rotation logic
            if (projectLogoRef.current) {
                const rotation = window.scrollY / 3;
                projectLogoRef.current.style.transform = `rotate(${rotation}deg)`;
            }

            // Handle Back to Top visibility
            if (window.scrollY > 600) {
                setShowTopBtn(true);
            } else {
                setShowTopBtn(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            observer.disconnect();
            themeObserver.disconnect();
            window.removeEventListener('scroll', handleScroll);
            document.body.style.backgroundColor = '';
        };
    }, [project, navigate]);

    if (!project) return null;

    const nextProjectId = (parseInt(id) + 1) % projects.length;
    const prevProjectId = (parseInt(id) - 1 + projects.length) % projects.length;

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div id="project-detail-view" className="min-h-screen text-black dark:text-white relative z-20">
            <header className="fixed top-0 left-0 right-0 z-50 mix-blend-difference w-full pointer-events-none">
                <div className="container mx-auto px-6 py-6 flex justify-between items-center pointer-events-auto">
                    <Link
                        to="/"
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="text-black dark:text-white hover:opacity-75 transition-opacity cursor-pointer"
                    >
                        <svg ref={projectLogoRef} className="w-10 h-10 will-change-transform" viewBox="5 10.21 272.38 392.93" xmlns="http://www.w3.org/2000/svg">
                            <path fill="none" stroke="currentColor" strokeMiterlimit="10" strokeWidth="15" d="M5 21.53v381.61l194.89-178.66-139.48-45.96 43.16-33.49L5 21.53z" />
                            <path fill="none" stroke="currentColor" strokeMiterlimit="10" strokeWidth="15" d="M277.38 10.21 60.41 178.52l139.48 45.96-32.3 29.61 109.79 145.17V10.21z" />
                        </svg>
                    </Link>
                    <Link
                        to="/#work"
                        onClick={(e) => {
                            e.preventDefault();
                            navigate('/');
                            setTimeout(() => {
                                const scrollContainer = document.querySelector('.snap-container');
                                if (scrollContainer) {
                                    scrollContainer.scrollTo({ top: 2 * window.innerHeight, behavior: 'auto' });
                                }
                            }, 100);
                        }}
                        className="text-black dark:text-white hover:scale-110 transition-transform cursor-pointer"
                    >
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </Link>
                </div>
            </header>

            <div className="pt-32 pb-20">
                <div className="container mx-auto max-w-7xl text-center">
                    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 sm:px-8">
                        <ScrollReveal>
                            <div className="max-w-4xl w-full">
                                {project.client !== 'Icons of Kerala' && (
                                    <img
                                        src={resolvePath(project.logoUrl)}
                                        alt="Logo"
                                        className={`
                                    ${project.client === 'Northern Escape' ? 'h-80' :
                                                project.client === 'Goldie Bun' ? 'h-[500px]' :
                                                    project.client === 'Abu Crispy' ? 'h-96' :
                                                        project.client === 'Novel Cafe' ? 'h-96' :
                                                            project.client === 'Osawa Biriyani in Dubai' ? 'h-72' :
                                                                project.client === 'Yamanote Cake Box' ? 'h-60' :
                                                                    project.client === 'Wisebot' ? 'h-64' : 'h-40'} 
                                    w-auto mx-auto mb-12 object-contain
                                `}
                                    />
                                )}
                                <h2 className="text-5xl md:text-8xl font-black mb-8 leading-tight uppercase">{project.client}</h2>
                                <p className="text-xl md:text-3xl leading-relaxed text-gray-800 dark:text-white font-light">{project.description}</p>
                                <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center border-t border-black/20 dark:border-white/20 pt-8">
                                    <div><p className="text-xs text-gray-600 dark:text-white uppercase tracking-widest mb-2 font-bold">Client</p><p className="font-bold text-lg">{project.client}</p></div>
                                    <div><p className="text-xs text-gray-600 dark:text-white uppercase tracking-widest mb-2 font-bold">Project</p><p className="font-bold text-lg">{project.project}</p></div>
                                    <div><p className="text-xs text-gray-600 dark:text-white uppercase tracking-widest mb-2 font-bold">Role</p><p className="font-bold text-lg">{project.role}</p></div>
                                    <div><p className="text-xs text-gray-600 dark:text-white uppercase tracking-widest mb-2 font-bold">Year</p><p className="font-bold text-lg">{project.year}</p></div>
                                </div>
                            </div>
                        </ScrollReveal>
                    </div>

                    <div className="pb-16 md:pb-24 space-y-8 md:space-y-12 max-w-5xl mx-auto px-6">
                        {project.detailImages.map((src, i) => {
                            const isVideo = src.toLowerCase().endsWith('.mp4');
                            return (
                                <ScrollReveal key={i}>
                                    <div>
                                        {isVideo ? (
                                            <video src={resolvePath(src)} autoPlay muted loop playsInline className="rounded-lg w-full shadow-lg" />
                                        ) : (
                                            <img src={resolvePath(src)} className="rounded-lg w-full shadow-lg" alt="Detail" />
                                        )}
                                    </div>
                                </ScrollReveal>
                            );
                        })}
                    </div>

                    <div ref={footerRef} className="py-32 mt-12 text-black dark:text-white">
                        <nav className="flex justify-between items-center max-w-7xl mx-auto border-t border-black/10 dark:border-white/10 pt-12 px-6">
                            <Link to={`/project/${prevProjectId}`} className="group flex flex-col items-start text-left cursor-pointer">
                                <span className="text-xs uppercase tracking-widest text-gray-500 dark:text-white mb-2 font-bold">Previous</span>
                                <div className="relative overflow-hidden h-10 md:h-16">
                                    <span className="block text-3xl md:text-6xl font-black uppercase transition-transform duration-500 group-hover:-translate-y-full">Prev</span>
                                    <span className="absolute top-0 left-0 block text-3xl md:text-6xl font-black uppercase transition-transform duration-500 translate-y-full group-hover:translate-y-0 text-gray-400 dark:text-white">Prev</span>
                                </div>
                            </Link>
                            <Link to={`/project/${nextProjectId}`} className="group flex flex-col items-end text-right cursor-pointer">
                                <span className="text-xs uppercase tracking-widest text-gray-500 dark:text-white mb-2 font-bold">Next</span>
                                <div className="relative overflow-hidden h-10 md:h-16">
                                    <span className="block text-3xl md:text-6xl font-black uppercase transition-transform duration-500 group-hover:-translate-y-full">Next</span>
                                    <span className="absolute top-0 right-0 block text-3xl md:text-6xl font-black uppercase transition-transform duration-500 translate-y-full group-hover:translate-y-0 text-gray-400 dark:text-white">Next</span>
                                </div>
                            </Link>
                        </nav>
                    </div>
                </div>
            </div>

            {/* GO TO TOP BUTTON */}
            <AnimatePresence>
                {showTopBtn && (
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        onClick={scrollToTop}
                        className="fixed bottom-10 right-10 z-[100] bg-white text-black p-4 rounded-full shadow-xl hover:scale-110 active:scale-95 transition-all cursor-pointer group"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 group-hover:-translate-y-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        </svg>
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
};
export default ProjectDetail;