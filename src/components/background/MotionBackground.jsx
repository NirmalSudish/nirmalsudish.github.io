import React, { useEffect, useRef, useCallback } from 'react';

const MotionBackground = () => {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const lastFrameRef = useRef(0);
  const isVisibleRef = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    let grid = [];
    let time = 0;
    const mouse = { x: undefined, y: undefined, radius: 120 };

    // CRITICAL: Detect mobile and adjust accordingly
    const isMobile = window.innerWidth < 1024;

    // OPTIMIZATION 1: Larger grid size on mobile = fewer points (reduces from ~1000 to ~200)
    const gridSize = isMobile ? 60 : 30;

    // OPTIMIZATION 2: Target 30fps on mobile, 60fps on desktop
    const targetFPS = isMobile ? 24 : 60;
    const frameInterval = 1000 / targetFPS;

    let dotColor = '255, 255, 255';
    let baseOpacity = 0.04;

    const updateTheme = () => {
      if (document.documentElement.classList.contains('dark')) {
        dotColor = '255, 255, 255';
        baseOpacity = 0.04;
      } else {
        dotColor = '17, 17, 17';
        baseOpacity = 0.08;
      }
    };
    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    const resizeCanvas = () => {
      // OPTIMIZATION 3: Lower DPR on mobile for performance
      const dpr = isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 2);
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      createGrid();
    };

    const createGrid = () => {
      grid = [];
      const width = window.innerWidth;
      const height = window.innerHeight;
      for (let x = 0; x < width + gridSize; x += gridSize) {
        for (let y = 0; y < height + gridSize; y += gridSize) {
          grid.push({ x, y, originalX: x, originalY: y, vx: 0, vy: 0 });
        }
      }
    };

    const animate = (timestamp) => {
      // Don't animate if tab is not visible
      if (!isVisibleRef.current) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      // OPTIMIZATION 4: Frame rate limiting
      const elapsed = timestamp - lastFrameRef.current;
      if (elapsed < frameInterval) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }
      lastFrameRef.current = timestamp - (elapsed % frameInterval);

      const width = window.innerWidth;
      const height = window.innerHeight;
      ctx.clearRect(0, 0, width, height);
      time += 0.005;

      const len = grid.length;

      for (let i = 0; i < len; i++) {
        const point = grid[i];
        let forceX = 0;
        let forceY = 0;
        const springForceX = (point.originalX - point.x) * 0.02;
        const springForceY = (point.originalY - point.y) * 0.02;
        forceX += springForceX;
        forceY += springForceY;

        let color = dotColor;
        let finalOpacity = baseOpacity;
        let radius = isMobile ? 1 : 1.2;

        // Desktop-only mouse interaction (performance boost for mobile)
        if (!isMobile && mouse.x !== undefined) {
          const dx = mouse.x - point.x;
          const dy = mouse.y - point.y;
          const distSq = dx * dx + dy * dy; // OPTIMIZATION: Avoid sqrt when possible
          const radiusSq = mouse.radius * mouse.radius;

          if (distSq < radiusSq) {
            const dist = Math.sqrt(distSq);
            const force = (mouse.radius - dist) / mouse.radius;
            const angle = Math.atan2(dy, dx);
            forceX -= Math.cos(angle) * force * 1.5;
            forceY -= Math.sin(angle) * force * 1.5;
            color = '199, 146, 255';
            finalOpacity = force * 0.4 + baseOpacity;
            radius = 1.5 + force * 4.5;

            // Only apply glow for close points
            if (force > 0.3) {
              ctx.shadowBlur = 35 * force;
              ctx.shadowColor = `rgba(199, 146, 255, ${force * 0.3})`;
            }
          }
        }

        // Desktop-only wave motion (disabled on mobile for performance)
        if (!isMobile) {
          forceX += Math.sin(point.originalY / 60 + time) * 0.02;
          forceY += Math.cos(point.originalX / 60 + time) * 0.02;
        }

        point.vx = (point.vx + forceX) * 0.9;
        point.vy = (point.vy + forceY) * 0.9;
        point.x += point.vx;
        point.y += point.vy;

        // Draw point
        ctx.beginPath();
        ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color}, ${finalOpacity})`;
        ctx.fill();

        // Reset shadow after each point with glow
        if (ctx.shadowBlur > 0) {
          ctx.shadowBlur = 0;
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    // OPTIMIZATION 5: Pause animation when tab is not visible
    const handleVisibilityChange = () => {
      isVisibleRef.current = !document.hidden;
      if (!document.hidden) {
        lastFrameRef.current = performance.now();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Desktop-only mouse handlers
    const handleMouseMove = isMobile ? null : (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseOut = isMobile ? null : () => {
      mouse.x = undefined;
      mouse.y = undefined;
    };

    // Debounced resize handler
    let resizeTimeout;
    const debouncedResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resizeCanvas, 150);
    };

    window.addEventListener('resize', debouncedResize);
    if (!isMobile) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseout', handleMouseOut);
    }

    resizeCanvas();
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('resize', debouncedResize);
      clearTimeout(resizeTimeout);
      if (!isMobile) {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseout', handleMouseOut);
      }
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
};

export default MotionBackground;