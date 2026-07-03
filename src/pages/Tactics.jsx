import { useState, useCallback } from 'react';
import { Chess } from 'chess.js';
import { ChessBoard } from '../components/ChessBoard';
import { TACTICS_PUZZLES } from '../data/puzzles';

function squareToUci(from, to) {
  return from + to;
}

export function Tactics() {
  const [index, setIndex] = useState(0);
  const [game, setGame] = useState(() => new Chess(TACTICS_PUZZLES[0].fen));
  const [solutionIndex, setSolutionIndex] = useState(0);
  const [message, setMessage] = useState(null);
  const [lastMove, setLastMove] = useState(null);
  const [showHint, setShowHint] = useState(false);

  const puzzle = TACTICS_PUZZLES[index];
  const solution = puzzle.solution;
  const isPlayerTurn = solutionIndex < solution.length;
  const nextExpectedUci = solution[solutionIndex];

  const loadPuzzle = useCallback((i) => {
    const p = TACTICS_PUZZLES[i];
    setIndex(i);
    setGame(new Chess(p.fen));
    setSolutionIndex(0);
    setMessage(null);
    setLastMove(null);
    setShowHint(false);
  }, []);

  const handleMove = useCallback(
    (from, to) => {
      setMessage(null);
      const uci = squareToUci(from, to);
      const expected = nextExpectedUci;

      if (uci !== expected) {
        setMessage({ type: 'error', text: 'Not the right move. Try again or request a hint.' });
        return false;
      }

      const move = game.move({ from, to, promotion: 'q' });
      if (!move) return false;

      setGame(new Chess(game.fen()));
      setLastMove({ from, to });
      setSolutionIndex((prev) => prev + 1);

      if (solutionIndex + 1 >= solution.length) {
        setMessage({ type: 'success', text: 'Correct! Puzzle solved.' });
      } else {
        setMessage({ type: 'info', text: 'Good move! Now play the next move.' });
      }
      return true;
    },
    [game, nextExpectedUci, solution, solutionIndex]
  );

  const handleNext = () => {
    loadPuzzle((index + 1) % TACTICS_PUZZLES.length);
  };

  const handleReset = () => {
    loadPuzzle(index);
  };

  const puzzleSolved = solutionIndex >= solution.length;

  return (
    <>
      <h1 className="page-heading">Tactics</h1>
      <div className="card">
        <p style={{ marginTop: 0, color: 'var(--ink)' }}>
          Puzzle {index + 1} of {TACTICS_PUZZLES.length}. Find the best move(s).
        </p>
        {message && (
          <div className={`message ${message.type}`}>{message.text}</div>
        )}
        {showHint && puzzle.hint && (
          <div className="message info">Hint: {puzzle.hint}</div>
        )}
        <div className="board-container">
          <ChessBoard
            position={game.fen()}
            onMove={handleMove}
            orientation="white"
            allowDrag={isPlayerTurn && !puzzleSolved}
            lastMove={lastMove}
          />
          <div className="stats-panel card">
            <p><strong>Puzzle {index + 1}</strong></p>
            <p>Moves played: {solutionIndex} / {solution.length}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem' }}>
              <button type="button" onClick={handleReset}>Reset</button>
              <button type="button" onClick={() => setShowHint(true)} disabled={!puzzle.hint}>
                Hint
              </button>
              <button type="button" onClick={handleNext}>
                Next puzzle
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
