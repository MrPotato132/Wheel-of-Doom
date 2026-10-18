/**
 * WHEEL OF FAITH - WHEEL CANVAS & PHYSICS ENGINE
 * - 100% Locked Spin-to-Outcome Synchronization (exact integer full rotations + pointer verification)
 * - Dark-to-Light Blue Rarity Slice Gradient (Common = deep midnight blue -> God-Tier = luminous ice blue)
 * - Balanced Rarity Weights (Rarer slices are slimmer, yet fair and achievable to land on)
 * - Winning Slice Highlight Pulse before modal reveal
 */

const RARITY_WEIGHTS = {
  common: 4.0,
  uncommon: 3.3,
  rare: 2.7,
  epic: 2.2,
  legendary: 1.75,
  mythic: 1.4,
  godTier: 1.15,
  chaos: 1.5
};

const RARITY_ORDER = {
  common: 1,
  uncommon: 2,
  rare: 3,
  epic: 4,
  legendary: 5,
  mythic: 6,
  godTier: 7,
  chaos: 8
};

// Darkest Blue (Common) -> Lightest Ice Blue (God-Tier)
const RARITY_BLUE_PALETTE = {
  common: {
    inner: '#040a14',
    midEven: '#0b1d3a',
    midOdd: '#0e2447',
    outerEven: '#122b54',
    outerOdd: '#163566',
    dot: '#64748b',
    lightText: true
  },
  uncommon: {
    inner: '#061224',
    midEven: '#133361',
    midOdd: '#173c73',
    outerEven: '#1b4585',
    outerOdd: '#205099',
    dot: '#7dd3fc',
    lightText: true
  },
  rare: {
    inner: '#091b36',
    midEven: '#1b498c',
    midOdd: '#1f539e',
    outerEven: '#1d4ed8',
    outerOdd: '#2563eb',
    dot: '#38bdf8',
    lightText: true
  },
  epic: {
    inner: '#0d264a',
    midEven: '#2563eb',
    midOdd: '#2f6ef0',
    outerEven: '#3b82f6',
    outerOdd: '#4b8df8',
    dot: '#60a5fa',
    lightText: true
  },
  legendary: {
    inner: '#123563',
    midEven: '#0284c7',
    midOdd: '#0ea5e9',
    outerEven: '#38bdf8',
    outerOdd: '#52c7fa',
    dot: '#00f0ff',
    lightText: true
  },
  mythic: {
    inner: '#19487d',
    midEven: '#38bdf8',
    midOdd: '#56c8fa',
    outerEven: '#7dd3fc',
    outerOdd: '#93dcfe',
    dot: '#e0f2fe',
    lightText: false
  },
  godTier: {
    inner: '#24639e',
    midEven: '#7dd3fc',
    midOdd: '#93dcfe',
    outerEven: '#bae6fd',
    outerOdd: '#e0f2fe',
    dot: '#ffffff',
    lightText: false
  },
  chaos: {
    inner: '#114259',
    midEven: '#0891b2',
    midOdd: '#06b6d4',
    outerEven: '#22d3ee',
    outerOdd: '#67e8f9',
    dot: '#00f0ff',
    lightText: false
  }
};

class WheelOfFaith {
  constructor(canvasId, options = {}) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.options = Object.assign({
      onSpinStart: () => {},
      onSpinEnd: () => {},
      onTick: () => {}
    }, options);

    this.wheelData = null;
    this.preparedSegments = [];
    this.totalWeight = 0;
    this.currentAngle = 0; // in radians
    this.angularVelocity = 0;
    this.isSpinning = false;
    this.lastLandedSegment = null;
    this.highlightedSegmentIdx = -1;
    this.isEqualizerActive = false;

    // Physical pointer / flapper state
    this.flapperAngle = 0;
    this.lastPassedSegmentIdx = -1;

    // Victory particles
    this.particles = [];
    this.lastFrameTime = performance.now();

    this.initCanvas();
    window.addEventListener('resize', () => this.handleResize());
    this.animate();
  }

  initCanvas() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    const size = Math.min(rect.width, rect.height || rect.width) || 360;
    const dpr = window.devicePixelRatio || 1;

    this.width = size;
    this.height = size;
    this.centerX = this.width / 2;
    this.centerY = this.height / 2;
    this.radius = (this.width / 2) - 20;

    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;

    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  handleResize() {
    this.initCanvas();
    this.draw();
  }

  setEqualizerMode(active = false) {
    this.isEqualizerActive = active;
    if (this.wheelData) {
      this.prepareSegments();
      this.draw();
    }
  }

  setWheelData(wheelData) {
    this.wheelData = wheelData;
    this.angularVelocity = 0;
    this.isSpinning = false;
    this.lastLandedSegment = null;
    this.highlightedSegmentIdx = -1;
    this.lastPassedSegmentIdx = -1;
    this.prepareSegments();
    // Align initial angle so segment 0 starts cleanly at top pointer
    if (this.preparedSegments.length > 0) {
      this.currentAngle = (3 * Math.PI / 2) - this.preparedSegments[0].centerAngle;
    } else {
      this.currentAngle = 0;
    }
    this.draw();
  }

  prepareSegments() {
    if (!this.wheelData || !this.wheelData.segments || !this.wheelData.segments.length) {
      this.preparedSegments = [];
      this.totalWeight = 0;
      return;
    }

    // Preserve original index before sorting so Almanac / forced spins always match
    const raw = this.wheelData.segments.map((seg, idx) => ({
      ...seg,
      originalIndex: idx
    }));

    // Sort segments by rarity so Common -> Uncommon -> Rare -> Epic -> Legendary -> Mythic -> God-Tier
    // forms a smooth Dark Blue -> Light Ice Blue progression around the wheel
    if (!this.isEqualizerActive) {
      raw.sort((a, b) => {
        const orderA = RARITY_ORDER[a.rarity || 'common'] || 1;
        const orderB = RARITY_ORDER[b.rarity || 'common'] || 1;
        if (orderA !== orderB) return orderA - orderB;
        return a.originalIndex - b.originalIndex;
      });
    }

    let totalW = 0;
    this.preparedSegments = raw.map((seg, preparedIdx) => {
      let w = 1.0;
      if (!this.isEqualizerActive) {
        w = RARITY_WEIGHTS[seg.rarity || 'common'] || 2.5;
      }
      totalW += w;
      return {
        ...seg,
        preparedIndex: preparedIdx,
        weight: w,
        startAngle: 0,
        endAngle: 0,
        centerAngle: 0,
        arc: 0
      };
    });

    this.totalWeight = totalW;

    let runningAngle = 0;
    for (let i = 0; i < this.preparedSegments.length; i++) {
      const seg = this.preparedSegments[i];
      const arc = (seg.weight / this.totalWeight) * (Math.PI * 2);
      seg.arc = arc;
      seg.startAngle = runningAngle;
      seg.endAngle = runningAngle + arc;
      seg.centerAngle = runningAngle + arc / 2;
      runningAngle += arc;
    }
    // Clamp final endAngle to exact 2*PI to prevent floating-point gap at boundary
    if (this.preparedSegments.length > 0) {
      this.preparedSegments[this.preparedSegments.length - 1].endAngle = Math.PI * 2;
    }
  }

  /**
   * Returns the exact index in this.preparedSegments currently underneath the top pointer (3*PI/2)
   */
  getSegmentIndexAtPointer(angle = this.currentAngle) {
    if (!this.preparedSegments.length) return 0;
    const twoPi = Math.PI * 2;
    const pointerAngle = (3 * Math.PI) / 2;
    const effectiveAngle = (((pointerAngle - angle) % twoPi) + twoPi) % twoPi;

    for (let i = 0; i < this.preparedSegments.length; i++) {
      const s = this.preparedSegments[i];
      if (effectiveAngle >= s.startAngle && effectiveAngle < s.endAngle) {
        return i;
      }
    }
    return this.preparedSegments.length - 1;
  }

  /**
   * Spin the wheel.
   * @param {number|string|null} forceTarget - Optional originalIndex or segment text to land on
   */
  spin(forceTarget = null) {
    if (this.isSpinning || !this.preparedSegments.length) return false;

    this.isSpinning = true;
    this.highlightedSegmentIdx = -1;
    sounds.playWhoosh();
    this.options.onSpinStart();

    // 1. Select target segment in preparedSegments
    let targetSegmentIdx = -1;
    if (forceTarget !== null && forceTarget !== undefined) {
      if (typeof forceTarget === 'string') {
        targetSegmentIdx = this.preparedSegments.findIndex(s => s.text === forceTarget);
      } else if (typeof forceTarget === 'number') {
        // Match by originalIndex first (from Almanac), fallback to preparedIndex
        targetSegmentIdx = this.preparedSegments.findIndex(s => s.originalIndex === forceTarget);
        if (targetSegmentIdx === -1) {
          targetSegmentIdx = Math.max(0, Math.min(forceTarget, this.preparedSegments.length - 1));
        }
      }
    }

    if (targetSegmentIdx === -1) {
      const rand = Math.random() * this.totalWeight;
      let running = 0;
      targetSegmentIdx = 0;
      for (let i = 0; i < this.preparedSegments.length; i++) {
        running += this.preparedSegments[i].weight;
        if (rand <= running) {
          targetSegmentIdx = i;
          break;
        }
      }
    }

    const targetSeg = this.preparedSegments[targetSegmentIdx];

    // 2. MUST be an exact INTEGER number of full 2*PI turns so alignment is never shifted!
    const fullRotationsCount = 5 + Math.floor(Math.random() * 4); // 5, 6, 7, or 8 exact turns
    const extraRotations = fullRotationsCount * Math.PI * 2;

    // Slight natural variance inside the middle 40% of the target slice
    const inSliceOffset = (Math.random() - 0.5) * (targetSeg.arc * 0.4);

    // Top pointer is at (3 * Math.PI) / 2
    const twoPi = Math.PI * 2;
    const pointerAngle = (3 * Math.PI) / 2;
    const desiredFinalModAngle = pointerAngle - (targetSeg.centerAngle + inSliceOffset);

    const normalizedTarget = ((desiredFinalModAngle % twoPi) + twoPi) % twoPi;
    const currentNorm = ((this.currentAngle % twoPi) + twoPi) % twoPi;
    let diff = normalizedTarget - currentNorm;
    if (diff < 0) diff += twoPi;

    const totalAngleToRotate = extraRotations + diff;
    const duration = 4800 + Math.random() * 700;
    const startTime = performance.now();
    const startAngle = this.currentAngle;

    const animateSpin = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3.8);

      const previousAngle = this.currentAngle;
      this.currentAngle = startAngle + (totalAngleToRotate * ease);

      const deltaAngle = this.currentAngle - previousAngle;
      const velocity = deltaAngle / 0.016;

      this.checkSegmentPegCrossings(velocity);

      if (progress < 1) {
        requestAnimationFrame(animateSpin);
      } else {
        this.currentAngle = startAngle + totalAngleToRotate;
        // Verify exact segment under pointer so visual wheel and outcome are 100% locked
        const verifiedIdx = this.getSegmentIndexAtPointer(this.currentAngle);
        this.highlightedSegmentIdx = verifiedIdx;
        this.draw();

        // Brief pause on the highlighted landed slice so player sees the needle on the winner
        setTimeout(() => {
          this.isSpinning = false;
          this.onSpinFinished(verifiedIdx);
        }, 380);
      }
    };

    requestAnimationFrame(animateSpin);
    return true;
  }

  instantSpin() {
    if (this.isSpinning || !this.preparedSegments.length) return false;
    const rand = Math.random() * this.totalWeight;
    let running = 0;
    let targetIdx = 0;
    for (let i = 0; i < this.preparedSegments.length; i++) {
      running += this.preparedSegments[i].weight;
      if (rand <= running) {
        targetIdx = i;
        break;
      }
    }
    const targetSeg = this.preparedSegments[targetIdx];
    this.currentAngle = (3 * Math.PI / 2) - targetSeg.centerAngle;
    const verifiedIdx = this.getSegmentIndexAtPointer(this.currentAngle);
    this.highlightedSegmentIdx = verifiedIdx;
    this.draw();
    this.onSpinFinished(verifiedIdx);
    return true;
  }

  checkSegmentPegCrossings(velocity) {
    if (!this.preparedSegments.length) return;
    const currentSegment = this.getSegmentIndexAtPointer(this.currentAngle);

    if (currentSegment !== this.lastPassedSegmentIdx) {
      this.lastPassedSegmentIdx = currentSegment;
      this.flapperAngle = 0.38;
      this.options.onTick(currentSegment);
      sounds.playTick(Math.min(1.0, velocity / 12));
    }
  }

  onSpinFinished(landedIndex) {
    const landed = this.preparedSegments[landedIndex];
    this.lastLandedSegment = landed;

    this.spawnParticles(landed.rarity || 'common');
    sounds.playFanfare(landed.rarity || 'common');
    this.options.onSpinEnd(landed, landedIndex);
  }

  spawnParticles(rarity) {
    const colors = {
      common: ['#64748b', '#94a3b8', '#38bdf8'],
      uncommon: ['#38bdf8', '#0284c7', '#93c5fd'],
      rare: ['#00f0ff', '#38bdf8', '#2563eb'],
      epic: ['#60a5fa', '#38bdf8', '#00f0ff'],
      legendary: ['#00f0ff', '#7dd3fc', '#ffffff'],
      mythic: ['#bae6fd', '#38bdf8', '#00f0ff', '#ffffff'],
      godTier: ['#ffffff', '#e0f2fe', '#00f0ff', '#7dd3fc'],
      chaos: ['#00f0ff', '#67e8f9', '#ffffff']
    };

    const palette = colors[rarity] || colors.rare;
    const count = (rarity === 'godTier' || rarity === 'mythic' || rarity === 'chaos') ? 65 : 32;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 5.5;
      this.particles.push({
        x: this.centerX,
        y: this.centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.2,
        size: 2.5 + Math.random() * 3.5,
        color: palette[Math.floor(Math.random() * palette.length)],
        alpha: 1,
        life: 0.94 + Math.random() * 0.04
      });
    }
  }

  animate() {
    const now = performance.now();
    this.lastFrameTime = now;

    if (this.flapperAngle > 0.001) {
      this.flapperAngle *= 0.82;
    } else {
      this.flapperAngle = 0;
    }

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.1;
      p.alpha *= p.life;
      if (p.alpha < 0.02) {
        this.particles.splice(i, 1);
      }
    }

    this.draw();
    requestAnimationFrame(() => this.animate());
  }

  draw() {
    if (!this.ctx || !this.preparedSegments.length) return;
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    const segments = this.preparedSegments;
    const totalSegments = segments.length;

    // 1. Outer Sapphire Aura & Shadow
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, this.radius + 12, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(5, 11, 20, 0.92)';
    ctx.shadowColor = '#0284c7';
    ctx.shadowBlur = 24;
    ctx.fill();
    ctx.restore();

    // 2. Draw Wheel Segments (Darker Blue = Common -> Lighter Blue = Rare/God-Tier)
    ctx.save();
    ctx.translate(this.centerX, this.centerY);
    ctx.rotate(this.currentAngle);

    for (let i = 0; i < totalSegments; i++) {
      const seg = segments[i];
      const startAngle = seg.startAngle;
      const endAngle = seg.endAngle;
      const arc = seg.arc;
      const rarityKey = seg.rarity || 'common';
      const pal = RARITY_BLUE_PALETTE[rarityKey] || RARITY_BLUE_PALETTE.common;
      const isEven = i % 2 === 0;
      const isHighlighted = (i === this.highlightedSegmentIdx);

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, this.radius, startAngle, endAngle);
      ctx.closePath();

      const grad = ctx.createRadialGradient(0, 0, 12, 0, 0, this.radius);
      if (isHighlighted) {
        grad.addColorStop(0, '#0284c7');
        grad.addColorStop(0.45, '#38bdf8');
        grad.addColorStop(1, '#e0f2fe');
      } else {
        grad.addColorStop(0, pal.inner);
        grad.addColorStop(0.42, isEven ? pal.midEven : pal.midOdd);
        grad.addColorStop(1, isEven ? pal.outerEven : pal.outerOdd);
      }

      ctx.fillStyle = grad;
      ctx.fill();

      // Crisp slice border line
      ctx.strokeStyle = isHighlighted ? '#ffffff' : 'rgba(125, 211, 252, 0.35)';
      ctx.lineWidth = isHighlighted ? 2.2 : 1.1;
      ctx.stroke();

      // Text label rotated along segment center
      ctx.save();
      ctx.rotate(seg.centerAngle);

      const textRadius = this.radius * 0.74;
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';

      const arcDegrees = (arc * 180) / Math.PI;
      let fontSize = 11.5;
      if (arcDegrees < 5) fontSize = 8.2;
      else if (arcDegrees < 8) fontSize = 9.2;
      else if (arcDegrees < 13) fontSize = 10.5;

      ctx.font = `700 ${fontSize}px "Outfit", -apple-system, sans-serif`;

      let label = seg.text;
      const maxTextWidth = this.radius * 0.55;
      if (ctx.measureText(label).width > maxTextWidth) {
        while (label.length > 3 && ctx.measureText(label + '…').width > maxTextWidth) {
          label = label.slice(0, -1);
        }
        label += '…';
      }

      // Dark navy halo outline around text so it's readable on both dark blue and light ice-blue slices
      ctx.lineJoin = 'round';
      ctx.lineWidth = 2.8;
      ctx.strokeStyle = 'rgba(3, 8, 20, 0.92)';
      ctx.strokeText(label, textRadius, 0);

      ctx.fillStyle = '#ffffff';
      ctx.fillText(label, textRadius, 0);

      // Rarity indicator dot near outer rim
      const rarityDotRadius = arcDegrees < 6 ? 2.2 : 3.2;
      ctx.beginPath();
      ctx.arc(textRadius + (arcDegrees < 6 ? 9 : 13), 0, rarityDotRadius, 0, Math.PI * 2);
      ctx.fillStyle = pal.dot;
      ctx.shadowColor = pal.dot;
      ctx.shadowBlur = 5;
      ctx.fill();

      ctx.restore();
    }

    // Outer Rim Pegs at exact segment boundaries
    for (let i = 0; i < totalSegments; i++) {
      const pegAngle = segments[i].startAngle;
      const px = Math.cos(pegAngle) * (this.radius - 2);
      const py = Math.sin(pegAngle) * (this.radius - 2);

      ctx.beginPath();
      ctx.arc(px, py, 2.2, 0, Math.PI * 2);
      ctx.fillStyle = '#bae6fd';
      ctx.shadowColor = '#040a14';
      ctx.shadowBlur = 2;
      ctx.fill();
    }

    ctx.restore();

    // 3. Clean Sapphire & Titanium Outer Rim
    ctx.save();

    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, this.radius + 1, 0, Math.PI * 2);
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, this.radius + 6, 0, Math.PI * 2);
    ctx.strokeStyle = '#1d4ed8';
    ctx.lineWidth = 6;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, this.radius + 10, 0, Math.PI * 2);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.8;
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 8;
    ctx.stroke();

    ctx.restore();

    // 4. Center Hub (Polished Sapphire Core)
    ctx.save();
    const hubRadius = this.radius * 0.21;

    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, hubRadius + 3, 0, Math.PI * 2);
    ctx.fillStyle = '#070e1c';
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 12;
    ctx.fill();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    const sapphireGrad = ctx.createRadialGradient(
      this.centerX - 3, this.centerY - 3, 2,
      this.centerX, this.centerY, hubRadius
    );
    sapphireGrad.addColorStop(0, '#7dd3fc');
    sapphireGrad.addColorStop(0.35, '#0284c7');
    sapphireGrad.addColorStop(0.8, '#1e3a8a');
    sapphireGrad.addColorStop(1, '#091326');

    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, hubRadius, 0, Math.PI * 2);
    ctx.fillStyle = sapphireGrad;
    ctx.fill();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    const innerSize = hubRadius * 0.48;
    ctx.moveTo(this.centerX, this.centerY - innerSize);
    ctx.lineTo(this.centerX + innerSize, this.centerY);
    ctx.lineTo(this.centerX, this.centerY + innerSize);
    ctx.lineTo(this.centerX - innerSize, this.centerY);
    ctx.closePath();
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = `800 ${Math.floor(hubRadius * 0.44)}px "Outfit", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('WOF', this.centerX, this.centerY);

    ctx.restore();

    // 5. Top Needle Pointer
    this.drawPointer();

    // 6. Victory Particles
    this.drawParticles();
  }

  drawPointer() {
    const ctx = this.ctx;
    ctx.save();

    const px = this.centerX;
    const py = this.centerY - this.radius + 2;

    ctx.translate(px, py - 14);
    ctx.rotate(this.flapperAngle);

    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 4;

    ctx.beginPath();
    ctx.moveTo(-9, -10);
    ctx.lineTo(9, -10);
    ctx.lineTo(7, 5);
    ctx.lineTo(0, 25);
    ctx.lineTo(-7, 5);
    ctx.closePath();

    const pointerGrad = ctx.createLinearGradient(-9, 0, 9, 0);
    pointerGrad.addColorStop(0, '#94a3b8');
    pointerGrad.addColorStop(0.5, '#ffffff');
    pointerGrad.addColorStop(1, '#64748b');

    ctx.fillStyle = pointerGrad;
    ctx.fill();

    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(-4, 15);
    ctx.lineTo(4, 15);
    ctx.lineTo(0, 25);
    ctx.closePath();
    ctx.fillStyle = '#00f0ff';
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 8;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(0, -5, 4.5, 0, Math.PI * 2);
    ctx.fillStyle = '#0284c7';
    ctx.fill();
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.restore();
  }

  drawParticles() {
    const ctx = this.ctx;
    ctx.save();
    for (const p of this.particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 6;
      ctx.fill();
    }
    ctx.restore();
  }
}
