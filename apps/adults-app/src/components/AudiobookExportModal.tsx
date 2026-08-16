import React, { useState } from 'react';
import {
  X,
  Sliders,
  Volume2,
  VolumeX,
  Download,
  CheckCircle2,
  FileAudio,
  Layers,
  Play,
  Pause
} from 'lucide-react';
import { INITIAL_AUDIO_STEMS, type AudioStemTrack } from '../lib/audioStemsData';
import { soundFX } from '../lib/soundFx';

interface AudiobookExportModalProps {
  bookTitle: string;
  author: string;
  chapterTitle?: string;
  onClose: () => void;
}

export const AudiobookExportModal: React.FC<AudiobookExportModalProps> = ({
  bookTitle,
  author,
  chapterTitle = 'Chapter 2: The Shadow of the Past',
  onClose
}) => {
  const [stems, setStems] = useState<AudioStemTrack[]>(INITIAL_AUDIO_STEMS);
  const [selectedFormat, setSelectedFormat] = useState<'m4b' | 'mp3' | 'stems_zip' | 'flac'>('m4b');
  const [normalizeLufs, setNormalizeLufs] = useState(true);
  const [addIntroChime, setAddIntroChime] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportDone, setExportDone] = useState(false);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);

  const handleVolumeChange = (id: string, vol: number) => {
    setStems(prev => prev.map(s => (s.id === id ? { ...s, volume: vol } : s)));
  };

  const handleToggleMute = (id: string) => {
    soundFX.playPop();
    setStems(prev => prev.map(s => (s.id === id ? { ...s, isMuted: !s.isMuted } : s)));
  };

  const handleToggleSolo = (id: string) => {
    soundFX.playPop();
    setStems(prev =>
      prev.map(s => (s.id === id ? { ...s, isSolo: !s.isSolo } : { ...s, isSolo: false }))
    );
  };

  const handleTogglePreview = () => {
    soundFX.playPop();
    setIsPlayingPreview(!isPlayingPreview);
  };

  const handleStartExport = () => {
    soundFX.playChestClaim();
    setIsExporting(true);
    setExportProgress(10);

    const interval = setInterval(() => {
      setExportProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setIsExporting(false);
          setExportDone(true);
          soundFX.playChestClaim();
          return 100;
        }
        return p + 20;
      });
    }, 400);
  };

  return (
    <div className="modal-backdrop">
      <div className="audiobook-export-modal-card">
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-row">
            <Layers size={20} color="var(--accent-secondary)" />
            <div>
              <h3>Multi-Track Voice Acting & Audiobook Master Studio</h3>
              <span className="modal-subtitle">Master isolated voice stems & export broadcast-ready audiobook</span>
            </div>
          </div>
          <button onClick={onClose} className="modal-close-btn">
            <X size={18} />
          </button>
        </div>

        {/* Audiobook Metadata Card */}
        <div className="export-metadata-card">
          <div className="meta-row">
            <FileAudio size={18} color="#ffd700" />
            <div>
              <strong>{bookTitle}</strong>
              <span>by {author} • {chapterTitle}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleTogglePreview}
            className={`btn-preview-master ${isPlayingPreview ? 'playing' : ''}`}
          >
            {isPlayingPreview ? <Pause size={14} /> : <Play size={14} />}
            <span>{isPlayingPreview ? 'Pause Master' : 'Preview Mix'}</span>
          </button>
        </div>

        {/* Stem Track Mixer Grid */}
        <div className="stem-tracks-section">
          <label className="section-label">
            <Sliders size={14} /> Isolated Participant Audio Stems ({stems.length} Tracks):
          </label>

          <div className="stems-list">
            {stems.map(stem => (
              <div key={stem.id} className={`stem-track-row ${stem.isMuted ? 'muted' : ''} ${stem.isSolo ? 'soloed' : ''}`}>
                <img src={stem.avatarUrl} alt={stem.name} className="stem-avatar" />
                <div className="stem-info">
                  <strong>{stem.name}</strong>
                  <span className="stem-role">{stem.characterRole}</span>
                </div>

                {/* Animated Simulated Waveform VU meter */}
                <div className="stem-vu-meter">
                  <div
                    className="vu-level-bar"
                    style={{
                      width: stem.isMuted ? '0%' : isPlayingPreview ? `${stem.peakLevel}%` : '50%',
                      background: stem.isSolo ? '#ffd700' : 'var(--accent-secondary)'
                    }}
                  />
                </div>

                {/* Volume Slider */}
                <div className="stem-slider-group">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={stem.volume}
                    onChange={e => handleVolumeChange(stem.id, parseInt(e.target.value, 10))}
                    className="stem-volume-slider"
                  />
                  <span className="volume-val">{stem.volume}%</span>
                </div>

                {/* Mute & Solo Controls */}
                <div className="stem-btn-group">
                  <button
                    type="button"
                    onClick={() => handleToggleSolo(stem.id)}
                    className={`btn-solo ${stem.isSolo ? 'active' : ''}`}
                    title="Solo this track"
                  >
                    S
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToggleMute(stem.id)}
                    className={`btn-mute ${stem.isMuted ? 'active' : ''}`}
                    title={stem.isMuted ? 'Unmute' : 'Mute'}
                  >
                    {stem.isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mastering & Output Settings */}
        <div className="export-options-grid">
          <div className="export-settings-col">
            <label className="section-label">Mastering & Processing:</label>
            <label className="checkbox-setting">
              <input
                type="checkbox"
                checked={normalizeLufs}
                onChange={e => setNormalizeLufs(e.target.checked)}
              />
              <span>Normalize to -14 LUFS (Audible / Podcast Standard)</span>
            </label>
            <label className="checkbox-setting">
              <input
                type="checkbox"
                checked={addIntroChime}
                onChange={e => setAddIntroChime(e.target.checked)}
              />
              <span>Insert ReadaBook Chapter Intro/Outro Stingers</span>
            </label>
          </div>

          <div className="export-format-col">
            <label className="section-label">Master Output Format:</label>
            <div className="format-options-row">
              <button
                type="button"
                className={`btn-format-opt ${selectedFormat === 'm4b' ? 'active' : ''}`}
                onClick={() => setSelectedFormat('m4b')}
              >
                <strong>.M4B Audiobook</strong>
                <span>Chapters & Art</span>
              </button>
              <button
                type="button"
                className={`btn-format-opt ${selectedFormat === 'mp3' ? 'active' : ''}`}
                onClick={() => setSelectedFormat('mp3')}
              >
                <strong>.MP3 Master</strong>
                <span>320kbps Stereo</span>
              </button>
              <button
                type="button"
                className={`btn-format-opt ${selectedFormat === 'stems_zip' ? 'active' : ''}`}
                onClick={() => setSelectedFormat('stems_zip')}
              >
                <strong>.ZIP WAV Stems</strong>
                <span>DAW Multitrack</span>
              </button>
            </div>
          </div>
        </div>

        {/* Export Progress Bar */}
        {isExporting && (
          <div className="export-progress-box">
            <div className="progress-header">
              <span>Mastering audio stems and embedding chapter metadata...</span>
              <strong>{exportProgress}%</strong>
            </div>
            <div className="export-progress-bar">
              <div className="export-progress-fill" style={{ width: `${exportProgress}%` }} />
            </div>
          </div>
        )}

        {exportDone && (
          <div className="export-success-box">
            <CheckCircle2 size={20} color="#00ff88" />
            <div>
              <strong>Audiobook Master Ready for Download!</strong>
              <p>File saved as <code>{bookTitle.replace(/\s+/g, '_')}_Ch2_Master.{selectedFormat}</code></p>
            </div>
          </div>
        )}

        {/* Modal Actions */}
        <div className="modal-actions">
          <button type="button" onClick={onClose} className="btn-secondary">
            Close
          </button>
          {!exportDone ? (
            <button
              type="button"
              onClick={handleStartExport}
              disabled={isExporting}
              className="btn-primary"
            >
              <Download size={15} />
              <span>{isExporting ? 'Mastering Stems...' : `Export Master (.${selectedFormat.toUpperCase()})`}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                soundFX.playPop();
                onClose();
              }}
              className="btn-primary"
            >
              <CheckCircle2 size={15} />
              <span>Done</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
