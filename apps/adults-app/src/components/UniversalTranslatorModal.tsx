import React, { useState } from 'react';
import {
  X,
  Languages,
  Sliders,
  Type
} from 'lucide-react';
import {
  SAMPLE_SUBTITLES,
  SUPPORTED_LANGUAGES,
  type SupportedLangCode
} from '../lib/translationData';
import { soundFX } from '../lib/soundFx';

interface UniversalTranslatorModalProps {
  onClose: () => void;
}

export const UniversalTranslatorModal: React.FC<UniversalTranslatorModalProps> = ({ onClose }) => {
  const [selectedLang, setSelectedLang] = useState<SupportedLangCode>('es');
  const [showDualTrack, setShowDualTrack] = useState(true);
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('lg');
  const [activeLineIdx, setActiveLineIdx] = useState(0);

  const handleSelectLang = (code: SupportedLangCode) => {
    soundFX.playPop();
    setSelectedLang(code);
  };

  const currentLine = SAMPLE_SUBTITLES[activeLineIdx] || SAMPLE_SUBTITLES[0];
  const langObj = SUPPORTED_LANGUAGES.find(l => l.code === selectedLang) || SUPPORTED_LANGUAGES[0];

  return (
    <div className="modal-backdrop">
      <div className="translator-modal-card">
        {/* Header */}
        <div className="translator-modal-header">
          <div className="translator-title-group">
            <Languages size={24} color="#00e5ff" className="pulse-fast" />
            <div>
              <h3>🌍 Universal Live Translator & Subtitle Bridge</h3>
              <span className="modal-subtitle">Real-Time AI Multi-Language Narration Translation</span>
            </div>
          </div>
          <button onClick={onClose} className="modal-close-btn">
            <X size={18} />
          </button>
        </div>

        {/* Language Selection Buttons */}
        <div className="translator-lang-selector-row">
          <span className="lang-lbl">Translate Narration To:</span>
          <div className="lang-pills-list">
            {SUPPORTED_LANGUAGES.map(lang => (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleSelectLang(lang.code)}
                className={`lang-pill-btn ${selectedLang === lang.code ? 'active' : ''}`}
              >
                <span>{lang.flag}</span>
                <span>{lang.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Live Subtitle Cinema Preview Card */}
        <div className="subtitle-cinema-card">
          <div className="cinema-top-bar">
            <div className="live-trans-indicator">
              <span className="live-dot-pulse"></span>
              <span>LIVE AI TRANSLATION: <strong>{langObj.label}</strong></span>
            </div>
            <span className="trans-timestamp">{currentLine.timestamp}</span>
          </div>

          <div className={`cinema-subtitle-viewport font-size-${fontSize}`}>
            {showDualTrack && (
              <p className="sub-original-en">
                "{currentLine.originalEnglish}"
              </p>
            )}
            <p className="sub-translated-text">
              "{currentLine.translations[selectedLang]}"
            </p>
          </div>

          {/* Line Scrubber */}
          <div className="subtitle-stepper-row">
            {SAMPLE_SUBTITLES.map((line, idx) => (
              <button
                key={line.id}
                type="button"
                onClick={() => {
                  soundFX.playPop();
                  setActiveLineIdx(idx);
                }}
                className={`sub-step-dot ${activeLineIdx === idx ? 'active' : ''}`}
                title={`Jump to sentence ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Display Settings Toolbar */}
        <div className="translator-settings-bar">
          <div className="setting-control-item">
            <Type size={16} color="var(--accent-secondary)" />
            <span>Font Size:</span>
            <div className="font-size-options">
              {(['sm', 'md', 'lg', 'xl'] as const).map(size => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setFontSize(size)}
                  className={`btn-size-choice ${fontSize === size ? 'active' : ''}`}
                >
                  {size.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="setting-control-item">
            <Sliders size={16} color="#ffd700" />
            <label className="toggle-dual-label">
              <input
                type="checkbox"
                checked={showDualTrack}
                onChange={e => setShowDualTrack(e.target.checked)}
              />
              <span>Dual-Track (Show English + Translated)</span>
            </label>
          </div>
        </div>

        <div className="modal-actions">
          <button type="button" onClick={onClose} className="btn-primary">
            Apply Subtitles to Stream
          </button>
        </div>
      </div>
    </div>
  );
};
