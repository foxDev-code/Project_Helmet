import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';
import { removeFrameBackdrop } from '../src/components/frameMatte.js';

// Run with: node scripts/check-design.mjs
const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
try {
  const { default: App } = await server.ssrLoadModule('/src/App.jsx');
  const { default: Dashboard } = await server.ssrLoadModule('/src/components/Dashboard.jsx');
  const landing = renderToStaticMarkup(React.createElement(App));
  const dashboard = renderToStaticMarkup(React.createElement(Dashboard));
  assert.match(landing, /Safety\.<br\/>One step/);
  assert.equal((landing.match(/id="three-helmet-canvas"/g) || []).length, 1);
  assert.match(landing, /aria-label="Interactive helmet/);
  assert.doesNotMatch(landing, /href="https:\/\/suraksha-one-ten.vercel.app/);
  assert.match(landing, /aria-label="Mobile navigation"/);
  assert.match(dashboard, /Connected workers<\/span><strong>03/);
  assert.match(dashboard, /Gas warnings<\/span><strong[^>]*>01/);
  assert.match(dashboard, /Fall alerts<\/span><strong[^>]*>01/);
  assert.equal((dashboard.match(/aria-label="View [^"]+ telemetry"/g) || []).length, 3);
  assert.match(await readFile('src/index.css', 'utf8'), /prefers-reduced-motion/);
  await access('public/001.png');
  // Neutral backdrop must disappear without deleting an enclosed grey display.
  const pixels = new Uint8ClampedArray(5 * 5 * 4);
  for (let i = 0; i < 25; i++) pixels.set([160, 161, 162, 255], i * 4);
  for (const i of [6, 7, 8, 11, 13, 16, 17, 18]) pixels.set([60, 20, 25, 255], i * 4);
  removeFrameBackdrop(pixels, 5, 5);
  assert.equal(pixels[3], 0);
  assert.equal(pixels[12 * 4 + 3], 255);
  assert.equal(pixels[6 * 4 + 3], 255);
  const loops = new Uint8ClampedArray(20 * 20 * 4);
  for (let i = 0; i < 400; i++) loops.set([160, 161, 162, 255], i * 4);
  for (const [top, bottom] of [[2, 6], [12, 18]]) {
    for (let y = top; y <= bottom; y++) {
      for (let x = 7; x <= 13; x++) {
        if (y === top || y === bottom || x === 7 || x === 13) loops.set([40, 20, 25, 255], (y * 20 + x) * 4);
      }
    }
  }
  removeFrameBackdrop(loops, 20, 20);
  assert.equal(loops[(4 * 20 + 10) * 4 + 3], 255, 'Keep the enclosed display');
  assert.equal(loops[(15 * 20 + 10) * 4 + 3], 0, 'Clear the backdrop inside the lower strap');
  const { default: TelemetryHUD } = await server.ssrLoadModule('/src/components/TelemetryHUD.jsx');
  for (const progress of [0, .3, .5, .75, 1]) {
    const hud = renderToStaticMarkup(React.createElement(TelemetryHUD, { progress }));
    assert.equal((hud.match(/class="story-step active"/g) || []).length, 1);
    assert.match(hud, /SCENARIO TELEMETRY \/ SIMULATED/);
  }
  console.log('Design smoke check passed: landing, local dashboard actions, roster counts, and accessibility controls.');
} finally {
  await server.close();
}
