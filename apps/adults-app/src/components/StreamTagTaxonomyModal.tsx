import React, { useState } from 'react';
import { X, Tag, Sparkles, CheckCircle2, Plus, Flame } from 'lucide-react';
import { AVAILABLE_STREAM_TAGS, type StreamTagItem } from '../lib/streamTagData';
import { soundFX } from '../lib/soundFx';

interface StreamTagTaxonomyModalProps {
  streamerName: string;
  onClose: () => void;
}

export const StreamTagTaxonomyModal: React.FC<StreamTagTaxonomyModalProps> = ({
  streamerName,
  onClose
}) => {
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([
    'tag_dark_fantasy',
    'tag_character_accents',
    'tag_cozy_hearth'
  ]);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [newCustomTag, setNewCustomTag] = useState('');
  const [allTags, setAllTags] = useState<StreamTagItem[]>(AVAILABLE_STREAM_TAGS);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const filteredTags = activeCategory === 'ALL'
    ? allTags
    : allTags.filter(t => t.category === activeCategory);

  const handleToggleTag = (id: string) => {
    soundFX.playPop();
    if (selectedTagIds.includes(id)) {
      setSelectedTagIds(prev => prev.filter(t => t !== id));
    } else {
      if (selectedTagIds.length >= 5) {
        setToastMsg('⚠️ Maximum 5 stream tags allowed! Remove one to add another.');
        setTimeout(() => setToastMsg(null), 3000);
        return;
      }
      setSelectedTagIds(prev => [...prev, id]);
    }
  };

  const handleCreateCustomTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomTag.trim()) return;

    soundFX.playChestClaim();
    const newTag: StreamTagItem = {
      id: `tag_${Date.now()}`,
      name: newCustomTag.trim(),
      category: 'MOOD',
      description: 'Community custom tag.',
      popularityCount: 1
    };

    setAllTags(prev => [newTag, ...prev]);
    setSelectedTagIds(prev => prev.length < 5 ? [...prev, newTag.id] : prev);
    setNewCustomTag('');
    setToastMsg(`🏷️ Created and applied custom tag "#${newTag.name}"!`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleSave = () => {
    soundFX.playChestClaim();
    setToastMsg(`✨ Saved ${selectedTagIds.length} stream tags! Directory indexing updated.`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="tags-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="tags-modal-header">
          <div className="tags-title-group">
            <div className="tags-badge">
              <Tag size={16} />
              <span>LITERARY MOOD & STREAM TAG TAXONOMY</span>
            </div>
            <h3>@{streamerName}'s Broadcast Discovery Tags</h3>
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

        {/* Selected Tags Strip */}
        <div className="selected-tags-strip">
          <div className="tags-counter-label">
            <span>ACTIVE STREAM TAGS ({selectedTagIds.length}/5):</span>
          </div>

          <div className="selected-chips-wrap">
            {selectedTagIds.map(id => {
              const tag = allTags.find(t => t.id === id);
              if (!tag) return null;
              return (
                <span key={id} className="active-tag-chip" onClick={() => handleToggleTag(id)}>
                  #{tag.name}
                  <X size={12} />
                </span>
              );
            })}
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="tag-category-tabs">
          {['ALL', 'MOOD', 'DELIVERY', 'GENRE', 'AUDIENCE'].map(cat => (
            <button
              key={cat}
              type="button"
              className={`tag-tab-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => {
                soundFX.playPop();
                setActiveCategory(cat);
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Custom Tag Creator */}
        <form onSubmit={handleCreateCustomTag} className="custom-tag-form">
          <div className="custom-tag-input-row">
            <input
              type="text"
              value={newCustomTag}
              onChange={e => setNewCustomTag(e.target.value)}
              placeholder="Add custom literary tag (e.g. CozyReadingNook)..."
            />
            <button type="submit" className="btn-primary btn-add-tag">
              <Plus size={14} />
              <span>Add Tag</span>
            </button>
          </div>
        </form>

        {/* Available Tags Grid */}
        <div className="available-tags-grid">
          {filteredTags.map(tag => {
            const isSelected = selectedTagIds.includes(tag.id);
            return (
              <div
                key={tag.id}
                className={`tag-select-card ${isSelected ? 'selected' : ''}`}
                onClick={() => handleToggleTag(tag.id)}
              >
                <div className="tag-card-top">
                  <strong>#{tag.name}</strong>
                  <span className="tag-popularity">
                    <Flame size={11} color="#ffd700" />
                    {tag.popularityCount}
                  </span>
                </div>
                <p>{tag.description}</p>
                <span className="tag-category-pill">{tag.category}</span>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="tags-modal-footer">
          <button
            type="button"
            className="btn-primary btn-save-tags"
            onClick={handleSave}
          >
            <CheckCircle2 size={16} />
            <span>Apply Stream Tags</span>
          </button>
        </div>
      </div>
    </div>
  );
};
