import React, { useState } from 'react';
import { X, Calendar, Clock, BookOpen, Users, Trophy, Sparkles, Check, Bell } from 'lucide-react';
import { UPCOMING_MARATHONS, type ReadingMarathonEvent } from '../lib/marathonData';
import { soundFX } from '../lib/soundFx';

interface MarathonScheduleHubModalProps {
  onClose: () => void;
}

export const MarathonScheduleHubModal: React.FC<MarathonScheduleHubModalProps> = ({
  onClose
}) => {
  const [selectedMarathon] = useState<ReadingMarathonEvent>(UPCOMING_MARATHONS[0]);
  const [hasRsvped, setHasRsvped] = useState(false);
  const [rsvpToast, setRsvpToast] = useState<string | null>(null);

  const handleRsvp = () => {
    soundFX.playChestClaim();
    soundFX.playApplause();
    setHasRsvped(true);
    setRsvpToast(`📅 RSVP Confirmed! Added "${selectedMarathon.eventName}" to your calendar & notifications.`);
    setTimeout(() => setRsvpToast(null), 3500);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="marathon-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="marathon-modal-header">
          <div className="marathon-title-group">
            <div className="marathon-badge">
              <Calendar size={16} />
              <span>COMMUNITY READ-A-THON & MARATHON EVENT HUB</span>
            </div>
            <h3>24-Hour Reading Marathon Schedule</h3>
          </div>

          <button onClick={onClose} className="modal-close-btn" title="Close">
            <X size={20} />
          </button>
        </div>

        {/* Success Toast */}
        {rsvpToast && (
          <div className="sub-celebration-toast">
            <Sparkles size={18} color="#ffd700" />
            <span>{rsvpToast}</span>
          </div>
        )}

        {/* Event Banner Card */}
        <div className="marathon-hero-banner">
          <img src={selectedMarathon.bannerUrl} alt={selectedMarathon.eventName} className="marathon-bg-img" />
          <div className="marathon-hero-overlay">
            <span className="marathon-tagline">{selectedMarathon.durationHours}-HOUR LIVE MARATHON</span>
            <h2>{selectedMarathon.eventName}</h2>
            <div className="marathon-meta-row">
              <span>
                <Clock size={15} color="var(--accent-secondary)" />
                <span>{selectedMarathon.startDateFormatted}</span>
              </span>
              <span>
                <BookOpen size={15} color="#ffd700" />
                <span>Target: {selectedMarathon.targetPages} Pages</span>
              </span>
              <span>
                <Users size={15} color="var(--accent-success)" />
                <span>{(selectedMarathon.totalRsvps + (hasRsvped ? 1 : 0)).toLocaleString()} Readers RSVP'd</span>
              </span>
            </div>

            <button
              type="button"
              className={`btn-primary btn-rsvp-marathon ${hasRsvped ? 'rsvped' : ''}`}
              onClick={handleRsvp}
            >
              {hasRsvped ? <Check size={18} /> : <Bell size={18} />}
              <span>{hasRsvped ? 'RSVP’d & Calendar Synced!' : 'RSVP & Set Notification'}</span>
            </button>
          </div>
        </div>

        {/* 2-Column Details: Shift Rotations & Milestone Rewards */}
        <div className="marathon-grid-details">
          {/* Shift Schedule */}
          <div className="marathon-shifts-box">
            <h4>
              <Clock size={16} />
              <span>Host Shift Rotations</span>
            </h4>

            <div className="shifts-list">
              {selectedMarathon.shifts.map((shift, idx) => (
                <div key={idx} className="shift-item-card">
                  <span className="shift-time-chip">{shift.timeSlot}</span>
                  <div className="shift-host-meta">
                    <img src={shift.hostAvatar} alt={shift.hostName} className="shift-avatar" />
                    <div>
                      <strong>@{shift.hostName}</strong>
                      <p>{shift.bookSection}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Milestone Stretch Goals */}
          <div className="marathon-milestones-box">
            <h4>
              <Trophy size={16} color="#ffd700" />
              <span>Marathon Stretch Rewards</span>
            </h4>

            <div className="milestones-list">
              {selectedMarathon.milestones.map((m, idx) => (
                <div key={idx} className="milestone-item-card">
                  <span className="milestone-page-badge">{m.pages} Pages</span>
                  <p>{m.reward}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
