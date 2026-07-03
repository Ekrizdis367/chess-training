import { useMemo, useRef } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Chess } from 'chess.js';
import { ChessBoard } from './ChessBoard';
import { MemoryProvider, useMemoryCoordinate } from '../context/MemoryContext';
import { OpeningsQuizProvider, useOpeningsQuiz } from '../context/OpeningsQuizContext';
import { OpeningsPracticeProvider, useOpeningsPractice } from '../context/OpeningsPracticeContext';

const EMPTY_BOARD_FEN = '8/8/8/8/8/8/8/8 w - - 0 1';
const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
/** Squares board: one white king on e1 (white's side), one black king on e8 (black's side). */
const SQUARES_BOARD_FEN = '4k3/8/8/8/8/8/8/4K3 w - - 0 1';

const MEMORY_EXERCISES = [
  { slug: 'coordinates', label: 'Squares', path: '/memory/coordinates' },
  { slug: 'color', label: 'Colors', path: '/memory/color' },
  { slug: 'openings', label: 'Openings', path: '/memory/openings' },
  { slug: 'openings-board', label: 'Openings (Board)', path: '/memory/openings-board' },
  { slug: 'openings-notation', label: 'Openings (Notation)', path: '/memory/openings-notation' },
];

const ALL_GREY_SQUARE = { backgroundColor: '#a0a0a0' };
const CALIENTE_PIECES_BASE = 'https://raw.githubusercontent.com/lichess-org/lila/master/public/piece/caliente';

function ClockIcon() {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  );
}

/** One row per move number: { num, white, black? }. */
function getMoveRows(history) {
  if (!history || history.length === 0) return [];
  const rows = [];
  let moveNum = 1;
  for (let i = 0; i < history.length; i += 2) {
    const white = history[i];
    const black = history[i + 1] ?? null;
    rows.push({ num: moveNum, white, black });
    moveNum += 1;
  }
  return rows;
}

function MemoryBoard() {
  const location = useLocation();
  const isCoordinates = location.pathname === '/memory/coordinates';
  const isColor = location.pathname === '/memory/color';
  const isOpenings = location.pathname === '/memory/openings';
  const isOpeningsBoard = location.pathname === '/memory/openings-board';
  const isOpeningsNotation = location.pathname === '/memory/openings-notation';
  const coord = useMemoryCoordinate();
  const quiz = useOpeningsQuiz();
  const practice = useOpeningsPractice();

  const openingsFen = useMemo(() => {
    if (!quiz?.current?.correct?.moves?.length) return EMPTY_BOARD_FEN;
    const game = new Chess();
    for (const san of quiz.current.correct.moves) {
      try {
        game.move(san);
      } catch (_) {
        break;
      }
    }
    return game.fen();
  }, [quiz?.current]);

  const notationFen = useMemo(() => {
    if (!practice?.notationRows?.length) return START_FEN;
    const game = new Chess(START_FEN);
    for (let i = 0; i < practice.notationRows.length; i++) {
      const w = practice.notationRows[i].white.trim();
      const b = practice.notationRows[i].black.trim();
      if (w) {
        try {
          game.move(w);
        } catch {
          break;
        }
      }
      if (b) {
        try {
          game.move(b);
        } catch {
          break;
        }
      }
    }
    return game.fen();
  }, [practice?.notationRows]);

  if (isCoordinates && coord) {
    return (
      <ChessBoard
        position={SQUARES_BOARD_FEN}
        allowDrag={false}
        onSquareClick={coord.handleCoordSquareClick}
        boardWidth={760}
        highlightSquares={coord.coordHighlight}
        showNotation={false}
        orientation={coord.coordOrientation ?? 'white'}
      />
    );
  }

  if (isColor && coord) {
    const blackNotation = { color: '#000' };
    const hasFlash = coord.colorHighlight && Object.keys(coord.colorHighlight).length > 0;
    const highlightSquares = hasFlash
      ? coord.colorHighlight
      : coord.colorShowHighlight && coord.colorTarget
        ? { [coord.colorTarget]: { backgroundColor: 'rgba(255, 200, 0, 0.5)' } }
        : {};
    return (
      <ChessBoard
        position={EMPTY_BOARD_FEN}
        allowDrag={false}
        boardWidth={760}
        darkSquareStyle={ALL_GREY_SQUARE}
        lightSquareStyle={ALL_GREY_SQUARE}
        darkSquareNotationStyle={blackNotation}
        lightSquareNotationStyle={blackNotation}
        alphaNotationStyle={blackNotation}
        numericNotationStyle={blackNotation}
        highlightSquares={highlightSquares}
        showNotation={coord.colorShowNotation ?? false}
      />
    );
  }

  if (isOpenings && quiz) {
    return (
      <ChessBoard
        position={openingsFen}
        allowDrag={false}
        boardWidth={760}
      />
    );
  }

  if (isOpeningsBoard && practice) {
    const highlightSquares =
      practice.boardFlash?.square != null
        ? {
            [practice.boardFlash.square]: {
              backgroundColor:
                practice.boardFlash.type === 'correct'
                  ? 'rgba(0, 200, 0, 0.5)'
                  : 'rgba(200, 0, 0, 0.5)',
            },
          }
        : {};
    return (
      <ChessBoard
        position={practice.positionFen}
        onMove={practice.handleBoardMove}
        allowDrag
        boardWidth={760}
        highlightSquares={highlightSquares}
      />
    );
  }

  if (isOpeningsNotation && practice) {
    return (
      <ChessBoard
        position={notationFen}
        allowDrag={false}
        boardWidth={760}
      />
    );
  }

  return (
    <ChessBoard position={EMPTY_BOARD_FEN} allowDrag={false} boardWidth={760} />
  );
}

function MemoryAnnotationContent() {
  const location = useLocation();
  const ctx = useMemoryCoordinate();
  const quiz = useOpeningsQuiz();
  const practice = useOpeningsPractice();
  const firstNotationInputRef = useRef(null);

  const hideUntilStart = ctx?.challengeTimerOn && !ctx?.challengeActive;

  if (location.pathname === '/memory/coordinates' && ctx) {
    if (hideUntilStart) {
      return (
        <div className="memory-challenge-wait">
          <p>Click Start to begin</p>
        </div>
      );
    }
    return (
      <div className="memory-coord-prompt">
        <p className="memory-coord-target" aria-live="polite">{ctx.coordTarget}</p>
      </div>
    );
  }

  if (location.pathname === '/memory/color' && ctx) {
    if (hideUntilStart) {
      return (
        <div className="memory-challenge-wait">
          <p>Click Start to begin</p>
        </div>
      );
    }
    return (
      <div className="memory-color-prompt">
        <p className="memory-coord-target" aria-live="polite">{ctx.colorTarget}</p>
        <div className="memory-color-buttons">
          <button
            type="button"
            className="memory-choice-btn"
            onClick={() => ctx.handleColorChoice('dark')}
            disabled={ctx.colorRevealed}
          >
            Black
          </button>
          <button
            type="button"
            className="memory-choice-btn"
            onClick={() => ctx.handleColorChoice('light')}
            disabled={ctx.colorRevealed}
          >
            White
          </button>
        </div>
      </div>
    );
  }

  if (location.pathname === '/memory/openings' && quiz) {
    if (hideUntilStart) {
      return (
        <div className="memory-challenge-wait">
          <p>Click Start to begin</p>
        </div>
      );
    }
    const moveRows = getMoveRows(quiz.current.correct.moves);
    return (
      <div className="openings-annotation-content">
        {moveRows.length > 0 &&
          moveRows.map((row) => (
            <div key={row.num} className="openings-move-row">
              <span className="openings-move-num">{row.num}</span>
              <span className="openings-move-white-cell">{row.white}</span>
              <span className="openings-move-black-cell">
                {row.black != null ? row.black : ''}
              </span>
            </div>
          ))}
      </div>
    );
  }

  if ((location.pathname === '/memory/openings-board' || location.pathname === '/memory/openings-notation') && practice) {
    if (hideUntilStart) {
      return (
        <div className="memory-challenge-wait">
          <p>Click Start to begin</p>
        </div>
      );
    }
    const openingName = practice.currentOpening?.name ?? '';
    if (location.pathname === '/memory/openings-board') {
      const moves = practice.currentOpening?.moves ?? [];
      const playedMoves = moves.slice(0, practice.moveIndex);
      const moveRows = getMoveRows(playedMoves);
      const nextMove = practice.moveIndex < moves.length ? moves[practice.moveIndex] : null;
      return (
        <div className="openings-annotation-content">
          {moveRows.length > 0 && (
            <div className="memory-openings-board-notation-box">
              {moveRows.map((row) => (
                <div key={row.num} className="openings-move-row">
                  <span className="openings-move-num">{row.num}</span>
                  <span className="openings-move-white-cell">{row.white}</span>
                  <span className="openings-move-black-cell">
                    {row.black != null ? row.black : ''}
                  </span>
                </div>
              ))}
            </div>
          )}
          {practice.boardHintRevealed && nextMove && (
            <p className="memory-openings-hint-text">Next: {nextMove}</p>
          )}
        </div>
      );
    }
    const moveCount = practice.currentOpening?.moves?.length ?? 0;
    const notationRowCount = Math.max(1, Math.ceil(moveCount / 2));
    const rowsToShow = practice.notationRows.slice(0, notationRowCount);
    return (
      <div className="memory-openings-practice-prompt">
        <p className="memory-openings-practice-title">{openingName}</p>
        <div className="openings-annotation-content memory-openings-notation-grid">
          {rowsToShow.map((row, i) => (
            <div key={i} className="openings-move-row memory-openings-notation-row">
              <span className="openings-move-num">{i + 1}</span>
              <span className="openings-move-white-cell">
                <input
                  ref={i === 0 ? firstNotationInputRef : undefined}
                  type="text"
                  className={`memory-openings-notation-cell${practice.notationCellStatus[`${i}-white`] === 'correct' ? ' memory-openings-notation-cell-correct' : ''}${practice.notationCellStatus[`${i}-white`] === 'wrong' ? ' memory-openings-notation-cell-wrong' : ''}`}
                  value={row.white}
                  onChange={(e) => practice.setNotationCell(i, 'white', e.target.value)}
                  onBlur={(e) => practice.handleNotationCellBlur(i, 'white', e.target.value)}
                  maxLength={4}
                  size={4}
                  aria-label={`Move ${i + 1} White`}
                />
              </span>
              <span className="openings-move-black-cell">
                <input
                  type="text"
                  className={`memory-openings-notation-cell${practice.notationCellStatus[`${i}-black`] === 'correct' ? ' memory-openings-notation-cell-correct' : ''}${practice.notationCellStatus[`${i}-black`] === 'wrong' ? ' memory-openings-notation-cell-wrong' : ''}`}
                  value={row.black}
                  onChange={(e) => practice.setNotationCell(i, 'black', e.target.value)}
                  onBlur={(e) => practice.handleNotationCellBlur(i, 'black', e.target.value)}
                  onKeyDown={
                    i === notationRowCount - 1
                      ? (e) => {
                          if (e.key === 'Tab' && !e.shiftKey) {
                            e.preventDefault();
                            firstNotationInputRef.current?.focus();
                          }
                        }
                      : undefined
                  }
                  maxLength={4}
                  size={4}
                  aria-label={`Move ${i + 1} Black`}
                />
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}

function MemoryAnnotationActions() {
  const location = useLocation();
  const ctx = useMemoryCoordinate();
  const quiz = useOpeningsQuiz();
  const practice = useOpeningsPractice();

  if (location.pathname === '/memory/openings-notation' && practice) {
    return null;
  }

  if (location.pathname === '/memory/openings-board' && practice) {
    const moves = practice.currentOpening?.moves ?? [];
    const nextMove = practice.moveIndex < moves.length ? moves[practice.moveIndex] : null;
    return (
      <div className="memory-annotation-actions">
        <button
          type="button"
          className="memory-action-btn"
          onClick={() => practice.setBoardHintRevealed(true)}
          disabled={!nextMove || practice.boardHintRevealed}
          aria-label="Show next move"
        >
          Hint
        </button>
      </div>
    );
  }

  if (location.pathname === '/memory/coordinates' && ctx) {
    const orientation = ctx.coordOrientation ?? 'white';
    return (
      <div className="memory-annotation-actions memory-orientation-toggle">
        <button
          type="button"
          className={`openings-filter-btn openings-filter-btn-pawn ${orientation === 'white' ? 'active' : ''}`}
          onClick={() => ctx.setCoordOrientation?.('white')}
          aria-pressed={orientation === 'white'}
          aria-label="View from White’s side"
          title="View from White’s side"
        >
          <img src={`${CALIENTE_PIECES_BASE}/wP.svg`} alt="" width={20} height={20} />
        </button>
        <button
          type="button"
          className={`openings-filter-btn openings-filter-btn-pawn ${orientation === 'black' ? 'active' : ''}`}
          onClick={() => ctx.setCoordOrientation?.('black')}
          aria-pressed={orientation === 'black'}
          aria-label="View from Black’s side"
          title="View from Black’s side"
        >
          <img src={`${CALIENTE_PIECES_BASE}/bP.svg`} alt="" width={20} height={20} />
        </button>
      </div>
    );
  }

  if (location.pathname === '/memory/openings' && quiz) {
    if (ctx?.challengeTimerOn && !ctx?.challengeActive) return null;
    const { current, message, revealed, handleChoice } = quiz;
    return (
      <div className="memory-annotation-actions memory-openings-actions">
        <div className="memory-openings-buttons">
          {current.options.map((name) => {
            const isChosen = revealed && message?.chosen === name;
            const resultClass = isChosen && message ? `memory-choice-btn-${message.type}` : '';
            return (
              <button
                key={name}
                type="button"
                className={`memory-choice-btn ${resultClass}`.trim()}
                onClick={() => {
                  handleChoice(name);
                  if (name === current.correct.name) ctx.reportChallengeCorrect?.();
                }}
                disabled={revealed}
              >
                {name}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (location.pathname !== '/memory/color' || !ctx) return null;

  const showHighlightOn = ctx.colorShowHighlight ?? false;
  const showNotationOn = ctx.colorShowNotation ?? false;
  return (
    <div className="memory-annotation-actions">
      <button
        type="button"
        className={`memory-action-btn ${showHighlightOn ? 'active' : ''}`}
        onClick={() => ctx.setColorShowHighlight?.(!showHighlightOn)}
        aria-pressed={showHighlightOn}
        aria-label={showHighlightOn ? 'Hide Square highlight' : 'Show Square on board'}
      >
        Square
      </button>
      <button
        type="button"
        className={`memory-action-btn ${showNotationOn ? 'active' : ''}`}
        onClick={() => ctx.setColorShowNotation?.(!showNotationOn)}
        aria-pressed={showNotationOn}
        aria-label={showNotationOn ? 'Hide coordinates' : 'Show coordinates'}
      >
        Coordinates
      </button>
    </div>
  );
}

function MemoryChallengeSection() {
  const location = useLocation();
  const ctx = useMemoryCoordinate();
  const isExercise =
    location.pathname === '/memory/coordinates' ||
    location.pathname === '/memory/color' ||
    location.pathname === '/memory/openings' ||
    location.pathname === '/memory/openings-board' ||
    location.pathname === '/memory/openings-notation';
  if (!isExercise || !ctx) return null;
  const {
    challengeActive,
    challengeTimeLeft,
    challengeScore,
    challengeStart,
    challengeStop,
    challengeTimerOn,
    setChallengeTimerOn,
    challengeStopAndReset,
    challengeDuration,
    setChallengeDuration,
  } = ctx;
  const displaySeconds = challengeActive ? challengeTimeLeft : challengeDuration;
  const minutes = Math.floor(displaySeconds / 60);
  const seconds = displaySeconds % 60;
  const timeStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  const handleTimerToggle = () => {
    if (challengeTimerOn) {
      challengeStopAndReset?.();
      setChallengeTimerOn?.(false);
    } else {
      setChallengeTimerOn?.(true);
      challengeStopAndReset?.();
    }
  };
  const handleStartClick = () => {
    if (challengeActive) challengeStop?.();
    else challengeStart?.();
  };
  const durations = [
    { seconds: 60, label: '1' },
    { seconds: 120, label: '2' },
    { seconds: 300, label: '5' },
  ];
  return (
    <div className="memory-challenge-wrap">
      <div className="memory-challenge-score">
        <span className="memory-challenge-score-label">Score</span>
        <span className="memory-challenge-score-value">{challengeScore}</span>
      </div>
      <div className="memory-challenge">
        <div className="memory-challenge-timer" aria-live="polite">
          {timeStr}
        </div>
        <button
          type="button"
          className="memory-challenge-start"
          onClick={handleStartClick}
          disabled={!challengeTimerOn}
        >
          {challengeActive ? 'Stop' : 'Start'}
        </button>
        <div className="memory-challenge-row">
          {durations.map(({ seconds: s, label }) => (
            <button
              key={s}
              type="button"
              className={`openings-filter-btn memory-challenge-duration-btn ${challengeDuration === s ? 'active' : ''}`}
              onClick={() => setChallengeDuration?.(s)}
              disabled={challengeActive}
              aria-pressed={challengeDuration === s}
              aria-label={`${label} minute${label !== '1' ? 's' : ''}`}
              title={`${label} min`}
            >
              {label}
            </button>
          ))}
          <button
            type="button"
            className={`openings-filter-btn openings-filter-btn-pawn memory-challenge-toggle ${challengeTimerOn ? 'active' : ''}`}
            onClick={handleTimerToggle}
            aria-pressed={challengeTimerOn}
            aria-label={challengeTimerOn ? 'Timer on – click to turn off and stop' : 'Timer off – click to turn on'}
            title={challengeTimerOn ? 'Timer on' : 'Timer off'}
          >
            <ClockIcon />
          </button>
        </div>
      </div>
    </div>
  );
}

function MemoryNotesContent() {
  const location = useLocation();
  const practice = useOpeningsPractice();

  if (location.pathname === '/memory/coordinates') {
    return (
      <p>Click the square shown in the annotations panel on the board.</p>
    );
  }

  if (location.pathname === '/memory/color') {
    return (
      <p>Is the square shown in the annotations panel a black or white square?</p>
    );
  }

  if (location.pathname === '/memory/openings') {
    return <p>Which opening is this?</p>;
  }

  if (location.pathname === '/memory/openings-board') {
    const openingName = practice?.currentOpening?.name ?? '';
    return (
      <>
        {openingName && <p className="section-notes-opening-name">{openingName}</p>}
        <p>Play the given opening by making the moves on the board.</p>
      </>
    );
  }

  if (location.pathname === '/memory/openings-notation') {
    return <p>Enter the move sequence for the given opening in standard notation.</p>;
  }

  return null;
}

export function MemoryLayout() {
  const location = useLocation();
  const showAnnotationsTitle =
    location.pathname === '/memory/openings' ||
    location.pathname === '/memory/openings-board' ||
    location.pathname === '/memory/openings-notation';

  return (
    <MemoryProvider>
      <OpeningsQuizProvider>
      <OpeningsPracticeProvider>
      <div className="memory-body">
        <div className="memory-main">
          <aside className="memory-left-panel">
            <div className="memory-panel-head">
              <h2 className="memory-panel-title">Memory</h2>
            </div>
            <nav className="memory-nav" aria-label="Memory exercises">
              <ul className="memory-nav-list">
                {MEMORY_EXERCISES.map(({ path, label }) => (
                  <li key={path}>
                    <NavLink
                      to={path}
                      className="memory-nav-item"
                    >
                      {label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
            <MemoryChallengeSection />
          </aside>
          <div
            className={`memory-board-wrap${location.pathname === '/memory/openings-notation' ? ' memory-board-wrap-locked' : ''}`}
          >
            <MemoryBoard />
          </div>
          <aside className="memory-right-panel">
            {showAnnotationsTitle && (
              <div className="memory-panel-head">
                <h2 className="memory-panel-title">Annotations</h2>
              </div>
            )}
            <div className="memory-annotation-content">
              <MemoryAnnotationContent />
            </div>
            <MemoryAnnotationActions />
          </aside>
        </div>
        {location.pathname !== '/memory' && (
          <div className="memory-content">
            <Outlet />
            <hr className="section-notes-line" aria-hidden />
            <div className="section-notes-box">
              <div className="section-notes-content">
                <MemoryNotesContent />
              </div>
            </div>
          </div>
        )}
      </div>
      </OpeningsPracticeProvider>
      </OpeningsQuizProvider>
    </MemoryProvider>
  );
}
