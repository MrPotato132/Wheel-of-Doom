/**
 * WHEEL OF FAITH - CHARACTER GENERATION & ROSTER ENGINE
 * Generates procedural titles, calculates combat ratings, dynamic avatar visuals,
 * and manages localStorage persistence and Level-Up mutations.
 */

class CharacterManager {
  constructor() {
    this.currentDraft = this.createEmptyDraft();
  }

  createEmptyDraft() {
    return {
      id: 'wof_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
      name: this.generateRandomHeroName(),
      level: 1,
      race: null,
      subRace: null,
      archetype: null,
      archetypeSub: null,
      weapon: null,
      enchantments: [],
      powers: [],
      weakness: null,
      backstory: null,
      combatRank: null,
      passives: [],
      stats: {
        str: 50,
        spd: 50,
        dur: 50,
        int: 50,
        chaos: 50
      },
      createdAt: new Date().toISOString()
    };
  }

  resetDraft() {
    this.currentDraft = this.createEmptyDraft();
    return this.currentDraft;
  }

  generateRandomHeroName() {
    const prefixes = [
      'Valen', 'Kael', 'Malakor', 'Zephyr', 'Drakon', 'Aurelia', 'Vesper', 'Balthazar',
      'Ignis', 'Morrigan', 'Bushin-Jr', 'Xylar', 'Fenrir', 'Azazel', 'Nyx', 'Ragnar',
      'Solas', 'Garrick', 'Lyra', 'Darius', 'Kallisto', 'Thorne', 'Elysia', 'Vane',
      'Jin-Woo', 'Kage', 'Gideon', 'Riven', 'Seraphina', 'Dante', 'Vergil', 'Lucian',
      'Alucard', 'Cassian', 'Soren', 'Valkor', 'Zephyros', 'Orion', 'Ember', 'Tiberius'
    ];
    return prefixes[Math.floor(Math.random() * prefixes.length)];
  }

  // Set attribute from wheel roll
  setAttribute(category, segmentData) {
    if (!this.currentDraft) this.resetDraft();

    switch (category) {
      case 'race':
        this.currentDraft.race = segmentData;
        this.adjustStatsForRace(segmentData.text);
        break;
      case 'subRace':
        this.currentDraft.subRace = segmentData;
        break;
      case 'archetype':
        this.currentDraft.archetype = segmentData;
        this.adjustStatsForArchetype(segmentData.text);
        break;
      case 'archetypeSub':
        this.currentDraft.archetypeSub = segmentData;
        break;
      case 'weapon':
        this.currentDraft.weapon = segmentData;
        break;
      case 'power':
        if (!this.currentDraft.powers.some(p => p.text === segmentData.text)) {
          this.currentDraft.powers.push(segmentData);
        }
        break;
      case 'domainType':
        this.currentDraft.domainType = segmentData;
        this.currentDraft.domainName = segmentData.text;
        this.currentDraft.domainTheme = segmentData.theme || 'void';
        break;
      case 'weakness':
        this.currentDraft.weakness = segmentData;
        break;
      case 'backstory':
        this.currentDraft.backstory = segmentData;
        if (segmentData.text === 'Chaos Inversion') {
          this.applyChaosInversion();
        }
        break;
      case 'stats':
        this.currentDraft.combatRank = segmentData;
        this.finalizeStatsWithRank(segmentData);
        break;
    }
  }

  adjustStatsForRace(raceName) {
    const s = this.currentDraft.stats;
    switch (raceName) {
      // Baseline
      case 'Orc': s.str += 35; s.dur += 30; s.int -= 15; break;
      case 'Elf': s.spd += 35; s.int += 25; s.dur -= 10; break;
      case 'Dwarf': s.dur += 40; s.str += 25; s.spd -= 20; break;
      case 'Demon': s.str += 35; s.chaos += 30; break;
      case 'Angel': s.spd += 30; s.dur += 25; s.int += 25; break;
      case 'Android': s.int += 45; s.dur += 30; s.chaos -= 20; break;
      case 'Elemental': s.chaos += 40; s.str += 25; s.dur += 25; break;
      case 'Skeleton': s.dur -= 25; s.chaos += 35; s.spd += 15; break;
      case 'Dragonkin': s.str += 40; s.dur += 35; break;
      case 'Cosmic Warrior': s.str += 50; s.spd += 40; s.dur += 40; s.int += 40; break;
      case 'Nucleite': s.chaos += 60; s.dur += 35; break;
      // Expanded
      case 'Shadow Monarch': s.str += 45; s.spd += 35; s.int += 30; break;
      case 'Phoenixkin': s.spd += 35; s.dur += 30; s.int += 30; break;
      case 'Nephilim': s.str += 40; s.spd += 35; s.dur += 20; break;
      case 'Cyborg Titan': s.dur += 55; s.str += 40; s.spd -= 15; break;
      case 'Voidwalker': s.spd += 45; s.int += 30; s.chaos += 25; break;
      case 'Slime Sovereign': s.dur += 50; s.chaos += 30; s.str += 15; break;
      case 'Eldritch Entity': s.chaos += 65; s.int += 40; s.str += 35; break;
      case 'Djinn (Genie)': s.int += 40; s.spd += 35; s.chaos += 25; break;
      case 'Beastfolk Chimera': s.str += 35; s.spd += 35; s.dur += 20; break;
      case 'Gargoyle': s.dur += 60; s.str += 25; s.spd -= 20; break;
      case 'Insectoid Hivemaster': s.spd += 35; s.dur += 35; s.int += 20; break;
      case 'Demi-God': s.str += 45; s.dur += 35; s.int += 30; break;
      case 'Homunculus': s.int += 40; s.chaos += 30; s.dur += 20; break;
      case 'Astral Seraph': s.int += 50; s.spd += 40; s.dur += 30; break;
      case 'Living Armor': s.dur += 50; s.str += 30; s.int -= 10; break;
      default: break;
    }
  }

  adjustStatsForArchetype(archetypeName) {
    const s = this.currentDraft.stats;
    switch (archetypeName) {
      case 'Berserker': s.str += 40; s.spd += 15; s.dur -= 15; break;
      case 'Paladin': s.dur += 45; s.str += 20; break;
      case 'Assassin': s.spd += 45; s.str += 15; s.dur -= 20; break;
      case 'Mage': s.int += 50; s.str -= 15; break;
      case 'Equaliser': s.int += 30; s.chaos += 30; break;
      case 'Chaos Incarnate': s.chaos += 70; break;
      case 'Joke / NPC': s.chaos += 50; s.dur += 20; break;
      // Expanded
      case 'Necromancer': s.int += 40; s.chaos += 25; s.str -= 10; break;
      case 'Gunslinger / Deadeye': s.spd += 45; s.int += 25; s.str += 15; break;
      case 'Time Warden': s.spd += 40; s.int += 40; s.dur += 15; break;
      case 'Dragon Knight': s.str += 40; s.dur += 30; s.spd += 15; break;
      case 'Shadow Monarch': s.str += 45; s.chaos += 35; s.spd += 25; break;
      case 'Brawler / Pugilist': s.str += 45; s.dur += 35; s.spd += 10; break;
      case 'Cosmic Inquisitor': s.int += 50; s.dur += 30; s.chaos += 20; break;
      case 'Bard / Battle Rocker': s.chaos += 45; s.spd += 25; s.int += 20; break;
      case 'Gambler': s.chaos += 65; s.spd += 25; s.int += 20; break;
      default: break;
    }
  }

  applyChaosInversion() {
    const s = this.currentDraft.stats;
    for (const key in s) {
      if (s[key] < 60) {
        s[key] = 110 - s[key] + Math.floor(Math.random() * 25);
      }
    }
  }

  finalizeStatsWithRank(rankSegment) {
    const mult = rankSegment.mult || 1.0;
    const s = this.currentDraft.stats;
    for (const key in s) {
      s[key] = Math.max(15, Math.floor(s[key] * mult + (Math.random() * 15 - 5)));
    }
  }

  // Generate dynamic epic title like in the Instagram series
  generateFullTitle(char = this.currentDraft) {
    const raceName = char.race ? char.race.text : 'Mortal';
    const subRaceText = char.subRace ? char.subRace.text : '';
    const archetypeName = char.archetype ? char.archetype.text : 'Warrior';
    const weaponName = char.weapon ? char.weapon.text : '';
    const powerName = char.powers.length ? char.powers[0].text : '';

    let epithet = '';
    if (char.backstory && char.backstory.text === 'Fourth Wall Breaker') {
      epithet = 'The Meta Entity';
    } else if (char.backstory && char.backstory.text === 'Reborn Anime Protagonist') {
      epithet = 'The Shonen Chosen One';
    } else if (subRaceText && subRaceText.includes('Chosen')) {
      epithet = 'The Chosen One';
    } else if (raceName === 'Shadow Monarch' || archetypeName === 'Shadow Monarch') {
      epithet = 'Monarch of Shadows';
    } else if (char.combatRank && char.combatRank.rank === 'EX') {
      epithet = 'God of the Arena';
    } else if (weaponName && weaponName.includes('Thor')) {
      epithet = 'Bane of the Heavens';
    } else if (weaponName && weaponName.includes('Excalibur')) {
      epithet = 'Bearer of the Holy Light';
    } else if (weaponName && weaponName.includes('Nokia')) {
      epithet = 'Wielder of Indestructible Steel';
    } else if (powerName) {
      epithet = `Wielder of ${powerName}`;
    } else {
      epithet = `The ${archetypeName}`;
    }

    return `${char.name}, ${epithet}`;
  }

  // Calculate Overall Power Level
  getOverallPower(char = this.currentDraft) {
    const s = char.stats;
    const base = (s.str + s.spd + s.dur + s.int + s.chaos) / 5;
    const powerBonus = (char.powers.length) * 15;
    const weaponBonus = char.weapon && (char.weapon.rarity === 'godTier' || char.weapon.rarity === 'mythic') ? 40 : 15;
    const levelBonus = (char.level - 1) * 20;
    const enchantBonus = (char.enchantments ? char.enchantments.length : 0) * 12;
    return Math.floor(base + powerBonus + weaponBonus + levelBonus + enchantBonus);
  }

  // Apply Mobile Game Level-Up Spin
  applyLevelUpReward(char, rewardSegment) {
    if (!rewardSegment || !rewardSegment.effect) return;
    const effect = rewardSegment.effect;

    char.level = (char.level || 1) + 1;
    if (!char.passives) char.passives = [];
    if (!char.enchantments) char.enchantments = [];

    switch (effect.type) {
      case 'stat':
        char.stats[effect.stat] = (char.stats[effect.stat] || 50) + effect.amount;
        break;
      case 'enchant':
        char.enchantments.push(effect.name);
        break;
      case 'multiplier':
        for (const k in char.stats) {
          char.stats[k] = Math.floor(char.stats[k] * effect.mult);
        }
        break;
      case 'purgeWeakness':
        char.weakness = { text: 'Purged by the Wheel', subtext: 'Curse Cleansed!', rarity: 'legendary' };
        break;
      case 'invertCurse':
        char.weakness = { text: 'Inverted Blessing', subtext: 'Curse converted into +40 All Stats!', rarity: 'godTier' };
        for (const k in char.stats) {
          char.stats[k] = (char.stats[k] || 50) + 40;
        }
        break;
      case 'chaosMutation':
        char.stats.chaos += 45;
        char.stats.str += 30;
        if (!char.name.includes('(Ascended)')) char.name += ' (Ascended)';
        break;
      case 'ascendDemigod':
        char.level += 2;
        for (const k in char.stats) {
          char.stats[k] = (char.stats[k] || 50) + 25;
        }
        if (!char.name.includes('(Demigod)')) char.name += ' (Demigod)';
        break;
      case 'indomitableWill':
        if (!char.passives.includes('Indomitable Will')) char.passives.push('Indomitable Will');
        break;
      case 'doubleStrike':
        if (!char.passives.includes('Double Strike Mastery')) char.passives.push('Double Strike Mastery');
        break;
      case 'secondPower':
      case 'thirdPower':
        // pick random power from wheelData not already owned
        if (typeof WHEEL_DATA !== 'undefined' && WHEEL_DATA.power) {
          const available = WHEEL_DATA.power.segments.filter(seg => !char.powers.some(p => p.text === seg.text));
          const list = available.length ? available : WHEEL_DATA.power.segments;
          const randPow = list[Math.floor(Math.random() * list.length)];
          char.powers.push(randPow);
        }
        break;
    }

    this.saveCharacter(char);
    return char;
  }

  // Local Storage Management
  getSavedCharacters() {
    try {
      const data = localStorage.getItem('wof_hall_of_fame');
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  saveCharacter(char = this.currentDraft) {
    const list = this.getSavedCharacters();
    const existingIdx = list.findIndex(c => c.id === char.id);
    if (existingIdx >= 0) {
      list[existingIdx] = char;
    } else {
      list.unshift(char);
    }
    try {
      localStorage.setItem('wof_hall_of_fame', JSON.stringify(list));
      return true;
    } catch (e) {
      return false;
    }
  }

  deleteCharacter(id) {
    let list = this.getSavedCharacters();
    list = list.filter(c => c.id !== id);
    localStorage.setItem('wof_hall_of_fame', JSON.stringify(list));
    return list;
  }

  renameCharacter(id, newName) {
    const trimmed = (newName || '').trim();
    if (!trimmed) return null;

    if (this.currentDraft && (this.currentDraft.id === id || id === 'draft')) {
      this.currentDraft.name = trimmed;
    }

    const list = this.getSavedCharacters();
    const found = list.find(c => c.id === id);
    if (found) {
      found.name = trimmed;
      localStorage.setItem('wof_hall_of_fame', JSON.stringify(list));
      return found;
    }

    return this.currentDraft;
  }

  // Pre-configured WoF universe legends for instant battle matching
  getLoreLegends() {
    return [
      {
        id: 'legend_bushin',
        name: 'Bushin',
        level: 10,
        race: { text: 'Chaos Incarnate', color: '#8b5cf6', rarity: 'godTier' },
        subRace: null,
        archetype: { text: 'Chaos Incarnate', rarity: 'godTier' },
        archetypeSub: null,
        weapon: { text: 'Nokia 3310 on a Chain', subtext: 'Indestructible God-Tier relic', rarity: 'chaos' },
        enchantments: ['Void Siphon', 'Spacetime Rend'],
        powers: [{ text: 'Reality Warping', subtext: 'Alters laws of combat', rarity: 'godTier' }],
        weakness: { text: 'Compulsive Taunting', subtext: 'Cannot stop monologuing', rarity: 'uncommon' },
        backstory: { text: 'Fourth Wall Breaker', subtext: 'Creator of the Wheel', rarity: 'godTier' },
        combatRank: { rank: 'EX', mult: 3.2 },
        stats: { str: 135, spd: 130, dur: 125, int: 160, chaos: 195 },
        isLegend: true
      },
      {
        id: 'legend_jin',
        name: 'Shadow Sovereign Jin',
        level: 10,
        race: { text: 'Shadow Monarch', color: '#312e81', rarity: 'mythic' },
        subRace: null,
        archetype: { text: 'Shadow Monarch', rarity: 'mythic' },
        archetypeSub: null,
        weapon: { text: 'Nodachi of the Black Void', subtext: 'Slices through spatial rifts', rarity: 'legendary' },
        enchantments: ['Void Siphon'],
        powers: [{ text: 'Domain Expansion', subtext: 'Guaranteed hits in shadow realm', rarity: 'godTier' }],
        weakness: { text: 'Needs 8 Hours of Sleep', subtext: 'Exhausted from dungeon raids', rarity: 'common' },
        backstory: { text: 'Reborn Anime Protagonist', subtext: 'Solo Hunter Sovereign', rarity: 'godTier' },
        combatRank: { rank: 'EX', mult: 3.2 },
        stats: { str: 165, spd: 155, dur: 140, int: 145, chaos: 150 },
        isLegend: true
      },
      {
        id: 'legend_etf',
        name: 'ETF',
        level: 10,
        race: { text: 'Angel', color: '#eab308', rarity: 'rare' },
        subRace: null,
        archetype: { text: 'Paladin', rarity: 'rare' },
        archetypeSub: null,
        weapon: { text: "Thor's Hammer", subtext: 'Divine Lightning Smite', rarity: 'godTier' },
        enchantments: ['Thunder Arc', 'Radiant Holy'],
        powers: [{ text: 'Time Stop', subtext: 'Freezes time for free strikes', rarity: 'godTier' }],
        weakness: { text: 'Glass Cannon', subtext: 'High attack, volatile defense', rarity: 'legendary' },
        backstory: { text: 'Royal Reincarnation', subtext: 'God of Gods', rarity: 'legendary' },
        combatRank: { rank: 'EX', mult: 3.2 },
        stats: { str: 160, spd: 110, dur: 130, int: 140, chaos: 110 },
        isLegend: true
      },
      {
        id: 'legend_freya',
        name: 'Astral Valkyrie Freya',
        level: 9,
        race: { text: 'Astral Seraph', color: '#38bdf8', rarity: 'mythic' },
        subRace: null,
        archetype: { text: 'Paladin', rarity: 'rare' },
        archetypeSub: null,
        weapon: { text: 'Excalibur', subtext: 'Holy Blade of Promised Victory', rarity: 'godTier' },
        enchantments: ['Radiant Holy'],
        powers: [{ text: 'Lightning God Speed', subtext: 'Hypersonic chain strikes', rarity: 'legendary' }],
        weakness: { text: 'Cannot Fight Without Music', subtext: 'Needs battle hymns', rarity: 'rare' },
        backstory: { text: 'Banished Archangel', subtext: 'Seeking arena glory', rarity: 'epic' },
        combatRank: { rank: 'SS', mult: 2.5 },
        stats: { str: 145, spd: 150, dur: 135, int: 150, chaos: 120 },
        isLegend: true
      },
      {
        id: 'legend_dominio',
        name: 'Dominio',
        level: 9,
        race: { text: 'Cosmic Warrior', color: '#7c3aed', rarity: 'mythic' },
        subRace: { text: 'Multiverse Void Master' },
        archetype: { text: 'Equaliser', rarity: 'legendary' },
        archetypeSub: null,
        weapon: { text: 'Thunderous Thunderbolt', subtext: "Dominio's Relic", rarity: 'godTier' },
        enchantments: ['Infernal Flame'],
        powers: [{ text: 'Probability Manipulation', subtext: 'Guaranteed critical strikes', rarity: 'mythic' }],
        weakness: { text: 'Allergic to Gold', subtext: 'Sneezes under pressure', rarity: 'uncommon' },
        backstory: { text: 'Forgotten God Slumber', subtext: 'God of Fortune', rarity: 'mythic' },
        combatRank: { rank: 'SS', mult: 2.5 },
        stats: { str: 140, spd: 145, dur: 115, int: 130, chaos: 160 },
        isLegend: true
      },
      {
        id: 'legend_joe',
        name: 'Joe the Dungeon Boss',
        level: 8,
        race: { text: 'Orc', color: '#15803d', rarity: 'common' },
        subRace: null,
        archetype: { text: 'Berserker', rarity: 'uncommon' },
        archetypeSub: null,
        weapon: { text: 'Spatula With Lemon Juice', subtext: 'Blinds opponent eyes!!', rarity: 'chaos' },
        enchantments: [],
        powers: [{ text: 'Super Regeneration', subtext: 'Heals severe damage', rarity: 'legendary' }],
        weakness: { text: 'Loud Sneezes', subtext: 'Breaks own focus', rarity: 'common' },
        backstory: { text: 'Gladiator Champion', subtext: '100 arena deathmatches', rarity: 'epic' },
        combatRank: { rank: 'S', mult: 2.0 },
        stats: { str: 155, spd: 85, dur: 160, int: 70, chaos: 125 },
        isLegend: true
      },
      {
        id: 'legend_max',
        name: 'Max the Calamity',
        level: 8,
        race: { text: 'Elemental', color: '#ea580c', rarity: 'epic' },
        subRace: { text: 'Magma Eruption' },
        archetype: { text: 'Mage', rarity: 'uncommon' },
        archetypeSub: null,
        weapon: { text: 'Skyrender Axe', subtext: 'Cleaves storm barriers', rarity: 'epic' },
        enchantments: ['Infernal Flame'],
        powers: [{ text: 'Pyrokinesis', subtext: 'Hellfire incinerator', rarity: 'rare' }],
        weakness: { text: 'Melts in Rain', subtext: 'Water vulnerability', rarity: 'rare' },
        backstory: { text: 'Cursed Village Survivor', subtext: 'Living core', rarity: 'uncommon' },
        combatRank: { rank: 'S', mult: 2.0 },
        stats: { str: 110, spd: 115, dur: 125, int: 145, chaos: 140 },
        isLegend: true
      },
      {
        id: 'legend_baki',
        name: 'King Baki',
        level: 7,
        race: { text: 'Skeleton', color: '#52525b', rarity: 'common' },
        subRace: { text: 'Ancient Dragon Skeleton' },
        archetype: { text: 'Archaeologist', rarity: 'epic' },
        archetypeSub: { text: "Titan's Knuckle" },
        weapon: { text: 'Ancient Sharp Bone Relic', subtext: 'Fossilized edge', rarity: 'common' },
        enchantments: [],
        powers: [{ text: 'Necromancy', subtext: 'Undead resurrection', rarity: 'epic' }],
        weakness: { text: 'Fragile Bones', subtext: '2.5x blunt impact vulnerability', rarity: 'common' },
        backstory: { text: 'Royal Reincarnation', subtext: 'Lord of Skeletons', rarity: 'legendary' },
        combatRank: { rank: 'A', mult: 1.6 },
        stats: { str: 115, spd: 130, dur: 75, int: 120, chaos: 150 },
        isLegend: true
      },
      {
        id: 'legend_darwizzy',
        name: 'Darwizzy',
        level: 6,
        race: { text: 'Goblin', color: '#65a30d', rarity: 'common' },
        subRace: null,
        archetype: { text: 'Joke / NPC', rarity: 'chaos' },
        archetypeSub: null,
        weapon: { text: 'Enchanted Brick', subtext: 'Never misses', rarity: 'chaos' },
        enchantments: [],
        powers: [{ text: 'Gravity Inversion', subtext: 'Flips gravity', rarity: 'legendary' }],
        weakness: { text: 'Bad Luck Aura', subtext: 'Trips over flat ground', rarity: 'chaos' },
        backstory: { text: "Isekai'd Salaryman", subtext: 'Accidentally in the arena', rarity: 'chaos' },
        combatRank: { rank: 'B', mult: 1.3 },
        stats: { str: 90, spd: 110, dur: 120, int: 85, chaos: 185 },
        isLegend: true
      },
      {
        id: 'legend_baguette',
        name: 'Sir Baguette',
        level: 7,
        race: { text: 'Living Armor', color: '#57534e', rarity: 'rare' },
        subRace: null,
        archetype: { text: 'Brawler / Pugilist', rarity: 'uncommon' },
        archetypeSub: null,
        weapon: { text: 'Cursed French Baguette', subtext: 'Harder than tungsten carbide', rarity: 'chaos' },
        enchantments: ['Frostbite Freeze'],
        powers: [{ text: 'Full Counter', subtext: 'Deflects magic', rarity: 'legendary' }],
        weakness: { text: 'Always Announces Attack', subtext: 'Shouts move names', rarity: 'chaos' },
        backstory: { text: 'Sentient Meme Come to Life', subtext: 'Pure chaotic comedy', rarity: 'chaos' },
        combatRank: { rank: 'A', mult: 1.6 },
        stats: { str: 130, spd: 95, dur: 150, int: 90, chaos: 160 },
        isLegend: true
      }
    ];
  }
}

const characterManager = new CharacterManager();
