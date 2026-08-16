import React, { useState } from 'react';
import { Moon } from 'lucide-react';

interface FloatingSticker {
  id: string;
  emoji: string;
  x: number;
}

export const KidReactionsBar: React.FC = () => {
  const [stickers, setStickers] = useState<FloatingSticker[]>([]);
  const [bedtimeMinutes] = useState(18);

  const reactionEmojis = [
    { emoji: '🌟', label: 'Magic Star' },
    { emoji: '🎈', label: 'Balloons' },
    { emoji: '🦄', label: 'Unicorn' },
    { emoji: '🦖', label: 'Dino' },
    { emoji: '💖', label: 'Love' },
    { emoji: '👏', label: 'Applause' },
    { emoji: '📖', label: 'Storytime' }
  ];

  const handleSendSticker = (emoji: string) => {
    const newSticker: FloatingSticker = {
      id: `st_${Date.now()}_${Math.random()}`,
      emoji,
      x: 20 + Math.random() * 60
    };

    setStickers(prev => [...prev, newSticker]);
    setTimeout(() => {
      setStickers(prev => prev.filter(s => s.id !== newSticker.id));
    }, 2000);
  };

  return (
    <div className="kid-reactions-container">
      {/* Floating Reaction Burst Canvas */}
      <div className="floating-stickers-canvas">
        {stickers.map(s => (
          <div
            key={s.id}
            className="floating-kid-sticker"
            style={{ left: `${s.x}%` }}
          >
            {s.emoji}
          </div>
        ))}
      </div>

      {/* Bedtime Countdown Banner */}
      <div className="bedtime-timer-pill">
        <Moon size={16} color="#ffd700" />
        <span>Bedtime Story Timer: <strong>{bedtimeMinutes} mins</strong> left</span>
      </div>

      {/* Big Touch-Friendly Stickers Bar */}
      <div className="kid-stickers-dock">
        <span className="dock-title">Tap to React!</span>
        <div className="stickers-row">
          {reactionEmojis.map(item => (
            <button
              key={item.label}
              onClick={() => handleSendSticker(item.emoji)}
              className="btn-kid-sticker"
              title={item.label}
            >
              <span>{item.emoji}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
