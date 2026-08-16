import React, { useState } from 'react';
import { X, ShieldAlert, RotateCcw, Clock, Sparkles, Search, UserX, AlertTriangle, ShieldCheck } from 'lucide-react';
import { MOCK_MOD_AUDIT_LOGS, type ModAuditAction } from '../lib/modAuditLogData';
import { soundFX } from '../lib/soundFx';

interface ModActionAuditLogModalProps {
  streamerName: string;
  onClose: () => void;
}

export const ModActionAuditLogModal: React.FC<ModActionAuditLogModalProps> = ({
  streamerName,
  onClose
}) => {
  const [logs, setLogs] = useState<ModAuditAction[]>(MOCK_MOD_AUDIT_LOGS);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const filteredLogs = logs.filter(log => {
    const matchesType = filterType === 'ALL' || log.actionType === filterType;
    const matchesSearch =
      (log.targetUser && log.targetUser.toLowerCase().includes(searchQuery.toLowerCase())) ||
      log.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.moderatorName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleReverseAction = (id: string) => {
    soundFX.playChestClaim();
    setLogs(prev =>
      prev.map(l => (l.id === id ? { ...l, isReversed: true } : l))
    );
    setToastMsg('🛡️ Moderation action reversed successfully.');
    setTimeout(() => setToastMsg(null), 3000);
  };

  const getActionBadge = (type: ModAuditAction['actionType']) => {
    switch (type) {
      case 'TIMEOUT':
        return <span className="mod-badge timeout"><Clock size={11} /> TIMEOUT</span>;
      case 'BAN':
        return <span className="mod-badge ban"><UserX size={11} /> PERMA BAN</span>;
      case 'DELETE_MSG':
        return <span className="mod-badge delete"><AlertTriangle size={11} /> MESSAGE DELETED</span>;
      case 'SLOW_MODE':
        return <span className="mod-badge slow"><ShieldAlert size={11} /> SLOW MODE</span>;
      case 'SHIELD_MODE':
        return <span className="mod-badge shield"><ShieldCheck size={11} /> SHIELD MODE</span>;
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="mod-audit-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="mod-audit-header">
          <div className="mod-audit-title-group">
            <div className="mod-audit-badge">
              <ShieldAlert size={16} />
              <span>HIGH COUNCIL MODERATION AUDIT TRAIL</span>
            </div>
            <h3>@{streamerName}'s Live Mod Action Log</h3>
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

        {/* Filter & Search Bar */}
        <div className="mod-audit-filter-row">
          <div className="filter-tabs-group">
            {['ALL', 'TIMEOUT', 'BAN', 'DELETE_MSG', 'SLOW_MODE'].map(tab => (
              <button
                key={tab}
                type="button"
                className={`filter-tab-btn ${filterType === tab ? 'active' : ''}`}
                onClick={() => {
                  soundFX.playPop();
                  setFilterType(tab);
                }}
              >
                {tab.replace('_', ' ')}
              </button>
            ))}
          </div>

          <div className="mod-search-box">
            <Search size={14} color="var(--text-muted)" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search user, reason, or mod..."
            />
          </div>
        </div>

        {/* Logs List */}
        <div className="mod-audit-logs-list">
          {filteredLogs.length === 0 ? (
            <div className="mod-empty-state">
              <span>No moderation actions found matching current filter.</span>
            </div>
          ) : (
            filteredLogs.map(item => (
              <div key={item.id} className={`audit-log-item ${item.isReversed ? 'reversed' : ''}`}>
                <div className="audit-item-top">
                  <div className="audit-badge-and-target">
                    {getActionBadge(item.actionType)}
                    {item.targetUser && (
                      <strong className="target-username">@{item.targetUser}</strong>
                    )}
                    {item.durationSeconds && (
                      <span className="duration-tag">({item.durationSeconds}s)</span>
                    )}
                  </div>

                  <span className="audit-timestamp">{item.timestamp}</span>
                </div>

                <p className="audit-reason-text">"{item.reason}"</p>

                <div className="audit-item-footer">
                  <span className="mod-attribution">
                    Enforced by: <strong>@{item.moderatorName}</strong>
                  </span>

                  {item.isReversed ? (
                    <span className="action-reversed-tag">Action Reversed</span>
                  ) : (
                    (item.actionType === 'TIMEOUT' || item.actionType === 'BAN') && (
                      <button
                        type="button"
                        className="btn-reverse-action"
                        onClick={() => handleReverseAction(item.id)}
                        title="Reverse / Pardon Action"
                      >
                        <RotateCcw size={12} />
                        <span>Reverse Action</span>
                      </button>
                    )
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
