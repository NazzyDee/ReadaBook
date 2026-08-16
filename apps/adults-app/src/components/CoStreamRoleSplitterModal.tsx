import React, { useState } from 'react';
import { X, Users, Sparkles, Mic, BellRing, CheckCircle2 } from 'lucide-react';
import {
  MOCK_CO_STREAM_ROLES,
  MOCK_AVAILABLE_CO_HOSTS,
  type CoStreamRoleAssignment
} from '../lib/coStreamRoleData';
import { soundFX } from '../lib/soundFx';

interface CoStreamRoleSplitterModalProps {
  streamerName: string;
  onClose: () => void;
}

export const CoStreamRoleSplitterModal: React.FC<CoStreamRoleSplitterModalProps> = ({
  streamerName,
  onClose
}) => {
  const [roles, setRoles] = useState<CoStreamRoleAssignment[]>(MOCK_CO_STREAM_ROLES);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleReassign = (charName: string, newStreamer: string) => {
    soundFX.playPop();
    setRoles(prev =>
      prev.map(r => (r.characterName === charName ? { ...r, assignedStreamer: newStreamer } : r))
    );
  };

  const handleSendCue = (charName: string, streamer: string) => {
    soundFX.playChestClaim();
    setToastMsg(`🔔 Live cue chime sent to @${streamer} for character "${charName}"!`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    soundFX.playChestClaim();
    setToastMsg('🎭 Full Cast Audio Theatre roles synchronized with co-streamers!');
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="costream-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="costream-modal-header">
          <div className="costream-title-group">
            <div className="costream-badge">
              <Users size={16} />
              <span>CO-STREAM VOICE THEATRE & CAST SPLITTER</span>
            </div>
            <h3>@{streamerName}'s Multi-Narrator Audio Theatre</h3>
          </div>

          <button onClick={onClose} className="modal-close-btn" title="Close">
            <X size={20} />
          </button>
        </div>

        {/* Success Toast */}
        {toastMsg && (
          <div className="sub-celebration-toast">
            <Sparkles size={18} color="#ffd700" />
            <span>{toastMsg}</span>
          </div>
        )}

        <p className="costream-intro-text">
          Divide novel characters and narrative perspectives across co-broadcasters. Each participant receives color-coded teleprompter lines and live audio cues.
        </p>

        {/* Roles Grid */}
        <form onSubmit={handleSave} className="costream-form">
          <div className="roles-assignment-grid">
            {roles.map(role => (
              <div
                key={role.characterName}
                className="role-assignment-card"
                style={{ borderLeftColor: role.color }}
              >
                <div className="role-card-top">
                  <div className="role-name-wrap">
                    <span className="role-color-dot" style={{ backgroundColor: role.color }}></span>
                    <h4>{role.characterName}</h4>
                  </div>
                  <span className="lines-count-pill">{role.dialogueCount} Lines</span>
                </div>

                <p className="voice-style-note">🎙️ Voice Guide: <em>{role.voiceStyle}</em></p>

                <div className="assign-controls-row">
                  <div className="select-assignee-box">
                    <label>Assigned Voice:</label>
                    <select
                      value={role.assignedStreamer}
                      onChange={e => handleReassign(role.characterName, e.target.value)}
                    >
                      {MOCK_AVAILABLE_CO_HOSTS.map(host => (
                        <option key={host} value={host}>{host}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="button"
                    className="btn-cue-streamer"
                    onClick={() => handleSendCue(role.characterName, role.assignedStreamer)}
                    title="Send instant audio chime cue to this narrator"
                  >
                    <BellRing size={14} />
                    <span>Cue</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="costream-modal-footer">
            <div className="cast-summary-pill">
              <Mic size={13} color="var(--accent-primary)" />
              <span>{roles.length} Characters Assigned Across {MOCK_AVAILABLE_CO_HOSTS.length} Co-Broadcasters</span>
            </div>

            <button type="submit" className="btn-primary btn-sync-roles">
              <CheckCircle2 size={16} />
              <span>Synchronize Live Cast</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
