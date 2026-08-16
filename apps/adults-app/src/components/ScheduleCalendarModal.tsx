import React, { useState } from 'react';
import { Calendar, Clock, Bell, Plus, X, Check, BookOpen } from 'lucide-react';
import { soundFX } from '../lib/soundFx';

export interface ScheduleEvent {
  id: string;
  day: string;
  time: string;
  title: string;
  bookTitle: string;
  category: string;
  recurring: boolean;
  reminded?: boolean;
}

interface ScheduleCalendarModalProps {
  streamerName: string;
  isOwner?: boolean;
  onClose: () => void;
}

export const ScheduleCalendarModal: React.FC<ScheduleCalendarModalProps> = ({
  streamerName,
  isOwner = false,
  onClose
}) => {
  const [events, setEvents] = useState<ScheduleEvent[]>([
    {
      id: 'sch_1',
      day: 'Tuesday',
      time: '7:00 PM EST',
      title: 'The Hobbit: Chapter 6 - Out of the Frying-Pan into the Fire',
      bookTitle: 'The Hobbit',
      category: 'Fantasy',
      recurring: true
    },
    {
      id: 'sch_2',
      day: 'Thursday',
      time: '8:00 PM EST',
      title: 'Late Night Cozy Classics & Tea Discussion ☕',
      bookTitle: 'Pride and Prejudice',
      category: 'Classics',
      recurring: true
    },
    {
      id: 'sch_3',
      day: 'Saturday',
      time: '2:00 PM EST',
      title: 'Full Cast Community Table Read & Voice Acting Workshop',
      bookTitle: 'The Lion, the Witch and the Wardrobe',
      category: 'Fantasy',
      recurring: false
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newDay, setNewDay] = useState('Monday');
  const [newTime, setNewTime] = useState('7:00 PM EST');
  const [newTitle, setNewTitle] = useState('');
  const [newBook, setNewBook] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const toggleReminder = (id: string, title: string) => {
    soundFX.playChestClaim();
    setEvents(prev =>
      prev.map(ev => (ev.id === id ? { ...ev, reminded: !ev.reminded } : ev))
    );
    const ev = events.find(e => e.id === id);
    if (!ev?.reminded) {
      setToastMsg(`🔔 Reminder set for "${title}"! You will be notified when ${streamerName} goes live.`);
    } else {
      setToastMsg(`Reminder cancelled for "${title}".`);
    }
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    soundFX.playChestClaim();
    const newEv: ScheduleEvent = {
      id: `sch_${Date.now()}`,
      day: newDay,
      time: newTime,
      title: newTitle.trim(),
      bookTitle: newBook.trim() || 'Literature Reading',
      category: 'Fantasy',
      recurring: true
    };

    setEvents(prev => [...prev, newEv]);
    setShowAddForm(false);
    setNewTitle('');
    setNewBook('');
    setToastMsg(`Stream event added to your weekly schedule!`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="modal-backdrop">
      <div className="schedule-calendar-modal-card">
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-row">
            <Calendar size={20} color="var(--accent-secondary)" />
            <h3>{streamerName}'s Weekly Broadcast Schedule</h3>
          </div>
          <button onClick={onClose} className="modal-close-btn">
            <X size={18} />
          </button>
        </div>

        {toastMsg && (
          <div className="schedule-toast">
            <Check size={16} />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Action Header */}
        <div className="schedule-actions-header">
          <span className="schedule-timezone-note">All times displayed in local browser timezone</span>
          {isOwner && (
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="btn-primary btn-add-event-btn"
            >
              <Plus size={14} />
              <span>Add Stream Event</span>
            </button>
          )}
        </div>

        {/* Add Event Form */}
        {showAddForm && (
          <form onSubmit={handleAddEvent} className="add-event-form">
            <div className="form-row-2col">
              <div className="form-group">
                <label>Day of the Week:</label>
                <select
                  value={newDay}
                  onChange={(e) => setNewDay(e.target.value)}
                  className="settings-select-input"
                >
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Start Time:</label>
                <input
                  type="text"
                  placeholder="e.g. 7:00 PM EST"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="settings-text-input"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Stream Title & Topic:</label>
              <input
                type="text"
                placeholder="e.g. Chapter 6 Live Table Read & Voice Acting"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="settings-text-input"
                required
              />
            </div>

            <div className="form-group">
              <label>Book Title / Author:</label>
              <input
                type="text"
                placeholder="e.g. The Hobbit by J.R.R. Tolkien"
                value={newBook}
                onChange={(e) => setNewBook(e.target.value)}
                className="settings-text-input"
              />
            </div>

            <div className="modal-actions">
              <button type="button" onClick={() => setShowAddForm(false)} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                <Plus size={14} />
                <span>Save to Schedule</span>
              </button>
            </div>
          </form>
        )}

        {/* Schedule Events List */}
        <div className="schedule-events-list">
          {events.map(ev => (
            <div key={ev.id} className="schedule-event-card">
              <div className="event-date-col">
                <span className="event-day-label">{ev.day}</span>
                <span className="event-time-label">
                  <Clock size={12} /> {ev.time}
                </span>
                {ev.recurring && <span className="recurring-tag">Weekly</span>}
              </div>

              <div className="event-details-col">
                <h4>{ev.title}</h4>
                <div className="event-meta-sub">
                  <span><BookOpen size={13} /> {ev.bookTitle}</span>
                  <span>• {ev.category}</span>
                </div>
              </div>

              <div className="event-action-col">
                <button
                  onClick={() => toggleReminder(ev.id, ev.title)}
                  className={`btn-schedule-remind ${ev.reminded ? 'active' : ''}`}
                  title={ev.reminded ? 'Reminder Active' : 'Set Stream Reminder'}
                >
                  <Bell size={15} fill={ev.reminded ? 'currentColor' : 'none'} />
                  <span>{ev.reminded ? 'Reminded' : 'Remind Me'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
