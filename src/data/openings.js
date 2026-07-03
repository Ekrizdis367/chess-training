export const openingCategories = [
  { slug: 'd4', label: 'd4' },
  { slug: 'e4', label: 'e4' },
  { slug: 'other', label: 'Other' },
];

export const openingsByCategory = {
  d4: [
    {
      name: "Queen's Gambit",
      slug: 'queens-gambit',
      white: true,
      black: false,
      variations: [
        {
          name: 'Accepted',
          slug: 'queens-gambit-accepted',
          notes:
            "The Queen's Gambit Accepted (1.d4 d5 2.c4 dxc4) gives White a central pawn majority and quick development in return for the pawn. Classical and still highly regarded; style is strategic with piece play and often a minority attack.",
        },
        {
          name: 'Declined',
          slug: 'qgd',
          notes:
            "The Queen's Gambit Declined (1.d4 d5 2.c4 e6) is one of the oldest and most solid defences. Black keeps the centre and aims for …Nf6 and …Be7. Style is positional; many lines lead to rich manoeuvring and minority attacks.",
        },
        {
          name: 'Slav',
          slug: 'slav',
          notes:
            "The Slav (1.d4 d5 2.c4 c6) keeps the c8–h3 diagonal open for the bishop. Solid and flexible; Black often plays …Nf6, …e6, and …Bf5. Popular at all levels and leads to both sharp and positional games.",
        },
      ],
    },
    {
      name: "London System",
      slug: 'london',
      white: true,
      black: false,
      notes:
        "The London (1.d4 and 2.Bf4) is a system rather than a single opening. White builds a solid setup with the bishop on f4, often with e3, c3, and Nbd2. Easy to learn, flexible, and used to limit Black's options.",
    },
    {
      name: "Catalan",
      slug: 'catalan',
      white: true,
      black: false,
      notes:
        "The Catalan (1.d4 Nf6 2.c4 e6 3.g3) combines a flank fianchetto with the d4–c4 centre. White aims for long-term pressure on the long diagonal and often a space advantage. Popular at elite level.",
    },
    {
      name: "Colle System",
      slug: 'colle',
      white: true,
      black: false,
      notes:
        "The Colle (1.d4 d5 2.Nf3 Nf6 3.e3) is a solid, easy-to-play system for White. The idea is Bd3, Nbd2, 0-0 and often e3–e4. Less theoretical than the main Queen's Gambit lines.",
    },
    {
      name: "Trompovsky",
      slug: 'trompovsky',
      white: true,
      black: false,
      notes:
        "The Trompovsky (1.d4 Nf6 2.Bg5) threatens to double Black's pawns and avoids heavy theory. White often follows with e3, Bd3, and Nd2. Offbeat but fully playable.",
    },
    {
      name: "King's Indian Defence",
      slug: 'kings-indian',
      white: false,
      black: true,
      notes:
        "The King's Indian (1.d4 Nf6 2.c4 g6 3.Nc3 Bg7) is a dynamic defence where Black allows a big centre and strikes back with …e5 or …c5. Fianchetto and piece activity are typical; popular in the 20th century and still a main line.",
    },
    {
      name: "Grünfeld Defence",
      slug: 'gruenfeld',
      white: false,
      black: true,
      notes:
        "The Grünfeld (1.d4 Nf6 2.c4 g6 3.Nc3 d5) is a dynamic defence where Black challenges the centre immediately. Leads to sharp, theoretical positions; a favourite of many top players.",
    },
    {
      name: "Nimzo-Indian Defence",
      slug: 'nimzo-indian',
      white: false,
      black: true,
      notes:
        "The Nimzo-Indian (1.d4 Nf6 2.c4 e6 3.Nc3 Bb4) pins the knight and often leads to a structural battle. Black can give up the bishop pair for a solid structure. One of the most respected d4 defences.",
    },
    {
      name: "Queen's Indian Defence",
      slug: 'queens-indian',
      white: false,
      black: true,
      notes:
        "The Queen's Indian (1.d4 Nf6 2.c4 e6 3.Nf3 b6) develops the bishop to b7 and keeps the position flexible. Solid and positional; often transposes or links with the Nimzo and Bogo.",
    },
    {
      name: "Benoni",
      slug: 'benoni',
      white: false,
      black: true,
      notes:
        "The Benoni (1.d4 Nf6 2.c4 c5) creates an asymmetric pawn structure. Black gets active play and the …e6–d5 break. The Modern Benoni (3.d5 e6) is sharp and double-edged.",
    },
    {
      name: "Dutch Defence",
      slug: 'dutch',
      white: false,
      black: true,
      notes:
        "The Dutch (1.d4 f5) stakes a claim on e4 and the kingside. The Stonewall (…e6, …d5) is solid; the Leningrad (…g6, …Bg7) is more dynamic. Less common than the Indian defences but fully playable.",
    },
    {
      name: "Slav Defence",
      slug: 'slav-standalone',
      white: false,
      black: true,
      notes:
        "The Slav (1.d4 d5 2.c4 c6) keeps the c8–h3 diagonal open. Often played as a reply to the Queen's Gambit; solid and flexible with …Nf6, …e6, and …Bf5.",
    },
    {
      name: "Albin Countergambit",
      slug: 'albin',
      white: false,
      black: true,
      notes:
        "The Albin (1.d4 d5 2.c4 e5) is a sharp countergambit. Black gives a pawn for quick development and the central pawn wedge. Risky but leads to double-edged, tactical games.",
    },
  ],
  e4: [
    {
      name: "Italian Game",
      slug: 'italian',
      white: true,
      black: false,
      variations: [
        {
          name: 'Giuoco Piano',
          slug: 'giuoco-piano',
          notes:
            "The Giuoco Piano (1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5) is one of the oldest open games. White aims for d2–d3 and c2–c3, often with ideas of d4 or a kingside attack. Classical and educational.",
        },
        {
          name: 'Evans Gambit',
          slug: 'evans-gambit',
          notes:
            "The Evans Gambit (1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5 4.b4) sacrifices a pawn for rapid development and the bishop pair. A 19th-century attacking weapon that remains playable and leads to sharp, tactical positions.",
        },
      ],
    },
    {
      name: "Ruy López",
      slug: 'ruy-lopez',
      white: true,
      black: false,
      notes:
        "The Ruy López (1.e4 e5 2.Nf3 Nc6 3.Bb5) is a classical opening that targets the e5 pawn and supports d2–d4. Rich in strategy and history; many lines lead to deep manoeuvring and long-term advantages.",
    },
    {
      name: "Scotch Game",
      slug: 'scotch',
      white: true,
      black: false,
      notes:
        "The Scotch (1.e4 e5 2.Nf3 Nc6 3.d4) opens the centre immediately. White gets a space advantage and active pieces. Less theoretical than the Ruy López but fully sound.",
    },
    {
      name: "Scotch Gambit",
      slug: 'scotch-gambit',
      white: true,
      black: false,
      notes:
        "The Scotch Gambit (1.e4 e5 2.Nf3 Nc6 3.d4 exd4 4.Bc4) sacrifices a pawn for rapid development and attack. Sharp and tactical; often leads to open positions with chances for both sides.",
    },
    {
      name: "Vienna Game",
      slug: 'vienna',
      white: true,
      black: false,
      notes:
        "The Vienna (1.e4 e5 2.Nc3) keeps options for f2–f4 (Vienna Gambit) or a slower build-up. Flexible and less analysed than the Italian or Ruy López; good for sidestepping heavy theory.",
    },
    {
      name: "Bishop's Opening",
      slug: 'bishops-opening',
      white: true,
      black: false,
      notes:
        "The Bishop's Opening (1.e4 e5 2.Bc4) develops the bishop and can transpose into Italian or stay independent. Less common than 2.Nf3 but sound and avoids the Petroff.",
    },
    {
      name: "Four Knights",
      slug: 'four-knights',
      white: true,
      black: false,
      notes:
        "The Four Knights (1.e4 e5 2.Nf3 Nc6 3.Nc3 Nf6) is a solid, symmetrical opening. Can lead to the Spanish Four Knights, the Scotch Four Knights, or quieter lines. Good for learners.",
    },
    {
      name: "Sicilian Defence",
      slug: 'sicilian',
      white: false,
      black: true,
      variations: [
        {
          name: 'Open',
          slug: 'sicilian-open',
          notes:
            "The Open Sicilian (1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3) leads to asymmetric positions and is one of the sharpest and most theoretical lines. Black gets the half-open c-file and active play; White has the centre and space.",
        },
        {
          name: 'Najdorf',
          slug: 'sicilian-najdorf',
          notes:
            "The Najdorf (…a6 in the Sicilian) is one of the most popular and deeply analysed lines. Black keeps options for …e5 or …e6 and a flexible pawn structure. A favourite of Fischer and Kasparov.",
        },
        {
          name: 'Dragon',
          slug: 'sicilian-dragon',
          notes:
            "The Dragon (…g6 and …Bg7 in the Sicilian) gives Black a fianchettoed bishop and often leads to opposite-side castling and sharp attacks. The Yugoslav Attack (Be3, Qd2, Bh6) is the main critical test.",
        },
        {
          name: 'Taimanov',
          slug: 'sicilian-taimanov',
          notes:
            "The Taimanov (…e6 and …Nc6 in the Sicilian) is a flexible system where Black keeps the option of …d6 or …Nge7. Solid and rich in ideas; less sharp than the Najdorf or Dragon.",
        },
      ],
    },
    {
      name: "French Defence",
      slug: 'french',
      white: false,
      black: true,
      notes:
        "The French (1.e4 e6 2.d4 d5) is a solid defence where Black builds a strong centre and often challenges with …c5. The structure leads to distinct plans: White often attacks on the kingside, Black on the queenside.",
    },
    {
      name: "Caro-Kann",
      slug: 'caro-kann',
      white: false,
      black: true,
      notes:
        "The Caro-Kann (1.e4 c6 2.d4 d5) is a solid defence that avoids the sharpest Sicilian and Najdorf lines. Black aims for …Bf5 or …Bg4 and a sound structure. Used by many positional and defensive players.",
    },
    {
      name: "Petroff Defence",
      slug: 'petroff',
      white: false,
      black: true,
      notes:
        "The Petroff (1.e4 e5 2.Nf3 Nf6) is a solid defence where Black mirrors White's moves in the opening. Often leads to equal, symmetrical positions. Popular at the highest level for its reliability.",
    },
    {
      name: "Philidor Defence",
      slug: 'philidor',
      white: false,
      black: true,
      notes:
        "The Philidor (1.e4 e5 2.Nf3 d6) is a solid but passive defence. Black supports e5 and often plays …Nf6, …Be7, and …0-0. Less ambitious than the Italian or Ruy López defences.",
    },
    {
      name: "Pirc Defence",
      slug: 'pirc',
      white: false,
      black: true,
      notes:
        "The Pirc (1.e4 d6 2.d4 Nf6 3.Nc3 g6) is a hypermodern defence. Black fianchettoes and allows White a big centre, then strikes back with …c6, …e5, or …Bg7. Flexible and dynamic.",
    },
    {
      name: "Modern Defence",
      slug: 'modern',
      white: false,
      black: true,
      notes:
        "The Modern (1.e4 g6 2.d4 Bg7) is a hypermodern defence similar to the Pirc. Black delays …Nf6 and keeps options for …d6, …c6, or …e5. Unbalancing and often transposes into Pirc or other systems.",
    },
    {
      name: "Alekhine's Defence",
      slug: 'alekhine',
      white: false,
      black: true,
      notes:
        "Alekhine's Defence (1.e4 Nf6) invites White to push the centre with 2.e5. Black then attacks the pawns with …Nd5 and …d6. Sharp and double-edged; leads to unique structures.",
    },
    {
      name: "Scandinavian",
      slug: 'scandinavian',
      white: false,
      black: true,
      notes:
        "The Scandinavian (1.e4 d5) takes on e4 at once. After 2.exd5 Qxd5 Black develops the queen early; 2…Nf6 is the modern approach. Direct and easy to learn; leads to open positions.",
    },
    {
      name: "Bongcloud",
      slug: 'bongcloud',
      white: true,
      black: false,
      notes:
        "The Bongcloud (1.e4 e5 2.Ke2) is a meme opening where White moves the king on move two instead of developing. Popularized online; occasionally played by GMs for fun.",
    },
    {
      name: "Halloween Gambit",
      slug: 'halloween-gambit',
      white: true,
      black: false,
      notes:
        "The Halloween Gambit (1.e4 e5 2.Nf3 Nc6 3.Nc3 Nf6 4.Nxe5) sacrifices a knight for a pawn to seize the centre with d4 and attack. Also known as the Müller–Schulze or Leipzig Gambit.",
    },
    {
      name: "Norwegian Rat",
      slug: 'norwegian-rat',
      white: false,
      black: true,
      notes:
        "The Norwegian Rat (1.e4 g6 2.d4 Nf6 3.e5 Nh5) mixes Modern and Alekhine ideas with a corkscrew knight. Popularized by Magnus Carlsen in blitz and bullet; sharp and unbalancing.",
    },
  ],
  other: [
    {
      name: "English Opening",
      slug: 'english',
      white: true,
      black: false,
      notes:
        "The English (1.c4) is a flexible flank opening that can transpose into d4 or e4 structures. Often leads to reversed Sicilians or independent setups. Popular at top level for its variety and subtlety.",
    },
    {
      name: "Reti",
      slug: 'reti',
      white: true,
      black: false,
      notes:
        "The Reti (1.Nf3 and often 2.c4) is a hypermodern opening that delays or avoids occupying the centre with pawns. Flexible and transpositional; can lead to English, Catalan, or independent Reti structures.",
    },
    {
      name: "King's Indian Attack",
      slug: 'kia',
      white: true,
      black: false,
      notes:
        "The King's Indian Attack is a system (1.Nf3, 2.g3, 3.Bg2, 4.0-0, 5.d3) that mirrors the King's Indian Defence from White's side. Solid and flexible; often used against the French, Caro-Kann, and other defences.",
    },
    {
      name: "Bird's Opening",
      slug: 'birds',
      white: true,
      black: false,
      notes:
        "Bird's Opening (1.f4) is a flank opening that controls e5 and can lead to the Dutch reversed. The From Gambit (1…e5) is a sharp reply. Uncommon but playable and can surprise opponents.",
    },
    {
      name: "Larsen's Opening",
      slug: 'larsen',
      white: true,
      black: false,
      notes:
        "Larsen's Opening (1.b3) fianchettoes the queen's bishop and aims for a flexible, hypermodern setup. Can transpose into English or stay independent. Offbeat and used to avoid main-line theory.",
    },
    {
      name: "Nimzo-Larsen",
      slug: 'nimzo-larsen',
      white: true,
      black: false,
      notes:
        "The Nimzo-Larsen (1.b3 e5 2.Bb2) is a quiet system where White develops the bishop to the long diagonal. Less common than 1.Nf3 or 1.c4 but solid and flexible.",
    },
    {
      name: "ICBM Gambit",
      slug: 'icbm-gambit',
      white: true,
      black: false,
      notes:
        "The ICBM (Intercontinental Ballistic Missile) Gambit (1.Nf3 d5 2.e4 dxe4 3.Ng5) sacrifices a pawn for rapid development and attack on f7. Also known as the Tennison Gambit; sharp and tactical.",
    },
    {
      name: "Cow Opening",
      slug: 'cow-opening',
      white: true,
      black: false,
      notes:
        "The Cow (1.e3, 2.d3, knights to b3 and g3) is an unconventional system popularized by streamer WFM Anna Cramling. White avoids early centre clashes and builds a 'cow-like' setup with the knights as horns. A meme opening that can surprise opponents at lower levels.",
    },
  ],
};

/** Get the one-paragraph notes for the opening line at the given route (category + openingSlug). */
export function getOpeningNotes(category, openingSlug) {
  const list = openingsByCategory[category];
  if (!list || !openingSlug) return null;
  for (const op of list) {
    if (op.slug === openingSlug && op.notes) return op.notes;
    if (op.variations) {
      const v = op.variations.find((variation) => variation.slug === openingSlug);
      if (v && v.notes) return v.notes;
    }
  }
  return null;
}

/**
 * Move sequences (SAN, as from chess.js game.history()) that identify openings.
 * Longest match wins. Order by length descending.
 */
const OPENING_MOVE_SEQUENCES = [
  // Queen's Gambit variations (d4 d5 c4 ...)
  { moves: ['d4', 'd5', 'c4', 'dxc4'], category: 'd4', slug: 'queens-gambit-accepted' },
  { moves: ['d4', 'd5', 'c4', 'e6'], category: 'd4', slug: 'qgd' },
  { moves: ['d4', 'd5', 'c4', 'c6'], category: 'd4', slug: 'slav' },
  { moves: ['d4', 'd5', 'c4'], category: 'd4', slug: 'queens-gambit' },
  // London
  { moves: ['d4', 'd5', 'Bf4'], category: 'd4', slug: 'london' },
  // Colle System
  { moves: ['d4', 'd5', 'Nf3', 'Nf6', 'e3'], category: 'd4', slug: 'colle' },
  // Trompovsky
  { moves: ['d4', 'Nf6', 'Bg5'], category: 'd4', slug: 'trompovsky' },
  // Catalan
  { moves: ['d4', 'Nf6', 'c4', 'e6', 'g3'], category: 'd4', slug: 'catalan' },
  // King's Indian
  { moves: ['d4', 'Nf6', 'c4', 'g6', 'Nc3', 'Bg7'], category: 'd4', slug: 'kings-indian' },
  // Grünfeld
  { moves: ['d4', 'Nf6', 'c4', 'g6', 'Nc3', 'd5'], category: 'd4', slug: 'gruenfeld' },
  // Nimzo-Indian
  { moves: ['d4', 'Nf6', 'c4', 'e6', 'Nc3', 'Bb4'], category: 'd4', slug: 'nimzo-indian' },
  // Queen's Indian
  { moves: ['d4', 'Nf6', 'c4', 'e6', 'Nf3', 'b6'], category: 'd4', slug: 'queens-indian' },
  // Dutch
  { moves: ['d4', 'f5'], category: 'd4', slug: 'dutch' },
  // Benoni
  { moves: ['d4', 'Nf6', 'c4', 'c5'], category: 'd4', slug: 'benoni' },
  // Slav Defence (standalone nav entry)
  { moves: ['d4', 'd5', 'c4', 'c6'], category: 'd4', slug: 'slav-standalone' },
  // Albin Countergambit
  { moves: ['d4', 'd5', 'c4', 'e5'], category: 'd4', slug: 'albin' },
  // Italian & Ruy
  { moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Bc5', 'b4'], category: 'e4', slug: 'evans-gambit' },
  { moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Bc5'], category: 'e4', slug: 'giuoco-piano' },
  { moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Nf6'], category: 'e4', slug: 'italian' },
  { moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5'], category: 'e4', slug: 'ruy-lopez' },
  // Four Knights
  { moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Nc3', 'Nf6'], category: 'e4', slug: 'four-knights' },
  // Scotch
  { moves: ['e4', 'e5', 'Nf3', 'Nc6', 'd4', 'exd4', 'Bc4'], category: 'e4', slug: 'scotch-gambit' },
  { moves: ['e4', 'e5', 'Nf3', 'Nc6', 'd4'], category: 'e4', slug: 'scotch' },
  // Vienna
  { moves: ['e4', 'e5', 'Nc3'], category: 'e4', slug: 'vienna' },
  // Sicilian
  { moves: ['e4', 'c5', 'Nf3', 'e6', 'd4', 'cxd4', 'Nxd4', 'Nc6'], category: 'e4', slug: 'sicilian-taimanov' },
  { moves: ['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'Nc3', 'a6'], category: 'e4', slug: 'sicilian-najdorf' },
  { moves: ['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'Nc3', 'g6'], category: 'e4', slug: 'sicilian-dragon' },
  { moves: ['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'Nc3'], category: 'e4', slug: 'sicilian-open' },
  { moves: ['e4', 'c5'], category: 'e4', slug: 'sicilian' },
  // French
  { moves: ['e4', 'e6', 'd4', 'd5'], category: 'e4', slug: 'french' },
  // Caro-Kann
  { moves: ['e4', 'c6', 'd4', 'd5'], category: 'e4', slug: 'caro-kann' },
  // Petroff
  { moves: ['e4', 'e5', 'Nf3', 'Nf6'], category: 'e4', slug: 'petroff' },
  // Philidor
  { moves: ['e4', 'e5', 'Nf3', 'd6'], category: 'e4', slug: 'philidor' },
  // Pirc
  { moves: ['e4', 'd6', 'd4', 'Nf6', 'Nc3', 'g6'], category: 'e4', slug: 'pirc' },
  // Modern
  { moves: ['e4', 'g6', 'd4', 'Bg7'], category: 'e4', slug: 'modern' },
  // Alekhine's
  { moves: ['e4', 'Nf6'], category: 'e4', slug: 'alekhine' },
  // Scandinavian
  { moves: ['e4', 'd5'], category: 'e4', slug: 'scandinavian' },
  // Norwegian Rat (Magnus Carlsen)
  { moves: ['e4', 'g6', 'd4', 'Nf6', 'e5', 'Nh5'], category: 'e4', slug: 'norwegian-rat' },
  // Halloween Gambit (Four Knights: 4.Nxe5)
  { moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Nc3', 'Nf6', 'Nxe5'], category: 'e4', slug: 'halloween-gambit' },
  // ICBM Gambit (Tennison)
  { moves: ['Nf3', 'd5', 'e4', 'dxe4', 'Ng5'], category: 'other', slug: 'icbm-gambit' },
  // Bongcloud
  { moves: ['e4', 'e5', 'Ke2'], category: 'e4', slug: 'bongcloud' },
  // Bishop's Opening
  { moves: ['e4', 'e5', 'Bc4'], category: 'e4', slug: 'bishops-opening' },
  // Cow Opening (WFM Anna Cramling: e3, d3, knights to g3 and b3)
  { moves: ['e3', 'e5', 'd3', 'Nc6', 'Ne2', 'Nf6', 'Ng3', 'Be7', 'Nd2', 'O-O', 'Nb3'], category: 'other', slug: 'cow-opening' },
  // English, Reti, KIA, Bird's, Larsen, Nimzo-Larsen
  { moves: ['c4'], category: 'other', slug: 'english' },
  { moves: ['Nf3'], category: 'other', slug: 'reti' },
  { moves: ['Nf3', 'd5', 'g3', 'Nf6', 'Bg2'], category: 'other', slug: 'kia' },
  { moves: ['f4'], category: 'other', slug: 'birds' },
  { moves: ['b3'], category: 'other', slug: 'larsen' },
  { moves: ['b3', 'e5', 'Bb2'], category: 'other', slug: 'nimzo-larsen' },
  // e4 e5 (2 moves - could be Italian/Ruy/Scotch later)
  { moves: ['e4', 'e5'], category: 'e4', slug: 'italian' },
  // d4
  { moves: ['d4', 'Nf6'], category: 'd4', slug: 'kings-indian' },
  { moves: ['d4', 'd5'], category: 'd4', slug: 'queens-gambit' },
].sort((a, b) => b.moves.length - a.moves.length);

/** Get the move sequence for an opening by category and slug, or null if not found. */
export function getOpeningMoveSequence(category, slug) {
  if (!category || !slug) return null;
  const entry = OPENING_MOVE_SEQUENCES.find((e) => e.category === category && e.slug === slug);
  return entry ? [...entry.moves] : null;
}

/** Normalize SAN for comparison: strip check/checkmate, and collapse disambiguation (e.g. Ng1f3 → Nf3, Nbd2 → Nd2). */
export function normalizeSan(s) {
  let out = String(s).replace(/[+#=].*$/, '').trim();
  // Long form (piece + from + to): Ng1f3 → Nf3
  out = out.replace(/^([NBRQK])([a-h][1-8])([a-h][1-8])$/, '$1$3');
  // Short form with file/rank disambiguation: Nbd2 → Nd2, N1f3 → Nf3
  out = out.replace(/^([NBRQK])([a-h]?[1-8]?)(x?[a-h][1-8]=?[NBRQ]?)$/, '$1$3');
  return out;
}

/** Parse a notation string (e.g. "1. e4 e5 2. Nf3" or "1.e4 e5 2.Nf3") into an array of SAN moves. */
export function parseNotationToMoves(notation) {
  if (!notation || typeof notation !== 'string') return [];
  const tokens = notation.trim().split(/\s+/).filter(Boolean);
  const moves = [];
  for (const t of tokens) {
    if (/^\d+\.?$/.test(t)) continue;
    const san = t.replace(/^\d+\./, '').replace(/[+#=].*$/, '').trim();
    if (san.length >= 2) moves.push(san);
  }
  return moves;
}

/** Return { category, slug } if the move history matches an opening, else null. */
export function getOpeningByMoves(history) {
  if (!history || !Array.isArray(history) || history.length === 0) return null;
  const normalized = history.map(normalizeSan);
  for (const { moves, category, slug } of OPENING_MOVE_SEQUENCES) {
    if (moves.length > normalized.length) continue;
    const match = moves.every((m, i) => normalizeSan(m) === normalized[i]);
    if (match) return { category, slug };
  }
  return null;
}

/**
 * Short labels for the first few moves before a specific opening is reached.
 * Longest matching prefix of history wins.
 */
const EARLY_OPENING_LABELS = [
  { moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Nc3'], label: 'Three Knights Game' },
  { moves: ['e4', 'e5'], label: "King's Pawn Opening (Open Game)" },
  { moves: ['e4'], label: "King's Pawn Opening" },
  { moves: ['d4', 'd5'], label: "Queen's Pawn Opening (Closed Game)" },
  { moves: ['d4'], label: "Queen's Pawn Opening" },
  { moves: ['c4'], label: 'English Opening' },
  { moves: ['Nf3'], label: "Reti Opening (Zukertort)" },
  { moves: ['e4', 'c5'], label: "Sicilian Defence" },
  { moves: ['e4', 'e6'], label: "French Defence" },
  { moves: ['e4', 'c6'], label: "Caro-Kann Defence" },
  { moves: ['e4', 'Nf6'], label: "Alekhine's Defence" },
  { moves: ['e4', 'd5'], label: 'Scandinavian Defence' },
  { moves: ['e4', 'd6'], label: 'Pirc Defence' },
  { moves: ['e4', 'g6'], label: 'Modern Defence' },
  { moves: ['d4', 'Nf6'], label: "Indian Defence" },
  { moves: ['d4', 'f5'], label: "Dutch Defence" },
].sort((a, b) => b.moves.length - a.moves.length);

/** Label for early moves when no specific opening is matched (e.g. "King's Pawn Opening"). */
export function getEarlyOpeningLabel(history) {
  if (!history || history.length === 0) return null;
  const normalized = history.map(normalizeSan);
  for (const { moves, label } of EARLY_OPENING_LABELS) {
    if (moves.length > normalized.length) continue;
    if (moves.every((m, i) => normalizeSan(m) === normalized[i])) return label;
  }
  return null;
}

/** Get display name for an opening slug (searches categories and variations). */
export function getOpeningName(slug) {
  for (const category of openingCategories) {
    const list = openingsByCategory[category.slug];
    if (!list) continue;
    for (const op of list) {
      if (op.slug === slug) return op.name;
      if (op.variations) {
        const v = op.variations.find((variation) => variation.slug === slug);
        if (v) return `${op.name} – ${v.name}`;
      }
    }
  }
  return slug;
}

/** All opening entries that have move sequences, with { slug, name, moves }. */
export function getOpeningQuizEntries() {
  return OPENING_MOVE_SEQUENCES.map(({ moves, category, slug }) => ({
    slug,
    name: getOpeningName(slug),
    moves: [...moves],
  }));
}
