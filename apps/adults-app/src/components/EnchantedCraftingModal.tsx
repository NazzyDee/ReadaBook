import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, Hammer, Wand2, Lock } from 'lucide-react';
import { DEFAULT_CRAFTING_RECIPES, type CraftingRecipe } from '../lib/enchantedCraftingData';
import { soundFX } from '../lib/soundFx';

interface EnchantedCraftingModalProps {
  streamerName: string;
  onClose: () => void;
}

export const EnchantedCraftingModal: React.FC<EnchantedCraftingModalProps> = ({
  streamerName,
  onClose
}) => {
  const [recipes] = useState<CraftingRecipe[]>(DEFAULT_CRAFTING_RECIPES);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleCraftArtifact = (recipe: CraftingRecipe) => {
    soundFX.playPop();
    soundFX.playHarp();
    setToastMsg(`✨ Successfully crafted "${recipe.artifactName}"! Buff activated for ${recipe.durationMinutes} minutes.`);
    setTimeout(() => setToastMsg(null), 3500);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="crafting-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="crafting-modal-header">
          <div className="crafting-title-group">
            <div className="crafting-badge">
              <Wand2 size={16} />
              <span>READER INVENTORY & ENCHANTED ARTIFACT CRAFTING</span>
            </div>
            <h3>@{streamerName}'s Alchemy Workbench</h3>
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

        {/* Hero Banner */}
        <div className="crafting-hero-banner">
          <div className="alchemy-dial-box">
            <Hammer size={44} color="#ffd700" />
            <span className="recipes-count-tag">3 RECIPES KNOWN</span>
          </div>

          <div className="crafting-hero-meta">
            <h4>Craft Potions, Scrolls & Enchanted Viewer Perks</h4>
            <p className="crafting-explainer">
              Combine raw ingredients gathered from live chapter drops and chat sprints to forge powerful active buffs, cosmetic quill trails, and Double XP scrolls.
            </p>
          </div>
        </div>

        {/* Crafting Recipes List */}
        <div className="recipes-list">
          <h4>Alchemy & Scribe Crafting Formulas</h4>
          {recipes.map(rec => (
            <div key={rec.id} className="recipe-card">
              <div className="recipe-left">
                <Wand2 size={22} color={rec.isCraftable ? '#ffd700' : 'var(--text-muted)'} />
                <div className="recipe-info">
                  <strong>{rec.artifactName}</strong>
                  <p className="buff-desc">{rec.buffDescription}</p>
                  <div className="materials-req-row">
                    {rec.requiredMaterials.map((mat, idx) => (
                      <span
                        key={idx}
                        className={`mat-chip ${mat.userHasCount >= mat.count ? 'has-enough' : 'missing'}`}
                      >
                        {mat.materialName}: {mat.userHasCount}/{mat.count}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="recipe-right">
                {rec.isCraftable ? (
                  <button
                    type="button"
                    className="btn-craft-artifact"
                    onClick={() => handleCraftArtifact(rec)}
                  >
                    <Hammer size={14} />
                    <span>Craft Artifact</span>
                  </button>
                ) : (
                  <span className="missing-mats-pill">
                    <Lock size={12} />
                    <span>Missing Ingredients</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="crafting-modal-footer">
          <span className="footer-crafting-note">
            🎒 Gather more vellum, ink, and gold leaf by participating in live sprints and reading relays.
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
