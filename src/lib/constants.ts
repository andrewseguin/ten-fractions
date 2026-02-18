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
    { id: 'robot2', name: 'Mecha-Bit', color: 'bg-cyan-500', image: '/assets/robot2.png', type: 'robot' },
    { id: 'dino1', name: 'Rexy', color: 'bg-green-600', image: '/assets/dino1.png', type: 'dino' },
    { id: 'dino2', name: 'Tri-Horn', color: 'bg-purple-600', image: '/assets/dino2.png', type: 'dino' },
    { id: 'climber-m', name: 'Alex', color: 'bg-orange-500', image: '/assets/climber-m.png', type: 'climber' },
    { id: 'climber-f', name: 'Mia', color: 'bg-rose-500', image: '/assets/climber-f.png', type: 'climber' },
];

export const BACKGROUNDS = [
    { id: 'mountain', name: 'Mountain Climb', css: 'bg-sky-400', image: '/assets/mountain.png' },
    { id: 'concert', name: 'Concert', css: 'bg-indigo-600', image: '/assets/concert.png' },
    { id: 'dinoland', name: 'Dinoland', css: 'bg-emerald-600', image: '/assets/dinoland.png' },
    { id: 'castle', name: 'Castle', css: 'bg-sky-400', image: '/assets/castle.png' },
    { id: 'space', name: 'Space Station', css: 'bg-slate-900', image: '/assets/space.png' },
    { id: 'deepsea', name: 'Deep Sea', css: 'bg-cyan-900', image: '/assets/deepsea.png' },
];
