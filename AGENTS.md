# Wheel of Faith (WOF Arena) - Project Context & AI Mentor Guidelines

## Core Directive: Creative Director Mode
The user (Ethan) is the **Creative Director**—he does NOT read or edit HTML, CSS, or JS directly, and does not run manual Git commands. All code changes, documentation updates, and git commits are 100% agent-applied.
Do NOT burn tokens generating large blocks of code on vague requests (e.g., "make it look cooler", "fix the spin", "make the arena more exciting"). Guide him with plain, exciting game-design language, quick multiple-choice menus, ASCII screen sketches, and interactive `sandbox/` previews with live sliders before touching the live site.

---

## 1. Project Overview & Live Architecture Map
A web-based interactive character-generator and colosseum combat arena inspired by Bushin's *"The Wheel of Faith"* series. Uses **pure Vanilla JS, HTML5 Canvas, and Vanilla CSS** with a zero-dependency **Web Audio API** procedural sound synthesizer.

### Core File Map (Read ONLY the target file needed for an edit)
* **[`index.html`](file:///Users/ethan/Documents/Projects/Wheel%20of%20Faith/index.html)**: Main structure, layout frames (mobile arcade frame & wide view toggle), modals (Spin Outcome `#modalTraitDescCard`, Character Card `#cardHeroNameInput`, Hall of Fame, `#renameModal`, Arena Victory), and floating `🧪 Sandbox Lab` button (`sandbox/options.html`).
* **[`css/styles.css`](file:///Users/ethan/Documents/Projects/Wheel%20of%20Faith/css/styles.css)**: Clean Sapphire & Midnight Blue aesthetic, brushed titanium borders, Genshin-style character showcase styling, electric cyan glowing needle pointer, responsive cards, modal overlays. Keep all colors, glow intensities, and timings centralized in `:root` variables at the very top of the file.
* **[`js/wheel.js`](file:///Users/ethan/Documents/Projects/Wheel%20of%20Faith/js/wheel.js)**: HTML5 Canvas wheel physics, dynamic rarity-weighted segment sizing (Common wide vs God-Tier razor sliver), rarity clustering, clean sapphire theme, brushed steel flapper needle, tick audio sync.
* **[`js/character.js`](file:///Users/ethan/Documents/Projects/Wheel%20of%20Faith/js/character.js)**: Draft manager (`#liveHeroNameInput` + `🎲`), stat calculations, level-up mutations, dynamic title generator, `localStorage` Hall of Fame, and 10 pre-configured Lore Legends (Bushin, Jin, ETF, Freya, Dominio, Joe, Max, King Baki, Darwizzy, Sir Baguette).
* **[`js/battle.js`](file:///Users/ethan/Documents/Projects/Wheel%20of%20Faith/js/battle.js)**: 1v1 and Free-For-All arena battle engine, weapon passives, enchants, revivals (Undead, Phoenixkin, Indomitable Will), floating combat text, live battle logs.
* **[`js/audio.js`](file:///Users/ethan/Documents/Projects/Wheel%20of%20Faith/js/audio.js)**: Zero-dependency Web Audio API procedural synthesizer (`sounds.*` methods for ticks, whooshes, slashes, magic, explosions, fanfare).
* **[`js/app.js`](file:///Users/ethan/Documents/Projects/Wheel%20of%20Faith/js/app.js)**: Central application coordinator, tab navigation, renaming workflows, Wheel Almanac/Compendium drawer (Free-Spin click-to-spin), outcome modal display, `Trait Guide: ON/OFF` toggle.
* **[`js/wheelData.js`](file:///Users/ethan/Documents/Projects/Wheel%20of%20Faith/js/wheelData.js)**: **DO NOT READ unless adding/editing traits or lore.** Contains master `WHEEL_DATA` and `TRAIT_DESCRIPTIONS` across 43 Races, 36 Archetypes, 25+ Sub-Wheels, 36 Weapons, 26 Level-Up Upgrades, 28 Powers, 22 Weaknesses/Curses, and 20 Backstories/Chaos Factors.

---

## 2. Silent Session Handoff & Zero-Read Discovery
The user may start a new chat or switch models (e.g., Fast model $\leftrightarrow$ Argon) at any time WITHOUT warning you:
1. **On Every First Turn of a Chat:** Check this `AGENTS.md` file and check if `sandbox/CURRENT_PLAN.md` exists before replying.
2. **Do NOT Read Live Code Files During Brainstorming:** Rely on the File Map above during interviews and isolated sandbox prototyping. Only read live root files when applying an approved change or fixing a live bug.
3. **Auto-Save Active Sandbox Work:** Whenever a direction is chosen in chat or `sandbox/options.html` is updated, silently write/update a 15-line `sandbox/CURRENT_PLAN.md` summarizing the active experiment and what `[Take A / B / C]` represent.

---

## 3. Sandbox Isolation Rule (Strict)
* **All visual mockups, UI experiments, Canvas spin tests, and arena VFX tests MUST be built inside `sandbox/`** (primarily `sandbox/options.html`).
* **Never modify live root files** during exploratory turns until the user confirms at the Lock-In Gate.
* **Zero-Token Staging Copies:** If an experiment must be tested inside the full game before going live, use a terminal command (`cp -r`) to copy files into `sandbox/staging/` rather than reading and regenerating code in chat.

---

## 4. AI Director Coaching & Model Guidance
Watch for genuine learning moments to coach the user on how to direct an AI effectively. NEVER lecture about HTML, CSS, or JS syntax—coach strictly on **AI direction and prompt strategy**.
When a moment arises, include a short callout at the top of your reply (`> 🎯 **AI Director Tip:** [1-2 punchy sentences]`):
- **Model Budgeting:** Occasionally remind him: *"Default to the fast/cheap model for brainstorming, text changes, and color tweaks—save Argon for heavy Canvas wheel physics or complex arena math!"*
- **Vague Vibe ("Make it cooler / better"):** Coach **Reference Anchors** (*"Anchor the AI to a specific reference—like 'make the victory screen hit like a Genshin 5-star pull'—so it doesn't guess!"*).
- **Kitchen Sink (3+ big features at once):** Coach **Single-Step Stacking** (*"AI builds much cleaner when given one piece at a time. Let's nail the visual effect in the sandbox first, then hook up audio!"*).
- **Negative-Only ("Too slow / boring"):** Coach **Target Contrast** (*"Tell the AI what to aim for instead of what to avoid—like 'make the wheel snap to a sudden heavy stop with a screen-shake.'"*).
- **Fix Loop (2–3 failed tries):** Coach the **Clean Slate Reset** (*"When an AI misses twice in a row, its memory gets cluttered. Starting a fresh chat with a clean 1-sentence goal saves quota!"*).

---

## 5. Adaptive Clarification & Click-Free Choices (Max 2–3 Short Turns)
Speak purely in game-design and creator terms. Diagnose ONLY what is unclear:
1. **Easy-Reply Formatting (A, B, C):** Present choices so he can reply instantly with just a single letter (`A` or `B`) without typing long sentences. Always attach a token cost tag (`[Low Cost]`, `[Medium Cost]`, `[High Cost]`) + Option D ("Mix & match").
2. **ASCII Screen Sketches for Layout:** Before building new UI panels or modals, sketch the layout in a compact text box (<10 lines) and ask: *"Does this screen layout match what you're picturing?"*

---

## 6. The Interactive Sandbox Lab (`sandbox/options.html`)
Because the user never edits code directly, every `sandbox/` prototype must let him compare and dial in settings right in the browser:
1. **Multi-Take Switcher:** Render a top bar with `[Take A] [Take B] [Take C]` buttons inside a single compact file (<140 lines, 3 dummy traits) to toggle between 2–3 distinct visual, Canvas, or animation styles live.
2. **Interactive Live Tweak Sliders:** Include 2–4 simple on-screen sliders/pickers (`Spin Duration`, `Friction/Bounce`, `Glow Size`, `Shake Intensity`) with live number readouts next to them so he can dial in the exact feel and tell you: *"Promote Take B with Friction 1.4 and Glow 18!"*
3. **One-Click Navigation Links:** Maintain a subtle `🧪 Sandbox Lab` button (`href="sandbox/options.html"`) in `index.html`, and a `🏠 Back to Live Arena` link (`href="../index.html"`) inside the top bar of `sandbox/options.html`.

---

## 7. Lock-In Gate, Auto-Changelog & Hands-Off Git (With Instant Undo)
Before promoting anything from `sandbox/` to the live game, summarize in 3 plain-English bullets:
* **Look & Behavior:** (e.g., "Take B God-Tier lightning flash + heavy wheel stop")
* **Settings Locked In:** (e.g., "Friction 1.4, Glow 18px, synced with `sounds.explosion`")
* **Action:** (e.g., "Applying to the live arena, updating the changelog, and saving a git backup")

Ask: *"Ready to make this live in WOF Arena, or want to test another tweak in the sandbox?"*

**When the user confirms promotion to live (or approves a direct bug/trait update):**
1. **Surgical Code Edit:** Read and edit only the specific target lines in the live files. Write zero explanatory code comments.
   * *Trait Sync Rule:* If adding/modifying traits, keep them synced across `js/wheelData.js` (`WHEEL_DATA` + `TRAIT_DESCRIPTIONS`), `js/character.js` (stat mods), and `js/battle.js` (combat effects).
   * *Audio Sync Rule:* Maintain procedural sound cues via `sounds.*` methods in `js/audio.js`.
2. **Update Documentation:** Append a dated entry to [`CHANGELOG.md`](file:///Users/ethan/Documents/Projects/Wheel%20of%20Faith/CHANGELOG.md), update this `AGENTS.md` if major architecture changed, and clear `sandbox/CURRENT_PLAN.md`.
3. **Hands-Off Git Auto-Commit & Instant Rollback:** 
   * Automatically stage all files and create a clean descriptive git commit (`git add -A && git commit -m "..."`). Never make the user run git commands.
   * *Instant Rollback:* If the user says *"Undo that"* or *"Revert the last change"* after a promotion, immediately execute `git revert --no-edit HEAD` (or restore the previous commit) without asking.