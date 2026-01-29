import React, { useEffect, useRef } from 'react';

const MotionBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let grid = [];
    const gridSize = 30;
    let time = 0;
    const mouse = { x: undefined, y: undefined, radius: 120 };

    let dotColor = '255, 255, 255';
    let baseOpacity = 0.04;

    const updateTheme = () => {
      if (document.documentElement.classList.contains('dark')) {
        dotColor = '255, 255, 255';
        baseOpacity = 0.04;
      } else {
        dotColor = '17, 17, 17';
        baseOpacity = 0.08; // Reduced visibility for light mode (was 0.15)
      }
    };
    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      createGrid();
    };

    const createGrid = () => {
      grid = [];
      for (let x = 0; x < canvas.width + gridSize; x += gridSize) {
        for (let y = 0; y < canvas.height + gridSize; y += gridSize) {
          grid.push({ x, y, originalX: x, originalY: y, vx: 0, vy: 0 });
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.005;

      // Mobile auto-movement logic
      let targetX = mouse.x;
      let targetY = mouse.y;
      const isMobile = canvas.width < 1024;

      // Auto-wander only on Desktop if no user interaction
      // On Mobile: REMOVED auto-wander to keep dots static
      if (!isMobile) {
        if (mouse.x === undefined) {
          // No auto-wander logic here anymore for desktop to keep it clean, or keep it depending on preference.
          // But specifically for mobile, we want it static.
          mouse.radius = 120;
        } else {
          mouse.radius = 120;
        }
      } else {
        // Mobile specific settings
        if (mouse.x !== undefined) {
          mouse.radius = 200; // Larger touch radius
        }
      }

      for (let i = 0; i < grid.length; i++) {
        const point = grid[i];
        let forceX = 0;
        let forceY = 0;
        const springForceX = (point.originalX - point.x) * 0.02;
        const springForceY = (point.originalY - point.y) * 0.02;
        forceX += springForceX;
        forceY += springForceY;

        let color = dotColor;
        // 1. BASE OPACITY: Uses dynamic baseOpacity based on theme
        let finalOpacity = baseOpacity;
        let radius = 1.2;

        if (targetX !== undefined) {
          const dx = targetX - point.x;
          const dy = targetY - point.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            const angle = Math.atan2(dy, dx);
            forceX -= Math.cos(angle) * force * 1.5;
            forceY -= Math.sin(angle) * force * 1.5;

            color = '199, 146, 255';
            // 2. INTERACTIVE OPACITY: Softened for subtle transition
            finalOpacity = force * 0.4 + baseOpacity;
            radius = 1.5 + force * 4.5;

            ctx.shadowBlur = 35 * force;
            // 3. BLOOM OPACITY: Reduced for a softer lavender glow
            ctx.shadowColor = `rgba(199, 146, 255, ${force * 0.3})`;
          }
        }

        // Only apply wave motion on Desktop
        if (!isMobile) {
          forceX += Math.sin(point.originalY / 60 + time) * 0.02;
          forceY += Math.cos(point.originalX / 60 + time) * 0.02;
        }

        point.vx = (point.vx + forceX) * 0.9;
        point.vy = (point.vy + forceY) * 0.9;
        point.x += point.vx;
        point.y += point.vy;

        ctx.beginPath();
        ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color}, ${finalOpacity})`;
        ctx.fill();

        ctx.shadowBlur = 0;
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resizeCanvas);
    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
      }
    };

    const handleMouseOut = () => { mouse.x = undefined; mouse.y = undefined; };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchstart', handleTouchMove);
    window.addEventListener('mouseout', handleMouseOut);
    window.addEventListener('touchend', handleMouseOut);

    resizeCanvas();
    animate();

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchstart', handleTouchMove);
      window.removeEventListener('mouseout', handleMouseOut);
      window.removeEventListener('touchend', handleMouseOut);
      cancelAnimationFrame(animationFrameId);
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