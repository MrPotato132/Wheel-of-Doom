/**
 * WHEEL OF FAITH - WHEEL CANVAS & PHYSICS ENGINE
 * High-performance HTML5 Canvas renderer with realistic rotational inertia,
 * peg collisions, clacker spring animation, and particle effects.
 */

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
    this.currentAngle = 0; // in radians
    this.angularVelocity = 0;
    this.isSpinning = false;
    this.lastLandedSegment = null;

    // Physical pointer / flapper state
    this.flapperAngle = 0; // deflection in radians
    this.flapperVelocity = 0;
    this.lastPassedSegmentIdx = -1;

    // Particles for victory effect
    this.particles = [];

    // Lighting animation
    this.lightPhase = 0;
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
    this.radius = (this.width / 2) - 22; // padding for rim & pointer

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

  setWheelData(wheelData) {
    this.wheelData = wheelData;
    this.currentAngle = 0;
    this.angularVelocity = 0;
    this.isSpinning = false;
    this.lastLandedSegment = null;
    this.lastPassedSegmentIdx = -1;
    this.draw();
  }

  spin(forceIndex = null) {
    if (this.isSpinning || !this.wheelData || !this.wheelData.segments.length) return false;

    this.isSpinning = true;
    sounds.playWhoosh();
    this.options.onSpinStart();

    const segmentsCount = this.wheelData.segments.length;
    const arc = (Math.PI * 2) / segmentsCount;

    // Target segment selection
    let targetSegment = forceIndex;
    if (targetSegment === null || targetSegment === undefined) {
      targetSegment = Math.floor(Math.random() * segmentsCount);
    }

    // Number of full rotations (between 5 and 8)
    const extraRotations = (5 + Math.random() * 3) * Math.PI * 2;

    // The pointer is at the very top: -Math.PI / 2 (or 3*PI/2)
    // To land targetSegment at pointer, targetAngle % (2*PI) must match
    const segmentCenterOffset = (targetSegment + 0.5) * arc;
    const pointerAngle = (3 * Math.PI) / 2;

    // Calculate destination angle
    const targetAngle = pointerAngle - segmentCenterOffset;
    // Normalize and add rotations
    const normalizedTarget = ((targetAngle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
    const currentNorm = ((this.currentAngle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
    let diff = normalizedTarget - currentNorm;
    if (diff < 0) diff += Math.PI * 2;

    const totalAngleToRotate = extraRotations + diff;

    // Approximate duration between 4.8s and 6.2s
    const duration = 5200 + Math.random() * 800;
    const startTime = performance.now();
    const startAngle = this.currentAngle;

    // Cubic-bezier deceleration curve
    const animateSpin = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic/quart
      const ease = 1 - Math.pow(1 - progress, 3.8);

      const previousAngle = this.currentAngle;
      this.currentAngle = startAngle + (totalAngleToRotate * ease);

      // Calculate instantaneous angular velocity for flapper audio
      const deltaAngle = this.currentAngle - previousAngle;
      const velocity = deltaAngle / 0.016; // approx rad/s

      // Track segment boundary crossing for tick sound
      this.checkSegmentPegCrossings(velocity);

      if (progress < 1) {
        requestAnimationFrame(animateSpin);
      } else {
        this.isSpinning = false;
        this.currentAngle = startAngle + totalAngleToRotate;
        this.onSpinFinished(targetSegment);
      }
    };

    requestAnimationFrame(animateSpin);
    return true;
  }

  instantSpin() {
    if (this.isSpinning || !this.wheelData || !this.wheelData.segments.length) return false;
    const target = Math.floor(Math.random() * this.wheelData.segments.length);
    const arc = (Math.PI * 2) / this.wheelData.segments.length;
    const segmentCenterOffset = (target + 0.5) * arc;
    this.currentAngle = (3 * Math.PI / 2) - segmentCenterOffset;
    this.draw();
    this.onSpinFinished(target);
    return true;
  }

  checkSegmentPegCrossings(velocity) {
    if (!this.wheelData) return;
    const segmentsCount = this.wheelData.segments.length;
    const arc = (Math.PI * 2) / segmentsCount;

    // Pointer is at -Math.PI / 2 (or 1.5 * PI)
    const effectiveAngle = ((3 * Math.PI / 2 - this.currentAngle) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
    const currentSegment = Math.floor(effectiveAngle / arc);

    if (currentSegment !== this.lastPassedSegmentIdx) {
      this.lastPassedSegmentIdx = currentSegment;

      // Deflect flapper
      this.flapperAngle = 0.45; // 25 degrees deflection
      this.options.onTick(currentSegment);
      sounds.playTick(Math.min(1.0, velocity / 12));
    }
  }

  onSpinFinished(landedIndex) {
    const landed = this.wheelData.segments[landedIndex];
    this.lastLandedSegment = landed;

    // Spawn celebratory particles
    this.spawnParticles(landed.rarity || 'common');
    sounds.playFanfare(landed.rarity || 'common');
    this.options.onSpinEnd(landed, landedIndex);
  }

  spawnParticles(rarity) {
    const colors = {
      common: ['#94a3b8', '#e2e8f0', '#cbd5e1'],
      uncommon: ['#34d399', '#10b981', '#6ee7b7'],
      rare: ['#60a5fa', '#3b82f6', '#93c5fd'],
      epic: ['#c084fc', '#a855f7', '#e879f9'],
      legendary: ['#fbbf24', '#f59e0b', '#fde68a'],
      mythic: ['#f472b6', '#ec4899', '#fbcfe8'],
      godTier: ['#22d3ee', '#06b6d4', '#67e8f9', '#ffffff'],
      chaos: ['#ef4444', '#dc2626', '#b91c1c', '#7f1d1d']
    };

    const palette = colors[rarity] || colors.common;
    const count = (rarity === 'godTier' || rarity === 'mythic' || rarity === 'chaos') ? 70 : 35;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 6;
      this.particles.push({
        x: this.centerX,
        y: this.centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5,
        size: 3 + Math.random() * 4,
        color: palette[Math.floor(Math.random() * palette.length)],
        alpha: 1,
        life: 0.95 + Math.random() * 0.04
      });
    }
  }

  animate() {
    const now = performance.now();
    const dt = (now - this.lastFrameTime) / 1000;
    this.lastFrameTime = now;

    // Flapper physics spring relaxation
    if (this.flapperAngle > 0.001) {
      this.flapperAngle *= 0.85; // fast return spring
    } else {
      this.flapperAngle = 0;
    }

    // Light phase cycle
    this.lightPhase += dt * 3.5;

    // Update and prune particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.12; // gravity
      p.alpha *= p.life;
      if (p.alpha < 0.02) {
        this.particles.splice(i, 1);
      }
    }

    this.draw();
    requestAnimationFrame(() => this.animate());
  }

  draw() {
    if (!this.ctx || !this.wheelData) return;
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    const segments = this.wheelData.segments;
    const totalSegments = segments.length;
    if (!totalSegments) return;

    const arc = (Math.PI * 2) / totalSegments;

    // 1. Draw Outer Glowing Aura & Shadow
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, this.radius + 14, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.shadowColor = '#af1111';
    ctx.shadowBlur = 28;
    ctx.fill();
    ctx.restore();

    // 2. Draw Wheel Segments
    ctx.save();
    ctx.translate(this.centerX, this.centerY);
    ctx.rotate(this.currentAngle);

    for (let i = 0; i < totalSegments; i++) {
      const seg = segments[i];
      const startAngle = i * arc;
      const endAngle = startAngle + arc;

      // Slice background
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, this.radius, startAngle, endAngle);
      ctx.closePath();

      // Alternating shading gradient for rich depth
      const grad = ctx.createRadialGradient(0, 0, 20, 0, 0, this.radius);
      const baseColor = seg.color || '#374151';
      grad.addColorStop(0, '#111827');
      grad.addColorStop(0.3, baseColor);
      grad.addColorStop(1, this.adjustBrightness(baseColor, -25));

      ctx.fillStyle = grad;
      ctx.fill();

      // Slice border line
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.35)'; // Antique Gold line
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Text rendering rotated along segment radius
      ctx.save();
      ctx.rotate(startAngle + arc / 2);

      // Text position
      const textRadius = this.radius * 0.72;
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';

      // Font size and text position adjusted for slice count
      let fontSize = 13;
      if (totalSegments > 28) fontSize = 8.5;
      else if (totalSegments > 20) fontSize = 10;
      else if (totalSegments > 14) fontSize = 11.5;
      else if (totalSegments > 8) fontSize = 12.5;
      ctx.font = `bold ${fontSize}px "Outfit", "Fjalla One", sans-serif`;

      // Shadow behind text for contrast
      ctx.shadowColor = 'rgba(0,0,0,0.9)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;

      ctx.fillStyle = '#ffffff';

      // Label text truncation if segment is narrow
      let label = seg.text;
      const maxTextWidth = this.radius * (totalSegments > 28 ? 0.58 : 0.52);
      if (ctx.measureText(label).width > maxTextWidth) {
        while (label.length > 3 && ctx.measureText(label + '…').width > maxTextWidth) {
          label = label.slice(0, -1);
        }
        label += '…';
      }

      ctx.fillText(label, textRadius, 0);

      // Rarity dot indicator
      const rarityDotRadius = totalSegments > 28 ? 2.5 : 3.5;
      const rarityDotColor = this.getRarityColor(seg.rarity);
      ctx.beginPath();
      ctx.arc(textRadius + (totalSegments > 28 ? 10 : 14), 0, rarityDotRadius, 0, Math.PI * 2);
      ctx.fillStyle = rarityDotColor;
      ctx.shadowColor = rarityDotColor;
      ctx.shadowBlur = 6;
      ctx.fill();

      ctx.restore();
    }

    // Outer Rim Pegs / Pins on the Wheel
    const pegRadius = totalSegments > 28 ? 2.5 : 3.5;
    for (let i = 0; i < totalSegments; i++) {
      const pegAngle = i * arc;
      const px = Math.cos(pegAngle) * (this.radius - 2);
      const py = Math.sin(pegAngle) * (this.radius - 2);

      ctx.beginPath();
      ctx.arc(px, py, pegRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#ffd700'; // Gold peg
      ctx.shadowColor = '#000000';
      ctx.shadowBlur = 2;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(px, py, Math.max(1, pegRadius - 2), 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
    }

    ctx.restore(); // restore wheel rotation

    // 3. Draw Antique Gold Outer Border & Chasing LED Lights
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, this.radius + 1, 0, Math.PI * 2);
    ctx.strokeStyle = '#d4af37'; // Antique gold ring
    ctx.lineWidth = 5;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, this.radius + 7, 0, Math.PI * 2);
    ctx.strokeStyle = '#5a060a'; // Dark crimson rim
    ctx.lineWidth = 8;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, this.radius + 12, 0, Math.PI * 2);
    ctx.strokeStyle = '#b3131b'; // Outer crimson border
    ctx.lineWidth = 2;
    ctx.stroke();

    // Chasing LED studs around the rim
    const totalBulbs = 24;
    for (let b = 0; b < totalBulbs; b++) {
      const bAngle = (b / totalBulbs) * Math.PI * 2;
      const bx = this.centerX + Math.cos(bAngle) * (this.radius + 7);
      const by = this.centerY + Math.sin(bAngle) * (this.radius + 7);

      const isActive = Math.sin(this.lightPhase + b * 0.8) > 0.2;
      ctx.beginPath();
      ctx.arc(bx, by, 3, 0, Math.PI * 2);
      ctx.fillStyle = isActive ? '#ffe066' : '#573a08';
      if (isActive) {
        ctx.shadowColor = '#ffd700';
        ctx.shadowBlur = 8;
      } else {
        ctx.shadowBlur = 0;
      }
      ctx.fill();
    }
    ctx.restore();

    // 4. Draw Center Hub (Gothic Ruby Gem & Gold Medallion)
    ctx.save();
    const hubRadius = this.radius * 0.24;

    // Outer hub rim
    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, hubRadius + 4, 0, Math.PI * 2);
    ctx.fillStyle = '#1e1e24';
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 3.5;
    ctx.stroke();

    // Ruby Center
    const rubyGrad = ctx.createRadialGradient(
      this.centerX - 5, this.centerY - 5, 2,
      this.centerX, this.centerY, hubRadius
    );
    rubyGrad.addColorStop(0, '#ff4d6d');
    rubyGrad.addColorStop(0.4, '#c9184a');
    rubyGrad.addColorStop(0.85, '#800f2f');
    rubyGrad.addColorStop(1, '#590d22');

    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, hubRadius, 0, Math.PI * 2);
    ctx.fillStyle = rubyGrad;
    ctx.fill();

    // Gold inner rune cross
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.75)';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, hubRadius * 0.55, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#ffe5a0';
    ctx.font = `bold ${Math.floor(hubRadius * 0.7)}px "Cinzel", "Inknut Antiqua", serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('⚡', this.centerX, this.centerY);

    ctx.restore();

    // 5. Draw Dynamic Top Pointer / Flapper Clacker
    this.drawPointer();

    // 6. Draw Victory Particles
    this.drawParticles();
  }

  drawPointer() {
    const ctx = this.ctx;
    ctx.save();

    const px = this.centerX;
    const py = this.centerY - this.radius + 2;

    // Anchor the pointer at the top rim and apply deflection angle
    ctx.translate(px, py - 14);
    ctx.rotate(this.flapperAngle);

    // Pointer shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 4;

    // Pointer Blade (Arrow pointing down into the wheel)
    ctx.beginPath();
    ctx.moveTo(-10, -12);
    ctx.lineTo(10, -12);
    ctx.lineTo(8, 6);
    ctx.lineTo(0, 26); // sharp needle tip
    ctx.lineTo(-8, 6);
    ctx.closePath();

    const pointerGrad = ctx.createLinearGradient(-10, 0, 10, 0);
    pointerGrad.addColorStop(0, '#ffd700');
    pointerGrad.addColorStop(0.5, '#fff2a0');
    pointerGrad.addColorStop(1, '#d4af37');

    ctx.fillStyle = pointerGrad;
    ctx.fill();

    ctx.strokeStyle = '#854d0e';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Center jewel on pointer hinge
    ctx.beginPath();
    ctx.arc(0, -6, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#dc2626';
    ctx.fill();
    ctx.strokeStyle = '#ffd700';
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
      rare: '#3b82f6',
      epic: '#a855f7',
      legendary: '#f59e0b',
      mythic: '#ec4899',
      godTier: '#06b6d4',
      chaos: '#ef4444'
    };
    return map[rarity] || '#ffffff';
  }

  adjustBrightness(hex, percent) {
    hex = hex.replace('#', '');
    let num = parseInt(hex, 16);
    let r = (num >> 16) + percent;
    let g = ((num >> 8) & 0x00FF) + percent;
    let b = (num & 0x0000FF) + percent;
    r = Math.min(255, Math.max(0, r));
    g = Math.min(255, Math.max(0, g));
    b = Math.min(255, Math.max(0, b));
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  }
}
