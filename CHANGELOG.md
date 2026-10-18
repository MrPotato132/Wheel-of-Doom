# Wheel of Faith (WOF Arena) - Changelog & Change History

All notable changes, updates, feature expansions, and bug fixes for the project are recorded in this file in reverse chronological order.

---

## [Unreleased / In-Progress]
- [ ] Customizable sound packs / sound volume sliders.
- [ ] Arena Tournament Bracket mode (Quarter-finals, Semi-finals, Finals).
- [ ] Export battle replay / animated combat GIF or WebM.
- [ ] Boss Raid Mode (All arena fighters team up against Calamity Bosses).

---

## [v2.1.0] - 2026-10-18
### Added
- **Full Compendium Content Expansion (Added 11 Races, 14 Archetypes & 25+ Sub-Wheels)**:
  - Added new races from Bushin canon: *Dragon Slayer*, *Devil (7 Sins)*, *God / Primordial*, *Animorph*, *Giant*, *Golem*, *Hive Mind*, *Mythical Beast*, *Dryad*, *Merfolk*, and *Reincarnation / Spirit* (Race wheel expanded to 43 total lineages).
  - Added new archetypes: *Cursed / Cultist*, *Goliath*, *Cloaked (Ninja)*, *Priest*, *Pirate*, *Gladiator*, *Spirit Weaver*, *Mutant*, *Resilient*, *Royal*, *Apostle*, *Primordial Champion*, *Champion's Legacy* (Ethan, Musam, Boodro), and *Hybrid* (Archetype wheel expanded to 36 total classes).
  - Implemented 25+ new specialty sub-wheels: `humanOrigin`, `demiGodLineage`, `championsBloodGoat`, `dragonSlayerRank`, `angelicOrder`, `demonPowers`, `devilsSins`, `godType`, `primordialType`, `vampireFeeding`, `animorphMorph`, `cyborgTechno`, `giantDomain`, `goblinPosition`, `orcRole`, `golemMaterial`, `hiveMindForm`, `mythicalBeastType`, `dryadOrigin`, `merfolkLineage`, `reincarnationSoul`, `mageRank`, `paladinPowers`, `cursedPowers`, `goliathArmor`, `ninjaRank`, `martialArtStyle`, `priestDomain`, `pirateRank`, `gladiatorVariant`, `spiritWeaverType`, `mutantTrait`, `royaltyTitle`, `apostleBelief`, `primordialPatron`, `championsLegacyFaction`, and `tricksterTricks`.
  - Expanded `tamerBeast` sub-wheel to 10 canon beasts (*Bald Cat*, *Alpha Ape*, *Pyro Penguin*, *Thunder Hawk*, *Spectral Wolf*, *Tidal Tiger*, *Gale Griffin*, *Rune Bear*, *Void Panther*, *Infernal Hellhound*).
  - Populated complete lore and combat descriptions in `TRAIT_DESCRIPTIONS` for all new additions.
- **Rarity-Weighted Dynamic Wheel Slices & Jackpot Clustering**:
  - Re-engineered `js/wheel.js` canvas math: common segments receive large, wide arcs while legendary, mythic, and god-tier slices are drawn as razor-thin jackpot slivers.
  - Slices are dynamically clustered by rarity tier (Common $\rightarrow$ Uncommon $\rightarrow$ Rare $\rightarrow$ Epic $\rightarrow$ Legendary $\rightarrow$ Mythic $\rightarrow$ God-Tier $\rightarrow$ Chaos) for maximum anticipation as the wheel sweeps into the high-stakes danger zone.
  - Probability-weighted landing physics: landing on thin god-tier slivers now naturally matches actual rarity odds.
  - Built-in support for the *Equalizer* archetype rule-bending mode to equalize all wheel arcs.
- **Unified Sapphire & Midnight Blue Monochromatic Wheel**:
  - Eliminated disparate rainbow colors per slice/spin on the canvas wheel.
  - Slices now render in a clean, alternating pattern of deep sapphire (`#1e3a8a` to `#2563eb`) and midnight oceanic blue (`#0e1d38` to `#162b50`) with electric ice-blue dividers (`#38bdf8`).
  - Unified all rarity accents, victory particle sparks, vision crests, and character card frames into the pure blue/cyan/white palette.
- **Clean Sapphire & Midnight Blue UI Overhaul**:
  - Ditching carnival aesthetic: removed yellow chasing LED bulbs and carnival crimson/gold rim.
  - New clean sapphire, midnight obsidian, and electric ice-blue palette across canvas outer rim, center hub, needle pointer, and buttons.
  - Brushed steel precision needle pointer with electric cyan glowing tip.
- **Genshin-Style Character Card Reveal**:
  - Full-body heroic vector silhouette illustration tailored to character race and archetype (Celestial winged paragon, Infernal demon, Draconic knight, Arcane archmage, Colossal titan, Cybernetic titan, Agile scout, and Colosseum warrior).
  - Elemental Vision crest (Pyro, Cryo, Electro, Anemo, Geo, Hydro, Abyss, Lumen).
  - Star-rating badge (★★★★★ 5-Star / 4-Star) with glowing elemental aura backdrop and level badge.

---

## [v2.0.0] - 2026-10-17
### Added
- **Full Character Renaming System**:
  - Live Draft custom naming with interactive text input (`#liveHeroNameInput`) and quick randomizer button (`🎲`).
  - Character Card editable title field (`#cardHeroNameInput`) with edit button (`✏️`) that automatically updates full titles in real time.
  - Hall of Fame roster renaming with dedicated Rename button (`✏️`) on each fighter card opening `#renameModal` with preset suggestions (*Shadow Sovereign*, *Bushin-Slayer*, *Lord Dominio*, *Anime Protagonist*, *Sir Baguette*, *Valkyrie Queen*), custom input, and randomizer.
  - Full sync across Live Draft, Character Cards, Hall of Fame, and Arena commentary.
- **Spin Outcome Descriptions & Mechanics**:
  - Added `#modalTraitDescCard` to the spin celebration modal displaying a dynamic type badge (`#modalDescTypeBadge`) and in-depth combat & lore explanation (`#modalDescText`).
  - Explanations for all Chaos Factors, Backstories, Weapons, Powers, Weaknesses, Races, Archetypes, and Level-Up options.
- **Almighty Character Card Trait Guide**:
  - Populated all trait description boxes (`cardRaceExplain`, `cardArchExplain`, `cardWeaponExplain`, `cardWeaknessExplain`, `cardBackstoryExplain`).
  - Integrated `.power-explain-box` for every individual supernatural ability.
  - Added interactive Trait Guide toggle button (`Trait Guide: ON/OFF`).
  - Added interactive stat breakdown callouts (`#statCalloutText`) for STR, SPD, DUR, INT, and CHAOS.
- **Free-Spin Wheel Hub Almanac / Compendium**:
  - Added interactive `#hubCompendiumDrawer` and `#btnToggleCompendium` in the Wheel Hub.
  - Allows players to inspect all items on the active wheel with rarities and lore, with click-to-spin functionality.
- **Massive Content Expansion**:
  - **Races expanded from 17 to 32**: Added *Shadow Monarch*, *Phoenixkin*, *Nephilim*, *Cyborg Titan*, *Voidwalker*, *Slime Sovereign*, *Eldritch Entity*, *Djinn (Genie)*, *Beastfolk Chimera*, *Gargoyle*, *Insectoid Hivemaster*, *Demi-God*, *Homunculus*, *Astral Seraph*, and *Living Armor*.
  - **Weapons expanded from 16 to 36**: Added *Excalibur*, *Stormbreaker*, *Nodachi of the Black Void*, *Guillotine Greatsword*, *Dual Golden Desert Eagles*, *Nokia 3310 on a Chain*, *Folding Steel Chair*, *Cursed French Baguette*, *Chihuahua on a Leash*, *Gungnir*, *Quantum Railgun*, *Staff of the Cosmic Archmage*, *Chakrams of the Eclipse*, *Death Harvester Scythe*, *Leviathan Harpoon*, *Laser Broadsword*, *Sledgehammer of Justice*, *God-Slaying Kusarigama*, *Rubber Chicken of Torment*, and *Dual Energy Chakrams*.
  - **Level-Up Options expanded from 11 to 26**: Added *+35 Overdrive Stats*, weapon enchantments (*Frostbite Freeze*, *Radiant Holy*, *Toxic Neurotoxin*, *Spacetime Rend*, *Lifesteal Berserk*), *Unlock 3rd Power (Trinity Ascendance)*, *Limit Break: Super Saiyan Aura*, *Invert Curse into Blessing*, *Demigod Ascendance*, *Indomitable Will*, and *Double Strike Mastery*.
  - **Archetypes expanded from 14 to 22**: Added *Necromancer*, *Gunslinger / Deadeye*, *Time Warden*, *Dragon Knight*, *Shadow Monarch*, *Brawler / Pugilist*, *Cosmic Inquisitor*, and *Bard / Battle Rocker*.
  - **Powers expanded from 16 to 28**: Added *Domain Expansion*, *Black Hole Singularity*, *Blood Bending*, *Lightning God Speed*, *Full Counter*, *Matter Disintegration*, *Mind Control / Hypnosis*, *Infinite Stamina*, *Force Field Barrier*, *Summon Meteor Strike*, *Cosmic Erasure*, and *Illusion Phantasm*.
  - **Weaknesses expanded from 12 to 22**: Added *Needs 8 Hours of Sleep*, *Monologues When Winning*, *Cannot Fight Without Music*, *Motion Sickness*, *Overthinks Every Move*, *Low Pain Tolerance*, *Always Announces Attack*, *Severe Caffeine Withdrawal*, *Distracted by Shiny Objects*, and *Vegetarian Guilt*.
  - **Backstories expanded from 10 to 20**: Added *Reborn Anime Protagonist*, *Escaped SCP Anomaly*, *Time Traveler from 3000*, *Adopted by Elder Dragon*, *Won the Cosmic Lottery*, *Glitch in the Multiverse*, *Banished Archangel*, *Sentient Meme Come to Life*, *Sole Survivor of Star Collapse*, and *Vengeful Disciple*.
  - **Lore Legends**: Added *Shadow Sovereign Jin*, *Astral Valkyrie Freya*, and *Sir Baguette* to the instant colosseum roster.
- **Combat Engine Enhancements**:
  - Implemented revivals for *Phoenixkin* (Phoenix Rebirth) and *Necromancy* (Undead Lich Lord).
  - Implemented *Indomitable Will* (survives lethal blows with 1 HP).
  - Implemented *Double Strike Mastery* (chance for instant second attack).
  - Implemented *Full Counter* (reflects magical attacks back at 200% power).
  - Added *Domain Expansion* guaranteed hit logic and force field absorption.
  - Added weapon status effects: blinding, WWE chair stuns, bleeding ankle bites, and holy starlight beams.
  - Implemented new enchants: *Frostbite Freeze*, *Toxic Neurotoxin*, *Spacetime Rend* (armor bypass), and *Lifesteal Berserk*.

### Changed
- Scaled canvas wheel typography and rim pegs dynamically for high-density wheels (up to 36 segments).
- Fixed character card naming element reference so inline renaming updates dynamic titles and storage without errors.

---

## [v1.0.0] - Initial Release
- Core HTML5 Canvas physics wheel with realistic inertia, damping, and clacker audio sync.
- 7-step Destiny Spin sequence (Race, Sub-Race, Archetype, Weapon, Power, Weakness, Backstory, Combat Rating).
- Free-Spin sandbox mode with 10+ sub-wheels.
- Mobile arcade frame with wide-view toggle.
- Web Audio API zero-dependency procedural synthesizer.
- 1v1 and Free-For-All arena battle engine with live combat log commentary.
- Hall of Fame localStorage persistence and character card image exporting.
