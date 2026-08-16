import React, { useState } from 'react';
import { Sparkles, Gift, ChevronDown, ChevronUp } from 'lucide-react';

interface LeaderboardUser {
  rank: number;
  username: string;
  avatar: string;
  amount: number;
}

export const ChannelLeaderboard: React.FC = () => {
  const [collapsed, setCollapsed] = useState(true);
  const [tab, setTab] = useState<'sparks' | 'gifts'>('sparks');

  const topSparks: LeaderboardUser[] = [
    { rank: 1, username: 'ElessarReader', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80', amount: 15400 },
    { rank: 2, username: 'LothlorienLore', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80', amount: 8200 },
    { rank: 3, username: 'CozyQuill', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80', amount: 5000 }
  ];

  const topGifts: LeaderboardUser[] = [
    { rank: 1, username: 'BibliophileKing', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80', amount: 45 },
    { rank: 2, username: 'NovelEnthusiast', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80', amount: 20 },
    { rank: 3, username: 'TeaAndTomes', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80', amount: 12 }
  ];

  const activeList = tab === 'sparks' ? topSparks : topGifts;

  return (
    <div className={`chat-leaderboard-widget ${collapsed ? 'is-collapsed' : ''}`}>
      <div className="leaderboard-top-bar" onClick={() => setCollapsed(!collapsed)}>
        <div className="leaderboard-title-group">
          {tab === 'sparks' ? (
            <Sparkles size={14} color="#ffd700" />
          ) : (
            <Gift size={14} color="var(--accent-secondary)" />
          )}
          <span className="leaderboard-label">Top {tab === 'sparks' ? 'Sparks' : 'Gift Subs'}</span>
        </div>

        <div className="leaderboard-actions-group">
          <div className="leaderboard-mini-top3">
            {activeList.map(u => (
              <span key={u.rank} className={`mini-rank-pill rank-${u.rank}`} title={`${u.username}: ${u.amount.toLocaleString()} ${tab === 'sparks' ? 'Sparks' : 'Subs'}`}>
                {u.rank === 1 ? '🥇' : u.rank === 2 ? '🥈' : '🥉'} {u.username.substring(0, 4)}..
              </span>
            ))}
          </div>

          <button className="btn-leaderboard-toggle">
            {collapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </button>
        </div>
      </div>

      {!collapsed && (
        <div className="leaderboard-expanded-panel">
          <div className="leaderboard-tabs-row">
            <button
              className={`btn-lb-tab ${tab === 'sparks' ? 'active' : ''}`}
              onClick={() => setTab('sparks')}
            >
              <Sparkles size={13} />
              <span>Top Sparks</span>
            </button>
            <button
              className={`btn-lb-tab ${tab === 'gifts' ? 'active' : ''}`}
              onClick={() => setTab('gifts')}
            >
              <Gift size={13} />
              <span>Top Gift Subs</span>
            </button>
          </div>

          <div className="leaderboard-rankings-list">
            {activeList.map(user => (
              <div key={user.rank} className="lb-ranking-row">
                <span className={`lb-rank-num rank-${user.rank}`}>
                  {user.rank === 1 ? '🥇 1' : user.rank === 2 ? '🥈 2' : '🥉 3'}
                </span>
                <img src={user.avatar} alt={user.username} className="lb-user-avatar" />
                <span className="lb-username">{user.username}</span>
                <span className="lb-amount">
                  {user.amount.toLocaleString()} {tab === 'sparks' ? '✨' : '🎁'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
