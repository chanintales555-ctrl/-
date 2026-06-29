import React, { useEffect, useRef } from 'react';

const Medical3DCanvas = ({ interactive = true, speedMultiplier = 1 }) => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Handle resize
    const resizeCanvas = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Mouse movement tracker
    const handleMouseMove = (e) => {
      if (!interactive) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      mouseRef.current.targetX = x * 0.05;
      mouseRef.current.targetY = y * 0.05;
    };

    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    // 3D Model: Star of Life (Medical Cross)
    // We define vertices for a 3D medical cross
    const vertices = [];
    const size = 60;
    const thickness = 20;

    // Build the 3D cross
    // Front face
    // Center horizontal bar
    vertices.push({ x: -size, y: -thickness, z: thickness });
    vertices.push({ x: size, y: -thickness, z: thickness });
    vertices.push({ x: size, y: thickness, z: thickness });
    vertices.push({ x: -size, y: thickness, z: thickness });
    // Center vertical bar
    vertices.push({ x: -thickness, y: -size, z: thickness });
    vertices.push({ x: thickness, y: -size, z: thickness });
    vertices.push({ x: thickness, y: size, z: thickness });
    vertices.push({ x: -thickness, y: size, z: thickness });

    // Back face
    vertices.push({ x: -size, y: -thickness, z: -thickness });
    vertices.push({ x: size, y: -thickness, z: -thickness });
    vertices.push({ x: size, y: thickness, z: -thickness });
    vertices.push({ x: -size, y: thickness, z: -thickness });
    vertices.push({ x: -thickness, y: -size, z: -thickness });
    vertices.push({ x: thickness, y: -size, z: -thickness });
    vertices.push({ x: thickness, y: size, z: -thickness });
    vertices.push({ x: -thickness, y: size, z: -thickness });

    // Connection lines (edges) between vertices
    const edges = [
      // Front cross edges
      [0, 1], [1, 2], [2, 3], [3, 0],
      [4, 5], [5, 6], [6, 7], [7, 4],
      // Back cross edges
      [8, 9], [9, 10], [10, 11], [11, 8],
      [12, 13], [13, 14], [14, 15], [15, 12],
      // Connect front and back
      [0, 8], [1, 9], [2, 10], [3, 11],
      [4, 12], [5, 13], [6, 14], [7, 15]
    ];

    let angleX = 0.01;
    let angleY = 0.015;
    let angleZ = 0.005;

    // EKG Wave Track
    const ekgPoints = [];
    const maxEkgPoints = 120;
    let ekgTime = 0;

    // Main Render Loop
    const render = () => {
      const w = canvas.width / window.devicePixelRatio;
      const h = canvas.height / window.devicePixelRatio;

      ctx.clearRect(0, 0, w, h);

      // Smooth mouse interaction
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      const currentAngleX = angleX + mouseRef.current.y * 0.01;
      const currentAngleY = angleY + mouseRef.current.x * 0.01;
      angleX += 0.005 * speedMultiplier;
      angleY += 0.008 * speedMultiplier;

      // 1. Draw EKG Pulse Wave at the bottom
      ctx.beginPath();
      ctx.lineWidth = 2.5;
      const gradient = ctx.createLinearGradient(0, 0, w, 0);
      gradient.addColorStop(0, 'rgba(0, 240, 255, 0.05)');
      gradient.addColorStop(0.5, 'rgba(0, 240, 255, 0.8)');
      gradient.addColorStop(1, 'rgba(0, 240, 255, 0.05)');
      ctx.strokeStyle = gradient;

      // Update EKG wave math
      ekgTime += 0.08 * speedMultiplier;
      let ekgVal = 0;
      const cycle = ekgTime % (Math.PI * 2);
      
      // Simulate heart beat waveform (P-Q-R-S-T)
      if (cycle > 0 && cycle < 0.3) { // P Wave
        ekgVal = Math.sin((cycle / 0.3) * Math.PI) * 10;
      } else if (cycle >= 0.3 && cycle < 0.45) { // Q Dip
        ekgVal = -((cycle - 0.3) / 0.15) * 8;
      } else if (cycle >= 0.45 && cycle < 0.6) { // R Peak (Sharp rise)
        ekgVal = -8 + ((cycle - 0.45) / 0.15) * 50;
      } else if (cycle >= 0.6 && cycle < 0.75) { // S Dip (Sharp drop)
        ekgVal = 42 - ((cycle - 0.6) / 0.15) * 60;
      } else if (cycle >= 0.75 && cycle < 0.9) { // Return to base
        ekgVal = -18 + ((cycle - 0.75) / 0.15) * 18;
      } else if (cycle >= 1.2 && cycle < 1.6) { // T Wave
        ekgVal = Math.sin(((cycle - 1.2) / 0.4) * Math.PI) * 14;
      }

      ekgPoints.push(ekgVal);
      if (ekgPoints.length > maxEkgPoints) {
        ekgPoints.shift();
      }

      const ekgStartY = h - 60;
      for (let i = 0; i < ekgPoints.length; i++) {
        const xPos = (w / maxEkgPoints) * i;
        const yPos = ekgStartY - ekgPoints[i];
        if (i === 0) {
          ctx.moveTo(xPos, yPos);
        } else {
          ctx.lineTo(xPos, yPos);
        }
      }
      ctx.stroke();

      // 2. Draw 3D Rotating Medical Cross
      const cx = w / 2;
      const cy = h / 2 - 30; // Centered
      const d = 300; // Perspective distance

      // Project vertices
      const projected = vertices.map(v => {
        // Rotate X
        let y1 = v.y * Math.cos(currentAngleX) - v.z * Math.sin(currentAngleX);
        let z1 = v.y * Math.sin(currentAngleX) + v.z * Math.cos(currentAngleX);
        
        // Rotate Y
        let x2 = v.x * Math.cos(currentAngleY) - z1 * Math.sin(currentAngleY);
        let z2 = v.x * Math.sin(currentAngleY) + z1 * Math.cos(currentAngleY);
        
        // Perspective Projection
        const scale = d / (d + z2);
        const xProjected = x2 * scale + cx;
        const yProjected = y1 * scale + cy;

        return { x: xProjected, y: yProjected, depth: z2 };
      });

      // Draw Edges with depth-based color/opacity
      edges.forEach(([p1Idx, p2Idx]) => {
        const p1 = projected[p1Idx];
        const p2 = projected[p2Idx];
        
        const avgDepth = (p1.depth + p2.depth) / 2;
        // Map depth to opacity (closer = brighter)
        const alpha = Math.max(0.15, Math.min(0.8, 1 - (avgDepth + size) / (size * 3.5)));
        
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
        ctx.lineWidth = avgDepth < 0 ? 2.5 : 1.2; // Thicker lines when closer
        ctx.shadowColor = 'rgba(0, 240, 255, 0.5)';
        ctx.shadowBlur = avgDepth < 0 ? 15 : 2;
        ctx.stroke();
        ctx.shadowBlur = 0; // reset
      });

      // Draw glow core in the center of the cross
      ctx.beginPath();
      ctx.arc(cx, cy, 10, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 240, 255, 0.2)';
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 30;
      ctx.fill();
      ctx.shadowBlur = 0; // reset

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      if (interactive) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [interactive, speedMultiplier]);

  return <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />;
};

export default Medical3DCanvas;
