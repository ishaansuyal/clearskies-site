/* ── Mobile nav ── */
const toggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
if (toggle && navLinks) {
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('open');
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      toggle.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });
}

/* ── Sensor readout animation ── */
const readingEl = document.getElementById('reading-value');
const markerEl  = document.getElementById('scale-marker');

const TARGET_READING = 2.4;
const MAX_SCALE      = 8.0;
const ANIM_DURATION  = 1800;

function animateReading() {
  if (!readingEl) return;
  const start = performance.now();

  function tick(now) {
    const elapsed  = Math.min(now - start, ANIM_DURATION);
    const progress = elapsed / ANIM_DURATION;
    const eased    = 1 - Math.pow(1 - progress, 3);
    readingEl.textContent = (eased * TARGET_READING).toFixed(1);

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      readingEl.textContent = TARGET_READING.toFixed(1);
      if (markerEl) {
        const pct = (TARGET_READING / MAX_SCALE) * 100;
        markerEl.style.left = pct + '%';
      }
    }
  }

  requestAnimationFrame(tick);
}

/* ── Sensor bar chart ── */
const readings = [1.8, 1.9, 2.0, 2.1, 1.9, 2.2, 2.3, 2.4,
                  2.3, 2.5, 2.4, 2.6, 2.3, 4.2, 4.8, 4.1,
                  3.2, 2.6, 2.4, 2.4];

function buildBars() {
  const chartEl = document.getElementById('mini-chart');
  if (!chartEl) return;
  const max = 6.0;
  readings.forEach((val, i) => {
    const bar = document.createElement('div');
    bar.className = 'mini-bar';
    bar.style.height = ((val / max) * 100) + '%';
    if (val >= 4.0)                     bar.classList.add('b-spike');
    else if (i === readings.length - 1) bar.classList.add('b-current');
    chartEl.appendChild(bar);
  });
}

/* ── Sensor timestamp ── */
function updateSensorTime() {
  const el = document.getElementById('sensor-time');
  if (!el) return;
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  el.textContent = `${h}:${m}:${s}`;
}

/* ── Contact form (EmailJS) ── */
const form       = document.getElementById('contact-form');
const successMsg = document.getElementById('form-success');
const submitBtn  = form ? form.querySelector('button[type="submit"]') : null;

if (form && typeof emailjs !== 'undefined') {
  emailjs.init('ZtpWB9G3Fv1F83b18');

  form.addEventListener('submit', async e => {
    e.preventDefault();
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    const params = {
      from_name:  form.querySelector('#name').value,
      from_email: form.querySelector('#email').value,
      subject:    form.querySelector('#subject').value,
      message:    form.querySelector('#message').value,
    };

    try {
      await emailjs.send('service_cjuo8d6', 'template_hstt2br', params);
      form.reset();
      if (successMsg) successMsg.classList.add('show');
    } catch {
      alert('Could not send message. Please try again or reach out on Instagram.');
    } finally {
      submitBtn.textContent = 'Send Message';
      submitBtn.disabled = false;
    }
  });
}

/* ── Photo collage ── */
/* Add new photos here: drop the file in images/, then add a line below. */
const PHOTOS = [
  { src: 'images/who13-interview.png', alt: 'Ishaan Suyal being interviewed in the WHO 13 studio', caption: 'WHO 13 studio interview · Des Moines, IA' },
  { src: 'images/win.png', alt: 'Ishaan Suyal accepting 2nd Place in Engineering at SSTFI', caption: '2nd Place Engineering · SSTFI, Ames, IA' },
  { src: 'images/green-iowa-americorps.jpeg', alt: 'Ishaan Suyal presenting ClearSkies to Green Iowa AmeriCorps', caption: 'Presenting to Green Iowa AmeriCorps · Des Moines, IA' },
];

function buildCarousel() {
  const track  = document.getElementById('carousel-track');
  const dotsEl = document.getElementById('carousel-dots');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  if (!track || !PHOTOS.length) return;

  let index = 0;

  PHOTOS.forEach(photo => {
    const slide = document.createElement('div');
    slide.className = 'carousel-slide';

    const img = document.createElement('img');
    img.src = photo.src;
    img.alt = photo.alt;
    slide.appendChild(img);

    if (photo.caption) {
      const caption = document.createElement('div');
      caption.className = 'carousel-caption';
      caption.textContent = photo.caption;
      slide.appendChild(caption);
    }

    track.appendChild(slide);
  });

  const dots = PHOTOS.map((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot';
    dot.setAttribute('aria-label', `Go to photo ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsEl.appendChild(dot);
    return dot;
  });

  function goTo(i) {
    index = (i + PHOTOS.length) % PHOTOS.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, di) => d.classList.toggle('active', di === index));
  }

  if (prevBtn) prevBtn.addEventListener('click', () => goTo(index - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goTo(index + 1));

  if (PHOTOS.length <= 1) {
    if (prevBtn) prevBtn.style.display = 'none';
    if (nextBtn) nextBtn.style.display = 'none';
  }

  goTo(0);
}

/* ── Atmosphere: sky → ground scene ── */
function initScene() {
  const ground = document.querySelector('.scene-ground');
  const clouds = document.querySelectorAll('.cloud');
  if (!ground) return;

  function update() {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? Math.min(Math.max(window.scrollY / scrollable, 0), 1) : 0;

    ground.style.opacity = Math.min(progress / 0.7, 1);

    const cloudOpacity = Math.max(1 - progress / 0.35, 0);
    clouds.forEach((cloud, i) => {
      cloud.style.opacity = cloudOpacity;
      cloud.style.transform = `translate(${progress * -30}px, ${progress * -(30 + i * 12)}px)`;
    });
  }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => { update(); ticking = false; });
      ticking = true;
    }
  }, { passive: true });
  window.addEventListener('resize', update);
  update();
}

/* ── Scroll cue ── */
function initScrollCue() {
  const cue = document.getElementById('scroll-cue');
  if (!cue) return;

  const hasMoreBelow = () => document.documentElement.scrollHeight - window.innerHeight > 120;

  function update() {
    cue.classList.toggle('hidden', !hasMoreBelow() || window.scrollY > 80);
  }

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
}

/* ── Init ── */
document.addEventListener('DOMContentLoaded', () => {
  buildBars();
  buildCarousel();
  animateReading();
  updateSensorTime();
  setInterval(updateSensorTime, 1000);
  initScene();
  initScrollCue();
});
