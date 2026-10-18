# The Wheel of Faith (WOF Arena) - Wheels Web App

An authentic, dark fantasy web adaptation of **The Wheel of Faith** by Bushin, recreating the exact wheel-spinning mechanics, character creation flows, and level-up system from the viral TikTok/Instagram series and the mobile game **WOF Arena**.

---

## 🌟 Key Features

### 1. ⚔️ Mode 1: The Destiny Spin (Sequential Character Creation)
Recreates the exact multi-phase character rollout seen on Instagram Reels:
- **Phase 1: Race Wheel** (17 races: Humans, High/Dark/Wood Elves, Dwarves, Demons, Angels, Werewolves, Orcs, Androids, Vampires, Elementals, Skeletons, Fairies, Goblins, Sirens, Dragonkin, Cosmic Warriors, Nucleites).
  - *Dynamic Sub-Wheels*: Land on Elf to roll Heritage, Elemental to roll Calamity Tier, Cosmic Warrior to roll Conquered Territory, Skeleton to roll Bone Origin, Fairy to roll Power Multiplier (1, 2, or 3 powers!), or Dwarf to roll Forge Recipe.
- **Phase 2: Archetype Wheel** (14 classes: Slayer, Archaeologist, Equaliser, Paladin, Berserker, Mage, Assassin, Support, Tamer, Alchemist, Martial Artist, Joke/NPC, Chaos Incarnate, Trickster).
  - *Dynamic Sub-Wheels*: Slayer rolls Prey Target, Archaeologist rolls Ancient Relic, Tamer rolls Companion Beast, Alchemist rolls Signature Elixir.
- **Phase 3: Weapon Wheel** (Godly, Mythical, tactical, and classic WoF meme weapons: Starshard Bow, Voidbreaker Maul, Skyrender Axe, Thor's Hammer, Thunderous Thunderbolt, Spatula with Lemon Juice, Titanium Crowbar, Enchanted Brick, Slipper of Doom).
- **Phase 4: Power Wheel** (Time Stop, Reality Warping, Ferrokinesis, Pyrokinesis, Cryokinesis, Shadow Manipulation, Teleportation, Power Absorption, Necromancy, Acid Generation, Gravity Inversion, Super Regeneration, Probability Manipulation, Precognition).
- **Phase 5: Weakness / Curse Wheel** (Fragile Bones, Melts in Rain, Loud Sneezes, Extreme Pacifist, Glass Cannon, Bad Luck Aura, Allergic to Gold, Blind in Left Eye, Compulsive Taunting).
- **Phase 6: Backstory & Chaos Wheel** (Chaos Inversion, Creator's Pity, Fourth Wall Breaker, Royal Reincarnation, Lab Experiment #09, Gladiator Champion, Cursed Village Survivor, Isekai'd Salaryman).
- **Phase 7: Combat Rating & Stat Generation** (Calculates Rank E up to God-Tier Rank EX, scaling STR, SPD, DUR, INT, CHAOS).
- **Grand Finale: The Almighty Character Card** with procedural title, dynamic avatar aura, stat bars, overall power rating, PNG image download, and Hall of Fame saving.

### 2. 🎡 Mode 2: Free-Spin Wheel Hub (Sandbox)
- Directly pick and spin any individual wheel anytime from a categorized dropdown and quick-access chips.
- Great for testing matchups, individual rolls, or running your own TikTok/Instagram video creations!

### 3. ⚡ Mode 3: WOF Arena Level-Up & Evolution Wheel
- Select any hero from your saved roster.
- Spin the Level-Up wheel to gain permanent stat boosts (+20 STR, +25 SPD, +30 DUR, +20 INT), Weapon Enchantments (+Flame, +Void, +Thunder), second powers, Calamity Awakenings (Stats x1.5), or Curse Purging!

### 4. ⚔️ Mode 4: WoF Arena (Visual 1v1 & Free-For-All Battles)
- **1v1 Duels**: Head-to-head match between any two warriors.
- **💥 Free-For-All (Battle Royale)**: 3 to 8 fighters enter the colosseum simultaneously. The last warrior standing is declared the Arena Champion!
- **Visual Combat Animation**:
  - Animated lunges, dodges, and recoil shakes.
  - Floating combat text (`-35`, `💥 CRIT! -84`, `⏳ TIME STOP!`, `🤧 SNEEZED!`, `🌀 WARPED!`).
  - Screen shake on heavy impact and critical strikes.
  - Live animated HP bars with color changes (Green -> Yellow -> Red).
  - Combat status effects (Frozen, Burning, Blinded, Necromancy Revival, Super Regeneration).
  - Synchronized Web Audio SFX (slashes, blunt impacts, explosions, magic humming, critical bells, victory fanfare).
  - Speed controls: `1x` (Cinematic), `2x` (Fast), `4x` (Blitz), with Pause/Resume.
  - Live Instagram-style commentary feed.
  - **Victory Integration**: Champion celebration with stats (Kills, Total Damage) and a direct button to level up the winner on the **Level-Up Wheel**!

### 5. 🏆 Mode 5: Hall of Fame (Roster)
- Persistent `localStorage` tracking of all generated warriors.
- Inspect detailed character cards, level them up, export PNG cards, copy formatted character summaries to clipboard, or send them straight into the Arena!

### 6. 🔊 Procedural Web Audio Engine
- Synthesizes realistic mechanical peg clicks, aerodynamic whoosh, combat hit sounds, and rarity-scaled fanfares using pure Web Audio API without external file dependencies.

### 7. 📱 Mobile Arcade & Desktop Wide Views
- Toggle between an authentic smartphone mobile frame (mimicking WOF Arena) and a wide responsive desktop layout.

---

## 🚀 Running Locally

The web app is served via a local HTTP server:
- URL: `http://localhost:8080`

To start the server at any time:
```bash
ruby -run -ehttpd . -p8080
```
Open `http://localhost:8080` in Chrome, Safari, Firefox, or your mobile browser.
