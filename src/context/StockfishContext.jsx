import { createContext, useContext, useRef, useCallback, useState } from 'react';
import { createStockfishClient } from '../engine/stockfishClient';

const StockfishContext = createContext(null);

export function useStockfish() {
  return useContext(StockfishContext);
}

export function StockfishProvider({ children }) {
  const clientRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);

  const getClient = useCallback(() => {
    if (!clientRef.current) {
      clientRef.current = createStockfishClient();
    }
    return clientRef.current;
  }, []);

  const init = useCallback(async () => {
    setError(null);
    try {
      const client = getClient();
      await client.init();
      setIsReady(true);
      return true;
    } catch (err) {
      setError(err?.message ?? 'Failed to load Stockfish');
      setIsReady(false);
      return false;
    }
  }, [getClient]);

  const setPosition = useCallback(
    (fenOrStartpos, moves = []) => {
      const client = getClient();
      if (client.isReady()) {
        client.setPosition(fenOrStartpos, moves);
      }
    },
    [getClient]
  );

  const go = useCallback(
    (depth = 18) => {
      const client = getClient();
      if (!client.isReady()) return Promise.reject(new Error('Engine not ready'));
      return client.go(depth);
    },
    [getClient]
  );

  const stop = useCallback(() => {
    getClient().stop();
  }, [getClient]);

  const quit = useCallback(() => {
    if (clientRef.current) {
      clientRef.current.quit();
      clientRef.current = null;
      setIsReady(false);
    }
  }, []);

  const onBestMove = useCallback(
    (cb) => {
      getClient().onBestMove(cb);
    },
    [getClient]
  );

  const onInfo = useCallback(
    (cb) => {
      getClient().onInfo(cb);
    },
    [getClient]
  );

  const value = {
    init,
    isReady,
    error,
    setPosition,
    go,
    stop,
    quit,
    onBestMove,
    onInfo,
  };

  return (
    <StockfishContext.Provider value={value}>
      {children}
    </StockfishContext.Provider>
  );
}
