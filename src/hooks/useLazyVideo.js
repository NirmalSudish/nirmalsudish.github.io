import { useRef, useEffect, useState, useCallback } from 'react';

/**
 * Hook for lazy loading and playing videos based on visibility
 * Uses IntersectionObserver to only play videos when visible
 * Automatically pauses and resets when scrolled out of view
 */
export const useLazyVideo = (options = {}) => {
    const {
        threshold = 0.3,
        rootMargin = '100px',
        playOnVisible = true,
        pauseOnHidden = true,
        resetOnHidden = false
    } = options;

    const videoRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                const visible = entry.isIntersecting;
                setIsVisible(visible);

                if (visible && playOnVisible && isLoaded) {
                    video.play()
                        .then(() => setIsPlaying(true))
                        .catch(() => {
                            // Autoplay was prevented, likely needs user interaction
                            setIsPlaying(false);
                        });
                } else if (!visible && pauseOnHidden && isPlaying) {
                    video.pause();
                    setIsPlaying(false);

                    if (resetOnHidden) {
                        video.currentTime = 0;
                    }
                }
            },
            { threshold, rootMargin }
        );

        observer.observe(video);
        return () => observer.disconnect();
    }, [threshold, rootMargin, playOnVisible, pauseOnHidden, resetOnHidden, isLoaded, isPlaying]);

    const handleLoadedData = useCallback(() => {
        setIsLoaded(true);
        setHasError(false);
    }, []);

    const handleError = useCallback(() => {
        setHasError(true);
        setIsLoaded(false);
    }, []);

    const handlePlay = useCallback(() => {
        setIsPlaying(true);
    }, []);

    const handlePause = useCallback(() => {
        setIsPlaying(false);
    }, []);

    return {
        videoRef,
        isVisible,
        isLoaded,
        isPlaying,
        hasError,
        handlers: {
            onLoadedData: handleLoadedData,
            onError: handleError,
            onPlay: handlePlay,
            onPause: handlePause
        }
    };
};

/**
 * Hook for managing video memory on mobile
 * Limits concurrent video loads to prevent memory issues
 */
export const useVideoMemoryManager = (maxConcurrent = 4) => {
    const [loadedVideos, setLoadedVideos] = useState(new Set());

    const canLoad = useCallback((videoId) => {
        return loadedVideos.size < maxConcurrent || loadedVideos.has(videoId);
    }, [loadedVideos, maxConcurrent]);

    const registerVideo = useCallback((videoId) => {
        setLoadedVideos(prev => new Set([...prev, videoId]));
    }, []);

    const unregisterVideo = useCallback((videoId) => {
        setLoadedVideos(prev => {
            const next = new Set(prev);
            next.delete(videoId);
            return next;
        });
    }, []);

    return { canLoad, registerVideo, unregisterVideo, loadedCount: loadedVideos.size };
};

export default useLazyVideo;
