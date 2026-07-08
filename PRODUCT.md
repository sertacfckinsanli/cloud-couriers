# Cloud Couriers: The Lost Letter Kingdom

## What it is
A vertical (9:16) mobile casual puzzle game prototype. Players rotate wind arrows to route an
auto-flying cloud courier that picks up letters and delivers them to color-matched floating houses.
20 solver-verified levels across two regions, with star ratings, stamps currency, unlockable
couriers, story letters, and a cosmetic post-office meta layer.

## Audience
Casual mobile players (Candy Crush / Two Dots audience). Short sessions, one-hand play,
all ages. Cute but not babyish; premium-casual polish is the bar.

## Register
Brand: the design IS the product. A game lives or dies on its visual identity and game feel.

## The single job of the surface
Make a first-time player understand the routing mechanic within 30 seconds and feel
"that was cute and satisfying, one more level".

## Voice
Friendly, tiny, warm microcopy ("Ready to fly?", "Mail delivered!", "The wind got tricky!").
Never punishing, never sarcastic. Short sentences only.

## Tech constraints
- Vanilla JS ES modules, no framework, no build step for dev (`npm run dev`).
- Ships as a single self-contained HTML too (`npm run build` → dist/); CSP blocks all external
  hosts, so fonts and art must be inline (SVG, data URIs, WebAudio). No PNGs required.
- Pure engine (`js/engine.js`) shared by game and solvability test (`npm test`); visual work
  must not change engine semantics.
