import { createContext, useContext, useRef, useCallback, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Chess } from 'chess.js';
import { endgameCategories } from '../data/endgames';
import { parsePieces, generateRandomPosition } from '../utils/endgamePosition';
import { useStockfish } from './StockfishContext';

const EndgameContext = createContext(null);

export function useEndgame() {
  return useContext(EndgameContext);
}

const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

/** Parse UCI move (e.g. "e7e8q") to { from, to, promotion }. */
function uciToMove(uci) {
  if (!uci || uci.length < 4) return null;
  const from = uci.slice(0, 2);
  const to = uci.slice(2, 4);
  const promotion = uci[4] && 'qrbn'.includes(uci[4]) ? uci[4] : undefined;
  return { from, to, promotion };
}

export function EndgameProvider({ children }) {
  const { slug } = useParams();
  const stockfish = useStockfish();
  const gameRef = useRef(null);

  const [positionFen, setPositionFen] = useState(START_FEN);
  const [lastMove, setLastMove] = useState(null);
  const [gameOver, setGameOver] = useState(null);
  const [isEngineThinking, setIsEngineThinking] = useState(false);
  const [moves, setMoves] = useState([]);

  const category = slug ? endgameCategories.find((c) => c.slug === slug && !c.divider && c.pieces) : null;
  const hasActiveEndgame = !!category;

  const setGameFromFen = useCallback((fen) => {
    gameRef.current = new Chess(fen);
    setPositionFen(fen);
    setLastMove(null);
    setGameOver(null);
    setMoves([]);
  }, []);

  const checkGameOver = useCallback((game) => {
    if (game.isCheckmate()) return { result: 'checkmate', winner: game.turn() === 'w' ? 'black' : 'white' };
    if (game.isStalemate() || game.isDraw()) return { result: 'draw' };
    return null;
  }, []);

  const applyEngineMove = useCallback(() => {
    const game = gameRef.current;
    if (!game || game.turn() !== 'b') return;

    const playEngine = async () => {
      setIsEngineThinking(true);
      try {
        if (!stockfish.isReady) await stockfish.init();
        stockfish.setPosition(game.fen());
        const uci = await stockfish.go(16);
        const move = uciToMove(uci);
        if (move) {
          const applied = game.move(move);
          if (applied) {
            setPositionFen(game.fen());
            setLastMove({ from: move.from, to: move.to });
            setMoves((prev) => [...prev, { san: applied.san, color: 'black' }]);
            const over = checkGameOver(game);
            if (over) setGameOver(over);
          }
        }
      } catch (_) {
        // ignore engine errors
      } finally {
        setIsEngineThinking(false);
      }
    };
    playEngine();
  }, [stockfish, checkGameOver]);

  const onMove = useCallback(
    (sourceSquare, targetSquare) => {
      const game = gameRef.current;
      if (!game || gameOver) return false;
      if (game.turn() !== 'w') return false;

      const move = game.move({ from: sourceSquare, to: targetSquare });
      if (!move) return false;

      setLastMove({ from: sourceSquare, to: targetSquare });
      setPositionFen(game.fen());
      setMoves((prev) => [...prev, { san: move.san, color: 'white' }]);
      const over = checkGameOver(game);
      if (over) {
        setGameOver(over);
        return true;
      }
      applyEngineMove();
      return true;
    },
    [gameOver, checkGameOver, applyEngineMove]
  );

  const newPosition = useCallback(() => {
    if (!category?.pieces) return;
    const pieceConfig = parsePieces(category.pieces);
    const fen = generateRandomPosition(pieceConfig);
    if (fen) setGameFromFen(fen);
  }, [category, setGameFromFen]);

  useEffect(() => {
    if (!category?.pieces) {
      setPositionFen(START_FEN);
      gameRef.current = new Chess(START_FEN);
      setLastMove(null);
      setGameOver(null);
      setMoves([]);
      return;
    }
    const pieceConfig = parsePieces(category.pieces);
    const fen = generateRandomPosition(pieceConfig);
    if (fen) setGameFromFen(fen);
  }, [slug, category?.pieces, setGameFromFen]);

  const value = {
    positionFen: hasActiveEndgame ? positionFen : START_FEN,
    lastMove: hasActiveEndgame ? lastMove : null,
    gameOver: hasActiveEndgame ? gameOver : null,
    isEngineThinking,
    moves: hasActiveEndgame ? moves : [],
    allowDrag: hasActiveEndgame && !gameOver && !isEngineThinking,
    onMove: hasActiveEndgame ? onMove : undefined,
    newPosition: hasActiveEndgame ? newPosition : undefined,
    hasActiveEndgame,
  };

  return <EndgameContext.Provider value={value}>{children}</EndgameContext.Provider>;
}
