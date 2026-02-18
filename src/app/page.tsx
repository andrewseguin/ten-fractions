'use client';

import React from 'react';
import { useGameLogic } from '@/hooks/useGameLogic';
import { MainMenu } from '@/components/game/MainMenu';
import { GameArena } from '@/components/game/GameArena';

export default function Home() {
  const game = useGameLogic();

  return (
    <main className="min-h-screen">
      {game.gameState === 'MENU' ? (
        <MainMenu onStart={({ p1Name, p1Char, p2Type, p2Name, p2Char, difficulty }) => {
          game.startGame(p1Name, p1Char, p2Type, p2Name, p2Char, difficulty);
        }} />
      ) : (
        <GameArena game={game} />
      )}
    </main>
  );
}
