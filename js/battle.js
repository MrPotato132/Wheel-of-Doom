/**
 * WHEEL OF FAITH - VISUAL COMBAT & ARENA ENGINE
 * Handles 1v1 Duels and Free-For-All Battle Royales with animated avatars,
 * floating damage numbers, screen shake, status effects, and audio sync.
 * Enhanced with support for all 36+ Weapons, 28+ Powers, 22+ Weaknesses,
 * Enchants, Passives (Indomitable Will, Double Strike), and Racial traits.
 */

class BattleEngine {
  constructor(options = {}) {
    this.options = Object.assign({
      onAction: () => {},
      onHpUpdate: () => {},
      onFighterFaint: () => {},
      onBattleEnd: () => {},
      onLog: () => {}
    }, options);

    this.mode = 'duel'; // 'duel' | 'ffa'
    this.fighters = [];
    this.isRunning = false;
    this.isPaused = false;
    this.speed = 1.0; // 1x, 2x, 4x
    this.turnQueue = [];
    this.turnIndex = 0;
    this.timerId = null;
    this.roundCount = 0;
    this.logHistory = [];
  }

  setupBattle(combatants, mode = 'duel') {
    this.stop();
    this.mode = mode;
    this.roundCount = 0;
    this.logHistory = [];

    // Clone fighters and initialize battle parameters
    this.fighters = combatants.map((c, index) => {
      const stats = Object.assign({ str: 50, spd: 50, dur: 50, int: 50, chaos: 50 }, c.stats || {});
      const maxHp = Math.max(120, Math.floor((stats.dur * 5.5) + 120 + ((c.level || 1) * 20)));

      // Glass cannon weakness adjustment
      const isGlassCannon = c.weakness && c.weakness.text === 'Glass Cannon';
      const actualMaxHp = isGlassCannon ? 35 : maxHp;

      const gradeText = c.sorcererGrade ? (c.sorcererGrade.text || c.sorcererGrade) : 'Grade 2 Sorcerer';
      const gradeBfOdds = (c.sorcererGrade && c.sorcererGrade.bfOdds) ? c.sorcererGrade.bfOdds : this.getGradeBfOdds(gradeText);
      const inferredTheme = (c.domainType && c.domainType.theme) || c.domainTheme ||
        ((c.archetype && c.archetype.text === 'Cursed Vessel') || (c.powers && c.powers.some(p => (p.text || p).includes('Shrine'))) ? 'shrine' : 'void');
      const inferredDomainName = c.domainType ? (c.domainType.text || c.domainType) :
        (c.domainName || (inferredTheme === 'shrine' ? 'Malevolent Shrine' : 'Unlimited Void'));

      return {
        id: c.id || 'f_' + index,
        originalData: c,
        name: c.name || `Gladiator #${index + 1}`,
        fullTitle: (typeof characterManager !== 'undefined') ? characterManager.generateFullTitle(c) : c.name,
        level: c.level || 1,
        race: c.race ? c.race.text : 'Human',
        raceColor: c.race && c.race.color ? c.race.color : '#b3131b',
        archetype: c.archetype ? c.archetype.text : 'Warrior',
        archetypeSub: c.archetypeSub ? c.archetypeSub.text : null,
        sorcererGrade: gradeText,
        bfOdds: gradeBfOdds,
        bfChain: 0,
        awakenedPotential: false,
        simpleDomainActive: false,
        simpleDomainTurns: 0,
        ctBurnoutTurns: 0,
        sukunaFingers: c.sukunaFingers || (c.archetypeSub && c.archetypeSub.fingers) || 0,
        weapon: c.weapon ? c.weapon.text : 'Bare Knuckles',
        weaponRarity: c.weapon ? c.weapon.rarity : 'common',
        enchantments: c.enchantments || [],
        passives: c.passives || [],
        powers: (c.powers || []).map(p => (typeof p === 'object' ? p.text : p)),
        weakness: c.weakness ? (typeof c.weakness === 'object' ? c.weakness.text : c.weakness) : null,
        backstory: c.backstory ? (typeof c.backstory === 'object' ? c.backstory.text : c.backstory) : null,
        stats: stats,
        maxHp: actualMaxHp,
        currentHp: actualMaxHp,
        shield: (c.powers && c.powers.some(p => (p.text || p) === 'Force Field Barrier' || (p.text || p) === 'Limitless & Hollow Purple')) ? 180 : 0,
        domainName: inferredDomainName,
        domainTheme: inferredTheme,
        isAlive: true,
        isUndeadRevived: false,
        isPhoenixRevived: false,
        usedIndomitableWill: false,
        hasRegened: false,
        usedRCT: 0,
        mahoragaSpins: 0,
        inTheZone: false,
        hasShonenProtagonistBuff: false,
        kills: 0,
        damageDealt: 0,
        statusEffects: [] // 'frozen', 'burning', 'blinded', 'timeStop', 'poisoned', 'confused', 'sleeping'
      };
    });

    this.activeDomain = null;
    return this.fighters;
  }

  getGradeBfOdds(gradeText = '') {
    if (gradeText.includes('Unlimited Potential')) return 0.52;
    if (gradeText.includes('Heavenly Anomaly')) return 0.45;
    if (gradeText.includes('Special Grade')) return 0.40;
    if (gradeText.includes('Semi-Grade 1')) return 0.28;
    if (gradeText.includes('Grade 1')) return 0.33;
    if (gradeText.includes('Semi-Grade 2')) return 0.21;
    if (gradeText.includes('Grade 2')) return 0.24;
    if (gradeText.includes('Grade 3')) return 0.18;
    return 0.14; // Grade 4 baseline so every spin can Black Flash
  }

  toggleSimpleDomain(fighterId = null) {
    const targetFighter = fighterId
      ? this.fighters.find(f => f.id === fighterId && f.isAlive)
      : (this.fighters.find(f => f.isAlive && (!this.activeDomain || f.id !== this.activeDomain.caster.id)) || this.fighters[0]);
    if (!targetFighter) return null;
    targetFighter.simpleDomainActive = !targetFighter.simpleDomainActive;
    targetFighter.simpleDomainTurns = targetFighter.simpleDomainActive ? 3 : 0;
    if (targetFighter.simpleDomainActive) {
      this.logAction(`🛡️ circle! ${targetFighter.name} deploys NEW SHADOW STYLE: SIMPLE DOMAIN (簡易領域)! Incoming Domain sure-hit damage reduced by 55%!`, 'power');
    } else {
      this.logAction(`🛡️ ${targetFighter.name}'s Simple Domain barrier dissipates.`, 'info');
    }
    return targetFighter;
  }

  setSpeed(mult) {
    this.speed = mult;
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.isPaused = false;
    this.executeNextTurn();
  }

  pause() {
    this.isPaused = !this.isPaused;
    if (!this.isPaused && this.isRunning) {
      this.executeNextTurn();
    }
  }

  stop() {
    this.isRunning = false;
    this.isPaused = false;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  executeNextTurn() {
    if (!this.isRunning || this.isPaused) return;

    // Check win condition
    const aliveFighters = this.fighters.filter(f => f.isAlive);
    if (aliveFighters.length <= 1) {
      this.finishBattle(aliveFighters[0] || null);
      return;
    }

    // Refresh queue if empty
    if (this.turnQueue.length === 0) {
      this.roundCount++;
      // Sort alive fighters by SPD + initiative variance
      this.turnQueue = aliveFighters.slice().sort((a, b) => {
        // Gunslingers get a huge first round bonus
        const gunBonusA = (a.archetype.includes('Gunslinger') && this.roundCount === 1) ? 60 : 0;
        const gunBonusB = (b.archetype.includes('Gunslinger') && this.roundCount === 1) ? 60 : 0;
        const initA = a.stats.spd + gunBonusA + (Math.random() * 25);
        const initB = b.stats.spd + gunBonusB + (Math.random() * 25);
        return initB - initA;
      });
    }

    const attacker = this.turnQueue.shift();
    if (!attacker || !attacker.isAlive) {
      // Skip dead fighter
      this.scheduleNextTurn(50);
      return;
    }

    // Tick down Simple Domain turns if active
    if (attacker.simpleDomainActive && attacker.simpleDomainTurns > 0) {
      attacker.simpleDomainTurns--;
      if (attacker.simpleDomainTurns <= 0) {
        attacker.simpleDomainActive = false;
      }
    }

    // Process Active Winning Domain Effects on trapped opponents
    if (this.activeDomain && this.activeDomain.caster && this.activeDomain.caster.isAlive && attacker.id !== this.activeDomain.caster.id) {
      const domCaster = this.activeDomain.caster;
      const domTheme = this.activeDomain.theme || 'shrine';
      const domName = this.activeDomain.name || (domTheme === 'shrine' ? 'Malevolent Shrine' : 'Unlimited Void');

      // Trapped fighter can auto-deploy Simple Domain if they haven't yet
      if (!attacker.simpleDomainActive && Math.random() < 0.38) {
        attacker.simpleDomainActive = true;
        attacker.simpleDomainTurns = 2;
        this.logAction(`🛡️✨ ${attacker.name} erects SIMPLE DOMAIN (簡易領域) to neutralizing the sure-hit barrier of ${domName} (-55% DMG)!`, 'power');
      }

      const sdMitigation = attacker.simpleDomainActive ? 0.45 : 1.0;
      const isFinalDomainTurn = this.activeDomain.turnsLeft <= 1;

      if (domTheme === 'shrine' || domName.includes('Shrine') || domName.includes('Coffin') || domName.includes('Horizon')) {
        let shrineDmg = Math.floor((95 + domCaster.stats.str * 0.35) * sdMitigation);
        if (isFinalDomainTurn) {
          shrineDmg = Math.floor(shrineDmg * 1.65);
          this.logAction(`🔥🏹 竈「開」 DIVINE FLAME: FUGA! ${domCaster.name} ignites the pulverized dust of ${domName} into a thermobaric Fire Arrow, scorching ${attacker.name} for ${shrineDmg} damage!`, 'crit');
        } else {
          this.logAction(`⛩️🗡️ ${domName.toUpperCase()} SURE-HIT! Relentless Cleave & Dismantle slashes carve ${attacker.name} for ${shrineDmg} damage${attacker.simpleDomainActive ? ' (Simple Domain -55%)' : ''}!`, 'hit');
        }
        attacker.currentHp = Math.max(1, attacker.currentHp - shrineDmg);
        domCaster.damageDealt += shrineDmg;
        this.options.onHpUpdate(attacker);
      } else {
        // Unlimited Void / Control Domain
        let voidDmg = Math.floor((70 + domCaster.stats.int * 0.32) * sdMitigation);
        if (isFinalDomainTurn) {
          voidDmg = Math.floor(voidDmg * 1.85);
          this.logAction(`🟣🤞 虚式「茈」 HOLLOW TECHNIQUE: PURPLE! Inside ${domName}, ${domCaster.name} fires imaginary mass through ${attacker.name} for ${voidDmg} damage!`, 'crit');
        } else {
          this.logAction(`🌌🧠 ${domName.toUpperCase()} SURE-HIT! Infinite information floods ${attacker.name}'s mind for ${voidDmg} neural damage!`, 'power');
        }
        attacker.currentHp = Math.max(1, attacker.currentHp - voidDmg);
        domCaster.damageDealt += voidDmg;
        this.options.onHpUpdate(attacker);

        if (!attacker.simpleDomainActive && !isFinalDomainTurn) {
          this.logAction(`🧠⚡ ${attacker.name} is paralyzed by UNLIMITED VOID sensory overload and loses their action!`, 'info');
          this.activeDomain.turnsLeft--;
          if (this.activeDomain.turnsLeft <= 0) {
            this.endActiveDomain();
          }
          this.scheduleNextTurn(850);
          return;
        }
      }

      this.activeDomain.turnsLeft--;
      if (this.activeDomain.turnsLeft <= 0) {
        this.endActiveDomain();
      }
    }

    // Process status effects at turn start
    if (attacker.statusEffects.includes('sleeping')) {
      attacker.statusEffects = attacker.statusEffects.filter(e => e !== 'sleeping');
      this.logAction(`💤 ${attacker.name} wakes up from their sudden nap!`, 'info');
      this.scheduleNextTurn(600);
      return;
    }

    if (attacker.statusEffects.includes('frozen')) {
      attacker.statusEffects = attacker.statusEffects.filter(e => e !== 'frozen');
      this.logAction(`❄️ ${attacker.name} is frozen solid and shivers helplessly!`, 'info');
      this.options.onAction({
        type: 'status',
        attacker,
        target: attacker,
        text: 'FROZEN!',
        sound: 'blunt'
      });
      this.scheduleNextTurn(800);
      return;
    }

    // Poison DOT check
    if (attacker.statusEffects.includes('poisoned')) {
      const poisonDmg = Math.floor(attacker.maxHp * 0.08) + 10;
      attacker.currentHp = Math.max(1, attacker.currentHp - poisonDmg);
      this.options.onHpUpdate(attacker);
      this.logAction(`🧪 ${attacker.name} takes ${poisonDmg} poison neurotoxin damage!`, 'hit');
      if (Math.random() < 0.35) {
        attacker.statusEffects = attacker.statusEffects.filter(e => e !== 'poisoned');
      }
    }

    // Burn DOT check
    if (attacker.statusEffects.includes('burning')) {
      const burnDmg = Math.floor(attacker.maxHp * 0.07) + 8;
      attacker.currentHp = Math.max(1, attacker.currentHp - burnDmg);
      this.options.onHpUpdate(attacker);
      this.logAction(`🔥 ${attacker.name} suffers ${burnDmg} hellfire burn damage!`, 'hit');
      if (Math.random() < 0.4) {
        attacker.statusEffects = attacker.statusEffects.filter(e => e !== 'burning');
      }
    }

    // Pick target
    const possibleTargets = this.fighters.filter(f => f.isAlive && f.id !== attacker.id);
    if (possibleTargets.length === 0) {
      this.finishBattle(attacker);
      return;
    }

    let target = null;
    if (this.mode === 'duel') {
      target = possibleTargets[0];
    } else {
      // Free For All: AI targets either the lowest HP foe, high-threat foe, or random
      const r = Math.random();
      if (r < 0.45) {
        // Target lowest HP (executioner mindset)
        target = possibleTargets.slice().sort((a, b) => a.currentHp - b.currentHp)[0];
      } else if (r < 0.75) {
        // Target strongest foe
        target = possibleTargets.slice().sort((a, b) => b.stats.str - a.stats.str)[0];
      } else {
        // Random target
        target = possibleTargets[Math.floor(Math.random() * possibleTargets.length)];
      }
    }

    // Resolve combat turn
    this.resolveTurnAction(attacker, target);
  }

  resolveTurnAction(attacker, target, isDoubleStrike = false) {
    // 1. Weakness Checks
    if (!isDoubleStrike) {
      if (attacker.weakness === 'Needs 8 Hours of Sleep' && Math.random() < 0.15) {
        attacker.statusEffects.push('sleeping');
        sounds.playBluntHit();
        const msg = `😴 ${attacker.name} collapses into a deep sleep mid-combat!`;
        this.logAction(msg, 'weakness');
        this.options.onAction({ type: 'weakness', attacker, target: null, text: 'FELL ASLEEP! 💤', sound: 'blunt' });
        this.scheduleNextTurn(850);
        return;
      }

      if (attacker.weakness === 'Loud Sneezes' && Math.random() < 0.16) {
        sounds.playBluntHit();
        const msg = `🤧 ${attacker.name} sneezes with supersonic force and loses focus!`;
        this.logAction(msg, 'weakness');
        this.options.onAction({ type: 'weakness', attacker, target: null, text: 'ACHOO! SNEEZED!', sound: 'blunt' });
        this.scheduleNextTurn(850);
        return;
      }

      if (attacker.weakness === 'Bad Luck Aura' && Math.random() < 0.14) {
        const selfDmg = Math.floor(attacker.stats.str * 0.25) + 12;
        attacker.currentHp = Math.max(1, attacker.currentHp - selfDmg);
        sounds.playBluntHit();
        this.options.onHpUpdate(attacker);
        const msg = `🤕 ${attacker.name} trips over flat arena gravel and suffers ${selfDmg} self-damage!`;
        this.logAction(msg, 'weakness');
        this.options.onAction({ type: 'weakness', attacker, target: attacker, damage: selfDmg, text: 'TRIPPED! -' + selfDmg, sound: 'blunt' });
        this.scheduleNextTurn(850);
        return;
      }

      if (attacker.weakness === 'Compulsive Taunting' && Math.random() < 0.15) {
        sounds.playDodge();
        attacker.stats.chaos += 20; // Taunting boosts chaos!
        const msg = `🗣️ ${attacker.name} stops fighting to monologue like an anime villain!`;
        this.logAction(msg, 'weakness');
        this.options.onAction({ type: 'weakness', attacker, target, text: 'MONOLOGUING...', sound: 'dodge' });
        this.scheduleNextTurn(850);
        return;
      }

      if (attacker.weakness === 'Always Announces Attack') {
        this.logAction(`📢 ${attacker.name} dramatically shouts their ultimate technique name out loud!`, 'info');
      }
    }

    // 2. Target Dodge / Phasing / Boogie Woogie / Full Counter Check
    const hasSpearOfHeaven = attacker.weapon.includes('Inverted Spear of Heaven') || attacker.weapon.includes('Black Rope');
    if (hasSpearOfHeaven && target.shield > 0) {
      this.logAction(`🗡️⚡ ${attacker.name}'s ${attacker.weapon} forcibly NULLIFIES ${target.name}'s active barrier!`, 'power');
      target.shield = 0;
    }

    // Boogie Woogie Clap Swap
    if (!hasSpearOfHeaven && target.powers.includes('Boogie Woogie') && Math.random() < 0.28) {
      sounds.playDodge();
      const swapDmg = Math.floor(target.stats.str * 0.55) + 25;
      attacker.currentHp = Math.max(1, attacker.currentHp - swapDmg);
      this.options.onHpUpdate(attacker);
      this.logAction(`👏🌀 CLAP! ${target.name} activates BOOGIE WOOGIE, swapping positions mid-swing so ${attacker.name} strikes themselves for ${swapDmg} damage!`, 'power');
      this.options.onAction({ type: 'counter', attacker: target, target: attacker, damage: swapDmg, text: `BOOGIE WOOGIE! 👏 -${swapDmg}`, sound: 'dodge' });
      this.scheduleNextTurn(850);
      return;
    }

    let extraDodge = (attacker.weakness === 'Always Announces Attack') ? 0.18 : 0;
    const dodgeChance = Math.min(0.38, ((target.stats.spd / (attacker.stats.spd + 100)) * 0.4) + extraDodge);
    const hasPhasing = target.powers.includes('Invisibility & Phasing') || target.powers.includes('Instant Teleportation') || target.race === 'Voidwalker' || target.race.includes('Heavenly Restricted');
    
    // Domain Expansion Negates Dodge
    const hasDomain = attacker.powers.includes('Domain Expansion');
    if (!hasDomain && !hasSpearOfHeaven && Math.random() < (hasPhasing ? 0.32 : dodgeChance)) {
      sounds.playDodge();
      const msg = `💨 ${target.name} swiftly evades ${attacker.name}'s incoming strike!`;
      this.logAction(msg, 'dodge');
      this.options.onAction({ type: 'dodge', attacker, target, text: 'DODGED!', sound: 'dodge' });
      this.scheduleNextTurn(800);
      return;
    }

    // Full Counter Check on Magic / Elemental Powers
    if (!hasSpearOfHeaven && target.powers.includes('Full Counter') && Math.random() < 0.22) {
      sounds.playMagicCast();
      const counterDmg = Math.floor(attacker.stats.str * 0.85) + 35;
      attacker.currentHp = Math.max(0, attacker.currentHp - counterDmg);
      this.options.onHpUpdate(attacker);
      this.logAction(`🛡️⚡ ${target.name} triggers FULL COUNTER, reflecting the attack back at ${attacker.name} for ${counterDmg} damage!`, 'power');
      this.options.onAction({ type: 'counter', attacker: target, target: attacker, damage: counterDmg, text: `FULL COUNTER! -${counterDmg}`, sound: 'magic' });
      this.scheduleNextTurn(900);
      return;
    }

    // 3. Power Checks (Attacker)
    let powerBonus = 0;
    let powerEffectText = '';
    let attackSound = 'slash';
    let triggeredDomainPause = false;

    // CT Burnout check after Domain ends
    if (attacker.ctBurnoutTurns > 0) {
      attacker.ctBurnoutTurns--;
      powerBonus -= 20;
      this.logAction(`🥵 ${attacker.name}'s Cursed Technique is experiencing post-Domain CT BURNOUT (recovering)!`, 'info');
    }

    // Mid-Battle "Honored One" Awakening for Unlimited Potential
    if (attacker.sorcererGrade && attacker.sorcererGrade.includes('Unlimited Potential') && !attacker.awakenedPotential && ((attacker.currentHp / attacker.maxHp) < 0.65 || attacker.bfChain >= 1)) {
      attacker.awakenedPotential = true;
      const awakenHeal = Math.floor(attacker.maxHp * 0.35);
      attacker.currentHp = Math.min(attacker.maxHp, attacker.currentHp + awakenHeal);
      attacker.stats.str = Math.floor(attacker.stats.str * 1.25);
      attacker.stats.spd = Math.floor(attacker.stats.spd * 1.25);
      attacker.stats.int = Math.floor(attacker.stats.int * 1.25);
      attacker.bfOdds = Math.min(0.75, (attacker.bfOdds || 0.52) + 0.15);
      powerBonus += 80;
      powerEffectText += '✨👑 HONORED ONE AWAKENING! ';
      sounds.playFanfare('godTier');
      this.options.onHpUpdate(attacker);
      this.logAction(`✨👑 "THROUGHOUT HEAVEN AND EARTH, I ALONE AM THE HONORED ONE!" ${attacker.name}'s Unlimited Potential awakens (+${awakenHeal} HP, +25% ALL STATS)!`, 'power');
    }

    // Domain Expansion & Split-Screen Domain Clash Check
    const hasDomainPower = attacker.powers.some(p => p.includes('Domain Expansion')) ||
      (attacker.sorcererGrade && (attacker.sorcererGrade.includes('Special Grade') || attacker.sorcererGrade.includes('Heavenly Anomaly') || attacker.sorcererGrade.includes('Unlimited Potential')));
    const targetCanClash = target.powers.some(p => p.includes('Domain Expansion')) ||
      (target.sorcererGrade && (target.sorcererGrade.includes('Special Grade') || target.sorcererGrade.includes('Heavenly Anomaly') || target.sorcererGrade.includes('Unlimited Potential') || target.sorcererGrade.includes('Grade 1')));

    if (hasDomainPower && attacker.ctBurnoutTurns === 0 && !this.activeDomain && Math.random() < 0.28) {
      triggeredDomainPause = true;
      powerBonus += 90;
      attackSound = 'magic';
      sounds.playDomainExpansion();

      if (targetCanClash && Math.random() < 0.72) {
        // SPLIT-SCREEN DOMAIN CLASH -> WINNING DOMAIN CONTINUATION (4.0s)
        const atkScore = attacker.stats.int + attacker.stats.str * 0.5 + (attacker.bfChain * 25) + Math.random() * 45;
        const tgtScore = target.stats.int + target.stats.str * 0.5 + (target.bfChain * 25) + Math.random() * 45;
        const clashWinner = atkScore >= tgtScore ? attacker : target;
        const clashLoser = clashWinner.id === attacker.id ? target : attacker;
        const winTheme = clashWinner.id === attacker.id ? (attacker.domainTheme || 'shrine') : (target.domainTheme || 'void');
        const winDomainName = clashWinner.domainName || (winTheme === 'shrine' ? 'Malevolent Shrine' : 'Unlimited Void');

        this.activeDomain = {
          caster: clashWinner,
          target: clashLoser,
          name: winDomainName,
          theme: winTheme,
          turnsLeft: 3
        };

        powerEffectText = `⛩️⚡🌌 DOMAIN CLASH -> ${winDomainName.toUpperCase()} OVERWHELMS! `;
        this.logAction(`⛩️⚡🌌 SPLIT-SCREEN DOMAIN CLASH! ${attacker.name} and ${target.name}'s barriers collide in a diagonal tug-of-war—${clashWinner.name}'s 「${winDomainName}」 shatters the opposing barrier and stays active!`, 'crit');
        this.options.onAction({
          type: 'domainClash',
          attacker,
          target,
          clashWinner,
          clashLoser,
          domainName: winDomainName,
          domainTheme: winTheme === 'shrine' ? 'shrine' : 'void',
          text: `DOMAIN CLASH: ${winDomainName.toUpperCase()} WINS!`,
          sound: 'magic'
        });
      } else {
        const domainName = attacker.domainName || (attacker.archetypeSub && attacker.archetypeSub.includes('Domain') ? attacker.archetypeSub : 'Unlimited Void');
        const domainTheme = attacker.domainTheme || (domainName.includes('Shrine') ? 'shrine' : 'void');
        this.activeDomain = {
          caster: attacker,
          target,
          name: domainName,
          theme: domainTheme,
          turnsLeft: 3
        };
        powerEffectText = `🌑 RYŌIKI TENKAI: ${domainName.toUpperCase()}! `;
        this.logAction(`🌌 ${attacker.name} manifests DOMAIN EXPANSION: 「${domainName}」! The barrier seals the battlefield for 3 turns with guaranteed sure-hit attacks!`, 'power');
        this.options.onAction({
          type: 'domainClash',
          attacker,
          target,
          clashWinner: attacker,
          clashLoser: target,
          domainName,
          domainTheme: domainTheme === 'shrine' ? 'shrine' : 'void',
          text: `DOMAIN EXPANSION: ${domainName.toUpperCase()}!`,
          sound: 'magic'
        });
      }
    } else if (attacker.powers.includes('Limitless & Hollow Purple') && Math.random() < 0.30) {
      powerBonus += 85;
      powerEffectText = '🟣🤞 HOLLOW TECHNIQUE: PURPLE! ';
      attackSound = 'explosion';
      sounds.playExplosion();
      this.logAction(`🟣✨ ${attacker.name} collides Lapse Blue and Reversal Red—unleashing HOLLOW PURPLE imaginary mass erasure on ${target.name}!`, 'power');
    } else if (attacker.powers.includes('Cleave & Dismantle (Shrine)') && Math.random() < 0.32) {
      powerBonus += 70;
      powerEffectText = '⛩️🩸 WORLD-CUTTING DISMANTLE! ';
      attackSound = 'slash';
      sounds.playSlash();
      this.logAction(`⛩️🗡️ ${attacker.name} chants the twin tenets and bisects space itself with CLEAVE & DISMANTLE!`, 'power');
    } else if (attacker.powers.includes('Time Stop') && Math.random() < 0.22) {
      powerBonus += 50;
      powerEffectText = '⏳ TIME STOP! ';
      attackSound = 'magic';
      sounds.playMagicCast();
      this.logAction(`⌛ ${attacker.name} freezes time and delivers uninterrupted strikes!`, 'power');
    } else if (attacker.powers.includes('Lightning God Speed') && Math.random() < 0.25) {
      powerBonus += 55;
      powerEffectText = '⚡ LIGHTNING GOD SPEED! ';
      attackSound = 'explosion';
      sounds.playExplosion();
      this.logAction(`⚡ ${attacker.name} moves at lightspeed, striking ${target.name} with golden lightning!`, 'power');
    } else if (attacker.powers.includes('Reality Warping') && Math.random() < 0.25) {
      powerBonus += 60;
      powerEffectText = '🌀 REALITY WARP! ';
      attackSound = 'explosion';
      sounds.playExplosion();
      this.logAction(`🌌 ${attacker.name} warps spacetime to crush ${target.name}!`, 'power');
    } else if (attacker.powers.includes('Black Hole Singularity') && Math.random() < 0.2) {
      powerBonus += 75;
      powerEffectText = '🕳️ BLACK HOLE SINGULARITY! ';
      attackSound = 'explosion';
      sounds.playExplosion();
      this.logAction(`🕳️ ${attacker.name} collapses a singularity onto ${target.name}!`, 'power');
    } else if (attacker.powers.includes('Blood Bending') && Math.random() < 0.22) {
      powerBonus += 45;
      powerEffectText = '🩸 PIERCING BLOOD! ';
      attackSound = 'magic';
      this.logAction(`🩸 ${attacker.name} condenses crimson energy and fires a supersonic PIERCING BLOOD beam at ${target.name}!`, 'power');
    } else if (attacker.powers.includes('Pyrokinesis') && Math.random() < 0.3) {
      powerBonus += 35;
      powerEffectText = '🔥 HELLFIRE! ';
      attackSound = 'explosion';
      if (!target.statusEffects.includes('burning')) target.statusEffects.push('burning');
    } else if (attacker.powers.includes('Cryokinesis') && Math.random() < 0.28) {
      powerBonus += 30;
      powerEffectText = '❄️ BLIZZARD! ';
      attackSound = 'magic';
      if (Math.random() < 0.4 && !target.statusEffects.includes('frozen')) target.statusEffects.push('frozen');
    }

    // 4. Shonen Protagonist Low-HP Awakening
    if (attacker.backstory === 'Reborn Anime Protagonist' && (attacker.currentHp / attacker.maxHp) < 0.28 && !attacker.hasShonenProtagonistBuff) {
      attacker.hasShonenProtagonistBuff = true;
      powerBonus += 65;
      powerEffectText += '🔥 SHONEN PLOT ARMOR AWAKENING! ';
      sounds.playFanfare('legendary');
      this.logAction(`⭐ ${attacker.name} remembers their comrades and unlocks an INSANE shonen power surge!`, 'power');
    }

    // 5. Base Damage Calculation
    let baseDmg = (attacker.stats.str * 0.75) + powerBonus;

    // Archetype modifier
    if (attacker.archetype === 'Cursed Vessel') {
      const fingers = attacker.sukunaFingers || 10;
      const vesselMult = 1 + (fingers * 0.035); // Up to +70% at 20 Fingers
      baseDmg *= vesselMult;
      if (fingers >= 15 && Math.random() < 0.3) {
        powerEffectText += `👁️ SUKUNA VESSEL (${fingers}F) SURGE! `;
      }
    } else if (attacker.archetype === 'Special Grade Sorcerer') {
      baseDmg *= 1.35;
    } else if (attacker.archetype === 'Berserker') {
      const missingHpRatio = 1 - (attacker.currentHp / attacker.maxHp);
      baseDmg *= (1 + missingHpRatio * 0.9); // Up to +90% bonus when low
    } else if (attacker.archetype === 'Slayer' && attacker.archetypeSub) {
      if (attacker.archetypeSub.toLowerCase().includes(target.race.toLowerCase())) {
        baseDmg *= 1.8; // 180% damage to designated prey
        powerEffectText += '🎯 PREY EXECUTION! ';
      }
    } else if (attacker.archetype === 'Gambler') {
      // High-Stakes Gambler Logic
      const wager = attacker.archetypeSub || 'Roulette of Death';
      if (wager.includes('Roulette')) {
        if (Math.random() < 0.5) {
          baseDmg *= 3.0;
          powerEffectText += '🎰 ROULETTE JACKPOT! (300% DMG) ';
          sounds.playFanfare('legendary');
          this.logAction(`🎲 ${attacker.name} spins the ROULETTE OF DEATH and hits RED! 300% damage unleashed!`, 'power');
        } else {
          baseDmg = 0;
          powerEffectText += '💨 ROULETTE WHIFF! ';
          this.logAction(`🎲 ${attacker.name}'s Roulette of Death landed on BLACK! Attack completely whiffed!`, 'weakness');
        }
      } else if (wager.includes('Jackpot Fever')) {
        attacker.jackpotCombo = (attacker.jackpotCombo || 0) + 1;
        const comboMult = 1 + (attacker.jackpotCombo * 0.5);
        baseDmg *= comboMult;
        powerEffectText += `🎰 JACKPOT FEVER x${attacker.jackpotCombo}! `;
      } else if (wager.includes('All-In Stake')) {
        if (attacker.currentHp > 20) {
          const sacrifice = Math.floor(attacker.currentHp * 0.3);
          attacker.currentHp -= sacrifice;
          this.options.onHpUpdate(attacker);
          baseDmg *= 4.0;
          powerEffectText += `💥 ALL-IN STAKE (-${sacrifice} HP)! 400% DAMAGE! `;
          sounds.playExplosion();
          this.logAction(`🎲 ${attacker.name} goes ALL-IN, sacrificing ${sacrifice} HP for a devastating 400% strike!`, 'power');
        }
      } else if (wager.includes('Golden Slot Machine')) {
        const slotRoll = Math.random();
        if (slotRoll < 0.34) {
          const heal = Math.floor(attacker.maxHp * 0.6);
          attacker.currentHp = Math.min(attacker.maxHp, attacker.currentHp + heal);
          this.options.onHpUpdate(attacker);
          powerEffectText += `7️⃣7️⃣7️⃣ TRIPLE 7 JACKPOT: +${heal} HP HEALED! `;
          sounds.playFanfare('godTier');
        } else if (slotRoll < 0.67) {
          baseDmg *= 2.5;
          powerEffectText += '💎💎💎 TRIPLE DIAMOND: 250% DMG! ';
          sounds.playCrit();
        } else {
          attacker.shield = (attacker.shield || 0) + 180;
          powerEffectText += '🛡️🛡️🛡️ TRIPLE SHIELD: +180 BARRIER! ';
          sounds.playMagicCast();
        }
      }
    }

    // Weapon modifiers & JJK Cursed Tools / Meme Weapon Effects
    if (attacker.weaponRarity === 'godTier') baseDmg *= 1.45;
    else if (attacker.weaponRarity === 'mythic' || attacker.weaponRarity === 'legendary') baseDmg *= 1.25;

    if (attacker.weapon.includes('Playful Cloud')) {
      const strBonus = Math.floor(attacker.stats.str * 0.45);
      baseDmg += strBonus;
      powerEffectText += '⛓️🩸 PLAYFUL CLOUD FORCE! ';
      attackSound = 'blunt';
    } else if (attacker.weapon.includes('Inverted Spear of Heaven')) {
      baseDmg += 45;
      powerEffectText += '🗡️🚫 TECHNIQUE NULLIFICATION! ';
    } else if (attacker.weapon.includes('Executioner\'s Sword')) {
      if (Math.random() < 0.16) {
        baseDmg += 550;
        powerEffectText += '⚖️⚔️ DEATH PENALTY VERDICT! ';
        this.logAction(`⚖️⚡ ${attacker.name}'s EXECUTIONER'S SWORD delivers a guilty Death Penalty sentence!`, 'power');
      } else {
        baseDmg += 55;
        powerEffectText += '⚖️ GOLDEN GAVEL SLASH! ';
      }
    } else if (attacker.weapon.includes('Kamutoke')) {
      baseDmg += 50;
      powerEffectText += '⚡🔱 KAMUTOKE VAJRA THUNDER! ';
      attackSound = 'explosion';
    } else if (attacker.weapon === 'Spatula With Lemon Juice') {
      powerEffectText += '🍋 LEMON IN THE EYES! ';
      target.statusEffects.push('blinded');
    } else if (attacker.weapon === 'Enchanted Brick') {
      powerEffectText += '🧱 UNSTOPPABLE BRICK! ';
      baseDmg += 25;
    } else if (attacker.weapon.includes('Nokia 3310')) {
      powerEffectText += '📱 INDESTRUCTIBLE NOKIA SMASH! ';
      baseDmg += 35;
      attackSound = 'blunt';
    } else if (attacker.weapon.includes('Folding Steel Chair')) {
      powerEffectText += '🪑 WWE CHAIR SHOT! ';
      attackSound = 'blunt';
      if (Math.random() < 0.3) target.statusEffects.push('confused');
    } else if (attacker.weapon.includes('Cursed French Baguette')) {
      powerEffectText += '🥖 TUNGSTEN BAGUETTE SLAM! ';
      attackSound = 'blunt';
    } else if (attacker.weapon.includes('Chihuahua')) {
      powerEffectText += '🐕 CANINE ANKLE FRENZY! ';
      if (!target.statusEffects.includes('bleeding')) target.statusEffects.push('bleeding');
    } else if (attacker.weapon.includes('Excalibur')) {
      powerEffectText += '✨ EXCALIBUR HOLY BEAM! ';
      attackSound = 'magic';
      baseDmg += 40;
    }

    // Target Damage Mitigation
    let mitigation = (target.stats.dur * 0.35);
    if (target.archetype === 'Paladin') mitigation *= 1.5;
    if (target.race === 'Slime Sovereign') mitigation *= 1.6; // Fluid body absorbs physical blows
    if (target.powers.includes('Limitless & Hollow Purple') && !hasSpearOfHeaven && !attacker.powers.includes('Domain Expansion')) {
      mitigation *= 1.55; // Infinity slows incoming strikes
    }
    if (target.simpleDomainActive) {
      mitigation *= 1.35;
    }
    if (target.weakness === 'Fragile Bones' && (attacker.weapon.includes('Maul') || attacker.weapon.includes('Hammer') || attacker.weapon.includes('Brick') || attacker.weapon.includes('Crowbar') || attacker.weapon.includes('Nokia') || attacker.weapon.includes('Baguette') || attacker.weapon.includes('Playful Cloud'))) {
      mitigation *= 0.25; // Fragile bones shattered!
      powerEffectText += '💀 FRAGILE BONES SHATTERED! ';
    }

    // Weapon Enchantment or Split Soul Katana / Cleave: completely ignores mitigation!
    if (attacker.enchantments.includes('Spacetime Rend') || attacker.enchantments.includes('Armor Bypass Rend') || attacker.weapon.includes('Split Soul Katana') || powerEffectText.includes('DISMANTLE')) {
      mitigation = 0;
      powerEffectText += attacker.weapon.includes('Split Soul Katana') ? '👻 SOUL SLASH (0 DEF)! ' : '🌌 ARMOR BYPASS! ';
    }

    // Chaos Variance
    const chaosRoll = 0.85 + (Math.random() * 0.35) * (attacker.stats.chaos / 100);
    let finalDamage = Math.max(14, Math.floor((baseDmg - mitigation) * chaosRoll));

    // UNIVERSAL SORCERER GRADE BLACK FLASH (KOKUSEN) & 120% ZONE CHAIN
    const gradeBaseOdds = attacker.bfOdds || 0.22;
    const traitBonusOdds = (attacker.powers.includes('Black Flash (Kokusen)') || attacker.archetype === 'Cursed Vessel' || attacker.archetype === 'Special Grade Sorcerer' || attacker.race === 'Death Painting Womb') ? 0.10 : 0;
    const chainBonusOdds = (attacker.bfChain || 0) * 0.08;
    const blackFlashChance = Math.min(0.78, gradeBaseOdds + traitBonusOdds + chainBonusOdds);
    const isBlackFlash = !triggeredDomainPause && (Math.random() < blackFlashChance);

    let critMultiplier = (attacker.backstory === 'Won the Cosmic Lottery') ? 2.5 : 1.85;
    const critChance = Math.min(0.48, (attacker.stats.int * 0.0015) + (attacker.stats.chaos * 0.0015));
    const isCrit = isBlackFlash || Math.random() < critChance || (attacker.powers.includes('Probability Manipulation') && Math.random() < 0.4) || attacker.hasShonenProtagonistBuff;
    
    if (isBlackFlash) {
      attacker.bfChain = (attacker.bfChain || 0) + 1;
      finalDamage = Math.floor(finalDamage * 2.5);
      attacker.inTheZone = true; // 120% Cursed Energy output zone
      attacker.stats.str = Math.floor(attacker.stats.str * 1.08);
      powerEffectText = `⚡⚫ 黒閃 • BLACK FLASH (120% ZONE • ${attacker.bfChain}x CHAIN • ^2.5)! ` + powerEffectText;
      attackSound = 'blackFlash';
      sounds.playBlackFlash();
      this.logAction(`⚡⚫ 黒閃! [${attacker.sorcererGrade}] The sparks of black choose ${attacker.name} (0.000001s charge -> ${attacker.bfChain}x Chain)! Spatial distortion hits ${target.name} for ^2.5 (${finalDamage}) damage!`, 'crit');
    } else if (isCrit) {
      finalDamage = Math.floor(finalDamage * critMultiplier);
      attackSound = 'crit';
      sounds.playCrit();
    } else {
      if (attackSound === 'slash') sounds.playSlash();
      else if (attackSound === 'blunt') sounds.playBluntHit();
      else if (attackSound === 'magic') sounds.playMagicCast();
      else if (attackSound === 'explosion') sounds.playExplosion();
    }

    // Shield Absorption Check
    if (target.shield > 0) {
      if (target.shield >= finalDamage) {
        target.shield -= finalDamage;
        this.logAction(`🛡️ ${target.name}'s Barrier absorbed all ${finalDamage} damage! (${target.shield} shield remaining)`, 'info');
        finalDamage = 0;
      } else {
        finalDamage -= target.shield;
        this.logAction(`🛡️ ${target.name}'s Barrier shattered after absorbing ${target.shield} damage!`, 'info');
        target.shield = 0;
      }
    }

    // Apply Damage
    target.currentHp = Math.max(0, target.currentHp - finalDamage);
    attacker.damageDealt += finalDamage;

    // Enchantment Procs (Lifesteal / Void Siphon)
    if (attacker.enchantments.includes('Void Siphon') || attacker.enchantments.includes('Lifesteal Berserk') || attacker.enchantments.includes('25% Life Vampirism')) {
      const heal = Math.floor(finalDamage * 0.22);
      attacker.currentHp = Math.min(attacker.maxHp, attacker.currentHp + heal);
      this.options.onHpUpdate(attacker);
      powerEffectText += `🩸 +${heal} HP HEALED! `;
    }

    // Enchantment Procs (Frostbite)
    if (attacker.enchantments.includes('Frostbite Freeze') && Math.random() < 0.35) {
      if (!target.statusEffects.includes('frozen')) target.statusEffects.push('frozen');
      powerEffectText += '❄️ FROSTBITE FREEZE! ';
    }

    // Enchantment Procs (Toxic Venom)
    if (attacker.enchantments.includes('Toxic Neurotoxin') && !target.statusEffects.includes('poisoned')) {
      target.statusEffects.push('poisoned');
      powerEffectText += '🧪 NEUROTOXIN INJECTED! ';
    }

    this.options.onHpUpdate(target);

    // Format Combat Log
    const critText = isBlackFlash ? `⚡⚫ 黒閃 BLACK FLASH (${attacker.bfChain}x)! ` : (isCrit ? '💥 CRITICAL HIT! ' : '');
    const logMsg = `${attacker.name} strikes ${target.name} with ${attacker.weapon}! ${powerEffectText}${critText}(-${finalDamage} HP)`;
    this.logAction(logMsg, isCrit ? 'crit' : 'hit');

    // Trigger visual action animation (if Domain Clash already fired onAction, only fire attack if not domain)
    if (!triggeredDomainPause) {
      this.options.onAction({
        type: isBlackFlash ? 'blackFlash' : 'attack',
        attacker,
        target,
        damage: finalDamage,
        isCrit,
        isBlackFlash,
        bfChain: attacker.bfChain || 0,
        powerEffectText,
        text: `${critText}-${finalDamage}`,
        sound: attackSound
      });
    }

    // 6. Target Defeat / Death Check / Revivals / Indomitable Will
    if (target.currentHp <= 0) {
      // Indomitable Will Passive
      if (target.passives.includes('Indomitable Will') && !target.usedIndomitableWill) {
        target.usedIndomitableWill = true;
        target.currentHp = 1;
        this.options.onHpUpdate(target);
        sounds.playFanfare('epic');
        this.logAction(`🛡️💥 ${target.name}'s INDOMITABLE WILL refuses to break! Clings to life with 1 HP!`, 'power');
        this.options.onAction({ type: 'status', attacker: target, target: target, text: 'INDOMITABLE WILL!', sound: 'magic' });
      }
      // Phoenixkin Rebirth
      else if (target.race === 'Phoenixkin' && !target.isPhoenixRevived) {
        target.isPhoenixRevived = true;
        target.currentHp = Math.floor(target.maxHp * 0.42);
        sounds.playExplosion();
        this.options.onHpUpdate(target);
        this.logAction(`🔥🐦 ${target.name} erupts from solar ash in an immortal PHOENIX REBIRTH! (+${target.currentHp} HP)`, 'power');
        this.options.onAction({ type: 'revive', attacker: target, target: target, text: 'PHOENIX REBIRTH!', sound: 'explosion' });
      }
      // Necromancy Revival
      else if (target.powers.includes('Necromancy') && !target.isUndeadRevived) {
        target.isUndeadRevived = true;
        target.currentHp = Math.floor(target.maxHp * 0.38);
        sounds.playMagicCast();
        this.options.onHpUpdate(target);
        this.logAction(`💀 ${target.name} rises from the dead as an Undead Lich Lord! (+${target.currentHp} HP)`, 'power');
        this.options.onAction({ type: 'revive', attacker: target, target: target, text: 'UNDEAD REVIVAL!', sound: 'magic' });
      } else {
        target.isAlive = false;
        attacker.kills++;
        sounds.playBluntHit();
        this.logAction(`☠️ ${target.name} has been ELIMINATED by ${attacker.name}!`, 'kill');
        this.options.onFighterFaint(target, attacker);
      }
    } else {
      // Ten Shadows (Mahoraga) Eight-Handled Dharma Wheel Adaptation
      if (target.powers.includes('Ten Shadows (Mahoraga)') && target.mahoragaSpins < 4) {
        target.mahoragaSpins++;
        const adaptHeal = Math.floor(target.maxHp * 0.16);
        target.currentHp = Math.min(target.maxHp, target.currentHp + adaptHeal);
        target.stats.dur += 22;
        target.stats.str += 15;
        this.options.onHpUpdate(target);
        this.logAction(`☸️⚙️ CLANK! ${target.name}'s Eight-Handled Dharma Wheel turns (Spin #${target.mahoragaSpins})! Adapts to ${attacker.name}'s attacks (+${adaptHeal} HP, +22 DUR, +15 STR)!`, 'power');
      }

      // Reverse Cursed Technique (RCT) Positive Energy Healing
      if (target.powers.includes('Reverse Cursed Technique') && target.currentHp < (target.maxHp * 0.45) && target.usedRCT < 2) {
        target.usedRCT++;
        const rctHeal = Math.floor(target.maxHp * 0.38);
        target.currentHp = Math.min(target.maxHp, target.currentHp + rctHeal);
        sounds.playMagicCast();
        this.options.onHpUpdate(target);
        this.logAction(`♻️✨ ${target.name} multiplies negative Cursed Energy into positive REVERSE CURSED TECHNIQUE! Regenerates +${rctHeal} HP!`, 'power');
      }

      // Super Regeneration Check when HP low
      if (target.powers.includes('Super Regeneration') && target.currentHp < (target.maxHp * 0.3) && !target.hasRegened) {
        target.hasRegened = true;
        const heal = Math.floor(target.maxHp * 0.32);
        target.currentHp = Math.min(target.maxHp, target.currentHp + heal);
        sounds.playMagicCast();
        this.options.onHpUpdate(target);
        this.logAction(`💖 ${target.name}'s Super Regeneration knits flesh together! (+${heal} HP)`, 'power');
      }
    }

    // Combat Pause Duration for Black Flash (2400ms) or Domain Clash + Active Domain (6400ms)
    const cinematicPauseMs = triggeredDomainPause ? 6400 : (isBlackFlash ? 2400 : 1100);

    // Double Strike Check
    if (!isDoubleStrike && !triggeredDomainPause && attacker.isAlive && target.isAlive && (attacker.passives.includes('Double Strike Mastery') && Math.random() < 0.32)) {
      this.logAction(`⚡ ${attacker.name}'s Double Strike Mastery triggers an IMMEDIATE FOLLOW-UP ATTACK!`, 'power');
      setTimeout(() => {
        if (this.isRunning && attacker.isAlive && target.isAlive) {
          this.resolveTurnAction(attacker, target, true);
        }
      }, isBlackFlash ? 2200 : 400);
      return;
    }

    // Schedule next turn scaled by speed (with guaranteed minimum pause for Black Flash / Domain Clash)
    this.scheduleNextTurn(cinematicPauseMs, triggeredDomainPause || isBlackFlash);
  }

  endActiveDomain() {
    if (!this.activeDomain) return;
    const caster = this.activeDomain.caster;
    const domName = this.activeDomain.name;
    this.activeDomain = null;
    if (caster && caster.isAlive) {
      caster.ctBurnoutTurns = 1;
      this.logAction(`🥵 「${domName}」 barrier collapses! ${caster.name} enters CT BURNOUT for 1 turn!`, 'info');
    }
  }

  forceDomainClash(preferredWinnerTheme = null) {
    const alive = this.fighters.filter(f => f.isAlive);
    if (alive.length < 2) return;
    const f1 = alive[0];
    const f2 = alive[1];
    const winTheme = preferredWinnerTheme || (Math.random() < 0.5 ? 'shrine' : 'void');
    const clashWinner = winTheme === 'shrine' ? f1 : f2;
    const clashLoser = clashWinner.id === f1.id ? f2 : f1;
    const winDomainName = winTheme === 'shrine' ? 'Malevolent Shrine' : 'Unlimited Void';

    this.activeDomain = {
      caster: clashWinner,
      target: clashLoser,
      name: winDomainName,
      theme: winTheme,
      turnsLeft: 3
    };

    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }

    sounds.playDomainExpansion();
    this.logAction(`⛩️⚡🌌 DOMAIN CLASH TRIGGERED! ${f1.name} (Malevolent Shrine) vs ${f2.name} (Unlimited Void)! ${clashWinner.name}'s 「${winDomainName}」 wins the clash and stays active for 4.0s!`, 'crit');
    this.options.onAction({
      type: 'domainClash',
      attacker: f1,
      target: f2,
      clashWinner,
      clashLoser,
      domainName: winDomainName,
      domainTheme: winTheme,
      text: `DOMAIN CLASH: ${winDomainName.toUpperCase()}!`,
      sound: 'magic'
    });

    if (this.isRunning && !this.isPaused) {
      this.scheduleNextTurn(6400, true);
    }
  }

  scheduleNextTurn(delayMs, isCinematicPause = false) {
    if (!this.isRunning) return;
    const actualDelay = isCinematicPause
      ? Math.max(2100, Math.floor(delayMs / Math.min(this.speed, 1.5)))
      : Math.max(120, Math.floor(delayMs / this.speed));
    this.timerId = setTimeout(() => {
      this.executeNextTurn();
    }, actualDelay);
  }

  finishBattle(winner) {
    this.stop();
    sounds.playFanfare('godTier');

    // Sort rankings by alive status and kills
    const rankings = this.fighters.slice().sort((a, b) => {
      if (a.isAlive && !b.isAlive) return -1;
      if (!a.isAlive && b.isAlive) return 1;
      return b.kills - a.kills || b.damageDealt - a.damageDealt;
    });

    const champ = winner || rankings[0];
    this.logAction(`🏆 TOURNAMENT OVER! ${champ.name} emerges as the ALMIGHTY ARENA GOAT!`, 'victory');
    this.options.onBattleEnd(champ, rankings);
  }

  logAction(msg, type = 'normal') {
    this.logHistory.unshift({ msg, type, timestamp: new Date().toLocaleTimeString() });
    this.options.onLog(msg, type);
  }
}

window.BattleEngine = BattleEngine;
