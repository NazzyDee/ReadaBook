import React, { useState } from 'react';
import {
  X,
  Smartphone,
  QrCode,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Tv,
  Zap,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon
} from 'lucide-react';
import { soundFX } from '../lib/soundFx';

interface CompanionModeModalProps {
  bookTitle?: string;
  currentPage?: number;
  totalPages?: number;
  onClose: () => void;
}

export const CompanionModeModal: React.FC<CompanionModeModalProps> = ({
  bookTitle = 'The Fellowship of the Ring',
  currentPage = 245,
  totalPages = 423,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'qr' | 'preview'>('preview');
  const [page, setPage] = useState(currentPage);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [fontSize, setFontSize] = useState(16);
  const [selectedTriviaOption, setSelectedTriviaOption] = useState<number | null>(null);
  const pairedDevice = 'iPhone 15 Pro (Safari)';

  const handleNextPage = () => {
    soundFX.playPageRustle();
    setPage(p => Math.min(totalPages, p + 1));
  };

  const handlePrevPage = () => {
    soundFX.playPageRustle();
    setPage(p => Math.max(1, p - 1));
  };

  const handleSelectTrivia = (idx: number) => {
    soundFX.playPop();
    setSelectedTriviaOption(idx);
  };

  return (
    <div className="modal-backdrop">
      <div className="companion-modal-card">
        {/* Header */}
        <div className="companion-modal-header">
          <div className="companion-title-group">
            <Smartphone size={24} color="#00e5ff" />
            <div>
              <h3>📱 Second-Screen Companion HUD</h3>
              <span className="modal-subtitle">Sync your smartphone or tablet for personal e-reading, voting, and controls</span>
            </div>
          </div>
          <button onClick={onClose} className="modal-close-btn">
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="companion-tabs-row">
          <button
            type="button"
            onClick={() => {
              soundFX.playPop();
              setActiveTab('preview');
            }}
            className={`companion-tab-btn ${activeTab === 'preview' ? 'active' : ''}`}
          >
            <Smartphone size={14} />
            <span>Interactive Mobile Screen Simulator</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundFX.playPop();
              setActiveTab('qr');
            }}
            className={`companion-tab-btn ${activeTab === 'qr' ? 'active' : ''}`}
          >
            <QrCode size={14} />
            <span>Pair Physical Device (QR Code)</span>
          </button>
        </div>

        {/* TAB 1: INTERACTIVE MOBILE SCREEN SIMULATOR */}
        {activeTab === 'preview' && (
          <div className="companion-preview-layout">
            {/* Left: Device Frame */}
            <div className="phone-device-frame">
              <div className="phone-notch" />

              {/* Top Phone Status Bar */}
              <div className="phone-status-bar">
                <span>9:41</span>
                <span className="paired-pill">● SYNCED</span>
                <span>📶 🔋 100%</span>
              </div>

              {/* Phone Content Screen */}
              <div className={`phone-screen-content ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
                {/* Book Header Bar */}
                <div className="phone-book-header">
                  <span className="phone-book-title">{bookTitle}</span>
                  <div className="phone-reader-tools">
                    <button
                      type="button"
                      onClick={() => setIsDarkMode(!isDarkMode)}
                      className="btn-phone-tool"
                    >
                      {isDarkMode ? <Sun size={12} /> : <Moon size={12} />}
                    </button>
                    <button
                      type="button"
                      onClick={() => setFontSize(f => (f >= 20 ? 14 : f + 2))}
                      className="btn-phone-tool"
                    >
                      A+
                    </button>
                  </div>
                </div>

                {/* E-Reader Text Viewport */}
                <div className="phone-text-viewport" style={{ fontSize: `${fontSize}px` }}>
                  <p className="phone-p">
                    "The dark world of Moria seemed to press in from all sides. In the ancient deeps, the sound of water dripping like ticking clocks measured out their peril."
                  </p>
                  <p className="phone-p">
                    Frodo touched the hilt of Sting. It gleamed faintly with a cold blue luminescence in the shadow.
                  </p>
                </div>

                {/* Quick In-Stream Trivia Controller Card */}
                <div className="phone-trivia-card">
                  <span className="phone-card-title">👑 Live Trivia Question:</span>
                  <p className="phone-trivia-q">What is the Elvish word for "Friend"?</p>
                  <div className="phone-trivia-grid">
                    {['A: Mellon', 'B: Namárie', 'C: Elen', 'D: Mithrandir'].map((opt, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSelectTrivia(i)}
                        className={`btn-phone-opt ${selectedTriviaOption === i ? 'selected' : ''}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Phone Bottom Page Controls */}
                <div className="phone-page-bar">
                  <button type="button" onClick={handlePrevPage} className="btn-phone-nav">
                    <ChevronLeft size={16} />
                  </button>
                  <span className="phone-page-count">Page {page} of {totalPages}</span>
                  <button type="button" onClick={handleNextPage} className="btn-phone-nav">
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Companion Info & Customizer */}
            <div className="companion-settings-col">
              <div className="companion-info-box">
                <CheckCircle2 size={18} color="#00ff88" />
                <div>
                  <strong>Paired Device Active</strong>
                  <span>{pairedDevice}</span>
                </div>
              </div>

              <div className="companion-features-list">
                <div className="feature-item">
                  <BookOpen size={16} color="var(--accent-secondary)" />
                  <div>
                    <strong>Synchronized Page Turns</strong>
                    <p>When the broadcaster turns the book page, your mobile companion instantly follows along.</p>
                  </div>
                </div>

                <div className="feature-item">
                  <Zap size={16} color="#ffd700" />
                  <div>
                    <strong>Mobile Trivia Gamepad</strong>
                    <p>Answer Book Battle Royale questions from your phone screen without obscuring the desktop stream.</p>
                  </div>
                </div>

                <div className="feature-item">
                  <Tv size={16} color="#ff477e" />
                  <div>
                    <strong>Zero-Distraction Big Screen Mode</strong>
                    <p>Keep your computer monitor in full-screen cinema video while your phone manages chat and notes.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: QR CODE PAIRING */}
        {activeTab === 'qr' && (
          <div className="companion-qr-layout">
            <div className="qr-box">
              <div className="qr-code-placeholder">
                <QrCode size={140} color="#00e5ff" />
              </div>
              <span className="pairing-code-lbl">Pairing Code: <strong>READA-8842</strong></span>
            </div>

            <div className="qr-instructions">
              <h4>How to Connect Your Mobile Device</h4>
              <ol>
                <li>Open your smartphone camera or Safari / Chrome browser.</li>
                <li>Scan the QR code above or navigate to <code>readabook.tv/pair</code>.</li>
                <li>Enter the 6-digit pairing code <strong>READA-8842</strong> to link your stream session.</li>
              </ol>
              <div className="qr-hint">
                <Sparkles size={14} color="#ffd700" />
                <span>Works on iOS Safari, iPadOS, Android Chrome, and Kindle Fire tablets!</span>
              </div>
            </div>
          </div>
        )}

        <div className="modal-actions">
          <button type="button" onClick={onClose} className="btn-primary">
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
