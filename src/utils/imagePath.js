/**
 * Utility to get the optimized image path based on device type
 * Returns WebP mobile version for mobile devices, WebP desktop for others
 */
export const resolvePath = (path) => {
    if (!path) return '';
    if (path.startsWith('http') || path.startsWith('data:')) return path;

    const base = import.meta.env.BASE_URL;
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    const cleanBase = base.endsWith('/') ? base : `${base}/`;

    return `${cleanBase}${cleanPath}`;
};

/**
 * Check if device is mobile based on screen width
 */
export const isMobileDevice = () => {
    return typeof window !== 'undefined' && window.innerWidth <= 768;
};

/**
 * Get optimized image source for responsive loading
 * Returns mobile WebP for mobile devices, full WebP for desktop
 * Falls back to original if WebP doesn't exist
 */
export const getOptimizedImagePath = (originalPath) => {
    if (!originalPath || originalPath.startsWith('http') || originalPath.startsWith('data:')) {
        return originalPath;
    }

    // Extract file extension and name
    const lastDot = originalPath.lastIndexOf('.');

    if (lastDot === -1) return resolvePath(originalPath);

    const pathWithoutExt = originalPath.substring(0, lastDot);
    const ext = originalPath.substring(lastDot).toLowerCase();

    // Don't optimize videos, GIFs, or already optimized images
    if (ext === '.mp4' || ext === '.webm' || ext === '.gif' || originalPath.includes('-mobile') || ext === '.webp') {
        return resolvePath(originalPath);
    }

    // Check if it's a mobile device
    const isMobile = isMobileDevice();

    // For mobile: use mobile WebP version
    if (isMobile) {
        return resolvePath(`${pathWithoutExt}-mobile.webp`);
    }

    // For desktop: use full-size WebP
    return resolvePath(`${pathWithoutExt}.webp`);
};

/**
 * Get fallback image path (original format) 
 * Used as onerror fallback if WebP doesn't exist
 */
export const getFallbackImagePath = (originalPath) => {
    return resolvePath(originalPath);
};

/**
 * Generate srcset for responsive images
 * Returns srcset string with mobile and desktop WebP versions
 */
export const getImageSrcSet = (originalPath) => {
    if (!originalPath || originalPath.startsWith('http') || originalPath.startsWith('data:')) {
        return '';
    }

    const lastDot = originalPath.lastIndexOf('.');
    if (lastDot === -1) return '';

    const pathWithoutExt = originalPath.substring(0, lastDot);
    const ext = originalPath.substring(lastDot).toLowerCase();

    // Skip videos, GIFs, and already optimized
    if (ext === '.mp4' || ext === '.webm' || ext === '.gif' || originalPath.includes('-mobile') || ext === '.webp') {
        return '';
    }

    const mobileWebp = resolvePath(`${pathWithoutExt}-mobile.webp`);
    const desktopWebp = resolvePath(`${pathWithoutExt}.webp`);

    return `${mobileWebp} 800w, ${desktopWebp} 1920w`;
};
