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
    if (wheel && typeof wheel.setEqualizerMode === 'function') {
      wheel.setEqualizerMode(false);
    }

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

    // Equaliser archetype perk: equalize all remaining wheel slices!
    if (currentTask.category === 'archetype' && segment.text === 'Equaliser') {
      if (wheel && typeof wheel.setEqualizerMode === 'function') {
        wheel.setEqualizerMode(true);
      }
    }

    // Check if segment has a subWheel to inject into queue!
    if (segment.subWheel && WHEEL_DATA[segment.subWheel]) {
      const subWheelId = segment.subWheel;
      let injectedCategory = 'archetypeSub';
      if (currentTask.category === 'race') injectedCategory = 'subRace';
      else if (currentTask.category === 'power') injectedCategory = 'domainType';

      // Inject next step right after current
      state.destinyQueue.splice(state.destinyStep + 1, 0, {
        id: subWheelId,
        category: injectedCategory,
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
        archetypeSub: '🎯 SPECIALTY WAGER / RELIC',
        domainType: '🌑 DOMAIN EXPANSION REALM',
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
        const isDomain = p.text.includes('Domain Expansion');
        const domainText = (isDomain && char.domainName) ? ` - Realm: 「${char.domainName}」` : '';
        const domainDesc = (isDomain && char.domainName) ? `<br><b>Domain Realm:</b> ${getTraitDescription('domainType', char.domainName)}` : '';
        return `
          <div class="power-item-wrap">
            <div class="power-tag"><span class="power-name">✨ ${p.text}${domainText}</span> <span class="power-sub">${p.subtext || ''}</span></div>
            <div class="power-explain-box">${desc}${domainDesc}</div>
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

    // Generate Animated Genshin-Impact Style Splash Card
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
      const bannerNameEl = document.getElementById('genshinSplashBannerName');
      if (bannerNameEl) bannerNameEl.textContent = newName.toUpperCase();
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

  // Active animation frame tracker for Genshin Character Splash Card
  let activeSplashAnimId = null;

  function hashCharString(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return Math.abs(h);
  }

  function drawCharacterAvatar(char) {
    const avatarContainer = document.getElementById('cardAvatarContainer');
    if (!avatarContainer) return;

    if (activeSplashAnimId) {
      cancelAnimationFrame(activeSplashAnimId);
      activeSplashAnimId = null;
    }

    const raceName = char.race ? char.race.text : 'Human';
    const subRaceName = char.subRace ? char.subRace.text : '';
    const archetypeName = char.archetype ? char.archetype.text : 'Warrior';
    const subArchName = char.archetypeSub ? char.archetypeSub.text : '';
    const weaponName = char.weapon ? char.weapon.text : 'Bare Fists';
    const powerList = (char.powers && char.powers.length) ? char.powers.map(p => p.text) : [];
    const powerName = powerList[0] || '';
    const weaknessName = char.weakness ? char.weakness.text : '';
    const backstoryName = char.backstory ? char.backstory.text : '';
    const rarity = char.race ? (char.race.rarity || 'common') : 'common';

    const seedStr = `${char.id || ''}_${raceName}_${subRaceName}_${archetypeName}_${subArchName}_${weaponName}_${powerList.join(',')}`;
    const seed = hashCharString(seedStr);

    // 1. Star Rating & Rarity Tier
    let starCount = 3;
    let starClass = 'stars-3';
    if (rarity === 'godTier' || rarity === 'mythic') {
      starCount = 5;
      starClass = 'stars-5';
    } else if (rarity === 'legendary' || rarity === 'epic') {
      starCount = 4;
      starClass = 'stars-4';
    }
    const starsHtml = Array.from({ length: starCount }, (_, i) =>
      `<span class="genshin-star" style="animation-delay:${(0.45 + i * 0.1).toFixed(2)}s">★</span>`
    ).join('');

    // 2. Elemental Vision & Signature Palette
    const combinedText = `${raceName} ${subRaceName} ${archetypeName} ${subArchName} ${weaponName} ${powerList.join(' ')}`.toLowerCase();
    let elemIcon = '✦';
    let elemName = 'ASTRAL';
    let primaryColor = '#38bdf8';
    let secondaryColor = '#0284c7';
    let glowColor = '#bae6fd';

    if (combinedText.includes('pyro') || combinedText.includes('fire') || combinedText.includes('flame') || combinedText.includes('solar') || combinedText.includes('phoenix') || combinedText.includes('infernal') || combinedText.includes('hell')) {
      elemIcon = '🔥';
      elemName = 'PYRO';
      primaryColor = '#38bdf8';
      secondaryColor = '#f97316';
      glowColor = '#7dd3fc';
    } else if (combinedText.includes('cryo') || combinedText.includes('ice') || combinedText.includes('frost') || combinedText.includes('glacier') || combinedText.includes('winter')) {
      elemIcon = '❄️';
      elemName = 'CRYO';
      primaryColor = '#7dd3fc';
      secondaryColor = '#0284c7';
      glowColor = '#e0f2fe';
    } else if (combinedText.includes('electro') || combinedText.includes('lightning') || combinedText.includes('thunder') || combinedText.includes('storm') || combinedText.includes('cyber') || combinedText.includes('railgun')) {
      elemIcon = '⚡';
      elemName = 'ELECTRO';
      primaryColor = '#00f0ff';
      secondaryColor = '#2563eb';
      glowColor = '#a5f3fc';
    } else if (combinedText.includes('wind') || combinedText.includes('gale') || combinedText.includes('tempest') || combinedText.includes('sky') || combinedText.includes('elf') || combinedText.includes('fairy')) {
      elemIcon = '🌪️';
      elemName = 'ANEMO';
      primaryColor = '#2dd4bf';
      secondaryColor = '#0284c7';
      glowColor = '#99f6e4';
    } else if (combinedText.includes('water') || combinedText.includes('ocean') || combinedText.includes('tidal') || combinedText.includes('merfolk') || combinedText.includes('siren') || combinedText.includes('leviathan') || combinedText.includes('kraken')) {
      elemIcon = '💧';
      elemName = 'HYDRO';
      primaryColor = '#3b82f6';
      secondaryColor = '#1d4ed8';
      glowColor = '#93c5fd';
    } else if (combinedText.includes('void') || combinedText.includes('shadow') || combinedText.includes('abyss') || combinedText.includes('demon') || combinedText.includes('vampire') || combinedText.includes('eldritch') || combinedText.includes('death') || combinedText.includes('necro')) {
      elemIcon = '🌌';
      elemName = 'ABYSS';
      primaryColor = '#60a5fa';
      secondaryColor = '#4f46e5';
      glowColor = '#c7d2fe';
    } else if (combinedText.includes('golem') || combinedText.includes('dwarf') || combinedText.includes('giant') || combinedText.includes('stone') || combinedText.includes('titan') || combinedText.includes('gargoyle')) {
      elemIcon = '🪨';
      elemName = 'GEO';
      primaryColor = '#38bdf8';
      secondaryColor = '#0369a1';
      glowColor = '#bae6fd';
    } else {
      elemIcon = '✦';
      elemName = 'CELESTIA';
      primaryColor = '#38bdf8';
      secondaryColor = '#1d4ed8';
      glowColor = '#e0f2fe';
    }

    const constellationTitle = `Constellation: ${subRaceName || raceName} ${archetypeName}`;
    const displayWeapon = weaponName;
    const displaySubTrait = subArchName || subRaceName || powerName || 'Origin Awakened';

    avatarContainer.innerHTML = `
      <div class="genshin-card-showcase" style="--element-color: ${primaryColor}; --aura-color: ${glowColor}">
        <canvas id="genshinSplashCanvas" class="genshin-splash-canvas" width="460" height="310"></canvas>
        
        <div class="showcase-top-hud">
          <div class="showcase-element-badge" style="border-color: ${glowColor}; background: linear-gradient(135deg, rgba(7, 18, 38, 0.9), rgba(14, 116, 144, 0.65))">
            <span class="elem-icon">${elemIcon}</span>
            <span class="elem-name">${elemName}</span>
          </div>
          <div class="showcase-right-hud">
            <button type="button" class="btn-replay-wish" id="btnReplayWish" title="Replay Genshin Wish Entrance">✨ Wish</button>
            <div class="showcase-stars ${starClass}">${starsHtml}</div>
          </div>
        </div>

        <div class="genshin-splash-banner">
          <div class="splash-banner-tag">${constellationTitle}</div>
          <div class="splash-banner-name" id="genshinSplashBannerName">${(char.name || 'Nameless Warrior').toUpperCase()}</div>
          <div class="splash-banner-traits">
            <span class="splash-chip">🗡️ ${displayWeapon}</span>
            <span class="splash-chip">✨ ${displaySubTrait}</span>
          </div>
        </div>

        <div class="showcase-level-pill">Lv. ${char.level || 1}</div>
      </div>
    `;

    const canvas = document.getElementById('genshinSplashCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Initialize Wish Entrance & Ambient Particles
    let wishStartTime = performance.now();
    const btnReplay = document.getElementById('btnReplayWish');
    if (btnReplay) {
      btnReplay.addEventListener('click', (e) => {
        e.stopPropagation();
        sounds.playFanfare(rarity === 'godTier' ? 'godTier' : 'legendary');
        wishStartTime = performance.now();
      });
    }

    // Generate deterministic constellation nodes unique to this character
    const constellationNodes = [];
    const nodeCount = 6 + (seed % 4);
    for (let i = 0; i < nodeCount; i++) {
      const angle = (i / nodeCount) * Math.PI * 2 + ((seed % 100) * 0.03);
      const rad = 72 + ((seed >> (i + 1)) % 38);
      constellationNodes.push({
        x: Math.cos(angle) * rad,
        y: Math.sin(angle) * rad,
        lit: i < starCount + 1
      });
    }

    // Ambient elemental particles
    const particles = Array.from({ length: 34 }, (_, i) => ({
      x: ((seed * (i + 3)) % 460),
      y: ((seed * (i + 7)) % 310),
      vx: (((seed >> (i % 8)) % 20) - 10) * 0.025,
      vy: -0.35 - ((i % 7) * 0.14),
      size: 1.5 + (i % 4) * 1.1,
      alpha: 0.25 + (i % 5) * 0.14,
      phase: i * 0.7
    }));

    const rLow = `${raceName} ${subRaceName}`.toLowerCase();
    const aLow = `${archetypeName} ${subArchName}`.toLowerCase();
    const wLow = weaponName.toLowerCase();
    const pLow = powerList.join(' ').toLowerCase();

    // Unique Hair & Armor Palette derived from character traits & seed
    const hairPalettes = [
      '#e2e8f0', '#38bdf8', '#93c5fd', '#f8fafc', '#cbd5e1',
      '#7dd3fc', '#60a5fa', '#1e293b', '#f1f5f9', '#bae6fd'
    ];
    let hairColor = hairPalettes[seed % hairPalettes.length];
    let skinColor = '#f1f5f9';
    let eyeColor = '#00f0ff';
    let armorMain = '#0f2547';
    let armorTrim = primaryColor;

    if (rLow.includes('orc') || rLow.includes('goblin') || rLow.includes('troll')) {
      skinColor = '#6ee7b7';
      eyeColor = '#38bdf8';
    } else if (rLow.includes('demon') || rLow.includes('devil') || rLow.includes('tiefling')) {
      skinColor = '#cbd5e1';
      eyeColor = '#38bdf8';
      hairColor = '#0f172a';
    } else if (rLow.includes('dark elf') || rLow.includes('shadow') || rLow.includes('void')) {
      skinColor = '#94a3b8';
      hairColor = '#f8fafc';
      eyeColor = '#00f0ff';
    } else if (rLow.includes('skeleton') || rLow.includes('lich') || rLow.includes('undead')) {
      skinColor = '#e2e8f0';
      eyeColor = '#00f0ff';
    } else if (rLow.includes('golem') || rLow.includes('gargoyle')) {
      skinColor = '#64748b';
      eyeColor = '#38bdf8';
    } else if (rLow.includes('android') || rLow.includes('cyborg') || rLow.includes('nucleite')) {
      skinColor = '#94a3b8';
      eyeColor = '#00f0ff';
    }

    function renderFrame(now) {
      if (!document.body.contains(canvas)) {
        activeSplashAnimId = null;
        return;
      }

      const elapsed = (now - wishStartTime) / 1000;
      const t = now / 1000;
      const W = canvas.width;
      const H = canvas.height;

      ctx.clearRect(0, 0, W, H);

      // 1. Deep Celestial Genshin Splash Backdrop
      const bgGrad = ctx.createRadialGradient(W * 0.52, H * 0.44, 15, W * 0.5, H * 0.5, W * 0.72);
      bgGrad.addColorStop(0, '#133163');
      bgGrad.addColorStop(0.55, '#091936');
      bgGrad.addColorStop(1, '#040b18');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, W, H);

      // Diagonal Gacha Speed-Lines & Light Beams
      ctx.save();
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
      ctx.lineWidth = 1.5;
      for (let i = -3; i < 10; i++) {
        const xOff = i * 58 + ((t * 14) % 58);
        ctx.beginPath();
        ctx.moveTo(xOff, 0);
        ctx.lineTo(xOff - 140, H);
        ctx.stroke();
      }
      ctx.restore();

      // 2. Rotating Arcane Constellation & Astrolabe Ring Behind Character
      const cx = W * 0.52;
      const cy = H * 0.48;

      ctx.save();
      ctx.translate(cx, cy);

      // Outer Astrolabe Ring
      ctx.save();
      ctx.rotate(t * 0.22);
      ctx.strokeStyle = 'rgba(125, 211, 252, 0.24)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([8, 6]);
      ctx.beginPath();
      ctx.arc(0, 0, 108, 0, Math.PI * 2);
      ctx.stroke();

      ctx.setLineDash([]);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.16)';
      ctx.beginPath();
      ctx.arc(0, 0, 94, 0, Math.PI * 2);
      ctx.stroke();

      // Sacred Geometry Square inside Astrolabe
      for (let r = 0; r < 2; r++) {
        ctx.save();
        ctx.rotate((r * Math.PI) / 4);
        ctx.strokeRect(-66, -66, 132, 132);
        ctx.restore();
      }
      ctx.restore();

      // Character-Unique Constellation Graph
      ctx.save();
      ctx.rotate(-t * 0.08);
      ctx.strokeStyle = 'rgba(186, 230, 253, 0.35)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      constellationNodes.forEach((pt, idx) => {
        if (idx === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      });
      ctx.closePath();
      ctx.stroke();

      constellationNodes.forEach((pt, idx) => {
        const pulse = 1 + 0.25 * Math.sin(t * 3 + idx);
        ctx.fillStyle = pt.lit ? '#e0f2fe' : 'rgba(148, 163, 184, 0.45)';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = pt.lit ? 8 : 0;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, (pt.lit ? 3.2 : 2) * pulse, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();

      // Power-Specific Background Phenomenon (Time Stop, Black Hole, Domain Expansion)
      if (pLow.includes('time') || pLow.includes('chrono')) {
        // Clockwork Roman Dial
        ctx.save();
        ctx.rotate(t * 0.6);
        ctx.strokeStyle = 'rgba(224, 242, 254, 0.45)';
        ctx.lineWidth = 2;
        for (let h = 0; h < 12; h++) {
          const ang = (h / 12) * Math.PI * 2;
          ctx.beginPath();
          ctx.moveTo(Math.cos(ang) * 78, Math.sin(ang) * 78);
          ctx.lineTo(Math.cos(ang) * 88, Math.sin(ang) * 88);
          ctx.stroke();
        }
        ctx.restore();
      }
      if (pLow.includes('black hole') || pLow.includes('void') || pLow.includes('gravity')) {
        const bhGrad = ctx.createRadialGradient(-65, -45, 4, -65, -45, 36);
        bhGrad.addColorStop(0, '#000000');
        bhGrad.addColorStop(0.5, '#1e3a8a');
        bhGrad.addColorStop(0.8, '#38bdf8');
        bhGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = bhGrad;
        ctx.beginPath();
        ctx.arc(-65, -45, 36, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // 3. Pedestal Platform Under Character
      ctx.save();
      ctx.translate(cx, H - 36);
      const pedGrad = ctx.createRadialGradient(0, 0, 6, 0, 0, 88);
      pedGrad.addColorStop(0, 'rgba(56, 189, 248, 0.55)');
      pedGrad.addColorStop(0.6, 'rgba(14, 116, 144, 0.22)');
      pedGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = pedGrad;
      ctx.beginPath();
      ctx.ellipse(0, 0, 86, 18, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = glowColor;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.ellipse(0, 0, 64 + Math.sin(t * 2.5) * 3, 12, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // 4. Character Entrance Scale & Floating Breathing Motion
      const revealProgress = Math.min(1, Math.max(0, (elapsed - 0.18) / 0.45));
      const easeOutBack = revealProgress < 1
        ? 1 + 1.7 * Math.pow(revealProgress - 1, 3) + 0.7 * Math.pow(revealProgress - 1, 2)
        : 1;

      const isFloatingRace = rLow.includes('angel') || rLow.includes('seraph') || rLow.includes('fairy') ||
        rLow.includes('djinn') || rLow.includes('spirit') || rLow.includes('god') ||
        rLow.includes('eldritch') || rLow.includes('phoenix') || pLow.includes('flight');
      const bobY = Math.sin(t * (isFloatingRace ? 3.2 : 2.3)) * (isFloatingRace ? 6.5 : 3.2);
      const breatheScale = 1 + Math.sin(t * 2.3) * 0.015;

      if (revealProgress > 0.02) {
        ctx.save();
        ctx.translate(cx, cy + 18 + bobY);
        ctx.scale(easeOutBack * breatheScale, easeOutBack * breatheScale);

        // --- LAYER A: BACK COMPANIONS / STANDS / SHADOW ARMY / TENTACLES ---
        if (rLow.includes('reincarnation') || rLow.includes('spirit') || aLow.includes('summoner') || pLow.includes('necromancy') || rLow.includes('shadow monarch')) {
          // Ethereal Guardian Spirit / Shadow Stand behind the hero
          ctx.save();
          ctx.translate(-26, -38 + Math.sin(t * 3) * 4);
          ctx.globalAlpha = 0.42 + 0.12 * Math.sin(t * 4);
          ctx.fillStyle = '#38bdf8';
          ctx.shadowColor = '#00f0ff';
          ctx.shadowBlur = 16;
          // Hooded Sovereign Stand Silhouette
          ctx.beginPath();
          ctx.arc(0, -45, 16, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.moveTo(-28, -24);
          ctx.lineTo(28, -24);
          ctx.lineTo(18, 42);
          ctx.lineTo(-18, 42);
          ctx.closePath();
          ctx.fill();
          // Glowing Stand Eyes
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(-7, -47, 5, 2.5);
          ctx.fillRect(2, -47, 5, 2.5);
          ctx.restore();
        }

        if (rLow.includes('eldritch') || rLow.includes('kraken') || pLow.includes('tentacle')) {
          // Animated Writhing Cosmic Tentacles
          ctx.save();
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 6;
          ctx.lineCap = 'round';
          for (let k = 0; k < 6; k++) {
            const side = k % 2 === 0 ? -1 : 1;
            const baseAng = side * (0.4 + (k * 0.22));
            const wave = Math.sin(t * 3.5 + k) * 14;
            ctx.beginPath();
            ctx.moveTo(0, -10);
            ctx.quadraticCurveTo(side * 48, -35 + wave, side * (78 + k * 6), -65 - k * 8 + wave);
            ctx.stroke();
          }
          ctx.restore();
        }

        // --- LAYER B: WINGS (Angel, Demon, Dragon, Fairy, Phoenix, Nephilim, Gargoyle) ---
        const wingFlap = Math.sin(t * 4.2) * 0.16;
        if (rLow.includes('angel') || rLow.includes('seraph') || rLow.includes('nephilim')) {
          const wingPairs = rLow.includes('seraph') ? 3 : 1;
          for (let wp = 0; wp < wingPairs; wp++) {
            const yOff = wp * 16 - 28;
            const scaleW = 1 - wp * 0.15;
            [-1, 1].forEach(dir => {
              // Nephilim has 1 angel wing and 1 demon wing!
              if (rLow.includes('nephilim') && dir === 1) {
                ctx.save();
                ctx.translate(dir * 12, yOff);
                ctx.rotate(dir * (0.2 + wingFlap));
                ctx.fillStyle = 'rgba(30, 58, 138, 0.85)';
                ctx.strokeStyle = '#60a5fa';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.quadraticCurveTo(48, -38, 78, -14);
                ctx.quadraticCurveTo(55, 10, 62, 32);
                ctx.quadraticCurveTo(32, 18, 0, 20);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                ctx.restore();
              } else {
                ctx.save();
                ctx.translate(dir * 12, yOff);
                ctx.scale(dir * scaleW, scaleW);
                ctx.rotate(0.18 + wingFlap);
                const wGrad = ctx.createLinearGradient(0, -30, 75, 20);
                wGrad.addColorStop(0, '#ffffff');
                wGrad.addColorStop(0.6, '#bae6fd');
                wGrad.addColorStop(1, '#38bdf8');
                ctx.fillStyle = wGrad;
                ctx.shadowColor = '#38bdf8';
                ctx.shadowBlur = 12;
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.bezierCurveTo(35, -42, 78, -28, 84, 4);
                ctx.bezierCurveTo(66, 22, 38, 34, 0, 22);
                ctx.closePath();
                ctx.fill();
                ctx.restore();
              }
            });
          }
        } else if (rLow.includes('demon') || rLow.includes('devil') || rLow.includes('vampire') || rLow.includes('gargoyle')) {
          [-1, 1].forEach(dir => {
            ctx.save();
            ctx.translate(dir * 12, -26);
            ctx.scale(dir, 1);
            ctx.rotate(0.15 + wingFlap);
            ctx.fillStyle = 'rgba(15, 37, 71, 0.9)';
            ctx.strokeStyle = primaryColor;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(52, -36);
            ctx.lineTo(78, -8);
            ctx.quadraticCurveTo(54, 4, 58, 28);
            ctx.quadraticCurveTo(32, 12, 24, 32);
            ctx.quadraticCurveTo(12, 16, 0, 18);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            ctx.restore();
          });
        } else if (rLow.includes('dragon') || aLow.includes('dragon')) {
          [-1, 1].forEach(dir => {
            ctx.save();
            ctx.translate(dir * 14, -28);
            ctx.scale(dir, 1);
            ctx.rotate(0.12 + wingFlap * 0.9);
            ctx.fillStyle = 'rgba(2, 132, 199, 0.72)';
            ctx.strokeStyle = '#7dd3fc';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(48, -42);
            ctx.lineTo(84, -18);
            ctx.lineTo(64, 24);
            ctx.lineTo(32, 14);
            ctx.lineTo(0, 22);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            ctx.restore();
          });
        } else if (rLow.includes('fairy')) {
          [-1, 1].forEach(dir => {
            ctx.save();
            ctx.translate(dir * 10, -24);
            ctx.scale(dir, 1);
            ctx.rotate(Math.sin(t * 9) * 0.22);
            ctx.fillStyle = 'rgba(186, 230, 253, 0.55)';
            ctx.strokeStyle = '#00f0ff';
            ctx.lineWidth = 1.8;
            ctx.beginPath();
            ctx.ellipse(36, -16, 34, 18, -0.35, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.beginPath();
            ctx.ellipse(28, 12, 24, 13, 0.3, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.restore();
          });
        } else if (rLow.includes('phoenix')) {
          [-1, 1].forEach(dir => {
            ctx.save();
            ctx.translate(dir * 12, -28);
            ctx.scale(dir, 1);
            ctx.rotate(0.15 + wingFlap);
            const pGrad = ctx.createLinearGradient(0, -20, 80, 10);
            pGrad.addColorStop(0, '#e0f2fe');
            pGrad.addColorStop(0.5, '#38bdf8');
            pGrad.addColorStop(1, '#0284c7');
            ctx.fillStyle = pGrad;
            ctx.shadowColor = '#00f0ff';
            ctx.shadowBlur = 16;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.quadraticCurveTo(45, -48, 86, -22);
            ctx.quadraticCurveTo(62, 12, 74, 26);
            ctx.quadraticCurveTo(38, 22, 0, 20);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
          });
        }

        // --- LAYER C: FLOWING CAPE / CLOAK / TAIL ---
        const capeWave = Math.sin(t * 3.1) * 10;
        ctx.save();
        const capeGrad = ctx.createLinearGradient(0, -35, 0, 75);
        capeGrad.addColorStop(0, 'rgba(30, 58, 138, 0.92)');
        capeGrad.addColorStop(1, 'rgba(7, 89, 133, 0.35)');
        ctx.fillStyle = capeGrad;
        ctx.strokeStyle = primaryColor;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-20, -32);
        ctx.lineTo(20, -32);
        ctx.quadraticCurveTo(38 + capeWave, 25, 44 + capeWave * 1.3, 74);
        ctx.lineTo(-42 + capeWave * 0.8, 74);
        ctx.quadraticCurveTo(-34, 25, -20, -32);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // Tail for Dragonkin, Werewolf, Beastfolk, Chimera, Demon, Merfolk
        if (rLow.includes('dragon') || rLow.includes('werewolf') || rLow.includes('beast') || rLow.includes('chimera') || rLow.includes('demon') || rLow.includes('tiefling')) {
          ctx.save();
          ctx.strokeStyle = primaryColor;
          ctx.lineWidth = rLow.includes('dragon') || rLow.includes('werewolf') ? 7 : 3.5;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(8, 18);
          ctx.quadraticCurveTo(45, 32 + capeWave, 56, 4 + capeWave);
          ctx.stroke();
          ctx.restore();
        }

        // --- LAYER D: BODY & RACE-SPECIFIC ANATOMY ---
        const isTitan = rLow.includes('giant') || rLow.includes('golem') || rLow.includes('orc') || rLow.includes('troll') || aLow.includes('goliath');
        const isDwarf = rLow.includes('dwarf') || rLow.includes('goblin') || rLow.includes('halfling');
        const isSlime = rLow.includes('slime');
        const isMerfolk = rLow.includes('merfolk') || rLow.includes('siren') || rLow.includes('leviathan');

        if (isSlime) {
          // Royal Translucent Bouncing Slime Sovereign Body
          const slimeSquish = Math.sin(t * 4) * 4;
          const sGrad = ctx.createRadialGradient(-10, 10, 6, 0, 20, 48);
          sGrad.addColorStop(0, 'rgba(224, 242, 254, 0.92)');
          sGrad.addColorStop(0.5, 'rgba(56, 189, 248, 0.78)');
          sGrad.addColorStop(1, 'rgba(3, 105, 161, 0.85)');
          ctx.fillStyle = sGrad;
          ctx.strokeStyle = '#e0f2fe';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(-42 - slimeSquish, 55);
          ctx.quadraticCurveTo(-46, -22 + slimeSquish, 0, -26 + slimeSquish);
          ctx.quadraticCurveTo(46, -22 + slimeSquish, 42 + slimeSquish, 55);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Royal Crown on Slime
          ctx.fillStyle = '#bae6fd';
          ctx.strokeStyle = '#0284c7';
          ctx.beginPath();
          ctx.moveTo(-18, -24 + slimeSquish);
          ctx.lineTo(-22, -42 + slimeSquish);
          ctx.lineTo(-8, -32 + slimeSquish);
          ctx.lineTo(0, -46 + slimeSquish);
          ctx.lineTo(8, -32 + slimeSquish);
          ctx.lineTo(22, -42 + slimeSquish);
          ctx.lineTo(18, -24 + slimeSquish);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Slime Eyes
          ctx.fillStyle = '#0f172a';
          ctx.beginPath();
          ctx.arc(-12, 6, 4.5, 0, Math.PI * 2);
          ctx.arc(12, 6, 4.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(-13, 4.5, 1.8, 0, Math.PI * 2);
          ctx.arc(11, 4.5, 1.8, 0, Math.PI * 2);
          ctx.fill();
        } else {
          const torsoW = isTitan ? 28 : (isDwarf ? 22 : 18);
          const legLen = isDwarf ? 42 : 58;

          // Legs or Merfolk Serpent Tail
          if (isMerfolk) {
            const finGrad = ctx.createLinearGradient(0, 15, 0, 78);
            finGrad.addColorStop(0, '#0284c7');
            finGrad.addColorStop(1, '#38bdf8');
            ctx.fillStyle = finGrad;
            ctx.strokeStyle = '#bae6fd';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(-16, 16);
            ctx.quadraticCurveTo(-22, 52, 8 + capeWave * 0.5, 72);
            ctx.lineTo(28 + capeWave * 0.5, 82);
            ctx.lineTo(14 + capeWave * 0.5, 64);
            ctx.quadraticCurveTo(18, 40, 16, 16);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
          } else {
            // Left & Right Armored Boots/Legs
            ctx.fillStyle = '#0f172a';
            ctx.strokeStyle = primaryColor;
            ctx.lineWidth = 1.6;
            // Left Leg
            ctx.beginPath();
            ctx.roundRect(-torsoW * 0.65, 16, torsoW * 0.52, legLen, 4);
            ctx.fill();
            ctx.stroke();
            // Right Leg
            ctx.beginPath();
            ctx.roundRect(torsoW * 0.15, 16, torsoW * 0.52, legLen, 4);
            ctx.fill();
            ctx.stroke();

            // Knee Guards
            ctx.fillStyle = glowColor;
            ctx.fillRect(-torsoW * 0.55, 38, torsoW * 0.32, 5);
            ctx.fillRect(torsoW * 0.25, 38, torsoW * 0.32, 5);
          }

          // Torso & Genshin-Style Ornate Coat / Cuirass
          ctx.fillStyle = armorMain;
          ctx.strokeStyle = armorTrim;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(-torsoW, -32);
          ctx.lineTo(torsoW, -32);
          ctx.lineTo(torsoW * 0.78, 18);
          ctx.lineTo(-torsoW * 0.78, 18);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Skeleton Ribcage Detail
          if (rLow.includes('skeleton') || rLow.includes('lich')) {
            ctx.strokeStyle = '#e2e8f0';
            ctx.lineWidth = 2.2;
            for (let rb = -22; rb <= 4; rb += 8) {
              ctx.beginPath();
              ctx.moveTo(-12, rb);
              ctx.quadraticCurveTo(0, rb + 4, 12, rb);
              ctx.stroke();
            }
          } else {
            // Glowing Elemental Vision Gem on Chest
            ctx.fillStyle = '#00f0ff';
            ctx.shadowColor = '#00f0ff';
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.moveTo(0, -22);
            ctx.lineTo(7, -14);
            ctx.lineTo(0, -6);
            ctx.lineTo(-7, -14);
            ctx.closePath();
            ctx.fill();
            ctx.shadowBlur = 0;
          }

          // Pauldrons (Shoulders)
          [-1, 1].forEach(dir => {
            ctx.save();
            ctx.translate(dir * (torsoW + 3), -28);
            ctx.fillStyle = '#1e3a8a';
            ctx.strokeStyle = glowColor;
            ctx.lineWidth = 1.8;
            ctx.beginPath();
            ctx.moveTo(0, -8);
            ctx.lineTo(dir * 16, -2);
            ctx.lineTo(dir * 12, 10);
            ctx.lineTo(0, 8);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            ctx.restore();
          });

          // Head & Neck
          const headY = -50;
          const headR = isTitan ? 16 : 14;

          ctx.fillStyle = skinColor;
          ctx.strokeStyle = '#0f172a';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(0, headY, headR, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Race-Specific Ears / Facial Features
          if (rLow.includes('elf') || rLow.includes('fairy') || rLow.includes('goblin') || rLow.includes('vampire')) {
            // Long Pointed Ears
            [-1, 1].forEach(dir => {
              ctx.fillStyle = skinColor;
              ctx.beginPath();
              ctx.moveTo(dir * (headR - 2), headY - 2);
              ctx.lineTo(dir * (headR + 14), headY - 9);
              ctx.lineTo(dir * (headR - 1), headY + 5);
              ctx.closePath();
              ctx.fill();
            });
          }

          if (rLow.includes('werewolf') || rLow.includes('beast') || rLow.includes('animorph') || rLow.includes('kitsune')) {
            // Wolf / Fox Beast Ears on Top
            [-1, 1].forEach(dir => {
              ctx.fillStyle = hairColor;
              ctx.strokeStyle = glowColor;
              ctx.lineWidth = 1.2;
              ctx.beginPath();
              ctx.moveTo(dir * 5, headY - headR + 2);
              ctx.lineTo(dir * 14, headY - headR - 14);
              ctx.lineTo(dir * 15, headY - headR + 5);
              ctx.closePath();
              ctx.fill();
              ctx.stroke();
            });
          }

          if (rLow.includes('orc') || rLow.includes('troll')) {
            // Lower Tusks
            ctx.fillStyle = '#f8fafc';
            [-1, 1].forEach(dir => {
              ctx.beginPath();
              ctx.moveTo(dir * 5, headY + 6);
              ctx.lineTo(dir * 7, headY + 1);
              ctx.lineTo(dir * 9, headY + 6);
              ctx.closePath();
              ctx.fill();
            });
          }

          if (rLow.includes('dwarf') || aLow.includes('viking') || aLow.includes('pirate')) {
            // Magnificent Braided Beard
            ctx.fillStyle = hairColor;
            ctx.beginPath();
            ctx.moveTo(-11, headY + 4);
            ctx.lineTo(11, headY + 4);
            ctx.lineTo(7, headY + 30);
            ctx.lineTo(0, headY + 35);
            ctx.lineTo(-7, headY + 30);
            ctx.closePath();
            ctx.fill();
          }

          // Eyes / Cyber Visor / Blindfold
          if (rLow.includes('android') || rLow.includes('cyborg') || aLow.includes('cyber')) {
            ctx.fillStyle = '#00f0ff';
            ctx.shadowColor = '#00f0ff';
            ctx.shadowBlur = 10;
            ctx.fillRect(-10, headY - 4, 20, 5);
            ctx.shadowBlur = 0;
          } else {
            ctx.fillStyle = eyeColor;
            ctx.shadowColor = eyeColor;
            ctx.shadowBlur = 6;
            ctx.beginPath();
            ctx.arc(-5, headY - 1, 2.3, 0, Math.PI * 2);
            ctx.arc(5, headY - 1, 2.3, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
          }

          // Anime / Genshin Spiky & Flowing Hair Silhouette
          if (!rLow.includes('skeleton') && !rLow.includes('golem')) {
            ctx.fillStyle = hairColor;
            ctx.beginPath();
            ctx.arc(0, headY - 3, headR + 1.5, Math.PI, Math.PI * 2);
            // Bangs & Spikes
            ctx.lineTo(headR + 5, headY + 4);
            ctx.lineTo(headR - 2, headY - 2);
            ctx.lineTo(6, headY - 6);
            ctx.lineTo(0, headY - 1);
            ctx.lineTo(-6, headY - 6);
            ctx.lineTo(-headR + 2, headY - 2);
            ctx.lineTo(-headR - 5, headY + 4);
            ctx.closePath();
            ctx.fill();
          }

          // Horns / Halo / Crown / Pirate Tricorn / Wizard Hat
          if (rLow.includes('demon') || rLow.includes('devil') || rLow.includes('dragon') || rLow.includes('tiefling') || rLow.includes('oni')) {
            ctx.fillStyle = glowColor;
            ctx.strokeStyle = '#0284c7';
            ctx.lineWidth = 1.5;
            [-1, 1].forEach(dir => {
              ctx.beginPath();
              ctx.moveTo(dir * 7, headY - headR + 2);
              ctx.quadraticCurveTo(dir * 24, headY - headR - 18, dir * 18, headY - headR - 26);
              ctx.quadraticCurveTo(dir * 12, headY - headR - 12, dir * 3, headY - headR + 1);
              ctx.closePath();
              ctx.fill();
              ctx.stroke();
            });
          }

          if (rLow.includes('angel') || rLow.includes('seraph') || rLow.includes('god') || rLow.includes('celestial')) {
            ctx.save();
            ctx.strokeStyle = '#e0f2fe';
            ctx.shadowColor = '#00f0ff';
            ctx.shadowBlur = 12;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.ellipse(0, headY - headR - 10, 18, 5, 0, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
          }

          if (aLow.includes('mage') || aLow.includes('wizard') || aLow.includes('witch') || aLow.includes('alchemist')) {
            // Arcane Witch/Archmage Hat
            ctx.fillStyle = '#0f2547';
            ctx.strokeStyle = glowColor;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.ellipse(0, headY - headR + 2, 24, 5, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(-14, headY - headR + 1);
            ctx.lineTo(4, headY - headR - 26);
            ctx.lineTo(14, headY - headR + 1);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
          }
        }

        // --- LAYER E: UNIQUE PROCEDURAL WEAPON IN RIGHT HAND ---
        ctx.save();
        const weaponSway = Math.sin(t * 2.6) * 0.06;
        ctx.translate(34, -8);
        ctx.rotate(weaponSway);

        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 10;

        if (wLow.includes('scythe')) {
          // Scythe of Eternity
          ctx.strokeStyle = '#cbd5e1';
          ctx.lineWidth = 3.5;
          ctx.beginPath();
          ctx.moveTo(0, -68);
          ctx.lineTo(0, 72);
          ctx.stroke();
          ctx.fillStyle = '#00f0ff';
          ctx.beginPath();
          ctx.moveTo(0, -64);
          ctx.quadraticCurveTo(48, -72, 56, -34);
          ctx.quadraticCurveTo(30, -48, 0, -50);
          ctx.closePath();
          ctx.fill();
        } else if (wLow.includes('hammer') || wLow.includes('stormbreaker') || wLow.includes('mjolnir') || wLow.includes('mace') || wLow.includes('club')) {
          // Thor's Hammer / Stormbreaker / Colossal Maul
          ctx.strokeStyle = '#94a3b8';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(0, -52);
          ctx.lineTo(0, 62);
          ctx.stroke();
          ctx.fillStyle = '#bae6fd';
          ctx.strokeStyle = '#0284c7';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.roundRect(-22, -72, 44, 24, 4);
          ctx.fill();
          ctx.stroke();
        } else if (wLow.includes('bow') || wLow.includes('crossbow') || wLow.includes('harp')) {
          // Starshard Bow
          ctx.strokeStyle = '#7dd3fc';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(-6, 0, 48, -Math.PI * 0.42, Math.PI * 0.42);
          ctx.stroke();
          ctx.strokeStyle = '#e0f2fe';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(6, -46);
          ctx.lineTo(6, 46);
          ctx.stroke();
          // Glowing Arrow Drawn
          ctx.strokeStyle = '#00f0ff';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(-4, 0);
          ctx.lineTo(42, 0);
          ctx.stroke();
        } else if (wLow.includes('pistol') || wLow.includes('eagle') || wLow.includes('railgun') || wLow.includes('blaster') || wLow.includes('rifle') || wLow.includes('gun')) {
          // Quantum Railgun / Dual Pistols
          ctx.fillStyle = '#1e293b';
          ctx.strokeStyle = '#00f0ff';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.roundRect(-4, -14, 38, 12, 3);
          ctx.fill();
          ctx.stroke();
          ctx.fillRect(-4, -4, 10, 18);
          ctx.fillStyle = '#00f0ff';
          ctx.fillRect(6, -11, 22, 4);
        } else if (wLow.includes('staff') || wLow.includes('wand') || wLow.includes('grimoire') || wLow.includes('orb')) {
          // Staff of the Cosmic Archmage
          ctx.strokeStyle = '#e0f2fe';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(0, -64);
          ctx.lineTo(0, 70);
          ctx.stroke();
          ctx.fillStyle = '#00f0ff';
          ctx.beginPath();
          ctx.arc(0, -72, 10, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#bae6fd';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(0, -72, 16, 0, Math.PI * 2);
          ctx.stroke();
        } else if (wLow.includes('spear') || wLow.includes('gungnir') || wLow.includes('trident') || wLow.includes('halberd') || wLow.includes('lance')) {
          // Gungnir / Celestial Trident
          ctx.strokeStyle = '#cbd5e1';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(0, -75);
          ctx.lineTo(0, 75);
          ctx.stroke();
          ctx.fillStyle = '#00f0ff';
          ctx.beginPath();
          ctx.moveTo(0, -94);
          ctx.lineTo(9, -68);
          ctx.lineTo(0, -73);
          ctx.lineTo(-9, -68);
          ctx.closePath();
          ctx.fill();
        } else if (wLow.includes('chair') || wLow.includes('spatula') || wLow.includes('baguette') || wLow.includes('nokia') || wLow.includes('chicken') || wLow.includes('chancla')) {
          // Joke / Chaos Mythic Relic Weapon!
          ctx.strokeStyle = '#38bdf8';
          ctx.fillStyle = '#e0f2fe';
          ctx.lineWidth = 2.5;
          if (wLow.includes('chair')) {
            ctx.strokeRect(-14, -48, 28, 36);
            ctx.fillRect(-14, -30, 28, 8);
          } else if (wLow.includes('spatula')) {
            ctx.beginPath();
            ctx.moveTo(0, -25);
            ctx.lineTo(0, 45);
            ctx.stroke();
            ctx.strokeRect(-12, -52, 24, 26);
          } else {
            ctx.beginPath();
            ctx.roundRect(-9, -55, 18, 52, 8);
            ctx.fill();
            ctx.stroke();
          }
        } else {
          // Excalibur / Muramasa Katana / Nodachi / Greatsword
          const isKatana = wLow.includes('katana') || wLow.includes('nodachi');
          ctx.fillStyle = '#f8fafc';
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 2;
          ctx.beginPath();
          if (isKatana) {
            ctx.moveTo(0, -82);
            ctx.quadraticCurveTo(9, -30, 4, 24);
            ctx.lineTo(-2, 24);
            ctx.quadraticCurveTo(2, -30, 0, -82);
          } else {
            ctx.moveTo(0, -80);
            ctx.lineTo(7, -64);
            ctx.lineTo(6, 22);
            ctx.lineTo(-6, 22);
            ctx.lineTo(-7, -64);
          }
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          // Crossguard & Hilt
          ctx.fillStyle = '#38bdf8';
          ctx.fillRect(-14, 22, 28, 5);
          ctx.fillStyle = '#1e293b';
          ctx.fillRect(-3, 27, 6, 18);
        }
        ctx.restore();

        // --- LAYER F: TAMER PET / COMPANION BESIDE CHARACTER ---
        if (aLow.includes('tamer') || wLow.includes('chihuahua') || subArchName) {
          if (aLow.includes('tamer') || wLow.includes('chihuahua')) {
            ctx.save();
            const petBob = Math.sin(t * 5) * 3;
            ctx.translate(-56, 36 + petBob);
            ctx.fillStyle = '#38bdf8';
            ctx.strokeStyle = '#e0f2fe';
            ctx.lineWidth = 1.5;
            // Companion Body & Head
            ctx.beginPath();
            ctx.ellipse(0, 8, 14, 10, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(-8, -4, 9, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            // Pointy Pet Ears
            ctx.beginPath();
            ctx.moveTo(-14, -10);
            ctx.lineTo(-16, -20);
            ctx.lineTo(-8, -12);
            ctx.moveTo(-4, -10);
            ctx.lineTo(-2, -20);
            ctx.lineTo(-8, -12);
            ctx.fill();
            // Glowing Pet Eyes
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(-12, -6, 3, 3);
            ctx.fillRect(-6, -6, 3, 3);
            ctx.restore();
          }
        }

        ctx.restore(); // End Character Transform
      }

      // 5. Foreground Floating Elemental Particles & Lightning Arcs
      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -10) {
          p.y = H + 10;
          p.x = (seed * (idx + 5) + Math.floor(t * 30)) % W;
        }
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;

        const twinkle = 0.5 + 0.5 * Math.sin(t * 4 + p.phase);
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.fillStyle = idx % 3 === 0 ? '#ffffff' : primaryColor;
        ctx.globalAlpha = p.alpha * twinkle;
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 8;

        // Draw 4-point Genshin Primogem Star Sparkle
        const s = p.size;
        ctx.beginPath();
        ctx.moveTo(0, -s * 1.8);
        ctx.quadraticCurveTo(s * 0.3, -s * 0.3, s * 1.8, 0);
        ctx.quadraticCurveTo(s * 0.3, s * 0.3, 0, s * 1.8);
        ctx.quadraticCurveTo(-s * 0.3, s * 0.3, -s * 1.8, 0);
        ctx.quadraticCurveTo(-s * 0.3, -s * 0.3, 0, -s * 1.8);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      });

      // 6. Genshin Wish Shooting Star & Burst Entrance Overlay (0.0s -> 0.85s)
      if (elapsed < 0.85) {
        ctx.save();
        if (elapsed < 0.25) {
          // Shooting Wish Meteor streaking from top-left to center
          const prog = elapsed / 0.25;
          const mx = prog * cx;
          const my = prog * cy;
          const meteorGrad = ctx.createLinearGradient(mx - 120, my - 90, mx, my);
          meteorGrad.addColorStop(0, 'transparent');
          meteorGrad.addColorStop(0.6, '#38bdf8');
          meteorGrad.addColorStop(1, '#ffffff');
          ctx.strokeStyle = meteorGrad;
          ctx.lineWidth = 8;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(mx - 120, my - 90);
          ctx.lineTo(mx, my);
          ctx.stroke();

          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = '#00f0ff';
          ctx.shadowBlur = 24;
          ctx.beginPath();
          ctx.arc(mx, my, 12, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Expanding Wish Shockwave & Flash
          const burstProg = (elapsed - 0.25) / 0.6;
          const burstAlpha = Math.max(0, 1 - burstProg);
          ctx.strokeStyle = `rgba(224, 242, 254, ${burstAlpha.toFixed(3)})`;
          ctx.lineWidth = 6 * (1 - burstProg);
          ctx.beginPath();
          ctx.arc(cx, cy, burstProg * 220, 0, Math.PI * 2);
          ctx.stroke();

          ctx.fillStyle = `rgba(186, 230, 253, ${(burstAlpha * 0.55).toFixed(3)})`;
          ctx.fillRect(0, 0, W, H);
        }
        ctx.restore();
      }

      activeSplashAnimId = requestAnimationFrame(renderFrame);
    }

    activeSplashAnimId = requestAnimationFrame(renderFrame);
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
      'Demi-God': '⚡', Homunculus: '🧪', 'Astral Seraph': '✨', 'Living Armor': '🛡️',
      'Special Grade Cursed Spirit': '👁️', 'Death Painting Womb': '🩸',
      'Six Eyes Clan Heir': '🤞', 'Heavenly Restricted (Toji Pact)': '🗡️'
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

  // Test Black Flash Button in Arena Controls
  const btnTestBlackFlash = document.getElementById('btnTestBlackFlash');
  if (btnTestBlackFlash) {
    btnTestBlackFlash.addEventListener('click', () => {
      sounds.playBlackFlash();
      const sampleAttacker = arenaState.combatants[0] || { name: 'Yuji Itadori (Awakened)' };
      const sampleTarget = arenaState.combatants[1] || { name: 'Ryomen Sukuna (20F)' };
      triggerBlackFlashAnimation(sampleAttacker, sampleTarget, 999);
      appendArenaLogEntry(`⚡⚫ 黒閃! ${sampleAttacker.name} unleashes a test BLACK FLASH (Kokusen) spatial distortion storm! (^2.5 CRIT)`, 'crit');
    });
  }

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
    const { type, attacker, target, damage, isCrit, isBlackFlash, text, sound, domainName, domainTheme } = data;

    // Domain Expansion Cinematic Trigger
    if (type === 'domainExpansion') {
      triggerDomainExpansionAnimation(attacker, domainName, domainTheme);
    }

    // Black Flash (Kokusen) Ultra-Flashy Multi-Bolt Strobe Trigger
    if (type === 'blackFlash' || isBlackFlash) {
      triggerBlackFlashAnimation(attacker, target, damage);
    }

    // 1. Screen Shake on criticals, heavy blows, or domain expansions
    if (isCrit || damage > 50 || type === 'explosion' || type === 'domainExpansion' || type === 'blackFlash') {
      arenaColosseum.classList.add('screen-shake');
      setTimeout(() => arenaColosseum.classList.remove('screen-shake'), 450);
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

  // Ultra-Flashy Black Flash (Kokusen • 黒閃) Multi-Bolt Storm & Strobe Engine
  let activeBlackFlashAnimId = null;
  let activeBlackFlashTimeout = null;
  function triggerBlackFlashAnimation(attacker, target, damage) {
    const overlay = document.getElementById('arenaBlackFlashOverlay');
    const canvas = document.getElementById('arenaBlackFlashCanvas');
    const subEl = document.getElementById('blackFlashSub');
    if (!overlay || !canvas) return;

    if (activeBlackFlashAnimId) {
      cancelAnimationFrame(activeBlackFlashAnimId);
      activeBlackFlashAnimId = null;
    }
    if (activeBlackFlashTimeout) {
      clearTimeout(activeBlackFlashTimeout);
      activeBlackFlashTimeout = null;
    }

    if (subEl) {
      const attName = attacker ? attacker.name.toUpperCase() : 'SORCERER';
      subEl.textContent = `${attName} • ^2.5 SPATIAL CRIT (-${damage || 999} HP)`;
    }

    // Restart CSS impact strobe and colosseum megashake
    overlay.classList.remove('hidden', 'bf-active');
    arenaColosseum.classList.remove('bf-megashake');
    void overlay.offsetWidth;
    overlay.classList.add('bf-active');
    arenaColosseum.classList.add('bf-megashake');

    const ctx = canvas.getContext('2d');
    const W = canvas.width = overlay.clientWidth || 900;
    const H = canvas.height = overlay.clientHeight || 450;
    const cx = W * (0.38 + Math.random() * 0.24);
    const cy = H * (0.38 + Math.random() * 0.24);

    // Generate 75 high-velocity black & crimson sparks
    const sparks = Array.from({ length: 75 }, () => {
      const ang = Math.random() * Math.PI * 2;
      const spd = 5 + Math.random() * 20;
      return {
        x: cx,
        y: cy,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd,
        len: 12 + Math.random() * 28,
        thick: 2 + Math.random() * 4.5,
        isBlack: Math.random() > 0.35
      };
    });

    function drawJaggedBolt(x1, y1, x2, y2, displacement, branchDepth) {
      const segs = 12;
      const pts = [{ x: x1, y: y1 }];
      for (let i = 1; i < segs; i++) {
        const t = i / segs;
        const jx = (Math.random() - 0.5) * displacement;
        const jy = (Math.random() - 0.5) * displacement;
        pts.push({
          x: x1 + (x2 - x1) * t + jx,
          y: y1 + (y2 - y1) * t + jy
        });
      }
      pts.push({ x: x2, y: y2 });

      // 1. Outer Crimson Aura
      ctx.save();
      ctx.beginPath();
      pts.forEach((p, idx) => (idx === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
      ctx.strokeStyle = '#ff0033';
      ctx.lineWidth = branchDepth > 0 ? 15 : 8;
      ctx.shadowColor = '#ff0033';
      ctx.shadowBlur = 32;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();

      // 2. Electric White-Hot Rim
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = branchDepth > 0 ? 8 : 4;
      ctx.shadowBlur = 10;
      ctx.stroke();

      // 3. Pitch-Black Spatial Void Core (Signature Kokusen Look)
      ctx.strokeStyle = '#020003';
      ctx.lineWidth = branchDepth > 0 ? 5.5 : 2.5;
      ctx.shadowBlur = 0;
      ctx.stroke();
      ctx.restore();

      // Recursive fork branches
      if (branchDepth > 0) {
        for (let i = 2; i < pts.length - 2; i += 3) {
          if (Math.random() < 0.7) {
            const p = pts[i];
            const bAngle = Math.atan2(y2 - y1, x2 - x1) + (Math.random() - 0.5) * 1.7;
            const bLen = 70 + Math.random() * 140;
            drawJaggedBolt(
              p.x,
              p.y,
              p.x + Math.cos(bAngle) * bLen,
              p.y + Math.sin(bAngle) * bLen,
              displacement * 0.6,
              branchDepth - 1
            );
          }
        }
      }
    }

    let frame = 0;
    const totalFrames = 46;

    function renderBlackFlashFrame() {
      frame++;
      ctx.clearRect(0, 0, W, H);

      // Multi-frame full-canvas strobe flashes (Frames 1-3, 6-8, 12-13, 18)
      if (frame <= 3 || (frame >= 6 && frame <= 8) || frame === 12 || frame === 18) {
        ctx.fillStyle = frame % 2 === 0 ? 'rgba(255,255,255,0.92)' : 'rgba(255,0,43,0.78)';
        ctx.fillRect(0, 0, W, H);
      } else if (frame < 34) {
        const g = ctx.createRadialGradient(cx, cy, 10, cx, cy, Math.max(W, H) * 0.72);
        g.addColorStop(0, `rgba(255, 0, 51, ${0.48 * (1 - frame / totalFrames)})`);
        g.addColorStop(0.45, `rgba(10, 0, 4, ${0.76 * (1 - frame / totalFrames)})`);
        g.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
      }

      // Expanding Dual Shockwave Rings
      for (let rIdx = 0; rIdx < 3; rIdx++) {
        const rProgress = Math.max(0, (frame - rIdx * 4) / (totalFrames - 8));
        if (rProgress > 0 && rProgress < 1) {
          const radius = rProgress * Math.max(W, H) * 0.68;
          ctx.save();
          ctx.beginPath();
          ctx.arc(cx, cy, radius, 0, Math.PI * 2);
          ctx.strokeStyle = rIdx % 2 === 0 ? `rgba(255, 0, 51, ${1 - rProgress})` : `rgba(0, 0, 0, ${1 - rProgress})`;
          ctx.lineWidth = (1 - rProgress) * 18;
          ctx.shadowColor = '#ff0033';
          ctx.shadowBlur = 24;
          ctx.stroke();
          ctx.restore();
        }
      }

      // Regenerating 16 Multi-Branching Black & Crimson Lightning Bolts!
      if (frame < 38) {
        const numBolts = frame < 22 ? 16 : 9;
        for (let b = 0; b < numBolts; b++) {
          const angle = (b / numBolts) * Math.PI * 2 + (Math.random() - 0.5) * 0.45;
          const reach = Math.max(W, H) * (0.45 + Math.random() * 0.45);
          drawJaggedBolt(
            cx,
            cy,
            cx + Math.cos(angle) * reach,
            cy + Math.sin(angle) * reach,
            46,
            1
          );
        }

        // Central Black-Core Singularity Impact Sphere
        const coreR = Math.max(6, (1 - frame / 38) * 58);
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, coreR * 1.35, 0, Math.PI * 2);
        ctx.fillStyle = '#ff0033';
        ctx.shadowColor = '#ff0033';
        ctx.shadowBlur = 40;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(cx, cy, coreR, 0, Math.PI * 2);
        ctx.fillStyle = '#030002';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3.5;
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }

      // High-velocity flying sparks
      sparks.forEach(sp => {
        sp.x += sp.vx;
        sp.y += sp.vy;
        sp.vx *= 0.95;
        sp.vy *= 0.95;
        const alpha = Math.max(0, 1 - frame / totalFrames);
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.moveTo(sp.x, sp.y);
        ctx.lineTo(sp.x - sp.vx * 2.2, sp.y - sp.vy * 2.2);
        ctx.strokeStyle = sp.isBlack ? '#000000' : '#ff0033';
        ctx.lineWidth = sp.thick;
        ctx.shadowColor = '#ff0033';
        ctx.shadowBlur = 14;
        ctx.lineCap = 'round';
        ctx.stroke();
        ctx.restore();
      });

      if (frame < totalFrames) {
        activeBlackFlashAnimId = requestAnimationFrame(renderBlackFlashFrame);
      } else {
        ctx.clearRect(0, 0, W, H);
      }
    }

    activeBlackFlashAnimId = requestAnimationFrame(renderBlackFlashFrame);

    activeBlackFlashTimeout = setTimeout(() => {
      overlay.classList.add('hidden');
      overlay.classList.remove('bf-active');
      arenaColosseum.classList.remove('bf-megashake');
    }, 920);
  }

  // Domain Expansion Metaphysical Animation Sequence
  let activeDomainTimeout = null;
  function triggerDomainExpansionAnimation(caster, domainName, domainTheme = 'void') {
    const overlay = document.getElementById('arenaDomainOverlay');
    const realmTitleEl = document.getElementById('domainRealmName');
    const casterLineEl = document.getElementById('domainCasterLine');
    if (!overlay || !realmTitleEl) return;

    if (activeDomainTimeout) {
      clearTimeout(activeDomainTimeout);
      activeDomainTimeout = null;
    }

    // Set Domain Text & Caster Info
    const displayName = domainName || 'Infinite Void';
    realmTitleEl.textContent = displayName.toUpperCase();
    if (casterLineEl) {
      casterLineEl.textContent = `Cast by ${caster ? caster.name : 'Unknown Sorcerer'}`;
    }

    // Reset Theme Classes
    overlay.className = `arena-domain-overlay theme-${domainTheme || 'void'}`;
    overlay.classList.remove('hidden', 'domain-closing');

    // Hold Domain Expansion for 1.8 seconds, then animate barrier dispersion
    activeDomainTimeout = setTimeout(() => {
      overlay.classList.add('domain-closing');
      setTimeout(() => {
        overlay.classList.add('hidden');
        overlay.classList.remove('domain-closing');
      }, 580);
    }, 1800);
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
