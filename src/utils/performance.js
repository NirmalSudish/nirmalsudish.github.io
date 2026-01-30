/**
 * Performance Utilities
 * 
 * Helper functions for optimizing performance on mobile and desktop
 */

/**
 * Detect if the device is mobile based on screen width and touch capability
 */
export const isMobileDevice = () => {
    if (typeof window === 'undefined') return false;

    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isNarrow = window.innerWidth <= 768;

    return hasTouch && isNarrow;
};

/**
 * Detect if the device is a tablet
 */
export const isTabletDevice = () => {
    if (typeof window === 'undefined') return false;

    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isTabletWidth = window.innerWidth > 768 && window.innerWidth <= 1024;

    return hasTouch && isTabletWidth;
};

/**
 * Check if device is low-powered (should reduce animations)
 */
export const isLowPowerDevice = () => {
    if (typeof navigator === 'undefined') return false;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Check for low memory (if available)
    const lowMemory = navigator.deviceMemory && navigator.deviceMemory < 4;

    // Check for slow connection (if available)
    const slowConnection = navigator.connection &&
        (navigator.connection.effectiveType === 'slow-2g' ||
            navigator.connection.effectiveType === '2g' ||
            navigator.connection.saveData);

    return prefersReducedMotion || lowMemory || slowConnection;
};

/**
 * Get optimized video quality based on device capabilities
 */
export const getVideoQuality = () => {
    if (isLowPowerDevice()) return 'low';
    if (isMobileDevice()) return 'medium';
    return 'high';
};

/**
 * Debounce function for performance-sensitive operations
 */
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

/**
 * Throttle function for scroll/resize handlers
 */
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

/**
 * Request idle callback polyfill
 */
export const requestIdleCallback =
    (typeof window !== 'undefined' && window.requestIdleCallback) ||
    ((cb) => setTimeout(cb, 1));

/**
 * Cancel idle callback polyfill
 */
export const cancelIdleCallback =
    (typeof window !== 'undefined' && window.cancelIdleCallback) ||
    ((id) => clearTimeout(id));

/**
 * Preload critical resources
 */
export const preloadImage = (src) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
};

/**
 * Check if element is in viewport
 */
export const isInViewport = (element, threshold = 0) => {
    if (!element) return false;

    const rect = element.getBoundingClientRect();
    return (
        rect.top >= -threshold &&
        rect.left >= -threshold &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + threshold &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) + threshold
    );
};

/**
 * Get optimal image size based on device
 */
export const getOptimalImageWidth = () => {
    if (typeof window === 'undefined') return 1920;

    const dpr = window.devicePixelRatio || 1;
    const width = window.innerWidth;

    // Return width * DPR, but cap at reasonable limits
    return Math.min(width * dpr, isMobileDevice() ? 800 : 1920);
};

/**
 * Check if browser supports WebP
 */
export const supportsWebP = () => {
    if (typeof document === 'undefined') return false;

    const elem = document.createElement('canvas');
    if (elem.getContext && elem.getContext('2d')) {
        return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }
    return false;
};

/**
 * Memory-efficient array chunking
 */
export const chunkArray = (array, size) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }
    return chunks;
};
