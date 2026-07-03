import { useState, useCallback, useEffect } from 'react';
import { NavLink, Outlet, useParams, useNavigate } from 'react-router-dom';
import { Chess } from 'chess.js';
import { ChessBoard } from './ChessBoard';
import { openingCategories, openingsByCategory, getOpeningNotes, getOpeningByMoves, getOpeningMoveSequence, getEarlyOpeningLabel } from '../data/openings';

function sortOpeningsByColorThenName(openings) {
  return [...(openings || [])].sort((a, b) => {
    const aFirst = a.white ? 0 : 1;
    const bFirst = b.white ? 0 : 1;
    if (aFirst !== bFirst) return aFirst - bFirst;
    return (a.name || '').localeCompare(b.name || '', undefined, { sensitivity: 'base' });
  });
}

const CALIENTE_PIECES_BASE = 'https://raw.githubusercontent.com/lichess-org/lila/master/public/piece/caliente';

function OpeningSideBadge({ white, black }) {
  const pieces = [];
  if (white) pieces.push('wP');
  if (black) pieces.push('bP');
  if (pieces.length === 0) return null;
  return (
    <span className="section-nav-item-badge section-nav-item-badge-pawns" aria-hidden>
      {pieces.map((key) => (
        <img
          key={key}
          src={`${CALIENTE_PIECES_BASE}/${key}.svg`}
          alt=""
          width={20}
          height={20}
          loading="lazy"
          className="section-nav-item-pawn"
        />
      ))}
    </span>
  );
}

function OpeningNavItem({ opening, category, currentSlug }) {
  const hasVariations = opening.variations && opening.variations.length > 0;
  const isParentMatch = currentSlug === opening.slug;
  const isVariationMatch = opening.variations?.some((v) => v.slug === currentSlug);
  const expanded = hasVariations && (isParentMatch || isVariationMatch);

  if (hasVariations) {
    return (
      <li className="section-nav-item-with-children">
        <NavLink
          to={`/openings/${category}/${opening.slug}`}
          className={`section-nav-item section-nav-item-parent ${expanded ? 'is-expanded' : ''}`}
          aria-expanded={expanded}
          aria-controls={`opening-variations-${category}-${opening.slug}`}
        >
          <span className="section-nav-item-name">{opening.name}</span>
          <OpeningSideBadge white={opening.white} black={opening.black} />
        </NavLink>
        <ul
          id={`opening-variations-${category}-${opening.slug}`}
          className="section-nav-sublist"
          hidden={!expanded}
        >
          {opening.variations.map((v) => (
            <li key={v.slug}>
              <NavLink
                to={`/openings/${category}/${v.slug}`}
                className="section-nav-item section-nav-item-variation"
              >
                <span className="section-nav-item-name">{v.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </li>
    );
  }

  return (
    <li>
      <NavLink
        to={`/openings/${category}/${opening.slug}`}
        className="section-nav-item"
      >
        <span className="section-nav-item-name">{opening.name}</span>
        <OpeningSideBadge white={opening.white} black={opening.black} />
      </NavLink>
    </li>
  );
}

function filterOpening(op, sideFilter) {
  if (sideFilter === 'all') return true;
  if (sideFilter === 'white') return op.white;
  return op.black;
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

export function OpeningsLayout() {
  const { category, openingSlug } = useParams();
  const navigate = useNavigate();
  const [sideFilter, setSideFilter] = useState('all');
  const [game, setGame] = useState(() => new Chess());
  const [redoStack, setRedoStack] = useState([]);
  const openingNotes = getOpeningNotes(category, openingSlug);
  const earlyLabel = getEarlyOpeningLabel(game.history());

  // When the user selects a different opening (URL changes), set the board to that opening's position.
  useEffect(() => {
    const moves = getOpeningMoveSequence(category, openingSlug);
    if (!moves || moves.length === 0) return;
    const c = new Chess();
    for (const san of moves) {
      if (!c.move(san)) return;
    }
    setGame(c);
    setRedoStack([]);
  }, [category, openingSlug]);

  const handleMove = useCallback(
    (from, to) => {
      const copy = new Chess();
      for (const san of game.history()) {
        copy.move(san);
      }
      const move = copy.move({ from, to, promotion: 'q' });
      if (!move) return false;
      setGame(copy);
      setRedoStack([]);
      const history = copy.history();
      const opening = getOpeningByMoves(history);
      if (opening && (opening.category !== category || opening.slug !== openingSlug)) {
        navigate(`/openings/${opening.category}/${opening.slug}`, { replace: true });
      }
      return true;
    },
    [game, category, openingSlug, navigate]
  );

  const handleReset = useCallback(() => {
    setGame(new Chess());
    setRedoStack([]);
  }, []);

  const handleBack = useCallback(() => {
    const history = game.history();
    if (history.length === 0) return;
    const prevMoves = history.slice(0, -1);
    const lastMove = history[history.length - 1];
    const c = new Chess();
    for (const san of prevMoves) {
      c.move(san);
    }
    setGame(c);
    setRedoStack((stack) => [...stack, lastMove]);
  }, [game]);

  const handleForward = useCallback(() => {
    if (redoStack.length === 0) return;
    const nextMove = redoStack[redoStack.length - 1];
    const c = new Chess();
    for (const san of game.history()) {
      c.move(san);
    }
    if (!c.move(nextMove)) return;
    setGame(c);
    setRedoStack((stack) => stack.slice(0, -1));
  }, [game, redoStack]);

  const moveRows = getMoveRows(game.history());

  return (
    <div className="openings-body">
      <div className="openings-main">
        <aside className="openings-left-panel">
          <div className="openings-panel-head">
            <h2 className="openings-panel-title">Openings</h2>
          </div>
          <nav className="section-nav" aria-label="Openings">
            {openingCategories.map(({ slug: cat, label }) => (
              <div key={cat} className="section-nav-group">
                <NavLink
                  to={`/openings/${cat}`}
                  className="section-nav-category"
                >
                  {label}
                </NavLink>
                <ul className="section-nav-list">
                  {sortOpeningsByColorThenName(openingsByCategory[cat])
                    .filter((op) => filterOpening(op, sideFilter))
                    .map((op) => (
                      <OpeningNavItem
                        key={op.slug}
                        opening={op}
                        category={cat}
                        currentSlug={openingSlug}
                      />
                    ))}
                </ul>
              </div>
            ))}
          </nav>
          <div className="openings-panel-filter">
            <button
              type="button"
              className={`openings-filter-btn ${sideFilter === 'all' ? 'active' : ''}`}
              onClick={() => setSideFilter('all')}
              aria-pressed={sideFilter === 'all'}
              aria-label="All openings"
            >
              All
            </button>
            <button
              type="button"
              className={`openings-filter-btn openings-filter-btn-pawn ${sideFilter === 'white' ? 'active' : ''}`}
              onClick={() => setSideFilter('white')}
              aria-pressed={sideFilter === 'white'}
              aria-label="White openings"
            >
              <img src={`${CALIENTE_PIECES_BASE}/wP.svg`} alt="" width={20} height={20} />
            </button>
            <button
              type="button"
              className={`openings-filter-btn openings-filter-btn-pawn ${sideFilter === 'black' ? 'active' : ''}`}
              onClick={() => setSideFilter('black')}
              aria-pressed={sideFilter === 'black'}
              aria-label="Black openings"
            >
              <img src={`${CALIENTE_PIECES_BASE}/bP.svg`} alt="" width={20} height={20} />
            </button>
          </div>
        </aside>
        <div className="openings-board-wrap">
          <ChessBoard
            position={game.fen()}
            onMove={handleMove}
            allowDrag
            boardWidth={760}
          />
        </div>
        <aside className="openings-right-panel">
          <div className="openings-panel-head">
            <h2 className="openings-panel-title">Annotations</h2>
          </div>
          <div className="memory-annotation-content">
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
          </div>
          <div className="openings-annotation-actions">
            <button
              type="button"
              className="openings-action-btn"
              onClick={handleReset}
              aria-label="Reset board"
              title="Reset board"
            >
              ↺
            </button>
            <button
              type="button"
              className="openings-action-btn"
              onClick={handleBack}
              disabled={game.history().length === 0}
              aria-label="Go back one move"
              title="Back one move"
            >
              ←
            </button>
            <button
              type="button"
              className="openings-action-btn"
              onClick={handleForward}
              disabled={redoStack.length === 0}
              aria-label="Go forward one move"
              title="Forward one move"
            >
              →
            </button>
          </div>
        </aside>
      </div>
      <div className="openings-content">
        <Outlet />
        <hr className="section-notes-line" aria-hidden />
        <div className="section-notes-box">
          <div className="section-notes-content">
            {openingNotes ? (
              <p>{openingNotes}</p>
            ) : earlyLabel ? (
              <p>{earlyLabel}</p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
