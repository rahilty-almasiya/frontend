
import React, { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

const AnimatedBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false }); // Optimize for no transparency on canvas itself
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let animationFrameId: number;
    let lastFrameTime = 0;

    // --- Icon Paths (Optimized Path2D) ---
    // Icons are defined in a ~24x24 coordinate system
    const iconPaths = {
      sedan: new Path2D("M22 13h-2.17l-2.07-6.2a3 3 0 0 0-2.85-2.05H9.09a3 3 0 0 0-2.85 2.05L4.17 13H2a1 1 0 0 0-1 1v5a2 2 0 0 0 2 2h.5a2.5 2.5 0 0 0 5 0h7a2.5 2.5 0 0 0 5 0h.5a2 2 0 0 0 2-2v-5a1 1 0 0 0-1-1zM6.5 19A1.5 1.5 0 1 1 8 17.5 1.5 1.5 0 0 1 6.5 19zm11 0A1.5 1.5 0 1 1 19 17.5 1.5 1.5 0 0 1 17.5 19z"),
      suv: new Path2D("M20 12V8h-2l-1.55-4.66A2 2 0 0 0 14.56 2H9.44a2 2 0 0 0-1.89 1.34L6 8H4v4a2 2 0 0 0-2 2v4a1 1 0 0 0 1 1h.5a2.5 2.5 0 0 0 5 0h7a2.5 2.5 0 0 0 5 0h.5a1 1 0 0 0 1-1v-4a2 2 0 0 0-2-2zM6.5 17A1.5 1.5 0 1 1 8 15.5 1.5 1.5 0 0 1 6.5 17zm11 0A1.5 1.5 0 1 1 19 15.5 1.5 1.5 0 0 1 17.5 17z"),
      van: new Path2D("M21 12h-2l-1-5H6L4 12H2v6h2a2 2 0 0 0 4 0h8a2 2 0 0 0 4 0h2v-6zM6.5 17a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm11 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"),
      wheel: new Path2D("M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z"),
      tire: new Path2D("M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v4h-2zm0 8h2v4h-2zM5.64 6.64l1.41 1.41 2.83-2.83-1.41-1.41zM14.12 5.22l2.83 2.83 1.41-1.41-2.83-2.83z"),
      gps: new Path2D("M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5a2.5 2.5 0 1 1 2.5-2.5 2.5 2.5 0 0 1-2.5 2.5z")
    };

    const iconKeys = Object.keys(iconPaths) as Array<keyof typeof iconPaths>;

    // --- Configuration ---
    const isDark = theme === 'dark';
    const bgColor = isDark ? '#0f172a' : '#f8fafc'; // slate-950 : slate-50
    const primaryColorRGB = isDark ? '212, 175, 55' : '184, 146, 40'; // Gold
    
    // --- Elements Generation ---
    const items: any[] = [];
    const layerCount = 3;
    
    // Create parallax layers
    for (let layer = 0; layer < layerCount; layer++) {
      // Density: More small items in back, fewer large items in front
      const count = 8 - (layer * 2); 
      const scaleBase = 0.8 + (layer * 0.5); // 0.8, 1.3, 1.8
      const speedBase = 0.15 + (layer * 0.15); 
      const opacityBase = 0.03 + (layer * 0.02); // Very subtle opacity

      for (let i = 0; i < count; i++) {
        const iconKey = iconKeys[Math.floor(Math.random() * iconKeys.length)];
        const isCar = ['sedan', 'suv', 'van'].includes(iconKey);

        items.push({
          path: iconPaths[iconKey],
          x: Math.random() * width,
          y: Math.random() * height,
          size: scaleBase * (0.8 + Math.random() * 0.4),
          speedX: (isCar ? 1 : (Math.random() - 0.5)) * speedBase * (0.8 + Math.random() * 0.4), // Cars mainly move right
          speedY: (Math.random() - 0.5) * speedBase * 0.5,
          opacity: opacityBase,
          rotation: 0,
          rotationSpeed: isCar ? 0 : (Math.random() - 0.5) * 0.2, // Cars don't spin
          type: isCar ? 'car' : 'abstract'
        });
      }
    }

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    let time = 0;

    const render = (timestamp = 0) => {
      animationFrameId = requestAnimationFrame(render);

      // The background is decorative; 30fps is visually smooth while cutting
      // its main-thread/canvas work roughly in half. Skip all painting in
      // background tabs as well.
      if (document.hidden || timestamp - lastFrameTime < 33) return;
      lastFrameTime = timestamp;
      time++;
      
      // Clear background
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, width, height);

      // Draw subtle road curves
      ctx.strokeStyle = `rgba(${primaryColorRGB}, ${isDark ? 0.03 : 0.05})`;
      ctx.lineWidth = 1;
      
      // Flowing lines
      for(let j = 1; j <= 3; j++) {
         ctx.beginPath();
         for (let i = 0; i <= width; i+=50) {
            const y = (height * 0.25 * j) + Math.sin(i * 0.001 + time * 0.002 + j) * 50;
            if (i===0) ctx.moveTo(i, y);
            else ctx.lineTo(i, y);
         }
         ctx.stroke();
      }

      // Draw Items
      items.forEach((item) => {
        // Movement
        item.x += item.speedX;
        item.y += item.speedY;
        item.rotation += item.rotationSpeed;

        // Wrap Logic
        const margin = 50 * item.size;
        if (item.x > width + margin) item.x = -margin;
        if (item.x < -margin) item.x = width + margin;
        if (item.y > height + margin) item.y = -margin;
        if (item.y < -margin) item.y = height + margin;

        // Draw
        ctx.save();
        ctx.translate(item.x, item.y);
        ctx.scale(item.size, item.size);
        
        if (item.type === 'abstract') {
           ctx.rotate(item.rotation * Math.PI / 180);
        } else {
           // Gentle floating effect for cars
           ctx.translate(0, Math.sin(time * 0.02 + item.x * 0.01) * 2);
        }

        ctx.translate(-12, -12); // Center pivot (24x24 icon)
        
        ctx.fillStyle = `rgba(${primaryColorRGB}, ${item.opacity})`;
        ctx.fill(item.path);

        ctx.restore();
      });

    };

    window.addEventListener('resize', resize);
    resize();
    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 z-0 w-full h-full pointer-events-none"
      style={{ transition: 'background-color 0.5s ease' }}
    />
  );
};

export default AnimatedBackground;
