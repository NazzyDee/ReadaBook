import React, { useState } from 'react';
import { X, Video, Sparkles, CheckCircle2, Layout, Maximize2, Radio } from 'lucide-react';
import { AVAILABLE_CAMERA_ANGLES, type CameraAngle } from '../lib/streamDirectorMultiCamData';
import { soundFX } from '../lib/soundFx';

interface StreamDirectorMultiCamModalProps {
  streamerName: string;
  onClose: () => void;
}

export const StreamDirectorMultiCamModal: React.FC<StreamDirectorMultiCamModalProps> = ({
  streamerName,
  onClose
}) => {
  const [angles, setAngles] = useState<CameraAngle[]>(AVAILABLE_CAMERA_ANGLES);
  const [layoutMode, setLayoutMode] = useState<'SOLO' | 'PIP' | 'SPLIT_DUAL' | 'QUAD_GRID'>('SOLO');
  const [activeId, setActiveId] = useState<string>('cam_face');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const activeAngle = angles.find(a => a.id === activeId) || angles[0];

  const handleSwitchAngle = (angle: CameraAngle) => {
    soundFX.playPop();
    setActiveId(angle.id);
    setAngles(prev => prev.map(a => ({ ...a, isActive: a.id === angle.id })));
    setToastMsg(`🎥 Switched Broadcast Program Feed to "${angle.name}"`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="multicam-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="multicam-modal-header">
          <div className="multicam-title-group">
            <div className="multicam-badge">
              <Video size={16} />
              <span>STUDIO SCENE DIRECTOR & MULTI-CAM CONTROLLER</span>
            </div>
            <h3>@{streamerName}'s Multi-Angle Stage Director</h3>
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

        {/* Main Program Output Monitor */}
        <div className="program-monitor-hero">
          <div className="monitor-screen-wrapper">
            <img src={activeAngle.previewUrl} alt={activeAngle.name} className="main-program-feed" />
            <div className="program-live-tag">
              <Radio size={12} color="#ff3b3b" />
              <span>LIVE PROGRAM OUTPUT</span>
            </div>
            <div className="program-specs-badge">
              <span>{activeAngle.resolution} @ {activeAngle.fps}fps</span>
            </div>
          </div>

          <div className="program-info-col">
            <h4>{activeAngle.name}</h4>
            <p>{activeAngle.description}</p>
            <div className="layout-selector-bar">
              <span className="layout-label">Composition Layout:</span>
              {(['SOLO', 'PIP', 'SPLIT_DUAL', 'QUAD_GRID'] as const).map(mode => (
                <button
                  key={mode}
                  type="button"
                  className={`btn-layout-chip ${layoutMode === mode ? 'active' : ''}`}
                  onClick={() => {
                    soundFX.playPop();
                    setLayoutMode(mode);
                  }}
                >
                  <Layout size={12} />
                  <span>{mode}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Camera Angles Multiview Grid */}
        <div className="camera-angles-multiview-grid">
          {angles.map(angle => {
            const isLive = angle.id === activeId;
            return (
              <div
                key={angle.id}
                className={`cam-preview-tile ${isLive ? 'program-active' : ''}`}
                onClick={() => handleSwitchAngle(angle)}
              >
                <div className="cam-img-wrap">
                  <img src={angle.previewUrl} alt={angle.name} />
                  <span className={`cam-status-pill ${isLive ? 'live' : 'standby'}`}>
                    {isLive ? '🔴 PROGRAM' : '⚪ PREVIEW'}
                  </span>
                </div>
                <div className="cam-tile-footer">
                  <strong>{angle.name}</strong>
                  <button type="button" className="btn-take-live" title="Take Live">
                    <Maximize2 size={12} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="multicam-modal-footer">
          <span className="director-note">
            💡 Supports wireless NDI, Elgato Cam Link 4K & OBS Virtual Camera feeds.
          </span>
          <button
            type="button"
            className="btn-primary"
            onClick={onClose}
          >
            <CheckCircle2 size={16} />
            <span>Lock Director Feed</span>
          </button>
        </div>
      </div>
    </div>
  );
};
