import React, { useEffect, useRef } from 'react';
import Antigravity from './Antigravity';
import Beams from './Beams';

// Subcomponent rendering the original tactical 2D canvas sonar grid
function TacticalMeshCanvas() {
  const canvasRef = useRef(null);
  const scrollYRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Scroll listener for parallax
    const handleScroll = () => {
      scrollYRef.current = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Mouse coordinate tracking
    let mouse = { x: null, y: null, radius: 200 };
    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    // Click tracker for interactive sonar ripples
    let ripples = [];
    const handleWindowClick = (e) => {
      ripples.push({
        x: e.clientX,
        y: e.clientY,
        radius: 0,
        maxRadius: Math.max(window.innerWidth, window.innerHeight) * 0.6,
        speed: 6.5,
        opacity: 0.6
      });
      // Limit concurrent active ripples
      if (ripples.length > 4) ripples.shift();
    };
    window.addEventListener('click', handleWindowClick);

    const gridSize = 65; // Size of grid squares in pixels

    // Subtle sonar scan line state
    let scanLineY = 0;
    const scanSpeed = 0.8;

    const drawGrid = () => {
      ctx.clearRect(0, 0, width, height);

      // Fetch dynamic accent color from root document styling
      const rootStyles = getComputedStyle(document.documentElement);
      const accentHex = rootStyles.getPropertyValue('--accent').trim() || '#EAB308';

      // Update active ripples radius
      ripples.forEach((ripple) => {
        ripple.radius += ripple.speed;
      });
      // Filter out completed ripples
      ripples = ripples.filter(r => r.radius < r.maxRadius);

      // 1. Draw main faint background grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.012)';
      ctx.lineWidth = 1;

      // Vertical lines (remain stable)
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Horizontal lines with scroll-driven parallax drift
      const scrollDrift = scrollYRef.current * 0.15;
      const startY = -(scrollDrift % gridSize);
      for (let y = startY; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 2. Draw moving tactical scan line (very subtle Wayne Enterprises radar feel)
      ctx.strokeStyle = `${accentHex}08`; // Very low opacity (8%)
      ctx.beginPath();
      ctx.moveTo(0, scanLineY);
      ctx.lineTo(width, scanLineY);
      ctx.stroke();

      // Update scan line position
      scanLineY += scanSpeed;
      if (scanLineY > height) {
        scanLineY = 0;
      }

      // 3. Draw rising HUD telemetry coordinates based on scroll
      ctx.fillStyle = `${accentHex}0b`; // 7% opacity accent
      ctx.font = '7px monospace';
      const textDrift = scrollYRef.current * 0.35;
      
      const hudItems = [
        { label: "SYS_SEC.GRID_0", x: width * 0.12, y: height * 0.2 },
        { label: "W_ENT.BAT_PROTO_V9", x: width * 0.85, y: height * 0.35 },
        { label: "LAT_SEC_PING: OK", x: width * 0.72, y: height * 0.7 },
        { label: "SONAR_SAT.SHLD_ON", x: width * 0.22, y: height * 0.55 }
      ];

      hudItems.forEach((item) => {
        // Compute wrapped dynamic y position so they float back up
        let rawY = item.y - textDrift;
        let wrappedY = ((rawY % (height + 100)) + (height + 100)) % (height + 100) - 50;
        ctx.fillText(item.label, item.x, wrappedY);
      });

      // 4. Draw tactical crosshair indicators (+) at intersections
      const crosshairDrift = scrollYRef.current * 0.15;
      for (let x = 0; x < width; x += gridSize) {
        for (let yGrid = 0; yGrid < height + gridSize; yGrid += gridSize) {
          const y = yGrid - (crosshairDrift % gridSize);
          let opacity = 0.05; // Base idle opacity
          let isGlow = false;

          // Mouse proximity calculation
          if (mouse.x !== null && mouse.y !== null) {
            const dx = mouse.x - x;
            const dy = mouse.y - y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < mouse.radius) {
              isGlow = true;
              const scaleVal = 1 - dist / mouse.radius;
              opacity = 0.05 + scaleVal * 0.45;
            }
          }

          // Sonar scan line proximity glow
          const distToScan = Math.abs(scanLineY - y);
          if (distToScan < 80) {
            const scanScale = (1 - distToScan / 80) * 0.08;
            opacity = Math.max(opacity, 0.05 + scanScale);
          }

          // Interactive click ripple wave front glow
          ripples.forEach((ripple) => {
            const dx = ripple.x - x;
            const dy = ripple.y - y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const distToWaveFront = Math.abs(dist - ripple.radius);

            if (distToWaveFront < 55) {
              isGlow = true;
              const waveScale = (1 - distToWaveFront / 55) * 0.35 * (1 - ripple.radius / ripple.maxRadius);
              opacity = Math.max(opacity, 0.05 + waveScale);
            }
          });

          ctx.save();
          ctx.globalAlpha = opacity;
          ctx.strokeStyle = isGlow ? accentHex : 'rgba(255, 255, 255, 0.15)';
          ctx.lineWidth = 1;

          // Draw small coordinate tick (+)
          ctx.beginPath();
          ctx.moveTo(x - 3, y);
          ctx.lineTo(x + 3, y);
          ctx.moveTo(x, y - 3);
          ctx.lineTo(x, y + 3);
          ctx.stroke();

          ctx.restore();
        }
      }
    };

    const animate = () => {
      drawGrid();
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('click', handleWindowClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-80"
    />
  );
}

export default function BackgroundCanvas() {
  // Default to the original tactical mesh
  return <TacticalMeshCanvas />;
}
