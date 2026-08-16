import React, { useRef, useState, useEffect } from 'react';
import { Palette, Trash2, Send, CheckCircle2, X } from 'lucide-react';
import { kidSound } from '../lib/kidSoundFx';

interface KidDrawTogetherProps {
  storytellerName: string;
  storyPrompt?: string;
  onClose?: () => void;
  onSubmitDrawing?: (imgData: string) => void;
}

const COLORS = ['#ff0055', '#ff9900', '#ffd700', '#00ff66', '#00e5ff', '#9900ff', '#ff00aa', '#ffffff', '#222222'];

export const KidDrawTogether: React.FC<KidDrawTogetherProps> = ({
  storytellerName,
  storyPrompt = 'Draw what happens next in the story!',
  onClose,
  onSubmitDrawing
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#ffd700');
  const [brushSize, setBrushSize] = useState(6);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#1e1b4b'; // Deep night sky background
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.beginPath();
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let clientX = 0;
    let clientY = 0;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.strokeStyle = selectedColor;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const handleClear = () => {
    kidSound.playBubblePop();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#1e1b4b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const handleSubmit = () => {
    kidSound.playStarCoin();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    if (onSubmitDrawing) {
      onSubmitDrawing(dataUrl);
    }
    setIsSubmitted(true);
  };

  return (
    <div className="kid-draw-card">
      <div className="draw-header">
        <div className="draw-title-group">
          <Palette size={18} color="#ffd700" />
          <div>
            <h4>Draw for Storyteller @{storytellerName}!</h4>
            <p className="draw-prompt-txt">✨ {storyPrompt}</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="btn-kid-close">
            <X size={16} />
          </button>
        )}
      </div>

      {!isSubmitted ? (
        <>
          <div className="canvas-wrapper">
            <canvas
              ref={canvasRef}
              width={400}
              height={260}
              onMouseDown={startDrawing}
              onMouseUp={stopDrawing}
              onMouseMove={draw}
              onTouchStart={startDrawing}
              onTouchEnd={stopDrawing}
              onTouchMove={draw}
              className="kid-drawing-canvas"
            />
          </div>

          <div className="draw-controls-bar">
            {/* Color Swatches */}
            <div className="colors-row">
              {COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    kidSound.playBubblePop();
                    setSelectedColor(c);
                  }}
                  className={`draw-color-btn ${selectedColor === c ? 'active' : ''}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>

            {/* Brush Size & Actions */}
            <div className="draw-actions-row">
              <div className="brush-sizes">
                {[3, 6, 12].map(size => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => {
                      kidSound.playBubblePop();
                      setBrushSize(size);
                    }}
                    className={`btn-brush-size ${brushSize === size ? 'active' : ''}`}
                  >
                    <div style={{ width: size * 1.5, height: size * 1.5, borderRadius: '50%', backgroundColor: '#fff' }} />
                  </button>
                ))}
              </div>

              <button type="button" onClick={handleClear} className="btn-draw-clear" title="Clear Canvas">
                <Trash2 size={14} /> Clear
              </button>

              <button type="button" onClick={handleSubmit} className="btn-draw-submit">
                <Send size={14} /> Send Drawing!
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="drawing-submitted-card">
          <CheckCircle2 size={36} color="#00ff88" className="pulse-fast" />
          <h4>Drawing Sent to @{storytellerName}! 🎨</h4>
          <p>Your artwork has been sent to the live story gallery! You earned <strong>+10 ⭐ Star Coins</strong>!</p>
          <button
            type="button"
            onClick={() => setIsSubmitted(false)}
            className="btn-draw-again"
          >
            Draw Another Picture
          </button>
        </div>
      )}
    </div>
  );
};
