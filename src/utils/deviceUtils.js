/**
 * Device detection and performance utilities for mobile optimization
 */

// Check if device is mobile based on screen width and touch capability
export const isMobileDevice = () => {
    if (typeof window === 'undefined') return false;

    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isSmallScreen = window.innerWidth <= 768;

    return isTouchDevice && isSmallScreen;
};

// Check if device prefers reduced motion (accessibility + performance)
export const prefersReducedMotion = () => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Check if device has slow connection
export const hasSlowConnection = () => {
    if (typeof navigator === 'undefined' || !navigator.connection) return false;

    const connection = navigator.connection;
    const slowTypes = ['slow-2g', '2g', '3g'];

    return slowTypes.includes(connection.effectiveType) || connection.saveData;
};

// Get optimal image quality based on device capabilities
export const getOptimalQuality = () => {
    if (hasSlowConnection()) return 'low';
    if (isMobileDevice()) return 'medium';
    return 'high';
};

// Debounce utility for scroll/resize handlers
export const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Throttle utility for frequent events
export const throttle = (func, limit) => {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};
