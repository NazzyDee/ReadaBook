import React, { useState } from 'react';
import { X, Headphones, Sparkles, CheckCircle2, MoveHorizontal } from 'lucide-react';
import {
  MOCK_SPATIAL_NARRATORS,
  REVERB_ENVIRONMENTS,
  type SpatialNarratorNode,
  type ReverbEnvironment
} from '../lib/squadSpatialData';
import { soundFX } from '../lib/soundFx';

interface SquadSpatialAudioModalProps {
  streamerName: string;
  onClose: () => void;
}

export const SquadSpatialAudioModal: React.FC<SquadSpatialAudioModalProps> = ({
  streamerName,
  onClose
}) => {
  const [narrators, setNarrators] = useState<SpatialNarratorNode[]>(MOCK_SPATIAL_NARRATORS);
  const [selectedReverb, setSelectedReverb] = useState<string>('rev_library');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handlePanChange = (id: string, pan: SpatialNarratorNode['panPosition']) => {
    soundFX.playPop();
    setNarrators(prev =>
      prev.map(n => (n.id === id ? { ...n, panPosition: pan } : n))
    );
  };

  const handleSelectReverb = (rev: ReverbEnvironment) => {
    soundFX.playPop();
    setSelectedReverb(rev.id);
    setToastMsg(`🏛️ Spatial room environment switched to: "${rev.name}" (${rev.reverbDecaySeconds}s decay)`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleSave = () => {
    soundFX.playChestClaim();
    setToastMsg('🎧 3D Binaural Soundstage applied to stream audio!');
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="spatial-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="spatial-modal-header">
          <div className="spatial-title-group">
            <div className="spatial-badge">
              <Headphones size={16} />
              <span>SQUAD MULTI-NARRATOR 3D AUDIO SPATIALIZER</span>
            </div>
            <h3>@{streamerName}'s Binaural Reading Soundstage</h3>
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

        <p className="spatial-intro-text">
          Position co-narrators in 3D binaural stereo space around the fireside reading circle. Choose an acoustic room environment to simulate live book club presence.
        </p>

        {/* 3D Soundstage Visualizer Deck */}
        <div className="soundstage-visual-container">
          <div className="soundstage-center-listener">
            <Headphones size={28} color="#fff" />
            <span>Listener (You)</span>
          </div>

          <div className="soundstage-pan-slots-row">
            {['LEFT', 'CENTER', 'RIGHT'].map(slot => (
              <div key={slot} className="soundstage-slot-zone">
                <span className="slot-title">{slot} AUDIO CHANNEL</span>
                <div className="slot-narrators-group">
                  {narrators
                    .filter(n => n.panPosition.includes(slot))
                    .map(n => (
                      <div
                        key={n.id}
                        className="soundstage-avatar-token"
                        style={{ borderColor: n.color }}
                      >
                        <img src={n.avatarUrl} alt={n.name} />
                        <span className="token-name" style={{ color: n.color }}>{n.name}</span>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Narrator Pan Controls List */}
        <div className="narrators-pan-list">
          {narrators.map(n => (
            <div key={n.id} className="narrator-pan-row">
              <div className="narrator-id-info">
                <img src={n.avatarUrl} alt={n.name} className="mini-avatar" />
                <div>
                  <strong>{n.name}</strong>
                  <span className="narr-role-tag">{n.role}</span>
                </div>
              </div>

              {/* Pan Buttons */}
              <div className="pan-buttons-group">
                <MoveHorizontal size={14} color="var(--text-muted)" />
                {(['LEFT', 'CENTER', 'RIGHT'] as SpatialNarratorNode['panPosition'][]).map(pos => (
                  <button
                    key={pos}
                    type="button"
                    className={`btn-pan-pos ${n.panPosition === pos ? 'active' : ''}`}
                    onClick={() => handlePanChange(n.id, pos)}
                  >
                    {pos}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Reverb Presets */}
        <div className="reverb-presets-section">
          <label className="sec-label">ACOUSTIC ROOM SIMULATOR:</label>
          <div className="reverb-cards-grid">
            {REVERB_ENVIRONMENTS.map(rev => (
              <div
                key={rev.id}
                className={`reverb-card ${selectedReverb === rev.id ? 'active' : ''}`}
                onClick={() => handleSelectReverb(rev)}
              >
                <span className="reverb-icon">{rev.icon}</span>
                <div className="reverb-info">
                  <h4>{rev.name}</h4>
                  <p>{rev.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="spatial-modal-footer">
          <button type="button" className="btn-primary btn-save-spatial" onClick={handleSave}>
            <CheckCircle2 size={16} />
            <span>Apply 3D Soundstage</span>
          </button>
        </div>
      </div>
    </div>
  );
};
