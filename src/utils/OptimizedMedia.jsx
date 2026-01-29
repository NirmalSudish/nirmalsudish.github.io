import React, { useState, useEffect, useRef, memo } from 'react';
import { resolvePath } from './imagePath';
import { isMobileDevice, hasSlowConnection } from './deviceUtils';

/**
 * OptimizedMedia - A performance-focused image/video component
 * 
 * Features:
 * - True lazy loading with IntersectionObserver
 * - Mobile-optimized: loads placeholder until in view
 * - Reduces video quality/disables autoplay on slow connections
 * - Smooth loading transitions
 */

const OptimizedMedia = memo(({
    src,
    alt = '',
    className = '',
    containerClassName = '',
    aspectRatio = 'auto', // 'auto', 'video', 'square', or custom like '4/3'
    priority = false, // Load immediately if true (for above-fold content)
    onLoad,
    onClick,
    showPlayButton = false, // For videos: show play button instead of autoplay on mobile
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(priority);
    const [hasError, setHasError] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const containerRef = useRef(null);
    const videoRef = useRef(null);
    const observerRef = useRef(null);

    const isVideo = typeof src === 'string' && (src.endsWith('.mp4') || src.endsWith('.webm'));
    const isMobile = typeof window !== 'undefined' && isMobileDevice();
    const isSlowConnection = typeof window !== 'undefined' && hasSlowConnection();

    // Set up IntersectionObserver for lazy loading
    useEffect(() => {
        if (priority || isInView) return;

        observerRef.current = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsInView(true);
                        observerRef.current?.disconnect();
                    }
                });
            },
            {
                rootMargin: '100px', // Start loading 100px before entering viewport
                threshold: 0.01,
            }
        );

        if (containerRef.current) {
            observerRef.current.observe(containerRef.current);
        }

        return () => observerRef.current?.disconnect();
    }, [priority, isInView]);

    // Handle video play/pause for mobile
    const handleVideoClick = () => {
        if (!videoRef.current) return;

        if (isPlaying) {
            videoRef.current.pause();
            setIsPlaying(false);
        } else {
            videoRef.current.play().catch(() => { });
            setIsPlaying(true);
        }
    };

    const handleLoadComplete = () => {
        setIsLoaded(true);
        onLoad?.();
    };

    const handleError = () => {
        setHasError(true);
    };

    // Aspect ratio class mapping
    const aspectClasses = {
        'auto': '',
        'video': 'aspect-video',
        'square': 'aspect-square',
    };

    const aspectClass = aspectClasses[aspectRatio] || '';
    const aspectStyle = !aspectClasses[aspectRatio] && aspectRatio !== 'auto'
        ? { aspectRatio }
        : {};

    // Mobile: disable autoplay to save battery/data
    const shouldAutoplay = isVideo && !isMobile && !isSlowConnection && !showPlayButton;

    return (
        <div
            ref={containerRef}
            className={`relative overflow-hidden ${aspectClass} ${containerClassName}`}
            style={aspectStyle}
            onClick={onClick}
        >
            {/* Loading placeholder */}
            {!isLoaded && !hasError && (
                <div className="absolute inset-0 bg-zinc-800/50 flex items-center justify-center">
                    {isInView && (
                        <div className="w-8 h-8 border-2 border-white/20 border-t-purple-500 rounded-full animate-spin" />
                    )}
                </div>
            )}

            {/* Error state */}
            {hasError && (
                <div className="absolute inset-0 bg-zinc-900 flex items-center justify-center text-white/50 text-sm">
                    Failed to load
                </div>
            )}

            {/* Actual media - only render when in view */}
            {isInView && !hasError && (
                isVideo ? (
                    <>
                        <video
                            ref={videoRef}
                            src={resolvePath(src)}
                            className={`w-full h-full object-contain transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
                            muted
                            loop
                            playsInline
                            autoPlay={shouldAutoplay}
                            preload={priority ? 'auto' : 'metadata'}
                            onLoadedData={handleLoadComplete}
                            onError={handleError}
                            onClick={isMobile || showPlayButton ? handleVideoClick : undefined}
                        />
                        {/* Mobile play button overlay */}
                        {(isMobile || showPlayButton) && !isPlaying && isLoaded && (
                            <button
                                onClick={handleVideoClick}
                                className="absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity hover:bg-black/40"
                                aria-label="Play video"
                            >
                                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                    <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                </div>
                            </button>
                        )}
                    </>
                ) : (
                    <img
                        src={resolvePath(src)}
                        alt={alt}
                        className={`w-full h-full object-contain transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
                        loading={priority ? 'eager' : 'lazy'}
                        decoding="async"
                        onLoad={handleLoadComplete}
                        onError={handleError}
                    />
                )
            )}
        </div>
    );
});

OptimizedMedia.displayName = 'OptimizedMedia';

export default OptimizedMedia;
