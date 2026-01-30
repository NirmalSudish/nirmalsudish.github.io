import React, { useState, useRef, useEffect, memo } from 'react';
import { getOptimizedImagePath, getFallbackImagePath } from '../../utils/imagePath';

/**
 * OptimizedImage Component
 * - Lazy loads images using IntersectionObserver
 * - Shows blur placeholder until loaded
 * - Automatically uses WebP with fallback
 * - Prevents layout shift with aspect ratio
 */
const OptimizedImage = memo(({
    src,
    alt = '',
    className = '',
    containerClassName = '',
    priority = false,
    aspectRatio = null, // e.g., '16/9', '4/3', '1/1'
    objectFit = 'cover',
    onLoad,
    onError,
    ...props
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isVisible, setIsVisible] = useState(priority);
    const [hasError, setHasError] = useState(false);
    const imgRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        if (priority) {
            setIsVisible(true);
            return;
        }

        const container = containerRef.current;
        if (!container) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { rootMargin: '200px', threshold: 0.01 }
        );

        observer.observe(container);
        return () => observer.disconnect();
    }, [priority]);

    const handleLoad = (e) => {
        setIsLoaded(true);
        setHasError(false);
        onLoad?.(e);
    };

    const handleError = (e) => {
        // Try fallback image
        if (!hasError) {
            setHasError(true);
            e.target.src = getFallbackImagePath(src);
        }
        onError?.(e);
    };

    const optimizedSrc = getOptimizedImagePath(src);

    // Container styles for preventing layout shift
    const containerStyles = {
        aspectRatio: aspectRatio || undefined,
    };

    return (
        <div
            ref={containerRef}
            className={`relative overflow-hidden ${containerClassName}`}
            style={containerStyles}
        >
            {/* Blur placeholder skeleton */}
            <div
                className={`absolute inset-0 transition-opacity duration-500 ${isLoaded ? 'opacity-0' : 'opacity-100'
                    }`}
                aria-hidden="true"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-800 dark:to-zinc-900 animate-pulse" />
            </div>

            {/* Actual image - only render src when visible */}
            {isVisible && (
                <img
                    ref={imgRef}
                    src={optimizedSrc}
                    alt={alt}
                    loading={priority ? 'eager' : 'lazy'}
                    decoding="async"
                    onLoad={handleLoad}
                    onError={handleError}
                    className={`w-full h-full transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'
                        } ${className}`}
                    style={{ objectFit }}
                    {...props}
                />
            )}
        </div>
    );
});

OptimizedImage.displayName = 'OptimizedImage';

export default OptimizedImage;
