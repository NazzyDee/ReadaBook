import React, { useState } from 'react';
import { X, Edit3, Tag, Plus } from 'lucide-react';

interface StreamInfoModalProps {
  initialTitle: string;
  initialGenre: string;
  initialTags: string[];
  initialLanguage?: string;
  onSave: (title: string, genre: string, tags: string[], language?: string) => void;
  onClose: () => void;
}

export const StreamInfoModal: React.FC<StreamInfoModalProps> = ({
  initialTitle,
  initialGenre,
  initialTags,
  initialLanguage = 'English',
  onSave,
  onClose
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [genre, setGenre] = useState(initialGenre);
  const [tags, setTags] = useState<string[]>(initialTags || []);
  const [newTagInput, setNewTagInput] = useState('');
  const [language, setLanguage] = useState(initialLanguage);

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTag = newTagInput.trim().replace(/^#/, '');
    if (cleanTag && !tags.includes(cleanTag) && tags.length < 10) {
      setTags([...tags, cleanTag]);
      setNewTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave(title.trim(), genre, tags, language);
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="stream-info-modal-card">
        <div className="modal-header">
          <div className="modal-title-row">
            <Edit3 size={18} color="var(--accent-secondary)" />
            <h3>Edit Stream Information</h3>
          </div>
          <button onClick={onClose} className="modal-close-btn">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="stream-info-form">
          <div className="form-group">
            <label>Stream Title <span style={{ color: 'var(--accent-danger)' }}>*</span></label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What are you reading today?"
              className="info-text-input"
              maxLength={140}
              required
            />
            <span className="char-count">{title.length}/140</span>
          </div>

          <div className="form-row-2col">
            <div className="form-group">
              <label>Category / Genre</label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="info-select-input"
              >
                <option value="Fantasy">Fantasy</option>
                <option value="Sci-Fi">Sci-Fi</option>
                <option value="Classics">Classics</option>
                <option value="Mystery & Thriller">Mystery & Thriller</option>
                <option value="Silent Study & Lofi">Silent Study & Lofi</option>
                <option value="Young Adult">Young Adult</option>
                <option value="Non-Fiction">Non-Fiction</option>
                <option value="Poetry">Poetry</option>
              </select>
            </div>

            <div className="form-group">
              <label>Primary Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="info-select-input"
              >
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
                <option value="Japanese">Japanese</option>
              </select>
            </div>
          </div>

          {/* Tags Editor */}
          <div className="form-group">
            <label>Tags (up to 10):</label>
            <div className="tags-chips-editor">
              {tags.map(t => (
                <span key={t} className="editable-tag-chip">
                  #{t}
                  <button type="button" onClick={() => handleRemoveTag(t)}>
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>

            {tags.length < 10 && (
              <div className="add-tag-inline-row">
                <Tag size={15} color="var(--text-muted)" />
                <input
                  type="text"
                  placeholder="Add custom tag (e.g. CozyVibes, Tolkien, VoiceActing)..."
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  className="add-tag-input"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  disabled={!newTagInput.trim()}
                  className="btn-add-tag-btn"
                >
                  <Plus size={14} />
                  <span>Add</span>
                </button>
              </div>
            )}
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Done
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
