import React, { useState } from 'react';
import { X, Tag, Sparkles, Check, AlertTriangle, ShieldCheck, Info } from 'lucide-react';
import { DEFAULT_CLASSIFICATION_LABELS, type ContentClassificationLabel } from '../lib/contentClassificationData';
import { soundFX } from '../lib/soundFx';

interface ContentClassificationModalProps {
  streamerName: string;
  onClose: () => void;
  onSaveLabels?: (labels: ContentClassificationLabel[]) => void;
}

export const ContentClassificationModal: React.FC<ContentClassificationModalProps> = ({
  streamerName,
  onClose,
  onSaveLabels
}) => {
  const [labels, setLabels] = useState<ContentClassificationLabel[]>(DEFAULT_CLASSIFICATION_LABELS);
  const [requireInterstitialGate, setRequireInterstitialGate] = useState(true);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleToggleLabel = (id: string) => {
    soundFX.playPop();
    setLabels(prev =>
      prev.map(l => (l.id === id ? { ...l, isSelected: !l.isSelected } : l))
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    soundFX.playChestClaim();

    if (onSaveLabels) {
      onSaveLabels(labels);
    }

    setToastMsg('🏷️ Content classification labels updated on stream metadata!');
    setTimeout(() => setToastMsg(null), 3000);
  };

  const selectedCount = labels.filter(l => l.isSelected).length;
  const has18Plus = labels.some(l => l.isSelected && l.is18Plus);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="ccl-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="ccl-modal-header">
          <div className="ccl-title-group">
            <div className="ccl-badge">
              <Tag size={16} />
              <span>CONTENT CLASSIFICATION & TRIGGER WARNINGS STUDIO</span>
            </div>
            <h3>@{streamerName}'s Novel Content Warnings</h3>
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

        <p className="ccl-intro-text">
          Select relevant content classification labels to help viewers find suitable reading streams and prepare for mature or intense literary themes.
        </p>

        {/* 18+ Warning Box */}
        {has18Plus && (
          <div className="ccl-mature-warning-box">
            <AlertTriangle size={18} color="#ff3b3b" />
            <div className="warning-text-group">
              <strong>Mature Content Stream (18+)</strong>
              <p>One or more selected labels require viewer age-verification or trigger warning consent.</p>
            </div>
          </div>
        )}

        {/* Labels Selection Grid */}
        <form onSubmit={handleSave} className="ccl-form">
          <div className="ccl-labels-grid">
            {labels.map(lbl => (
              <div
                key={lbl.id}
                className={`ccl-label-card ${lbl.isSelected ? 'selected' : ''}`}
                onClick={() => handleToggleLabel(lbl.id)}
              >
                <div className="ccl-card-header">
                  <span className="ccl-emoji">{lbl.icon}</span>
                  <div className="ccl-name-and-tag">
                    <h4>{lbl.name}</h4>
                    {lbl.is18Plus && <span className="ccl-age-pill">18+ MATURE</span>}
                  </div>
                  <div className={`ccl-checkbox ${lbl.isSelected ? 'checked' : ''}`}>
                    {lbl.isSelected && <Check size={12} />}
                  </div>
                </div>

                <p className="ccl-desc-text">{lbl.description}</p>
              </div>
            ))}
          </div>

          {/* Interstitial Checkbox */}
          <div className="ccl-interstitial-toggle-row">
            <label className="toggle-label-wrap">
              <input
                type="checkbox"
                checked={requireInterstitialGate}
                onChange={e => setRequireInterstitialGate(e.target.checked)}
              />
              <span>Display 1-click trigger consent modal before loading stream audio</span>
            </label>
          </div>

          {/* Footer */}
          <div className="ccl-modal-footer">
            <div className="ccl-footer-meta">
              <Info size={13} color="var(--text-muted)" />
              <span>{selectedCount} labels active on broadcast</span>
            </div>

            <button type="submit" className="btn-primary btn-save-ccl">
              <ShieldCheck size={16} />
              <span>Save & Apply Labels</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
