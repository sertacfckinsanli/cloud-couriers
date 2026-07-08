// ---------- ambient parallax sky (canvas, behind all screens) ----------
export function initAmbient(host){
  const cv = document.createElement('canvas');
  cv.id = 'sky-canvas';
  host.prepend(cv);
  const ctx = cv.getContext('2d');
  const DPR = Math.min(2, window.devicePixelRatio || 1);
  let W = 0, H = 0;

  function fit(){
    W = host.clientWidth; H = host.clientHeight;
    cv.width = W * DPR; cv.height = H * DPR;
    cv.style.width = W + 'px'; cv.style.height = H + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  fit();
  new ResizeObserver(fit).observe(host);

  // three parallax layers: far / mid / near
  const rnd = (a, b) => a + Math.random() * (b - a);
  const clouds = [];
  const mkLayer = (n, r0, r1, v0, v1, op) => {
    for(let i = 0; i < n; i++) clouds.push({
      x: rnd(-100, 520), y: rnd(20, 760), r: rnd(r0, r1), v: rnd(v0, v1), o: op * rnd(.7, 1),
    });
  };
  mkLayer(5, 14, 24, 0.06, 0.12, 0.35);  // far, slow, faint
  mkLayer(4, 26, 40, 0.14, 0.24, 0.5);   // mid
  mkLayer(3, 44, 62, 0.28, 0.42, 0.65);  // near, fast, bold

  // sleepy stars, visible only in night regions
  const stars = Array.from({length: 26}, () => ({
    x: Math.random(), y: Math.random() * 0.85, r: rnd(0.8, 2.2), ph: Math.random() * 6.28,
  }));

  function drawCloud(c){
    ctx.globalAlpha = c.o;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(c.x, c.y, c.r * 0.62, 0, 7);
    ctx.arc(c.x - c.r * 0.72, c.y + c.r * 0.18, c.r * 0.45, 0, 7);
    ctx.arc(c.x + c.r * 0.72, c.y + c.r * 0.18, c.r * 0.48, 0, 7);
    ctx.arc(c.x + c.r * 0.1, c.y + c.r * 0.3, c.r * 0.55, 0, 7);
    ctx.fill();
  }

  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let t = 0;
  function frame(){
    ctx.clearRect(0, 0, W, H);
    t += 0.02;
    if(host.classList.contains('night')){
      ctx.fillStyle = '#fff8e0';
      for(const s of stars){
        ctx.globalAlpha = 0.35 + 0.4 * Math.abs(Math.sin(t + s.ph));
        ctx.beginPath(); ctx.arc(s.x * W, s.y * H, s.r, 0, 7); ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
    for(const c of clouds){
      drawCloud(c);
      if(!still){
        c.x += c.v;
        if(c.x - c.r * 1.6 > W){ c.x = -c.r * 1.6; c.y = rnd(0.03, 0.92) * H; }
      }
    }
    ctx.globalAlpha = 1;
    if(!still) requestAnimationFrame(frame);
  }
  frame();
}
