# Wheel of Faith (WOF Arena) - Project Context & Guidelines

## 1. Project Overview
A web-based interactive character-generator and colosseum combat arena inspired by Bushin's *"The Wheel of Faith"* series. 
It uses **pure Vanilla JavaScript, HTML5 Canvas, and Vanilla CSS** with a zero-dependency **Web Audio API** procedural sound generator.

---

## 2. Core Architecture & Files
* **[`index.html`](file:///Users/ethan/Documents/Projects/Wheel%20of%20Faith/index.html)**: Main HTML structure, layout frames (mobile arcade frame & wide view toggle), modals (Spin Outcome, Character Card, Hall of Fame, Renaming Modal, Arena Victory).
* **[`css/styles.css`](file:///Users/ethan/Documents/Projects/Wheel%20of%20Faith/css/styles.css)**: Clean Sapphire & Midnight Blue aesthetic, brushed titanium borders, Genshin-style character showcase styling, electric cyan glowing needle pointer, responsive card styling, modal overlays.
* **[`js/wheelData.js`](file:///Users/ethan/Documents/Projects/Wheel%20of%20Faith/js/wheelData.js)**: Master datasets & lore repository:
  * **43 Races**: Human, Elf, Dwarf, Demon, Angel, Werewolf, Orc, Android, Vampire, Elemental, Skeleton, Fairy, Goblin, Siren, Dragonkin, Cosmic Warrior, Nucleite, Shadow Monarch, Phoenixkin, Nephilim, Cyborg Titan, Voidwalker, Slime Sovereign, Eldritch Entity, Djinn, Beastfolk Chimera, Gargoyle, Insectoid Hivemaster, Demi-God, Homunculus, Astral Seraph, Living Armor, Dragon Slayer, Devil (7 Sins), God / Primordial, Animorph, Giant, Golem, Hive Mind, Mythical Beast, Dryad, Merfolk, Reincarnation / Spirit.
  * **36 Archetypes**: Slayer, Archaeologist, Equaliser, Paladin, Berserker, Mage, Assassin, Support/Healer, Tamer, Alchemist, Martial Artist, Trickster, Joke/NPC, Chaos Incarnate, Necromancer, Gunslinger/Deadeye, Time Warden, Dragon Knight, Shadow Monarch, Brawler/Pugilist, Cosmic Inquisitor, Bard, Cursed / Cultist, Goliath, Cloaked (Ninja), Priest, Pirate, Gladiator, Spirit Weaver, Mutant, Resilient, Royal, Apostle, Primordial Champion, Champion's Legacy, Hybrid.
  * **25+ Sub-Wheels**: humanOrigin, demiGodLineage, championsBloodGoat, dragonSlayerRank, angelicOrder, demonPowers, devilsSins, godType, primordialType, vampireFeeding, animorphMorph, cyborgTechno, giantDomain, goblinPosition, orcRole, golemMaterial, hiveMindForm, mythicalBeastType, dryadOrigin, merfolkLineage, reincarnationSoul, mageRank, paladinPowers, cursedPowers, goliathArmor, ninjaRank, martialArtStyle, priestDomain, pirateRank, gladiatorVariant, spiritWeaverType, mutantTrait, royaltyTitle, apostleBelief, primordialPatron, championsLegacyFaction, tricksterTricks.
  * **36 Weapons**: Starshard Bow, Voidbreaker Maul, Skyrender Axe, Thor's Hammer, Thunderous Thunderbolt, Dragonheart Shield, Soulchain Flail, Muramasa Katana, Dual Plasma Pistols, Scythe of Eternity, Titanium Crowbar, Spatula with Lemon Juice, Enchanted Brick, Slipper of Doom, Adamantine Greatsword, Twin Daggers, Excalibur, Stormbreaker, Nodachi of the Black Void, Guillotine Greatsword, Dual Golden Desert Eagles, Nokia 3310 on a Chain, Folding Steel Chair, Cursed French Baguette, Chihuahua on a Leash, Gungnir, Quantum Railgun, Staff of the Cosmic Archmage, Chakrams of the Eclipse, Death Harvester Scythe, Leviathan Harpoon, Laser Broadsword, Sledgehammer of Justice, God-Slaying Kusarigama, Rubber Chicken of Torment, Dual Energy Chakrams.
  * **26 Level-Up Upgrades**: Stat overdrives, enchants (Frostbite, Radiant Holy, Toxic Neurotoxin, Spacetime Rend, Lifesteal Berserk), 2nd/3rd Power awakenings, Super Saiyan Aura, Invert Curse, Demigod Ascendance, Indomitable Will, Double Strike.
  * **28 Powers**: Time Stop, Reality Warping, Ferrokinesis, Pyrokinesis, Cryokinesis, Shadow Manipulation, Teleportation, Power Absorption, Necromancy, Acid Generation, Gravity Inversion, Super Regeneration, Probability Manipulation, Invisibility, Precognition, Laser Gaze, Domain Expansion, Black Hole, Blood Bending, Lightning God Speed, Full Counter, Matter Disintegration, Mind Control, Infinite Stamina, Force Field, Summon Meteor, Cosmic Erasure, Illusion Phantasm.
  * **22 Weaknesses & Curses**: Fragile Bones, Melts in Rain, Loud Sneezes, Extreme Pacifist, Glass Cannon, Bad Luck Aura, Allergic to Gold, Blind in Left Eye, Power Drain Timer, Compulsive Taunting, Extremely Ticklish, Afraid of Small Dogs, Needs 8 Hours of Sleep, Monologues When Winning, Cannot Fight Without Music, Motion Sickness, Overthinks Every Move, Low Pain Tolerance, Always Announces Attack, Severe Caffeine Withdrawal, Distracted by Shiny Objects, Vegetarian Guilt.
  * **20 Backstories & Chaos Factors**: Chaos Inversion, Creator's Pity, Fourth Wall Breaker, Royal Reincarnation, Lab Experiment #09, Gladiator Champion, Cursed Village Survivor, Isekai'd Salaryman, Forgotten God Slumber, Street Urchin Gambler, Reborn Anime Protagonist, Escaped SCP Anomaly, Time Traveler from 3000, Adopted by Elder Dragon, Won the Cosmic Lottery, Glitch in the Multiverse, Banished Archangel, Sentient Meme Come to Life, Sole Survivor of Star Collapse, Vengeful Disciple.
  * **`TRAIT_DESCRIPTIONS`**: Comprehensive mechanical & lore explanations for every trait, weapon, power, curse, and race.
* **[`js/wheel.js`](file:///Users/ethan/Documents/Projects/Wheel%20of%20Faith/js/wheel.js)**: HTML5 Canvas wheel physics, dynamic rarity-weighted segment sizing (Common wide vs God-Tier razor sliver), rarity clustering, clean sapphire theme, brushed steel flapper needle, tick audio sync.
* **[`js/character.js`](file:///Users/ethan/Documents/Projects/Wheel%20of%20Faith/js/character.js)**: Draft manager, random name generator, stat calculations, level-up mutations, dynamic title generator, `localStorage` Hall of Fame, pre-configured Lore Legends (Bushin, Jin, ETF, Freya, Dominio, Joe, Max, King Baki, Darwizzy, Sir Baguette).
* **[`js/battle.js`](file:///Users/ethan/Documents/Projects/Wheel%20of%20Faith/js/battle.js)**: 1v1 and Free-For-All arena battle engine, weapon passives, enchants, revivals (Undead, Phoenixkin, Indomitable Will), floating combat text, live battle logs.
* **[`js/audio.js`](file:///Users/ethan/Documents/Projects/Wheel%20of%20Faith/js/audio.js)**: Zero-dependency Web Audio API procedural synthesizer for ticks, whooshes, slashes, magic, explosions, and fanfare.
* **[`js/app.js`](file:///Users/ethan/Documents/Projects/Wheel%20of%20Faith/js/app.js)**: Central application coordinator, tab navigation, renaming workflows, compendium drawer, outcome modal display.

---

## 3. Key Feature Implementations
1. **Character Renaming**:
   * *Live Draft*: Input field `#liveHeroNameInput` + randomizer button `🎲`.
   * *Character Card*: Editable field `#cardHeroNameInput` + `✏️` button; updates full title instantly.
   * *Hall of Fame*: `Rename ✏️` button on roster cards opens `#renameModal` with preset suggestions and randomizer; saves to `localStorage`.
2. **Combat & Lore Descriptions**:
   * *Outcome Modal*: `#modalTraitDescCard` with badge `#modalDescTypeBadge` and text `#modalDescText` detailing exact combat mechanics for every spin.
   * *Character Card*: Full explanations for Race, Archetype, Weapon, Weakness, Backstory, plus per-power breakdowns. Toggleable via `Trait Guide: ON/OFF`.
   * *Wheel Almanac / Compendium*: Drawer in Free-Spin mode displaying every item with its lore, rarity, and mechanics; click any item to spin directly to it.
3. **Session Handoff Skill**:
   * Located at [`.agents/skills/handoff/SKILL.md`](file:///Users/ethan/Documents/Projects/Wheel%20of%20Faith/.agents/skills/handoff/SKILL.md). Call or ask for a handoff at any time to generate an instant context-bridge prompt for new chats.

---

## 4. Change Logging Protocol
* **[`CHANGELOG.md`](file:///Users/ethan/Documents/Projects/Wheel%20of%20Faith/CHANGELOG.md)**: Master log tracking all past and future updates.
* **Rule**: Whenever any new feature, balance adjustment, or bug fix is implemented, **always append an entry to [`CHANGELOG.md`](file:///Users/ethan/Documents/Projects/Wheel%20of%20Faith/CHANGELOG.md)** with the date and description of what was changed.

---

## 5. Git Automation & Commit Protocol
* **Hands-off Git Management**: The user wants git to manage this project without having to deal with it manually.
* **Auto-Commit Rule**: After **every change, feature addition, or bug fix**, stage all relevant files and create a clean, descriptive git commit automatically (e.g. `git add -A && git commit -m "..."`). Never make the user run git commands.

---

## 6. Coding Conventions for Future Edits
* Keep dependencies zero: Use vanilla HTML/CSS/JS. Do not add heavy npm libraries unless explicitly requested.
* Maintain audio cues with `sounds.*` methods in [`js/audio.js`](file:///Users/ethan/Documents/Projects/Wheel%20of%20Faith/js/audio.js).
* Keep traits synced between [`js/wheelData.js`](file:///Users/ethan/Documents/Projects/Wheel%20of%20Faith/js/wheelData.js) (`WHEEL_DATA` and `TRAIT_DESCRIPTIONS`), [`js/character.js`](file:///Users/ethan/Documents/Projects/Wheel%20of%20Faith/js/character.js) (stat adjustments), and [`js/battle.js`](file:///Users/ethan/Documents/Projects/Wheel%20of%20Faith/js/battle.js) (combat effects).
* Update both [`AGENTS.md`](file:///Users/ethan/Documents/Projects/Wheel%20of%20Faith/AGENTS.md) and [`CHANGELOG.md`](file:///Users/ethan/Documents/Projects/Wheel%20of%20Faith/CHANGELOG.md) on major releases.

