import { GeneratedMemoryPalaceScene, MemoryLocus, PalaceArchetype, UserStats } from './types';

export const DEFAULT_GENERATED_SCENE: GeneratedMemoryPalaceScene = {
  scene: {
    scene_name: 'The Cellular Respiration Estate',
    rooms: [
      {
        room_id: 'r1',
        room_name: 'The Kitchen of Glycolysis',
        object_name: 'Glucose Cleavage to Pyruvate',
        metaphor: 'A bustling prep kitchen with twin cleavers cleanly splitting a shimmering golden sugar loaf into two humming vials of glowing energy broth.',
      },
      {
        room_id: 'r2',
        room_name: 'The Grand Hall of the Citric Cycle',
        object_name: 'Acetyl-CoA & NADH Reduction',
        metaphor: 'A grand circular banquet table turning steadily clockwise, where eight silver platters strip high-energy sparks onto glowing blue courier flags.',
      },
      {
        room_id: 'r3',
        room_name: 'The Attic of Chemiosmosis',
        object_name: 'ATP Synthase Rotary Motor',
        metaphor: 'A towering crystalline dam restraining a sea of pressurized cyan sparks, driving a spinning rotary waterwheel that mints brilliant golden ATP coins.',
      },
    ],
  },
};

export const SAMPLE_INPUT_PRESETS = [
  {
    title: 'Cellular Respiration (Krebs Cycle)',
    text: `1. Glycolysis breaks down glucose into two molecules of pyruvate, generating a net of 2 ATP and 2 NADH in the cytoplasm.\n2. In the mitochondrial matrix, pyruvate dehydrogenase converts pyruvate into Acetyl-CoA, releasing CO2.\n3. The Citric Acid Cycle merges Acetyl-CoA with oxaloacetate to form citrate. Through eight enzymatic steps, NAD+ and FAD are reduced to high-energy electron carriers.\n4. Oxidative phosphorylation utilizes the electron transport chain across the inner membrane, pumping protons into the intermembrane space.\n5. ATP Synthase harnesses the chemiosmotic proton motive force to synthesize approximately 30-32 ATP per glucose.`,
  },
  {
    title: 'The Roman Republic to Empire',
    text: `1. 509 BCE: Overthrow of the Tarquin monarchy and founding of the Roman Republic led by two consuls and the Senate.\n2. The Struggle of the Orders: Plebeians secure representation through the Tribunes and the Twelve Tables.\n3. Punic Wars (264-146 BCE): Defeat of Carthage secures total Mediterranean hegemony.\n4. First Triumvirate (60 BCE): Julius Caesar, Pompey, and Crassus destabilize republican checks and balances.\n5. 27 BCE: Octavian receives the title Augustus, marking the birth of the Principate and the Pax Romana.`,
  },
  {
    title: 'Principles of Quantum Mechanics',
    text: `1. Wave-Particle Duality: Matter and electromagnetic radiation exhibit both wave-like and particle-like characteristics.\n2. Heisenberg Uncertainty Principle: Position and momentum cannot both be measured with arbitrary precision concurrently.\n3. Quantum Superposition: A quantum system resides in a linear combination of all possible eigenstates until measurement collapses the wave function.\n4. Quantum Entanglement: Multi-particle quantum states where individual states cannot be described independently regardless of spatial distance.`,
  },
];

export const ARCHETYPES: PalaceArchetype[] = [
  {
    id: 'observatory',
    name: 'Celestial Observatory',
    description: 'Starlit obsidian dome with hovering astrolabes and luminous constellations.',
    icon: 'Sparkles',
    vibe: 'Deep Cosmic Cyan',
  },
  {
    id: 'library',
    name: 'Grand Arcane Archive',
    description: 'Towering mahogany shelves, floating parchment codices, and violet bioluminescence.',
    icon: 'BookOpen',
    vibe: 'Mystic Violet',
  },
  {
    id: 'pantheon',
    name: 'Neoclassical Atrium',
    description: 'Fluted marble colonnades bathed in ethereal dawn light and calm reflecting pools.',
    icon: 'Columns',
    vibe: 'Ethereal Indigo',
  },
  {
    id: 'cyber',
    name: 'Neon Solarium',
    description: 'Prismatic glass terraces suspended above a quiet holographic metropolis.',
    icon: 'Cpu',
    vibe: 'Prism Turquoise',
  },
];

export const DEFAULT_LOCI: MemoryLocus[] = [
  {
    id: 'locus-1',
    name: 'Vestibule of Origins',
    locationName: 'Main Threshold Arch',
    concept: 'Glycolysis & Initial Cleavage',
    mnemonicImage: 'A crystalline hourglass shattering into two molten amber droplets (Pyruvates).',
    recallCue: 'Focus on the glowing doorway splitting in two.',
    color: 'purple',
    coords: { x: 22, y: 35 },
  },
  {
    id: 'locus-2',
    name: 'The Matrix Antechamber',
    locationName: 'Obsidian Pedestal',
    concept: 'Pyruvate Decarboxylation & Acetyl-CoA',
    mnemonicImage: 'A fiery key of CoA unlatching a heavy iron gate while vaporous CO2 steam rises.',
    recallCue: 'Observe the steam escaping near the central pillar.',
    color: 'cyan',
    coords: { x: 45, y: 22 },
  },
  {
    id: 'locus-3',
    name: 'The Great Rotary Crucible',
    locationName: 'Starlight Waterwheel',
    concept: 'The Citric Acid Rotary Cycle',
    mnemonicImage: 'A giant circular waterwheel churning eight glowing orbs, continuously replenishing oxaloacetate.',
    recallCue: 'Watch the continuous 8-step mechanical spin.',
    color: 'indigo',
    coords: { x: 74, y: 40 },
  },
  {
    id: 'locus-4',
    name: 'Chemiosmotic Spire',
    locationName: 'High Gallery Balcony',
    concept: 'Electron Transport & ATP Synthase Turbine',
    mnemonicImage: 'A cascading waterfall of golden sparks powering a miniature spinning water turbine (ATP).',
    recallCue: 'Look upward toward the luminous turbine ceiling.',
    color: 'cyan',
    coords: { x: 50, y: 72 },
  },
];

export const INITIAL_USER_STATS: UserStats = {
  points: 2450,
  conceptsMastered: 18,
  streakDays: 7,
  streakHistory: [true, true, true, true, true, true, true],
  level: 4,
  nextLevelPoints: 3000,
  palacesCount: 5,
  retentionRate: 94,
};

export const RECENT_PALACES = [
  {
    id: 'palace-1',
    title: 'Biochemistry: Krebs & Oxidative Phosphorylation',
    archetype: 'Celestial Observatory',
    lociCount: 6,
    lastStudied: 'Today',
    mastery: 95,
  },
  {
    id: 'palace-2',
    title: 'Classical Foundations: The Roman Republic',
    archetype: 'Neoclassical Atrium',
    lociCount: 5,
    lastStudied: 'Yesterday',
    mastery: 88,
  },
  {
    id: 'palace-3',
    title: 'Quantum Foundations: Duality & Uncertainty',
    archetype: 'Grand Arcane Archive',
    lociCount: 4,
    lastStudied: '3 days ago',
    mastery: 76,
  },
];
