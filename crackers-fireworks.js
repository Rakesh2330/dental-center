/**
 * ============================================================================
 * CELEBRATION CRACKERS & FIREWORKS ENGINE
 * Designed for: Dr. Ahalya’s Dento Neuro Centre Web Launch
 * Drop-in script: Add <script src="crackers-fireworks.js"></script> to any page!
 * ============================================================================
 */
(function () {
  'use strict';

  // Prevent duplicate injections
  if (window.__CELEBRATION_FIREWORKS_LOADED__) return;
  window.__CELEBRATION_FIREWORKS_LOADED__ = true;

  // -------------------------------------------------------------------------
  // 1. Silent Audio Engine (Sound Completely Disabled)
  // -------------------------------------------------------------------------
  function getAudioContext() { return null; }
  function playFireworkBoom() {}
  function playCrackerPop() {}

  // -------------------------------------------------------------------------
  // 2. Setup Celebration Overlay Elements
  // -------------------------------------------------------------------------
  function initFireworksCelebration() {
    // Create celebration canvas
    const canvas = document.createElement('canvas');
    canvas.id = 'webpage-fireworks-canvas';
    canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 999998;
    `;
    document.body.appendChild(canvas);

    // Create celebration announcement banner
    const banner = document.createElement('div');
    banner.id = 'webpage-celebration-banner';
    banner.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%) translateY(-20px);
      z-index: 999999;
      display: flex;
      align-items: center;
      gap: 12px;
      background: rgba(3, 15, 30, 0.92);
      border: 1.5px solid rgba(0, 229, 255, 0.65);
      border-radius: 999px;
      padding: 10px 22px;
      box-shadow: 0 10px 35px rgba(0, 0, 0, 0.6), 0 0 25px rgba(0, 229, 255, 0.4);
      color: #ffffff;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      font-weight: 600;
      opacity: 0;
      transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
    `;

    banner.innerHTML = `
      <span style="font-size: 18px;">✨</span>
      <span><strong>Dr. Ahalya’s Dento Neuro Centre</strong> • Website Unveiled!</span>
      <button id="banner-reignite-btn" style="
        background: linear-gradient(135deg, #00e5ff 0%, #00f5d4 100%);
        color: #031526;
        border: none;
        padding: 5px 12px;
        border-radius: 999px;
        font-size: 12px;
        font-weight: 700;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 4px;
      ">🎆 More Crackers</button>
      <button id="banner-dismiss-btn" style="
        background: transparent;
        color: rgba(255, 255, 255, 0.7);
        border: none;
        font-size: 16px;
        cursor: pointer;
        padding: 0 4px;
        line-height: 1;
      " title="Dismiss">✕</button>
    `;
    document.body.appendChild(banner);

    // Animate banner entry
    setTimeout(() => {
      banner.style.opacity = '1';
      banner.style.transform = 'translateX(-50%) translateY(0)';
    }, 400);

    // -----------------------------------------------------------------------
    // 3. Canvas Simulation Logic
    // -----------------------------------------------------------------------
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const rockets = [];
    const particles = [];
    let isRunning = false;
    let animId = null;
    let barrageInterval = null;

    function launchRocket() {
      const x = width * 0.12 + Math.random() * (width * 0.76);
      const targetY = height * 0.12 + Math.random() * (height * 0.38);
      const speed = 13 + Math.random() * 5;
      const colors = ['#00e5ff', '#00f5d4', '#ffd166', '#ff758c', '#ffffff', '#a855f7', '#38bdf8'];
      rockets.push({
        x: x,
        y: height,
        vx: (Math.random() - 0.5) * 2.5,
        vy: -speed,
        targetY: targetY,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    function launchCrackerSalvo() {
      const x = width * 0.15 + Math.random() * (width * 0.7);
      const y = height * 0.2 + Math.random() * (height * 0.45);
      explodeCracker(x, y);
      playCrackerPop();
    }

    function explodeShell(x, y, color) {
      playFireworkBoom();
      const count = 75 + Math.floor(Math.random() * 45);
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.2;
        const speed = 3.5 + Math.random() * 8.5;
        particles.push({
          x: x,
          y: y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color: color,
          alpha: 1,
          decay: 0.014 + Math.random() * 0.014,
          gravity: 0.11,
          isCracker: false
        });
      }
    }

    function explodeCracker(x, y) {
      const count = 40 + Math.floor(Math.random() * 30);
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2.5 + Math.random() * 9;
        particles.push({
          x: x,
          y: y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color: Math.random() > 0.45 ? '#ffd166' : '#ffffff',
          alpha: 1,
          decay: 0.03 + Math.random() * 0.03,
          gravity: 0.16,
          isCracker: true
        });
      }
    }

    function animationLoop() {
      ctx.clearRect(0, 0, width, height);

      // Draw and update ascending rockets
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.x += r.vx;
        r.y += r.vy;

        // Sparkle head
        ctx.beginPath();
        ctx.arc(r.x, r.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 12;
        ctx.shadowColor = r.color;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Golden ascent trail spark
        ctx.beginPath();
        ctx.arc(r.x - r.vx * 1.5, r.y + 4, 2, 0, Math.PI * 2);
        ctx.fillStyle = '#ffd166';
        ctx.globalAlpha = 0.75;
        ctx.fill();
        ctx.globalAlpha = 1;

        if (r.y <= r.targetY || r.vy >= 0) {
          explodeShell(r.x, r.y, r.color);
          rockets.splice(i, 1);
        }
      }

      // Draw and update exploding particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= 0.975;
        p.vy *= 0.975;
        p.alpha -= p.decay;

        if (p.isCracker) {
          p.x += (Math.random() - 0.5) * 1.6;
          p.y += (Math.random() - 0.5) * 1.6;
        }

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        const radius = p.isCracker ? 1.8 : 2.5;
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = p.isCracker && Math.random() > 0.5 ? '#ffffff' : p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowBlur = p.isCracker ? 6 : 12;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      }

      if (rockets.length > 0 || particles.length > 0 || isRunning) {
        animId = requestAnimationFrame(animationLoop);
      } else {
        animId = null;
        ctx.clearRect(0, 0, width, height);
      }
    }

    function startCelebrationShow(durationMs = 9000) {
      isRunning = true;
      if (!animId) animationLoop();

      clearInterval(barrageInterval);
      barrageInterval = setInterval(() => {
        if (!isRunning) {
          clearInterval(barrageInterval);
          return;
        }
        launchRocket();
        if (Math.random() > 0.35) {
          launchCrackerSalvo();
        }
      }, 450);

      // Immediate opening salvo
      launchRocket();
      launchRocket();
      launchCrackerSalvo();

      if (durationMs > 0) {
        setTimeout(() => {
          isRunning = false;
          clearInterval(barrageInterval);
        }, durationMs);
      }
    }

    // Banner interactions
    const reigniteBtn = document.getElementById('banner-reignite-btn');
    if (reigniteBtn) {
      reigniteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        startCelebrationShow(6000);
      });
    }

    const dismissBtn = document.getElementById('banner-dismiss-btn');
    if (dismissBtn) {
      dismissBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        banner.style.opacity = '0';
        banner.style.transform = 'translateX(-50%) translateY(-20px)';
        setTimeout(() => banner.remove(), 500);
      });
    }

    // Auto-fade banner after 12 seconds
    setTimeout(() => {
      if (document.body.contains(banner)) {
        banner.style.opacity = '0';
        banner.style.transform = 'translateX(-50%) translateY(-20px)';
        setTimeout(() => banner.remove(), 500);
      }
    }, 12000);

    // Start show immediately upon load
    startCelebrationShow(9500);

    // Export global trigger function
    window.triggerFireworks = function (duration = 6000) {
      startCelebrationShow(duration);
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFireworksCelebration);
  } else {
    initFireworksCelebration();
  }
})();
