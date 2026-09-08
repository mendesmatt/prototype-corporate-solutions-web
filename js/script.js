const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 120);
});

const hamb = document.getElementById('hamb');
const mobileMenu = document.getElementById('mobileMenu');
hamb.addEventListener('click', () => {
  mobileMenu.classList.toggle('hidden');
  hamb.firstElementChild.classList.toggle('fa-bars');
  hamb.firstElementChild.classList.toggle('fa-xmark');
});
mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  mobileMenu.classList.add('hidden');
  hamb.firstElementChild.classList.add('fa-bars');
  hamb.firstElementChild.classList.remove('fa-xmark');
}));

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reduceMotion) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
} else {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
}

const counters = document.querySelectorAll('[data-count]');
const ioNum = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    ioNum.unobserve(e.target);
    const target = +e.target.dataset.count;
    if (reduceMotion) { e.target.textContent = target; return; }
    const start = performance.now(), dur = 1200;
    const tick = now => {
      const p = Math.min((now - start) / dur, 1);
      e.target.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}, { threshold: 0.5 });
counters.forEach(c => ioNum.observe(c));

const ba = document.getElementById('baSlider');
const baAfter = ba.querySelector('.ba-after');
const baHandle = document.getElementById('baHandle');
function setBA(clientX) {
  const r = ba.getBoundingClientRect();
  const pct = Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100));
  baAfter.style.clipPath = `inset(0 0 0 ${pct}%)`;
  baHandle.style.left = pct + '%';
}
let dragging = false;
ba.addEventListener('pointerdown', e => { dragging = true; ba.setPointerCapture(e.pointerId); setBA(e.clientX); });
ba.addEventListener('pointermove', e => { if (dragging) setBA(e.clientX); });
ba.addEventListener('pointerup', () => dragging = false);
ba.addEventListener('pointercancel', () => dragging = false);
