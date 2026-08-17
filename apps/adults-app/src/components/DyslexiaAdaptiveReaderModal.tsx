import React, { useState } from 'react';
import { X, Eye, Sparkles, CheckCircle2 } from 'lucide-react';
import { DEFAULT_ADAPTIVE_PROFILE, type AdaptiveReadingProfile } from '../lib/dyslexiaAdaptiveData';
import { soundFX } from '../lib/soundFx';

interface DyslexiaAdaptiveReaderModalProps {
  streamerName: string;
  onClose: () => void;
}

export const DyslexiaAdaptiveReaderModal: React.FC<DyslexiaAdaptiveReaderModalProps> = ({
  streamerName,
  onClose
}) => {
  const [profile, setProfile] = useState<AdaptiveReadingProfile>(DEFAULT_ADAPTIVE_PROFILE);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleSaveProfile = () => {
    soundFX.playPop();
    soundFX.playChestClaim();
    setToastMsg('👁️ Saved Adaptive E-Reader accessibility preferences to your browser profile!');
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="adaptive-reader-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="adaptive-reader-modal-header">
          <div className="adaptive-reader-title-group">
            <div className="adaptive-reader-badge">
              <Eye size={16} />
              <span>DYSLEXIA & HIGH-CONTRAST ADAPTIVE E-READER OVERLAY</span>
            </div>
            <h3>@{streamerName}'s Accessible Reading Staging</h3>
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

        {/* Live Reader Preview Box */}
        <div className={`adaptive-reader-preview-stage ${profile.colorTheme.toLowerCase()}`}>
          <div className="preview-ruler-overlay" style={{ display: profile.readingRulerLineHighlight ? 'block' : 'none' }}></div>
          <div
            className={`sample-text-block ${profile.fontFamily.toLowerCase()}`}
            style={{
              fontSize: `${profile.fontSizePx}px`,
              letterSpacing: `${profile.letterSpacingEm}em`,
              lineHeight: profile.lineHeightRatio
            }}
          >
            {profile.bionicReadingBoldWeight ? (
              <p>
                <strong>Th</strong>e <strong>anc</strong>ient <strong>dra</strong>gon <strong>cir</strong>cled <strong>th</strong>e <strong>moun</strong>tain <strong>pe</strong>ak, <strong>i</strong>ts <strong>sca</strong>les <strong>gleam</strong>ing <strong>li</strong>ke <strong>pol</strong>ished <strong>obsid</strong>ian <strong>bene</strong>ath <strong>th</strong>e <strong>twi</strong>light <strong>st</strong>ars. <strong>Ev</strong>ery <strong>bre</strong>ath <strong>sen</strong>t <strong>ripp</strong>les <strong>o</strong>f <strong>gol</strong>den <strong>fi</strong>re <strong>int</strong>o <strong>th</strong>e <strong>nig</strong>ht <strong>sk</strong>y.
              </p>
            ) : (
              <p>
                The ancient dragon circled the mountain peak, its scales gleaming like polished obsidian beneath the twilight stars. Every breath sent ripples of golden fire into the night sky.
              </p>
            )}
          </div>
        </div>

        {/* Controls Grid */}
        <div className="adaptive-controls-grid">
          <div className="control-item">
            <label>Adaptive Font Family</label>
            <select
              value={profile.fontFamily}
              onChange={e => setProfile({ ...profile, fontFamily: e.target.value as any })}
            >
              <option value="OPEN_DYSLEXIC">OpenDyslexic (Weighted Bottoms)</option>
              <option value="ATKINSON_HYPERLEGIBLE">Atkinson Hyperlegible (Braille Institute)</option>
              <option value="LEXEND_DECA">Lexend Deca (Reading Fluency)</option>
              <option value="STANDARD_SANS">Standard System Sans</option>
            </select>
          </div>

          <div className="control-item">
            <label>Color Contrast Theme</label>
            <select
              value={profile.colorTheme}
              onChange={e => setProfile({ ...profile, colorTheme: e.target.value as any })}
            >
              <option value="CREAM_WARM_SEPIA">Warm Cream & Dark Amber Sepia</option>
              <option value="HIGH_CONTRAST_YELLOW_BLACK">High Contrast Yellow on Obsidian</option>
              <option value="SOLARIZED_DARK">Solarized Midnight Teal</option>
              <option value="TINTED_CYAN">Soft Tinted Cyan (Scotopic Sensitivity)</option>
            </select>
          </div>

          <div className="control-item">
            <label>Font Size ({profile.fontSizePx}px)</label>
            <input
              type="range"
              min={14}
              max={32}
              value={profile.fontSizePx}
              onChange={e => setProfile({ ...profile, fontSizePx: Number(e.target.value) })}
            />
          </div>

          <div className="control-item">
            <label>Letter Spacing ({profile.letterSpacingEm}em)</label>
            <input
              type="range"
              min={0.05}
              max={0.35}
              step={0.05}
              value={profile.letterSpacingEm}
              onChange={e => setProfile({ ...profile, letterSpacingEm: Number(e.target.value) })}
            />
          </div>

          <div className="toggle-option-row">
            <label>
              <input
                type="checkbox"
                checked={profile.bionicReadingBoldWeight}
                onChange={e => setProfile({ ...profile, bionicReadingBoldWeight: e.target.checked })}
              />
              <span>Bionic Reading Fixation Bolding</span>
            </label>

            <label>
              <input
                type="checkbox"
                checked={profile.readingRulerLineHighlight}
                onChange={e => setProfile({ ...profile, readingRulerLineHighlight: e.target.checked })}
              />
              <span>Sentence Reading Ruler Overlay</span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="adaptive-reader-modal-footer">
          <span className="footer-adaptive-note">
            👁️ Designed according to British Dyslexia Association and WCAG 2.2 AAA accessibility guidelines.
          </span>
          <button
            type="button"
            className="btn-primary"
            onClick={() => {
              handleSaveProfile();
              onClose();
            }}
          >
            <CheckCircle2 size={16} />
            <span>Apply Accessibility Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};
