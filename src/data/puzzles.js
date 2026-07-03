/**
 * Tactics puzzles: FEN position + solution moves (UCI format).
 * It's White to play unless noted. Solution is the sequence of moves to play.
 */
export const TACTICS_PUZZLES = [
  {
    id: 1,
    fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4',
    solution: ['h5f7'],
    hint: 'Queen takes on f7 for a quick knockout.',
  },
  {
    id: 2,
    fen: 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 4 4',
    solution: ['e1g1'],
    hint: 'Castle to safety and connect the rooks.',
  },
  {
    id: 3,
    fen: 'r2qkb1r/ppp2ppp/2n1pn2/3p4/2PP4/2N2NP1/PP2PP1P/R1BQKB1R w KQkq - 0 5',
    solution: ['c4d5'],
    hint: 'Open the center with cxd5.',
  },
  {
    id: 4,
    fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4',
    solution: ['f3g5'],
    hint: 'Ng5 threatens the f7 pawn (Fried Liver idea).',
  },
  {
    id: 5,
    fen: 'r1bq1rk1/ppp2ppp/2n1pn2/3p4/2PP4/2N2NP1/PP2PP1P/R1BQKB1R w KQ - 0 6',
    solution: ['c4d5'],
    hint: 'cxd5 opens the center and the diagonal.',
  },
  {
    id: 6,
    fen: 'rnbqkbnr/pppp1ppp/8/4p3/6P1/5P2/PPPPP2P/RNBQKBNR w KQkq - 0 2',
    solution: ['f1g2'],
    hint: 'Develop the bishop to g2 (King\'s Indian / Fianchetto).',
  },
  {
    id: 7,
    fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR b KQkq - 0 4',
    solution: ['g8f6'],
    hint: 'Black defends: Nf6 attacks the queen and develops.',
  },
  {
    id: 8,
    fen: 'r2qkbnr/ppp2ppp/2n5/3pp3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 4',
    solution: ['e4d5'],
    hint: 'exd5 opens the center and attacks the knight.',
  },
];
