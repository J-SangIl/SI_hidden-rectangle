
import React from 'react';

interface GridCellProps {
  index: number;
  isRevealed: boolean;
  isWinning: boolean;
  onClick: () => void;
}

const GridCell: React.FC<GridCellProps> = ({ index, isRevealed, isWinning, onClick }) => {
  return (
    <button
      onClick={onClick}
      disabled={isRevealed}
      aria-label={`${index + 1}번 칸 ${isRevealed ? (isWinning ? '당첨' : '꽝') : '열기'}`}
      className={`
        aspect-square flex flex-col items-center justify-center rounded-lg border-2 transition-all duration-200
        ${isRevealed 
          ? 'bg-slate-50 border-slate-200 cursor-default' 
          : 'bg-indigo-50 border-indigo-200 hover:border-indigo-400 hover:bg-indigo-100 hover:shadow-md active:scale-95 shadow-sm'
        }
      `}
    >
      <span className={`text-[10px] md:text-xs font-bold mb-1 ${isRevealed ? 'text-slate-400' : 'text-indigo-600'}`}>
        {index + 1}
      </span>
      <div className="flex items-center justify-center">
        {isRevealed ? (
          isWinning ? (
            <div className="w-4 h-4 rounded-full bg-slate-900 shadow-sm animate-in fade-in zoom-in duration-300" title="당첨" />
          ) : (
            <div className="w-4 h-4 rounded-full border-2 border-slate-300 animate-in fade-in zoom-in duration-300" title="꽝" />
          )
        ) : (
          <div className="w-4 h-4" />
        )}
      </div>
    </button>
  );
};

export default React.memo(GridCell);
