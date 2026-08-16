import React, { useState } from 'react';
import { X, Sparkles, Check } from 'lucide-react';
import { kidSound } from '../lib/kidSoundFx';

interface KidAvatarStudioModalProps {
  onClose: () => void;
  onSaveAvatar?: (avatarData: any) => void;
}

const BASES = [
  { id: 'fox', label: 'Playful Fox', emoji: '🦊' },
  { id: 'bear', label: 'Cozy Bear', emoji: '🐻' },
  { id: 'robot', label: 'Bleep Robot', emoji: '🤖' },
  { id: 'cat', label: 'Magic Cat', emoji: '🐱' },
  { id: 'owl', label: 'Wise Owl', emoji: '🦉' }
];

const HATS = [
  { id: 'wizard', label: 'Wizard Hat', emoji: '🧙' },
  { id: 'crown', label: 'Gold Crown', emoji: '👑' },
  { id: 'pirate', label: 'Pirate Hat', emoji: '🏴‍☠️' },
  { id: 'astronaut', label: 'Space Helmet', emoji: '🚀' },
  { id: 'flower', label: 'Flower Crown', emoji: '🌸' }
];

const PETS = [
  { id: 'dragon', label: 'Baby Dragon', emoji: '🐲' },
  { id: 'bunny', label: 'Fluffy Bunny', emoji: '🐰' },
  { id: 'puppy', label: 'Golden Pup', emoji: '🐶' },
  { id: 'butterfly', label: 'Glow Butterfly', emoji: '🦋' }
];

export const KidAvatarStudioModal: React.FC<KidAvatarStudioModalProps> = ({
  onClose,
  onSaveAvatar
}) => {
  const [selectedBase, setSelectedBase] = useState(BASES[0]);
  const [selectedHat, setSelectedHat] = useState(HATS[0]);
  const [selectedPet, setSelectedPet] = useState(PETS[0]);
  const [bgColor, setBgColor] = useState('#8338ec');

  const handleSave = () => {
    kidSound.playStarCoin();
    if (onSaveAvatar) {
      onSaveAvatar({
        base: selectedBase,
        hat: selectedHat,
        pet: selectedPet,
        bg: bgColor
      });
    }
    onClose();
  };

  return (
    <div className="kid-modal-backdrop">
      <div className="kid-avatar-modal-card">
        {/* Header */}
        <div className="kid-modal-header">
          <div className="kid-modal-title">
            <Sparkles size={24} color="#ffd700" />
            <h3>Magical Avatar Studio! 🎨</h3>
          </div>
          <button onClick={onClose} className="btn-kid-close">
            <X size={20} />
          </button>
        </div>

        {/* Live Avatar Preview */}
        <div className="avatar-preview-showcase" style={{ backgroundColor: bgColor }}>
          <div className="avatar-hat-layer">{selectedHat.emoji}</div>
          <div className="avatar-base-layer">{selectedBase.emoji}</div>
          <div className="avatar-pet-layer">{selectedPet.emoji}</div>
          <span className="avatar-preview-label">
            {selectedHat.label} {selectedBase.label} with {selectedPet.label}
          </span>
        </div>

        {/* Customization Options */}
        <div className="avatar-customizer-tabs">
          {/* Base Character */}
          <div className="avatar-section">
            <label className="kid-section-label">1. Pick Character:</label>
            <div className="options-row">
              {BASES.map(b => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => {
                    kidSound.playBubblePop();
                    setSelectedBase(b);
                  }}
                  className={`btn-avatar-opt ${selectedBase.id === b.id ? 'active' : ''}`}
                >
                  <span className="opt-emoji">{b.emoji}</span>
                  <span className="opt-lbl">{b.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Hats */}
          <div className="avatar-section">
            <label className="kid-section-label">2. Pick Magical Hat:</label>
            <div className="options-row">
              {HATS.map(h => (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => {
                    kidSound.playBubblePop();
                    setSelectedHat(h);
                  }}
                  className={`btn-avatar-opt ${selectedHat.id === h.id ? 'active' : ''}`}
                >
                  <span className="opt-emoji">{h.emoji}</span>
                  <span className="opt-lbl">{h.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Companion Pet */}
          <div className="avatar-section">
            <label className="kid-section-label">3. Pick Story Companion:</label>
            <div className="options-row">
              {PETS.map(p => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    kidSound.playBubblePop();
                    setSelectedPet(p);
                  }}
                  className={`btn-avatar-opt ${selectedPet.id === p.id ? 'active' : ''}`}
                >
                  <span className="opt-emoji">{p.emoji}</span>
                  <span className="opt-lbl">{p.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Background Glow */}
          <div className="avatar-section">
            <label className="kid-section-label">4. Background Color:</label>
            <div className="color-swatches-row">
              {['#8338ec', '#ff006e', '#3a86ff', '#fb5607', '#00f5d4'].map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    kidSound.playBubblePop();
                    setBgColor(c);
                  }}
                  className={`btn-color-swatch ${bgColor === c ? 'active' : ''}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="kid-modal-actions">
          <button type="button" onClick={handleSave} className="btn-kid-save">
            <Check size={18} />
            <span>Save My Magical Avatar!</span>
          </button>
        </div>
      </div>
    </div>
  );
};
