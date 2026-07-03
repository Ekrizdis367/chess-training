import { useState, useEffect, useRef, useMemo } from 'react';
import { NavLink, Outlet, useParams } from 'react-router-dom';
import { Chess } from 'chess.js';
import { ChessBoard } from './ChessBoard';
import { endgameCategories } from '../data/endgames';
import { EndgameProvider, useEndgame } from '../context/EndgameContext';

const HELP_MOVE_INTERVAL_MS = 1800;
const HELP_LOOP_PAUSE_MS = 2500;

/** Build FEN list from start FEN and SAN move list (stops on first illegal move). */
function buildHelpFenSequence(helpFen, moveList) {
  if (!helpFen || !moveList?.length) return [helpFen];
  const out = [helpFen];
  const game = new Chess(helpFen);
  for (const san of moveList) {
    try {
      if (game.move(san)) out.push(game.fen());
      else break;
    } catch {
      break;
    }
  }
  return out;
}

/** Group moves into rows: [{ num, white, black }, ...] for 3-column display. */
function getHelpMoveRows(moveList) {
  if (!moveList?.length) return [];
  const rows = [];
  for (let i = 0, num = 1; i < moveList.length; i += 2, num += 1) {
    rows.push({
      num,
      white: moveList[i] ?? '',
      black: moveList[i + 1] ?? '',
    });
  }
  return rows;
}

const CALIENTE_PIECES_BASE = 'https://raw.githubusercontent.com/lichess-org/lila/master/public/piece/caliente';

function EndgamePieceIcon({ piece }) {
  return (
    <span className="endgame-piece-icon" aria-hidden>
      <img
        src={`${CALIENTE_PIECES_BASE}/${piece}.svg`}
        alt=""
        width={24}
        height={24}
        loading="lazy"
      />
    </span>
  );
}

function EndgamesBoard() {
  const { positionFen, onMove, allowDrag, lastMove, isEngineThinking } = useEndgame();
  return (
    <div className="endgames-board-wrap">
      {isEngineThinking && (
        <div className="endgames-engine-thinking" aria-live="polite">
          Stockfish thinking…
        </div>
      )}
      <ChessBoard
        position={positionFen}
        onMove={onMove}
        allowDrag={allowDrag}
        lastMove={lastMove}
        boardWidth={760}
      />
    </div>
  );
}

/** Group game moves into rows { num, white, black } — same shape as Openings getMoveRows. */
function getAnnotationRows(moves) {
  if (!moves?.length) return [];
  const rows = [];
  let num = 1;
  let white = '';
  let black = '';
  for (const { san, color } of moves) {
    if (color === 'white') {
      white = san;
    } else {
      black = san;
      rows.push({ num, white, black });
      num += 1;
      white = '';
      black = '';
    }
  }
  if (white) rows.push({ num, white, black });
  return rows;
}

function EndgameAnnotations() {
  const { moves, hasActiveEndgame } = useEndgame();
  if (!hasActiveEndgame || moves.length === 0) {
    return <div className="openings-annotation-content" />;
  }
  const moveRows = getAnnotationRows(moves);
  return (
    <div className="openings-annotation-content" aria-label="Move list">
      {moveRows.map((row) => (
        <div key={row.num} className="openings-move-row">
          <span className="openings-move-num">{row.num}</span>
          <span className="openings-move-white-cell">{row.white}</span>
          <span className="openings-move-black-cell">{row.black ?? ''}</span>
        </div>
      ))}
    </div>
  );
}

function EndgameResultAbove() {
  const { gameOver, hasActiveEndgame } = useEndgame();
  if (!hasActiveEndgame || !gameOver) return null;
  const text =
    gameOver.result === 'checkmate' && gameOver.winner === 'white'
      ? 'You won!'
      : gameOver.result === 'checkmate' && gameOver.winner === 'black'
        ? 'Stockfish won.'
        : gameOver.result === 'draw'
          ? 'Draw!'
          : null;
  if (!text) return null;
  return (
    <div className="endgame-result-above" role="status">
      {text}
    </div>
  );
}

function EndgameHelpModal({ isOpen, onClose, category }) {
  const [step, setStep] = useState(0);
  const fensRef = useRef([]);
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  // When modal opens for this category: build FEN list once and start auto-advance.
  useEffect(() => {
    if (!isOpen || !category?.helpFen || !category?.helpMovesSequence?.length) {
      return;
    }
    const fens = buildHelpFenSequence(category.helpFen, category.helpMovesSequence);
    fensRef.current = fens;
    setStep(0);

    if (fens.length <= 1) return;

    const advance = () => {
      setStep((prev) => {
        const len = fensRef.current.length;
        if (prev >= len - 1) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          timeoutRef.current = setTimeout(() => {
            setStep(0);
            intervalRef.current = setInterval(advance, HELP_MOVE_INTERVAL_MS);
          }, HELP_LOOP_PAUSE_MS);
          return prev;
        }
        return prev + 1;
      });
    };

    intervalRef.current = setInterval(advance, HELP_MOVE_INTERVAL_MS);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      intervalRef.current = null;
      timeoutRef.current = null;
      fensRef.current = [];
    };
  }, [isOpen, category?.slug]);

  if (!isOpen || !category?.helpMovesSequence?.length) return null;

  // Ensure FEN list is built on first render so board isn’t blank before effect runs
  if (fensRef.current.length === 0 && category.helpFen && category.helpMovesSequence?.length) {
    fensRef.current = buildHelpFenSequence(category.helpFen, category.helpMovesSequence);
  }
  const fens = fensRef.current.length > 0 ? fensRef.current : [category.helpFen];
  const safeStep = Math.min(Math.max(0, step), fens.length - 1);
  const fen = fens[safeStep] || 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

  return (
    <div className="endgame-help-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="endgame-help-title">
      <div className="endgame-help-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="endgame-help-head">
          <h2 id="endgame-help-title" className="endgame-help-title">Checkmate guide: {category.name}</h2>
          <button type="button" className="endgame-help-close" onClick={onClose} aria-label="Close">×</button>
        </div>
        <div className="endgame-help-board">
          <ChessBoard position={fen} allowDrag={false} boardWidth={280} showNotation={false} />
        </div>
        {fens.length > 1 && (
          <p className="endgame-help-play-label" aria-live="polite">
            Position {safeStep + 1} of {fens.length}
          </p>
        )}
        <div className="memory-annotation-content endgame-help-moves-wrap" aria-label="Move list">
          <div className="openings-annotation-content">
            {getHelpMoveRows(category.helpMovesSequence).map(({ num, white, black }) => (
              <div key={num} className="openings-move-row">
                <span className="openings-move-num">{num}</span>
                <span className="openings-move-white-cell">{white}</span>
                <span className="openings-move-black-cell">{black}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function EndgameAnnotationActions() {
  const { newPosition, hasActiveEndgame } = useEndgame();
  const { slug } = useParams();
  const [helpOpen, setHelpOpen] = useState(false);
  const category = slug ? endgameCategories.find((c) => c.slug === slug && !c.divider) : null;

  if (!hasActiveEndgame) return null;
  return (
    <>
      <div className="memory-annotation-actions">
        <button type="button" className="memory-action-btn" onClick={newPosition}>
          New
        </button>
        <button type="button" className="memory-action-btn" onClick={() => setHelpOpen(true)} disabled={!category?.helpMovesSequence?.length}>
          Help
        </button>
      </div>
      <EndgameHelpModal isOpen={helpOpen} onClose={() => setHelpOpen(false)} category={category} />
    </>
  );
}

export function EndgamesLayout() {
  return (
    <EndgameProvider>
      <div className="endgames-body">
        <div className="endgames-main">
          <aside className="endgames-left-panel">
            <div className="endgames-panel-head">
              <h2 className="endgames-panel-title">Endgames</h2>
            </div>
            <nav className="endgames-nav" aria-label="Endgames">
              <ul className="endgames-nav-list">
                {endgameCategories.map((item, index) =>
                  item.divider ? (
                    <li key={`divider-${index}`} className="endgames-nav-divider-wrap" aria-hidden>
                      <hr className="endgames-nav-divider" />
                    </li>
                  ) : (
                    <li key={item.slug}>
                      <NavLink to={`/endgames/${item.slug}`} className="endgames-nav-item" aria-label={item.name}>
                        <span className="endgames-nav-item-icons">
                          {item.iconPiece ? (
                            <EndgamePieceIcon piece={item.iconPiece} />
                          ) : (
                            <span className="endgame-piece-icon endgame-piece-icon-placeholder" aria-hidden />
                          )}
                        </span>
                        <span className="endgames-nav-item-label">{item.name}</span>
                      </NavLink>
                    </li>
                  )
                )}
              </ul>
            </nav>
          </aside>
          <EndgamesBoard />
          <aside className="endgames-right-panel">
            <div className="endgames-panel-head">
              <h2 className="endgames-panel-title">Annotations</h2>
            </div>
            <div className="memory-annotation-content">
              <EndgameAnnotations />
            </div>
            <EndgameResultAbove />
            <EndgameAnnotationActions />
          </aside>
        </div>
        <div className="endgames-content">
          <hr className="section-notes-line" aria-hidden />
          <Outlet />
          <div className="section-notes-box">
            <div className="section-notes-content">
            </div>
          </div>
        </div>
      </div>
    </EndgameProvider>
  );
}
