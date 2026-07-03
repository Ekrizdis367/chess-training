/**
 * Stockfish engine client. Talks to the Stockfish worker via UCI.
 * Worker must be served from /engine/stockfish.js (with stockfish.wasm next to it).
 */

const ENGINE_PATH = '/engine/stockfish.js';

export function createStockfishClient() {
  let worker = null;
  let ready = false;
  let initResolve = null;
  let pendingResolve = null;
  let onBestMoveCallback = null;
  let onInfoCallback = null;

  function handleMessage(e) {
    const line = typeof e.data === 'string' ? e.data : e.data?.toString?.() ?? '';
    const lines = line.split('\n').filter(Boolean);
    for (const l of lines) {
      if (l === 'uciok') {
        send('isready');
      } else if (l === 'readyok') {
        ready = true;
        if (initResolve) {
          initResolve();
          initResolve = null;
        }
      } else if (l.startsWith('bestmove ')) {
        const match = l.match(/bestmove\s+(\S+)/);
        const move = match ? match[1] : null;
        if (move && move !== '(none)' && onBestMoveCallback) {
          onBestMoveCallback(move);
        }
        if (pendingResolve) {
          pendingResolve(move);
          pendingResolve = null;
        }
      } else if (l.startsWith('info ') && onInfoCallback) {
        const scoreMatch = l.match(/score\s+(cp|mate)\s+(-?\d+)/);
        const depthMatch = l.match(/depth\s+(\d+)/);
        if (scoreMatch || depthMatch) {
          onInfoCallback({
            depth: depthMatch ? parseInt(depthMatch[1], 10) : null,
            score: scoreMatch
              ? scoreMatch[1] === 'mate'
                ? { type: 'mate', value: parseInt(scoreMatch[2], 10) }
                : { type: 'cp', value: parseInt(scoreMatch[2], 10) }
              : null,
          });
        }
      }
    }
  }

  function send(cmd) {
    if (worker) worker.postMessage(cmd);
  }

  return {
    /** Start the engine. Returns a Promise that resolves when the engine is ready. */
    async init() {
      if (worker && ready) return Promise.resolve();
      if (worker) {
        return new Promise((resolve) => {
          const check = () => (ready ? resolve() : setTimeout(check, 50));
          check();
        });
      }
      return new Promise((resolve, reject) => {
        try {
          initResolve = resolve;
          worker = new Worker(ENGINE_PATH, { type: 'classic' });
          worker.onmessage = handleMessage;
          worker.onerror = (err) => {
            initResolve = null;
            reject(err);
          };
          send('uci');
        } catch (err) {
          initResolve = null;
          reject(err);
        }
      });
    },

    /** Whether the engine has been initialised and is ready. */
    isReady() {
      return !!worker && ready;
    },

    /** Set position from FEN or from startpos + moves. */
    setPosition(fenOrStartpos, moves = []) {
      if (!worker || !ready) return;
      if (fenOrStartpos === 'startpos' || fenOrStartpos === 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1') {
        const cmd = moves.length ? `position startpos moves ${moves.join(' ')}` : 'position startpos';
        send(cmd);
      } else {
        const cmd = moves.length ? `position fen ${fenOrStartpos} moves ${moves.join(' ')}` : `position fen ${fenOrStartpos}`;
        send(cmd);
      }
    },

    /** Start searching. Optional depth (default 18). Returns a Promise that resolves with the best move in UCI format (e.g. "e2e4"). */
    go(depth = 18) {
      if (!worker || !ready) return Promise.reject(new Error('Engine not ready'));
      return new Promise((resolve) => {
        pendingResolve = resolve;
        send(`go depth ${depth}`);
      });
    },

    /** Stop the current search. */
    stop() {
      send('stop');
    },

    /** Register callback for best move (called when engine finds a move). */
    onBestMove(cb) {
      onBestMoveCallback = cb;
    },

    /** Register callback for info lines (score, depth). */
    onInfo(cb) {
      onInfoCallback = cb;
    },

    /** Quit and terminate the worker. */
    quit() {
      if (worker) {
        send('quit');
        worker.terminate();
        worker = null;
        ready = false;
        pendingResolve = null;
      }
    },
  };
}
