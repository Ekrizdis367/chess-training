'use strict';
const fs = require('fs');
const path = require('path');

const binDir = path.join(__dirname, '../node_modules/stockfish/bin');
const outDir = path.join(__dirname, '../public/engine');

const jsSource = path.join(binDir, 'stockfish-18-lite-single.js');
const wasmSource = path.join(binDir, 'stockfish-18-lite-single.wasm');
const jsDest = path.join(outDir, 'stockfish.js');
const wasmDest = path.join(outDir, 'stockfish.wasm');

if (!fs.existsSync(jsSource) || !fs.existsSync(wasmSource)) {
  console.warn('Stockfish bin files not found; run npm install stockfish first.');
  process.exit(0);
}

fs.mkdirSync(outDir, { recursive: true });
fs.copyFileSync(jsSource, jsDest);
fs.copyFileSync(wasmSource, wasmDest);
console.log('Stockfish engine copied to public/engine/');
