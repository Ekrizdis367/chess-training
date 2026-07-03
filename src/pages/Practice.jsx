import { useState, useCallback } from 'react';
import { Chess } from 'chess.js';
import { ChessBoard } from '../components/ChessBoard';

export function Practice() {
  const [game, setGame] = useState(() => new Chess());
  const [lastMove, setLastMove] = useState(null);
  const [message, setMessage] = useState(null);

  const handleMove = useCallback((from, to) => {
    setMessage(null);
    const copy = new Chess(game.fen());
    const move = copy.move({ from, to, promotion: 'q' });
    if (!move) {
      setMessage({ type: 'error', text: 'Illegal move.' });
      return false;
    }
    setGame(copy);
    setLastMove({ from, to });
    if (copy.isGameOver()) {
      if (copy.isCheckmate()) {
        setMessage({ type: 'success', text: `Checkmate! ${copy.turn() === 'w' ? 'Black' : 'White'} wins.` });
      } else if (copy.isStalemate()) {
        setMessage({ type: 'info', text: 'Stalemate. Draw.' });
      } else if (copy.isDraw()) {
        setMessage({ type: 'info', text: 'Draw (fifty moves, repetition, or insufficient material).' });
      }
    } else if (copy.inCheck()) {
      setMessage({ type: 'info', text: 'Check!' });
    }
    return true;
  }, [game]);

  const handleReset = () => {
    setGame(new Chess());
    setLastMove(null);
    setMessage(null);
  };

  const isGameOver = game.isGameOver();

  return (
    <>
      <h1 className="page-heading">Practice</h1>
      <div className="card">
        <p style={{ marginTop: 0, color: 'var(--ink)' }}>
          Make moves on the board. Legal moves only. Play as White; the board is from White’s perspective.
        </p>
        {message && (
          <div className={`message ${message.type}`}>{message.text}</div>
        )}
        <div className="board-container">
          <ChessBoard
            position={game.fen()}
            onMove={handleMove}
            orientation="white"
            allowDrag={!isGameOver}
            lastMove={lastMove}
          />
          <div className="stats-panel card">
            <p><strong>Turn:</strong> {game.turn() === 'w' ? 'White' : 'Black'}</p>
            <p><strong>FEN</strong></p>
            <p style={{ fontSize: '0.75rem', wordBreak: 'break-all' }}>{game.fen()}</p>
            <button type="button" onClick={handleReset} style={{ marginTop: '0.5rem' }}>
              New game
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
