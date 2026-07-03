import { Chess } from 'chess.js';

const FEN_PIECE = {
  wK: 'K', wQ: 'Q', wR: 'R', wB: 'B', wN: 'N', wP: 'P',
  bK: 'k', bQ: 'q', bR: 'r', bB: 'b', bN: 'n', bP: 'p',
};

const SQUARES = [
  'a1', 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1',
  'a2', 'b2', 'c2', 'd2', 'e2', 'f2', 'g2', 'h2',
  'a3', 'b3', 'c3', 'd3', 'e3', 'f3', 'g3', 'h3',
  'a4', 'b4', 'c4', 'd4', 'e4', 'f4', 'g4', 'h4',
  'a5', 'b5', 'c5', 'd5', 'e5', 'f5', 'g5', 'h5',
  'a6', 'b6', 'c6', 'd6', 'e6', 'f6', 'g6', 'h6',
  'a7', 'b7', 'c7', 'd7', 'e7', 'f7', 'g7', 'h7',
  'a8', 'b8', 'c8', 'd8', 'e8', 'f8', 'g8', 'h8',
];

function shuffle(array) {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function isLightSquare(sq) {
  const file = sq.charCodeAt(0) - 97;
  const rank = parseInt(sq[1], 10);
  return (file + rank) % 2 === 0;
}

function kingNeighbors(sq) {
  const file = sq.charCodeAt(0) - 97;
  const rank = parseInt(sq[1], 10);
  const out = [];
  for (let df = -1; df <= 1; df++) {
    for (let dr = -1; dr <= 1; dr++) {
      if (df === 0 && dr === 0) continue;
      const f = file + df;
      const r = rank + dr;
      if (f >= 0 && f <= 7 && r >= 1 && r <= 8) {
        out.push(String.fromCharCode(97 + f) + r);
      }
    }
  }
  return out;
}

function buildFenFromPlacement(placement) {
  const rows = [];
  for (let rank = 8; rank >= 1; rank--) {
    let row = '';
    let empty = 0;
    for (let file = 0; file < 8; file++) {
      const sq = String.fromCharCode(97 + file) + rank;
      const p = placement[sq];
      if (p) {
        if (empty > 0) {
          row += empty;
          empty = 0;
        }
        row += p;
      } else {
        empty++;
      }
    }
    if (empty > 0) row += empty;
    rows.push(row);
  }
  return rows.join('/');
}

/**
 * Parse endgame category pieces array (e.g. ['wK','wR','vs','bK']) into white and black piece lists.
 * Returns { white: ['K','R'], black: ['K'] } (FEN single-char codes).
 */
export function parsePieces(pieces) {
  if (!pieces || !Array.isArray(pieces)) return { white: [], black: [] };
  const white = [];
  const black = [];
  let side = 'white';
  for (const token of pieces) {
    if (token === 'vs') {
      side = 'black';
      continue;
    }
    const code = FEN_PIECE[token];
    if (code) {
      if (token.startsWith('w')) white.push(code);
      else black.push(code);
    }
  }
  return { white, black };
}

/**
 * Generate a random legal position with the given pieces.
 * User (white) to move; no castling; position is valid (side to move not in check).
 * @param {{ white: string[], black: string[] }} pieceConfig from parsePieces
 * @param {number} maxAttempts
 * @returns {string} FEN
 */
export function generateRandomPosition(pieceConfig, maxAttempts = 200) {
  const { white, black } = pieceConfig;
  const wKings = white.filter((p) => p === 'K').length;
  const bKings = black.filter((p) => p === 'k').length;
  if (wKings !== 1 || bKings !== 1) return null;

  const whitePieces = white.filter((p) => p !== 'K');
  const blackPieces = black.filter((p) => p !== 'k');

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const placement = {};
    const allSquares = shuffle(SQUARES);
    let idx = 0;

    const takeSquare = (exclude = []) => {
      const set = new Set(exclude);
      while (idx < allSquares.length) {
        const sq = allSquares[idx++];
        if (!set.has(sq) && !placement[sq]) return sq;
      }
      return null;
    };

    const wKingSq = takeSquare();
    if (!wKingSq) continue;
    placement[wKingSq] = 'K';

    const noBlackKing = new Set([wKingSq, ...kingNeighbors(wKingSq)]);
    const bKingSq = takeSquare([...noBlackKing]);
    if (!bKingSq) continue;
    placement[bKingSq] = 'k';

    const used = new Set([wKingSq, bKingSq]);

    const placePieces = (list, isPawn) => {
      for (const p of list) {
        if (isPawn) {
          const pawnRanks = shuffle(['2', '3', '4', '5', '6', '7']);
          let found = false;
          for (const r of pawnRanks) {
            for (let f = 0; f < 8; f++) {
              const s = String.fromCharCode(97 + f) + r;
              if (!used.has(s)) {
                used.add(s);
                placement[s] = p;
                found = true;
                break;
              }
            }
            if (found) break;
          }
          if (!found) return false;
        } else {
          const sq = takeSquare([...used]);
          if (!sq) return false;
          used.add(sq);
          placement[sq] = p;
        }
      }
      return true;
    };

    const pickUnusedSquare = (filter = null) => {
      const candidates = SQUARES.filter(
        (sq) => !used.has(sq) && !placement[sq] && (!filter || filter(sq))
      );
      if (candidates.length === 0) return null;
      return candidates[Math.floor(Math.random() * candidates.length)];
    };

    /** Place non-pawn, non-king pieces; two bishops of same color go on opposite-colored squares. */
    const placeOtherPieces = (list) => {
      const bishops = list.filter((p) => p === 'B' || p === 'b');
      const rest = list.filter((p) => p !== 'B' && p !== 'b');
      if (!placePieces(rest, false)) return false;
      if (bishops.length === 0) return true;
      if (bishops.length === 1) return placePieces(bishops, false);
      const lightFirst = Math.random() < 0.5;
      const sqLight = pickUnusedSquare(isLightSquare);
      if (!sqLight) return false;
      used.add(sqLight);
      placement[sqLight] = bishops[lightFirst ? 0 : 1];
      const sqDark = pickUnusedSquare((sq) => !isLightSquare(sq));
      if (!sqDark) return false;
      used.add(sqDark);
      placement[sqDark] = bishops[lightFirst ? 1 : 0];
      return true;
    };

    const pawnFilter = (arr) => arr.filter((p) => p === 'P' || p === 'p');
    const otherFilter = (arr) => arr.filter((p) => p !== 'P' && p !== 'p');

    if (!placeOtherPieces(otherFilter(whitePieces))) continue;
    if (!placePieces(pawnFilter(whitePieces), true)) continue;
    if (!placeOtherPieces(otherFilter(blackPieces))) continue;
    if (!placePieces(pawnFilter(blackPieces), true)) continue;

    const piecePlacement = buildFenFromPlacement(placement);
    const fen = `${piecePlacement} w - - 0 1`;
    try {
      const game = new Chess(fen);
      if (game.inCheck()) continue;
      return fen;
    } catch (_) {
      continue;
    }
  }
  return null;
}
