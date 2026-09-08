export type ScreenType = 'input' | 'scene' | 'dashboard' | 'exam';

export interface MemoryRoom {
  room_id: string;
  room_name: string;
  object_name: string;
  metaphor: string;
}

export interface GeneratedMemoryPalaceScene {
  scene: {
    scene_name: string;
    rooms: MemoryRoom[];
  };
}

export interface MemoryLocus {
  id: string;
  name: string;
  locationName: string;
  concept: string;
  mnemonicImage: string;
  recallCue: string;
  color: 'purple' | 'cyan' | 'indigo' | 'emerald';
  coords: { x: number; y: number }; // Percentage position inside the room map
}

export interface PalaceArchetype {
  id: string;
  name: string;
  description: string;
  icon: string;
  vibe: string;
}

export interface UserStats {
  points: number;
  conceptsMastered: number;
  streakDays: number;
  streakHistory: boolean[];
  level: number;
  nextLevelPoints: number;
  palacesCount: number;
  retentionRate: number;
}
