import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, Crown, Type, Palette } from 'lucide-react';
import { AVAILABLE_CHANNEL_FONTS, type CustomFontOption } from '../lib/customChannelFontData';
import { soundFX } from '../lib/soundFx';

interface CustomChannelFontModalProps {
  streamerName: string;
  onClose: () => void;
}

export const CustomChannelFontModal: React.FC<CustomChannelFontModalProps> = ({
  streamerName,
  onClose
}) => {
  const [fonts] = useState<CustomFontOption[]>(AVAILABLE_CHANNEL_FONTS);
  const [selectedFontId, setSelectedFontId] = useState<string>('font_uncial');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleSelectFont = (font: CustomFontOption) => {
    soundFX.playPop();
    soundFX.playChestClaim();
    setSelectedFontId(font.id);
    setToastMsg(`🖋️ Applied Custom Typography: "${font.name}" to Live Stream Transcripts!`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleSave = () => {
    soundFX.playHarp();
    setToastMsg('✨ Custom Scribe Grimoire Fonts saved to Channel Theme Profile!');
    setTimeout(() => {
      setToastMsg(null);
      onClose();
    }, 1500);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="custom-font-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="custom-font-modal-header">
          <div className="custom-font-title-group">
            <div className="custom-font-badge">
              <Type size={16} />
              <span>SUB TIER 3 SCRIBE GRIMOIRE & CUSTOM CHANNEL FONTS</span>
            </div>
            <h3>@{streamerName}'s Custom Channel Typography</h3>
          </div>

          <button onClick={onClose} className="modal-close-btn" title="Close">
            <X size={20} />
          </button>
        </div>

        {/* Toast */}
        {toastMsg && (
          <div className="sub-celebration-toast">
            <Sparkles size={18} color="#ffd700" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Tier 3 Grimoire Banner */}
        <div className="grimoire-hero-banner">
          <Crown size={28} color="#ffd700" />
          <div>
            <h4>Tier 3 Subscriber Perk: Medieval Typography & Manuscripts</h4>
            <p>
              Unlock exquisite historical calligraphy typefaces that transform live captions, chat badges, and E-Reader manuscript headers for your subscribers.
            </p>
          </div>
        </div>

        {/* Fonts List */}
        <div className="channel-fonts-grid">
          {fonts.map(f => {
            const isSelected = f.id === selectedFontId;
            return (
              <div
                key={f.id}
                className={`font-option-card ${isSelected ? 'selected' : ''}`}
                onClick={() => handleSelectFont(f)}
              >
                <div className="font-card-top">
                  <div>
                    <strong>{f.name}</strong>
                    <span className="font-tier-tag" style={{ color: f.rarityColor }}>
                      {f.tierRequirement === 'TIER_3_GRIMOIRE' ? '💎 TIER 3 GRIMOIRE' : f.tierRequirement}
                    </span>
                  </div>
                  <CheckCircle2 size={16} color={isSelected ? '#00ff88' : 'var(--text-muted)'} />
                </div>

                <div className="font-preview-box" style={{ fontFamily: f.fontFamily }}>
                  <p>{f.sampleText}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="custom-font-modal-footer">
          <div className="footer-font-sub">
            <Palette size={14} color="var(--accent-teal)" />
            <span>Applies dynamically across web readers, mobile clients, and broadcast caption overlays.</span>
          </div>
          <button
            type="button"
            className="btn-primary"
            onClick={handleSave}
          >
            <CheckCircle2 size={16} />
            <span>Apply Font Preset</span>
          </button>
        </div>
      </div>
    </div>
  );
};
