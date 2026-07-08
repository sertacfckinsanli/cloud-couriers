# Ad videos

The hint button plays a mock rewarded-ad here. To use your own clip:

1. Put a video file named **`ad.mp4`** in this folder
   (full path: `cloud-couriers/ads/ad.mp4`).
2. Reload the game. Press the 💡 hint button in any level.
3. The video plays, a 20-second countdown runs in the top-right corner,
   and after it hits 0 the ✕ becomes clickable. Closing it reveals the hint.

If no `ad.mp4` is present, a pastel "Your Ad Here" placeholder is shown
instead — the countdown and hint flow work exactly the same.

- Format: MP4 (H.264) plays everywhere. WebM also works if you rename the
  `src` in `index.html` accordingly.
- The clip is stretched to a 9:16 portrait frame (`object-fit: cover`),
  so a vertical video looks best.
- Any length is fine; it loops until the 20-second timer finishes.
