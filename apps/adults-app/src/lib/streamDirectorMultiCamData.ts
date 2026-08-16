export interface CameraAngle {
  id: string;
  name: string;
  description: string;
  previewUrl: string;
  isActive: boolean;
  resolution: string;
  fps: number;
}

export const AVAILABLE_CAMERA_ANGLES: CameraAngle[] = [
  {
    id: 'cam_face',
    name: 'Narrator Face Cam (Primary)',
    description: 'Crisp 4K close-up focused on dramatic facial expressions and voice acting.',
    previewUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
    isActive: true,
    resolution: '3840x2160',
    fps: 60
  },
  {
    id: 'cam_overhead',
    name: 'Overhead Manuscript Bookcam',
    description: 'Top-down parchment view showing illuminated margins, turning pages & wax seals.',
    previewUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
    isActive: false,
    resolution: '1920x1080',
    fps: 60
  },
  {
    id: 'cam_foley',
    name: 'Foley Prop Desk Cam',
    description: 'Angled shot of mechanical props, bell ringers, clashing blades and thunder sheets.',
    previewUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
    isActive: false,
    resolution: '1920x1080',
    fps: 60
  },
  {
    id: 'cam_cosplay',
    name: 'Cosplay Wide Stage Angle',
    description: 'Full-room fantasy tavern stage background with atmospheric lantern lighting.',
    previewUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    isActive: false,
    resolution: '1920x1080',
    fps: 60
  }
];
