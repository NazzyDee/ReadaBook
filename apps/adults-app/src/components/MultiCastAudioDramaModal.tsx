import React, { useState } from 'react';
import { X, Theater, Sparkles, CheckCircle2, Volume2, VolumeX, Sliders, Users, Radio } from 'lucide-react';
import { DEFAULT_CAST_SLOTS, type CastSlot } from '../lib/multiCastDramaData';
import { soundFX } from '../lib/soundFx';

interface MultiCastAudioDramaModalProps {
  streamerName: string;
  onClose: () => void;
}

export const MultiCastAudioDramaModal: React.FC<MultiCastAudioDramaModalProps> = ({
  streamerName,
  onClose
}) => {
  const [slots, setSlots] = useState<CastSlot[]>(DEFAULT_CAST_SLOTS);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleToggleMute = (id: string) => {
    soundFX.playPop();
    setSlots(prev => prev.map(s => s.id === id ? { ...s, isMuted: !s.isMuted } : s));
  };

  const handleUpdatePan = (id: string, pan: number) => {
    setSlots(prev => prev.map(s => s.id === id ? { ...s, panPosition: pan } : s));
  };

  const handleUpdateVol = (id: string, vol: number) => {
    setSlots(prev => prev.map(s => s.id === id ? { ...s, volumeLevel: vol } : s));
  };

  const handleTriggerSoloSpeaker = (id: string) => {
    soundFX.playPop();
    soundFX.playChestClaim();
    setSlots(prev => prev.map(s => ({
      ...s,
      isActiveSpeaker: s.id === id
    })));
    const active = slots.find(s => s.id === id);
    setToastMsg(`🎙️ Cued Spotlight Speaker: ${active?.characterName} (${active?.voiceActorName})`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleSave = () => {
    soundFX.playChestClaim();
    setToastMsg('✨ Multi-Cast Audio Drama DSP Rack applied to Broadcast Master Bus!');
    setTimeout(() => {
      setToastMsg(null);
      onClose();
    }, 1500);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="multicast-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="multicast-modal-header">
          <div className="multicast-title-group">
            <div className="multicast-badge">
              <Theater size={16} />
              <span>LIVE TABLETOP AUDIO-DRAMA & MULTI-CAST VOICE STAGING</span>
            </div>
            <h3>@{streamerName}'s Full-Cast Voice Staging Deck</h3>
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

        {/* Stage Overview Banner */}
        <div className="multicast-hero-banner">
          <div className="stage-diagram">
            <div className="virtual-stage-pill">
              <Users size={16} color="#00ff88" />
              <span>4 Actors Live on Virtual Stage</span>
            </div>
            <div className="stage-pan-visual">
              <span className="stage-label left">L (-100)</span>
              <div className="stage-actors-line">
                {slots.map(s => (
                  <div
                    key={s.id}
                    className={`actor-dot ${s.isActiveSpeaker ? 'active' : ''}`}
                    style={{ left: `${((s.panPosition + 100) / 200) * 100}%` }}
                    title={`${s.characterName} (${s.panPosition > 0 ? '+' : ''}${s.panPosition})`}
                  >
                    <img src={s.avatarUrl} alt={s.characterName} />
                  </div>
                ))}
              </div>
              <span className="stage-label right">R (+100)</span>
            </div>
          </div>

          <div className="stage-meta-info">
            <h4>Binaural Tabletop Audio-Drama Engine</h4>
            <p>
              Assign character dialogue to guest co-readers in real time with spatial stereo panning and dedicated voice EQ profiles.
            </p>
          </div>
        </div>

        {/* Cast Slots Grid */}
        <div className="cast-slots-grid">
          {slots.map(slot => (
            <div
              key={slot.id}
              className={`cast-slot-card ${slot.isActiveSpeaker ? 'spotlight' : ''} ${slot.isMuted ? 'muted' : ''}`}
            >
              <div className="slot-top-row">
                <img src={slot.avatarUrl} alt={slot.characterName} className="slot-avatar" />
                <div className="slot-names">
                  <strong>{slot.characterName}</strong>
                  <span>{slot.roleName} • @{slot.voiceActorName}</span>
                </div>
                <button
                  type="button"
                  className={`btn-spotlight ${slot.isActiveSpeaker ? 'active' : ''}`}
                  onClick={() => handleTriggerSoloSpeaker(slot.id)}
                  title="Spotlight Voice"
                >
                  <Radio size={14} />
                  <span>{slot.isActiveSpeaker ? 'LIVE' : 'CUE'}</span>
                </button>
              </div>

              {/* Pan Slider */}
              <div className="slot-control-row">
                <div className="slider-label-mini">
                  <span>Pan: {slot.panPosition === 0 ? 'Center' : slot.panPosition > 0 ? `R +${slot.panPosition}` : `L ${slot.panPosition}`}</span>
                  <span className="eq-tag">{slot.eqPreset}</span>
                </div>
                <input
                  type="range"
                  min="-100"
                  max="100"
                  value={slot.panPosition}
                  onChange={e => handleUpdatePan(slot.id, Number(e.target.value))}
                  className="pan-slider"
                />
              </div>

              {/* Volume & Mute */}
              <div className="slot-vol-row">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={slot.volumeLevel}
                  disabled={slot.isMuted}
                  onChange={e => handleUpdateVol(slot.id, Number(e.target.value))}
                  className="vol-slider"
                />
                <button
                  type="button"
                  className={`btn-slot-mute ${slot.isMuted ? 'muted' : ''}`}
                  onClick={() => handleToggleMute(slot.id)}
                >
                  {slot.isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="multicast-modal-footer">
          <div className="footer-vocal-note">
            <Sliders size={14} color="var(--accent-teal)" />
            <span>Integrates with Discord Go Live, Zoom VDO.Ninja & Backstage Guest Star feeds.</span>
          </div>
          <button
            type="button"
            className="btn-primary"
            onClick={handleSave}
          >
            <CheckCircle2 size={16} />
            <span>Apply Voice Staging</span>
          </button>
        </div>
      </div>
    </div>
  );
};
