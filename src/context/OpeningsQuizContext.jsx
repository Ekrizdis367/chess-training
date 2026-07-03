import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { getOpeningQuizEntries } from '../data/openings';
import { useMemoryCoordinate } from './MemoryContext';

function formatMoves(moves) {
  const pairs = [];
  let moveNum = 1;
  for (let i = 0; i < moves.length; i += 2) {
    const white = moves[i];
    const black = moves[i + 1] ?? '';
    pairs.push(`${moveNum}. ${white}${black ? ` ${black}` : ''}`);
    moveNum += 1;
  }
  return pairs.join(' ');
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const OpeningsQuizContext = createContext(null);

export function useOpeningsQuiz() {
  return useContext(OpeningsQuizContext);
}

export function OpeningsQuizProvider({ children }) {
  const memory = useMemoryCoordinate();
  const challengeActive = memory?.challengeActive ?? false;
  const entries = useMemo(() => getOpeningQuizEntries(), []);
  const [round, setRound] = useState(0);
  const [message, setMessage] = useState(null);
  const [revealed, setRevealed] = useState(false);

  const current = useMemo(() => {
    const idx = Math.floor(Math.random() * entries.length);
    const correct = entries[idx];
    const others = entries.filter((e) => e.slug !== correct.slug);
    const wrong = shuffle(others).slice(0, 3).map((e) => e.name);
    const options = shuffle([correct.name, ...wrong]);
    return { correct, options, moveText: formatMoves(correct.moves) };
  }, [entries, round]);

  const handleChoice = useCallback(
    (chosen) => {
      if (revealed) return;
      setRevealed(true);
      const correct = chosen === current.correct.name;
      setMessage({
        type: correct ? 'correct' : 'wrong',
        chosen,
      });
      const delay = challengeActive ? 500 : 1800;
      setTimeout(() => {
        setRound((r) => r + 1);
        setMessage(null);
        setRevealed(false);
      }, delay);
    },
    [current, revealed, challengeActive]
  );

  const value = { current, message, revealed, handleChoice };

  return (
    <OpeningsQuizContext.Provider value={value}>
      {children}
    </OpeningsQuizContext.Provider>
  );
}
