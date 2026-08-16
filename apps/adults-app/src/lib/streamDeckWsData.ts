export interface StreamDeckActionMapping {
  keyIndex: number;
  actionName: string;
  category: 'READING_SPRINT' | 'SFX_TRIGGER' | 'CAM_SWITCH' | 'MODERATION';
  wsPayloadEvent: string;
  hotkeyBinding: string;
  iconEmoji: string;
}

export const DEFAULT_STREAM_DECK_MAPPINGS: StreamDeckActionMapping[] = [
  {
    keyIndex: 1,
    actionName: 'Start 15m Sprint',
    category: 'READING_SPRINT',
    wsPayloadEvent: 'EVENT_START_SPRINT_15',
    hotkeyBinding: 'F13',
    iconEmoji: '⏱️'
  },
  {
    keyIndex: 2,
    actionName: 'Thunder Foley Sound',
    category: 'SFX_TRIGGER',
    wsPayloadEvent: 'EVENT_TRIGGER_SFX_THUNDER',
    hotkeyBinding: 'F14',
    iconEmoji: '⚡'
  },
  {
    keyIndex: 3,
    actionName: 'Switch Manuscript Cam',
    category: 'CAM_SWITCH',
    wsPayloadEvent: 'EVENT_CAM_MANUSCRIPT_CLOSEUP',
    hotkeyBinding: 'F15',
    iconEmoji: '📖'
  },
  {
    keyIndex: 4,
    actionName: 'Shield Mode Emergency',
    category: 'MODERATION',
    wsPayloadEvent: 'EVENT_ACTIVATE_SHIELD_LOCKDOWN',
    hotkeyBinding: 'F16',
    iconEmoji: '🛡️'
  },
  {
    keyIndex: 5,
    actionName: 'Sparks Piñata Burst',
    category: 'SFX_TRIGGER',
    wsPayloadEvent: 'EVENT_LAUNCH_SPARKS_PINATA',
    hotkeyBinding: 'F17',
    iconEmoji: '🎉'
  },
  {
    keyIndex: 6,
    actionName: 'Next Chapter Bookmark',
    category: 'READING_SPRINT',
    wsPayloadEvent: 'EVENT_ADVANCE_CHAPTER_STAMP',
    hotkeyBinding: 'F18',
    iconEmoji: '📜'
  }
];
