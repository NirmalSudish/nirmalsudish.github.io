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
 * Get optimized image source for responsive loading
 * Returns mobile WebP for mobile devices, full WebP for desktop
 */
export const getOptimizedImagePath = (originalPath) => {
    if (!originalPath || originalPath.startsWith('http') || originalPath.startsWith('data:')) {
        return originalPath;
    }

    // Check if it's a mobile device (simple check based on screen width)
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

    // Extract file extension and name
    const lastDot = originalPath.lastIndexOf('.');
    const lastSlash = originalPath.lastIndexOf('/');

    if (lastDot === -1) return resolvePath(originalPath);

    const pathWithoutExt = originalPath.substring(0, lastDot);
    const ext = originalPath.substring(lastDot);

    // Don't optimize videos or already optimized images
    if (ext === '.mp4' || ext === '.webm' || originalPath.includes('-mobile') || ext === '.webp') {
        return resolvePath(originalPath);
    }

    // For mobile: use mobile WebP version if available
    if (isMobile) {
        return resolvePath(`${pathWithoutExt}-mobile.webp`);
    }

    // For desktop: use full-size WebP
    return resolvePath(`${pathWithoutExt}.webp`);
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
    const ext = originalPath.substring(lastDot);

    // Skip videos and already optimized
    if (ext === '.mp4' || ext === '.webm' || originalPath.includes('-mobile') || ext === '.webp') {
        return '';
    }

    const mobileWebp = resolvePath(`${pathWithoutExt}-mobile.webp`);
    const desktopWebp = resolvePath(`${pathWithoutExt}.webp`);

    return `${mobileWebp} 800w, ${desktopWebp} 1920w`;
};
