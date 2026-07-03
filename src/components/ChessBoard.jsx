import { useRef, useCallback } from 'react';
import { Chessboard } from 'react-chessboard';

const CALIENTE_BASE = 'https://raw.githubusercontent.com/lichess-org/lila/master/public/piece/caliente';
const PIECE_CODES = ['wK', 'wQ', 'wR', 'wB', 'wN', 'wP', 'bK', 'bQ', 'bR', 'bB', 'bN', 'bP'];

const calientePieces = Object.fromEntries(
  PIECE_CODES.map((code) => [
    code,
    () => (
      <img
        src={`${CALIENTE_BASE}/${code}.svg`}
        alt=""
        draggable={false}
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
      />
    ),
  ])
);

const DEFAULT_DARK_SQUARE = { backgroundColor: '#779952' };
const DEFAULT_LIGHT_SQUARE = { backgroundColor: '#e8e8e8' };

/**
 * Wrapper around react-chessboard that works with chess.js game.
 * position: FEN string
 * onMove(sourceSquare, targetSquare): return true if move was legal and applied
 * orientation: 'white' | 'black'
 * allowDrag: boolean
 * darkSquareStyle, lightSquareStyle: optional overrides (e.g. both same for all-white board)
 * darkSquareNotationStyle, lightSquareNotationStyle, etc.: optional notation label styles
 */
export function ChessBoard({
  position,
  onMove,
  onSquareClick,
  orientation = 'white',
  allowDrag = true,
  boardWidth,
  lastMove = null,
  highlightSquares = {},
  darkSquareStyle = DEFAULT_DARK_SQUARE,
  lightSquareStyle = DEFAULT_LIGHT_SQUARE,
  darkSquareNotationStyle,
  lightSquareNotationStyle,
  alphaNotationStyle,
  numericNotationStyle,
  showNotation = true,
}) {
  const boardRef = useRef(null);

  const squareStyles = {
    ...highlightSquares,
    ...(lastMove
      ? {
          [lastMove.from]: { backgroundColor: 'rgba(201, 162, 39, 0.4)' },
          [lastMove.to]: { backgroundColor: 'rgba(201, 162, 39, 0.4)' },
        }
      : {}),
  };

  const handlePieceDrop = useCallback(
    ({ sourceSquare, targetSquare }) => {
      if (!onMove) return false;
      return onMove(sourceSquare, targetSquare);
    },
    [onMove]
  );

  const startFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR';
  const boardPosition = !position || position === 'start' ? startFen : position;

  return (
    <div
      className="board-wrapper"
      ref={boardRef}
      style={
        boardWidth
          ? { width: boardWidth, height: boardWidth, maxWidth: '100%', aspectRatio: '1 / 1' }
          : undefined
      }
    >
      <Chessboard
        options={{
          position: boardPosition,
          boardOrientation: orientation,
          allowDragging: allowDrag,
          onPieceDrop: handlePieceDrop,
          onSquareClick,
          pieces: calientePieces,
          boardStyle: { borderRadius: 4 },
          darkSquareStyle,
          lightSquareStyle,
          ...(darkSquareNotationStyle != null && { darkSquareNotationStyle }),
          ...(lightSquareNotationStyle != null && { lightSquareNotationStyle }),
          ...(alphaNotationStyle != null && { alphaNotationStyle }),
          ...(numericNotationStyle != null && { numericNotationStyle }),
          showNotation,
          animationDurationInMs: 200,
          showAnimations: false,
          squareStyles,
        }}
      />
    </div>
  );
}
