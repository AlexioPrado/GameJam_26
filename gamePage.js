// Game pause/resume functions
let isGamePaused = false;

// MUSIC SELECTION SYSTEM
let currentMusicIndex = 0;

let consecutiveComboCount = 0; // Track consecutive correct combos

function initializeMusicSelector() {
    // Load saved music preference
    const savedMusicIndex = localStorage.getItem('selectedMusicIndex');
    if (savedMusicIndex !== null) {
        currentMusicIndex = parseInt(savedMusicIndex);
        document.getElementById('music-select').value = currentMusicIndex;
    }
    
    // Add event listener for immediate selection
    const musicSelect = document.getElementById('music-select');
    if (musicSelect) {
        musicSelect.addEventListener('change', applyMusicSelection);
    }
}

function applyMusicSelection() {
    const musicSelect = document.getElementById('music-select');
    const newMusicIndex = parseInt(musicSelect.value);
    
    // Apply the new music
    currentMusicIndex = newMusicIndex;
    localStorage.setItem('selectedMusicIndex', currentMusicIndex);
    
    // Update current background music if playing
    if (currentBackgroundMusic) {
        currentBackgroundMusic.pause();
        currentBackgroundMusic.src = backgroundMusicFiles[currentMusicIndex];
        currentBackgroundMusic.play().catch(error => {
            console.log("Background music change failed:", error);
        });
    }
}

// Update playRandomBackgroundMusic to use saved preference
function playRandomBackgroundMusic() {
    // Stop current music if playing
    if (currentBackgroundMusic) {
        currentBackgroundMusic.pause();
        currentBackgroundMusic = null;
    }
    
    // Use saved music index or default to first track
    const savedIndex = localStorage.getItem('selectedMusicIndex');
    const musicIndex = savedIndex !== null ? parseInt(savedIndex) : 0;
    const selectedMusic = backgroundMusicFiles[musicIndex];
    
    // Create new audio element
    currentBackgroundMusic = new Audio(selectedMusic);
    currentBackgroundMusic.loop = true;
    currentBackgroundMusic.volume = 0.3; // Set volume to 30%
    originalMusicVolume = 0.3; // Store original volume
    
    // Play the music
    currentBackgroundMusic.play().catch(error => {
        console.log("Background music play failed:", error);
    });
}

// Initialize music selector when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeMusicSelector();
});

// KEYBIND CUSTOMIZATION SYSTEM
const defaultKeybinds = {
    moveUp: 'w',
    moveDown: 's',
    moveLeft: 'a',
    moveRight: 'd',
    pause: 'escape',
    arrowUp: 'arrowup',
    arrowDown: 'arrowdown',
    arrowLeft: 'arrowleft',
    arrowRight: 'arrowright',
    submit: 'enter'
};

let customKeybinds = { ...defaultKeybinds };
let editingKeybind = null;

// CARD SELECTION SYSTEM

    // Get wave cards by ID
    const waveCard1 = document.getElementById('wave-card-1');
    const waveCard2 = document.getElementById('wave-card-2');
    const waveCard3 = document.getElementById('wave-card-3');

    // Get round cards by ID
    const roundCard1 = document.getElementById('round-card-1');
    const roundCard2 = document.getElementById('round-card-2');

    

    // Add individual event listeners to wave cards

    

    // Add individual event listeners to round cards
    // roundCard1.addEventListener('click', createCardSelectionHandler(roundCard1, false));
    // roundCard2.addEventListener('click', createCardSelectionHandler(roundCard2, false));

    // Add round confirm button functionality
    const roundConfirmBtn = document.getElementById('round-confirm-btn');
    if (roundConfirmBtn) {
        roundConfirmBtn.addEventListener('click', function() {
            // Hide round completion overlay
            const roundCompletionOverlay = document.getElementById('round-completion-overlay');
            if (roundCompletionOverlay) {
                roundCompletionOverlay.style.display = 'none';
            }
            
            // After wave 3 completion, start new round
            if (currentWave >= maxWavesPerRound) {
                // Advance to next round
                nextRound();
                
                // Spawn enemies for the new round's first wave
                spawnEnemiesForWave(currentRound, 1);
            }
            
            // Resume game
            isGamePaused = false;
        });
    }

    // Add continue button functionality
    const continueBtn = document.getElementById('continue-btn');
    if (continueBtn) {
        continueBtn.addEventListener('click', function() {
            // Hide pause overlay
            const pauseOverlay = document.getElementById('pause-overlay');
            if (pauseOverlay) {
                pauseOverlay.style.display = 'none';
            }
            // Resume game
            isGamePaused = false;
        });
    }

// Card creation utilities
function createCardElement(card, index, isWaveCard) {
    const cardContainer = document.createElement('div');
    cardContainer.className = `card ${isWaveCard ? 'wave' : 'round'}-card ${card.rarity.toLowerCase()}-rarity`;
    cardContainer.dataset.cardId = card.id;
    cardContainer.dataset.cardIndex = index;
    
    // Create card structure
    const cardHeader = document.createElement('div');
    cardHeader.className = 'card-header';
    
    const cardContent = document.createElement('div');
    cardContent.className = 'card-content';
    
    const cardTitle = document.createElement('div');
    cardTitle.className = 'card-title';
    cardTitle.textContent = card.name;
    
    const cardDescription = document.createElement('div');
    cardDescription.className = 'card-text-area';
    cardDescription.textContent = card.description;
    
    const cardCircle = document.createElement('div');
    cardCircle.className = 'card-circle';
    cardCircle.textContent = card.rarity;
    
    // Assemble card
    cardContent.appendChild(cardTitle);
    cardContainer.appendChild(cardHeader);
    cardContainer.appendChild(cardContent);
    cardContainer.appendChild(cardCircle);
    
        
    // Add cursor styling
    cardContainer.style.cursor = 'pointer';
    
    return cardContainer;
}

function updateExistingCardElement(cardElement, card, index) {
    const cardType = card.id.split('_')[0];
    const headerColor = getCardTypeColor(cardType);
    
    // Update card header
    const cardHeader = cardElement.querySelector('.card-header');
    if (cardHeader) {
        cardHeader.style.backgroundColor = headerColor;
        cardHeader.textContent = cardType.toUpperCase();
    }
    
    // Update card content
    const cardTitle = cardElement.querySelector('.card-title');
    if (cardTitle) cardTitle.textContent = card.name;
    
    const cardDescription = cardElement.querySelector('.card-text-area');
    if (cardDescription) cardDescription.textContent = card.description;
    
    const cardCircle = cardElement.querySelector('.card-circle');
    if (cardCircle) cardCircle.textContent = card.rarity;
    
    // Store index
    cardElement.dataset.cardIndex = index;
}

// Random card selection utilities
function selectRandomCards(allCards, count, requireDifferentTypes = false) {
    const selectedCards = [];
    const usedTypes = new Set();
    const usedIndices = new Set();
    
    while (selectedCards.length < count && usedIndices.size < allCards.length) {
        const randomIndex = Math.floor(Math.random() * allCards.length);
        if (usedIndices.has(randomIndex)) continue;
        
        const card = allCards[randomIndex];
        const cardType = card.id.split('_')[0];
        
        if (requireDifferentTypes && usedTypes.has(cardType)) continue;
        
        selectedCards.push(card);
        usedIndices.add(randomIndex);
        if (requireDifferentTypes) usedTypes.add(cardType);
    }
    
    return selectedCards;
}
const waveRoundCardDatabase = {
    defense: [
        // A Rarity (4 cards)
        { id: 'defense_a1', name: 'Heal II', rarity: 'A', description: 'Heal by 1 heart for every 5 consecutive combos.', function: 'healPlayer', implement: 'healPlayer(1)' },
        { id: 'defense_a2', name: 'Health II', rarity: 'A', description: 'Increase Max Health by 2 hearts and heal to Max Health.', function: 'increaseMaxHealth', implement: 'increaseMaxHealth(2)' },
        { id: 'defense_a3', name: 'Dodge II', rarity: 'A', description: 'When you take damage, you have a 40% chance of not losing health.', function: 'dodgeDamage', implement: 'dodgeDamage(0.4)' },
        { id: 'defense_a4', name: 'Heal: Even', rarity: 'A', description: 'Healt by 2 hearts in Rounds of an even number.', function: 'healPlayer', implement: 'healPlayer(2)' },
        // B Rarity (6 cards)
        { id: 'defense_b1', name: 'Heal I', rarity: 'B', description: 'Heal by 1 heart at the end of each round.', function: 'healPlayer', implement: 'healPlayer(1)' },
        { id: 'defense_b2', name: 'Health I', rarity: 'B', description: 'Increase Max Health by 1.', function: 'increaseMaxHealth', implement: 'increaseMaxHealth(1)' },
        { id: 'defense_b3', name: 'Wound Pulse', rarity: 'B', description: 'When you take damage, repel enemies for 1 second.', function: 'repelEnemies', implement: 'repelEnemies(1)' },
        { id: 'defense_b4', name: 'Dodge I', rarity: 'B', description: 'When you take damage, slow enemies for 2 seconds.', function: 'slowEnemies', implement: 'slowEnemies(2)' },
        { id: 'defense_b5', name: 'Blight', rarity: 'B', description: 'When you take damage, you have a 20% chance of not losing health.', function: 'dodgeDamage', implement: 'dodgeDamage(0.2)' },
        { id: 'defense_b6', name: 'Shield', rarity: 'B', description: 'When an enemy is close to you, create a shield that lasts for 2 seconds. Cooldown: 10 seconds', function: 'createShield', implement: 'createShield(2)' }
    ],
    score: [
        // A Rarity (7 cards)
        { id: 'score_a1', name: 'Double No Chance!', rarity: 'A', description: 'Double score of an enemy when there are 3 combos in succession.', function: 'doubleScore', implement: 'doubleScore()' },
        { id: 'score_a2', name: 'Multiplier Ceiling', rarity: 'A', description: 'Set multiplier max from x3 to x5', function: 'setMultiplierCeiling', implement: 'setMultiplierCeiling(5)' },
        { id: 'score_a3', name: 'Multiplier Duration', rarity: 'A', description: 'Increase multiplier duration from 4 to 5 seconds.', function: 'increaseMultiplierDuration', implement: 'increaseMultiplierDuration(5)' },
        { id: 'score_a4', name: 'Free Score!', rarity: 'A', description: 'Set multiplier base to x1.7', function: 'setMultiplierBase', implement: 'setMultiplierBase(1.7)' },
        { id: 'score_a5', name: 'Multiplier Increase II', rarity: 'A', description: '20% of getting a Flat 10,000 score at end of a round.', function: 'increaseMultiplier', implement: 'increaseMultiplier(0.2)' },
        { id: 'score_a6', name: 'Score Insurance', rarity: 'A', description: 'When damaged, reduce score decrease by half.', function: 'reduceScoreDecrease', implement: 'reduceScoreDecrease(0.5)' },
        { id: 'score_a7', name: 'Combo Insurance', rarity: 'A', description: 'When incorrectly entering a combo, 40% chance it does not remove the multiplier.', function: 'comboInsurance', implement: 'comboInsurance(0.4)' },
        // B Rarity (5 cards)
        { id: 'score_b1', name: 'Double Chance', rarity: 'B', description: '50% Chance of doubling score of an enemy. Doubles before multiplier is applied.', function: 'doubleScore', implement: 'doubleScore()' },
        { id: 'score_b2', name: 'Base Increase', rarity: 'B', description: 'Increase base score by 10.', function: 'increaseBaseScore', implement: 'increaseBaseScore(10)' },
        { id: 'score_b3', name: 'Multiplier Increase I', rarity: 'B', description: 'Set multiplier base to x1.5', function: 'setMultiplierBase', implement: 'setMultiplierBase(1.5)' },
        { id: 'score_b4', name: 'North South Bonus', rarity: 'B', description: 'For every Up and Down arrow used in a correct combo, increase score of an enemy by 2.', function: 'northSouthBonus', implement: 'northSouthBonus(2)' },
        { id: 'score_b5', name: 'East West Bonus', rarity: 'B', description: 'For every Left and Right arrow used in a correct combo, increase score of an enemy by 2.', function: 'eastWestBonus', implement: 'eastWestBonus(2)' }
    ],
    movement: [
        // A Rarity (4 cards)
        { id: 'movement_a1', name: 'Dash', rarity: 'A', description: 'Dash towards specified direction.', function: 'dash', implement: 'dash()' },
        { id: 'movement_a2', name: 'Speed', rarity: 'A', description: 'Increase speed for 3 seconds.', function: 'increaseSpeed', implement: 'increaseSpeed(3)' },
        { id: 'movement_a3', name: 'I SAID JUMP', rarity: 'A', description: 'Jump towards the cursor\'s position.', function: 'jump', implement: 'jump()' },
        { id: 'movement_a4', name: 'Switch!', rarity: 'A', description: 'Switch positions with the furthest enemy.', function: 'switchPositions', implement: 'switchPositions()' }
    ],
    attack: [
        // A Rarity (6 cards)
        { id: 'attack_a1', name: 'Minimum Combo', rarity: 'A', description: 'When defeating an enemy, 20% chance of an enemy on the field to have their combo reduced to minimum combo length.', function: 'reduceCombo', implement: 'reduceCombo(0.2)' },
        { id: 'attack_a2', name: 'Consecutive Combo I', rarity: 'A', description: 'For every 3 consecutive combos, reduce all enemy combo lengths by 1.', function: 'reduceComboLength', implement: 'reduceComboLength(1)' },
        { id: 'attack_a3', name: 'Bystander Death', rarity: 'A', description: 'When defeating an enemy, 10% chance of killing a random enemy on the field.', function: 'killRandomEnemy', implement: 'killRandomEnemy(0.1)' },
        { id: 'attack_a4', name: 'Combo Reduction: Correct', rarity: 'A', description: 'When defeating an enemy, 40% chance of reducing an enemy\'s combo length by 1.', function: 'reduceCombo', implement: 'reduceCombo(0.4)' },
        { id: 'attack_a5', name: 'Combo Reduction: Incorrect', rarity: 'A', description: 'If you enter a wrong combo, 30% chance of reducing an enemy\'s combo length by 1.', function: 'reduceCombo', implement: 'reduceCombo(0.3)' },
        { id: 'attack_a6', name: 'Combo Reduction: Longest Combo', rarity: 'A', description: 'When defeating an enemy, 20% chance of reducing the enemy with the longest combo length by 2.', function: 'reduceLongestCombo', implement: 'reduceLongestCombo(0.2)' },
        // S Rarity (2 cards)
        { id: 'attack_s1', name: 'Consecutive Combo II', rarity: 'S', description: 'For every 3 consecutive combos, reduce all enemy combo lengths by 2.', function: 'reduceComboLength', implement: 'reduceComboLength(2)' },
        { id: 'attack_s2', name: 'Twin Telepathy', rarity: 'S', description: 'When defeating an enemy, 30% chance giving two enemies on the field to have the same combo.', function: 'twinTelepathy', implement: 'twinTelepathy(0.3)' }
    ],
    skill: [
        // S Rarity (6 cards)
        { id: 'skill_s1', name: 'Invincible', rarity: 'S', description: 'Become invulnerable from damage for 8 seconds. Cooldown: 25 seconds', function: 'invincible', implement: 'invincible(8)' },
        { id: 'skill_s2', name: 'Shockwave', rarity: 'S', description: 'Reduce combo length of all enemies by 3. Cooldown: 30 seconds', function: 'shockwave', implement: 'shockwave(3)' },
        { id: 'skill_s3', name: 'Time Freeze', rarity: 'S', description: 'Enemies freeze for 3 seconds. Cooldown: 25 seconds', function: 'timeFreeze', implement: 'timeFreeze(3)' },
        { id: 'skill_s4', name: 'Disorient', rarity: 'S', description: 'Enemies become distraught and move in random directions for 4 seconds. Cooldown: 20 seconds', function: 'disorient', implement: 'disorient(4)' },
        { id: 'skill_s5', name: 'Your Just Like Me!', rarity: 'S', description: 'Set a random amount of 2 to 4 enemies to have the same combo. Cooldown: 15 seconds', function: 'yourJustLikeMe', implement: 'yourJustLikeMe(2, 4)' },
        { id: 'skill_s6', name: 'Cardinal Direction', rarity: 'S', description: 'Change all enemies to have combos using only one cardinal direction. Cooldown: 60 seconds', function: 'cardinalDirection', implement: 'cardinalDirection()' }
    ]
};


function showWaveCompletion() {
    const waveCompletionOverlay = document.getElementById('wave-completion-overlay');
    waveCompletionOverlay.style.display = 'flex';
    
    // Get all available cards from database
    const allCards = Object.values(waveRoundCardDatabase).flat();
    
    // Select 3 random cards
    const selectedCards = selectRandomCards(allCards, 3);
    
    // Display cards using utility function
    const cardList = waveCompletionOverlay.querySelector('.cards-container');
    cardList.innerHTML = '';
    
    selectedCards.forEach((card, index) => {
        const cardElement = createCardElement(card, index, true);
        cardList.appendChild(cardElement);
    });
}

function getRarityColor(rarity) {
    switch(rarity) {
        case 'S': return '#FFD700'; // Gold
        case 'A': return '#C0C0C0'; // Blue  
        case 'B': return '#808080'; // Gray
        default: return '#666666'; // Dark gray
    }
}



function hideWaveCompletion() {
    const waveCompletionOverlay = document.getElementById('wave-completion-overlay');
    waveCompletionOverlay.style.display = 'none';
}

function hideRoundCompletion() {
    const roundCompletionOverlay = document.getElementById('round-completion-overlay');
    roundCompletionOverlay.style.display = 'none';
}


function showCardArchive() {
    const cardArchiveOverlay = document.getElementById('card-archive-overlay');
    cardArchiveOverlay.style.display = 'flex';
    
    // Initialize with defense cards
    loadCardType('defense');
    
    // Pause game while archive is open
    if (!isGamePaused) {
        togglePause();
    }
}

function hideCardArchive() {
    const cardArchiveOverlay = document.getElementById('card-archive-overlay');
    cardArchiveOverlay.style.display = 'none';
    
    // Show pause overlay instead of resuming game
    const pauseOverlay = document.getElementById('pause-overlay');
    pauseOverlay.style.display = 'flex';
}

function loadCardType(type) {
    currentCardType = type;
    selectedCard = null;
    
    // Update active button styling
    document.querySelectorAll('.card-type').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-type="${type}"]`).classList.add('active');
    
    // Clear and populate card container with cards
    const cardList = document.getElementById('card-list');
    cardList.innerHTML = '';
    
    // Get cards from waveRoundCardDatabase
    const cards = waveRoundCardDatabase[type] || [];
    
    // Display card count as absolute positioned
    const countDisplay = document.createElement('div');
    countDisplay.className = 'card-count';
    countDisplay.textContent = `${cards.length} cards in ${type.charAt(0).toUpperCase() + type.slice(1)}`;
    countDisplay.style.position = 'absolute';
    countDisplay.style.top = '0';
    countDisplay.style.left = '0';
    countDisplay.style.right = '0';
    countDisplay.style.textAlign = 'center';
    countDisplay.style.color = '#ccc';
    countDisplay.style.fontSize = '1.2em';
    countDisplay.style.padding = '10px';
    countDisplay.style.background = 'rgba(0, 0, 0, 0.5)';
    countDisplay.style.zIndex = '10';
    cardList.appendChild(countDisplay);
    
    // Create card elements for each card
    cards.forEach((card, index) => {
        const cardContainer = document.createElement('div');
        cardContainer.className = `archive-card ${card.rarity.toLowerCase()}-rarity`;
        cardContainer.dataset.cardId = card.id;
        
        // Create card structure similar to game cards
        const cardHeader = document.createElement('div');
        cardHeader.className = 'card-header';
        cardHeader.textContent = type.toUpperCase();
        cardHeader.style.backgroundColor = getCardTypeColor(type);
        
        const cardContent = document.createElement('div');
        cardContent.className = 'card-content';
        
        const cardTitle = document.createElement('div');
        cardTitle.className = 'card-title';
        cardTitle.textContent = card.name;
        
        const cardDescription = document.createElement('div');
        cardDescription.className = 'card-text-area';
        cardDescription.textContent = card.description;
        
        const cardCircle = document.createElement('div');
        cardCircle.className = 'card-circle';
        cardCircle.textContent = card.rarity;
        
        // Assemble card
        cardContent.appendChild(cardTitle);
        cardContent.appendChild(cardDescription);
        cardContainer.appendChild(cardHeader);
        cardContainer.appendChild(cardContent);
        cardContainer.appendChild(cardCircle);
        
        cardList.appendChild(cardContainer);
    });
    
    }

function selectCard(card) {
    selectedCard = card;

    // Update selected card visual
    document.querySelectorAll('.wave-card, .round-card').forEach(item => {
        item.style.border = '';
        item.style.boxShadow = '';
    });
    
    }


// BACKGROUND MUSIC SYSTEM
const backgroundMusicFiles = [
    "audioAssets/gameBackgroundMusic/2019-12-11_-_Retro_Platforming_-_David_Fesliyan.mp3",
    "audioAssets/gameBackgroundMusic/2021-08-16_-_8_Bit_Adventure_-_www.FesliyanStudios.com.mp3",
    "audioAssets/gameBackgroundMusic/2021-08-30_-_Boss_Time_-_www.FesliyanStudios.com.mp3"
];

let currentBackgroundMusic = null;
let originalMusicVolume = 0.3; // Store original volume

// SCORE SYSTEM
let totalScore = 0;
let currentMultiplier = 1.0;
let multiplierDuration = 0;
const BASE_SCORE = 10;
const MULTIPLIER_DURATION = 4000; // 4 seconds in milliseconds
const MULTIPLIER_INCREMENT = 0.5;
const MAX_MULTIPLIER = 3.0;

// Update and store high score in localStorage
function updateAndStoreScore(points) {
    totalScore += Math.floor(points * currentMultiplier);
    document.getElementById('score-total').textContent = totalScore;
    
    // Update high score in localStorage
    const storedHighScore = parseInt(localStorage.getItem('finalScore')) || 0;
    if (totalScore > storedHighScore) {
        localStorage.setItem('finalScore', totalScore);
    }
}

// Update and store highest combo in localStorage
function updateAndStoreCombo() {
    // Update high combo in localStorage
    const storedHighCombo = parseInt(localStorage.getItem('highestCombo')) || 0;
    if (consecutiveComboCount > storedHighCombo) {
        localStorage.setItem('highestCombo', consecutiveComboCount);
    }
}

function updateScore(points) {
    totalScore += Math.floor(points * currentMultiplier);
    document.getElementById('score-total').textContent = totalScore;
    
    // Update high score in localStorage
    const storedHighScore = parseInt(localStorage.getItem('finalScore')) || 0;
    if (totalScore > storedHighScore) {
        localStorage.setItem('finalScore', totalScore);
    }
}

function increaseMultiplier() {
    currentMultiplier = Math.min(currentMultiplier + MULTIPLIER_INCREMENT, MAX_MULTIPLIER);
    multiplierDuration = MULTIPLIER_DURATION;
    updateMultiplierDisplay();
}

function updateMultiplierDisplay() {
    const multiplierNumber = document.getElementById('multiplier-number');
    const multiplierBar = document.getElementById('multiplier-bar');
    
    multiplierNumber.textContent = currentMultiplier.toFixed(1);
    
    if (currentMultiplier > 1) {
        multiplierBar.style.display = 'block';
        const percentage = (multiplierDuration / MULTIPLIER_DURATION) * 100;
        multiplierBar.style.setProperty('--bar-width', `${percentage}%`);
    } else {
        multiplierBar.style.display = 'none';
    }
}

function updateMultiplierTimer(deltaTime) {
    if (currentMultiplier > 1 && multiplierDuration > 0) {
        multiplierDuration -= deltaTime;
        if (multiplierDuration <= 0) {
            currentMultiplier = 1.0;
            multiplierDuration = 0;
        }
        updateMultiplierDisplay();
    }
}

function updateComboDisplay() {
    const comboCounter = document.getElementById('combo-counter');
    if (comboCounter) {
        comboCounter.textContent = `Combo: ${consecutiveComboCount}`;
    }
    
    // Update high combo in localStorage
    updateAndStoreCombo();
}

function defeatEnemy() {
    // Calculate base score with combo length bonus
    let scoreMultiplier = 1;
    
    // Find the enemy that was defeated and check its combo length
    const enemies = document.querySelectorAll(".enemy");
    enemies.forEach(enemy => {
        if (!enemy.parentElement) { // Enemy has been removed
            // Find original combo data for this enemy
            const enemyCombo = enemyCombos.find(ec => ec.enemyElement === enemy);
            if (enemyCombo && enemyCombo.combo.length > 4) {
                // Add 5 points per arrow past 4
                const bonusPoints = (enemyCombo.combo.length - 4) * 5;
                scoreMultiplier = 1 + (bonusPoints / BASE_SCORE);
            }
        }
    });
    
    updateAndStoreScore(BASE_SCORE * scoreMultiplier);
    increaseMultiplier();
    updateComboDisplay();
    updateAndStoreCombo();
}

// Main game loop
let lastTime = 0;
function gameLoop(currentTime) {
    if (!lastTime) lastTime = currentTime;
    
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;
    
    // Only update multiplier timer if game is not paused and no overlays are open
    if (!isGamePaused && 
        document.getElementById('wave-completion-overlay').style.display !== 'flex' &&
        document.getElementById('round-completion-overlay').style.display !== 'flex') {
        updateMultiplierTimer(deltaTime);
    }
    
    // Continue game loop
    requestAnimationFrame(gameLoop);
}

// Start the game loop
requestAnimationFrame(gameLoop);


// Initialize high scores from localStorage
function initializeHighScores() {
    // Get stored high scores or set defaults
    const storedHighScore = localStorage.getItem('finalScore');
    const storedHighCombo = localStorage.getItem('highestCombo');
    
    // Initialize if not found
    if (!storedHighScore) {
        localStorage.setItem('finalScore', '0');
    }
    if (!storedHighCombo) {
        localStorage.setItem('highestCombo', '0');
    }
}

// Initialize background music when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Initialize high scores
    initializeHighScores();
    
    // Wait for user interaction before playing audio (browser requirement)
    document.addEventListener('click', function initAudio() {
        playRandomBackgroundMusic();
        document.removeEventListener('click', initAudio);
    }, { once: true });
});

const heartsContainer = document.createElement("div");
heartsContainer.id = "hearts";

for (let i = 0; i < 3; i++) {
    const heart = document.createElement("img");
    heart.src = "uiAssets/heart.png";
    heart.classList.add("heart");
    heartsContainer.appendChild(heart);
}

document.body.appendChild(heartsContainer);

// PLAYER CREATION

const player = document.createElement("div");
player.id = "player";

// player container (body container)
const playerBody = document.createElement("div");
playerBody.classList.add("player-body");

// actual player image
const bodyImage = document.createElement("img");
bodyImage.src = "playerAssets/player.png";
bodyImage.classList.add("player-image");


// list of possible faces
const faces = [
    "enemyAssets/faces/face_a.png",
    "enemyAssets/faces/face_b.png",
    "enemyAssets/faces/face_c.png",
    "enemyAssets/faces/face_d.png",
    "enemyAssets/faces/face_e.png",
    "enemyAssets/faces/face_f.png",
    "enemyAssets/faces/face_g.png",
    "enemyAssets/faces/face_h.png",
    "enemyAssets/faces/face_i.png",
    "enemyAssets/faces/face_k.png",
    "enemyAssets/faces/face_l.png",
];

// choose random face
const randomFace = faces[Math.floor(Math.random() * faces.length)];

const face = document.createElement("img");
face.src = randomFace;
face.classList.add("player-face");

// assemble player
playerBody.appendChild(bodyImage);
playerBody.appendChild(face);

player.appendChild(playerBody);
document.body.appendChild(player);

// PLAYER MOVEMENT

// PLAYER MOVEMENT WITH DIAGONALS

let playerX = 300;
let playerY = 300;
const speed = 4;

// keep track of which keys are pressed
const keysPressed = {};

// listen for key down/up
document.addEventListener("keydown", (e) => {
    keysPressed[e.key.toLowerCase()] = true;
});

document.addEventListener("keyup", (e) => {
    keysPressed[e.key.toLowerCase()] = false;
});

// update player position continuously
function updatePlayerPosition() {
    // Don't update if game is paused
    if (isGamePaused) {
        requestAnimationFrame(updatePlayerPosition);
        return;
    }
    
    // vertical movement
    if (keysPressed[customKeybinds.moveUp]) playerY -= speed;
    if (keysPressed[customKeybinds.moveDown]) playerY += speed;

    // horizontal movement
    if (keysPressed[customKeybinds.moveLeft]) playerX -= speed;
    if (keysPressed[customKeybinds.moveRight]) playerX += speed;

    // apply new position
    player.style.left = playerX + "px";
    player.style.top = playerY + "px";

    // loop
    requestAnimationFrame(updatePlayerPosition);
}

// start the movement loop
updatePlayerPosition();

// Grab existing elements
const progressBar = document.getElementById("progress-bar");
const roundWave = document.getElementById("round-wave");

// Initial values
let currentRound = 1;
let currentWave = 1;
const maxWavesPerRound = 3; // 3 normal waves per round

// Function to update progress and counters
function updateProgressBar(round, wave) {
    roundWave.innerHTML = `Round: ${round} | Wave: ${wave}`;

    // Progress fills proportionally (1/3 per wave)
    const progress = (wave / maxWavesPerRound) * 100;
    progressBar.style.width = `${progress}%`;
}

// Initialize progress bar at wave 1
updateProgressBar(currentRound, currentWave);

// ------------------------
// ENEMY CREATION
// ------------------------

// List of enemy body images
const enemyBodies = [
    "enemyAssets/circle/blue_circle.png",
    "enemyAssets/circle/green_circle.png",
    "enemyAssets/circle/purple_circle.png",
    "enemyAssets/circle/red_circle.png",
    "enemyAssets/circle/yellow_circle.png",
    "enemyAssets/diamond/blue_rhombus.png",
    "enemyAssets/diamond/green_rhombus.png",
    "enemyAssets/diamond/purple_rhombus.png",
    "enemyAssets/diamond/red_rhombus.png",
    "enemyAssets/diamond/yellow_rhombus.png",
    "enemyAssets/square/blue_square.png",
    "enemyAssets/square/green_square.png",
    "enemyAssets/square/purple_square.png",
    "enemyAssets/square/red_square.png",
    "enemyAssets/square/yellow_square.png",
    "enemyAssets/squircle/blue_squircle.png",
    "enemyAssets/squircle/green_squircle.png",
    "enemyAssets/squircle/purple_squircle.png",
    "enemyAssets/squircle/red_squircle.png",
    "enemyAssets/squircle/yellow_squircle.png",
];


// Function to get random edge position
function getRandomEdgePosition(enemyWidth = 60, enemyHeight = 60) {
    const margin = 50;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    let x, y;
    const edge = Math.floor(Math.random() * 4);

    switch(edge) {
        case 0: // top
            x = Math.random() * (windowWidth - enemyWidth);
            y = margin;
            break;
        case 1: // bottom
            x = Math.random() * (windowWidth - enemyWidth);
            y = windowHeight - enemyHeight - margin;
            break;
        case 2: // left
            x = margin;
            y = Math.random() * (windowHeight - enemyHeight);
            break;
        case 3: // right
            x = windowWidth - enemyWidth - margin;
            y = Math.random() * (windowHeight - enemyHeight);
            break;
    }

    return {x, y};
}


// ------------------------
// ENEMY COMBO STORAGE
// ------------------------

// We'll store all enemy combos in a global array
const enemyCombos = [];

// Function to spawn enemies gradually with combos
function spawnEnemiesForWave(round, wave) {
    const enemies = [];
    
    // Calculate base amount for this round: Round 1 starts with 6, each round multiplies by 1.3x
    const baseAmount = 6 * Math.pow(1.3, round - 1);
    
    // Each wave increases by 2 enemies from the base amount
    const enemiesToSpawn = Math.round(baseAmount + (wave - 1) * 2);
    
    const spawnIntervalTime = Math.max(500, 2000 - (round - 1) * 200 - (wave - 1) * 100); // Faster spawns in later rounds/waves

    let spawnedCount = 0;

    const spawnInterval = setInterval(() => {
        // Don't spawn enemies if game is paused
        if (isGamePaused) {
            return;
        }
        
        const enemiesThisBatch = Math.min(2, enemiesToSpawn - spawnedCount);
        
        for (let i = 0; i < enemiesThisBatch; i++) {
            // Regular enemy spawning
            const enemy = document.createElement("div");
            enemy.classList.add("enemy");

            // Consistent size - same as player body (60px)
            const size = 60;
            enemy.style.width = size + "px";
            enemy.style.height = size + "px";
            enemy.style.position = "absolute";

            // Random spawn position (top, left, right, bottom) - using full page bounds
            const side = Math.floor(Math.random() * 4);
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;
            
            switch(side) {
                case 0: // top
                    enemy.style.left = Math.random() * (windowWidth - size) + "px";
                    enemy.style.top = "-100px";
                    break;
                case 1: // right
                    enemy.style.left = windowWidth + "px";
                    enemy.style.top = Math.random() * (windowHeight - size) + "px";
                    break;
                case 2: // bottom
                    enemy.style.left = Math.random() * (windowWidth - size) + "px";
                    enemy.style.top = windowHeight + "px";
                    break;
                case 3: // left
                    enemy.style.left = "-100px";
                    enemy.style.top = Math.random() * (windowHeight - size) + "px";
                    break;
            }

            // Random enemy body from enemyBodies list
            const enemyImg = document.createElement("img");
            const randomBody = enemyBodies[Math.floor(Math.random() * enemyBodies.length)];
            enemyImg.src = randomBody;
            enemyImg.style.width = "100%";
            enemyImg.style.height = "100%";
            enemyImg.style.objectFit = "contain";

            // Random face image
            const faceImg = document.createElement("img");
            const randomFace = faces[Math.floor(Math.random() * faces.length)];
            faceImg.src = randomFace;
            faceImg.style.width = "40%";
            faceImg.style.height = "40%";
            faceImg.style.position = "absolute";
            faceImg.style.top = "30%";
            faceImg.style.left = "30%";
            faceImg.style.objectFit = "contain";

            // Arrow combo container
            const arrowContainer = document.createElement("div");
            arrowContainer.classList.add("arrow-container");

            // Determine max and min combo length based on current round
            const maxComboLength = 5 + Math.floor((currentRound - 1) / 2);
            const minComboLength = Math.max(1, maxComboLength - 2);

            // Generate weighted random combo length
            let comboLength;
            const rand = Math.random();
            if (rand < 0.4) comboLength = minComboLength;
            else if (rand > 0.9) comboLength = maxComboLength;
            else {
                comboLength = Math.floor(Math.random() * (maxComboLength - minComboLength - 1)) + minComboLength + 1 || minComboLength;
            }

            // Store this enemy's combo directions
            const enemyComboDirections = [];

            // Create arrows
            const arrowFiles = ["arrowUp.png","arrowDown.png","arrowLeft.png","arrowRight.png"];
            for (let j = 0; j < comboLength; j++) {
                const randomArrow = arrowFiles[Math.floor(Math.random() * arrowFiles.length)];

                // Map file to cardinal direction
                let direction;
                if (randomArrow.includes("Up")) direction = "Up";
                else if (randomArrow.includes("Down")) direction = "Down";
                else if (randomArrow.includes("Left")) direction = "Left";
                else if (randomArrow.includes("Right")) direction = "Right";

                enemyComboDirections.push(direction);

                // Create arrow image
                const arrow = document.createElement("img");
                arrow.src = `arrowAssets/${randomArrow}`;
                arrow.classList.add("enemy-arrow");

                if (direction === "Up") arrow.classList.add("arrow-up");
                else if (direction === "Down") arrow.classList.add("arrow-down");
                else if (direction === "Left") arrow.classList.add("arrow-left");
                else if (direction === "Right") arrow.classList.add("arrow-right");

                arrowContainer.appendChild(arrow);
            }

            // Save enemy combo to global array
            enemyCombos.push({
                enemyElement: enemy,
                combo: enemyComboDirections
            });

            // Position arrow container above enemy
            arrowContainer.style.position = "absolute";
            arrowContainer.style.bottom = "calc(100% + 10px)";
            arrowContainer.style.left = "50%";
            arrowContainer.style.transform = "translateX(-50%)";
            arrowContainer.style.display = "flex";
            arrowContainer.style.gap = "3px";

            // Assemble enemy
            enemy.appendChild(enemyImg);
            enemy.appendChild(faceImg);
            enemy.appendChild(arrowContainer);

            document.body.appendChild(enemy);
            enemies.push(enemy);
        }

        spawnedCount += enemiesThisBatch;
        if (spawnedCount >= enemiesToSpawn) clearInterval(spawnInterval);
    }, spawnIntervalTime);

    return enemies;
}

// Example usage
spawnEnemiesForWave(currentRound, currentWave);

// Movement speed of enemies (pixels per frame)
const enemySpeed = 0.7;

function moveEnemiesTowardPlayer() {
    // Don't move enemies if game is paused
    if (isGamePaused) {
        requestAnimationFrame(moveEnemiesTowardPlayer);
        return;
    }
    
    const enemies = document.querySelectorAll(".enemy");

    const playerRect = player.getBoundingClientRect();
    const playerX = playerRect.left + playerRect.width / 2;
    const playerY = playerRect.top + playerRect.height / 2;

    enemies.forEach((enemy) => {
        const enemyRect = enemy.getBoundingClientRect();
        let enemyX = enemyRect.left + enemyRect.width / 2;
        let enemyY = enemyRect.top + enemyRect.height / 2;

        // Vector toward player
        let dx = playerX - enemyX;
        let dy = playerY - enemyY;

        // Normalize
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance > 0) {
            dx /= distance;
            dy /= distance;
        }

        // Move enemy (no collision avoidance with other enemies)
        enemy.style.left = (enemy.offsetLeft + dx * enemySpeed) + "px";
        enemy.style.top = (enemy.offsetTop + dy * enemySpeed) + "px";
    });

    requestAnimationFrame(moveEnemiesTowardPlayer);
}

// Start enemy movement loop
moveEnemiesTowardPlayer();

// ------------------------
// DYNAMIC PROGRESS BAR & WAVE/ROUND COUNTERS
// ------------------------


// ------------------------
// ROUND AND WAVE MANAGEMENT FUNCTIONS (do not increment yet)
// ------------------------

// Advance to the next wave
function nextWave() {
    if (currentWave < maxWavesPerRound) {
        currentWave++;
    } else {
        // If wave 3 reached, next wave would reset and round could increment
        currentWave = 1;
        // currentRound++; // Do not increment yet
    }

    updateProgressBar(currentRound, currentWave); // dynamically update progress bar and counters
}

// Advance to the next round
function nextRound() {
    currentRound++;
    currentWave = 1;
    updateProgressBar(currentRound, currentWave);
}

// ------------------------
// PLAYER HEARTS AND COUNTER
// ------------------------

let playerImmune = false; // tracks if player is currently immune
let heartCounter = 3;     // initial hearts

function isColliding(el1, el2) {
    const rect1 = el1.getBoundingClientRect();
    const rect2 = el2.getBoundingClientRect();

    return !(
        rect1.top > rect2.bottom ||
        rect1.bottom < rect2.top ||
        rect1.left > rect2.right ||
        rect1.right < rect2.left
    );
}

// Function to check if all enemies are cleared and advance wave
function checkWaveCompletion() {
    const enemies = document.querySelectorAll(".enemy");
    
    // If no enemies left and we're not in final battle
    if (enemies.length === 0 && currentWave < maxWavesPerRound) {
        // Show wave completion cards before advancing
        showWaveCompletionCards(() => {
            // After cards are closed, advance to next wave
            nextWave();
            
            // Spawn enemies for the new wave
            spawnEnemiesForWave(currentRound, currentWave);
        });
    }
    // If no enemies left and we're in final battle (wave 4)
    else if (enemies.length === 0 && currentWave === maxWavesPerRound) {
        // Show round completion cards before advancing
        showRoundCompletionCards(() => {
            // After cards are closed, advance to next round
            nextRound();
            
            // Spawn enemies for the new round's first wave
            spawnEnemiesForWave(currentRound, 1);
        });
    }
}

// Function to show wave completion overlay with 3 cards
function showWaveCompletionCards(onComplete) {
    // Pause game
    isGamePaused = true;
    
    // Get existing overlay elements
    const overlay = document.getElementById("wave-completion-overlay");
    const confirmButton = document.getElementById("wave-confirm-btn");
    
    // Select 3 random A and B rarity cards from different types
    const selectedCards = [];
    const usedTypes = new Set();
    
    // Get all A and B rarity cards
    const allABCards = [];
    Object.keys(waveRoundCardDatabase).forEach(type => {
        const cards = waveRoundCardDatabase[type].filter(card => card.rarity === 'A' || card.rarity === 'B');
        allABCards.push(...cards);
    });
    
    // Select 3 cards from different types
    let attempts = 0;
    const maxAttempts = 100;
    
    while (selectedCards.length < 3 && attempts < maxAttempts) {
        const randomIndex = Math.floor(Math.random() * allABCards.length);
        const card = allABCards[randomIndex];
        const cardType = card.id.split('_')[0];
        
        // Only add if type hasn't been used yet
        if (!usedTypes.has(cardType)) {
            selectedCards.push(card);
            usedTypes.add(cardType);
        }
        attempts++;
    }
    
    // If we couldn't get 3 different types, fill remaining with any available A/B cards
    while (selectedCards.length < 3) {
        const randomIndex = Math.floor(Math.random() * allABCards.length);
        const card = allABCards[randomIndex];
        
        // Check if this card is already selected
        const isAlreadySelected = selectedCards.some(selected => selected.id === card.id);
        if (!isAlreadySelected) {
            selectedCards.push(card);
        }
    }
    
    // Update existing cards with selected card information
    const cardElements = overlay.querySelectorAll('.wave-card');
    cardElements.forEach((cardElement, index) => {
        if (selectedCards[index]) {
            const card = selectedCards[index];
            
            // Get card type from first part of id
            const cardType = card.id.split('_')[0];
            const headerColor = getCardTypeColor(cardType);
            
            // Update card header color and text
            const cardHeader = cardElement.querySelector('.card-header');
            if (cardHeader) {
                cardHeader.style.backgroundColor = headerColor;
                cardHeader.textContent = cardType.toUpperCase();
            }
            
            // Update card title
            const cardTitle = cardElement.querySelector('.card-title');
            if (cardTitle) cardTitle.textContent = card.name;
            
            // Update card description
            const cardDescription = cardElement.querySelector('.card-text-area');
            if (cardDescription) cardDescription.textContent = card.description;
            
            // Update card circle with rarity
            const cardCircle = cardElement.querySelector('.card-circle');
            if (cardCircle) cardCircle.textContent = card.rarity;
        }
    });
    
    // Show overlay
    overlay.style.display = "flex";
    
    // Set up confirm button click handler
    confirmButton.onclick = () => {
        // Hide overlay and resume game
        overlay.style.display = "none";
        isGamePaused = false;
        onComplete();
    };
}

function getCardTypeColor(cardType) {
    switch(cardType) {
        case 'defense': return '#4ab9a3';
        case 'attack': return '#ab58a8';
        case 'movement': return '#5fa1e7';
        case 'score': return '#5f6ee7';
        case 'skill': return '#85daeb';
        default: return '#666666';
    }
}

// Function to show round completion overlay with 2 cards
function showRoundCompletionCards(onComplete) {
    // Pause game
    pauseGame();
    
    // Get existing overlay elements
    const overlay = document.getElementById("round-completion-overlay");
    
    // Select 2 random A and S rarity cards from different types with at least one S
    const selectedCards = [];
    const usedTypes = new Set();
    
    // Get all A and S rarity cards
    const allASCards = [];
    Object.keys(waveRoundCardDatabase).forEach(type => {
        const cards = waveRoundCardDatabase[type].filter(card => card.rarity === 'A' || card.rarity === 'S');
        allASCards.push(...cards);
    });
    
    // First, ensure at least one S card
    const sCards = allASCards.filter(card => card.rarity === 'S');
    let hasSCard = false;
    
    if (sCards.length > 0) {
        // Select 1 random S card
        const randomSIndex = Math.floor(Math.random() * sCards.length);
        const sCard = sCards[randomSIndex];
        const sCardType = sCard.id.split('_')[0];
        
        if (!usedTypes.has(sCardType)) {
            selectedCards.push(sCard);
            usedTypes.add(sCardType);
            hasSCard = true;
        }
    }
    
    // Then select remaining A cards from different types
    while (selectedCards.length < 2) {
        const randomIndex = Math.floor(Math.random() * allASCards.length);
        const card = allASCards[randomIndex];
        const cardType = card.id.split('_')[0];
        
        // Only add if type hasn't been used yet and is A rarity
        if (!usedTypes.has(cardType) && card.rarity === 'A') {
            selectedCards.push(card);
            usedTypes.add(cardType);
        }
    }
    
        
    // Update existing cards with selected card information
    const cardElements = overlay.querySelectorAll('.round-card');
    cardElements.forEach((cardElement, index) => {
        if (selectedCards[index]) {
            const card = selectedCards[index];
            
            // Get card type from first part of id
            const cardType = card.id.split('_')[0];
            const headerColor = getCardTypeColor(cardType);
            
            // Update card header color and text
            const cardHeader = cardElement.querySelector('.card-header');
            if (cardHeader) {
                cardHeader.style.backgroundColor = headerColor;
                cardHeader.textContent = cardType.toUpperCase();
            }
            
            // Update card title
            const cardTitle = cardElement.querySelector('.card-title');
            if (cardTitle) cardTitle.textContent = card.name;
            
            // Update card description
            const cardDescription = cardElement.querySelector('.card-text-area');
            if (cardDescription) cardDescription.textContent = card.description;
            
            // Update card circle with rarity
            const cardCircle = cardElement.querySelector('.card-circle');
            if (cardCircle) cardCircle.textContent = card.rarity;
            
            // Store card index on element for selection
            cardElement.dataset.cardIndex = index;
            
                    }
    });
    
    // Show overlay
    overlay.style.display = "flex";
    
    }

function pauseGame() {
    isGamePaused = true;
    // Add visual pause indicator if needed
}

function resumeGame() {
    isGamePaused = false;
    // Remove visual pause indicator if needed
}

// Function to decrease player hearts
function decreaseHeart() {
    if (heartCounter <= 0) return;

    // Decrease counter
    heartCounter--;

    // Reset multiplier when player takes damage
    currentMultiplier = 1.0;
    multiplierDuration = 0;
    updateMultiplierDisplay();

    // Update visual hearts
    const hearts = document.querySelectorAll("#hearts .heart");
    for (let i = hearts.length - 1; i >= 0; i--) {
        if (!hearts[i].classList.contains("lost")) {
            hearts[i].classList.add("lost");
            hearts[i].style.opacity = "0.3"; // visually show lost heart
            break; // only remove one heart per collision
        }
    }

    // Check if player is out of hearts
    if (heartCounter === 0) {
        // Redirect to end menu
        window.location.href = "endMenu.html";
    }
}

// Collision detection loop
function checkEnemyCollisions() {
    // Don't check collisions if game is paused
    if (isGamePaused) {
        requestAnimationFrame(checkEnemyCollisions);
        return;
    }
    
    const enemies = document.querySelectorAll(".enemy");

    enemies.forEach(enemy => {
        if (isColliding(player, enemy)) {
            if (!playerImmune) {
                // Player hit: decrease heart
                decreaseHeart();

                // Remove the enemy that touched the player
                enemy.remove();
                
                // Only update score if player wasn't damaged (enemy defeated without collision)
                // Note: Since this is collision detection, player is taking damage, so no score
                
                // Make player immune for 3 seconds
                playerImmune = true;
                player.style.opacity = "0.6"; // optional visual indicator

                setTimeout(() => {
                    playerImmune = false;
                    player.style.opacity = "1"; // reset visual
                }, 3000);
                
                // Check if wave is complete after enemy removal
                checkWaveCompletion();
            }
            // else: player is immune, enemy remains
        }
    });

    requestAnimationFrame(checkEnemyCollisions);
}

// Start collision checking
checkEnemyCollisions();

const pauseButton = document.getElementById("pause-button");

// Pause button
pauseButton.addEventListener("click", () => {
    console.log("Pause button clicked!");
    // Future: toggle game pause here
});

// Menu button
const menuButton = document.getElementById("menu-button");
menuButton.addEventListener("click", () => {
    console.log("Menu button clicked!");
    // Future: open menu overlay
});

// Grab player arrow container
const playerArrowContainer = document.getElementById("player-arrow-container");

// Map keys to arrow PNGs
const arrowKeyMap = {
    "arrowup": "arrowAssets/arrowUp.png",
    "arrowdown": "arrowAssets/arrowDown.png",
    "arrowleft": "arrowAssets/arrowLeft.png",
    "arrowright": "arrowAssets/arrowRight.png"
};

// Map arrow keys to audio files
const arrowAudioMap = {
    "arrowup": "audioAssets/arrow/game-fx-8-bit-chiptune-noise-beep-01.wav",
    "arrowdown": "audioAssets/arrow/game-fx-8-bit-chiptune-noise-beep-02.wav",
    "arrowleft": "audioAssets/arrow/game-fx-8-bit-chiptune-noise-beep-03.wav",
    "arrowright": "audioAssets/arrow/game-fx-8-bit-chiptune-noise-beep-04.wav"
};

// Track which keys are currently pressed
const keysPressedArrow = {};

// Player arrow combo will be stored in an array of directions
let playerComboDirections = [];


// Helper function to compare arrays
function arraysEqual(a, b) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}

// Listen for keydown
document.addEventListener("keydown", (e) => {
    const key = e.key.toLowerCase();

    // Check custom keybinds for pause
    if (key === customKeybinds.pause && document.getElementById('settings-overlay').style.display !== 'flex') {
        togglePause();
        return;
    }
    
    // Don't process game keys if game is paused
    if (isGamePaused) return;

    // Only act if key wasn't already pressed
    if (!keysPressedArrow[key]) {
        keysPressedArrow[key] = true;

        // Handle arrow key input using custom keybinds
        if (key === customKeybinds.arrowUp || key === customKeybinds.arrowDown || 
            key === customKeybinds.arrowLeft || key === customKeybinds.arrowRight) {
            
            // Play arrow audio
            const arrowAudio = new Audio(arrowAudioMap[key]);
            arrowAudio.volume = window.sfxVolume || 0.4;
            arrowAudio.play().catch(e => console.log("Audio play failed:", e));

            const arrowImg = document.createElement("img");
            arrowImg.src = arrowKeyMap[key];
            arrowImg.classList.add("player-arrow");

            // Add class for colored background and add to combo list
            if (key === customKeybinds.arrowUp) {
                arrowImg.classList.add("arrow-up");
                playerComboDirections.push("Up");
            } else if (key === customKeybinds.arrowDown) {
                arrowImg.classList.add("arrow-down");
                playerComboDirections.push("Down");
            } else if (key === customKeybinds.arrowLeft) {
                arrowImg.classList.add("arrow-left");
                playerComboDirections.push("Left");
            } else if (key === customKeybinds.arrowRight) {
                arrowImg.classList.add("arrow-right");
                playerComboDirections.push("Right");
            }

            playerArrowContainer.appendChild(arrowImg);

            // Limit combo length - remove first element if exceeds 10
            if (playerComboDirections.length > 10) {
                playerComboDirections.shift(); // remove first direction
                playerArrowContainer.removeChild(playerArrowContainer.children[0]); // remove first arrow
            }
        }

        // Backspace → remove last arrow
        else if (key === "backspace") {
            if (playerArrowContainer.lastChild) {
                playerArrowContainer.removeChild(playerArrowContainer.lastChild);
                playerComboDirections.pop(); // remove last direction
            }
            e.preventDefault();
        }

        // Submit combo → compare player combo with enemy combos, then clear
        else if (key === customKeybinds.submit) {
            if (playerComboDirections.length > 0) {
                // Compare player combo with each enemy combo
                let matchedEnemies = [];
                enemyCombos.forEach((enemyCombo) => {
                    // Check if combos match exactly
                    if (arraysEqual(playerComboDirections, enemyCombo.combo)) {
                        matchedEnemies.push({
                            enemyElement: enemyCombo.enemyElement,
                            combo: enemyCombo.combo
                        });
                    }
                });
                
                // Play appropriate audio based on match result
                if (matchedEnemies.length > 0) {
                    // Success - play jingle_NES09.ogg
                    const successAudio = new Audio("audioAssets/jingles_NES09.ogg");
                    successAudio.volume = 0.4;
                    successAudio.play().catch(e => console.log("Success audio play failed:", e));
                    
                    // Increment consecutive combo counter
                    consecutiveComboCount++;
                    
                    // Handle matched enemies
                    matchedEnemies.forEach(matched => {
                        // Regular enemy - remove immediately
                        matched.enemyElement.remove();
                        
                        // Update score when enemy is defeated
                        defeatEnemy();
                        
                        // Remove from enemyCombos array
                        const index = enemyCombos.findIndex(ec => ec.enemyElement === matched.enemyElement);
                        if (index > -1) {
                            enemyCombos.splice(index, 1);
                        }
                    });
                    
                    // Check if wave is complete after defeating enemies
                    checkWaveCompletion();
                } else {
                    // Failure - play jingles_NES10.ogg
                    const failureAudio = new Audio("audioAssets/jingles_NES10.ogg");
                    failureAudio.volume = 0.4;
                    failureAudio.play().catch(e => console.log("Failure audio play failed:", e));
                    
                    // Reset consecutive combo counter on wrong combo
                    consecutiveComboCount = 0;
                    
                    // Reset multiplier when wrong combo is entered
                    currentMultiplier = 1.0;
                    multiplierDuration = 0;
                    updateMultiplierDisplay();
                    updateComboDisplay();
                }
            }
            
            // Clear combo list and visual arrows
            playerComboDirections = [];
            while (playerArrowContainer.firstChild) {
                playerArrowContainer.removeChild(playerArrowContainer.firstChild);
            }
            e.preventDefault();
        }
    }
});

// PAUSE SYSTEM
let gameLoops = [];
let enemyMovements = [];

function togglePause() {
    isGamePaused = !isGamePaused;
    const pauseOverlay = document.getElementById('pause-overlay');
    
    if (isGamePaused) {
        // Show pause overlay
        pauseOverlay.style.display = 'flex';
        
        // Store original volume and lower background music volume by 70% (keep 30% volume)
        if (currentBackgroundMusic) {
            originalMusicVolume = currentBackgroundMusic.volume;
            currentBackgroundMusic.volume = originalMusicVolume * 0.3;
        }
        
        // Stop all game loops and animations
        gameLoops.forEach(loopId => clearInterval(loopId));
        gameLoops = [];
        
        // Stop enemy movements
        enemyMovements.forEach(movement => {
            if (movement.element && movement.element.style) {
                movement.element.style.transition = 'none';
            }
        });
        
    } else {
        // Hide pause overlay
        pauseOverlay.style.display = 'none';
        
        // Restore background music volume
        if (currentBackgroundMusic) {
            currentBackgroundMusic.volume = originalMusicVolume;
        }
        
        // Resume game loops and animations
        resumeEnemyMovements();
    }
}


function resumeEnemyMovements() {
    // Resume enemy movements
    enemyMovements.forEach(movement => {
        if (movement.element && movement.element.style) {
            movement.element.style.transition = '';
        }
    });
}

// Pause button event listener
document.addEventListener('DOMContentLoaded', function() {
    const pauseButton = document.getElementById('pause-button');
    if (pauseButton) {
        pauseButton.addEventListener('click', togglePause);
    }
    
        
    // Card Archive button functionality
    const cardArchiveBtn = document.getElementById('card-archive-btn');
    if (cardArchiveBtn) {
        cardArchiveBtn.addEventListener('click', function() {
            showCardArchive();
        });
    }
    
    // Settings button functionality
    const settingsBtn = document.getElementById('settings-btn');
    if (settingsBtn) {
        settingsBtn.addEventListener('click', function() {
            showSettingsOverlay();
        });
    }
    
    // Settings section navigation
    const sectionTitles = document.querySelectorAll('.settings-section-title');
    sectionTitles.forEach(title => {
        title.addEventListener('click', function() {
            const section = this.getAttribute('data-section');
            showSettingsSection(section);
        });
    });
    
    // Volume slider functionality
    const musicVolumeSlider = document.getElementById('music-volume');
    const musicVolumeValue = document.getElementById('music-volume-value');
    const sfxVolumeSlider = document.getElementById('sfx-volume');
    const sfxVolumeValue = document.getElementById('sfx-volume-value');
    
    if (musicVolumeSlider && musicVolumeValue) {
        musicVolumeSlider.addEventListener('input', function() {
            const value = this.value;
            musicVolumeValue.textContent = value + '%';
            const newVolume = value / 100;
            if (currentBackgroundMusic) {
                currentBackgroundMusic.volume = newVolume;
                originalMusicVolume = newVolume; // Update original volume for pause system
            }
        });
    }
    
    if (sfxVolumeSlider && sfxVolumeValue) {
        sfxVolumeSlider.addEventListener('input', function() {
            const value = this.value;
            sfxVolumeValue.textContent = value + '%';
            // Store SFX volume for future sound effects
            window.sfxVolume = value / 100;
        });
    }
    
    // Exit button functionality for settings
    const settingsExitBtn = document.getElementById('settings-exit-btn');
    if (settingsExitBtn) {
        settingsExitBtn.addEventListener('click', function() {
            const pauseOverlay = document.getElementById('pause-overlay');
            const settingsOverlay = document.getElementById('settings-overlay');
            
            settingsOverlay.style.display = 'none';
            pauseOverlay.style.display = 'flex';
        });
    }
    
    // Initialize SFX volume
    window.sfxVolume = 0.4;
    
    // Card Archive overlay event listeners
    const cardArchiveCloseBtn = document.getElementById('card-archive-close-btn');
    if (cardArchiveCloseBtn) {
        cardArchiveCloseBtn.addEventListener('click', hideCardArchive);
    }
    
    // Card type selection listeners
    const cardTypeButtons = document.querySelectorAll('.card-type');
    cardTypeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const type = this.dataset.type;
            loadCardType(type);
        });
    });
});

function initializeKeybinds() {
    // Load saved keybinds from localStorage
    const saved = localStorage.getItem('customKeybinds');
    if (saved) {
        customKeybinds = { ...defaultKeybinds, ...JSON.parse(saved) };
        updateKeybindDisplay();
    }
}

function updateKeybindDisplay() {
    Object.keys(customKeybinds).forEach(action => {
        const keyElement = document.querySelector(`[data-action="${action}"]`);
        if (keyElement) {
            keyElement.textContent = formatKeyDisplay(customKeybinds[action]);
        }
    });
}

function formatKeyDisplay(key) {
    const keyMap = {
        'escape': 'Escape',
        'arrowup': '↑',
        'arrowdown': '↓',
        'arrowleft': '←',
        'arrowright': '→',
        'enter': 'Enter',
        ' ': 'Space'
    };
    return keyMap[key.toLowerCase()] || key.toUpperCase();
}

function startKeybindEdit(action) {
    if (editingKeybind) return; // Already editing
    
    editingKeybind = action;
    const keyElement = document.querySelector(`[data-action="${action}"]`);
    const buttonElement = document.querySelector(`[data-action="${action}"].keybind-edit-btn`);
    
    keyElement.classList.add('editing');
    buttonElement.classList.add('editing');
    buttonElement.textContent = 'Cancel';
    
    // Add temporary key listener for capturing new key
    document.addEventListener('keydown', captureNewKey, true);
}

function captureNewKey(e) {
    e.preventDefault();
    e.stopPropagation();
    
    if (editingKeybind) {
        const key = e.key.toLowerCase();
        
        // ESC cancels editing
        if (key === 'escape') {
            cancelKeybindEdit();
            return;
        }
        
        // Check for conflicts
        const conflictingAction = Object.keys(customKeybinds).find(
            action => customKeybinds[action] === key && action !== editingKeybind
        );
        
        if (conflictingAction) {
            alert(`This key is already assigned to "${conflictingAction}". Please choose a different key.`);
            return;
        }
        
        // Assign new key
        customKeybinds[editingKeybind] = key;
        localStorage.setItem('customKeybinds', JSON.stringify(customKeybinds));
        
        // Update display
        const keyElement = document.querySelector(`[data-action="${editingKeybind}"]`);
        keyElement.textContent = formatKeyDisplay(key);
        
                
        cancelKeybindEdit();
    }
}

function cancelKeybindEdit() {
    if (editingKeybind) {
        const keyElement = document.querySelector(`[data-action="${editingKeybind}"]`);
        const buttonElement = document.querySelector(`[data-action="${editingKeybind}"].keybind-edit-btn`);
        
        keyElement.classList.remove('editing');
        buttonElement.classList.remove('editing');
        buttonElement.textContent = 'Edit';
        
        editingKeybind = null;
        document.removeEventListener('keydown', captureNewKey, true);
    }
}


// Initialize keybind system
document.addEventListener('DOMContentLoaded', function() {
    initializeKeybinds();
    
    // Add event listeners to edit buttons
    const editButtons = document.querySelectorAll('.keybind-edit-btn');
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            if (editingKeybind === action) {
                cancelKeybindEdit();
            } else {
                startKeybindEdit(action);
            }
        });
    });
});

// SETTINGS OVERLAY FUNCTIONS
function showSettingsOverlay() {
    const pauseOverlay = document.getElementById('pause-overlay');
    const settingsOverlay = document.getElementById('settings-overlay');
    
    // Hide pause overlay, show settings overlay
    pauseOverlay.style.display = 'none';
    settingsOverlay.style.display = 'flex';
    
    // Show first section by default
    showSettingsSection('audio');
}

function showSettingsSection(sectionName) {
    // Hide all sections
    const sections = document.querySelectorAll('.settings-section');
    sections.forEach(section => section.classList.add('hidden'));
    
    // Remove active class from all titles
    const titles = document.querySelectorAll('.settings-section-title');
    titles.forEach(title => title.classList.remove('active'));
    
    // Show selected section
    const selectedSection = document.getElementById(sectionName + '-section');
    if (selectedSection) {
        selectedSection.classList.remove('hidden');
    }
    
    // Add active class to selected title
    const selectedTitle = document.querySelector(`[data-section="${sectionName}"]`);
    if (selectedTitle) {
        selectedTitle.classList.add('active');
    }
}

// Keyup resets
document.addEventListener("keyup", (e) => {
    const key = e.key.toLowerCase();
    keysPressedArrow[key] = false;
});
