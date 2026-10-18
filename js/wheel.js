/**
 * WHEEL OF FAITH - WHEEL CANVAS & PHYSICS ENGINE (CLEAN BLUE & RARITY WEIGHTED)
 * Modern HTML5 Canvas renderer featuring:
 * - Dynamic Rarity-Weighted Slices (Common = wide segments, Mythic/God-Tier = razor-thin jackpot slivers)
 * - Rarity Clustering (Rare & God-tier slices clustered together for dramatic tension)
 * - Clean Sapphire & Midnight Blue Aesthetic (No carnival lights, zero circus clutter)
 * - Precision brushed steel needle pointer with electric ice-blue glow
 * - Dynamic font scaling and audio-synchronized flapper physics
 */

const RARITY_WEIGHTS = {
  common: 12.0,
  uncommon: 8.0,
  rare: 5.0,
  epic: 3.2,
  legendary: 1.8,
  mythic: 1.1,
  godTier: 0.7,
  chaos: 1.4
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
    this.isEqualizerActive = false; // Rule-bending archetype support

    // Physical pointer / flapper state
    this.flapperAngle = 0; // deflection in radians
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
    const size = Math.min(rect.width, rect.height || rect.width);
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

    this.ctx.scale(dpr, dpr);
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
    this.currentAngle = 0;
    this.angularVelocity = 0;
    this.isSpinning = false;
    this.lastLandedSegment = null;
    this.lastPassedSegmentIdx = -1;
    this.prepareSegments();
    this.draw();
  }

  prepareSegments() {
    if (!this.wheelData || !this.wheelData.segments || !this.wheelData.segments.length) {
      this.preparedSegments = [];
      this.totalWeight = 0;
      return;
    }

    const raw = [...this.wheelData.segments];

    // Unless Equalizer is active, sort segments by rarity so common/uncommon
    // are grouped together and rare/mythic/god-tier slivers cluster at the end
    if (!this.isEqualizerActive) {
      raw.sort((a, b) => {
        const orderA = RARITY_ORDER[a.rarity || 'common'] || 99;
        const orderB = RARITY_ORDER[b.rarity || 'common'] || 99;
        return orderA - orderB;
      });
    }

    // Calculate dynamic weights
    let totalW = 0;
    this.preparedSegments = raw.map((seg, idx) => {
      let w = 1.0;
      if (!this.isEqualizerActive) {
        w = RARITY_WEIGHTS[seg.rarity || 'common'] || 5.0;
      }
      totalW += w;
      return {
        ...seg,
        originalIndex: idx,
        weight: w,
        startAngle: 0,
        endAngle: 0,
        centerAngle: 0,
        arc: 0
      };
    });

    this.totalWeight = totalW;

    // Calculate angular dimensions
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
  }

  spin(forceIndex = null) {
    if (this.isSpinning || !this.preparedSegments.length) return false;

    this.isSpinning = true;
    sounds.playWhoosh();
    this.options.onSpinStart();

    // Select target segment by weight probability (or forceIndex)
    let targetSegmentIdx = 0;
    if (forceIndex !== null && forceIndex !== undefined) {
      targetSegmentIdx = Math.max(0, Math.min(forceIndex, this.preparedSegments.length - 1));
    } else {
      const rand = Math.random() * this.totalWeight;
      let running = 0;
      for (let i = 0; i < this.preparedSegments.length; i++) {
        running += this.preparedSegments[i].weight;
        if (rand <= running) {
          targetSegmentIdx = i;
          break;
        }
      }
    }

    const targetSeg = this.preparedSegments[targetSegmentIdx];

    // Number of dramatic rotations (between 5 and 8)
    const extraRotations = (5 + Math.random() * 3) * Math.PI * 2;

    // Top pointer is at (3 * Math.PI) / 2
    const pointerAngle = (3 * Math.PI) / 2;
    const targetAngle = pointerAngle - targetSeg.centerAngle;

    const normalizedTarget = ((targetAngle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
    const currentNorm = ((this.currentAngle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
    let diff = normalizedTarget - currentNorm;
    if (diff < 0) diff += Math.PI * 2;

    const totalAngleToRotate = extraRotations + diff;
    const duration = 5000 + Math.random() * 800;
    const startTime = performance.now();
    const startAngle = this.currentAngle;

    // Deceleration animation curve
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
        this.isSpinning = false;
        this.currentAngle = startAngle + totalAngleToRotate;
        this.onSpinFinished(targetSegmentIdx);
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
    this.draw();
    this.onSpinFinished(targetIdx);
    return true;
  }

  checkSegmentPegCrossings(velocity) {
    if (!this.preparedSegments.length) return;

    // Pointer is at (3 * Math.PI / 2)
    const effectiveAngle = ((3 * Math.PI / 2 - this.currentAngle) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);

    let currentSegment = 0;
    for (let i = 0; i < this.preparedSegments.length; i++) {
      const s = this.preparedSegments[i];
      if (effectiveAngle >= s.startAngle && effectiveAngle < s.endAngle) {
        currentSegment = i;
        break;
      }
    }

    if (currentSegment !== this.lastPassedSegmentIdx) {
      this.lastPassedSegmentIdx = currentSegment;
      this.flapperAngle = 0.38; // deflection
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
      common: ['#94a3b8', '#cbd5e1', '#64748b'],
      uncommon: ['#34d399', '#10b981', '#6ee7b7'],
      rare: ['#38bdf8', '#0284c7', '#93c5fd'],
      epic: ['#a855f7', '#c084fc', '#818cf8'],
      legendary: ['#fbbf24', '#f59e0b', '#fde68a'],
      mythic: ['#f472b6', '#ec4899', '#fbcfe8'],
      godTier: ['#00f0ff', '#38bdf8', '#ffffff', '#7dd3fc'],
      chaos: ['#ef4444', '#f87171', '#dc2626']
    };

    const palette = colors[rarity] || colors.rare;
    const count = (rarity === 'godTier' || rarity === 'mythic' || rarity === 'chaos') ? 65 : 30;

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

    // Flapper relaxation spring
    if (this.flapperAngle > 0.001) {
      this.flapperAngle *= 0.82;
    } else {
      this.flapperAngle = 0;
    }

    // Update victory particles
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

    // 1. Outer Sapphire Aura & Shadow (Clean & Minimal)
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, this.radius + 12, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(5, 11, 20, 0.9)';
    ctx.shadowColor = '#0284c7';
    ctx.shadowBlur = 24;
    ctx.fill();
    ctx.restore();

    // 2. Draw Wheel Segments with Rarity Sizing
    ctx.save();
    ctx.translate(this.centerX, this.centerY);
    ctx.rotate(this.currentAngle);

    for (let i = 0; i < totalSegments; i++) {
      const seg = segments[i];
      const startAngle = seg.startAngle;
      const endAngle = seg.endAngle;
      const arc = seg.arc;

      // Slice background wedge
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, this.radius, startAngle, endAngle);
      ctx.closePath();

      // Modern deep navy radial gradient for slice
      const grad = ctx.createRadialGradient(0, 0, 15, 0, 0, this.radius);
      const baseColor = seg.color || '#1e3a8a';
      grad.addColorStop(0, '#060d1a');
      grad.addColorStop(0.35, baseColor);
      grad.addColorStop(1, this.adjustBrightness(baseColor, -22));

      ctx.fillStyle = grad;
      ctx.fill();

      // Clean, thin slice separator
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.28)';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Text rendering rotated along segment center
      ctx.save();
      ctx.rotate(seg.centerAngle);

      const textRadius = this.radius * 0.73;
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';

      // Font size adapts dynamically to the slice arc!
      // Common slices are wide -> clean 11px font
      // Razor-thin slivers (God-Tier) -> smaller font or radial symbol
      let fontSize = 11;
      const arcDegrees = (arc * 180) / Math.PI;

      if (arcDegrees < 4) fontSize = 7.5;
      else if (arcDegrees < 7) fontSize = 8.5;
      else if (arcDegrees < 12) fontSize = 10;
      else fontSize = 11.5;

      ctx.font = `600 ${fontSize}px "Outfit", -apple-system, sans-serif`;

      ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;
      ctx.fillStyle = '#ffffff';

      // Truncate text cleanly if slice is narrow
      let label = seg.text;
      const maxTextWidth = this.radius * (arcDegrees < 8 ? 0.52 : 0.58);
      if (ctx.measureText(label).width > maxTextWidth) {
        while (label.length > 3 && ctx.measureText(label + '…').width > maxTextWidth) {
          label = label.slice(0, -1);
        }
        label += '…';
      }

      ctx.fillText(label, textRadius, 0);

      // Clean rarity dot indicator
      const rarityDotRadius = arcDegrees < 6 ? 2.0 : 3.0;
      const rarityDotColor = this.getRarityColor(seg.rarity);
      ctx.beginPath();
      ctx.arc(textRadius + (arcDegrees < 6 ? 8 : 12), 0, rarityDotRadius, 0, Math.PI * 2);
      ctx.fillStyle = rarityDotColor;
      ctx.shadowColor = rarityDotColor;
      ctx.shadowBlur = 4;
      ctx.fill();

      ctx.restore();
    }

    // Outer Rim Pegs / Pins at exact segment boundaries
    for (let i = 0; i < totalSegments; i++) {
      const pegAngle = segments[i].startAngle;
      const px = Math.cos(pegAngle) * (this.radius - 2);
      const py = Math.sin(pegAngle) * (this.radius - 2);

      ctx.beginPath();
      ctx.arc(px, py, 2.2, 0, Math.PI * 2);
      ctx.fillStyle = '#94a3b8'; // Silver pin
      ctx.shadowColor = '#000000';
      ctx.shadowBlur = 2;
      ctx.fill();
    }

    ctx.restore(); // Restore wheel rotation

    // 3. Clean Modern Sapphire & Titanium Rim (No Carnival Lights)
    ctx.save();
    
    // Outer Titanium Ring
    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, this.radius + 1, 0, Math.PI * 2);
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Middle Deep Sapphire Border
    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, this.radius + 6, 0, Math.PI * 2);
    ctx.strokeStyle = '#1d4ed8';
    ctx.lineWidth = 6;
    ctx.stroke();

    // Outer Crisp Ice-Blue Neon Line
    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, this.radius + 10, 0, Math.PI * 2);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.8;
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 8;
    ctx.stroke();

    ctx.restore();

    // 4. Center Hub (Polished Sapphire Core & Geometric Compass)
    ctx.save();
    const hubRadius = this.radius * 0.22;

    // Dark base
    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, hubRadius + 3, 0, Math.PI * 2);
    ctx.fillStyle = '#0b1324';
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 12;
    ctx.fill();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Sapphire gradient core
    const sapphireGrad = ctx.createRadialGradient(
      this.centerX - 3, this.centerY - 3, 2,
      this.centerX, this.centerY, hubRadius
    );
    sapphireGrad.addColorStop(0, '#38bdf8');
    sapphireGrad.addColorStop(0.35, '#0284c7');
    sapphireGrad.addColorStop(0.8, '#1e3a8a');
    sapphireGrad.addColorStop(1, '#0f172a');

    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, hubRadius, 0, Math.PI * 2);
    ctx.fillStyle = sapphireGrad;
    ctx.fill();

    // Sleek geometric diamond emblem
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
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
    ctx.font = `700 ${Math.floor(hubRadius * 0.45)}px "Outfit", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('WOF', this.centerX, this.centerY);

    ctx.restore();

    // 5. Draw Precision Top Needle Pointer
    this.drawPointer();

    // 6. Draw Victory Particles
    this.drawParticles();
  }

  drawPointer() {
    const ctx = this.ctx;
    ctx.save();

    const px = this.centerX;
    const py = this.centerY - this.radius + 2;

    ctx.translate(px, py - 14);
    ctx.rotate(this.flapperAngle);

    ctx.shadowColor = 'rgba(0, 0, 0, 0.75)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 4;

    // Sleek arrow blade
    ctx.beginPath();
    ctx.moveTo(-9, -10);
    ctx.lineTo(9, -10);
    ctx.lineTo(7, 5);
    ctx.lineTo(0, 24); // needle tip
    ctx.lineTo(-7, 5);
    ctx.closePath();

    const pointerGrad = ctx.createLinearGradient(-9, 0, 9, 0);
    pointerGrad.addColorStop(0, '#94a3b8');
    pointerGrad.addColorStop(0.5, '#f8fafc');
    pointerGrad.addColorStop(1, '#64748b');

    ctx.fillStyle = pointerGrad;
    ctx.fill();

    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Electric cyan glowing needle tip
    ctx.beginPath();
    ctx.moveTo(-4, 15);
    ctx.lineTo(4, 15);
    ctx.lineTo(0, 24);
    ctx.closePath();
    ctx.fillStyle = '#00f0ff';
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 6;
    ctx.fill();

    // Hinge pin
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

  getRarityColor(rarity) {
    const map = {
      common: '#94a3b8',
      uncommon: '#10b981',
      rare: '#38bdf8',
      epic: '#a855f7',
      legendary: '#f59e0b',
      mythic: '#ec4899',
      godTier: '#00f0ff',
      chaos: '#ef4444'
    };
    return map[rarity] || '#ffffff';
  }

  adjustBrightness(hex, percent) {
    hex = (hex || '#374151').replace('#', '');
    if (hex.length === 3) {
      hex = hex.split('').map(c => c + c).join('');
    }
    let num = parseInt(hex, 16);
    if (isNaN(num)) return '#1e293b';
    let r = (num >> 16) + percent;
    let g = ((num >> 8) & 0x00FF) + percent;
    let b = (num & 0x0000FF) + percent;
    r = Math.min(255, Math.max(0, r));
    g = Math.min(255, Math.max(0, g));
    b = Math.min(255, Math.max(0, b));
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  }
}
