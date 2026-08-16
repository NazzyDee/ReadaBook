import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Radio, Video, Calendar, Sparkles, Check } from 'lucide-react';

interface NotificationItem {
  id: string;
  type: 'live' | 'clip' | 'club' | 'sparks';
  title: string;
  subtext: string;
  time: string;
  link: string;
  avatar?: string;
  read: boolean;
}

interface NotificationsDropdownProps {
  onClose: () => void;
}

export const NotificationsDropdown: React.FC<NotificationsDropdownProps> = ({ onClose }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'n1',
      type: 'live',
      title: 'LillyReads went live!',
      subtext: 'Cozy Bedtime Storytelling & Soft Rain Lofi 🌧️ • The Lion, the Witch and the Wardrobe',
      time: '12m ago',
      link: '/stream/mock_lillyreads',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      read: false
    },
    {
      id: 'n2',
      type: 'clip',
      title: 'New trending clip from BookishBard',
      subtext: 'The moment the Gollum voice took over completely 💀 (14.2k views)',
      time: '1h ago',
      link: '/clips?clip=clip_gollum_voice',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      read: false
    },
    {
      id: 'n3',
      type: 'club',
      title: 'Tolkien Society Meeting Reminder',
      subtext: 'Discussion on Chapter 12 starts in 45 minutes!',
      time: '2h ago',
      link: '/clubs',
      avatar: 'https://covers.openlibrary.org/b/id/14627060-L.jpg',
      read: true
    },
    {
      id: 'n4',
      type: 'sparks',
      title: 'Claimed +50 Bonus Book Tokens',
      subtext: 'Keep watching to earn more tokens and rewards!',
      time: '3h ago',
      link: '/',
      read: true
    }
  ]);

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <div className="notifications-popover">
      <div className="notifications-header">
        <div className="notif-title-row">
          <Bell size={16} />
          <span>Notifications</span>
        </div>
        <button onClick={handleMarkAllRead} className="btn-mark-read">
          <Check size={14} />
          <span>Mark all read</span>
        </button>
      </div>

      <div className="notifications-list">
        {notifications.map(n => (
          <Link
            key={n.id}
            to={n.link}
            onClick={onClose}
            className={`notification-item ${n.read ? 'read' : 'unread'}`}
          >
            <div className="notif-avatar-wrapper">
              {n.avatar ? (
                <img src={n.avatar} alt="" className="notif-avatar" />
              ) : (
                <div className="notif-icon-disc">
                  {n.type === 'live' && <Radio size={16} color="#ff3b3b" />}
                  {n.type === 'clip' && <Video size={16} color="var(--accent-secondary)" />}
                  {n.type === 'club' && <Calendar size={16} color="var(--accent-primary)" />}
                  {n.type === 'sparks' && <Sparkles size={16} color="#ffd700" />}
                </div>
              )}
              {n.type === 'live' && <span className="notif-live-badge-dot"></span>}
            </div>

            <div className="notif-content">
              <span className="notif-item-title">{n.title}</span>
              <p className="notif-item-sub">{n.subtext}</p>
              <span className="notif-time">{n.time}</span>
            </div>

            {!n.read && <span className="notif-unread-dot"></span>}
          </Link>
        ))}
      </div>
    </div>
  );
};
