import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const ThemeToggle = () => {
    const [isDark, setIsDark] = useState(true);

    useEffect(() => {
        // Check local storage or preference on mount
        const storedTheme = localStorage.getItem('theme');
        // Default to dark if not specified, since the site was originally dark only
        if (storedTheme === 'light') {
            setIsDark(false);
            document.documentElement.classList.remove('dark');
        } else {
            setIsDark(true);
            document.documentElement.classList.add('dark');
        }
    }, []);

    const toggleTheme = () => {
        const newIsDark = !isDark;
        setIsDark(newIsDark);

        if (newIsDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    return (
        <div
            onClick={toggleTheme}
            className={`
                relative w-20 h-10 rounded-full p-1 cursor-pointer transition-colors duration-500
                ${isDark ? 'bg-gray-800/80 border border-gray-700' : 'bg-gray-200 border border-gray-300'}
                backdrop-blur-sm shadow-inner
            `}
            role="button"
            aria-label="Toggle theme"
        >
            {/* Icons container */}
            <div className="absolute inset-0 flex justify-between items-center px-2.5 z-10 pointer-events-none">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16" height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`transition-colors duration-300 ${isDark ? 'text-gray-500' : 'text-yellow-600'}`}
                >
                    <circle cx="12" cy="12" r="5" />
                    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>

                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16" height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-400'}`}
                >
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
            </div>

            {/* Sliding Thumb */}
            <motion.div
                className="w-8 h-8 rounded-full shadow-md bg-white dark:bg-gray-600"
                animate={{ x: isDark ? 40 : 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
            />
        </div>
    );
};

export default ThemeToggle;
