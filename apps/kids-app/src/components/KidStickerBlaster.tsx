import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { kidSound } from '../lib/kidSoundFx';

interface ActiveSticker {
  id: string;
  emoji: string;
  x: number;
  y: number;
  rotation: number;
}

const STICKER_PALETTE = [
  { emoji: '🌟', label: 'Star' },
  { emoji: '🐉', label: 'Dragon' },
  { emoji: '🦄', label: 'Unicorn' },
  { emoji: '🚀', label: 'Rocket' },
  { emoji: '🫧', label: 'Bubbles' },
  { emoji: '👑', label: 'Crown' },
  { emoji: '🪄', label: 'Wand' },
  { emoji: '💖', label: 'Heart' }
];

export const KidStickerBlaster: React.FC = () => {
  const [stickers, setStickers] = useState<ActiveSticker[]>([]);

  const handleBlastSticker = (emoji: string) => {
    kidSound.playMagicSparkle();

    const newSticker: ActiveSticker = {
      id: `stk_${Date.now()}_${Math.random()}`,
      emoji,
      x: 15 + Math.random() * 70, // 15% to 85% width
      y: 60 + Math.random() * 20, // 60% to 80% height start
      rotation: (Math.random() - 0.5) * 40
    };

    setStickers(prev => [...prev.slice(-12), newSticker]);

    setTimeout(() => {
      setStickers(prev => prev.filter(s => s.id !== newSticker.id));
    }, 2800);
  };

  return (
    <>
      {/* Floating Canvas Overlay */}
      <div className="kid-stickers-floating-layer">
        {stickers.map(s => (
          <div
            key={s.id}
            className="floating-kid-sticker"
            style={{
              left: `${s.x}%`,
              bottom: `${s.y}%`,
              transform: `rotate(${s.rotation}deg)`
            }}
          >
            {s.emoji}
          </div>
        ))}
      </div>

      {/* Interactive Bottom Cannon Toolbar */}
      <div className="kid-sticker-blaster-bar">
        <div className="blaster-title-tag">
          <Sparkles size={14} color="#ffd700" />
          <span>Sticker Cannon:</span>
        </div>
        <div className="stickers-row">
          {STICKER_PALETTE.map(stk => (
            <button
              key={stk.emoji}
              type="button"
              onClick={() => handleBlastSticker(stk.emoji)}
              className="btn-kid-sticker"
              title={`Blast ${stk.label}`}
            >
              <span>{stk.emoji}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
};
