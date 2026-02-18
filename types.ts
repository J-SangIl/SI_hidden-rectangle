
export type GamePhase = 'setup' | 'playing';

export interface CellState {
  index: number;
  isWinning: boolean;
  isRevealed: boolean;
}

export interface GameConfig {
  winCount: number;
  gridSize: number;
}
