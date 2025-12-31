import React, { useEffect, useRef } from 'react';

const CustomCursor = () => {
  const cursorRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const moveCursor = (e) => {
      if (cursor) {
        cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }
    };

    const addHover = () => cursor?.classList.add('hovered');
    const removeHover = () => cursor?.classList.remove('hovered');

    window.addEventListener('mousemove', moveCursor);

    const handleMouseOver = (e) => {
      if (e.target.closest('a, button, .project-card, .cursor-hover')) {
        addHover();
      } else {
        removeHover();
      }
    };

    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <>
      <style>{`
        #glass-cursor {
          position: fixed;
          top: 0; left: 0;
          width: 20px; height: 20px;
          border-radius: 50%;
          background-color: white;
          mix-blend-mode: difference;
          pointer-events: none;
          z-index: 9999;
          transition: width 0.3s ease, height 0.3s ease;
          will-change: transform;
        }
        #glass-cursor.hovered {
          width: 80px;
          height: 80px;
        }
      `}</style>
      <div id="glass-cursor" ref={cursorRef} />
    </>
  );
};
export default CustomCursor;
