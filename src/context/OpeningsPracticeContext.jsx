import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { Chess } from 'chess.js';
import { getOpeningQuizEntries, normalizeSan } from '../data/openings';

const NOTATION_ROWS = 20;

function emptyNotationRows() {
  return Array.from({ length: NOTATION_ROWS }, () => ({ white: '', black: '' }));
}
import { useMemoryCoordinate } from './MemoryContext';

const OpeningsPracticeContext = createContext(null);

export function useOpeningsPractice() {
  return useContext(OpeningsPracticeContext);
}

function pickRandomEntry(entries) {
  return entries[Math.floor(Math.random() * entries.length)];
}

export function OpeningsPracticeProvider({ children }) {
  const memory = useMemoryCoordinate();
  const entries = useMemo(() => getOpeningQuizEntries(), []);
  const [currentOpening, setCurrentOpening] = useState(() => pickRandomEntry(entries));
  const [moveIndex, setMoveIndex] = useState(0);
  const [notationRows, setNotationRows] = useState(emptyNotationRows);
  const [notationCellStatus, setNotationCellStatus] = useState({});
  const [boardFlash, setBoardFlash] = useState(null);
  const [boardHintRevealed, setBoardHintRevealed] = useState(false);

  useEffect(() => {
    setBoardHintRevealed(false);
  }, [currentOpening, moveIndex]);

  const pickNext = useCallback(() => {
    setCurrentOpening(pickRandomEntry(entries));
    setMoveIndex(0);
    setNotationRows(emptyNotationRows());
    setNotationCellStatus({});
    setBoardHintRevealed(false);
  }, [entries]);

  const setNotationCell = useCallback((rowIndex, color, value) => {
    setNotationRows((prev) => {
      const next = prev.map((row, i) =>
        i === rowIndex ? { ...row, [color]: value } : row
      );
      return next;
    });
  }, []);

  const positionFen = useMemo(() => {
    const game = new Chess();
    const moves = currentOpening?.moves ?? [];
    for (let i = 0; i < moveIndex && i < moves.length; i++) {
      const ok = game.move(moves[i]);
      if (!ok) break;
    }
    return game.fen();
  }, [currentOpening, moveIndex]);

  const handleBoardMove = useCallback(
    (from, to) => {
      const expected = currentOpening?.moves?.[moveIndex];
      if (!expected) return false;
      const game = new Chess(positionFen);
      const move = game.move({ from, to, promotion: 'q' });
      if (!move) return false;
      const playedSan = move.san;
      if (normalizeSan(playedSan) !== normalizeSan(expected)) {
        setBoardFlash({ type: 'wrong', square: to });
        setTimeout(() => setBoardFlash(null), 500);
        return false;
      }
      const nextIndex = moveIndex + 1;
      setMoveIndex(nextIndex);
      if (nextIndex >= (currentOpening?.moves?.length ?? 0)) {
        memory?.reportChallengeCorrect?.();
        setBoardFlash({ type: 'correct', square: to });
        setTimeout(() => {
          setBoardFlash(null);
          pickNext();
        }, 500);
      }
      return true;
    },
    [currentOpening, moveIndex, positionFen, pickNext, memory]
  );

  const handleNotationCellBlur = useCallback(
    (rowIndex, color, value) => {
      const expected = currentOpening?.moves ?? [];
      const moveIndex = rowIndex * 2 + (color === 'white' ? 0 : 1);
      const expectedMove = expected[moveIndex];
      const key = `${rowIndex}-${color}`;
      const trimmed = (value ?? '').trim();
      if (!trimmed) {
        setNotationCellStatus((prev) => {
          const next = { ...prev };
          delete next[key];
          return next;
        });
        return;
      }
      if (expectedMove === undefined) return;
      if (normalizeSan(trimmed) === normalizeSan(expectedMove)) {
        setNotationCellStatus((prev) => ({ ...prev, [key]: 'correct' }));
        if (moveIndex === expected.length - 1) {
          memory?.reportChallengeCorrect?.();
          setTimeout(() => pickNext(), 600);
        }
      } else {
        setNotationCellStatus((prev) => ({ ...prev, [key]: 'wrong' }));
        setTimeout(() => {
          setNotationRows((prev) => {
            const next = prev.map((row, i) =>
              i === rowIndex ? { ...row, [color]: '' } : row
            );
            return next;
          });
          setNotationCellStatus((prev) => {
            const next = { ...prev };
            delete next[key];
            return next;
          });
        }, 400);
      }
    },
    [currentOpening, pickNext, memory]
  );

  const value = {
    currentOpening,
    pickNext,
    moveIndex,
    positionFen,
    handleBoardMove,
    boardFlash,
    boardHintRevealed,
    setBoardHintRevealed,
    notationRows,
    setNotationCell,
    notationCellStatus,
    handleNotationCellBlur,
  };

  return (
    <OpeningsPracticeContext.Provider value={value}>
      {children}
    </OpeningsPracticeContext.Provider>
  );
}
