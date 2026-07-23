import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Motion values for smooth spring lagging cursor
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Configure spring physics (stiffness/damping) for a responsive lag
  const springConfig = { stiffness: 350, damping: 28 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Check if the device is a touch screen (no custom cursor needed)
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      setIsTouchDevice(true);
      return;
    }

    setIsVisible(true);

    const moveCursor = (e) => {
      cursorX.set(e.clientX - 12); // Offset to center the 24px circle
      cursorY.set(e.clientY - 12);
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      if (!target) return;
      
      const isClickable = target.closest('a, button, [role="button"], select, input, textarea, .cursor-pointer') !== null;
      setIsHovered(isClickable);
    };

    const handleMouseLeaveWindow = () => setIsVisible(false);
    const handleMouseEnterWindow = () => setIsVisible(true);

    window.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseleave', handleMouseLeaveWindow);
    document.addEventListener('mouseenter', handleMouseEnterWindow);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeaveWindow);
      document.removeEventListener('mouseenter', handleMouseEnterWindow);
    };
  }, [cursorX, cursorY]);

  if (isTouchDevice || !isVisible) return null;

  return (
    <>
      {/* Outer Tactical Reticle Circle (Lagging Spring) */}
      <motion.div
        className="fixed top-0 left-0 w-6 h-6 rounded-full border border-accent/40 pointer-events-none z-[9999] hidden sm:block"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          scale: isHovered ? 1.6 : 1,
          borderColor: isHovered ? 'var(--accent)' : 'rgba(234, 179, 8, 0.4)',
          backgroundColor: isHovered ? 'var(--accent-glow)' : 'transparent',
          boxShadow: isHovered ? '0 0 10px var(--accent-glow)' : 'none'
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      />

      {/* Inner Tactical Target Dot (Instant Position) */}
      <div
        className="fixed w-1.5 h-1.5 rounded-full bg-accent pointer-events-none z-[9999] hidden sm:block"
        style={{
          left: `${cursorX.get() + 9.5}px`, // Centered offsets
          top: `${cursorY.get() + 9.5}px`,
          transform: isHovered ? 'scale(1.5)' : 'scale(1)',
          transition: 'transform 0.15s ease'
        }}
      />
    </>
  );
}
