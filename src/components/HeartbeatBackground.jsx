import React, { useEffect, useRef } from 'react';

const HeartbeatBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // ECG heartbeat pattern coordinates (normalized 0-1)
    const heartbeatPattern = [
      { x: 0, y: 0.5 },
      { x: 0.15, y: 0.5 },
      { x: 0.18, y: 0.48 },
      { x: 0.2, y: 0.2 },   // P wave
      { x: 0.22, y: 0.48 },
      { x: 0.25, y: 0.5 },
      { x: 0.35, y: 0.5 },
      { x: 0.37, y: 0.6 },  // Q wave
      { x: 0.39, y: 0.1 },  // R wave peak
      { x: 0.41, y: 0.65 }, // S wave
      { x: 0.43, y: 0.5 },
      { x: 0.48, y: 0.5 },
      { x: 0.5, y: 0.52 },
      { x: 0.55, y: 0.45 }, // T wave
      { x: 0.6, y: 0.5 },
      { x: 1, y: 0.5 }
    ];

    let offset = 0;
    const speed = 0.3;
    const lineColor = 'rgba(239, 68, 68, 0.15)'; // Red heartbeat pulse
    const gridColor = 'rgba(239, 68, 68, 0.03)'; // Subtle red grid

    const drawGrid = () => {
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 0.5;

      // Horizontal lines
      for (let y = 0; y < canvas.height; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Vertical lines
      for (let x = 0; x < canvas.width; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
    };

    const drawHeartbeat = (yOffset, scale = 1) => {
      const patternWidth = 400 * scale;
      const patternHeight = 100 * scale;
      const centerY = canvas.height * yOffset;

      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // Draw multiple heartbeats across the screen
      const numBeats = Math.ceil(canvas.width / patternWidth) + 2;
      
      for (let i = -1; i < numBeats; i++) {
        const baseX = i * patternWidth - offset;
        
        ctx.beginPath();
        for (let j = 0; j < heartbeatPattern.length; j++) {
          const point = heartbeatPattern[j];
          const x = baseX + point.x * patternWidth;
          const y = centerY + (point.y - 0.5) * patternHeight;
          
          if (j === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw grid
      drawGrid();

      // Draw multiple heartbeat lines at different positions
      drawHeartbeat(0.25, 1);    // Top
      drawHeartbeat(0.5, 1.2);   // Middle (slightly larger)
      drawHeartbeat(0.75, 1);    // Bottom

      // Update offset for animation
      offset += speed;
      if (offset > 400) {
        offset = 0;
      }

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
};

export default HeartbeatBackground;
