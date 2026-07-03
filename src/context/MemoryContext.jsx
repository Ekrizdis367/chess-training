import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';

const FILES = 'abcdefgh';
const RANKS = '12345678';

function randomSquare() {
  const f = FILES[Math.floor(Math.random() * 8)];
  const r = RANKS[Math.floor(Math.random() * 8)];
  return `${f}${r}`;
}

/** Returns 'dark' or 'light' for standard board (a1 = dark). */
function squareColor(square) {
  const file = square.charCodeAt(0) - 97;
  const rank = parseInt(square[1], 10) - 1;
  return (file + rank) % 2 === 0 ? 'dark' : 'light';
}

const MemoryContext = createContext(null);

export function useMemoryCoordinate() {
  const ctx = useContext(MemoryContext);
  return ctx;
}

export function MemoryProvider({ children }) {
  const [coordTarget, setCoordTarget] = useState(randomSquare);
  const [coordHighlight, setCoordHighlight] = useState({});
  const [coordOrientation, setCoordOrientation] = useState('white');

  const [colorTarget, setColorTarget] = useState(randomSquare);
  const [colorHighlight, setColorHighlight] = useState({});
  const [colorRevealed, setColorRevealed] = useState(false);
  const [colorShowHighlight, setColorShowHighlight] = useState(false);
  const [colorShowNotation, setColorShowNotation] = useState(false);

  const [challengeActive, setChallengeActive] = useState(false);
  const [challengeTimeLeft, setChallengeTimeLeft] = useState(0);
  const [challengeScore, setChallengeScore] = useState(0);
  const [challengeTimerOn, setChallengeTimerOn] = useState(false);
  const [challengeDuration, setChallengeDuration] = useState(60);
  const challengeActiveRef = useRef(false);
  const challengeIntervalRef = useRef(null);

  challengeActiveRef.current = challengeActive;

  useEffect(() => {
    if (!challengeActive) return;
    challengeIntervalRef.current = setInterval(() => {
      setChallengeTimeLeft((t) => {
        if (t <= 1) {
          setChallengeActive(false);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      if (challengeIntervalRef.current) clearInterval(challengeIntervalRef.current);
    };
  }, [challengeActive]);

  const challengeStart = useCallback(() => {
    setChallengeActive(true);
    setChallengeTimeLeft(challengeDuration);
    setChallengeScore(0);
  }, [challengeDuration]);

  const challengeStop = useCallback(() => {
    setChallengeActive(false);
  }, []);

  const challengeStopAndReset = useCallback(() => {
    setChallengeActive(false);
    setChallengeTimeLeft(0);
  }, []);

  const reportChallengeCorrect = useCallback(() => {
    if (challengeActiveRef.current) setChallengeScore((s) => s + 1);
  }, []);

  const handleCoordSquareClick = useCallback(({ square }) => {
    setCoordTarget((target) => {
      if (square === target) {
        setCoordHighlight({ [square]: { backgroundColor: 'rgba(0, 200, 0, 0.4)' } });
        if (challengeActiveRef.current) setChallengeScore((s) => s + 1);
      } else {
        setCoordHighlight({ [square]: { backgroundColor: 'rgba(200, 0, 0, 0.4)' } });
      }
      const delay = challengeActiveRef.current ? 300 : 600;
      setTimeout(() => {
        setCoordTarget(randomSquare());
        setCoordHighlight({});
      }, delay);
      return target;
    });
  }, []);

  const handleColorChoice = useCallback((choice) => {
    if (colorRevealed) return;
    setColorRevealed(true);
    const correctColor = squareColor(colorTarget);
    const correct =
      (choice === 'dark' && correctColor === 'dark') ||
      (choice === 'light' && correctColor === 'light');
    if (correct && challengeActiveRef.current) setChallengeScore((s) => s + 1);
    setColorHighlight({
      [colorTarget]: {
        backgroundColor: correct ? 'rgba(0, 200, 0, 0.5)' : 'rgba(200, 0, 0, 0.5)',
      },
    });
    const delay = challengeActiveRef.current ? 300 : 600;
    setTimeout(() => {
      setColorTarget(randomSquare());
      setColorHighlight({});
      setColorRevealed(false);
    }, delay);
  }, [colorTarget, colorRevealed]);

  const value = {
    coordTarget,
    coordHighlight,
    coordOrientation,
    setCoordOrientation,
    handleCoordSquareClick,
    colorTarget,
    colorHighlight,
    colorRevealed,
    colorShowHighlight,
    setColorShowHighlight,
    colorShowNotation,
    setColorShowNotation,
    handleColorChoice,
    challengeActive,
    challengeTimeLeft,
    challengeScore,
    challengeStart,
    challengeStop,
    reportChallengeCorrect,
    challengeTimerOn,
    setChallengeTimerOn,
    challengeStopAndReset,
    challengeDuration,
    setChallengeDuration,
  };

  return (
    <MemoryContext.Provider value={value}>
      {children}
    </MemoryContext.Provider>
  );
}
