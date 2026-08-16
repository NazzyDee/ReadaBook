import React, { useState } from 'react';
import { X, Activity, BookOpen, Clock, Zap, BookMarked, Sparkles } from 'lucide-react';
import { MOCK_READING_TELEMETRY, type ReadingTelemetryStats } from '../lib/readingTelemetryData';
import { soundFX } from '../lib/soundFx';

interface ReadingTelemetryModalProps {
  streamerName: string;
  onClose: () => void;
}

export const ReadingTelemetryModal: React.FC<ReadingTelemetryModalProps> = ({
  streamerName,
  onClose
}) => {
  const [telemetry, setTelemetry] = useState<ReadingTelemetryStats>(MOCK_READING_TELEMETRY);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleSimulatePageTurn = () => {
    soundFX.playPageRustle();
    soundFX.playPop();

    const newPages = telemetry.totalPagesRead + 1;
    const newWords = telemetry.totalWordsRead + 320;
    const newWpm = Math.floor(Math.random() * (260 - 210) + 210);

    setTelemetry(prev => ({
      ...prev,
      totalPagesRead: newPages,
      totalWordsRead: newWords,
      currentWpm: newWpm
    }));

    setToastMsg(`📖 Page ${newPages} turned! Velocity: ${newWpm} WPM.`);
    setTimeout(() => setToastMsg(null), 2500);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="telemetry-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="telemetry-modal-header">
          <div className="telemetry-title-group">
            <div className="telemetry-badge">
              <Activity size={16} />
              <span>LIVE READING VELOCITY & VOCABULARY TELEMETRY</span>
            </div>
            <h3>@{streamerName}'s Live Reading Telemetry HUD</h3>
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

        {/* 4 Stat Metric Cards */}
        <div className="telemetry-metrics-grid">
          <div className="telemetry-stat-card">
            <div className="stat-card-top">
              <Zap size={18} color="#ffd700" />
              <span className="stat-label">CURRENT SPEED</span>
            </div>
            <strong className="stat-big-val">{telemetry.currentWpm}</strong>
            <span className="stat-sub">Words Per Minute</span>
          </div>

          <div className="telemetry-stat-card">
            <div className="stat-card-top">
              <BookOpen size={18} color="var(--accent-primary)" />
              <span className="stat-label">PAGES TURNED</span>
            </div>
            <strong className="stat-big-val">{telemetry.totalPagesRead}</strong>
            <span className="stat-sub">{telemetry.totalWordsRead.toLocaleString()} total words</span>
          </div>

          <div className="telemetry-stat-card">
            <div className="stat-card-top">
              <Clock size={18} color="var(--accent-teal)" />
              <span className="stat-label">READING DURATION</span>
            </div>
            <strong className="stat-big-val">{telemetry.sessionDurationMins}m</strong>
            <span className="stat-sub">Avg {telemetry.averageWpm} WPM</span>
          </div>

          <div className="telemetry-stat-card">
            <div className="stat-card-top">
              <Activity size={18} color="var(--accent-success)" />
              <span className="stat-label">PACING MODE</span>
            </div>
            <strong className="stat-big-val pacing-text">{telemetry.readingPacing}</strong>
            <span className="stat-sub">Dynamic breath synced</span>
          </div>
        </div>

        {/* Rare Vocabulary Radar */}
        <div className="vocab-radar-section">
          <div className="vocab-radar-header">
            <BookMarked size={16} color="var(--accent-secondary)" />
            <h4>Rare Vocabulary & Lore Dictionary Radar</h4>
          </div>

          <div className="vocab-cards-list">
            {telemetry.rareVocabFound.map(v => (
              <div key={v.word} className="vocab-entry-card">
                <div className="vocab-top-row">
                  <strong>“{v.word}”</strong>
                  <span className="vocab-timestamp">{v.timestamp}</span>
                </div>
                <p className="vocab-def-text">{v.definition}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="telemetry-modal-footer">
          <button
            type="button"
            className="btn-primary btn-record-page"
            onClick={handleSimulatePageTurn}
          >
            <BookOpen size={15} />
            <span>Turn Page (+1 Page / +320 Words)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
