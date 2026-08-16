import React, { useState } from 'react';
import { X, TreePine, Sparkles, CheckCircle2, Lock, Zap } from 'lucide-react';
import { MOCK_SKILL_TREE_NODES, type SkillTreeNode } from '../lib/narratorSkillTreeData';
import { soundFX } from '../lib/soundFx';

interface NarratorSkillTreeModalProps {
  streamerName: string;
  onClose: () => void;
}

export const NarratorSkillTreeModal: React.FC<NarratorSkillTreeModalProps> = ({
  streamerName,
  onClose
}) => {
  const [nodes, setNodes] = useState<SkillTreeNode[]>(MOCK_SKILL_TREE_NODES);
  const [selectedBranch, setSelectedBranch] = useState<string>('ALL');
  const [userXp, setUserXp] = useState<number>(1450);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const filteredNodes = selectedBranch === 'ALL'
    ? nodes
    : nodes.filter(n => n.branch === selectedBranch);

  const handleUnlockNode = (node: SkillTreeNode) => {
    if (userXp < node.xpCost) {
      soundFX.playPop();
      setToastMsg(`⚠️ Not enough XP! Requires ${node.xpCost} XP (You have ${userXp} XP).`);
      setTimeout(() => setToastMsg(null), 3000);
      return;
    }

    soundFX.playChestClaim();
    soundFX.playHarp();
    setUserXp(prev => prev - node.xpCost);
    setNodes(prev => prev.map(n => n.id === node.id ? { ...n, isUnlocked: true } : n));
    setToastMsg(`🌟 UNLOCKED PERK: "${node.name}"! Passive bonus active on your stream.`);
    setTimeout(() => setToastMsg(null), 4000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="skill-tree-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="skill-tree-modal-header">
          <div className="skill-tree-title-group">
            <div className="skill-tree-badge">
              <TreePine size={16} />
              <span>MASTER CHRONICLER RPG SKILL TREE</span>
            </div>
            <h3>@{streamerName}'s Broadcaster Progression Path</h3>
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

        {/* XP Level Banner */}
        <div className="xp-level-banner">
          <div className="level-avatar-col">
            <div className="level-badge-circle">
              <span className="level-num">Lv. 7</span>
            </div>
            <div className="level-info-text">
              <h4>Master Storyteller</h4>
              <p>Earn XP by narrating chapters, hosting book clubs, and receiving Sparks.</p>
            </div>
          </div>

          <div className="xp-balance-pill">
            <Zap size={16} color="#ffd700" />
            <strong>{userXp.toLocaleString()} Available XP</strong>
          </div>
        </div>

        {/* Branch Filter Tabs */}
        <div className="skill-branch-tabs">
          {['ALL', 'VOCAL_SORCERY', 'COMMUNITY', 'AUDIO_TECH'].map(branch => (
            <button
              key={branch}
              type="button"
              className={`branch-tab-btn ${selectedBranch === branch ? 'active' : ''}`}
              onClick={() => {
                soundFX.playPop();
                setSelectedBranch(branch);
              }}
            >
              {branch.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Skill Tree Grid */}
        <div className="skill-nodes-grid">
          {filteredNodes.map(node => (
            <div
              key={node.id}
              className={`skill-node-card ${node.isUnlocked ? 'unlocked' : 'locked'}`}
            >
              <div className="node-icon-wrap">
                <span className="node-emoji">{node.icon}</span>
                {node.isUnlocked ? (
                  <CheckCircle2 size={16} color="#00ff88" className="node-status-icon" />
                ) : (
                  <Lock size={16} color="var(--text-muted)" className="node-status-icon" />
                )}
              </div>

              <div className="node-info">
                <div className="node-title-row">
                  <h4>{node.name}</h4>
                  <span className="req-level-pill">Req. Lv. {node.levelRequired}</span>
                </div>
                <p className="perk-desc">{node.perkDescription}</p>

                {node.isUnlocked ? (
                  <span className="perk-active-tag">✅ PERK ACTIVE</span>
                ) : (
                  <button
                    type="button"
                    className="btn-unlock-node"
                    onClick={() => handleUnlockNode(node)}
                  >
                    <Zap size={12} color="#ffd700" />
                    <span>Unlock ({node.xpCost} XP)</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="skill-tree-modal-footer">
          <span className="passive-buffs-notice">
            ✨ Unlocked perks automatically apply to your broadcast bitrate, soundstage, and chat widgets.
          </span>
          <button
            type="button"
            className="btn-primary btn-close-skills"
            onClick={onClose}
          >
            <span>Done</span>
          </button>
        </div>
      </div>
    </div>
  );
};
