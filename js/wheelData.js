/**
 * WHEEL OF FAITH - WHEEL DATA REPOSITORY
 * Comprehensive datasets for Bushin's "The Wheel of Faith" (WoF / WOF Arena)
 * Massively expanded with 32+ Races, 36+ Weapons, 24+ Level-Up Upgrades,
 * 22+ Archetypes, 28+ Powers, 22+ Weaknesses, and 20+ Backstories / Chaos Factors.
 */

const RARITY_COLORS = {
  common: { bg: '#3a3d46', text: '#e0e0e0', glow: '#64748b', name: 'Common' },
  uncommon: { bg: '#1b4d3e', text: '#a7f3d0', glow: '#10b981', name: 'Uncommon' },
  rare: { bg: '#1e3a8a', text: '#93c5fd', glow: '#3b82f6', name: 'Rare' },
  epic: { bg: '#581c87', text: '#f0abfc', glow: '#a855f7', name: 'Epic' },
  legendary: { bg: '#b45309', text: '#fde047', glow: '#f59e0b', name: 'Legendary' },
  mythic: { bg: '#831843', text: '#fbcfe8', glow: '#ec4899', name: 'Mythic' },
  godTier: { bg: '#083344', text: '#a5f3fc', glow: '#06b6d4', name: 'God-Tier' },
  chaos: { bg: '#7f1d1d', text: '#fca5a5', glow: '#ef4444', name: 'Chaos Factor' }
};

const WHEEL_DATA = {
  // ============================================================
  // 1. RACE WHEEL (32 Distinct Lineages)
  // ============================================================
  race: {
    'Dragon Slayer': 'Wyrm Hunter Heritage: Trained specifically in ancient anti-dragon martial forms. Naturally resistant to elemental breath and gains +35% armor penetration against scale and heavy beast armor.',
    'Devil (7 Sins)': 'Infernal Deadly Sin Avatar: Channeler of one of the 7 capital sins. Gains devastating passive stat bonuses and dark hellfire enhancements that overwhelm pure mortal warriors.',
    'God / Primordial': 'Cosmic Deity Transcendent: Embodiment of a universal concept or divine pantheon. Possesses near-infinite combat potential (+45 All Stats) and reality-bending domain authority.',
    'Animorph': 'Adaptive Beast Shifter: Capable of mutating biological forms mid-combat to counter opponent weapon ranges and elemental properties.',
    'Giant': 'Colossal Titan Physiology: Massive stone/terrestrial mass (+50 Durability, +40 Strength, -20 Speed). Unstoppable heavy swings that shatter enemy footing.',
    'Golem': 'Construct Frame: Inanimate body of animated clay, stone, iron, diamond, or obsidian. Immune to bleeding, poison, and mental panic.',
    'Hive Mind': 'Swarm Consciousness: Billions of interconnected organisms. Physical attacks only destroy a fraction of the swarm, giving 35% passive damage mitigation.',
    'Mythical Beast': 'Apex Mythological Creature: The ferocity of legendary monsters (Nemean Lion, Phoenix, Cerberus, Leviathan). High raw stats and innate mythological auras.',
    'Dryad': 'Primeval Nature Spirit: Birthed from sacred groves and celestial alignments. Passive health regeneration and root entanglements when fighting on earth.',
    'Merfolk': 'Aquatic Sovereign: Fluid agility and hydrokinetic mastery (+30 SPD, +25 INT). Can summon ocean torrents to disorient and drown enemy fire.',
    'Reincarnation / Spirit': 'Past Champion Rebirth: Hosts the awakened combat instincts of past tournament GOATs (Achilles, Joe, Sammy, Darwizzy). Starts duels with max tactical IQ.',
    id: 'race',
    name: 'Race Wheel',
    subtitle: 'Determine your mortal, infernal, or celestial origin',
    icon: '👤',
    segments: [
      { text: 'Human', subtext: 'Middest Race with Infinite Growth', rarity: 'common', color: '#4b5563', subWheel: 'humanOrigin' },
      { text: 'Elf', subtext: 'Graceful & Rizz-Blessed', rarity: 'uncommon', color: '#047857', subWheel: 'elfOrigin' },
      { text: 'Dwarf', subtext: 'Anti-Magic Blacksmith Master', rarity: 'uncommon', color: '#92400e', subWheel: 'dwarfForge' },
      { text: 'Demon', subtext: 'Fiery Infernal Conqueror', rarity: 'rare', color: '#991b1b', subWheel: 'demonPowers' },
      { text: 'Angel', subtext: 'Celestial Radiance & Wings', rarity: 'rare', color: '#eab308', subWheel: 'angelicOrder' },
      { text: 'Werewolf', subtext: 'Feral Instincts & Full Moon Rage', rarity: 'uncommon', color: '#6b7280', subWheel: null },
      { text: 'Orc', subtext: 'Brutal Bone Density & Warlord Blood', rarity: 'common', color: '#15803d', subWheel: 'orcRole' },
      { text: 'Android', subtext: 'Cybernetic Precision & Overcharge Core', rarity: 'rare', color: '#0284c7', subWheel: 'cyborgTechno' },
      { text: 'Vampire', subtext: 'Blood Magic & Night Sovereign', rarity: 'rare', color: '#881337', subWheel: 'vampireFeeding' },
      { text: 'Elemental', subtext: 'Living Natural Calamity', rarity: 'epic', color: '#ea580c', subWheel: 'elementalCalamity' },
      { text: 'Skeleton', subtext: 'Chaotic Bone Rattler', rarity: 'common', color: '#52525b', subWheel: 'skeletonOrigin' },
      { text: 'Fairy', subtext: 'Tiny Hitbox, Multi-Power Menace', rarity: 'epic', color: '#db2777', subWheel: 'fairyBlessing' },
      { text: 'Goblin', subtext: 'Scrappy Trickster & Gremlin Alchemy', rarity: 'common', color: '#65a30d', subWheel: 'goblinPosition' },
      { text: 'Siren', subtext: 'Hypnotic Voice of the Deep Abyss', rarity: 'uncommon', color: '#0891b2', subWheel: null },
      { text: 'Dragonkin', subtext: 'Draconic Breath & Ancient Pride', rarity: 'legendary', color: '#c2410c', subWheel: null },
      { text: 'Cosmic Warrior', subtext: 'Galactic Conqueror of Starfields', rarity: 'mythic', color: '#7c3aed', subWheel: 'cosmicTerritory' },
      { text: 'Nucleite', subtext: 'Living Radioisotope Calamity', rarity: 'godTier', color: '#10b981', subWheel: null },
      // --- NEW EXPANDED RACES ---
      { text: 'Shadow Monarch', subtext: 'Commander of the Umbral Legions', rarity: 'mythic', color: '#312e81', subWheel: null },
      { text: 'Phoenixkin', subtext: 'Reborn in Immortal Solar Flame', rarity: 'legendary', color: '#ea580c', subWheel: null },
      { text: 'Nephilim', subtext: 'Half-Celestial Half-Infernal Dual Wings', rarity: 'epic', color: '#7e22ce', subWheel: null },
      { text: 'Cyborg Titan', subtext: 'Heavy Dieselpunk Hydraulic Colossus', rarity: 'rare', color: '#475569', subWheel: null },
      { text: 'Voidwalker', subtext: 'Trans-Dimensional Spatial Rift Strider', rarity: 'epic', color: '#1e1b4b', subWheel: null },
      { text: 'Slime Sovereign', subtext: 'Elastic Gelatin Absorbing Kinetic Impacts', rarity: 'uncommon', color: '#059669', subWheel: null },
      { text: 'Eldritch Entity', subtext: 'Tentacled Void Horror of Cosmic Madness', rarity: 'godTier', color: '#4c0519', subWheel: null },
      { text: 'Djinn (Genie)', subtext: 'Wish-Weaving Spirit of Primordial Ether', rarity: 'epic', color: '#0891b2', subWheel: null },
      { text: 'Beastfolk Chimera', subtext: 'Apex Multi-Predator Sensory Instincts', rarity: 'uncommon', color: '#854d0e', subWheel: null },
      { text: 'Gargoyle', subtext: 'Living Obsidian Stone Hide & Impenetrable Wings', rarity: 'rare', color: '#334155', subWheel: null },
      { text: 'Insectoid Hivemaster', subtext: 'Hyper-Reflex Chitin Carapace & Swarm', rarity: 'rare', color: '#4d7c0f', subWheel: null },
      { text: 'Demi-God', subtext: 'Olympian Lineage Blessed with Golden Ichor', rarity: 'legendary', color: '#ca8a04', subWheel: 'demiGodLineage' },
      { text: 'Homunculus', subtext: 'Alchemical Prodigy Spliced in Secret Vats', rarity: 'uncommon', color: '#0d9488', subWheel: null },
      { text: 'Astral Seraph', subtext: 'Six-Winged Entity of Pure Sacred Light', rarity: 'mythic', color: '#38bdf8', subWheel: null },
      { text: 'Living Armor', subtext: 'Hollow Steel Plate Possessed by Ancient Wrath', rarity: 'rare', color: '#57534e', subWheel: null },
      { text: 'Dragon Slayer', subtext: 'Martial Hunter of Draconic Beasts', rarity: 'rare', color: '#c2410c', subWheel: 'dragonSlayerRank' },
      { text: 'Devil (7 Sins)', subtext: 'Infernal Avatar of Capital Sins', rarity: 'epic', color: '#991b1b', subWheel: 'devilsSins' },
      { text: 'God / Primordial', subtext: 'Cosmic Abstract Embodiment of Universal Constants', rarity: 'godTier', color: '#06b6d4', subWheel: 'godType' },
      { text: 'Animorph', subtext: 'Adaptive Beast-Shifter of Shifting Forms', rarity: 'uncommon', color: '#854d0e', subWheel: 'animorphMorph' },
      { text: 'Giant', subtext: 'Colossal Terrestrial Titan', rarity: 'rare', color: '#334155', subWheel: 'giantDomain' },
      { text: 'Golem', subtext: 'Inanimate Construct Infused with Arcane Core', rarity: 'uncommon', color: '#57534e', subWheel: 'golemMaterial' },
      { text: 'Hive Mind', subtext: 'Unified Swarm Consciousness', rarity: 'epic', color: '#4d7c0f', subWheel: 'hiveMindForm' },
      { text: 'Mythical Beast', subtext: 'Legendary Apex Chimera of Myth', rarity: 'legendary', color: '#b45309', subWheel: 'mythicalBeastType' },
      { text: 'Dryad', subtext: 'Nature-Bound Spirit of Primeval Forests', rarity: 'uncommon', color: '#16a34a', subWheel: 'dryadOrigin' },
      { text: 'Merfolk', subtext: 'Aquatic Sovereign of the Ocean Depths', rarity: 'uncommon', color: '#0891b2', subWheel: 'merfolkLineage' },
      { text: 'Reincarnation / Spirit', subtext: 'Past Season Arena Legend Reborn', rarity: 'legendary', color: '#7c3aed', subWheel: 'reincarnationSoul' },
    ]
  },

  // SUB-WHEELS
  elfOrigin: {
    id: 'elfOrigin',
    name: 'Elf Heritage Sub-Wheel',
    subtitle: 'Which ancient lineage do you descend from?',
    icon: '🧝',
    segments: [
      { text: 'High Elf', subtext: '+35 Arcane Intelligence', rarity: 'rare', color: '#3b82f6' },
      { text: 'Dark Elf', subtext: '+40 Shadow Mastery & Night Vision', rarity: 'epic', color: '#6d28d9' },
      { text: 'Wood Elf', subtext: '+30 Agile Speed & Nature Strider', rarity: 'uncommon', color: '#16a34a' },
      { text: 'Elemental Elf', subtext: '+45 Prismatic Spell Fusion', rarity: 'legendary', color: '#f59e0b' },
      { text: 'The Chosen One', subtext: 'MAX RIZZ & All Stats +25%', rarity: 'godTier', color: '#06b6d4' }
    ]
  },

  elementalCalamity: {
    id: 'elementalCalamity',
    name: 'Elemental Calamity Sub-Wheel',
    subtitle: 'What cataclysmic event birthed your physical form?',
    icon: '🌋',
    segments: [
      { text: 'Tsunami Born', subtext: 'Tidal Wave Annihilation', rarity: 'rare', color: '#0284c7' },
      { text: 'Magma Eruption', subtext: 'Superheated Molten Lava', rarity: 'epic', color: '#dc2626' },
      { text: 'Supercell Hurricane', subtext: 'Tornado Gale Winds', rarity: 'rare', color: '#059669' },
      { text: 'Solar Flare Cataclysm', subtext: 'Surface Of The Star Power', rarity: 'legendary', color: '#eab308' },
      { text: 'Universe-Ending Rupture', subtext: 'Spacetime Collapse Hazard', rarity: 'godTier', color: '#8b5cf6' }
    ]
  },

  cosmicTerritory: {
    id: 'cosmicTerritory',
    name: 'Cosmic Territory Sub-Wheel',
    subtitle: 'What sector of the multiverse has fallen under your rule?',
    icon: '🌌',
    segments: [
      { text: 'Asteroid Outpost', subtext: 'Minor Colony Warlord', rarity: 'uncommon', color: '#4b5563' },
      { text: 'Planetary System', subtext: 'Conquered 8 Solar Worlds', rarity: 'rare', color: '#2563eb' },
      { text: 'Star Cluster Sovereign', subtext: 'Dominion over 500 Stars', rarity: 'epic', color: '#7c3aed' },
      { text: 'Galactic Core Emperor', subtext: 'Supermassive Black Hole Throne', rarity: 'legendary', color: '#f59e0b' },
      { text: 'Multiverse Void Master', subtext: 'Transcends Spatial Boundaries', rarity: 'godTier', color: '#06b6d4' }
    ]
  },

  skeletonOrigin: {
    id: 'skeletonOrigin',
    name: 'Skeleton Bone Type Sub-Wheel',
    subtitle: 'Whose skeleton were you before you rose again?',
    icon: '💀',
    segments: [
      { text: 'Peasant Skeleton', subtext: 'Extremely Fragile, Very Goofy', rarity: 'common', color: '#6b7280' },
      { text: 'Knight Skeleton', subtext: 'Wears Ancient Rusted Plate Armor', rarity: 'uncommon', color: '#374151' },
      { text: 'Orc Warlord Skeleton', subtext: 'Heavy Bone Spikes & Brutality', rarity: 'rare', color: '#15803d' },
      { text: 'Ancient Dragon Skeleton', subtext: 'Massive Ribcage & Wings', rarity: 'legendary', color: '#b45309' },
      { text: 'Divine Lich Skeleton', subtext: 'Floating Crown & Ethereal Flames', rarity: 'godTier', color: '#0284c7' }
    ]
  },

  fairyBlessing: {
    id: 'fairyBlessing',
    name: 'Fairy Power Multiplier',
    subtitle: 'How many extra gifts do the Fey gods bestow upon you?',
    icon: '🧚',
    segments: [
      { text: 'Single Spark', subtext: '1 Standard Power Roll', rarity: 'common', color: '#4b5563' },
      { text: 'Dual Fey Blessing', subtext: 'Gain 2 Independent Powers!', rarity: 'epic', color: '#9333ea' },
      { text: 'Trinity Overload', subtext: 'Gain 3 Simultaneous Powers!', rarity: 'godTier', color: '#db2777' }
    ]
  },

  dwarfForge: {
    id: 'dwarfForge',
    name: 'Dwarven Forge Masterwork',
    subtitle: 'What secret blacksmithing recipe did you inherit?',
    icon: '🔨',
    segments: [
      { text: 'Ironclad Anvil', subtext: 'Bonus Armor Plating', rarity: 'common', color: '#6b7280' },
      { text: 'Rune Inscribed Hammer', subtext: 'Shockwaves on weapon impact', rarity: 'rare', color: '#2563eb' },
      { text: 'Heart of the Mountain Alloy', subtext: 'Invulnerable to magical curses', rarity: 'legendary', color: '#d97706' },
      { text: 'Star-Forge Matrix', subtext: 'Forges weapons from neutron stars', rarity: 'godTier', color: '#7c3aed' }
    ]
  },

  // ============================================================
  // 2. ARCHETYPE WHEEL (22 Tactical Combat Roles)
  // ============================================================
  archetype: {
    'Cursed / Cultist': 'Forbidden Arcana Channeler: Sacrifices mortal safety to brand dark demonic techniques into the arena, unleashing hellfire, necrosis, and soul drain.',
    'Goliath': 'Defensive Exosuit Juggernaut: Equips massive specialized armor plates (Darwinite, Dragon Scale, Void Fortress) that absorb colossal punishment.',
    'Cloaked (Ninja)': 'Shadow Infiltration Specialist: Masters silent movement, smoke decoys, and critical ambush strikes that bypass 50% of enemy armor.',
    'Priest': 'High Cleric of Deific Domains: Channels blessings of War, Wisdom, Sun, or Thunder to cleanse debuffs and smite opponents with holy fury.',
    'Pirate': 'High-Seas Marauder: Ruthless naval combatant that loots fallen weapons and gains +2 Weapon Mastery with heavy broadside attacks.',
    'Gladiator': 'Blood-and-Sand Veteran: Masters bare-knuckle combat, beast mutations, or relic weaponry with ferocious low-HP attack multipliers.',
    'Spirit Weaver': 'Spectral Artisan: Weaves ancestral phantom blades and spirit armor into physical combat, gaining extra power slots and protection.',
    'Mutant': 'Biophysical Anomaly: Mutates cellular anomalies (Quantum manipulation, Kinetic absorption, Runic flesh) that grant supernatural adaptations.',
    'Resilient': 'Bad-Luck Protection: If any core attribute rolls below Peak Human (4/10), the warrior automatically re-spins that attribute until it reaches greatness!',
    'Royal': 'Sovereign Authority: Noble monarchs commanding imperial poise, battlefield leadership, and devastating royal decree stat buffs.',
    'Apostle': 'Reality-Bending Philosopher: Adheres to absolute philosophical creeds (Existentialism, Determinism, Daoism) that alter the rules of combat.',
    'Primordial Champion': 'Hand of the Universal Constants: Anointed champion of Time, Eternity, Reality, or Void; commands divine reality-warping strikes.',
    "Champion's Legacy": "Heir to the GOATs: Fights under the banner of legendary tournament winners (Ethan's Weapon Mimic, Musam's Steaming Honeybun, Boodro's Fortitude).",
    'Hybrid': 'Dual Archetype Master: Rare prodigy possessing two distinct tactical archetypes simultaneously, fusing their perks and playstyles.',
    id: 'archetype',
    name: 'Archetype Wheel',
    subtitle: 'Your tactical role, playstyle, and combat modifier',
    icon: '⚔️',
    segments: [
      { text: 'Slayer', subtext: 'Deals 200% damage to designated prey', rarity: 'rare', color: '#dc2626', subWheel: 'slayerPrey' },
      { text: 'Archaeologist', subtext: 'Wields ancient forgotten relics', rarity: 'epic', color: '#d97706', subWheel: 'archaeologistRelic' },
      { text: 'Equaliser', subtext: 'Forces divine foes down to equal stats', rarity: 'legendary', color: '#2563eb', subWheel: null },
      { text: 'Paladin', subtext: 'Unshakable holy aura & defensive barrier', rarity: 'rare', color: '#eab308', subWheel: 'paladinPowers' },
      { text: 'Berserker', subtext: 'Strength multiplies as HP drops', rarity: 'uncommon', color: '#991b1b', subWheel: null },
      { text: 'Mage', subtext: 'High burst arcane incantations', rarity: 'uncommon', color: '#7c3aed', subWheel: 'mageRank' },
      { text: 'Assassin', subtext: 'One-shot potential from unseen shadows', rarity: 'rare', color: '#475569', subWheel: null },
      { text: 'Support / Healer', subtext: 'Regenerates lethal blows & cleanses', rarity: 'common', color: '#16a34a', subWheel: null },
      { text: 'Tamer', subtext: 'Commands a monstrous companion beast', rarity: 'epic', color: '#0d9488', subWheel: 'tamerBeast' },
      { text: 'Alchemist', subtext: 'Concocts mutating battle brews', rarity: 'uncommon', color: '#65a30d', subWheel: 'alchemistPotion' },
      { text: 'Martial Artist', subtext: 'Counters any weapon with bare knuckles', rarity: 'uncommon', color: '#b45309', subWheel: 'martialArtStyle' },
      { text: 'Trickster', subtext: 'Illusion decoys, traps, and mind games', rarity: 'rare', color: '#ec4899', subWheel: 'tricksterTricks' },
      { text: 'Joke / NPC', subtext: 'Suspiciously lucky, surviving impossible odds', rarity: 'chaos', color: '#ef4444', subWheel: null },
      { text: 'Chaos Incarnate', subtext: 'Rewrites the laws of combat randomly', rarity: 'godTier', color: '#8b5cf6', subWheel: null },
      // --- NEW ARCHETYPES ---
      { text: 'Necromancer', subtext: 'Reanimates bone legions & life-drains foes', rarity: 'epic', color: '#065f46', subWheel: null },
      { text: 'Gunslinger / Deadeye', subtext: 'Supersonic quickdraw & fatal criticals', rarity: 'rare', color: '#b45309', subWheel: null },
      { text: 'Time Warden', subtext: 'Distorts turn initiative & grants temporal shields', rarity: 'legendary', color: '#0891b2', subWheel: null },
      { text: 'Dragon Knight', subtext: 'Infuses blade strikes with draconic hellfire', rarity: 'epic', color: '#c2410c', subWheel: null },
      { text: 'Shadow Monarch', subtext: 'Extracts fallen combatants as loyal thralls', rarity: 'mythic', color: '#312e81', subWheel: null },
      { text: 'Brawler / Pugilist', subtext: 'Heavy kinetic impact counters & unbreakable grit', rarity: 'uncommon', color: '#78350f', subWheel: null },
      { text: 'Cosmic Inquisitor', subtext: 'Bans supernatural cheating & purges buffs', rarity: 'godTier', color: '#4338ca', subWheel: null },
      { text: 'Bard / Battle Rocker', subtext: 'Hypnotic riffs that disorient and stun opponents', rarity: 'rare', color: '#db2777', subWheel: null },
      { text: 'Cursed / Cultist', subtext: 'Channeler of Forbidden Demonic Powers', rarity: 'epic', color: '#7f1d1d', subWheel: 'cursedPowers' },
      { text: 'Goliath', subtext: 'Defensive Juggernaut in Heavy Exosuit', rarity: 'rare', color: '#475569', subWheel: 'goliathArmor' },
      { text: 'Cloaked (Ninja)', subtext: 'Stealth and Assassination Specialist', rarity: 'rare', color: '#334155', subWheel: 'ninjaRank' },
      { text: 'Priest', subtext: 'Clergy Dedicated to a Deific Domain', rarity: 'uncommon', color: '#fbbf24', subWheel: 'priestDomain' },
      { text: 'Pirate', subtext: 'High-Seas Marauder & Weapon Looter', rarity: 'uncommon', color: '#0284c7', subWheel: 'pirateRank' },
      { text: 'Gladiator', subtext: 'Brutal Colosseum Tournament Veteran', rarity: 'uncommon', color: '#dc2626', subWheel: 'gladiatorVariant' },
      { text: 'Spirit Weaver', subtext: 'Infuses Ancestral Spirits into Combat', rarity: 'epic', color: '#8b5cf6', subWheel: 'spiritWeaverType' },
      { text: 'Mutant', subtext: 'Undergoes Biophysical Mutations & Anomalies', rarity: 'rare', color: '#10b981', subWheel: 'mutantTrait' },
      { text: 'Resilient', subtext: 'Bad-Luck Protection: Re-spins Any Stat Below Peak Human (4/10)', rarity: 'rare', color: '#059669', subWheel: null },
      { text: 'Royal', subtext: 'Monarch Lineage Commanding Royal Decrees', rarity: 'legendary', color: '#eab308', subWheel: 'royaltyTitle' },
      { text: 'Apostle', subtext: 'Philosophical Adherent with Reality-Bending Tenets', rarity: 'legendary', color: '#6366f1', subWheel: 'apostleBelief' },
      { text: 'Primordial Champion', subtext: 'Mortal Chosen by Universal Constants', rarity: 'godTier', color: '#06b6d4', subWheel: 'primordialPatron' },
      { text: "Champion's Legacy", subtext: 'Aligns with Factions of Tournament GOATs (Ethan, Musam, Boodro)', rarity: 'mythic', color: '#d97706', subWheel: 'championsLegacyFaction' },
      { text: 'Hybrid', subtext: 'Possesses Two Distinct Archetypes Simultaneously', rarity: 'godTier', color: '#ec4899', subWheel: null },
    ]
  },

  slayerPrey: {
    id: 'slayerPrey',
    name: 'Slayer Prey Target Sub-Wheel',
    subtitle: 'Which specific enemy category triggers your 200% executioner buff?',
    icon: '🎯',
    segments: [
      { text: 'Demon Slayer', subtext: 'Infernal bane executioner', rarity: 'rare', color: '#dc2626' },
      { text: 'God Slayer', subtext: 'Divine beings tremble before you', rarity: 'godTier', color: '#06b6d4' },
      { text: 'Undead Slayer', subtext: 'Skeletons & Vampires turn to dust', rarity: 'uncommon', color: '#16a34a' },
      { text: 'Dragon Slayer', subtext: 'Scales offer zero resistance', rarity: 'legendary', color: '#ea580c' },
      { text: 'Mortal Slayer', subtext: 'Devastates common races & humans', rarity: 'common', color: '#6b7280' },
      { text: 'Cosmic Slayer', subtext: 'Pierces through galactic warriors', rarity: 'mythic', color: '#8b5cf6' }
    ]
  },

  archaeologistRelic: {
    id: 'archaeologistRelic',
    name: 'Archaeologist Relic Sub-Wheel',
    subtitle: 'What ancient artifact did you dig up from the ruins?',
    icon: '🏺',
    segments: [
      { text: "Titan's Knuckle", subtext: 'Shatters mountains with shockwaves', rarity: 'epic', color: '#b45309' },
      { text: "Pharaoh's Cursed Eye", subtext: 'Foresight of the opponent next 3 attacks', rarity: 'legendary', color: '#d97706' },
      { text: 'Primordial Rune Tablet', subtext: 'Negates all magical projectile damage', rarity: 'mythic', color: '#7c3aed' },
      { text: 'Ancient Sharp Bone Relic', subtext: 'Surprisingly sharp fossilized bone', rarity: 'common', color: '#6b7280' },
      { text: "Architect's Compass", subtext: 'Can alter the wheel outcome once', rarity: 'godTier', color: '#06b6d4' }
    ]
  },

  tamerBeast: {
    id: 'tamerBeast',
    name: 'Tamer Companion Beast Sub-Wheel',
    subtitle: 'What creature fights by your side in the arena?',
    icon: '🐾',
    segments: [
      { text: 'Bald Cat', subtext: 'Meme / Discount Dirk: Scratches ankles and distracts', rarity: 'common', color: '#6b7280' },
      { text: 'Alpha Ape', subtext: 'Brutal kinetic ground slams (+20 STR)', rarity: 'uncommon', color: '#854d0e' },
      { text: 'Pyro Penguin', subtext: 'Sliding incendiary torpedo spitting flames', rarity: 'rare', color: '#dc2626' },
      { text: 'Thunder Hawk', subtext: 'Supersonic diving divebomb with electric talons', rarity: 'rare', color: '#eab308' },
      { text: 'Spectral Wolf', subtext: 'Phases through armor to bite unprotected vitals', rarity: 'rare', color: '#3b82f6' },
      { text: 'Tidal Tiger', subtext: 'Riptide pounce sweeping enemies off balance', rarity: 'epic', color: '#0284c7' },
      { text: 'Gale Griffin', subtext: 'Razor cyclone wingbeats knocking back foes', rarity: 'epic', color: '#06b6d4' },
      { text: 'Rune Bear', subtext: 'Inscribed armor plate impervious to physical slashes', rarity: 'epic', color: '#7c3aed' },
      { text: 'Void Panther', subtext: 'Shadow stalker striking from dimensional rifts', rarity: 'legendary', color: '#312e81' },
      { text: 'Infernal Hellhound', subtext: 'Three-headed hellfire jaws incinerating shields', rarity: 'godTier', color: '#991b1b' }
    ]
  },

  alchemistPotion: {
    id: 'alchemistPotion',
    name: 'Alchemist Signature Elixir',
    subtitle: 'What concoction do you chug before entering the fray?',
    icon: '🧪',
    segments: [
      { text: 'Berserk Adrenaline Serum', subtext: 'Triple attack speed for 30s', rarity: 'rare', color: '#dc2626' },
      { text: 'Liquid Diamond Skin', subtext: 'Impervious to bladed slashes', rarity: 'epic', color: '#0284c7' },
      { text: 'Acidic Blood Reagent', subtext: 'Attackers take corroding splash damage', rarity: 'uncommon', color: '#16a34a' },
      { text: "Philosopher's Drop", subtext: 'Instant auto-resurrection on death', rarity: 'godTier', color: '#f59e0b' }
    ]
  },


  // ============================================================
  // EXPANDED CANON SUB-WHEELS (From WoF Compendium)
  // ============================================================
  humanOrigin: {
    id: 'humanOrigin',
    name: 'Human Origin Sub-Wheel',
    subtitle: 'What mortal bloodline forged your destiny?',
    icon: '👤',
    segments: [
      { text: 'NPC Baseline', subtext: 'Standard ordinary human, infinite growth potential', rarity: 'common', color: '#6b7280' },
      { text: 'Old Bloodline', subtext: 'Ancient resilient lineage (+25 Durability, +15 STR)', rarity: 'uncommon', color: '#0284c7' },
      { text: 'The Chosen One', subtext: 'Rarest human tier; gains top-tier potential and max luck', rarity: 'godTier', color: '#06b6d4' }
    ]
  },

  demiGodLineage: {
    id: 'demiGodLineage',
    name: 'Demi-God Origin Sub-Wheel',
    subtitle: 'From which divine heritage do you descend?',
    icon: '⚡',
    segments: [
      { text: "Champion's Blood", subtext: 'Descendant of tournament GOATs', rarity: 'rare', color: '#ca8a04', subWheel: 'championsBloodGoat' },
      { text: 'Divine Child', subtext: 'Direct offspring of an Olympian god', rarity: 'epic', color: '#eab308' },
      { text: 'Chosen One', subtext: 'Anointed champion of the heavens', rarity: 'godTier', color: '#06b6d4' }
    ]
  },

  championsBloodGoat: {
    id: 'championsBloodGoat',
    name: "Champion's Blood GOAT Ancestor",
    subtitle: 'Which legendary tournament winner’s blood flows through you?',
    icon: '🏆',
    segments: [
      { text: 'Boodro Bloodline', subtext: 'Legendary colosseum titan fortitude', rarity: 'legendary', color: '#b45309' },
      { text: 'Ethan Bloodcult (S4 Winner)', subtext: 'Season 4 Champion: Weapon Mimic & Bloodcult aura', rarity: 'godTier', color: '#991b1b' },
      { text: 'Max the Calamity', subtext: 'Elemental devastation instincts', rarity: 'epic', color: '#ea580c' },
      { text: 'Madox', subtext: 'Relentless tactical pressure', rarity: 'epic', color: '#0284c7' },
      { text: 'Sammy', subtext: 'Swift blade finesse', rarity: 'rare', color: '#16a34a' },
      { text: 'Michael', subtext: 'Unyielding defense', rarity: 'rare', color: '#6366f1' },
      { text: 'Joe the Dragon Slayer', subtext: 'Draconic slayer reflexes', rarity: 'legendary', color: '#15803d' },
      { text: 'Griffin', subtext: 'Aerial dominance and precision', rarity: 'rare', color: '#eab308' },
      { text: 'Siothz', subtext: 'Dark arcana manipulation', rarity: 'rare', color: '#8b5cf6' },
      { text: 'Redpans', subtext: 'Explosive burst damage', rarity: 'rare', color: '#ef4444' },
      { text: 'Jekixoxo', subtext: 'Trickster evasion stance', rarity: 'rare', color: '#ec4899' },
      { text: 'Itsmitchyyeah', subtext: 'High-speed combat pacing', rarity: 'rare', color: '#06b6d4' },
      { text: 'Foxthepizzagod', subtext: 'Chaotic meme wildcard procs', rarity: 'chaos', color: '#f59e0b' },
      { text: 'Radley', subtext: 'Pragmatic colosseum survival', rarity: 'rare', color: '#10b981' },
      { text: 'The Cosmic Jester', subtext: 'Unpredictable reality warping', rarity: 'chaos', color: '#a855f7' },
      { text: 'Cfox', subtext: 'Strategic counter-striking', rarity: 'rare', color: '#3b82f6' },
      { text: 'True Reincarnation', subtext: 'Awakened memories of all past champions', rarity: 'godTier', color: '#f43f5e' }
    ]
  },

  dragonSlayerRank: {
    id: 'dragonSlayerRank',
    name: 'Dragon Slayer Hunter Rank',
    subtitle: 'What rank of draconic mastery have you achieved?',
    icon: '🐉',
    segments: [
      { text: 'Iron Claw', subtext: 'Rookie wyrm stalker (+15 STR)', rarity: 'common', color: '#6b7280' },
      { text: 'Quartz Knight', subtext: 'Hardened scale deflector (+20 DUR)', rarity: 'uncommon', color: '#94a3b8' },
      { text: 'Bronze Berserker', subtext: 'Heavy draconic cleaves (+25 STR)', rarity: 'uncommon', color: '#b45309' },
      { text: 'Emerald Prowler', subtext: 'Venom-scale resistance (+25 SPD)', rarity: 'rare', color: '#16a34a' },
      { text: 'Jade Juggernaut', subtext: 'Earth-shaking impact force (+30 DUR)', rarity: 'rare', color: '#0d9488' },
      { text: 'Ruby Renegade', subtext: 'Hellfire blood affinity (+35 STR)', rarity: 'epic', color: '#dc2626' },
      { text: 'Obsidian Overlord', subtext: 'Void-scale sovereign (+40 DUR, +30 STR)', rarity: 'legendary', color: '#312e81' },
      { text: 'Diamond Dragoon', subtext: 'Apex Wyrm God Executioner (+50 All Stats)', rarity: 'godTier', color: '#06b6d4' }
    ]
  },

  angelicOrder: {
    id: 'angelicOrder',
    name: 'Angelic Order Sub-Wheel',
    subtitle: 'What station in the celestial choir do you hold?',
    icon: '🪽',
    segments: [
      { text: 'Cupid', subtext: 'Swift arrow of affection and charm', rarity: 'common', color: '#f472b6' },
      { text: 'Messenger', subtext: 'Supersonic herald of divine decrees (+35 SPD)', rarity: 'uncommon', color: '#93c5fd' },
      { text: 'Valkyrie', subtext: 'Chooses the slain in combat (+35 STR, +30 DUR)', rarity: 'epic', color: '#38bdf8' },
      { text: 'Archangel', subtext: 'Supreme Commander of Heaven’s Host (+50 All Stats)', rarity: 'mythic', color: '#fbbf24' }
    ]
  },

  demonPowers: {
    id: 'demonPowers',
    name: 'Infernal Demon Ability Sub-Wheel',
    subtitle: 'Which dark gift do you unleash upon mortal realms?',
    icon: '🔥',
    segments: [
      { text: 'Shadow Blend', subtext: 'Dissolves harmlessly into darkness', rarity: 'common', color: '#475569' },
      { text: 'Dark Healing', subtext: 'Feeds on enemy suffering to regenerate health', rarity: 'uncommon', color: '#065f46' },
      { text: 'Cursed Touch', subtext: 'Decays weapons and armor on physical contact', rarity: 'uncommon', color: '#7f1d1d' },
      { text: 'Hellish Flame', subtext: 'Incinerates targets with inextinguishable fire', rarity: 'rare', color: '#dc2626' },
      { text: 'Corruption Aura', subtext: 'Passively drains nearby combatants’ stamina', rarity: 'rare', color: '#581c87' },
      { text: 'Demonic Possession', subtext: 'Overrides enemy limbs for 1 turn', rarity: 'epic', color: '#7e22ce' },
      { text: 'Hellgate Opening', subtext: 'Summons lesser infernal imps to swarm the foe', rarity: 'epic', color: '#b91c1c' },
      { text: 'Pact Making', subtext: 'Forces a mutual blood sacrifice for extreme burst', rarity: 'rare', color: '#b45309' },
      { text: 'Soul Harvest', subtext: 'Reaps defeated souls into permanent power boosts', rarity: 'legendary', color: '#4c1d95' },
      { text: 'Darkness Manipulation', subtext: 'Shapes solid umbral blades and barriers', rarity: 'epic', color: '#1e1b4b' },
      { text: 'Abyssal Chains', subtext: 'Immobilizes target in indestructible spikes', rarity: 'legendary', color: '#6d28d9' },
      { text: 'Reality Corruption', subtext: 'Warps laws of combat into chaotic hellscapes', rarity: 'mythic', color: '#db2777' },
      { text: 'Primordial Annihilation', subtext: 'Erases mortal essence with infernal singularity', rarity: 'godTier', color: '#ef4444' }
    ]
  },

  devilsSins: {
    id: 'devilsSins',
    name: 'The 7 Deadly Sins Sub-Wheel',
    subtitle: 'Which capital infernal sin rules your soul?',
    icon: '😈',
    segments: [
      { text: 'Wrath', subtext: 'Attack quadruples as health decreases', rarity: 'epic', color: '#dc2626' },
      { text: 'Pride', subtext: 'Immune to debuffs while above 75% HP', rarity: 'epic', color: '#eab308' },
      { text: 'Gluttony', subtext: 'Devours enemy attacks to restore health', rarity: 'rare', color: '#d97706' },
      { text: 'Sloth', subtext: 'Passive heavy damage reflection while stationary', rarity: 'uncommon', color: '#64748b' },
      { text: 'Greed', subtext: 'Steals opponent weapon passives and enchants', rarity: 'rare', color: '#16a34a' },
      { text: 'Envy', subtext: 'Copies the highest stat of the opponent', rarity: 'rare', color: '#059669' },
      { text: 'Lust', subtext: 'Charms opponents into skipping their first attack', rarity: 'epic', color: '#db2777' }
    ]
  },

  godType: {
    id: 'godType',
    name: 'Divine Domain Sub-Wheel',
    subtitle: 'Over what concept of the cosmos do you reign?',
    icon: '👑',
    segments: [
      { text: 'God of Life', subtext: 'Infinite cellular restoration and vitality', rarity: 'legendary', color: '#10b981' },
      { text: 'God of Animals', subtext: 'Commands every beast in the multiverse', rarity: 'rare', color: '#854d0e' },
      { text: 'God of Space', subtext: 'Folds dimensions and compresses distance to 0', rarity: 'mythic', color: '#6366f1' },
      { text: 'God of Chaos', subtext: 'Inverts outcomes and rewrites battle logic', rarity: 'chaos', color: '#ef4444' },
      { text: 'God of War', subtext: 'Absolute combat mastery; never misses strikes', rarity: 'epic', color: '#dc2626' },
      { text: 'God of Love', subtext: 'Pacifies enemies and converts foes to allies', rarity: 'rare', color: '#ec4899' },
      { text: 'God of Death', subtext: 'Touch of decay; bypasses physical durability', rarity: 'mythic', color: '#1e1b4b' },
      { text: 'God of Wind', subtext: 'Supersonic gale velocity and tempest shields', rarity: 'rare', color: '#06b6d4' },
      { text: 'God of Fire', subtext: 'Solar thermonuclear infernos', rarity: 'epic', color: '#ea580c' },
      { text: 'God of Water', subtext: 'Oceanic depths pressure and tsunami waves', rarity: 'rare', color: '#0284c7' },
      { text: 'God of Thunder', subtext: 'Heavenly lightning strikes that stun targets', rarity: 'epic', color: '#eab308' },
      { text: 'God of Wisdom', subtext: 'Omniscience; foresees every enemy strike', rarity: 'legendary', color: '#3b82f6' },
      { text: 'God of Earth', subtext: 'Tectonic mountain shields and earthquakes', rarity: 'rare', color: '#78350f' },
      { text: 'God of Mischief', subtext: 'Illusory decoys, stat swaps, and trickery', rarity: 'chaos', color: '#a855f7' },
      { text: 'God of Gods', subtext: 'Supreme Ruler of the Multiverse Pantheon', rarity: 'godTier', color: '#fde047' }
    ]
  },

  primordialType: {
    id: 'primordialType',
    name: 'Primordial Constant Sub-Wheel',
    subtitle: 'Which eternal law of reality embodies your being?',
    icon: '🌌',
    segments: [
      { text: 'Primordial of Time', subtext: 'Rewinds, pauses, and fast-forwards turns', rarity: 'godTier', color: '#06b6d4' },
      { text: 'Primordial of Eternity', subtext: 'Immune to all status effects and death', rarity: 'godTier', color: '#8b5cf6' },
      { text: 'Primordial of Reality', subtext: 'Rewrites combat physics at will', rarity: 'godTier', color: '#ec4899' },
      { text: 'Primordial of Void', subtext: 'Consumes incoming attacks into nothingness', rarity: 'godTier', color: '#1e1b4b' },
      { text: 'Primordial of Order', subtext: 'Enforces strict absolute equality of stats', rarity: 'godTier', color: '#fbbf24' },
      { text: 'Primordial of Chaos', subtext: 'Wild magic roulette on every single action', rarity: 'chaos', color: '#ef4444' },
      { text: 'Primordial of Life', subtext: 'Automatic full resurrection with 2x stats', rarity: 'godTier', color: '#10b981' },
      { text: 'Primordial of Death', subtext: 'Fatal touch that disintegrates targets', rarity: 'godTier', color: '#374151' }
    ]
  },

  vampireFeeding: {
    id: 'vampireFeeding',
    name: 'Vampire Feeding Diet Sub-Wheel',
    subtitle: 'What prey fuels your immortal nocturnal bloodlust?',
    icon: '🩸',
    segments: [
      { text: 'Mortal Prey', subtext: 'Feeds on humans and baseline mortals', rarity: 'common', color: '#6b7280' },
      { text: 'Apex Beasts & Monsters', subtext: 'Drains dragons, demons, and chimeras', rarity: 'rare', color: '#991b1b' },
      { text: 'Divine Heroes & Gods', subtext: 'Feeds on celestial ichor and demigods', rarity: 'legendary', color: '#831843' }
    ]
  },

  animorphMorph: {
    id: 'animorphMorph',
    name: 'Animorph Beast Shifting Sub-Wheel',
    subtitle: 'What tier of adaptive shapeshifting do you command?',
    icon: '🐺',
    segments: [
      { text: 'Pets Morphing', subtext: 'Shifts into agile domesticated animals', rarity: 'common', color: '#6b7280' },
      { text: 'Single Apex Morph', subtext: 'Transforms into a specific deadly predator', rarity: 'uncommon', color: '#78350f' },
      { text: 'Multiple Morphs', subtext: 'Swaps between land, air, and aquatic beasts', rarity: 'rare', color: '#15803d' },
      { text: 'Adaptive Morphing', subtext: 'Instantly mutates counters to enemy attacks', rarity: 'epic', color: '#0284c7' },
      { text: 'Omni-Morph', subtext: 'Can become any biological creature in existence', rarity: 'legendary', color: '#7c3aed' },
      { text: 'True Elemental Morph', subtext: 'Shifts into living magma, storm, and frost chimeras', rarity: 'godTier', color: '#ea580c' }
    ]
  },

  cyborgTechno: {
    id: 'cyborgTechno',
    name: 'Cyborg Tech Augment Sub-Wheel',
    subtitle: 'What cybernetic system was installed into your chassis?',
    icon: '🤖',
    segments: [
      { text: 'Quantum Processing', subtext: 'Calculates optimal attack trajectories instantly', rarity: 'rare', color: '#06b6d4' },
      { text: 'Force Field Core', subtext: 'Deploys a 150 HP energy bubble shield', rarity: 'uncommon', color: '#3b82f6' },
      { text: 'Gravity Manipulation', subtext: 'Crushes enemies under 10G graviton fields', rarity: 'legendary', color: '#7c3aed' },
      { text: 'Nanite Regeneration', subtext: 'Repairs metal frame damage continuously', rarity: 'epic', color: '#10b981' },
      { text: 'Power Absorption Array', subtext: 'Copies and replicates opponent energy attacks', rarity: 'mythic', color: '#ec4899' },
      { text: 'Holographic Projection', subtext: 'Spawns 3 decoy sensor signatures', rarity: 'uncommon', color: '#38bdf8' },
      { text: 'Sonic Disruption Cannon', subtext: 'Emits deafening concussion blasts', rarity: 'rare', color: '#f59e0b' },
      { text: 'Plasma Overcharge Blast', subtext: 'High-voltage laser beam cutting through armor', rarity: 'rare', color: '#ef4444' },
      { text: 'Adaptive Camouflage', subtext: 'Complete visual and radar invisibility', rarity: 'uncommon', color: '#64748b' }
    ]
  },

  giantDomain: {
    id: 'giantDomain',
    name: 'Giant Titan Biome Sub-Wheel',
    subtitle: 'From which primordial landscape was your frame chiseled?',
    icon: '🗿',
    segments: [
      { text: 'Arctic Titan', subtext: 'Glacial armor and frostbite shockwaves', rarity: 'rare', color: '#0284c7' },
      { text: 'Mountain Monarch', subtext: 'Granite density that shatters mortal weapons', rarity: 'rare', color: '#78350f' },
      { text: 'Forest Behemoth', subtext: 'Living redwood armor and vine snares', rarity: 'uncommon', color: '#15803d' },
      { text: 'Desert Colossus', subtext: 'Blinding sandstorm aura and crushing weight', rarity: 'uncommon', color: '#d97706' },
      { text: 'Ocean Leviathan', subtext: 'Tidal surges and impenetrable blubber hide', rarity: 'epic', color: '#0891b2' },
      { text: 'Inferno Elder', subtext: 'Molten volcanic core erupting on impact', rarity: 'epic', color: '#dc2626' },
      { text: 'Celestial Sentinel', subtext: 'Cosmic scale titan walking between starfields', rarity: 'godTier', color: '#fbbf24' }
    ]
  },

  goblinPosition: {
    id: 'goblinPosition',
    name: 'Goblin Clan Station Sub-Wheel',
    subtitle: 'Where do you rank in the goblin pack hierarchy?',
    icon: '👺',
    segments: [
      { text: 'A Bitch (Underling)', subtext: 'Scrappy distraction taking hits for the horde', rarity: 'common', color: '#65a30d' },
      { text: 'The Leader (Gremlin King)', subtext: 'Commands the entire goblin swarm with dirty tricks', rarity: 'rare', color: '#eab308' }
    ]
  },

  orcRole: {
    id: 'orcRole',
    name: 'Orcish Tribe Role Sub-Wheel',
    subtitle: 'What duty did you carry out in the grand horde?',
    icon: '👹',
    segments: [
      { text: 'Orc Bard', subtext: 'Intimidating war drums and screeching bagpipes', rarity: 'common', color: '#ec4899' },
      { text: 'Orc Blacksmith', subtext: 'Forges jagged cleavers with high critical bleed', rarity: 'uncommon', color: '#92400e' },
      { text: 'Orc Berserker', subtext: 'Unchecked blood frenzy scaling with lost HP', rarity: 'rare', color: '#dc2626' },
      { text: 'Orc Shaman', subtext: 'Totemic lightning and ancestral war spirits', rarity: 'epic', color: '#7c3aed' },
      { text: 'Orc Warlord', subtext: 'Supreme chieftain dominating the battlefield', rarity: 'legendary', color: '#b91c1c' }
    ]
  },

  golemMaterial: {
    id: 'golemMaterial',
    name: 'Golem Core Composition Sub-Wheel',
    subtitle: 'What matter forms your physical construct body?',
    icon: '🧱',
    segments: [
      { text: 'Clay Golem', subtext: 'Malleable body absorbing blunt force', rarity: 'common', color: '#78350f' },
      { text: 'Stone Golem', subtext: 'Heavy granite plates with high defense', rarity: 'uncommon', color: '#6b7280' },
      { text: 'Iron Golem', subtext: 'Heavy forged metal frame impervious to slashes', rarity: 'rare', color: '#475569' },
      { text: 'Diamond Golem', subtext: 'Crystalline hardness deflecting magic rays', rarity: 'epic', color: '#38bdf8' },
      { text: 'Obsidian Golem', subtext: 'Volcanic glass core exploding upon defeat', rarity: 'legendary', color: '#312e81' }
    ]
  },

  hiveMindForm: {
    id: 'hiveMindForm',
    name: 'Hive Mind Swarm Matrix Sub-Wheel',
    subtitle: 'What form does your unified consciousness take?',
    icon: '🦗',
    segments: [
      { text: 'Insect Swarm', subtext: 'Millions of locusts devouring armor and flesh', rarity: 'common', color: '#4d7c0f' },
      { text: 'Parasite Horde', subtext: 'Burrows into enemy nerves to disrupt actions', rarity: 'uncommon', color: '#854d0e' },
      { text: 'Mycelial Mass', subtext: 'Fungal spore network rotting opponent stamina', rarity: 'rare', color: '#059669' },
      { text: 'Nanite Matrix', subtext: 'Technopathic micro-machines dissolving weapons', rarity: 'epic', color: '#0284c7' },
      { text: 'Aquatic Colony', subtext: 'Liquid organism capable of total liquefaction', rarity: 'rare', color: '#0891b2' },
      { text: 'Shadow Ensemble', subtext: 'Amorphous darkness shifting into multiple clones', rarity: 'legendary', color: '#312e81' },
      { text: 'Psychic Network', subtext: 'Telepathic synaptic web overwhelming minds', rarity: 'godTier', color: '#a855f7' }
    ]
  },

  mythicalBeastType: {
    id: 'mythicalBeastType',
    name: 'Mythical Beast Breed Sub-Wheel',
    subtitle: 'Which legendary creature of ancient fable are you?',
    icon: '🦁',
    segments: [
      { text: 'Nemean Lion', subtext: 'Golden pelt impervious to mortal weapons', rarity: 'rare', color: '#b45309' },
      { text: 'Minotaur', subtext: 'Labyrinthine charging horns breaking guards', rarity: 'uncommon', color: '#78350f' },
      { text: 'Phoenix', subtext: 'Rebirth from solar ashes with full health', rarity: 'legendary', color: '#ea580c' },
      { text: 'Pegasus', subtext: 'Winged aerial charge striking undefended flanks', rarity: 'rare', color: '#38bdf8' },
      { text: 'Sphinx', subtext: 'Enigmatic riddle aura that silences magic', rarity: 'epic', color: '#eab308' },
      { text: 'Leviathan', subtext: 'Abyssal sea serpent crushing warships', rarity: 'legendary', color: '#0284c7' },
      { text: 'Cerberus', subtext: 'Three-headed hellhound breathing magma', rarity: 'epic', color: '#991b1b' },
      { text: 'Unicorn', subtext: 'Purity horn piercing curses and dark magic', rarity: 'rare', color: '#ec4899' },
      { text: 'Basilisk', subtext: 'Petrifying gaze turning limbs to stone', rarity: 'rare', color: '#15803d' }
    ]
  },

  dryadOrigin: {
    id: 'dryadOrigin',
    name: 'Dryad Nature Spirit Sub-Wheel',
    subtitle: 'Which sacred wilderness gave birth to your essence?',
    icon: '🌿',
    segments: [
      { text: 'Tree Born', subtext: 'Rooted connection with ancient elder trees', rarity: 'common', color: '#15803d' },
      { text: 'Natural Phenomena', subtext: 'Birthed from seasonal solstices and equinoxes', rarity: 'uncommon', color: '#059669' },
      { text: 'Moon Child', subtext: 'Lunar photosynthesis granting night vision and evasion', rarity: 'rare', color: '#818cf8' },
      { text: 'Celestial Alignment', subtext: 'Cosmic star roots channeling stellar magic', rarity: 'epic', color: '#38bdf8' },
      { text: "Nature's Wrath", subtext: 'Vengeful primeval avatar entangling foes in briars', rarity: 'legendary', color: '#16a34a' }
    ]
  },

  merfolkLineage: {
    id: 'merfolkLineage',
    name: 'Merfolk Aquatic Lineage Sub-Wheel',
    subtitle: 'From what trench of the ocean depths do you emerge?',
    icon: '🧜',
    segments: [
      { text: 'Frogling', subtext: 'Amphibious jumper with toxic skin secretions', rarity: 'common', color: '#65a30d' },
      { text: 'Cecelia (Abyssal)', subtext: 'Bioluminescent deep-sea huntress with tentacles', rarity: 'uncommon', color: '#0d9488' },
      { text: 'True-Born Royal Merfolk', subtext: 'Commands ocean currents and sonic sirens', rarity: 'rare', color: '#0284c7' }
    ]
  },

  reincarnationSoul: {
    id: 'reincarnationSoul',
    name: 'Past Season Arena Legend Sub-Wheel',
    subtitle: 'Whose glorious tournament soul reincarnated inside you?',
    icon: '✨',
    segments: [
      { text: 'Achilles', subtext: 'Near-invulnerable hero with lethal spear precision', rarity: 'legendary', color: '#fbbf24' },
      { text: 'The Mexican', subtext: 'Speedster legend known for supersonic evasion', rarity: 'rare', color: '#ea580c' },
      { text: 'Kevin', subtext: 'Chaotic wildcard defying all battle predictions', rarity: 'chaos', color: '#ef4444' },
      { text: 'Kanemckillop', subtext: 'Brutal relentless tournament powerhouse', rarity: 'epic', color: '#7c3aed' },
      { text: 'Nyta', subtext: 'Ethereal spellblade slicing across dimensions', rarity: 'rare', color: '#06b6d4' },
      { text: 'Joe the Great', subtext: 'Colosseum warlord champion', rarity: 'legendary', color: '#15803d' },
      { text: 'Sammy the Swift', subtext: 'Fierce duelist with lightning quickdraws', rarity: 'rare', color: '#16a34a' },
      { text: 'TFCK', subtext: 'Unshakable fortress of durability and grit', rarity: 'epic', color: '#f59e0b' },
      { text: 'Darwizzy', subtext: 'Transcendental archmage with infinite IQ', rarity: 'godTier', color: '#8b5cf6' }
    ]
  },

  mageRank: {
    id: 'mageRank',
    name: 'Mage Academy Rank Sub-Wheel',
    subtitle: 'What level of arcane mastery have you attained?',
    icon: '🔮',
    segments: [
      { text: 'Apprentice', subtext: 'Grants 1 additional supernatural power roll', rarity: 'common', color: '#6b7280' },
      { text: 'Sorcerer', subtext: 'Grants 2 additional simultaneous power rolls!', rarity: 'rare', color: '#2563eb' },
      { text: 'Archmage', subtext: 'Grants 3 simultaneous power rolls + 30 INT!', rarity: 'epic', color: '#7c3aed' },
      { text: 'Lich King', subtext: 'Ascends into immortality with 2 Lich powers!', rarity: 'godTier', color: '#06b6d4' }
    ]
  },

  paladinPowers: {
    id: 'paladinPowers',
    name: 'Paladin Sacred Miracles Sub-Wheel',
    subtitle: 'Which holy grace is bestowed by the High Heavens?',
    icon: '🛡️',
    segments: [
      { text: 'Healing Touch', subtext: 'Restores 40 HP upon taking damage', rarity: 'common', color: '#34d399' },
      { text: 'Divine Shielding', subtext: 'Nullifies the first 2 enemy attacks', rarity: 'uncommon', color: '#60a5fa' },
      { text: 'Celestial Arrows', subtext: 'Radiant spears that never miss target', rarity: 'rare', color: '#facc15' },
      { text: 'Sacred Fire', subtext: 'Purging solar flame dealing extra vs fiends', rarity: 'rare', color: '#f97316' },
      { text: 'Divine Perfection', subtext: 'Immune to all curses, debuffs, and stuns', rarity: 'epic', color: '#eab308' },
      { text: 'Blessed Maelstrom', subtext: 'Holy tempest damaging all arena foes', rarity: 'epic', color: '#38bdf8' },
      { text: 'Resurrection', subtext: 'Revives automatically once with 50% health', rarity: 'legendary', color: '#f59e0b' },
      { text: 'Miracle Creation', subtext: 'Rewrites a fatal blow into an instant victory', rarity: 'godTier', color: '#a855f7' }
    ]
  },

  cursedPowers: {
    id: 'cursedPowers',
    name: 'Cursed Cultist Dark Arcana Sub-Wheel',
    subtitle: 'Which forbidden abyssal technique was branded into your soul?',
    icon: '🩸',
    segments: [
      { text: 'Demonic Regeneration', subtext: 'Regrows limbs and heals 30 HP per turn', rarity: 'common', color: '#065f46' },
      { text: 'Shadow Grasp', subtext: 'Shadow tentacles root opponents in place', rarity: 'uncommon', color: '#374151' },
      { text: 'Hellfire', subtext: 'Burns enemy armor and deals stacking fire damage', rarity: 'rare', color: '#dc2626' },
      { text: 'Abyssal Chains', subtext: 'Locks enemy weapon, preventing weapon perks', rarity: 'rare', color: '#581c87' },
      { text: 'Necrotic Wave', subtext: 'Pulses decaying energy across the arena', rarity: 'epic', color: '#15803d' },
      { text: 'Inferno Travel', subtext: 'Teleports through flames to strike enemy back', rarity: 'rare', color: '#ea580c' },
      { text: 'Plague Unleashing', subtext: 'Inflicts neurotoxin that cuts enemy stats by 30%', rarity: 'epic', color: '#84cc16' },
      { text: 'Power Negation', subtext: 'Silences all supernatural powers of the foe', rarity: 'legendary', color: '#7c3aed' },
      { text: 'Reality Corruption', subtext: 'Corrupts battle formulas into deadly anomalies', rarity: 'godTier', color: '#db2777' }
    ]
  },

  goliathArmor: {
    id: 'goliathArmor',
    name: 'Goliath Exosuit Armor Sub-Wheel',
    subtitle: 'What defensive plate encapsulates your massive frame?',
    icon: '🛡️',
    segments: [
      { text: 'Darwinite Armor', subtext: 'Heavy reinforced standard combat plating', rarity: 'common', color: '#6b7280' },
      { text: 'Heavy Plate (+2 DUR)', subtext: 'Colossal steel slab granting massive damage reduction', rarity: 'uncommon', color: '#475569' },
      { text: "Gambler's Coat", subtext: '50% chance to take 0 damage, 50% chance for double', rarity: 'rare', color: '#f59e0b' },
      { text: 'Latex Suit (Pain Suppression)', subtext: 'Total pain immunity; never flinches or drops stance', rarity: 'rare', color: '#10b981' },
      { text: "Dragon's Scale Mail", subtext: '+1 Durability and 75% elemental resistance', rarity: 'epic', color: '#c2410c' },
      { text: 'Plasma Augment Shield', subtext: 'Kinetic energy shield absorbing laser and force hits', rarity: 'epic', color: '#06b6d4' },
      { text: "Void's Fortress", subtext: 'Negates all powers & void manipulation, -1 DUR/fight', rarity: 'godTier', color: '#312e81' }
    ]
  },

  ninjaRank: {
    id: 'ninjaRank',
    name: 'Ninja Stealth Rank Sub-Wheel',
    subtitle: 'What tier of unseen shadow discipline have you mastered?',
    icon: '🥷',
    segments: [
      { text: 'Clumsy Ninja', subtext: 'Trips over own shurikens (+5 Speed)', rarity: 'common', color: '#6b7280' },
      { text: 'Rookie Genin', subtext: 'Standard smoke bombs and kunai (+15 SPD)', rarity: 'uncommon', color: '#475569' },
      { text: 'Quiet Chunin', subtext: 'Soundless footwork (+25 SPD, +15 Fight)', rarity: 'rare', color: '#2563eb' },
      { text: 'Silent Jonin', subtext: 'One-shot ambush strikes from blind spots', rarity: 'epic', color: '#7c3aed' },
      { text: 'Grandmaster Kage', subtext: 'Shadow clone techniques and illusion decoys', rarity: 'legendary', color: '#b91c1c' },
      { text: 'Shadow (Ascended)', subtext: '+2 Stealth Skills, Poison Enchant, Ambush Mastery', rarity: 'godTier', color: '#312e81' }
    ]
  },

  martialArtStyle: {
    id: 'martialArtStyle',
    name: 'Martial Discipline Sub-Wheel',
    subtitle: 'Which unarmed combat discipline governs your fists?',
    icon: '🥋',
    segments: [
      { text: 'Boxing', subtext: 'Heavy hooks and slips (+2 Fight, +2 Weapon Mastery)', rarity: 'common', color: '#b45309' },
      { text: 'MMA', subtext: 'All-around grappling (+1 STR, +1 SPD, +1 DUR, +2 Fight)', rarity: 'uncommon', color: '#dc2626' },
      { text: 'Kung Fu', subtext: 'Flowing forms and pressure points (+1 IQ, +1 Fight)', rarity: 'uncommon', color: '#d97706' },
      { text: 'Capoeira', subtext: 'Acrobatic rhythm and sweep kicks (+1 Fight, +2 Speed)', rarity: 'rare', color: '#16a34a' },
      { text: 'Muay Thai', subtext: 'Eight limbs striking with iron shins (+2 STR, +2 Fight)', rarity: 'rare', color: '#ea580c' },
      { text: 'Judo', subtext: 'Shattering throws reversing enemy kinetic energy', rarity: 'rare', color: '#0284c7' },
      { text: 'Taekwondo', subtext: 'Hypersonic 540 spinning kicks breaking guards', rarity: 'uncommon', color: '#7c3aed' }
    ]
  },

  priestDomain: {
    id: 'priestDomain',
    name: 'Priest Deific Domain Sub-Wheel',
    subtitle: 'Which altar of divinity do you serve as high cleric?',
    icon: '⛪',
    segments: [
      { text: 'Domain of Festivity', subtext: 'High spirits granting morale and speed boosts', rarity: 'common', color: '#ec4899' },
      { text: 'Domain of Wisdom', subtext: 'Arcane clarity increasing crit rates (+30 INT)', rarity: 'uncommon', color: '#3b82f6' },
      { text: 'Domain of War', subtext: 'Blesses weapons with +35% holy damage', rarity: 'rare', color: '#dc2626' },
      { text: 'Domain of Nature', subtext: 'Regenerates health and cleanses poisons', rarity: 'uncommon', color: '#16a34a' },
      { text: 'Domain of Sea', subtext: 'Tidal waves and water manipulation', rarity: 'rare', color: '#0284c7' },
      { text: 'Domain of Light', subtext: 'Blinds enemy sights and reflects dark magic', rarity: 'epic', color: '#facc15' },
      { text: 'Domain of Fortune', subtext: 'Guarantees lucky critical procs', rarity: 'legendary', color: '#f59e0b' },
      { text: 'Domain of Thunder', subtext: 'Calls down divine thunderbolts', rarity: 'rare', color: '#eab308' },
      { text: 'Domain of Sun', subtext: 'Blazes with solar fire vaporizing shields', rarity: 'godTier', color: '#fbbf24' }
    ]
  },

  pirateRank: {
    id: 'pirateRank',
    name: 'Pirate Vessel Hierarchy Sub-Wheel',
    subtitle: 'What position do you command on the pirate brigantine?',
    icon: '🏴‍☠️',
    segments: [
      { text: 'Pirate Captain', subtext: 'Guaranteed weapon, +2 Mastery, +1 STR, loots fallen weapons', rarity: 'epic', color: '#0284c7' },
      { text: 'Pirate Crewmate', subtext: 'Swabs the deck: +1 Weapon Mastery, -1 IQ', rarity: 'common', color: '#6b7280' }
    ]
  },

  gladiatorVariant: {
    id: 'gladiatorVariant',
    name: 'Gladiator Fighting Form Sub-Wheel',
    subtitle: 'What bloody discipline do you bring to the sands?',
    icon: '⚔️',
    segments: [
      { text: 'Feral Gladiator', subtext: 'Disdains weapons: Fights with Enchanted Bare Knuckles', rarity: 'uncommon', color: '#dc2626' },
      { text: 'Monster Gladiator', subtext: 'Wields Claws + receives free Mutation wheel spin', rarity: 'rare', color: '#b45309' },
      { text: 'Berserker Gladiator', subtext: 'Unstoppable blood rage multiplying attack at low HP', rarity: 'rare', color: '#991b1b' },
      { text: 'Pactmaker Gladiator', subtext: 'Bound to demons for temporary stat surges', rarity: 'epic', color: '#7e22ce' },
      { text: 'Relic Keeper Gladiator', subtext: 'Enters arena bearing ancient colosseum treasures', rarity: 'legendary', color: '#d97706' }
    ]
  },

  spiritWeaverType: {
    id: 'spiritWeaverType',
    name: 'Spirit Weaver Lineage Sub-Wheel',
    subtitle: 'What spectral medium do you weave into physical combat?',
    icon: '🧵',
    segments: [
      { text: 'Weaver of Blades', subtext: 'Conjures floating phantom swords striking independently', rarity: 'rare', color: '#06b6d4' },
      { text: 'Weaver of Mind', subtext: 'Expands psyche to command 2 additional powers', rarity: 'epic', color: '#8b5cf6' },
      { text: 'Weaver of Body', subtext: 'Spectral muscle fibers doubling physical durability', rarity: 'uncommon', color: '#10b981' },
      { text: 'Weaver of Relics', subtext: 'Channels ancient enchanted armaments of old gods', rarity: 'legendary', color: '#f59e0b' },
      { text: 'Chaos Weaver', subtext: 'Rewires combat reality with unpredictable wildcard procs', rarity: 'chaos', color: '#ef4444' }
    ]
  },

  mutantTrait: {
    id: 'mutantTrait',
    name: 'Mutant Biological Anomaly Sub-Wheel',
    subtitle: 'Which genetic or cosmic mutation manifested in your cells?',
    icon: '🧬',
    segments: [
      { text: 'Quantum Being', subtext: 'Quantum Manipulation & phasing through solid matter', rarity: 'godTier', color: '#06b6d4' },
      { text: 'Kinetic Absorption', subtext: 'Absorbs physical impacts and discharges 2x force', rarity: 'legendary', color: '#3b82f6' },
      { text: 'Runic Flesh', subtext: 'Carved runes granting +20 to Strength, Speed, and Durability', rarity: 'epic', color: '#7c3aed' },
      { text: 'Solar Sail', subtext: 'Atmospheric flight and solar weather control', rarity: 'rare', color: '#f59e0b' },
      { text: 'Vapor Form', subtext: 'Shifts into untouchable gaseous mist', rarity: 'uncommon', color: '#0891b2' },
      { text: 'Bramble Bind', subtext: 'Sprouts thorned vines snaring enemy limbs', rarity: 'uncommon', color: '#16a34a' },
      { text: 'Luminous Form', subtext: 'Emits blinding photon bursts disrupting enemy aim', rarity: 'rare', color: '#facc15' },
      { text: 'Magma Mantle', subtext: 'Skin burns at 2000 degrees, melting enemy swords', rarity: 'epic', color: '#ea580c' },
      { text: 'Featherflight', subtext: 'Weightless aerial agility dodging heavy ground slams', rarity: 'uncommon', color: '#38bdf8' },
      { text: 'Plasma Core', subtext: 'Overcharging chest reactor firing laser supernovas', rarity: 'mythic', color: '#ec4899' }
    ]
  },

  royaltyTitle: {
    id: 'royaltyTitle',
    name: 'Royal Heritage Sub-Wheel',
    subtitle: 'Which crown do you claim over the realm?',
    icon: '👑',
    segments: [
      { text: 'Prince', subtext: 'Noble heir commanding vanguard legions (+20 All Stats)', rarity: 'rare', color: '#2563eb' },
      { text: 'Princess', subtext: 'Royal diplomat possessing charm and strategic intellect', rarity: 'rare', color: '#ec4899' },
      { text: 'Queen of Light', subtext: 'Radiant monarch casting protective heavenly wards', rarity: 'epic', color: '#facc15' },
      { text: 'Dark Queen', subtext: 'Ruthless sovereign wielding blood decrees and curses', rarity: 'epic', color: '#7e22ce' },
      { text: 'Emperor / King', subtext: 'Supreme Imperial Majesty commanding total obedience', rarity: 'legendary', color: '#d97706' }
    ]
  },

  apostleBelief: {
    id: 'apostleBelief',
    name: 'Apostle Philosophical Creed Sub-Wheel',
    subtitle: 'Which fundamental philosophy dictates your reality?',
    icon: '📜',
    segments: [
      { text: 'Existentialism', subtext: 'Forges own destiny; immune to pre-determined fate', rarity: 'rare', color: '#3b82f6' },
      { text: 'Absurdism', subtext: 'Embraces the void; laughs off fatal damage', rarity: 'rare', color: '#ec4899' },
      { text: 'Nihilism', subtext: 'Believes in nothing; cuts through enemy illusions', rarity: 'uncommon', color: '#64748b' },
      { text: 'Natural Pantheism', subtext: 'One with nature; heals while standing on earth', rarity: 'uncommon', color: '#16a34a' },
      { text: 'Daoism', subtext: 'Yields like water to deflect 100% of physical force', rarity: 'epic', color: '#06b6d4' },
      { text: 'Determinism (Precognition)', subtext: 'Sees the unalterable future 3 steps ahead', rarity: 'legendary', color: '#7c3aed' },
      { text: 'Stoicism', subtext: 'Unshakable mental fortress; completely immune to fear and stuns', rarity: 'rare', color: '#475569' },
      { text: 'Chaoism', subtext: 'Wild unpredictability causing erratic critical multipliers', rarity: 'chaos', color: '#ef4444' }
    ]
  },

  primordialPatron: {
    id: 'primordialPatron',
    name: 'Primordial Patron Sub-Wheel',
    subtitle: 'Which fundamental cosmic constant chose you as champion?',
    icon: '🌌',
    segments: [
      { text: 'Time Patron', subtext: 'Granted temporal stops and turn rewinds', rarity: 'godTier', color: '#06b6d4' },
      { text: 'Void Patron', subtext: 'Devours incoming enemy projectile magic', rarity: 'godTier', color: '#1e1b4b' },
      { text: 'Eternity Patron', subtext: 'Impervious to permanent death or status wounds', rarity: 'godTier', color: '#8b5cf6' },
      { text: 'Order Patron', subtext: 'Forces opponent stats down to equal baseline', rarity: 'godTier', color: '#fbbf24' },
      { text: 'Life Patron', subtext: 'Continual regeneration and resurrection bloom', rarity: 'godTier', color: '#10b981' },
      { text: 'Death Patron', subtext: 'Cuts through immortality and armor', rarity: 'godTier', color: '#374151' },
      { text: 'Fate Patron', subtext: 'Guarantees miraculous critical strike outcomes', rarity: 'godTier', color: '#ea580c' }
    ]
  },

  championsLegacyFaction: {
    id: 'championsLegacyFaction',
    name: "Champion's Legacy Faction Sub-Wheel",
    subtitle: 'Which historic tournament GOATs lineage do you inherit?',
    icon: '🏆',
    segments: [
      { text: "Ethan's Legacy (Weapon Mimic)", subtext: 'Copies opponent weapon perks and gains Bloodcult fury', rarity: 'godTier', color: '#991b1b' },
      { text: "Musam's Legacy (The Honey Bun)", subtext: 'Transcendent Weapon Mastery + Steaming Honeybun strike!', rarity: 'mythic', color: '#d97706' },
      { text: "Boodro's Legacy (Colosseum Titan)", subtext: 'Unbreakable physical grit (+40 Durability, +30 Strength)', rarity: 'legendary', color: '#b45309' }
    ]
  },

  tricksterTricks: {
    id: 'tricksterTricks',
    name: 'Wheel of Tricks Sub-Wheel',
    subtitle: 'What chaotic combat trick do you spring on your opponent?',
    icon: '🃏',
    segments: [
      { text: 'Steal Opponent Weapon', subtext: 'Disarms foe and uses their weapon against them', rarity: 'legendary', color: '#f59e0b' },
      { text: 'Invert Opponent Stats', subtext: 'Turns high enemy stats into bottom ratings', rarity: 'mythic', color: '#7c3aed' },
      { text: 'Absorb Opponent Power', subtext: 'Copies and silences enemy special abilities', rarity: 'godTier', color: '#ec4899' },
      { text: 'Swap Stats with Foe', subtext: 'Steals high enemy stats and hands them your lower stats', rarity: 'chaos', color: '#ef4444' },
      { text: 'Steal Weapon & Powers', subtext: 'Total thievery leaving the opponent with bare hands', rarity: 'godTier', color: '#06b6d4' }
    ]
  },

  // ============================================================
  // 3. WEAPON WHEEL (36 Armaments & Meme Relics)
  // ============================================================
  weapon: {
    id: 'weapon',
    name: 'Weapon Wheel',
    subtitle: 'From mythical armaments to absurd meme items',
    icon: '🗡️',
    segments: [
      { text: 'Starshard Bow', subtext: 'Fires crystallized stellar flares', rarity: 'mythic', color: '#8b5cf6' },
      { text: 'Voidbreaker Maul', subtext: 'Crushes gravity wells on impact', rarity: 'legendary', color: '#4338ca' },
      { text: 'Skyrender Axe', subtext: 'Cleaves through storms and barriers', rarity: 'epic', color: '#b91c1c' },
      { text: "Thor's Hammer", subtext: "ETF's Godly Lightning Weapon", rarity: 'godTier', color: '#0284c7' },
      { text: 'Thunderous Thunderbolt', subtext: "Dominio's Divine Piercing Spear", rarity: 'godTier', color: '#eab308' },
      { text: 'Dragonheart Shield', subtext: 'Absorbs 90% elemental damage', rarity: 'legendary', color: '#c2410c' },
      { text: 'Soulchain Flail', subtext: 'Drains life essence on contact', rarity: 'epic', color: '#7e22ce' },
      { text: 'Muramasa Katana', subtext: 'Bloodthirsty razor-sharp edge', rarity: 'rare', color: '#be123c' },
      { text: 'Dual Plasma Pistols', subtext: 'Rapid-fire overheating energy bolts', rarity: 'rare', color: '#0ea5e9' },
      { text: 'Scythe of Eternity', subtext: 'Cuts through the timeline itself', rarity: 'mythic', color: '#6d28d9' },
      { text: 'Titanium Crowbar', subtext: 'Heavy, pragmatic, surprisingly lethal', rarity: 'uncommon', color: '#64748b' },
      { text: 'Spatula With Lemon Juice', subtext: 'Classic WoF Meme: Burns the eyes!!', rarity: 'chaos', color: '#e11d48' },
      { text: 'Enchanted Brick', subtext: 'Pure kinetic force; never misses', rarity: 'chaos', color: '#9a3412' },
      { text: 'Slipper of Doom', subtext: 'Inflicts psychological terror', rarity: 'chaos', color: '#f43f5e' },
      { text: 'Adamantine Greatsword', subtext: 'Heavy swings that break balance', rarity: 'uncommon', color: '#475569' },
      { text: 'Twin Daggers of Venom', subtext: 'Stacking neurotoxin damage', rarity: 'common', color: '#15803d' },
      // --- NEW EXPANDED WEAPONS ---
      { text: 'Excalibur', subtext: 'Holy Blade of Promised Victory', rarity: 'godTier', color: '#fbbf24' },
      { text: 'Stormbreaker', subtext: 'Bifrost-Cleaving Thunder Greataxe', rarity: 'godTier', color: '#0284c7' },
      { text: 'Nodachi of the Black Void', subtext: 'Extra-Long Blade that Slices Spacetime', rarity: 'legendary', color: '#581c87' },
      { text: 'Guillotine Greatsword', subtext: 'Colossal Executioner Slab that Shatters Guards', rarity: 'epic', color: '#991b1b' },
      { text: 'Dual Golden Desert Eagles', subtext: 'Supersonic Divine Caliber Bullets', rarity: 'epic', color: '#eab308' },
      { text: 'Nokia 3310 on a Chain', subtext: 'Bushin’s Indestructible God-Tier Meme Flail', rarity: 'chaos', color: '#0284c7' },
      { text: 'Folding Steel Chair', subtext: 'Unblockable WWE Colosseum Stun Slam', rarity: 'chaos', color: '#64748b' },
      { text: 'Cursed French Baguette', subtext: 'Harder than Tungsten Carbide; Highly Lethal', rarity: 'chaos', color: '#d97706' },
      { text: 'Chihuahua on a Leash', subtext: 'Pure Unadulterated Canine Rage & Ankle Biting', rarity: 'chaos', color: '#ef4444' },
      { text: 'Gungnir (Spear of Odin)', subtext: 'Fate-Bound Javelin that Never Misses Target', rarity: 'mythic', color: '#06b6d4' },
      { text: 'Quantum Railgun', subtext: 'Hypersonic Magnetic Slug Sniper', rarity: 'legendary', color: '#2563eb' },
      { text: 'Staff of the Cosmic Archmage', subtext: 'Triples Arcane Power Procs and Spell Burst', rarity: 'epic', color: '#9333ea' },
      { text: 'Chakrams of the Eclipse', subtext: 'Ricocheting Twin Razor Crescent Discs', rarity: 'rare', color: '#c026d3' },
      { text: 'Death Harvester Scythe', subtext: 'Direct Soul Harvest on Critical Strikes', rarity: 'mythic', color: '#4c1d95' },
      { text: 'Leviathan Harpoon', subtext: 'Hooks Foes and Drags into Crushing Melee', rarity: 'rare', color: '#0d9488' },
      { text: 'Laser Broadsword', subtext: 'Superheated Plasma Cuts Armor Like Butter', rarity: 'rare', color: '#06b6d4' },
      { text: 'Sledgehammer of Justice', subtext: 'Creates Seismic Crater Shockwaves', rarity: 'uncommon', color: '#b45309' },
      { text: 'God-Slaying Kusarigama', subtext: 'Whirling Chain Sickle with Venom Edge', rarity: 'legendary', color: '#b91c1c' },
      { text: 'Rubber Chicken of Torment', subtext: 'Deafening Squeak Induces Panic & Broken Stance', rarity: 'chaos', color: '#facc15' },
      { text: 'Dual Energy Chakrams', subtext: 'Blazing Rotating Solar Sawblades', rarity: 'rare', color: '#ea580c' }
    ]
  },

  // ============================================================
  // 4. POWER WHEEL (28 Supernatural Abilities)
  // ============================================================
  power: {
    id: 'power',
    name: 'Power Wheel',
    subtitle: 'The supernatural ability granted by the Almighty Wheel',
    icon: '✨',
    segments: [
      { text: 'Time Stop', subtext: 'Freezes flow of time for 5 seconds', rarity: 'godTier', color: '#06b6d4' },
      { text: 'Reality Warping', subtext: 'Alters physical laws within a 20m radius', rarity: 'godTier', color: '#a855f7' },
      { text: 'Ferrokinesis', subtext: 'Manipulates all metal and weapon alloys', rarity: 'rare', color: '#64748b' },
      { text: 'Pyrokinesis', subtext: 'Infernal hellfire and magma blasts', rarity: 'rare', color: '#dc2626' },
      { text: 'Cryokinesis', subtext: 'Absolute zero frostbite flash freezes', rarity: 'rare', color: '#0284c7' },
      { text: 'Shadow Manipulation', subtext: 'Travels through shadows, binds foes', rarity: 'epic', color: '#4c1d95' },
      { text: 'Instant Teleportation', subtext: 'Zero-latency spatial translocation', rarity: 'epic', color: '#2563eb' },
      { text: 'Power Absorption', subtext: 'Copies one ability from any enemy faced', rarity: 'mythic', color: '#db2777' },
      { text: 'Necromancy', subtext: 'Reanimates fallen foes into loyal thralls', rarity: 'epic', color: '#15803d' },
      { text: 'Acid Generation', subtext: 'Corrosive bile that melts steel', rarity: 'uncommon', color: '#84cc16' },
      { text: 'Gravity Inversion', subtext: 'Flips gravity or crushes enemies with 10G', rarity: 'legendary', color: '#7c3aed' },
      { text: 'Super Regeneration', subtext: 'Heals severed limbs within moments', rarity: 'legendary', color: '#10b981' },
      { text: 'Probability Manipulation', subtext: 'Always rolls critical hits when lucky', rarity: 'mythic', color: '#f59e0b' },
      { text: 'Invisibility & Phasing', subtext: 'Passes harmlessly through solid walls', rarity: 'uncommon', color: '#065f46' },
      { text: 'Precognition', subtext: 'Sees 5 seconds into the immediate future', rarity: 'rare', color: '#0891b2' },
      { text: 'Laser Gaze', subtext: 'High-intensity optical incinerator', rarity: 'uncommon', color: '#ef4444' },
      // --- NEW EXPANDED POWERS ---
      { text: 'Domain Expansion', subtext: 'Traps foe in pocket realm with guaranteed hits', rarity: 'godTier', color: '#581c87' },
      { text: 'Black Hole Singularity', subtext: 'Crushes light, matter, and enemy projectiles', rarity: 'godTier', color: '#0284c7' },
      { text: 'Blood Bending', subtext: 'Forces enemy limbs into self-inflicted strikes', rarity: 'mythic', color: '#991b1b' },
      { text: 'Lightning God Speed', subtext: 'Hypersonic velocity delivering 3 chain strikes', rarity: 'legendary', color: '#eab308' },
      { text: 'Full Counter', subtext: 'Reflects magical attacks back at 200% power', rarity: 'legendary', color: '#10b981' },
      { text: 'Matter Disintegration', subtext: 'Decays enemy weapons and armor on physical touch', rarity: 'mythic', color: '#ec4899' },
      { text: 'Mind Control / Hypnosis', subtext: 'Forces target into paralysis & missed turns', rarity: 'epic', color: '#6366f1' },
      { text: 'Infinite Stamina', subtext: 'Immune to fatigue, stuns, and speed slowing', rarity: 'rare', color: '#0d9488' },
      { text: 'Force Field Barrier', subtext: 'Conjures an impenetrable 150 HP energy bubble', rarity: 'rare', color: '#06b6d4' },
      { text: 'Summon Meteor Strike', subtext: 'Calls down an apocalyptic blazing space rock', rarity: 'mythic', color: '#ea580c' },
      { text: 'Cosmic Erasure', subtext: 'Unravels threads of opponent reality for 300% dmg', rarity: 'godTier', color: '#7c3aed' },
      { text: 'Illusion Phantasm', subtext: 'Spawns 3 mirror images that absorb lethal attacks', rarity: 'epic', color: '#db2777' }
    ]
  },

  // ============================================================
  // 5. WEAKNESS / CURSE WHEEL (22 Curses & Comedic Flaws)
  // ============================================================
  weakness: {
    id: 'weakness',
    name: 'Weakness / Curse Wheel',
    subtitle: 'The comedic or fatal flaw balancing your power',
    icon: '⚠️',
    segments: [
      { text: 'Fragile Bones', subtext: 'Blunt impacts deal 250% critical damage', rarity: 'common', color: '#6b7280' },
      { text: 'Melts in Rain', subtext: 'Water dissolves skin like hot sugar', rarity: 'rare', color: '#0284c7' },
      { text: 'Loud Sneezes', subtext: 'Involuntary supersonic sneezes ruin stealth', rarity: 'common', color: '#ca8a04' },
      { text: 'Extreme Pacifist', subtext: 'Must apologize and bow after every attack', rarity: 'epic', color: '#16a34a' },
      { text: 'Glass Cannon', subtext: 'Deals 500% damage but dies in 1 hit', rarity: 'legendary', color: '#dc2626' },
      { text: 'Bad Luck Aura', subtext: 'Constantly trips on flat surfaces', rarity: 'chaos', color: '#ef4444' },
      { text: 'Allergic to Gold', subtext: 'Touching currency triggers explosive hives', rarity: 'uncommon', color: '#eab308' },
      { text: 'Blind in Left Eye', subtext: '-30% field of view on the left flank', rarity: 'common', color: '#475569' },
      { text: 'Power Drain Timer', subtext: 'Must recharge for 15s after using powers', rarity: 'rare', color: '#7c3aed' },
      { text: 'Compulsive Taunting', subtext: 'Cannot stop monologuing like an anime villain', rarity: 'uncommon', color: '#ec4899' },
      { text: 'Extremely Ticklish', subtext: 'A light feather tap completely immobilizes', rarity: 'common', color: '#f97316' },
      { text: 'Afraid of Small Dogs', subtext: 'Freezes in terror when a puppy barks', rarity: 'chaos', color: '#b91c1c' },
      // --- NEW EXPANDED WEAKNESSES ---
      { text: 'Needs 8 Hours of Sleep', subtext: '15% chance to fall asleep mid-combat', rarity: 'common', color: '#64748b' },
      { text: 'Monologues When Winning', subtext: 'Refuses to finish enemies without boasting', rarity: 'uncommon', color: '#f59e0b' },
      { text: 'Cannot Fight Without Music', subtext: 'Loses 40% accuracy if arena is quiet', rarity: 'rare', color: '#ec4899' },
      { text: 'Motion Sickness', subtext: 'Gets dizzy and staggers after rapid moves', rarity: 'common', color: '#10b981' },
      { text: 'Overthinks Every Move', subtext: 'Analyzes 10,000 timelines, missing attack turns', rarity: 'uncommon', color: '#6366f1' },
      { text: 'Low Pain Tolerance', subtext: 'Screams dramatically and drops guard when grazed', rarity: 'common', color: '#ef4444' },
      { text: 'Always Announces Attack', subtext: 'Shouts anime move names, boosting enemy dodge', rarity: 'chaos', color: '#f97316' },
      { text: 'Severe Caffeine Withdrawal', subtext: 'Sluggish reflexes until arena coffee arrives', rarity: 'common', color: '#78350f' },
      { text: 'Distracted by Shiny Objects', subtext: 'Stops combat to inspect glittering loot', rarity: 'uncommon', color: '#eab308' },
      { text: 'Vegetarian Guilt', subtext: 'Hesitates and sheds tears against beast companions', rarity: 'rare', color: '#16a34a' }
    ]
  },

  // ============================================================
  // 6. BACKSTORY & CHAOS WHEEL (20 Origins & Twists)
  // ============================================================
  backstory: {
    id: 'backstory',
    name: 'Backstory & Chaos Wheel',
    subtitle: 'The cosmic twist or origin that forged your destiny',
    icon: '📜',
    segments: [
      { text: 'Chaos Inversion', subtext: 'All your weakest stats are inverted to Max!', rarity: 'chaos', color: '#ef4444' },
      { text: "Creator's Pity", subtext: 'Bushin himself intervenes with a bonus blessing', rarity: 'mythic', color: '#8b5cf6' },
      { text: 'Fourth Wall Breaker', subtext: 'Aware of TikTok, Instagram, and the RNG wheel', rarity: 'godTier', color: '#06b6d4' },
      { text: 'Royal Reincarnation', subtext: 'Former Emperor reborn with noble battle memories', rarity: 'legendary', color: '#eab308' },
      { text: 'Lab Experiment #09', subtext: 'Engineered in secret, escaped military clutches', rarity: 'rare', color: '#10b981' },
      { text: 'Gladiator Champion', subtext: 'Survived 100 consecutive arena deathmatches', rarity: 'epic', color: '#dc2626' },
      { text: 'Cursed Village Survivor', subtext: 'Sole survivor of an ancient demon plague', rarity: 'uncommon', color: '#475569' },
      { text: "Isekai'd Salaryman", subtext: 'Hit by truck, now confused why they have swords', rarity: 'chaos', color: '#f59e0b' },
      { text: 'Forgotten God Slumber', subtext: 'A dormant deity slowly awakening to power', rarity: 'mythic', color: '#ec4899' },
      { text: 'Street Urchin Gambler', subtext: 'Survived on dice, alley brawls, and quick wits', rarity: 'common', color: '#6b7280' },
      // --- NEW EXPANDED BACKSTORIES & CHAOS TWISTS ---
      { text: 'Reborn Anime Protagonist', subtext: 'Unstoppable shonen plot armor when fighting at low HP', rarity: 'godTier', color: '#ea580c' },
      { text: 'Escaped SCP Anomaly', subtext: 'Euclid-class entity with reality-glitching aura', rarity: 'mythic', color: '#dc2626' },
      { text: 'Time Traveler from 3000', subtext: 'Equipped with a futuristic tactical heads-up display', rarity: 'epic', color: '#06b6d4' },
      { text: 'Adopted by Elder Dragon', subtext: 'Immune to all fire and emits an apex predator roar', rarity: 'legendary', color: '#b45309' },
      { text: 'Won the Cosmic Lottery', subtext: 'Ludicrous fortune: all critical strikes deal 250% damage', rarity: 'legendary', color: '#f59e0b' },
      { text: 'Glitch in the Multiverse', subtext: 'Randomly swaps stats with opponent when heavily damaged', rarity: 'chaos', color: '#9333ea' },
      { text: 'Banished Archangel', subtext: 'Fallen from the celestial realm, seeking arena redemption', rarity: 'epic', color: '#38bdf8' },
      { text: 'Sentient Meme Come to Life', subtext: 'Inflicts chaotic brainrot audio waves that confuse enemies', rarity: 'chaos', color: '#f43f5e' },
      { text: 'Sole Survivor of Star Collapse', subtext: 'Infused with the thermonuclear remnants of a supernova', rarity: 'mythic', color: '#7c3aed' },
      { text: 'Vengeful Disciple', subtext: 'Sworn to avenge fallen master; immune to fear and stuns', rarity: 'rare', color: '#475569' }
    ]
  },

  // ============================================================
  // 7. COMBAT RATING WHEEL (8 Tiers)
  // ============================================================
  stats: {
    id: 'stats',
    name: 'Combat Rating Wheel',
    subtitle: 'Spins for overall combat tier and potential',
    icon: '📊',
    segments: [
      { text: 'Rank E - Peasant', subtext: 'Combat Rating: 15-30', rarity: 'common', color: '#4b5563', rank: 'E', mult: 0.5 },
      { text: 'Rank D - Soldier', subtext: 'Combat Rating: 31-50', rarity: 'common', color: '#6b7280', rank: 'D', mult: 0.8 },
      { text: 'Rank C - Veteran', subtext: 'Combat Rating: 51-70', rarity: 'uncommon', color: '#16a34a', rank: 'C', mult: 1.0 },
      { text: 'Rank B - Elite Warrior', subtext: 'Combat Rating: 71-85', rarity: 'rare', color: '#2563eb', rank: 'B', mult: 1.3 },
      { text: 'Rank A - Champion', subtext: 'Combat Rating: 86-95', rarity: 'epic', color: '#7c3aed', rank: 'A', mult: 1.6 },
      { text: 'Rank S - Calamity Tier', subtext: 'Combat Rating: 96-120', rarity: 'legendary', color: '#d97706', rank: 'S', mult: 2.0 },
      { text: 'Rank SS - Demigod', subtext: 'Combat Rating: 121-150', rarity: 'mythic', color: '#db2777', rank: 'SS', mult: 2.5 },
      { text: 'Rank EX - God of the Arena', subtext: 'Combat Rating: 151-200+', rarity: 'godTier', color: '#06b6d4', rank: 'EX', mult: 3.2 }
    ]
  },

  // ============================================================
  // 8. LEVEL-UP & EVOLUTION WHEEL (26 Comprehensive Upgrades)
  // ============================================================
  levelUp: {
    id: 'levelUp',
    name: 'WOF Arena Level-Up Wheel',
    subtitle: 'Upgrade attributes, forge divine enchants, and awaken god-tier mutations!',
    icon: '⚡',
    segments: [
      { text: '+20 Strength', subtext: 'Raw physical power boosted', rarity: 'common', color: '#dc2626', effect: { type: 'stat', stat: 'str', amount: 20 } },
      { text: '+25 Speed', subtext: 'Reflexes & agility upgraded', rarity: 'common', color: '#0284c7', effect: { type: 'stat', stat: 'spd', amount: 25 } },
      { text: '+30 Durability', subtext: 'HP & skin density reinforced', rarity: 'common', color: '#16a34a', effect: { type: 'stat', stat: 'dur', amount: 30 } },
      { text: '+20 Intelligence', subtext: 'Combat IQ & tactics improved', rarity: 'common', color: '#7c3aed', effect: { type: 'stat', stat: 'int', amount: 20 } },
      { text: 'Weapon Enchant: Flame', subtext: 'Hellfire burn damage on every strike', rarity: 'rare', color: '#ea580c', effect: { type: 'enchant', name: 'Infernal Flame' } },
      { text: 'Weapon Enchant: Void', subtext: 'Siphons 15% life essence on hit', rarity: 'epic', color: '#581c87', effect: { type: 'enchant', name: 'Void Siphon' } },
      { text: 'Weapon Enchant: Thunder', subtext: 'Chain lightning arcs across hits', rarity: 'rare', color: '#eab308', effect: { type: 'enchant', name: 'Thunder Arc' } },
      { text: 'Unlock 2nd Power!', subtext: 'Gain a completely fresh supernatural power roll!', rarity: 'legendary', color: '#db2777', effect: { type: 'secondPower' } },
      { text: 'Calamity Awakening', subtext: 'All combat stats multiplied by x1.5!', rarity: 'mythic', color: '#f59e0b', effect: { type: 'multiplier', mult: 1.5 } },
      { text: 'Purge Curse', subtext: 'Your weakness is cleansed by the Almighty Wheel!', rarity: 'rare', color: '#10b981', effect: { type: 'purgeWeakness' } },
      { text: 'Chaos Mutation', subtext: 'Gain +45 Chaos, +30 Strength & (Ascended) title', rarity: 'godTier', color: '#06b6d4', effect: { type: 'chaosMutation' } },
      // --- NEW EXPANDED LEVEL-UP UPGRADES ---
      { text: '+35 Strength (Overdrive)', subtext: 'Massive physical power surge (+35 STR)', rarity: 'rare', color: '#b91c1c', effect: { type: 'stat', stat: 'str', amount: 35 } },
      { text: '+35 Speed (Sonic Reflexes)', subtext: 'Lightning combat initiative (+35 SPD)', rarity: 'rare', color: '#0284c7', effect: { type: 'stat', stat: 'spd', amount: 35 } },
      { text: '+40 Durability (Titanium Plating)', subtext: 'Colossal HP & heavy armor pool (+40 DUR)', rarity: 'rare', color: '#047857', effect: { type: 'stat', stat: 'dur', amount: 40 } },
      { text: '+35 Intelligence (Grandmaster)', subtext: 'Tactical foresight & crit rate (+35 INT)', rarity: 'rare', color: '#6d28d9', effect: { type: 'stat', stat: 'int', amount: 35 } },
      { text: '+45 Chaos (Glitch Overdrive)', subtext: 'Extreme miracle wildcard procs (+45 CHAOS)', rarity: 'epic', color: '#e11d48', effect: { type: 'stat', stat: 'chaos', amount: 45 } },
      { text: 'Weapon Enchant: Frostbite', subtext: 'Freezes opponents solid on melee strike', rarity: 'epic', color: '#06b6d4', effect: { type: 'enchant', name: 'Frostbite Freeze' } },
      { text: 'Weapon Enchant: Radiant Holy', subtext: '+50% executioner damage to demons & undead', rarity: 'epic', color: '#facc15', effect: { type: 'enchant', name: 'Radiant Holy' } },
      { text: 'Weapon Enchant: Toxic Venom', subtext: 'Stacks corrosive neurotoxin damage over time', rarity: 'rare', color: '#84cc16', effect: { type: 'enchant', name: 'Toxic Neurotoxin' } },
      { text: 'Weapon Enchant: Spacetime Rend', subtext: 'Attacks bypass 100% of enemy durability armor', rarity: 'godTier', color: '#a855f7', effect: { type: 'enchant', name: 'Spacetime Rend' } },
      { text: 'Weapon Enchant: Lifesteal Berserk', subtext: 'Heals 25% of all damage dealt in battle', rarity: 'legendary', color: '#be123c', effect: { type: 'enchant', name: 'Lifesteal Berserk' } },
      { text: 'Unlock 3rd Power (Trinity)!', subtext: 'Gain a 3rd simultaneous supernatural power!', rarity: 'godTier', color: '#ec4899', effect: { type: 'thirdPower' } },
      { text: 'Limit Break: Super Saiyan Aura', subtext: 'All baseline attributes increased by +30%!', rarity: 'legendary', color: '#eab308', effect: { type: 'multiplier', mult: 1.3 } },
      { text: 'Invert Curse into Blessing', subtext: 'Transforms your flaw into an overpowered buff!', rarity: 'godTier', color: '#10b981', effect: { type: 'invertCurse' } },
      { text: 'Demigod Ascendance', subtext: 'Level leaps by +2 and claims Demigod status', rarity: 'mythic', color: '#6366f1', effect: { type: 'ascendDemigod' } },
      { text: 'Indomitable Will', subtext: 'Survives fatal blows with 1 HP once per match', rarity: 'epic', color: '#f97316', effect: { type: 'indomitableWill' } },
      { text: 'Double Strike Mastery', subtext: '30% chance to attack twice on every turn', rarity: 'legendary', color: '#14b8a6', effect: { type: 'doubleStrike' } }
    ]
  }
};

/**
 * COMPREHENSIVE TRAIT & EFFECT DESCRIPTIONS
 * Provides clear, lore-accurate, and mechanical explanations of what every trait,
 * power, weapon, weakness, archetype, and chaos factor does in combat and lore.
 */
const TRAIT_DESCRIPTIONS = {
  backstory: {
    'Chaos Inversion': 'Reality Inversion: Every baseline combat stat rolled under 60 is mathematically inverted into a God-Tier rating between 110 and 135! The ultimate comeback trait that transforms frail mortals into arena colossi.',
    "Creator's Pity": "Bushin's Direct Intervention: The creator himself intervenes in the RNG sequence, bestowing a protective aegis (+30 Durability) and saving the fighter from lethal damage once.",
    'Fourth Wall Breaker': 'Metaphysical Omniscience: Fully aware they are inside Bushin’s TikTok & Instagram reels and the WOF Arena game. Can appeal directly to viewers for combat morale and break turn restrictions.',
    'Royal Reincarnation': 'Ancient Sovereign Soul: Reborn former emperor possessing legendary tactical memories. Starts all arena battles with +25% Critical Strike chance and regal poise.',
    'Lab Experiment #09': 'Engineered Cyber-Mutation: Genetically spliced with apex alien DNA in an illicit facility. Increases Speed by +40 and grants absolute immunity to poison, acid, and burn status effects.',
    'Gladiator Champion': 'Colosseum Veteran: Survived 100 consecutive arena deathmatches. Gains +25% Attack damage whenever fighting below 50% health.',
    'Cursed Village Survivor': 'Demon Blight Survivor: The lone survivor of an infernal plague. Possesses innate resistance against dark magic and immunity to fear and panic.',
    "Isekai'd Salaryman": 'Transdimensional Accident: Hit by Truck-kun while doing taxes, dropped into the WoF Arena with wildly unpredictable luck and random comedic plot armor.',
    'Forgotten God Slumber': 'Dormant Primordial Divinity: An ancient deity sealed in mortal flesh. When HP falls under 20%, awakens a divine aura that unleashes a blast of celestial energy.',
    'Street Urchin Gambler': 'Alleyway Dice Tactician: Survived on quick wits and loaded dice. High dodge agility and steals an enemy’s positive buff whenever landing a critical hit.',
    // New
    'Reborn Anime Protagonist': 'Shonen Plot Armor: When health falls below 25%, triggers an epic flashback that boosts Attack by +60% and guarantees critical strikes on the next 2 turns.',
    'Escaped SCP Anomaly': 'Reality Glitch Aura: The fighter warps localized spacetime, causing enemy attack formulas to glitch randomly and reducing incoming projectile damage by 40%.',
    'Time Traveler from 3000': 'Cybernetic Foresight: Equipped with a holographic tactical HUD that calculates enemy moves 3 steps ahead, increasing Evasion by +25% and Accuracy to 100%.',
    'Adopted by Elder Dragon': 'Draconic Roar & Fireproof: Raised in molten volcanic caverns. Immune to burn and fire damage, and begins combat with a terrifying roar that lowers enemy defense by 20%.',
    'Won the Cosmic Lottery': 'Absurd Fortune: Blessed by lady luck herself. Critical hits deal 250% damage instead of 185%, and has a 20% chance to completely negate incoming damage.',
    'Glitch in the Multiverse': 'Dimensional Swapper: When reduced below 30% HP, glitches and swaps health percentages with the healthiest opponent in the arena once per duel.',
    'Banished Archangel': 'Fallen Radiance: Cast down from the heavens; retains divine celestial wings (+35 Speed) and seeks colosseum glory to reclaim their heavenly throne.',
    'Sentient Meme Come to Life': 'Internet Brainrot Waves: Bizarre digital entity that emits distorted TikTok & Instagram meme audio, confusing enemy AI into attacking empty space.',
    'Sole Survivor of Star Collapse': 'Thermonuclear Core: Infused with the dying energy of a collapsed stellar core. Basic strikes radiate blinding solar radiation that melts enemy shields.',
    'Vengeful Disciple': 'Unyielding Vendetta: Fights to avenge their fallen dojo master. Immune to psychological fear, taunts, and stuns; deals +20% damage against high-rank opponents.'
  },

  weakness: {
    'Fragile Bones': 'Brittle Skeletal Structure: Takes 2.2x amplified damage from blunt impacts, warhammers, bricks, and crowbars.',
    'Melts in Rain': 'Severe Hydrophobia: Skin dissolves rapidly when exposed to rain, water, or oceanic elemental attacks.',
    'Loud Sneezes': 'Supersonic Sneeze Reflex: 16% chance per turn to sneeze with deafening force, completely breaking combat focus and skipping the turn.',
    'Extreme Pacifist': 'Compulsive Apology: Refuses to inflict unnecessary pain on turn 1, dealing only 1 damage while apologizing to the opponent.',
    'Glass Cannon': 'Extreme Fragility: Max HP is capped at just 35 HP, but physical and magical attack damage is amplified by 400%!',
    'Bad Luck Aura': 'Cursed Misfortune: 14% chance per turn to stumble over flat arena ground and inflict self-damage.',
    'Allergic to Gold': 'Treasure Anaphylaxis: Touching golden coins, armor, or relics triggers violent sneezing and distraction.',
    'Blind in Left Eye': 'Flank Vulnerability: 30% reduced visual awareness on the left flank, lowering evasion against counter-attacks.',
    'Power Drain Timer': 'Energy Burnout: Supernatural powers demand massive stamina, forcing a 1-turn recharge pause after unleashing special abilities.',
    'Compulsive Taunting': 'Villain Monologue Syndrome: 15% chance to halt combat to deliver a theatrical speech, leaving themselves open to counter-attacks.',
    'Extremely Ticklish': 'Sensory Overload: A light touch or feather tap completely breaks combat stance and induces helpless laughter.',
    'Afraid of Small Dogs': 'Canine Phobia: Freezes in psychological dread whenever fighting beast companions or hearing canine barks.',
    'Purged by the Wheel': 'Curse Cleansed: The Almighty Wheel of Faith has eradicated this hero’s weakness, leaving them unhindered!',
    // New
    'Needs 8 Hours of Sleep': 'Sleep Deprivation: 15% chance to yawn and fall asleep mid-turn, becoming completely vulnerable for one turn.',
    'Monologues When Winning': 'Overconfident Showboat: When an enemy is below 25% health, refuses to strike and instead delivers a victory speech.',
    'Cannot Fight Without Music': 'Rhythm Dependency: Needs battle beats to find their groove; without music or battle drums, combat accuracy is reduced by 35%.',
    'Motion Sickness': 'Vertigo Debuff: Whenever moving faster than 100 SPD or dodging consecutive strikes, becomes dizzy and staggered for 1 turn.',
    'Overthinks Every Move': 'Analysis Paralysis: Spends excessive time calculating chess moves; initiative is delayed and has a 12% chance to skip turn 1.',
    'Low Pain Tolerance': 'Drama King Reflex: Even light scrapes cause loud screams of agony, dropping physical armor by 25% on subsequent hits.',
    'Always Announces Attack': 'Anime Shouting Syndrome: Shouts attack names at the top of their lungs, giving enemies early warning and boosting enemy dodge rate.',
    'Severe Caffeine Withdrawal': 'Morning Fog: Starts round 1 with -30 Speed until the adrenaline rush of arena battle finally wakes them up.',
    'Distracted by Shiny Objects': 'Magpie Complex: Will stop fighting for a turn if a sparkling golden weapon or jewel catches their eye.',
    'Vegetarian Guilt': 'Animal Empath: Deals 50% reduced damage against Tamers, wolves, chimeras, or any beast-based fighters.'
  },

  race: {
    'Dragon Slayer': 'Wyrm Hunter Heritage: Trained specifically in ancient anti-dragon martial forms. Naturally resistant to elemental breath and gains +35% armor penetration against scale and heavy beast armor.',
    'Devil (7 Sins)': 'Infernal Deadly Sin Avatar: Channeler of one of the 7 capital sins. Gains devastating passive stat bonuses and dark hellfire enhancements that overwhelm pure mortal warriors.',
    'God / Primordial': 'Cosmic Deity Transcendent: Embodiment of a universal concept or divine pantheon. Possesses near-infinite combat potential (+45 All Stats) and reality-bending domain authority.',
    'Animorph': 'Adaptive Beast Shifter: Capable of mutating biological forms mid-combat to counter opponent weapon ranges and elemental properties.',
    'Giant': 'Colossal Titan Physiology: Massive stone/terrestrial mass (+50 Durability, +40 Strength, -20 Speed). Unstoppable heavy swings that shatter enemy footing.',
    'Golem': 'Construct Frame: Inanimate body of animated clay, stone, iron, diamond, or obsidian. Immune to bleeding, poison, and mental panic.',
    'Hive Mind': 'Swarm Consciousness: Billions of interconnected organisms. Physical attacks only destroy a fraction of the swarm, giving 35% passive damage mitigation.',
    'Mythical Beast': 'Apex Mythological Creature: The ferocity of legendary monsters (Nemean Lion, Phoenix, Cerberus, Leviathan). High raw stats and innate mythological auras.',
    'Dryad': 'Primeval Nature Spirit: Birthed from sacred groves and celestial alignments. Passive health regeneration and root entanglements when fighting on earth.',
    'Merfolk': 'Aquatic Sovereign: Fluid agility and hydrokinetic mastery (+30 SPD, +25 INT). Can summon ocean torrents to disorient and drown enemy fire.',
    'Reincarnation / Spirit': 'Past Champion Rebirth: Hosts the awakened combat instincts of past tournament GOATs (Achilles, Joe, Sammy, Darwizzy). Starts duels with max tactical IQ.',
    'Human': 'Adaptable Multiverse Benchmark: Balanced baseline with limitless potential. Adapts to all weapon types and scales with any archetype.',
    'Elf': 'Graceful Arcane Lineage: Innate rizz and agility (+35 SPD, +25 INT). High affinity for magical spell fusion and sub-races.',
    'Dwarf': 'Anti-Magic Forge Master: Heavy armored tank (+40 DUR, +25 STR). Immune to magical curses and forges superior gear.',
    'Demon': 'Infernal Hellion: Raw destructive force (+35 STR, +30 CHAOS). Unleashes hellfire attacks and feeds on enemy dread.',
    'Angel': 'Celestial Sovereign: Holy radiance and winged mobility (+30 SPD, +25 DUR, +25 INT). Immune to blind effects.',
    'Werewolf': 'Apex Beast Predator: Feral claws and moon rage (+30 STR, +25 SPD). Becomes deadlier as the duel progresses.',
    'Orc': 'Brutal Warlord Blood: Immense bone density (+35 STR, +30 DUR). Immune to knockback and staggering blows.',
    'Android': 'Cybernetic Calculation: Precision titanium chassis (+45 INT, +30 DUR). Calculates enemy weak points for high accuracy.',
    'Vampire': 'Night Sovereign: Aristocratic blood magic (+30 STR, +25 SPD). Siphons life essence on melee strikes.',
    'Elemental': 'Living Calamity: Natural disaster incarnate (+40 CHAOS, +25 STR). Radiates elemental aura and ignores physical punctures.',
    'Skeleton': 'Chaotic Bone Entity: Goofy yet unnerving (+35 CHAOS, +15 SPD). Immune to bleeding, but susceptible to blunt force.',
    'Fairy': 'Fey Court Menace: Microscopic elusive hitbox. Bestowed with multiple simultaneous powers by the Fey royalty.',
    'Goblin': 'Gremlin Alchemist: Scrappy, inventive, and chaotic (+30 CHAOS). Specializes in dirty tricks and improvised explosives.',
    'Siren': 'Abyssal Hypnotist: Mesmerizing oceanic voice. Can charm foes into hesitation and controls tidal water.',
    'Dragonkin': 'Draconic Nobility: Ancient scaled pride (+40 STR, +35 DUR). Resistant to all elemental fire and breathes destructive energy.',
    'Cosmic Warrior': 'Galactic Conqueror: Transcends planetary barriers (+50 STR, +40 SPD, +40 DUR, +40 INT). Sovereign of starfields.',
    'Nucleite': 'Radioisotope Cataclysm: Glowing radioactive hazard (+60 CHAOS, +35 DUR). Emits decaying radiation that melts armor.',
    // New
    'Shadow Monarch': 'Sovereign of the Dead: Born from the primordial abyss (+45 STR, +35 SPD, +30 INT). Defeated foes rise as shadow minions.',
    'Phoenixkin': 'Eternal Solar Avian: Wreathed in immortal holy flame (+35 SPD, +30 DUR, +30 INT). Automatically revives with 40% HP upon first death.',
    'Nephilim': 'Holy & Infernal Hybrid: Possesses one angelic wing and one demonic wing (+40 STR, +35 SPD). Wields holy smite and hellfire simultaneously.',
    'Cyborg Titan': 'Hydraulic Behemoth: Massive mechanical exoskeleton (+55 DUR, +40 STR, -15 SPD). Immune to critical hits and bladed slashes.',
    'Voidwalker': 'Spatial Nomad: Shifts through dimensional seams (+45 SPD, +30 INT). 30% passive chance to phase through enemy melee strikes.',
    'Slime Sovereign': 'Elastic Gelatin: Non-Newtonian fluid body (+50 DUR, +30 CHAOS). Absorbs 70% of physical bludgeoning and crushing damage.',
    'Eldritch Entity': 'Cosmic Nightmare: Beyond mortal comprehension (+65 CHAOS, +40 INT, +35 STR). Drives enemies into panic and confuses targeting.',
    'Djinn (Genie)': 'Primordial Ether Weaver: Free-floating spirit (+40 INT, +35 SPD). Bends battlefield elements and deflects projectile spells.',
    'Beastfolk Chimera': 'Apex Predator: Blends instincts of lions, eagles, and vipers (+35 STR, +35 SPD). Inflicts severe bleeding lacerations.',
    'Gargoyle': 'Living Obsidian: Carved from ancient cathedral stone (+60 DUR, +25 STR, -20 SPD). Completely immune to poison, bleed, and fire.',
    'Insectoid Hivemaster': 'Chitin Warlord: Hardened exoskeleton with compound eyes (+35 SPD, +35 DUR). Anticipates flanks and commands swarms.',
    'Demi-God': 'Divine Bloodline: Son or daughter of Olympus (+45 STR, +35 DUR, +30 INT). Starts combat surrounded by a shimmering aegis.',
    'Homunculus': 'Vat-Grown Prodigy: Artificially engineered organism (+40 INT, +30 CHAOS). Adapts resistances against whatever damage type hit it last.',
    'Astral Seraph': 'Higher-Dimensional Light: Manifestation of pure celestial authority (+50 INT, +40 SPD, +30 DUR). Pierces magical forcefields.',
    'Living Armor': 'Ghost Steel Guardian: Autonomous enchanted plate armor (+50 DUR, +30 STR). Immune to headshots, pain, and life-drain effects.'
  },

  archetype: {
    'Cursed / Cultist': 'Forbidden Arcana Channeler: Sacrifices mortal safety to brand dark demonic techniques into the arena, unleashing hellfire, necrosis, and soul drain.',
    'Goliath': 'Defensive Exosuit Juggernaut: Equips massive specialized armor plates (Darwinite, Dragon Scale, Void Fortress) that absorb colossal punishment.',
    'Cloaked (Ninja)': 'Shadow Infiltration Specialist: Masters silent movement, smoke decoys, and critical ambush strikes that bypass 50% of enemy armor.',
    'Priest': 'High Cleric of Deific Domains: Channels blessings of War, Wisdom, Sun, or Thunder to cleanse debuffs and smite opponents with holy fury.',
    'Pirate': 'High-Seas Marauder: Ruthless naval combatant that loots fallen weapons and gains +2 Weapon Mastery with heavy broadside attacks.',
    'Gladiator': 'Blood-and-Sand Veteran: Masters bare-knuckle combat, beast mutations, or relic weaponry with ferocious low-HP attack multipliers.',
    'Spirit Weaver': 'Spectral Artisan: Weaves ancestral phantom blades and spirit armor into physical combat, gaining extra power slots and protection.',
    'Mutant': 'Biophysical Anomaly: Mutates cellular anomalies (Quantum manipulation, Kinetic absorption, Runic flesh) that grant supernatural adaptations.',
    'Resilient': 'Bad-Luck Protection: If any core attribute rolls below Peak Human (4/10), the warrior automatically re-spins that attribute until it reaches greatness!',
    'Royal': 'Sovereign Authority: Noble monarchs commanding imperial poise, battlefield leadership, and devastating royal decree stat buffs.',
    'Apostle': 'Reality-Bending Philosopher: Adheres to absolute philosophical creeds (Existentialism, Determinism, Daoism) that alter the rules of combat.',
    'Primordial Champion': 'Hand of the Universal Constants: Anointed champion of Time, Eternity, Reality, or Void; commands divine reality-warping strikes.',
    "Champion's Legacy": "Heir to the GOATs: Fights under the banner of legendary tournament winners (Ethan's Weapon Mimic, Musam's Steaming Honeybun, Boodro's Fortitude).",
    'Hybrid': 'Dual Archetype Master: Rare prodigy possessing two distinct tactical archetypes simultaneously, fusing their perks and playstyles.',
    'Slayer': 'Prey Specialist: Inflicts 180% executioner damage against designated prey races (Gods, Demons, Dragons, Undead, Mortals).',
    'Archaeologist': 'Relic Master: Unearths ancient primordial artifacts that manipulate spacetime, gravity, and brute force.',
    'Equaliser': 'Divine Balance: Forces god-tier and demigod opponents down to equal mortal stats, leveling the playing field.',
    'Paladin': 'Holy Bastion: Surrounded by an impenetrable holy ward that permanently reduces all incoming damage by 30%.',
    'Berserker': 'Rage Multiplier: Attack power scales up to +90% as remaining health drops towards zero.',
    'Mage': 'Arcane Catalyst: Channels destructive elemental spell bursts and magical projectiles that pierce armor.',
    'Assassin': 'Shadow Executioner: Extreme speed and shadow stepping. Deals devastating critical strikes from stealth.',
    'Support / Healer': 'Vital Restorer: Innate cellular regeneration that recovers from lethal damage and cleanses status debuffs.',
    'Tamer': 'Beastmaster: Fights accompanied by a vicious monster companion that attacks alongside the hero.',
    'Alchemist': 'Battle Concoctionist: Chugs mutagenic elixirs for adrenaline bursts, diamond skin, or acidic blood.',
    'Martial Artist': 'Kinetic Flow: Bare knuckles deflect incoming weapon strikes and counter-attack with kinetic shockwaves.',
    'Joke / NPC': 'Unexplainable Plot Armor: Survives catastrophic attacks through pure slapstick comedy and bizarre luck.',
    'Chaos Incarnate': 'Rule Distorter: Randomly scrambles damage formulas and alters the reality of combat.',
    'Trickster': 'Illusion Weaver: Deploys mirror clones and confuses enemy targeting, forcing missed attacks.',
    // New
    'Necromancer': 'Soul Siphon & Bone Thralls: Commands the spirits of the underworld. Heals for 20% of all damage dealt and revives fallen allies.',
    'Gunslinger / Deadeye': 'Supersonic Quickdraw: Always takes the first turn in battle; critical strikes inflict bleeding bullet wounds.',
    'Time Warden': 'Chrono-Tactician: Manipulates the flow of battle, gaining an extra turn every 3 rounds and slowing enemy actions.',
    'Dragon Knight': 'Wyrm Lancer: Infuses heavy halberds and blades with dragon breath, delivering burning AoE shockwaves.',
    'Shadow Monarch': 'Umbral Overlord: Summons shadow warriors from darkness that strike alongside the hero on every attack.',
    'Brawler / Pugilist': 'Unbreakable Grit: Converts incoming blunt damage into adrenaline attack power; counters critical strikes instantly.',
    'Cosmic Inquisitor': 'Purifier of the Multiverse: Strips away enemy invulnerability, shields, and supernatural copy abilities.',
    'Bard / Battle Rocker': 'Heavy Metal Shockwaves: Plays crushing arena riffs that disorient enemies, forcing them to miss 25% of their attacks.'
  },

  weapon: {
    'Starshard Bow': 'Fires crystallized starlight arrows that ignore magical barriers and hit from long range.',
    'Voidbreaker Maul': 'Heavy gravity-crushing warhammer. Shatters bone density and triggers shockwaves on impact.',
    'Skyrender Axe': 'Colossal storm greataxe that cleaves through wind barriers and parrying shields.',
    "Thor's Hammer": 'ETF’s Divine Relic: +45% attack power with chain lightning bolts arcing across strikes.',
    'Thunderous Thunderbolt': 'Dominio’s Sacred Javelin: Pierces all physical defenses with 100% armor penetration.',
    'Dragonheart Shield': 'Forged from an elder dragon core. Absorbs 90% of incoming elemental fire and breath damage.',
    'Soulchain Flail': 'Barbed spectral flail that leeches 15% life essence on every successful hit.',
    'Muramasa Katana': 'Bloodthirsty cursed blade that inflicts severe bleeding damage over time.',
    'Dual Plasma Pistols': 'High-velocity overheat blasters delivering rapid energy bolts with armor burning.',
    'Scythe of Eternity': 'Cuts through the opponent’s timeline, inflicting existential unmaking damage.',
    'Titanium Crowbar': 'Pragmatic, heavy, and lethal. Classic WoF blunt weapon that shatters brittle defenses.',
    'Spatula With Lemon Juice': 'Bushin’s Infamous Meme Weapon: Burns the opponent’s eyes and inflicts the Blinded status effect!',
    'Enchanted Brick': 'Pure kinetic force. Guided by fate, this brick never misses and bypasses armor!',
    'Slipper of Doom': 'Strikes psychological terror into gods and mortals alike, disrupting attack focus.',
    'Adamantine Greatsword': 'Massive broadsword that breaks enemy guards and balance.',
    'Twin Daggers of Venom': 'Coated in lethal neurotoxin that stacks progressive poison damage.',
    // New
    'Excalibur': 'Holy Blade of Promised Victory: Concentrates divine starlight into a devastating laser slash that disintegrates darkness.',
    'Stormbreaker': 'Bifrost-Cleaving Axe: Cosmic greataxe that summons lightning storms and grants the wielder unyielding momentum.',
    'Nodachi of the Black Void': 'Dimensional Katana: Colossal two-handed blade that cuts through spatial rifts, striking from impossible angles.',
    'Guillotine Greatsword': 'Executioner Slab: Enormous razor slab that completely breaks enemy shield guards and inflicts crushing stagger.',
    'Dual Golden Desert Eagles': 'Divine Handcannons: Fires blessed holy ammunition with supersonic recoil and explosive armor penetration.',
    'Nokia 3310 on a Chain': 'Bushin’s Indestructible Flail: Harder than vibranium and neutron stars; deals 200% blunt damage to fragile bones.',
    'Folding Steel Chair': 'WWE Colosseum Icon: Unblockable pro-wrestling headshot that has a 30% chance to stun and daze the opponent.',
    'Cursed French Baguette': 'Rock-Hard Bread of Doom: Stale French bread harder than tungsten carbide; deals comical yet catastrophic blunt trauma.',
    'Chihuahua on a Leash': 'Feral Canine Chaos: Terrifies opponents with supersonic high-pitched barks and relentlessly bites ankles for stacking bleed.',
    'Gungnir (Spear of Odin)': 'Fate Javelin: Ancient divine spear bound by Norse oaths; once thrown, it bends trajectory and never misses.',
    'Quantum Railgun': 'Electromagnetic Sniper: Fires depleted uranium slugs at Mach 8, vaporizing energy shields instantly.',
    'Staff of the Cosmic Archmage': 'Spell Amplifier: Channels primordial leylines, increasing supernatural ability activation rate by 300%.',
    'Chakrams of the Eclipse': 'Ricocheting Blades: Twin solar and lunar crescent rings that bounce between multiple foes in the arena.',
    'Death Harvester Scythe': 'Soul Reaper: Pierces through physical flesh directly into the soul tether, restoring health when killing foes.',
    'Leviathan Harpoon': 'Abyssal Harpoon: Barbed oceanic javelin with a heavy chain that drags elusive ranged enemies into point-blank melee.',
    'Laser Broadsword': 'Photon Edge: High-frequency coherent plasma blade that effortlessly slices through titanium and magical barriers.',
    'Sledgehammer of Justice': 'Groundpounder: Massive industrial hammer that triggers localized seismic earthquakes on impact.',
    'God-Slaying Kusarigama': 'Reaper Sickle & Chain: Entangles enemy weapons with weighted chains while executing precise throat slashes.',
    'Rubber Chicken of Torment': 'Psychological Warfare: Squeaks with ear-shattering pitch on every strike, infuriating enemies into reckless mistakes.',
    'Dual Energy Chakrams': 'Solar Sawblades: Spinning plasma discs that carve through incoming projectiles and shred enemy defenses.'
  },

  power: {
    'Time Stop': 'Chronokinesis: 22% chance per turn to freeze the opponent in spacetime, gaining consecutive free strikes.',
    'Reality Warping': 'Spacetime Distortion: 25% chance to double attack damage or invert an incoming enemy strike into healing.',
    'Ferrokinesis': 'Metal Manipulation: Bends enemy metal blades and crushes metallic armor from a distance.',
    'Pyrokinesis': 'Hellfire Mastery: Conjures blazing infernos dealing fire damage and applying burning DOT.',
    'Cryokinesis': 'Absolute Zero: Freezes the target solid, immobilizing them for an entire combat round.',
    'Shadow Manipulation': 'Umbral Rift: Travels through shadows to flank behind opponents and strike from darkness.',
    'Instant Teleportation': 'Spatial Translocation: 32% chance to translocate away and completely evade incoming strikes.',
    'Power Absorption': 'Mimicry: Copies the signature supernatural ability of any opponent faced in the arena.',
    'Necromancy': 'Death Defiance: Upon death, revives once from the grave as an Undead Lich Lord with 38% HP.',
    'Acid Generation': 'Corrosive Secretion: Spits caustic bile that permanently degrades enemy armor and durability.',
    'Gravity Inversion': 'Gravitational Force: Flips gravity or crushes foes beneath 10G planetary pressure.',
    'Super Regeneration': 'Cellular Rebirth: When falling below 30% HP, instantly regenerates 32% maximum health.',
    'Probability Manipulation': 'Fate Distortion: Always lands critical hits when rolling lucky and forces enemy misses.',
    'Invisibility & Phasing': 'Intangibility: Shifts out of the physical spectrum, allowing enemy weapons to pass harmlessly through.',
    'Precognition': 'Future Sight: Anticipates opponent actions 5 seconds in advance for massive evasion buffs.',
    'Laser Gaze': 'Optical Incineration: Emits high-energy laser beams from the eyes with pinpoint accuracy.',
    // New
    'Domain Expansion': 'Infinite Void Realm: Traps the battlefield within a private metaphysical dimension where all attacks have guaranteed hit-rate.',
    'Black Hole Singularity': 'Gravitational Collapse: Conjures a microscopic black hole that pulls in enemies and crushes physical projectiles.',
    'Blood Bending': 'Hemokinetic Control: Manipulates the blood inside enemy veins, forcing them to miss strikes or hit themselves.',
    'Lightning God Speed': 'Speed of Light: Surrounds the fighter in crackling golden lightning, granting 3 consecutive rapid strikes.',
    'Full Counter': 'Absolute Deflection: Absorbs incoming magical and projectile attacks, redirecting them back at the attacker with double power.',
    'Matter Disintegration': 'Atomic Dissolution: Deconstructs the molecular bonds of whatever the fighter touches, breaking enemy weapons.',
    'Mind Control / Hypnosis': 'Psychic Override: Emits mental suggestion waves that force the target to freeze in confusion and skip their turn.',
    'Infinite Stamina': 'Perpetual Energy Core: The fighter never tires, ignores all slowing effects, and gains +25% attack speed.',
    'Force Field Barrier': 'Kevlar Aegis: Projects a glowing hexagonal forcefield that absorbs the first 150 points of damage completely.',
    'Summon Meteor Strike': 'Orbital Devastation: Calls down a flaming meteor from orbit that slams into the arena for apocalyptic AoE damage.',
    'Cosmic Erasure': 'Ontological Deletion: A 15% chance to channel the primordial void, inflicting 300% unblockable existential damage.',
    'Illusion Phantasm': 'Mirror Clones: Creates 3 identical holographic phantoms; the enemy must guess which is real or hit empty air.'
  },

  levelUp: {
    '+20 Strength': 'Muscle Enhancement: Raw physical power boosted by +20 STR for increased melee impact.',
    '+25 Speed': 'Reflex Upgrade: Agility improved by +25 SPD for faster combat initiative and higher dodge rate.',
    '+30 Durability': 'Armor Reinforcement: HP pool and skin resilience augmented by +30 DUR.',
    '+20 Intelligence': 'Combat IQ: Critical strike chance and tactical counter-attacks boosted by +20 INT.',
    '+35 Strength (Overdrive)': 'Hyper-Overdrive: Massive physical strength boost (+35 STR) that shatters heavy armor.',
    '+35 Speed (Sonic Reflexes)': 'Sonic Agility: Reflexes upgraded (+35 SPD) ensuring the warrior almost always strikes first.',
    '+40 Durability (Titanium Plating)': 'Juggernaut Carapace: Immense HP bonus and armor density (+40 DUR).',
    '+35 Intelligence (Grandmaster)': 'Tactical Mastermind: High-tier intellect (+35 INT) controlling ability triggers.',
    '+45 Chaos (Glitch Overdrive)': 'Glitch Mutation: Wildcard miracle rating skyrocketed (+45 CHAOS) for unpredictable critical procs.',
    'Weapon Enchant: Flame': 'Hellfire Imbument: Weapons permanently burn foes, applying stacking fire damage over time.',
    'Weapon Enchant: Void': 'Life Essence Drain: Attacks siphon 15% of all damage dealt directly back as health.',
    'Weapon Enchant: Thunder': 'Chain Shockwaves: Lightning sparks off strikes, stunning foes and arcing damage.',
    'Weapon Enchant: Frostbite': 'Absolute Zero Edge: Melee hits have a 35% chance to freeze opponents solid for 1 turn.',
    'Weapon Enchant: Radiant Holy': 'Sacred Smite: Holy energy infuses strikes, dealing +50% bonus damage to infernal and undead foes.',
    'Weapon Enchant: Toxic Venom': 'Neurotoxin Coating: Strikes poison enemies, degrading health and speed on each turn.',
    'Weapon Enchant: Spacetime Rend': 'Armor Piercing: Strikes cut through spatial fabric, completely bypassing enemy durability armor.',
    'Weapon Enchant: Lifesteal Berserk': 'Vampiric Frenzy: Restores 25% of all damage dealt as health on every single blow.',
    'Unlock 2nd Power!': 'Supernatural Awakening: Grants a second independent supernatural power from the Almighty Wheel!',
    'Unlock 3rd Power (Trinity)!': 'Trinity Ascendance: Bestows a third simultaneous supernatural power, creating an unstoppable ability combo!',
    'Calamity Awakening': 'Mythic Transmutation: Multiplies all 5 combat statistics by 1.5x across the board!',
    'Limit Break: Super Saiyan Aura': 'Limit Break: Golden aura erupts around the warrior, increasing all baseline attributes by +30%!',
    'Purge Curse': 'Curse Cleansed: The Almighty Wheel cleanses the warrior of their weakness handicap forever.',
    'Invert Curse into Blessing': 'Divine Paradox: The warrior’s weakness is inverted into a permanent +40 stat buff and unique combat perk!',
    'Demigod Ascendance': 'Godhood Step: Character level leaps by +2, gaining the (Demigod) title and regal golden aura.',
    'Indomitable Will': 'Grit Mastery: When reduced to 0 HP, clings to life with 1 HP and unleashes a desperate counter-strike.',
    'Double Strike Mastery': 'Flurry Mastery: 30% chance on every turn to strike twice with their equipped weapon.',
    'Chaos Mutation': 'Ascended Titan: +45 Chaos, +30 Strength, and the warrior gains the prestigious (Ascended) title.'
  },

  stats: {
    'STR': 'Strength: Governs base physical attack damage, weapon impact velocity, and heavy blunt force.',
    'SPD': 'Speed: Determines combat turn order initiative, attack frequency, and evasion/dodge probability.',
    'DUR': 'Durability: Defines maximum HP pool (DUR * 5.5 + 120) and passive damage reduction armor.',
    'INT': 'Intelligence: Controls supernatural power activation rate, critical strike frequency, and tactical foresight.',
    'CHAOS': 'Chaos Rating: Multiplies random damage variance and triggers wild wildcard miracle and glitch procs.'
  },

  subRace: {
    'High Elf': 'Ancient Arcane Bloodline: +35 Arcane Intelligence and flawless magical precision.',
    'Dark Elf': 'Subterranean Shadow Elf: +40 Shadow Mastery, night vision evasion, and toxic blade affinity.',
    'Wood Elf': 'Wildwood Stalker: +30 Agile Speed, natural camouflage, and swift combat initiative.',
    'Elemental Elf': 'Prismatic Mage: +45 Prismatic Spell Fusion, channeling fire, frost, and lightning simultaneously.',
    'The Chosen One': 'Cosmic Anomaly: Max Rizz, All Stats boosted by +25%, and divine plot armor.',
    'Tsunami Born': 'Oceanic Cataclysm: Channels tidal shockwaves and drowns enemy defenses in crushing water.',
    'Magma Eruption': 'Volcanic Core: Superheated molten lava skin that melts incoming physical strikes.',
    'Supercell Hurricane': 'Storm Gale Entity: Rapid tornado winds that deflect ranged projectiles and buff dodge chance.',
    'Solar Flare Cataclysm': 'Stellar Core Sovereign: Blinding thermonuclear heat that scorches all opponents in the arena.',
    'Universe-Ending Rupture': 'Dimensional Catastrophe: Fractures spacetime with cosmic void rifts that bypass armor.',
    'Asteroid Outpost': 'Void Warlord: Accustomed to low-gravity warfare and spatial ambushes.',
    'Planetary System': 'Solar Conqueror: Governs 8 planetary worlds with unmatched tactical conquest experience.',
    'Star Cluster Sovereign': 'Constellation Lord: Commands stellar solar radiation across 500 star systems.',
    'Galactic Core Emperor': 'Supermassive Black Hole Throne: Bends gravity wells and crushes enemy forcefields.',
    'Multiverse Void Master': 'Cosmic Transcendent: Exists simultaneously across 8 parallel timelines, bypassing mortal defense.',
    'Peasant Skeleton': 'Goofy Bone Rattler: Very fragile yet unpredictable; takes blunt damage but shrugs off piercing hits.',
    'Knight Skeleton': 'Rusted Guardian: Wears ancient enchanted plate armor granting bonus melee durability.',
    'Orc Warlord Skeleton': 'Colossal Undead Brute: Skeletal spikes and bone-crushing cleave strikes.',
    'Ancient Dragon Skeleton': 'Draconic Fossil: Colossal ribcage and petrified dragon bone durability.',
    'Divine Lich Skeleton': 'Floating Necro-Sovereign: Levitation, spectral death flames, and auto-resurrection on death.',
    'Single Spark': 'Standard Fey Blessing: Granted 1 standard supernatural power roll.',
    'Dual Fey Blessing': 'Fey Doubling: Bestowed with 2 independent simultaneous powers by the Fey royalty!',
    'Trinity Overload': 'Fey Cataclysm: Bestowed with 3 simultaneous supernatural powers at once!'
  },

  subArchetype: {
    'God Slayer': 'Deity Executioner: Deals 220% amplified damage against divine, celestial, and god-tier opponents.',
    'Demon Slayer': 'Hellion Purger: Deals 200% holy executioner damage against demons, undead, and fiends.',
    'Dragon Slayer': 'Wyrm Hunter: Pierces draconic armor and takes 50% reduced elemental breath damage.',
    'Undead Slayer': 'Crypt Cleanser: Disintegrates skeletal thralls and permanently negates enemy resurrection.',
    'Mortal Hunter': 'Apex Stalker: Easily tracks and dominates mortal, human, and elven fighters.',
    'Cosmic Slayer': 'Cosmic Hunter: Pierces forcefields of Galactic Warriors, Voidwalkers, and Seraphs.',
    "Titan's Knuckle": 'Earthshaker Relic: Shatters arena ground and shields with massive kinetic shockwaves.',
    "Pharaoh's Cursed Eye": 'Foresight Relic: Foresees the opponent’s next 3 attack sequences to trigger counter-attacks.',
    'Primordial Rune Tablet': 'Arcane Aegis Relic: Completely negates incoming magical projectile and beam damage.',
    'Ancient Sharp Bone Relic': 'Fossil Relic: Pierces through light armor and inflicts bleeding lacerations.',
    "Architect's Compass": 'Fate Weaver Relic: Can alter the outcome of fatal blows and invert bad luck.',
    'Shadow Direwolf': 'Umbral Pack Beast: Flanks opponents from the shadows, inflicting bleeding lacerations.',
    'Celestial Griffin': 'Heavenly Mount: Supersonic razor talons that dive from the sky to strike undefended flanks.',
    'Bone Chimera': 'Three-Headed Monstrosity: Attacks in tandem with venom, hellfire, and bone-crushing jaws.',
    'Void Slime': 'Kinetic Sponge: Completely absorbs physical impact damage from heavy bludgeoning strikes.',
    'Cosmic Leviathan Pup': 'Void Leviathan: Breathes miniature solar supernovas that disintegrate enemy shields.',
    'Berserk Adrenaline Serum': 'Mutagenic Stimulant: Triples attack speed and critical strike probability for 30 seconds.',
    'Liquid Diamond Skin': 'Diamond Hardener: Renders skin completely impervious to bladed slashes and arrows.',
    'Acidic Blood Reagent': 'Corrosive Counter: Attackers take heavy splashing acid burn damage whenever they strike.',
    "Philosopher's Drop": 'Elixir of Immortality: Instantly revives the warrior from lethal defeat with restored vigor.'
  }
};

/**
 * Helper to fetch description for any trait or fallback to clean subtext
 */
function getTraitDescription(category, key) {
  if (!key) return '';
  const cleanKey = typeof key === 'object' ? key.text : key;
  
  // 1. Direct category match
  if (TRAIT_DESCRIPTIONS[category] && TRAIT_DESCRIPTIONS[category][cleanKey]) {
    return TRAIT_DESCRIPTIONS[category][cleanKey];
  }

  // 2. Scan all TRAIT_DESCRIPTIONS categories (subRace, subArchetype, backstory, levelUp, etc.)
  for (const cat in TRAIT_DESCRIPTIONS) {
    if (TRAIT_DESCRIPTIONS[cat] && TRAIT_DESCRIPTIONS[cat][cleanKey]) {
      return TRAIT_DESCRIPTIONS[cat][cleanKey];
    }
  }

  // 3. Check category in WHEEL_DATA
  if (WHEEL_DATA[category]) {
    const found = WHEEL_DATA[category].segments.find(s => s.text === cleanKey);
    if (found && found.subtext) return found.subtext;
  }

  // 4. Search across all wheels and sub-wheels in WHEEL_DATA
  for (const wKey in WHEEL_DATA) {
    if (WHEEL_DATA[wKey] && WHEEL_DATA[wKey].segments) {
      const found = WHEEL_DATA[wKey].segments.find(s => s.text === cleanKey);
      if (found && found.subtext) return found.subtext;
    }
  }

  return 'A mysterious trait bestowed by the Almighty Wheel of Faith.';
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { WHEEL_DATA, RARITY_COLORS, TRAIT_DESCRIPTIONS, getTraitDescription };
}
