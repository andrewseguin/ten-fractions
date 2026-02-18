export const MAX_ROUNDS = 10;

export const POINTS_PER_DIFFICULTY = {
    1: 10,
    2: 20,
    3: 30,
};

export const AI_ERROR_RATES = {
    1: 0.3, // 30% chance of error
    2: 0.2, // 20%
    3: 0.1, // 10%
};

export type PlayerType = 'human' | 'computer';

export const CHARACTERS = [
    { id: 'robot1', name: 'Robo-One', color: 'bg-blue-500', image: '/assets/robot1.png', type: 'robot' },
    { id: 'robot2', name: 'Mecha-Bit', color: 'bg-cyan-500', image: '/assets/robot2.png', type: 'robot' }, // Placeholder image
    { id: 'dino1', name: 'Rexy', color: 'bg-green-600', image: '/assets/dino1.png', type: 'dino' },     // Placeholder image
    { id: 'dino2', name: 'Tri-Horn', color: 'bg-purple-600', image: '/assets/dino2.png', type: 'dino' }, // Placeholder image
];

export const BACKGROUNDS = [
    { id: 'bg1', name: 'Space', css: 'bg-slate-900' },
    { id: 'bg2', name: 'Sky', css: 'bg-sky-300' },
    { id: 'bg3', name: 'Forest', css: 'bg-emerald-800' },
    { id: 'bg4', name: 'Volcano', css: 'bg-orange-900' }, // New background for Dinos
];
