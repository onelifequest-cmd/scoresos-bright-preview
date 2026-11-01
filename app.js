/**
 * Score OS — Bright Credit & Funding Preview
 * Light-scene holograms: particle score ribbons, approval sparks, capital pillars.
 * Preview only. Illustrative / CROA-safe.
 */
import * as THREE from 'three';

const FEATURES = [
  { name: 'Credit Monitoring', desc: 'Real-time 3-bureau credit monitoring built in, so you and your clients always know the score.', num: 3, suffix: ' bureaus' },
  { name: 'Agency CRM', desc: 'Manage leads, clients, documents, and notes in one command center built for high-volume agencies.', num: 1, suffix: ' command center' },
  { name: 'Marketing', desc: 'Built-in marketing tools to capture leads and turn them into signed, paying clients.', num: 1, suffix: ' growth engine' },
  { name: 'Free Website', desc: 'A professional, conversion-ready website included free — your agency online and taking leads in minutes.', num: 1, suffix: ' site included' },
  { name: '3-Bureau Tracking', desc: 'Track disputes across Equifax, Experian, and TransUnion on one live scoreboard — no more spreadsheets.', num: 3, suffix: ' bureaus live' },
  { name: 'AI Dispute Engine', desc: 'Maxine reads each credit report and drafts unique, non-templated letters the bureaus can\'t auto-reject.', num: 1, suffix: ' Maxine AI' },
  { name: 'White-Label Portal', desc: 'Your logo, your colors, your brand. Clients log into a premium portal that looks like you built it yourself.', num: 100, suffix: '% your brand' },
  { name: '2-Way Messaging', desc: 'Secure two-way chat keeps every client conversation inside the platform, off your personal phone.', num: 2, suffix: '-way chat' },
  { name: 'Booking Calendar', desc: 'Let clients book consultations around the clock with a built-in scheduling calendar.', num: 24, suffix: '/7 booking' },
  { name: 'Mentorship', desc: 'Learn from operators who\'ve scaled — ongoing mentorship to help you grow your agency faster.', num: 1, suffix: ' mentorship path' },
  { name: 'Community', desc: 'Join a private community of credit repair owners leveling up and sharing wins together.', num: 1, suffix: ' private community' },
  { name: 'Training Videos', desc: 'A full library of training videos to onboard fast and master every play in the platform.', num: 1, suffix: ' training library' },
  { name: 'Support System', desc: 'A built-in support system so you\'re never stuck — real help exactly when you need it.', num: 1, suffix: ' support system' },
  { name: 'Tons of Automations', desc: 'Smart automations handle the busywork — follow-ups, progress updates, and reminders on autopilot.', num: 1, suffix: ' autopilot' },
];

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) || window.innerWidth < 720;

/* ---------- UI: chips + arsenal panels ---------- */
const chips = document.getElementById('chips');
const chipNames = FEATURES.map((f) => f.name.replace('Tons of Automations', 'Automations'));
[...chipNames, ...chipNames].forEach((name) => {
  const s = document.createElement('span');
  s.textContent = name;
  chips.appendChild(s);
});

const grid = document.getElementById('panel-grid');
FEATURES.forEach((f, i) => {
  const el = document.createElement('article');
  el.className = 'glass-panel';
  el.dataset.idx = String(i);
  el.innerHTML = `
    <p class="panel-num">${f.num}${f.suffix}</p>
    <h3>${f.name}</h3>
    <p>${f.desc}</p>
    <span class="tag">From live scoresos.com</span>`;
  grid.appendChild(el);
});

/* ---------- Nav toggle ---------- */
const navToggle = document.getElementById('nav-toggle');
const nav = document.querySelector('.nav');
navToggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
});

/* ---------- Gauge / chart / skyline reveals ---------- */
function animateCount(el, target, ms = 1600) {
  const start = performance.now();
  const from = 0;
  function tick(now) {
    const t = Math.min(1, (now - start) / ms);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = String(Math.round(from + (target - from) * eased));
    if (t < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

function armGauges() {
  document.querySelectorAll('.gauge').forEach((g, i) => {
    const target = Number(g.dataset.target || 700);
    // Map ~300-850 FICO-ish display to ring fill (demo)
    const p = Math.min(0.92, Math.max(0.45, (target - 300) / 550));
    g.style.setProperty('--p', String(p));
    setTimeout(() => {
      g.classList.add('on');
      const score = g.querySelector('.gauge-score');
      if (score) animateCount(score, target, 1700 + i * 120);
    }, 180 + i * 160);
  });
  document.getElementById('mini-chart')?.classList.add('on');
}

const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    if (el.id === 'score-gauges' || el.classList.contains('hero-stage')) armGauges();
    if (el.id === 'skyline') {
      el.querySelectorAll('.sky-col').forEach((col, i) => {
        setTimeout(() => col.classList.add('on'), i * 90);
      });
    }
    if (el.classList.contains('glass-panel') || el.matches('.panel-grid article')) {
      el.classList.add('show');
    }
    io.unobserve(el);
  });
}, { threshold: 0.2 });

document.querySelectorAll('.hero-stage, #skyline, .panel-grid article').forEach((el) => io.observe(el));

/* ---------- Parallax for fly cards / gauges ---------- */
const stage = document.querySelector('.hero-stage');
const flyCards = document.querySelectorAll('.fly-card');
const gauges = document.querySelectorAll('.gauge');
let mx = 0, my = 0, sx = 0, sy = 0;
window.addEventListener('pointermove', (e) => {
  mx = (e.clientX / window.innerWidth) * 2 - 1;
  my = (e.clientY / window.innerHeight) * 2 - 1;
}, { passive: true });

function parallaxTick() {
  sx += (mx - sx) * 0.06;
  sy += (my - sy) * 0.06;
  if (stage && !isMobile) {
    gauges.forEach((g, i) => {
      const depth = (i - 1) * 8;
      g.style.transform = `translate3d(${sx * (10 + depth)}px, ${sy * (6 + depth) + (g.classList.contains('featured') ? -8 : 12)}px, 0) scale(${g.classList.contains('featured') ? 1.08 : 1})`;
    });
    flyCards.forEach((c, i) => {
      const d = 12 + i * 6;
      c.style.translate = `${sx * d}px ${sy * d * 0.6}px`;
    });
  }
  requestAnimationFrame(parallaxTick);
}
if (!reduced) parallaxTick();

/* ---------- Lenis + reveal ---------- */
let lenis = null;
if (!reduced && window.Lenis) {
  lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    lenis.on('scroll', ScrollTrigger.update);
  }
}

/* ---------- Three.js bright hologram field ---------- */
const canvas = document.getElementById('holo-canvas');
const holoRoot = document.getElementById('holo-root');

function initThree() {
  if (!canvas || reduced) {
    if (holoRoot) holoRoot.style.opacity = '0.35';
    return;
  }

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: !isMobile,
    alpha: true,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.25 : 1.75));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0.4, 9.5);

  const mouse = new THREE.Vector2(0, 0);
  const mouseSmooth = new THREE.Vector2(0, 0);
  window.addEventListener('pointermove', (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  }, { passive: true });

  // Soft ambient light particles (green/gold on bright — keep subtle)
  const COUNT = isMobile ? 1800 : 5200;
  const positions = new Float32Array(COUNT * 3);
  const colors = new Float32Array(COUNT * 3);
  const seeds = new Float32Array(COUNT);
  const green = new THREE.Color('#22A35A');
  const gold = new THREE.Color('#D4AF37');
  const mint = new THREE.Color('#7BC99A');

  for (let i = 0; i < COUNT; i++) {
    const i3 = i * 3;
    // Bias particles to the right/hero stage area in NDC-ish world space
    positions[i3] = (Math.random() - 0.25) * 14;
    positions[i3 + 1] = (Math.random() - 0.45) * 8;
    positions[i3 + 2] = (Math.random() - 0.5) * 10 - 1;
    seeds[i] = Math.random();
    const c = seeds[i] > 0.72 ? gold : (seeds[i] > 0.35 ? green : mint);
    colors[i3] = c.r; colors[i3 + 1] = c.g; colors[i3 + 2] = c.b;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));

  const mat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.NormalBlending,
    vertexColors: true,
    uniforms: {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uScroll: { value: 0 },
      uPixelRatio: { value: renderer.getPixelRatio() },
      uSize: { value: isMobile ? 22 : 34 },
    },
    vertexShader: /* glsl */`
      attribute float aSeed;
      uniform float uTime;
      uniform vec2 uMouse;
      uniform float uScroll;
      uniform float uPixelRatio;
      uniform float uSize;
      varying float vAlpha;
      varying vec3 vColor;
      float hash(float n){ return fract(sin(n)*43758.5453); }
      void main(){
        vColor = color;
        vec3 p = position;
        float t = uTime * (0.35 + aSeed * 0.4);
        // Rising score ribbons: y boosted in sine bands
        float ribbon = sin(p.x * 0.55 + t) * cos(p.z * 0.35 + t * 0.7);
        p.y += ribbon * 0.55 + sin(aSeed * 6.28 + t) * 0.25;
        // Capital pillars: cluster toward discrete x columns as scroll rises
        float pillar = floor((p.x + 7.0) / 2.4) * 2.4 - 6.0;
        float toPillar = smoothstep(0.15, 0.65, uScroll);
        p.x = mix(p.x, mix(p.x, pillar, 0.65), toPillar * (0.35 + aSeed * 0.4));
        p.y = mix(p.y, abs(p.y) * (0.8 + aSeed) + 0.2, toPillar * 0.45);
        // Cursor parallax push
        vec2 md = p.xy - uMouse * 3.5;
        float d = length(md);
        p.xy += normalize(md + 0.0001) * exp(-d * 0.55) * 0.35;
        p.y += sin(d * 3.0 - uTime * 3.0) * exp(-d * 0.7) * 0.2;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = uSize * uPixelRatio * (0.55 + aSeed * 0.9) / max(1.0, -mv.z);
        vAlpha = 0.32 + aSeed * 0.42;
      }
    `,
    fragmentShader: /* glsl */`
      varying float vAlpha;
      varying vec3 vColor;
      void main(){
        vec2 uv = gl_PointCoord - 0.5;
        float r = length(uv);
        if (r > 0.5) discard;
        float glow = smoothstep(0.5, 0.05, r);
        gl_FragColor = vec4(vColor, vAlpha * glow);
      }
    `,
  });

  const points = new THREE.Points(geo, mat);
  scene.add(points);

  // Floating approval "card" quads (simple planes with emissive-ish color)
  const cardGroup = new THREE.Group();
  scene.add(cardGroup);
  const cardGeo = new THREE.PlaneGeometry(0.9, 0.55);
  for (let i = 0; i < (isMobile ? 3 : 6); i++) {
    const cmat = new THREE.MeshBasicMaterial({
      color: i % 2 ? 0xD4AF37 : 0x22A35A,
      transparent: true,
      opacity: 0.28,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(cardGeo, cmat);
    mesh.position.set((Math.random() - 0.2) * 8, (Math.random() - 0.3) * 4, -1 - Math.random() * 3);
    mesh.rotation.z = (Math.random() - 0.5) * 0.4;
    mesh.userData = { phase: Math.random() * Math.PI * 2, speed: 0.3 + Math.random() * 0.4 };
    cardGroup.add(mesh);
  }

  // Soft torus "gauge rings" in 3D behind UI gauges
  const ringGroup = new THREE.Group();
  scene.add(ringGroup);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0x1A6B3C, transparent: true, opacity: 0.22 });
  const goldRingMat = new THREE.MeshBasicMaterial({ color: 0xD4AF37, transparent: true, opacity: 0.28 });
  for (let i = 0; i < 3; i++) {
    const torus = new THREE.Mesh(new THREE.TorusGeometry(0.7 + i * 0.05, 0.03, 12, 64), i === 1 ? goldRingMat : ringMat);
    torus.position.set(2.2 + i * 1.5, 0.8, -0.5);
    torus.rotation.x = Math.PI * 0.55;
    ringGroup.add(torus);
  }

  let t0 = performance.now();
  function onResize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    mat.uniforms.uPixelRatio.value = renderer.getPixelRatio();
  }
  window.addEventListener('resize', onResize);

  function frame(now) {
    const t = (now - t0) / 1000;
    mouseSmooth.lerp(mouse, 0.06);
    mat.uniforms.uTime.value = t;
    mat.uniforms.uMouse.value.set(mouseSmooth.x, mouseSmooth.y);
    const scroll = Math.min(1, window.scrollY / Math.max(1, window.innerHeight * 2.2));
    mat.uniforms.uScroll.value = scroll;

    camera.position.x = mouseSmooth.x * 0.35;
    camera.position.y = 0.4 + mouseSmooth.y * 0.2;
    camera.lookAt(1.5, 0.3, 0);

    cardGroup.children.forEach((m) => {
      m.position.y += Math.sin(t * m.userData.speed + m.userData.phase) * 0.002;
      m.rotation.z = Math.sin(t * 0.4 + m.userData.phase) * 0.15;
      m.position.x += Math.sin(t * 0.25 + m.userData.phase) * 0.0015;
    });
    ringGroup.rotation.z = t * 0.08;
    ringGroup.position.x = 0.4 + mouseSmooth.x * 0.3;
    ringGroup.visible = !isMobile && scroll < 0.55;

    // Fade particle field as user scrolls deep so content stays crisp
    const fade = scroll > 0.7 ? 0.35 : 1 - scroll * 0.4;
    holoRoot.style.opacity = String(Math.max(0.25, fade));

    renderer.render(scene, camera);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

initThree();

// Kick gauges soon on load for hero visibility
setTimeout(armGauges, 400);
