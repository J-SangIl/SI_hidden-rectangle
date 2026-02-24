import React, { useState, useCallback, useMemo } from 'react';
import { GamePhase } from './types.ts';
import { generateWinningIndices } from './utils/gameLogic.ts';
import GridCell from './components/GridCell.tsx';

const GRID_SIZE = 10;

const App: React.FC = () => {
  const [phase, setPhase] = useState<GamePhase>('setup');
  const [winCountInput, setWinCountInput] = useState<string>('6');
  const [winningIndices, setWinningIndices] = useState<Set<number>>(new Set());
  const [revealedIndices, setRevealedIndices] = useState<Set<number>>(new Set());
  const [error, setError] = useState<string | null>(null);

  const startGame = () => {
    const count = parseInt(winCountInput, 10);
    if (isNaN(count) || count <= 0 || count > GRID_SIZE * GRID_SIZE) {
      setError(`1에서 ${GRID_SIZE * GRID_SIZE} 사이의 올바른 숫자를 입력해주세요.`);
      return;
    }

    const result = generateWinningIndices(count, GRID_SIZE);
    if (!result) {
      setError(`현재 10x10 판에서는 ${count}개의 칸으로 직사각형을 만들 수 없습니다. 다른 숫자를 입력해보세요.`);
      return;
    }

    setWinningIndices(result);
    setRevealedIndices(new Set());
    setError(null);
    setPhase('playing');
  };

  const handleCellClick = useCallback((index: number) => {
    setRevealedIndices((prev) => {
      const next = new Set(prev);
      next.add(index);
      return next;
    });
  }, []);

  const goHome = () => {
    setPhase('setup');
    setRevealedIndices(new Set());
    setWinningIndices(new Set());
    setError(null);
  };

  const foundCount = useMemo(() => {
    let count = 0;
    revealedIndices.forEach(idx => {
      if (winningIndices.has(idx)) count++;
    });
    return count;
  }, [revealedIndices, winningIndices]);

  const isGameCleared = foundCount === winningIndices.size;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center p-4 md:p-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          숨은 직사각형 찾기
        </h1>
        <p className="mt-2 text-lg text-slate-600">숨겨진 직사각형 모양의 당첨 칸을 모두 찾아보세요</p>
      </header>

      <main className="w-full max-w-2xl bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-6 md:p-10">
        {phase === 'setup' ? (
          <div className="flex flex-col items-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="w-full max-w-sm">
              <label htmlFor="win-count" className="block text-sm font-semibold text-slate-700 mb-2">
                당첨 칸 개수 (직사각형 면적)
              </label>
              <div className="relative">
                <input
                  id="win-count"
                  type="number"
                  value={winCountInput}
                  onChange={(e) => setWinCountInput(e.target.value)}
                  placeholder="예: 6"
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-lg font-medium"
                />
              </div>
              {error && (
                <p className="mt-3 text-sm text-red-500 font-medium">
                  {error}
                </p>
              )}
            </div>

            <button
              onClick={startGame}
              className="w-full max-w-sm bg-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center space-x-2"
            >
              <span>게임 시작</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        ) : (
          <div className="animate-in fade-in duration-700">
            <div className="flex justify-between items-end mb-6">
              <div>
                <button
                  onClick={goHome}
                  className="group flex items-center text-slate-500 hover:text-slate-900 font-semibold transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 group-hover:-translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                  메뉴로 돌아가기
                </button>
                <div className="mt-4 flex items-center space-x-4">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">찾은 개수</span>
                    <span className="text-2xl font-black text-slate-900">{foundCount} / {winningIndices.size}</span>
                  </div>
                </div>
              </div>

              {isGameCleared && (
                <div className="flex flex-col items-end animate-bounce">
                  <span className="px-4 py-2 bg-green-500 text-white text-sm font-bold rounded-lg shadow-lg">
                    성공!
                  </span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-10 gap-1 md:gap-2 p-1 md:p-3 bg-slate-100 rounded-2xl border-2 border-slate-200">
              {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, idx) => (
                <GridCell
                  key={idx}
                  index={idx}
                  isWinning={winningIndices.has(idx)}
                  isRevealed={revealedIndices.has(idx)}
                  onClick={() => handleCellClick(idx)}
                />
              ))}
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-sm font-medium text-slate-600">당첨 칸</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-sm font-medium text-slate-600">꽝 (빈 칸)</span>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-auto pt-12 pb-6 text-center text-slate-400 text-sm font-medium">
        &copy; {new Date().getFullYear()} 숨은 직사각형 찾기 Pro. 행운을 빕니다!
      </footer>
    </div>
  );
};

export default App;