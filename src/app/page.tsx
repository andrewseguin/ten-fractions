'use client';

import { useState } from 'react';
import { MainMenu } from '@/components/game/MainMenu';
import { GameArena } from '@/components/game/GameArena';
import { useGameLogic } from '@/hooks/useGameLogic';
import { PlayerType } from '@/lib/constants';

interface GameSettings {
  p1Name: string;
  p1Char: string;
  p2Type: PlayerType;
  p2Name: string;
  p2Char: string;
  difficulty: number;
  bgId: string;
}

export default function Home() {
  const game = useGameLogic();
  const [selectedBg, setSelectedBg] = useState('concert');

  const handleStart = (settings: GameSettings) => {
    setSelectedBg(settings.bgId);
    game.startGame(
      settings.p1Name,
      settings.p1Char,
      settings.p2Type,
      settings.p2Name,
      settings.p2Char,
      settings.difficulty
    );
  };

  const handleHardStart = (settings: Omit<GameSettings, 'difficulty'>) => {
    setSelectedBg(settings.bgId);
    game.startGame(
      settings.p1Name,
      settings.p1Char,
      settings.p2Type,
      settings.p2Name,
      settings.p2Char,
      3
    );
    game.skipToHardRound();
  };

  const handlePracticeStart = (settings: { p1Name: string; p1Char: string; p2Name: string; p2Char: string; difficulty: number; topic: string }) => {
    setSelectedBg('forest');
    game.startGame(
      settings.p1Name,
      settings.p1Char,
      'computer',
      settings.p2Name,
      settings.p2Char,
      settings.difficulty,
      'forest',
      settings.topic
    );
  };

  return (
    <main>
      {game.gameState === 'MENU' ? (
        <MainMenu onStart={handleStart} onHardStart={handleHardStart} onPracticeStart={handlePracticeStart} />
      ) : (
        <GameArena game={game} bgId={selectedBg} />
      )}
    </main>
  );
}
