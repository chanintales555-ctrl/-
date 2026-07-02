import React, { useRef, useState, useEffect } from 'react';
import { X, Eraser, Check } from 'lucide-react';

const SignaturePad = ({ isOpen, onClose, onSave, title = "✍️ ลงลายเซ็นดิจิทัลผู้นิเทศ" }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Small delay to ensure modal is fully rendered before setting up canvas
      const timer = setTimeout(() => {
        setupCanvas();
      }, 150);

      // Handle screen resize or rotation automatically
      window.addEventListener('resize', setupCanvas);
      
      return () => {
        clearTimeout(timer);
        window.removeEventListener('resize', setupCanvas);
      };
    }
  }, [isOpen]);

  const setupCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Reset dimensions to let flexbox container guide the bounding rect
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    // Set internal buffer size
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    
    // Restore drawing styles
    ctx.strokeStyle = '#0052cc'; // Professional navy/blue pen color
    ctx.lineWidth = 3.0; // Slightly thicker for larger screens
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height);
    setHasDrawn(false);
  };

  // Helper to get coordinates for touch and mouse
  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDrawing = (e) => {
    if (e.cancelable) e.preventDefault();
    
    const coords = getCoordinates(e);
    if (!coords) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    if (e.cancelable) e.preventDefault();

    const coords = getCoordinates(e);
    if (!coords) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
    setHasDrawn(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    ctx.clearRect(0, 0, rect.width, rect.height);
    setHasDrawn(false);
  };

  const handleSave = () => {
    if (!hasDrawn) {
      alert("กรุณาเซ็นลายเซ็นก่อนกดบันทึกครับ");
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Export signature as transparent PNG
    const dataUrl = canvas.toDataURL('image/png');
    onSave(dataUrl);
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(15, 23, 42, 0.45)',
      backdropFilter: 'blur(5px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 300,
      padding: '10px',
      boxSizing: 'border-box'
    }}>
      {/* Fullscreen Adaptive Panel */}
      <div className="glass-panel" style={{
        width: '96vw',
        height: '92vh',
        maxWidth: '1000px', // Caps size on large desktop screens
        maxHeight: '94vh',
        background: '#ffffff',
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 25px 60px rgba(0, 50, 150, 0.25)',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        boxSizing: 'border-box',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          <div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>{title}</h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px', marginBottom: 0 }}>
              กรุณาเขียนเซ็นชื่อภายในกรอบประเส้นสีฟ้าด้านล่างนี้ (หากหน้าจอยังไม่เป็นแนวนอน สามารถหมุนอุปกรณ์เป็นแนวนอนเพื่อพื้นที่เขียนที่กว้างขึ้นได้ครับ)
            </p>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Dynamic Canvas Container (using flex: 1 to auto-stretch portrait/landscape) */}
        <div style={{
          border: '2px dashed rgba(0, 102, 204, 0.3)',
          borderRadius: 'var(--radius-md)',
          background: '#fafbfd',
          position: 'relative',
          flex: 1, // Fills all remaining space in the viewport height
          width: '100%',
          overflow: 'hidden',
          touchAction: 'none',
          boxSizing: 'border-box'
        }}>
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            style={{
              display: 'block',
              width: '100%',
              height: '100%',
              cursor: 'crosshair'
            }}
          />
          {!hasDrawn && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: 'rgba(0, 102, 204, 0.2)',
              fontSize: '1rem',
              fontWeight: 500,
              pointerEvents: 'none',
              userSelect: 'none',
              textAlign: 'center'
            }}>
              ✍️ พื้นที่ลงชื่อประเมิน
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', flexShrink: 0, marginTop: '4px' }}>
          <button
            type="button"
            onClick={clearCanvas}
            className="btn-secondary"
            style={{
              padding: '10px 20px',
              fontSize: '0.85rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              border: '1px solid var(--border-light)',
              background: '#f8fafc'
            }}
          >
            <Eraser size={15} /> ล้างหน้าจอ
          </button>
          
          <button
            type="button"
            onClick={handleSave}
            className="btn-primary"
            style={{
              padding: '10px 24px',
              fontSize: '0.85rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Check size={15} /> บันทึกลายเซ็น
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignaturePad;
