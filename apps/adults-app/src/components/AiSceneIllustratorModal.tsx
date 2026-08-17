import React, { useState } from 'react';
import { X, Palette, Sparkles, CheckCircle2, Image as ImageIcon, Wand2, Monitor } from 'lucide-react';
import { DEFAULT_GENERATED_SCENES, type GeneratedSceneArtwork } from '../lib/aiSceneIllustratorData';
import { soundFX } from '../lib/soundFx';

interface AiSceneIllustratorModalProps {
  streamerName: string;
  onClose: () => void;
}

export const AiSceneIllustratorModal: React.FC<AiSceneIllustratorModalProps> = ({
  streamerName,
  onClose
}) => {
  const [artworks, setArtworks] = useState<GeneratedSceneArtwork[]>(DEFAULT_GENERATED_SCENES);
  const [selectedArtId, setSelectedArtId] = useState<string>('art_001');
  const [promptText, setPromptText] = useState<string>('The fiery dragon soaring across the snow-capped mountains of the North');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleGenerateNewScene = (e: React.FormEvent) => {
    e.preventDefault();
    soundFX.playPop();
    soundFX.playChestClaim();
    const newArt: GeneratedSceneArtwork = {
      id: `art_${Date.now()}`,
      sceneTitle: 'The Dragon\'s Flight over the Frozen Crags',
      artStyle: 'OIL_PAINTING_FANTASY',
      scenePromptSummary: promptText,
      generatedImageUrl: '/assets/illustrations/dragon_flight.jpg',
      likesCount: 1,
      isStreamBackdropActive: false
    };
    setArtworks([newArt, ...artworks]);
    setSelectedArtId(newArt.id);
    setToastMsg('🎨 Rendered dynamic 4K scene illustration from stream text paragraph!');
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleSetAsBackdrop = (art: GeneratedSceneArtwork) => {
    soundFX.playPop();
    soundFX.playHarp();
    setArtworks(prev => prev.map(a => ({
      ...a,
      isStreamBackdropActive: a.id === art.id
    })));
    setToastMsg(`🖼️ Set "${art.sceneTitle}" as the active live stream background!`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const currentArt = artworks.find(a => a.id === selectedArtId) || artworks[0];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="illustrator-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="illustrator-modal-header">
          <div className="illustrator-title-group">
            <div className="illustrator-badge">
              <Palette size={16} />
              <span>AI SCENE ILLUSTRATOR & VISUAL MOODBOARD ENGINE</span>
            </div>
            <h3>@{streamerName}'s Real-Time Concept Art Studio</h3>
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

        {/* Art Showcase Hero Banner */}
        <div className="illustrator-hero-banner">
          <div className="art-canvas-preview">
            <div className="art-canvas-frame">
              <ImageIcon size={48} color="rgba(255,255,255,0.4)" />
              <span className="art-style-badge">{currentArt.artStyle.replace(/_/g, ' ')}</span>
            </div>
            <span className="art-likes-sub">❤️ {currentArt.likesCount} Viewer Likes</span>
          </div>

          <div className="illustrator-hero-meta">
            <h4>{currentArt.sceneTitle}</h4>
            <p className="scene-prompt-desc">"{currentArt.scenePromptSummary}"</p>

            <div className="art-controls-row">
              <button
                type="button"
                className={`btn-set-backdrop ${currentArt.isStreamBackdropActive ? 'active' : ''}`}
                onClick={() => handleSetAsBackdrop(currentArt)}
              >
                <Monitor size={14} />
                <span>{currentArt.isStreamBackdropActive ? 'Active Stream Backdrop' : 'Project to Live Stream Video'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Prompt Input Form */}
        <form className="illustrator-generate-form" onSubmit={handleGenerateNewScene}>
          <input
            type="text"
            value={promptText}
            onChange={e => setPromptText(e.target.value)}
            className="input-scene-prompt"
            placeholder="Describe the current paragraph's scenery..."
            required
          />
          <button type="submit" className="btn-generate-scene">
            <Wand2 size={16} />
            <span>Illustrate Scene</span>
          </button>
        </form>

        {/* Art Gallery Grid */}
        <div className="art-gallery-grid">
          {artworks.map(a => (
            <div
              key={a.id}
              className={`art-tile ${a.id === selectedArtId ? 'selected' : ''}`}
              onClick={() => {
                soundFX.playPop();
                setSelectedArtId(a.id);
              }}
            >
              <div className="art-tile-top">
                <strong>{a.sceneTitle}</strong>
                <span className="art-likes-badge">❤️ {a.likesCount}</span>
              </div>
              <span className="art-style-sub">{a.artStyle.replace(/_/g, ' ')}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="illustrator-modal-footer">
          <span className="footer-art-note">
            🎨 Generates real-time 4K cinematic concept art synced with the live audiobook narrative.
          </span>
          <button
            type="button"
            className="btn-primary"
            onClick={onClose}
          >
            <CheckCircle2 size={16} />
            <span>Done</span>
          </button>
        </div>
      </div>
    </div>
  );
};
