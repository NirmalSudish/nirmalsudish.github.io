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
    const mouse = { x: undefined, y: undefined, radius: 100 };

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
      
      for (let i = 0; i < grid.length; i++) {
        const point = grid[i];
        let forceX = 0;
        let forceY = 0;
        const springForceX = (point.originalX - point.x) * 0.02;
        const springForceY = (point.originalY - point.y) * 0.02;
        forceX += springForceX;
        forceY += springForceY;

        let color = '255, 255, 255';
        let finalOpacity = 0.1;
        let radius = 1.5;

        if (mouse.x !== undefined) {
            const dx = mouse.x - point.x;
            const dy = mouse.y - point.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < mouse.radius) {
                const force = (mouse.radius - dist) / mouse.radius;
                const angle = Math.atan2(dy, dx);
                forceX -= Math.cos(angle) * force * 1.5;
                forceY -= Math.sin(angle) * force * 1.5;
                color = '199, 146, 255';
                finalOpacity = force + 0.1;
                radius = 2 + force * 2;
            }
        }

        forceX += Math.sin(point.originalY / 60 + time) * 0.02;
        forceY += Math.cos(point.originalX / 60 + time) * 0.02;

        point.vx = (point.vx + forceX) * 0.9;
        point.vy = (point.vy + forceY) * 0.9;
        point.x += point.vx;
        point.y += point.vy;

        ctx.beginPath();
        ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color}, ${finalOpacity})`;
        ctx.fill();
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resizeCanvas);
    const handleMouseMove = (e) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    const handleMouseOut = () => { mouse.x = undefined; mouse.y = undefined; };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', handleMouseOut);
    
    resizeCanvas();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseOut);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }} />;
};
export default MotionBackground;
