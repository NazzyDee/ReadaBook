import React, { useState } from 'react';
import { Bookmark, X, Check } from 'lucide-react';
import { soundFX } from '../lib/soundFx';

interface StreamMarkerModalProps {
  onAddMarker: (description: string, timestamp: string) => void;
  onClose: () => void;
}

export const StreamMarkerModal: React.FC<StreamMarkerModalProps> = ({ onAddMarker, onClose }) => {
  const [description, setDescription] = useState('');
  const [saved, setSaved] = useState(false);

  const currentTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    soundFX.playPop();
    onAddMarker(description.trim(), currentTimeStr);
    setSaved(true);
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  return (
    <div className="modal-backdrop">
      <div className="stream-marker-modal-card">
        <div className="modal-header">
          <div className="modal-title-row">
            <Bookmark size={20} color="var(--accent-secondary)" />
            <h3>Add Stream Marker</h3>
          </div>
          <button onClick={onClose} className="modal-close-btn">
            <X size={18} />
          </button>
        </div>

        <p className="marker-modal-subtitle">
          Timestamped markers help you and your editors quickly find memorable moments when creating clips, highlights, and VOD chapters.
        </p>

        {saved ? (
          <div className="marker-saved-toast">
            <Check size={16} />
            <span>Marker dropped at {currentTimeStr}!</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="marker-form">
            <div className="form-group">
              <label>Timestamp: <strong style={{ color: 'var(--accent-secondary)' }}>{currentTimeStr}</strong></label>
            </div>

            <div className="form-group">
              <label>Marker Description / Note:</label>
              <input
                type="text"
                autoFocus
                placeholder="e.g. Chapter 4 Cliffhanger, Voice Acting highlight..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="marker-text-input"
                maxLength={100}
                required
              />
            </div>

            <div className="modal-actions">
              <button type="button" onClick={onClose} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                <Bookmark size={15} />
                <span>Drop Marker</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
