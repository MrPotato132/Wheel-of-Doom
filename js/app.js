/**
 * WHEEL OF FAITH - MASTER APPLICATION CONTROLLER
 * Orchestrates Destiny Spin sequence, Free-Spin Sandbox, Level-Up mechanics,
 * modal dialogs, audio cues, and view switching.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Application State
  const state = {
    currentMode: 'destiny', // 'destiny' | 'free' | 'levelup' | 'roster'
    activeWheelId: 'race',
    destinyStep: 0,
    destinyQueue: [],
    fairyPowerSpinsRemaining: 0,
    quickSpin: false,
    selectedCharacterForLevelUp: null
  };

  // DOM Elements
  const wheelCanvas = document.getElementById('wheelCanvas');
  const spinBtn = document.getElementById('spinBtn');
  const instantBtn = document.getElementById('instantBtn');
  const wheelTitle = document.getElementById('wheelTitle');
  const wheelSubtitle = document.getElementById('wheelSubtitle');
  const stepProgress = document.getElementById('stepProgress');
  const progressBar = document.getElementById('progressBar');
  const currentStepBadge = document.getElementById('currentStepBadge');
  const muteBtn = document.getElementById('muteBtn');
  const quickSpinToggle = document.getElementById('quickSpinToggle');
  const viewToggleBtn = document.getElementById('viewToggleBtn');
  const deviceContainer = document.getElementById('deviceContainer');

  // Modals & Panels
  const resultModal = document.getElementById('resultModal');
  const modalContent = document.getElementById('modalContent');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalNextBtn = document.getElementById('modalNextBtn');
  const modalTraitDescCard = document.getElementById('modalTraitDescCard');
  const modalDescTypeBadge = document.getElementById('modalDescTypeBadge');
  const modalDescText = document.getElementById('modalDescText');

  const cardModal = document.getElementById('cardModal');
  const cardModalCloseBtn = document.getElementById('cardModalCloseBtn');
  const cardHeroNameInput = document.getElementById('cardHeroNameInput');
  const btnEditCardName = document.getElementById('btnEditCardName');
  const btnToggleTraitExplain = document.getElementById('btnToggleTraitExplain');
  const explainToggleIcon = document.getElementById('explainToggleIcon');
  const explainToggleText = document.getElementById('explainToggleText');
  const saveCharacterBtn = document.getElementById('saveCharacterBtn');
  const exportCardBtn = document.getElementById('exportCardBtn');
  const copyCardTextBtn = document.getElementById('copyCardTextBtn');
  const restartDestinyBtn = document.getElementById('restartDestinyBtn');

  // Custom Rename Modal Elements
  const renameModal = document.getElementById('renameModal');
  const renameModalCloseBtn = document.getElementById('renameModalCloseBtn');
  const renameModalInput = document.getElementById('renameModalInput');
  const renameConfirmBtn = document.getElementById('renameConfirmBtn');
  const renameRandomBtn = document.getElementById('renameRandomBtn');
  let activeRenameCharId = null;
  let showTraitExplanations = true;

  // Compendium Drawer Elements
  const btnToggleCompendium = document.getElementById('btnToggleCompendium');
  const hubCompendiumDrawer = document.getElementById('hubCompendiumDrawer');
  const compendiumTitle = document.getElementById('compendiumTitle');
  const compendiumCount = document.getElementById('compendiumCount');
  const compendiumItemsList = document.getElementById('compendiumItemsList');
  const compendiumBtnText = document.getElementById('compendiumBtnText');

  // Mode Tabs
  const tabDestiny = document.getElementById('tabDestiny');
  const tabFreeSpin = document.getElementById('tabFreeSpin');
  const tabLevelUp = document.getElementById('tabLevelUp');
  const tabArena = document.getElementById('tabArena');
  const tabRoster = document.getElementById('tabRoster');

  // Arena DOM Elements
  const arenaSection = document.getElementById('arenaSection');
  const btnModeDuel = document.getElementById('btnModeDuel');
  const btnModeFFA = document.getElementById('btnModeFFA');
  const btnAutofillLegends = document.getElementById('btnAutofillLegends');
  const btnResetFighters = document.getElementById('btnResetFighters');
  const arenaFighterChips = document.getElementById('arenaFighterChips');
  const arenaFighterCount = document.getElementById('arenaFighterCount');
  const arenaLobbyHint = document.getElementById('arenaLobbyHint');
  const lobbyAddSelect = document.getElementById('lobbyAddSelect');
  const lobbyAddBtn = document.getElementById('lobbyAddBtn');
  const arenaColosseum = document.getElementById('arenaColosseum');
  const floatingDamageLayer = document.getElementById('floatingDamageLayer');
  const arenaSlashFx = document.getElementById('arenaSlashFx');
  const arenaDuelView = document.getElementById('arenaDuelView');
  const arenaFfaView = document.getElementById('arenaFfaView');
  const ffaGrid = document.getElementById('ffaGrid');
  const startBattleBtn = document.getElementById('startBattleBtn');
  const fightBtnText = document.getElementById('fightBtnText');
  const btnPauseBattle = document.getElementById('btnPauseBattle');
  const arenaLogFeed = document.getElementById('arenaLogFeed');
  const battleStatusBadge = document.getElementById('battleStatusBadge');
  const battleVictoryModal = document.getElementById('battleVictoryModal');
  const victoryModalCloseBtn = document.getElementById('victoryModalCloseBtn');
  const btnLevelUpChampion = document.getElementById('btnLevelUpChampion');
  const btnRematch = document.getElementById('btnRematch');

  // Free Spin Wheel Selectors
  const wheelSelectorHub = document.getElementById('wheelSelectorHub');
  const wheelCategorySelect = document.getElementById('wheelCategorySelect');

  // Level Up Elements
  const levelUpCharSelect = document.getElementById('levelUpCharSelect');
  const levelUpCharPreview = document.getElementById('levelUpCharPreview');

  // Roster Container
  const rosterModal = document.getElementById('rosterModal');
  const rosterList = document.getElementById('rosterList');
  const rosterCloseBtn = document.getElementById('rosterCloseBtn');

  // Live Live-Draft Preview on side panel
  const livePreview = document.getElementById('livePreview');

  // Main Stage Elements for toggling
  const mainStageGrid = document.querySelector('.main-stage-grid');
  const wheelInfoBar = document.querySelector('.wheel-info-bar');

  // Initialize Canvas Wheel
  const wheel = new WheelOfFaith('wheelCanvas', {
    onSpinStart: () => {
      spinBtn.disabled = true;
      instantBtn.disabled = true;
      spinBtn.classList.add('spinning');
    },
    onTick: (pegIndex) => {
      // Audio is handled inside wheel.js via sounds.playTick()
    },
    onSpinEnd: (landedSegment, segmentIndex) => {
      spinBtn.disabled = false;
      instantBtn.disabled = false;
      spinBtn.classList.remove('spinning');
      handleSpinOutcome(landedSegment);
    }
  });

  // Sound Mute Toggle
  updateMuteButtonUI();
  muteBtn.addEventListener('click', () => {
    const isMuted = sounds.toggleMute();
    updateMuteButtonUI();
  });

  function updateMuteButtonUI() {
    if (sounds.isMuted) {
      muteBtn.innerHTML = '🔇 <span class="btn-text">Muted</span>';
      muteBtn.classList.add('muted');
    } else {
      muteBtn.innerHTML = '🔊 <span class="btn-text">Sound On</span>';
      muteBtn.classList.remove('muted');
    }
  }

  // Quick Spin Toggle
  quickSpinToggle.addEventListener('change', (e) => {
    state.quickSpin = e.target.checked;
  });

  // View Mode Toggle (Mobile Phone Arcade View vs Fullscreen Wide View)
  viewToggleBtn.addEventListener('click', () => {
    sounds.playButton();
    const isWide = deviceContainer.classList.toggle('wide-view');
    viewToggleBtn.innerHTML = isWide ? '📱 <span class="btn-text">Mobile View</span>' : '🖥️ <span class="btn-text">Wide View</span>';
    setTimeout(() => wheel.handleResize(), 250);
  });

  // Mode Navigation Tabs
  tabDestiny.addEventListener('click', () => switchMode('destiny'));
  tabFreeSpin.addEventListener('click', () => switchMode('free'));
  tabLevelUp.addEventListener('click', () => switchMode('levelup'));
  tabArena.addEventListener('click', () => switchMode('arena'));
  tabRoster.addEventListener('click', () => switchMode('roster'));

  function switchMode(newMode) {
    sounds.playButton();
    state.currentMode = newMode;

    [tabDestiny, tabFreeSpin, tabLevelUp, tabArena, tabRoster].forEach(btn => btn.classList.remove('active'));
    wheelSelectorHub.classList.add('hidden');
    document.getElementById('levelUpPanel').classList.add('hidden');
    arenaSection.classList.add('hidden');

    if (newMode === 'arena') {
      tabArena.classList.add('active');
      stepProgress.classList.add('hidden');
      wheelInfoBar.classList.add('hidden');
      mainStageGrid.classList.add('hidden');
      arenaSection.classList.remove('hidden');
      initArenaMode();
      return;
    }

    // Default wheel-stage visibility for wheel modes
    wheelInfoBar.classList.remove('hidden');
    mainStageGrid.classList.remove('hidden');

    if (newMode === 'destiny') {
      tabDestiny.classList.add('active');
      stepProgress.classList.remove('hidden');
      startDestinySpinSequence();
    } else if (newMode === 'free') {
      tabFreeSpin.classList.add('active');
      stepProgress.classList.remove('hidden');
      wheelSelectorHub.classList.remove('hidden');
      loadFreeWheel(wheelCategorySelect.value || 'race');
    } else if (newMode === 'levelup') {
      tabLevelUp.classList.add('active');
      stepProgress.classList.remove('hidden');
      document.getElementById('levelUpPanel').classList.remove('hidden');
      initLevelUpMode();
    } else if (newMode === 'roster') {
      tabRoster.classList.add('active');
      openRosterModal();
    }
  }

  // -------------------------------------------------------------
  // MODE 1: DESTINY SPIN (Character Generation Sequence)
  // -------------------------------------------------------------
  function startDestinySpinSequence() {
    characterManager.resetDraft();
    state.destinyStep = 0;
    state.fairyPowerSpinsRemaining = 0;

    // Define sequence
    state.destinyQueue = [
      { id: 'race', category: 'race', name: 'Race Wheel' },
      { id: 'archetype', category: 'archetype', name: 'Archetype Wheel' },
      { id: 'weapon', category: 'weapon', name: 'Weapon Wheel' },
      { id: 'power', category: 'power', name: 'Power Wheel' },
      { id: 'weakness', category: 'weakness', name: 'Weakness Wheel' },
      { id: 'backstory', category: 'backstory', name: 'Backstory & Chaos Wheel' },
      { id: 'stats', category: 'stats', name: 'Combat Rating Wheel' }
    ];

    loadCurrentDestinyStep();
    updateLiveDraftPreview();
  }

  function loadCurrentDestinyStep() {
    if (state.destinyStep >= state.destinyQueue.length) {
      // Sequence completed!
      finishDestinySequence();
      return;
    }

    const currentTask = state.destinyQueue[state.destinyStep];
    state.activeWheelId = currentTask.id;
    const wheelData = WHEEL_DATA[currentTask.id];

    if (!wheelData) {
      console.error('Wheel data not found for:', currentTask.id);
      return;
    }

    wheel.setWheelData(wheelData);

    // Update Header and Badges
    wheelTitle.textContent = `${wheelData.icon || '⚡'} ${wheelData.name}`;
    wheelSubtitle.textContent = wheelData.subtitle || 'Spin to reveal your fate!';

    const totalSteps = state.destinyQueue.length;
    currentStepBadge.textContent = `Step ${state.destinyStep + 1} of ${totalSteps}`;
    const percent = Math.floor(((state.destinyStep) / totalSteps) * 100);
    progressBar.style.width = `${percent}%`;

    updateLiveDraftPreview();
  }

  // -------------------------------------------------------------
  // SPIN ACTIONS
  // -------------------------------------------------------------
  spinBtn.addEventListener('click', () => {
    if (state.quickSpin) {
      wheel.instantSpin();
    } else {
      wheel.spin();
    }
  });

  instantBtn.addEventListener('click', () => {
    wheel.instantSpin();
  });

  // Keyboard shortcut: Spacebar to spin
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && !spinBtn.disabled && resultModal.classList.contains('hidden') && cardModal.classList.contains('hidden')) {
      e.preventDefault();
      if (state.quickSpin) {
        wheel.instantSpin();
      } else {
        wheel.spin();
      }
    }
  });

  // Handle outcome when spin completes
  function handleSpinOutcome(segment) {
    if (state.currentMode === 'destiny') {
      handleDestinyOutcome(segment);
    } else if (state.currentMode === 'levelup') {
      handleLevelUpOutcome(segment);
    } else {
      // Free spin mode
      showOutcomeModal(segment, 'Free Spin Result');
    }
  }

  function handleDestinyOutcome(segment) {
    const currentTask = state.destinyQueue[state.destinyStep];
    characterManager.setAttribute(currentTask.category, segment);
    updateLiveDraftPreview();

    // Check if segment has a subWheel to inject into queue!
    if (segment.subWheel && WHEEL_DATA[segment.subWheel]) {
      const subWheelId = segment.subWheel;
      // Inject next step right after current
      state.destinyQueue.splice(state.destinyStep + 1, 0, {
        id: subWheelId,
        category: currentTask.category === 'race' ? 'subRace' : 'archetypeSub',
        name: WHEEL_DATA[subWheelId].name
      });
    }

    // Fairy power multiplier check
    if (currentTask.id === 'fairyBlessing') {
      if (segment.text.includes('Dual')) {
        state.fairyPowerSpinsRemaining = 2;
      } else if (segment.text.includes('Trinity')) {
        state.fairyPowerSpinsRemaining = 3;
      }
    }

    // Show popup
    showOutcomeModal(segment, currentTask.name, () => {
      // Fairy extra powers handling
      if (currentTask.category === 'power' && state.fairyPowerSpinsRemaining > 1) {
        state.fairyPowerSpinsRemaining--;
        // stay on power step for another spin!
        loadCurrentDestinyStep();
        return;
      }

      state.destinyStep++;
      loadCurrentDestinyStep();
    });
  }

  function handleLevelUpOutcome(segment) {
    if (!state.selectedCharacterForLevelUp) {
      showOutcomeModal(segment, 'Level-Up Spin');
      return;
    }

    characterManager.applyLevelUpReward(state.selectedCharacterForLevelUp, segment);
    renderLevelUpCharacterPreview();

    showOutcomeModal(segment, 'Level-Up Upgrade Acquired!', () => {
      renderLevelUpCharacterPreview();
    });
  }

  // -------------------------------------------------------------
  // OUTCOME MODAL
  // -------------------------------------------------------------
  let onModalNextCallback = null;

  function showOutcomeModal(segment, titleText, onNext = null, overrideCategory = null) {
    onModalNextCallback = onNext;

    let cat = overrideCategory;
    if (!cat) {
      if (state.currentMode === 'destiny' && state.destinyQueue[state.destinyStep]) {
        cat = state.destinyQueue[state.destinyStep].category;
      } else if (state.currentMode === 'levelup') {
        cat = 'levelUp';
      } else {
        cat = state.activeWheelId;
      }
    }

    const desc = getTraitDescription(cat, segment.text);
    const rarity = segment.rarity || 'common';
    const rarityInfo = RARITY_COLORS[rarity] || RARITY_COLORS.common;

    document.getElementById('modalResultTitle').textContent = titleText;
    document.getElementById('modalItemText').textContent = segment.text;
    document.getElementById('modalItemSubtext').textContent = segment.subtext || '';

    // Populate Rich Trait Mechanics & Lore
    if (modalDescText) {
      modalDescText.textContent = desc;
    }
    if (modalDescTypeBadge) {
      const badgeTitles = {
        backstory: '🌀 CHAOS FACTOR & LORE TWIST',
        weakness: '⚠️ COMBAT CURSE & HANDICAP',
        weapon: '🗡️ WEAPON PERK & PASSIVE',
        power: '✨ SUPERNATURAL ABILITY',
        race: '🧬 RACIAL TRAITS & STAT BOOST',
        subRace: '🧬 LINEAGE INHERITANCE',
        archetype: '🛡️ TACTICAL ARCHETYPE ROLE',
        archetypeSub: '🎯 SPECIALTY PREY / RELIC',
        levelUp: '⚡ LEVEL-UP UPGRADE MECHANICS',
        stats: '📊 COMBAT TIER RATING'
      };
      modalDescTypeBadge.textContent = badgeTitles[cat] || '⚡ COMBAT & LORE MECHANICS';
    }

    const badge = document.getElementById('modalRarityBadge');
    badge.textContent = rarityInfo.name.toUpperCase();
    badge.className = `rarity-badge ${rarity}`;

    modalNextBtn.textContent = state.currentMode === 'destiny' ? 'Next Wheel ➔' : 'Awesome!';

    resultModal.classList.remove('hidden');
  }

  modalNextBtn.addEventListener('click', () => {
    sounds.playButton();
    resultModal.classList.add('hidden');
    if (onModalNextCallback) {
      const cb = onModalNextCallback;
      onModalNextCallback = null;
      cb();
    }
  });

  modalCloseBtn.addEventListener('click', () => {
    sounds.playButton();
    resultModal.classList.add('hidden');
    if (onModalNextCallback) {
      const cb = onModalNextCallback;
      onModalNextCallback = null;
      cb();
    }
  });

  // -------------------------------------------------------------
  // DESTINY COMPLETED: REVEAL CHARACTER CARD
  // -------------------------------------------------------------
  function finishDestinySequence() {
    progressBar.style.width = '100%';
    currentStepBadge.textContent = 'Destiny Forged!';
    sounds.playFanfare('godTier');

    renderCharacterCard(characterManager.currentDraft);
    cardModal.classList.remove('hidden');
  }

  function renderCharacterCard(char) {
    if (cardHeroNameInput) {
      cardHeroNameInput.value = char.name;
    }
    document.getElementById('cardHeroTitle').textContent = characterManager.generateFullTitle(char);
    document.getElementById('cardPowerScore').textContent = characterManager.getOverallPower(char);
    document.getElementById('cardLevelBadge').textContent = `Lv. ${char.level || 1}`;

    // Race & Archetype Badges & Displays
    const raceText = char.race ? char.race.text : 'Unknown';
    const subRaceText = char.subRace ? ` (${char.subRace.text})` : '';
    document.getElementById('cardRaceBadge').textContent = raceText + subRaceText;

    const archText = char.archetype ? char.archetype.text : 'Warrior';
    const subArchText = char.archetypeSub ? ` - ${char.archetypeSub.text}` : '';
    document.getElementById('cardArchetypeBadge').textContent = archText + subArchText;

    // Rarity Tags
    const raceRarityEl = document.getElementById('cardRaceRarity');
    if (raceRarityEl) raceRarityEl.textContent = (char.race ? char.race.rarity : 'common').toUpperCase();

    const archRarityEl = document.getElementById('cardArchRarity');
    if (archRarityEl) archRarityEl.textContent = (char.archetype ? char.archetype.rarity : 'class').toUpperCase();

    const weaponRarityEl = document.getElementById('cardWeaponRarity');
    if (weaponRarityEl) weaponRarityEl.textContent = (char.weapon ? char.weapon.rarity : 'weapon').toUpperCase();

    const powerCountEl = document.getElementById('cardPowerCount');
    if (powerCountEl) powerCountEl.textContent = `${char.powers.length} ${char.powers.length === 1 ? 'POWER' : 'POWERS'}`;

    const chaosRarityEl = document.getElementById('cardChaosRarity');
    if (chaosRarityEl) chaosRarityEl.textContent = (char.backstory ? char.backstory.rarity || 'chaos' : 'chaos').toUpperCase();

    // Race Description
    const raceDisplay = document.getElementById('cardRaceDisplay');
    if (raceDisplay) {
      raceDisplay.innerHTML = `<span class="attr-val highlight">${raceText}${subRaceText}</span> <span class="attr-sub">${char.race ? char.race.subtext || '' : ''}</span>`;
    }
    const raceExplain = document.getElementById('cardRaceExplain');
    if (raceExplain) {
      raceExplain.textContent = getTraitDescription('race', char.race ? char.race.text : '');
    }

    // Archetype Description
    const archDisplay = document.getElementById('cardArchetypeDisplay');
    if (archDisplay) {
      archDisplay.innerHTML = `<span class="attr-val highlight">${archText}${subArchText}</span> <span class="attr-sub">${char.archetype ? char.archetype.subtext || '' : ''}</span>`;
    }
    const archExplain = document.getElementById('cardArchExplain');
    if (archExplain) {
      archExplain.textContent = getTraitDescription('archetype', char.archetype ? char.archetype.text : '');
    }

    // Weapon
    const weaponEl = document.getElementById('cardWeapon');
    if (char.weapon) {
      const ench = char.enchantments && char.enchantments.length ? ` [${char.enchantments.join(', ')}]` : '';
      weaponEl.innerHTML = `<span class="attr-val highlight">${char.weapon.text}${ench}</span> <span class="attr-sub">${char.weapon.subtext || ''}</span>`;
    } else {
      weaponEl.textContent = 'Bare Fists';
    }
    const weaponExplain = document.getElementById('cardWeaponExplain');
    if (weaponExplain) {
      weaponExplain.textContent = getTraitDescription('weapon', char.weapon ? char.weapon.text : '');
    }

    // Powers with Detailed Mechanics Box
    const powersEl = document.getElementById('cardPowers');
    if (char.powers && char.powers.length) {
      powersEl.innerHTML = char.powers.map(p => {
        const desc = getTraitDescription('power', p.text);
        return `
          <div class="power-item-wrap">
            <div class="power-tag"><span class="power-name">✨ ${p.text}</span> <span class="power-sub">${p.subtext || ''}</span></div>
            <div class="power-explain-box">${desc}</div>
          </div>
        `;
      }).join('');
    } else {
      powersEl.textContent = 'None';
    }

    // Weakness
    const weaknessEl = document.getElementById('cardWeakness');
    if (char.weakness) {
      weaknessEl.innerHTML = `<span class="attr-val weakness-val">⚠️ ${char.weakness.text}</span> <span class="attr-sub">${char.weakness.subtext || ''}</span>`;
    } else {
      weaknessEl.textContent = 'Unfazed';
    }
    const weaknessExplain = document.getElementById('cardWeaknessExplain');
    if (weaknessExplain) {
      weaknessExplain.textContent = getTraitDescription('weakness', char.weakness ? char.weakness.text : '');
    }

    // Backstory / Chaos Factor
    const backstoryEl = document.getElementById('cardBackstory');
    if (char.backstory) {
      backstoryEl.innerHTML = `<span class="attr-val">🌀 ${char.backstory.text}</span> <span class="attr-sub">${char.backstory.subtext || ''}</span>`;
    } else {
      backstoryEl.textContent = 'Mysterious Vagabond';
    }
    const backstoryExplain = document.getElementById('cardBackstoryExplain');
    if (backstoryExplain) {
      backstoryExplain.textContent = getTraitDescription('backstory', char.backstory ? char.backstory.text : '');
    }

    // Combat Stats Bars
    const s = char.stats;
    setStatBar('statStr', s.str);
    setStatBar('statSpd', s.spd);
    setStatBar('statDur', s.dur);
    setStatBar('statInt', s.int);
    setStatBar('statChaos', s.chaos);

    // Combat Rank
    const rank = char.combatRank ? char.combatRank.rank : 'C';
    const rankEl = document.getElementById('cardRankBadge');
    rankEl.textContent = `RANK ${rank}`;
    rankEl.className = `card-rank-badge rank-${rank}`;

    // Generate Dynamic SVG Avatar
    drawCharacterAvatar(char);
  }

  // Interactive Stat Bars in Card
  const statBars = document.querySelectorAll('.stat-bar-row');
  const statCalloutText = document.getElementById('statCalloutText');
  statBars.forEach(bar => {
    const showDesc = () => {
      const statKey = bar.dataset.stat;
      if (TRAIT_DESCRIPTIONS.stats && TRAIT_DESCRIPTIONS.stats[statKey]) {
        statCalloutText.textContent = TRAIT_DESCRIPTIONS.stats[statKey];
      }
    };
    bar.addEventListener('mouseenter', showDesc);
    bar.addEventListener('click', showDesc);
  });

  // Toggle Trait Descriptions ON/OFF
  if (btnToggleTraitExplain) {
    btnToggleTraitExplain.addEventListener('click', () => {
      sounds.playButton();
      showTraitExplanations = !showTraitExplanations;
      const cardEl = document.querySelector('.character-card');
      if (cardEl) {
        cardEl.classList.toggle('hide-descriptions', !showTraitExplanations);
      }
      explainToggleText.textContent = showTraitExplanations ? 'Trait Guide: ON' : 'Trait Guide: OFF';
      explainToggleIcon.textContent = showTraitExplanations ? '📖' : '📕';
    });
  }

  // Live Inline Rename in Character Card
  if (cardHeroNameInput) {
    cardHeroNameInput.addEventListener('input', (e) => {
      const newName = e.target.value.trim() || 'Nameless Warrior';
      characterManager.currentDraft.name = newName;
      characterManager.renameCharacter(characterManager.currentDraft.id, newName);
      document.getElementById('cardHeroTitle').textContent = characterManager.generateFullTitle(characterManager.currentDraft);
      const liveNameInput = document.getElementById('liveHeroNameInput');
      if (liveNameInput) liveNameInput.value = newName;
    });
  }

  if (btnEditCardName) {
    btnEditCardName.addEventListener('click', () => {
      sounds.playButton();
      if (cardHeroNameInput) {
        cardHeroNameInput.focus();
        cardHeroNameInput.select();
      }
    });
  }

  function setStatBar(id, val) {
    const el = document.getElementById(id);
    if (!el) return;
    const fill = el.querySelector('.stat-fill');
    const num = el.querySelector('.stat-num');
    const maxVal = 180;
    const clampedPercent = Math.min(100, Math.max(10, Math.floor((val / maxVal) * 100)));
    fill.style.width = `${clampedPercent}%`;
    num.textContent = val;
  }

  function drawCharacterAvatar(char) {
    const avatarContainer = document.getElementById('cardAvatarContainer');
    const raceName = char.race ? char.race.text : 'Human';

    const raceEmojis = {
      Human: '⚔️',
      Elf: '🧝',
      Dwarf: '⚒️',
      Demon: '👿',
      Angel: '😇',
      Werewolf: '🐺',
      Orc: '👹',
      Android: '🤖',
      Vampire: '🧛',
      Elemental: '🔥',
      Skeleton: '💀',
      Fairy: '🧚',
      Goblin: '👺',
      Siren: '🧜',
      Dragonkin: '🐲',
      'Cosmic Warrior': '🌌',
      Nucleite: '☣️',
      'Shadow Monarch': '👑',
      Phoenixkin: '🦅',
      Nephilim: '🪽',
      'Cyborg Titan': '🦾',
      Voidwalker: '🌌',
      'Slime Sovereign': '🫧',
      'Eldritch Entity': '🐙',
      'Djinn (Genie)': '🧞',
      'Beastfolk Chimera': '🦁',
      Gargoyle: '🗿',
      'Insectoid Hivemaster': '🦗',
      'Demi-God': '⚡',
      Homunculus: '🧪',
      'Astral Seraph': '✨',
      'Living Armor': '🛡️'
    };

    const emoji = raceEmojis[raceName] || '👑';
    const auraColor = char.race ? char.race.color : '#b3131b';

    avatarContainer.innerHTML = `
      <div class="avatar-glow-ring" style="box-shadow: 0 0 25px ${auraColor}; border-color: ${auraColor}">
        <span class="avatar-emoji">${emoji}</span>
      </div>
    `;
  }

  // Save Character button
  saveCharacterBtn.addEventListener('click', () => {
    sounds.playButton();
    const saved = characterManager.saveCharacter();
    if (saved) {
      saveCharacterBtn.textContent = '✅ Saved to Hall of Fame!';
      saveCharacterBtn.disabled = true;
      setTimeout(() => {
        saveCharacterBtn.textContent = '💾 Save to Hall of Fame';
        saveCharacterBtn.disabled = false;
      }, 2500);
    }
  });

  // Copy Character Summary to clipboard
  copyCardTextBtn.addEventListener('click', () => {
    sounds.playButton();
    const char = characterManager.currentDraft;
    const summary = `⚔️ THE WHEEL OF FAITH - CHARACTER SHEET ⚔️
Hero: ${characterManager.generateFullTitle(char)} (Lv. ${char.level || 1})
Race: ${char.race ? char.race.text : 'Human'}${char.subRace ? ' - ' + char.subRace.text : ''}
Archetype: ${char.archetype ? char.archetype.text : 'Warrior'}
Weapon: ${char.weapon ? char.weapon.text : 'None'}
Powers: ${char.powers.map(p => p.text).join(', ') || 'None'}
Weakness: ${char.weakness ? char.weakness.text : 'None'}
Combat Rank: ${char.combatRank ? char.combatRank.rank : 'C'} (Power: ${characterManager.getOverallPower(char)})
Stats: STR ${char.stats.str} | SPD ${char.stats.spd} | DUR ${char.stats.dur} | INT ${char.stats.int} | CHAOS ${char.stats.chaos}
#TheWheelOfFaith #WoFArena`;

    navigator.clipboard.writeText(summary).then(() => {
      copyCardTextBtn.textContent = '✅ Copied to Clipboard!';
      setTimeout(() => { copyCardTextBtn.textContent = '📋 Copy Summary'; }, 2000);
    });
  });

  // Export Card as Image (Canvas snapshot)
  exportCardBtn.addEventListener('click', () => {
    sounds.playButton();
    exportCardAsImage();
  });

  function exportCardAsImage() {
    const cardEl = document.querySelector('.character-card');
    if (!cardEl) return;

    // Use a high-res offscreen canvas to paint the card
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 920;
    const ctx = canvas.getContext('2d');

    const char = characterManager.currentDraft;

    // Background Dark Slate
    ctx.fillStyle = '#0a0a0e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Gilded Frame
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 6;
    ctx.strokeRect(12, 12, canvas.width - 24, canvas.height - 24);

    ctx.strokeStyle = '#b3131b';
    ctx.lineWidth = 2;
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

    // Header Title
    ctx.fillStyle = '#ffd700';
    ctx.font = 'bold 26px "Cinzel", serif';
    ctx.textAlign = 'center';
    ctx.fillText('THE WHEEL OF FAITH', canvas.width / 2, 60);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px "Outfit", sans-serif';
    ctx.fillText(char.name, canvas.width / 2, 100);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'italic 16px "Outfit", sans-serif';
    ctx.fillText(characterManager.generateFullTitle(char), canvas.width / 2, 128);

    // Power Score
    ctx.fillStyle = '#06b6d4';
    ctx.font = 'bold 18px "Outfit", sans-serif';
    ctx.fillText(`POWER RATING: ${characterManager.getOverallPower(char)}  |  Lv. ${char.level || 1}  |  RANK ${char.combatRank ? char.combatRank.rank : 'C'}`, canvas.width / 2, 160);

    // Separator line
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
    ctx.beginPath();
    ctx.moveTo(50, 180);
    ctx.lineTo(canvas.width - 50, 180);
    ctx.stroke();

    // Attributes List
    ctx.textAlign = 'left';
    ctx.font = 'bold 16px "Outfit", sans-serif';
    let y = 220;

    const printAttr = (label, val, sub = '') => {
      ctx.fillStyle = '#d4af37';
      ctx.fillText(label, 60, y);
      ctx.fillStyle = '#ffffff';
      ctx.fillText(val, 200, y);
      if (sub) {
        ctx.fillStyle = '#94a3b8';
        ctx.font = '13px "Outfit", sans-serif';
        ctx.fillText(`— ${sub}`, 200, y + 20);
        y += 20;
      }
      ctx.font = 'bold 16px "Outfit", sans-serif';
      y += 38;
    };

    printAttr('RACE:', char.race ? char.race.text : 'Human', char.subRace ? char.subRace.text : '');
    printAttr('ARCHETYPE:', char.archetype ? char.archetype.text : 'Warrior', char.archetypeSub ? char.archetypeSub.text : '');
    printAttr('WEAPON:', char.weapon ? char.weapon.text : 'Fists', char.weapon ? char.weapon.subtext : '');
    printAttr('POWERS:', char.powers.map(p => p.text).join(', ') || 'None');
    printAttr('WEAKNESS:', char.weakness ? char.weakness.text : 'None', char.weakness ? char.weakness.subtext : '');
    printAttr('BACKSTORY:', char.backstory ? char.backstory.text : 'Unknown', char.backstory ? char.backstory.subtext : '');

    // Stats Grid
    y += 10;
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
    ctx.beginPath();
    ctx.moveTo(50, y);
    ctx.lineTo(canvas.width - 50, y);
    ctx.stroke();
    y += 35;

    ctx.fillStyle = '#ffd700';
    ctx.font = 'bold 18px "Cinzel", serif';
    ctx.fillText('COMBAT STATISTICS', 60, y);
    y += 30;

    ctx.font = 'bold 15px "Outfit", sans-serif';
    const s = char.stats;
    const statsList = [
      ['STR', s.str, '#dc2626'],
      ['SPD', s.spd, '#0284c7'],
      ['DUR', s.dur, '#16a34a'],
      ['INT', s.int, '#7c3aed'],
      ['CHAOS', s.chaos, '#ef4444']
    ];

    statsList.forEach(([name, val, col], i) => {
      const sx = 60 + (i * 105);
      ctx.fillStyle = col;
      ctx.fillRect(sx, y, 90, 50);
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText(name, sx + 45, y + 20);
      ctx.fillText(val, sx + 45, y + 40);
    });

    // Footer
    ctx.textAlign = 'center';
    ctx.fillStyle = '#64748b';
    ctx.font = '12px "Outfit", sans-serif';
    ctx.fillText('Forged in the Arena of Faith • Created by Bushin', canvas.width / 2, canvas.height - 35);

    // Download trigger
    const link = document.createElement('a');
    link.download = `${char.name}_WheelOfFaith.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  cardModalCloseBtn.addEventListener('click', () => {
    sounds.playButton();
    cardModal.classList.add('hidden');
  });

  restartDestinyBtn.addEventListener('click', () => {
    sounds.playButton();
    cardModal.classList.add('hidden');
    startDestinySpinSequence();
  });

  // -------------------------------------------------------------
  // LIVE DRAFT PREVIEW (During Destiny Sequence)
  // -------------------------------------------------------------
  const liveHeroNameInput = document.getElementById('liveHeroNameInput');
  const btnRandomizeName = document.getElementById('btnRandomizeName');

  if (liveHeroNameInput) {
    liveHeroNameInput.value = characterManager.currentDraft.name;
    liveHeroNameInput.addEventListener('input', (e) => {
      const val = e.target.value.trim() || 'Nameless Warrior';
      characterManager.currentDraft.name = val;
    });
  }

  if (btnRandomizeName) {
    btnRandomizeName.addEventListener('click', () => {
      sounds.playButton();
      const randName = characterManager.generateRandomHeroName();
      characterManager.currentDraft.name = randName;
      if (liveHeroNameInput) liveHeroNameInput.value = randName;
    });
  }

  function updateLiveDraftPreview() {
    const char = characterManager.currentDraft;
    if (liveHeroNameInput && document.activeElement !== liveHeroNameInput) {
      liveHeroNameInput.value = char.name;
    }
    document.getElementById('liveRace').textContent = char.race ? char.race.text : '—';
    document.getElementById('liveArchetype').textContent = char.archetype ? char.archetype.text : '—';
    document.getElementById('liveWeapon').textContent = char.weapon ? char.weapon.text : '—';
    document.getElementById('livePower').textContent = char.powers.length ? char.powers.map(p => p.text).join(', ') : '—';
    document.getElementById('liveWeakness').textContent = char.weakness ? char.weakness.text : '—';
    const liveBackstoryEl = document.getElementById('liveBackstory');
    if (liveBackstoryEl) {
      liveBackstoryEl.textContent = char.backstory ? char.backstory.text : '—';
    }
  }

  // -------------------------------------------------------------
  // MODE 2: FREE-SPIN WHEEL HUB (Sandbox & Almanac)
  // -------------------------------------------------------------
  wheelCategorySelect.addEventListener('change', (e) => {
    sounds.playButton();
    loadFreeWheel(e.target.value);
  });

  // Quick category buttons in Free-Spin Hub
  document.querySelectorAll('.hub-tag-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      sounds.playButton();
      const wheelKey = btn.dataset.wheel;
      wheelCategorySelect.value = wheelKey;
      loadFreeWheel(wheelKey);
    });
  });

  function loadFreeWheel(wheelId) {
    state.activeWheelId = wheelId;
    const data = WHEEL_DATA[wheelId];
    if (!data) return;

    wheel.setWheelData(data);
    wheelTitle.textContent = `${data.icon || '⚡'} ${data.name}`;
    wheelSubtitle.textContent = data.subtitle || 'Free-Spin Mode: spin anytime!';
    currentStepBadge.textContent = 'Free Spin Mode';
    progressBar.style.width = '100%';

    if (hubCompendiumDrawer && !hubCompendiumDrawer.classList.contains('hidden')) {
      renderWheelCompendium();
    }
  }

  // Wheel Compendium Almanac Toggle & Renderer
  if (btnToggleCompendium) {
    btnToggleCompendium.addEventListener('click', () => {
      sounds.playButton();
      const isHidden = hubCompendiumDrawer.classList.toggle('hidden');
      if (!isHidden) {
        renderWheelCompendium();
        compendiumBtnText.textContent = 'Close Wheel Almanac & Mechanics Guide';
      } else {
        compendiumBtnText.textContent = 'Open Wheel Almanac & Mechanics Guide';
      }
    });
  }

  function renderWheelCompendium() {
    const wheelData = WHEEL_DATA[state.activeWheelId];
    if (!wheelData || !compendiumItemsList) return;

    compendiumTitle.textContent = `${wheelData.name} Almanac`;
    compendiumCount.textContent = `${wheelData.segments.length} Segments`;

    compendiumItemsList.innerHTML = wheelData.segments.map((seg, idx) => {
      const rarity = seg.rarity || 'common';
      const rarityInfo = RARITY_COLORS[rarity] || RARITY_COLORS.common;
      const desc = getTraitDescription(state.activeWheelId, seg.text);

      return `
        <div class="compendium-item" data-index="${idx}" style="border-left-color: ${seg.color || rarityInfo.glow}">
          <div class="compendium-item-top">
            <span class="compendium-item-name">${seg.text}</span>
            <span class="compendium-item-rarity ${rarity}" style="background:${rarityInfo.bg}; color:${rarityInfo.text}">${rarityInfo.name}</span>
          </div>
          <div class="compendium-item-desc">${desc}</div>
        </div>
      `;
    }).join('');

    compendiumItemsList.querySelectorAll('.compendium-item').forEach(el => {
      el.addEventListener('click', () => {
        sounds.playButton();
        const idx = parseInt(el.dataset.index, 10);
        wheel.spin(idx);
        hubCompendiumDrawer.classList.add('hidden');
        if (compendiumBtnText) compendiumBtnText.textContent = 'Open Wheel Almanac & Mechanics Guide';
      });
    });
  }

  // -------------------------------------------------------------
  // MODE 3: LEVEL-UP & EVOLUTION WHEEL (WOF Arena feature)
  // -------------------------------------------------------------
  function initLevelUpMode() {
    state.activeWheelId = 'levelUp';
    wheel.setWheelData(WHEEL_DATA.levelUp);

    wheelTitle.textContent = '⚡ WOF ARENA LEVEL-UP WHEEL';
    wheelSubtitle.textContent = 'Spin to grant your fighter bonus stats, weapon enchants, and secondary powers!';
    currentStepBadge.textContent = 'Arena Upgrade';
    progressBar.style.width = '100%';

    populateLevelUpSelect();
  }

  function populateLevelUpSelect() {
    const list = characterManager.getSavedCharacters();
    levelUpCharSelect.innerHTML = '';

    if (!list.length) {
      // Use current draft if exists
      const opt = document.createElement('option');
      opt.value = 'draft';
      opt.textContent = `${characterManager.currentDraft.name} (Active Draft - Lv. ${characterManager.currentDraft.level || 1})`;
      levelUpCharSelect.appendChild(opt);
      state.selectedCharacterForLevelUp = characterManager.currentDraft;
    } else {
      list.forEach((c) => {
        const opt = document.createElement('option');
        opt.value = c.id;
        opt.textContent = `${c.name} (${c.race ? c.race.text : 'Mortal'} - Lv. ${c.level || 1})`;
        levelUpCharSelect.appendChild(opt);
      });
      state.selectedCharacterForLevelUp = list[0];
    }

    renderLevelUpCharacterPreview();
  }

  levelUpCharSelect.addEventListener('change', () => {
    sounds.playButton();
    const id = levelUpCharSelect.value;
    if (id === 'draft') {
      state.selectedCharacterForLevelUp = characterManager.currentDraft;
    } else {
      const list = characterManager.getSavedCharacters();
      state.selectedCharacterForLevelUp = list.find(c => c.id === id) || characterManager.currentDraft;
    }
    renderLevelUpCharacterPreview();
  });

  function renderLevelUpCharacterPreview() {
    const char = state.selectedCharacterForLevelUp;
    if (!char) return;

    levelUpCharPreview.innerHTML = `
      <div class="levelup-preview-card">
        <div class="levelup-head">
          <h4>${char.name}</h4>
          <span class="lvl-badge">Level ${char.level || 1}</span>
        </div>
        <div class="levelup-stats">
          <span>⚔️ STR: <b>${char.stats.str}</b></span>
          <span>⚡ SPD: <b>${char.stats.spd}</b></span>
          <span>🛡️ DUR: <b>${char.stats.dur}</b></span>
          <span>🧠 INT: <b>${char.stats.int}</b></span>
          <span>🌀 CHAOS: <b>${char.stats.chaos}</b></span>
        </div>
        <div class="levelup-powers">
          Powers (${char.powers.length}): <i>${char.powers.map(p => (p.text || p)).join(', ') || 'None'}</i>
        </div>
        ${char.enchantments && char.enchantments.length ? `<div class="levelup-ench">Enchantments: <b>${char.enchantments.join(', ')}</b></div>` : ''}
        ${char.passives && char.passives.length ? `<div class="levelup-ench" style="color:#38bdf8;">Passives: <b>${char.passives.join(', ')}</b></div>` : ''}
      </div>
    `;
  }

  // -------------------------------------------------------------
  // MODE 4: HALL OF FAME (Roster Modal & Renaming)
  // -------------------------------------------------------------
  function openRosterModal() {
    renderRosterList();
    rosterModal.classList.remove('hidden');
  }

  rosterCloseBtn.addEventListener('click', () => {
    sounds.playButton();
    rosterModal.classList.add('hidden');
    switchMode('destiny');
  });

  function renderRosterList() {
    const list = characterManager.getSavedCharacters();
    if (!list.length) {
      rosterList.innerHTML = `
        <div class="roster-empty">
          <p>No warriors have entered the Hall of Fame yet!</p>
          <button class="btn btn-primary" id="rosterCreateBtn">Forge Your First Hero ➔</button>
        </div>
      `;
      document.getElementById('rosterCreateBtn')?.addEventListener('click', () => {
        rosterModal.classList.add('hidden');
        switchMode('destiny');
      });
      return;
    }

    rosterList.innerHTML = list.map(c => `
      <div class="roster-card" data-id="${c.id}">
        <div class="roster-card-header">
          <div>
            <h3>${c.name}</h3>
            <span class="roster-sub">${characterManager.generateFullTitle(c)}</span>
          </div>
          <span class="roster-lvl">Lv. ${c.level || 1}</span>
        </div>
        <div class="roster-pills">
          <span class="pill pill-race">${c.race ? c.race.text : 'Mortal'}</span>
          <span class="pill pill-arch">${c.archetype ? c.archetype.text : 'Warrior'}</span>
          <span class="pill pill-rank">Rank ${c.combatRank ? c.combatRank.rank : 'C'}</span>
        </div>
        <div class="roster-actions">
          <button class="btn btn-sm btn-inspect" data-action="inspect" data-id="${c.id}">View Card 📜</button>
          <button class="btn btn-sm btn-rename" data-action="rename" data-id="${c.id}">Rename ✏️</button>
          <button class="btn btn-sm btn-levelup" data-action="levelup" data-id="${c.id}">Level Up ⚡</button>
          <button class="btn btn-sm btn-delete" data-action="delete" data-id="${c.id}">Delete ✕</button>
        </div>
      </div>
    `).join('');

    // Attach click events on roster cards
    rosterList.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', () => {
        sounds.playButton();
        const action = btn.dataset.action;
        const id = btn.dataset.id;
        const characters = characterManager.getSavedCharacters();
        const char = characters.find(c => c.id === id);

        if (action === 'inspect' && char) {
          characterManager.currentDraft = char;
          renderCharacterCard(char);
          rosterModal.classList.add('hidden');
          cardModal.classList.remove('hidden');
        } else if (action === 'rename' && char) {
          openRenameModal(char);
        } else if (action === 'levelup' && char) {
          rosterModal.classList.add('hidden');
          switchMode('levelup');
          levelUpCharSelect.value = char.id;
          state.selectedCharacterForLevelUp = char;
          renderLevelUpCharacterPreview();
        } else if (action === 'delete') {
          if (confirm('Are you sure you want to retire this warrior from the Hall of Fame?')) {
            characterManager.deleteCharacter(id);
            renderRosterList();
          }
        }
      });
    });
  }

  // -------------------------------------------------------------
  // CUSTOM WARRIOR RENAME MODAL
  // -------------------------------------------------------------
  function openRenameModal(char) {
    activeRenameCharId = char.id;
    if (renameModalInput) {
      renameModalInput.value = char.name;
    }
    if (renameModal) {
      renameModal.classList.remove('hidden');
      setTimeout(() => {
        renameModalInput.focus();
        renameModalInput.select();
      }, 100);
    }
  }

  if (renameModalCloseBtn) {
    renameModalCloseBtn.addEventListener('click', () => {
      sounds.playButton();
      renameModal.classList.add('hidden');
    });
  }

  if (renameRandomBtn) {
    renameRandomBtn.addEventListener('click', () => {
      sounds.playButton();
      const rand = characterManager.generateRandomHeroName();
      if (renameModalInput) renameModalInput.value = rand;
    });
  }

  document.querySelectorAll('.btn-name-suggest').forEach(btn => {
    btn.addEventListener('click', () => {
      sounds.playButton();
      if (renameModalInput) renameModalInput.value = btn.dataset.name;
    });
  });

  if (renameConfirmBtn) {
    renameConfirmBtn.addEventListener('click', confirmCharacterRename);
  }

  if (renameModalInput) {
    renameModalInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        confirmCharacterRename();
      }
    });
  }

  function confirmCharacterRename() {
    sounds.playButton();
    const newName = (renameModalInput.value || '').trim();
    if (!newName) return;

    if (activeRenameCharId) {
      characterManager.renameCharacter(activeRenameCharId, newName);
    }

    if (characterManager.currentDraft && (characterManager.currentDraft.id === activeRenameCharId || activeRenameCharId === 'draft')) {
      characterManager.currentDraft.name = newName;
      if (liveHeroNameInput) liveHeroNameInput.value = newName;
      if (cardHeroNameInput) cardHeroNameInput.value = newName;
    }

    renameModal.classList.add('hidden');
    renderRosterList();
  }

  // -------------------------------------------------------------
  // MODE 5: WOF ARENA (Visual 1v1 & Free-For-All Battles)
  // -------------------------------------------------------------
  const arenaState = {
    submode: 'duel', // 'duel' | 'ffa'
    combatants: [],
    lastWinner: null,
    currentBattleEngine: null
  };

  const battleEngine = new BattleEngine({
    onAction: (actionData) => {
      handleVisualBattleAction(actionData);
    },
    onHpUpdate: (fighter) => {
      updateFighterHpDisplay(fighter);
    },
    onFighterFaint: (victim, killer) => {
      handleVisualFighterFaint(victim, killer);
    },
    onBattleEnd: (winner, rankings) => {
      handleVisualBattleEnd(winner, rankings);
    },
    onLog: (msg, type) => {
      appendArenaLogEntry(msg, type);
    }
  });
  arenaState.currentBattleEngine = battleEngine;

  function initArenaMode() {
    // If no combatants are loaded, default with iconic WoF Legends
    if (arenaState.combatants.length === 0) {
      autofillLegends();
    } else {
      renderArenaFighterChips();
      renderBattleStagePreCombat();
    }
    renderArenaLobbySelect();
  }

  // Submode Toggles (1v1 Duel vs FFA)
  btnModeDuel.addEventListener('click', () => {
    sounds.playButton();
    setArenaSubmode('duel');
  });

  btnModeFFA.addEventListener('click', () => {
    sounds.playButton();
    setArenaSubmode('ffa');
  });

  function setArenaSubmode(submode) {
    if (battleEngine.isRunning) battleEngine.stop();

    arenaState.submode = submode;
    btnModeDuel.classList.toggle('active', submode === 'duel');
    btnModeFFA.classList.toggle('active', submode === 'ffa');

    if (submode === 'duel') {
      arenaLobbyHint.textContent = 'Select 2 fighters for a 1v1 duel';
      arenaDuelView.classList.remove('hidden');
      arenaFfaView.classList.add('hidden');
      if (arenaState.combatants.length > 2) {
        arenaState.combatants = arenaState.combatants.slice(0, 2);
      }
    } else {
      arenaLobbyHint.textContent = 'Select 3 to 8 fighters for a Free-For-All Battle Royale!';
      arenaDuelView.classList.add('hidden');
      arenaFfaView.classList.remove('hidden');
      if (arenaState.combatants.length < 3) {
        autofillLegends(6);
      }
    }

    renderArenaFighterChips();
    renderBattleStagePreCombat();
  }

  // Auto-Fill Legends from WoF Universe
  btnAutofillLegends.addEventListener('click', () => {
    sounds.playButton();
    autofillLegends();
  });

  function autofillLegends(count = null) {
    const legends = characterManager.getLoreLegends();
    if (arenaState.submode === 'duel') {
      arenaState.combatants = [legends[0], legends[1]]; // Bushin vs ETF
    } else {
      const targetCount = count || 6;
      arenaState.combatants = legends.slice(0, targetCount);
    }
    renderArenaFighterChips();
    renderBattleStagePreCombat();
    appendArenaLogEntry(`Colosseum populated with ${arenaState.combatants.length} legendary fighters!`, 'system');
  }

  // Clear Roster
  btnResetFighters.addEventListener('click', () => {
    sounds.playButton();
    if (battleEngine.isRunning) battleEngine.stop();
    arenaState.combatants = [];
    renderArenaFighterChips();
    renderBattleStagePreCombat();
    appendArenaLogEntry('Arena roster cleared.', 'system');
  });

  // Render Fighter Chips in Arena Lobby
  function renderArenaFighterChips() {
    arenaFighterCount.textContent = arenaState.combatants.length;
    arenaFighterChips.innerHTML = arenaState.combatants.map((c, idx) => `
      <div class="fighter-chip" style="border-color: ${c.race && c.race.color ? c.race.color : 'rgba(212,175,55,0.4)'}">
        <span>${getFighterEmoji(c)}</span>
        <span>${c.name}</span>
        <button class="chip-remove" data-index="${idx}" title="Remove fighter">✕</button>
      </div>
    `).join('');

    arenaFighterChips.querySelectorAll('.chip-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(btn.dataset.index, 10);
        arenaState.combatants.splice(idx, 1);
        renderArenaFighterChips();
        renderBattleStagePreCombat();
      });
    });
  }

  // Render Dropdown of Available Warriors to Add
  function renderArenaLobbySelect() {
    lobbyAddSelect.innerHTML = '';

    // Group 1: Saved Hall of Fame Fighters
    const saved = characterManager.getSavedCharacters();
    if (saved.length > 0) {
      const g1 = document.createElement('optgroup');
      g1.label = 'Hall of Fame Warriors';
      saved.forEach(c => {
        const opt = document.createElement('option');
        opt.value = 'saved_' + c.id;
        opt.textContent = `${c.name} (Lv. ${c.level || 1} ${c.race ? c.race.text : ''})`;
        g1.appendChild(opt);
      });
      lobbyAddSelect.appendChild(g1);
    }

    // Group 2: Active Draft Warrior
    if (characterManager.currentDraft && characterManager.currentDraft.race) {
      const g2 = document.createElement('optgroup');
      g2.label = 'Active Draft';
      const opt = document.createElement('option');
      opt.value = 'draft_active';
      opt.textContent = `${characterManager.currentDraft.name} (Current Draft - ${characterManager.currentDraft.race.text})`;
      g2.appendChild(opt);
      lobbyAddSelect.appendChild(g2);
    }

    // Group 3: WoF Universe Legends
    const g3 = document.createElement('optgroup');
    g3.label = 'WoF Universe Legends';
    const legends = characterManager.getLoreLegends();
    legends.forEach(l => {
      const opt = document.createElement('option');
      opt.value = 'legend_' + l.id;
      opt.textContent = `${l.name} (${l.race.text} - ${l.archetype.text})`;
      g3.appendChild(opt);
    });
    lobbyAddSelect.appendChild(g3);
  }

  lobbyAddBtn.addEventListener('click', () => {
    sounds.playButton();
    const val = lobbyAddSelect.value;
    if (!val) return;

    if (arenaState.submode === 'duel' && arenaState.combatants.length >= 2) {
      alert('1v1 Duel can only feature 2 combatants! Switch to Free-For-All to add more.');
      return;
    }
    if (arenaState.combatants.length >= 8) {
      alert('Arena maximum limit is 8 combatants!');
      return;
    }

    let fighterToAdd = null;
    if (val.startsWith('saved_')) {
      const id = val.replace('saved_', '');
      fighterToAdd = characterManager.getSavedCharacters().find(c => c.id === id);
    } else if (val === 'draft_active') {
      fighterToAdd = characterManager.currentDraft;
    } else if (val.startsWith('legend_')) {
      const id = val.replace('legend_', '');
      fighterToAdd = characterManager.getLoreLegends().find(l => l.id === id);
    }

    if (fighterToAdd) {
      arenaState.combatants.push(JSON.parse(JSON.stringify(fighterToAdd)));
      renderArenaFighterChips();
      renderBattleStagePreCombat();
    }
  });

  // Render Visual Stage Before Combat
  function renderBattleStagePreCombat() {
    battleStatusBadge.textContent = 'READY';
    battleStatusBadge.className = 'log-indicator';
    fightBtnText.textContent = 'START BATTLE';
    startBattleBtn.disabled = false;

    if (arenaState.submode === 'duel') {
      const f1 = arenaState.combatants[0];
      const f2 = arenaState.combatants[1];

      setupDuelPod('Left', f1, '⚔️');
      setupDuelPod('Right', f2, '🛡️');
      document.getElementById('duelRoundText').textContent = 'READY';
    } else {
      renderFfaGrid();
    }
  }

  function setupDuelPod(side, fighter, defaultEmoji) {
    const pod = document.getElementById(`pod${side}`);
    const avatar = document.getElementById(`avatar${side}`);
    const lvl = document.getElementById(`lvl${side}`);
    const name = document.getElementById(`name${side}`);
    const weapon = document.getElementById(`weapon${side}`);
    const hpFill = document.getElementById(`hpFill${side}`);
    const hpText = document.getElementById(`hpText${side}`);
    const status = document.getElementById(`statusBar${side}`);

    pod.className = `fighter-pod pod-${side.toLowerCase()}`;
    status.innerHTML = '';

    if (fighter) {
      avatar.textContent = getFighterEmoji(fighter);
      avatar.style.borderColor = fighter.race && fighter.race.color ? fighter.race.color : '#b3131b';
      avatar.style.boxShadow = `0 0 15px ${fighter.race && fighter.race.color ? fighter.race.color : 'rgba(179,19,27,0.4)'}`;
      lvl.textContent = `Lv. ${fighter.level || 1}`;
      name.textContent = fighter.name;
      weapon.textContent = fighter.weapon ? fighter.weapon.text || fighter.weapon : 'Bare Knuckles';
      
      const dur = fighter.stats ? fighter.stats.dur : 50;
      const maxHp = fighter.weakness && (fighter.weakness.text === 'Glass Cannon' || fighter.weakness === 'Glass Cannon') ? 35 : Math.floor(dur * 5.5 + 120 + ((fighter.level || 1) * 20));
      hpFill.style.width = '100%';
      hpFill.className = 'hp-bar-fill';
      hpText.textContent = `${maxHp} / ${maxHp} HP`;
    } else {
      avatar.textContent = defaultEmoji;
      lvl.textContent = '—';
      name.textContent = 'Empty Slot';
      weapon.textContent = 'Select Fighter';
      hpFill.style.width = '0%';
      hpText.textContent = '0 / 0 HP';
    }
  }

  function renderFfaGrid() {
    ffaGrid.innerHTML = arenaState.combatants.map((f, idx) => {
      const dur = f.stats ? f.stats.dur : 50;
      const maxHp = f.weakness && (f.weakness.text === 'Glass Cannon' || f.weakness === 'Glass Cannon') ? 35 : Math.floor(dur * 5.5 + 120 + ((f.level || 1) * 20));
      const col = f.race && f.race.color ? f.race.color : '#b3131b';
      return `
        <div class="ffa-pod" id="ffa_pod_${f.id || idx}" style="border-color: ${col}">
          <div class="ffa-avatar">${getFighterEmoji(f)}</div>
          <div class="ffa-name">${f.name}</div>
          <div class="hp-bar-track">
            <div class="hp-bar-fill" id="ffa_hp_${f.id || idx}" style="width: 100%"></div>
          </div>
          <div class="hp-readout" id="ffa_text_${f.id || idx}">${maxHp} HP</div>
        </div>
      `;
    }).join('');
  }

  function getFighterEmoji(char) {
    const raceName = char.race ? (char.race.text || char.race) : 'Human';
    const raceEmojis = {
      Human: '⚔️', Elf: '🧝', Dwarf: '⚒️', Demon: '👿', Angel: '😇',
      Werewolf: '🐺', Orc: '👹', Android: '🤖', Vampire: '🧛',
      Elemental: '🔥', Skeleton: '💀', Fairy: '🧚', Goblin: '👺',
      Siren: '🧜', Dragonkin: '🐲', 'Cosmic Warrior': '🌌', Nucleite: '☣️',
      'Chaos Incarnate': '🌀', 'Shadow Monarch': '👑', Phoenixkin: '🦅',
      Nephilim: '🪽', 'Cyborg Titan': '🦾', Voidwalker: '🌌',
      'Slime Sovereign': '🫧', 'Eldritch Entity': '🐙', 'Djinn (Genie)': '🧞',
      'Beastfolk Chimera': '🦁', Gargoyle: '🗿', 'Insectoid Hivemaster': '🦗',
      'Demi-God': '⚡', Homunculus: '🧪', 'Astral Seraph': '✨', 'Living Armor': '🛡️'
    };
    return raceEmojis[raceName] || '👑';
  }

  // Battle Start / Controls
  startBattleBtn.addEventListener('click', () => {
    handleStartBattle();
  });

  function handleStartBattle() {
    sounds.playButton();

    if (battleEngine.isRunning) {
      // If already running, pause or resume
      battleEngine.pause();
      fightBtnText.textContent = battleEngine.isPaused ? 'RESUME BATTLE' : 'FIGHTING...';
      btnPauseBattle.textContent = battleEngine.isPaused ? '▶️ Resume' : '⏸️ Pause';
      return;
    }

    if (arenaState.submode === 'duel' && arenaState.combatants.length < 2) {
      alert('1v1 Duel requires 2 combatants! Click "Auto-Fill Legends" or add a hero.');
      return;
    }

    if (arenaState.submode === 'ffa' && arenaState.combatants.length < 2) {
      alert('Free-For-All requires at least 2 fighters!');
      return;
    }

    // Initialize Engine
    const fighters = battleEngine.setupBattle(arenaState.combatants, arenaState.submode);
    battleStatusBadge.textContent = 'BATTLE IN PROGRESS';
    battleStatusBadge.className = 'log-indicator fighting';
    fightBtnText.textContent = 'FIGHTING...';

    // Clear feed & play fanfare
    arenaLogFeed.innerHTML = '';
    sounds.playFanfare('rare');
    appendArenaLogEntry(`🔔 THE COLOSSEUM GONG SOUNDS! Battle initiated!`, 'system');

    // Begin Combat
    battleEngine.start();
  }

  btnPauseBattle.addEventListener('click', () => {
    sounds.playButton();
    if (battleEngine.isRunning) {
      battleEngine.pause();
      btnPauseBattle.textContent = battleEngine.isPaused ? '▶️ Resume' : '⏸️ Pause';
      fightBtnText.textContent = battleEngine.isPaused ? 'RESUME BATTLE' : 'FIGHTING...';
    }
  });

  // Battle Speed Toggles
  document.querySelectorAll('.speed-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      sounds.playButton();
      document.querySelectorAll('.speed-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const spd = parseFloat(btn.dataset.speed);
      battleEngine.setSpeed(spd);
    });
  });

  // Visual Battle Action Callback
  function handleVisualBattleAction(data) {
    const { type, attacker, target, damage, isCrit, text, sound } = data;

    // 1. Screen Shake on criticals or heavy blows
    if (isCrit || damage > 50 || type === 'explosion') {
      arenaColosseum.classList.add('screen-shake');
      setTimeout(() => arenaColosseum.classList.remove('screen-shake'), 320);
    }

    // 2. Animate Attacker & Target Pods
    if (arenaState.submode === 'duel') {
      const isAttackerLeft = attacker && attacker.id === battleEngine.fighters[0].id;
      const attackerPod = document.getElementById(isAttackerLeft ? 'podLeft' : 'podRight');
      const targetPod = document.getElementById(isAttackerLeft ? 'podRight' : 'podLeft');

      if (attackerPod) {
        attackerPod.classList.add(isAttackerLeft ? 'lunge-left' : 'lunge-right');
        setTimeout(() => attackerPod.classList.remove(isAttackerLeft ? 'lunge-left' : 'lunge-right'), 350);
      }

      if (targetPod && target && target.id !== attacker.id) {
        targetPod.classList.add('hit-shake');
        setTimeout(() => targetPod.classList.remove('hit-shake'), 350);
      }

      // Spawn Slash FX at target
      if (target && targetPod) {
        spawnSlashFX(targetPod);
        spawnFloatingDamage(targetPod, text, isCrit, type);
      }
    } else {
      // FFA Animations
      const attPod = document.getElementById(`ffa_pod_${attacker.id}`);
      if (attPod) {
        attPod.classList.add('active-turn');
        setTimeout(() => attPod.classList.remove('active-turn'), 450);
      }

      if (target && target.id !== attacker.id) {
        const tgtPod = document.getElementById(`ffa_pod_${target.id}`);
        if (tgtPod) {
          tgtPod.classList.add('target-focus', 'hit-shake');
          setTimeout(() => tgtPod.classList.remove('target-focus', 'hit-shake'), 450);
          spawnSlashFX(tgtPod);
          spawnFloatingDamage(tgtPod, text, isCrit, type);
        }
      }
    }
  }

  function spawnSlashFX(targetEl) {
    const rect = targetEl.getBoundingClientRect();
    const stageRect = arenaColosseum.getBoundingClientRect();

    arenaSlashFx.style.left = `${rect.left - stageRect.left + (rect.width / 2) - 70}px`;
    arenaSlashFx.style.top = `${rect.top - stageRect.top + (rect.height / 2)}px`;
    arenaSlashFx.style.setProperty('--angle', `${Math.floor(Math.random() * 80 - 40)}deg`);
    arenaSlashFx.classList.remove('hidden');

    setTimeout(() => {
      arenaSlashFx.classList.add('hidden');
    }, 240);
  }

  function spawnFloatingDamage(targetEl, text, isCrit, type) {
    const rect = targetEl.getBoundingClientRect();
    const stageRect = arenaColosseum.getBoundingClientRect();

    const el = document.createElement('div');
    el.className = `floating-dmg-item ${isCrit ? 'crit' : ''} ${type || ''}`;
    el.textContent = text || '-30';
    el.style.left = `${rect.left - stageRect.left + (rect.width / 2)}px`;
    el.style.top = `${rect.top - stageRect.top + 20}px`;

    floatingDamageLayer.appendChild(el);
    setTimeout(() => {
      if (el.parentElement) el.parentElement.removeChild(el);
    }, 950);
  }

  // Update Live HP Bars
  function updateFighterHpDisplay(fighter) {
    const percent = Math.max(0, Math.min(100, Math.floor((fighter.currentHp / fighter.maxHp) * 100)));

    if (arenaState.submode === 'duel') {
      const isLeft = fighter.id === battleEngine.fighters[0].id;
      const fill = document.getElementById(isLeft ? 'hpFillLeft' : 'hpFillRight');
      const text = document.getElementById(isLeft ? 'hpTextLeft' : 'hpTextRight');

      if (fill) {
        fill.style.width = `${percent}%`;
        fill.classList.toggle('warn', percent < 50 && percent >= 25);
        fill.classList.toggle('danger', percent < 25);
      }
      if (text) {
        text.textContent = `${fighter.currentHp} / ${fighter.maxHp} HP`;
      }
    } else {
      const fill = document.getElementById(`ffa_hp_${fighter.id}`);
      const text = document.getElementById(`ffa_text_${fighter.id}`);
      if (fill) {
        fill.style.width = `${percent}%`;
        fill.classList.toggle('warn', percent < 50 && percent >= 25);
        fill.classList.toggle('danger', percent < 25);
      }
      if (text) {
        text.textContent = `${fighter.currentHp} HP`;
      }
    }
  }

  // Handle Fighter KO
  function handleVisualFighterFaint(victim, killer) {
    if (arenaState.submode === 'duel') {
      const isLeft = victim.id === battleEngine.fighters[0].id;
      const pod = document.getElementById(isLeft ? 'podLeft' : 'podRight');
      if (pod) pod.classList.add('is-ko');
    } else {
      const pod = document.getElementById(`ffa_pod_${victim.id}`);
      if (pod) pod.classList.add('is-ko');
    }
  }

  // Handle Battle Finished
  function handleVisualBattleEnd(winner, rankings) {
    battleStatusBadge.textContent = 'VICTORY!';
    battleStatusBadge.className = 'log-indicator';
    fightBtnText.textContent = 'REMATCH ⚔️';
    arenaState.lastWinner = winner;

    setTimeout(() => {
      showBattleVictoryModal(winner, rankings);
    }, 900);
  }

  function showBattleVictoryModal(champ, rankings) {
    document.getElementById('champAvatar').textContent = getFighterEmoji(champ);
    document.getElementById('champName').textContent = champ.name;
    document.getElementById('champTitle').textContent = champ.fullTitle || 'The Arena Champion';
    document.getElementById('champKills').textContent = champ.kills || 0;
    document.getElementById('champDamage').textContent = champ.damageDealt || 0;
    document.getElementById('champLevel').textContent = `Lv. ${champ.level || 1}`;

    battleVictoryModal.classList.remove('hidden');
  }

  // Level Up Champion on the Wheel Button
  btnLevelUpChampion.addEventListener('click', () => {
    sounds.playButton();
    battleVictoryModal.classList.add('hidden');
    const winner = arenaState.lastWinner;
    if (!winner) return;

    // Switch to Level-Up Wheel mode
    switchMode('levelup');

    // If winner is saved in Hall of Fame or is active draft, select them
    let found = characterManager.getSavedCharacters().find(c => c.id === winner.id || c.name === winner.name);
    if (!found) {
      // Save winner into Hall of Fame so they can be leveled up!
      const charToSave = winner.originalData || winner;
      characterManager.saveCharacter(charToSave);
      populateLevelUpSelect();
      found = charToSave;
    }

    if (found) {
      levelUpCharSelect.value = found.id;
      state.selectedCharacterForLevelUp = found;
      renderLevelUpCharacterPreview();
    }
  });

  btnRematch.addEventListener('click', () => {
    sounds.playButton();
    battleVictoryModal.classList.add('hidden');
    handleStartBattle();
  });

  victoryModalCloseBtn.addEventListener('click', () => {
    sounds.playButton();
    battleVictoryModal.classList.add('hidden');
  });

  function appendArenaLogEntry(msg, type = 'normal') {
    const el = document.createElement('div');
    el.className = `log-entry ${type}`;
    el.textContent = msg;
    arenaLogFeed.appendChild(el);
    arenaLogFeed.scrollTop = arenaLogFeed.scrollHeight;
  }

  // Initial Boot: Start Destiny Spin sequence
  startDestinySpinSequence();
});
