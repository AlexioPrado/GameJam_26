// Game pause/resume functions
let isGamePaused = false;

// MUSIC SELECTION SYSTEM
let currentMusicIndex = 0;

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



// BACKGROUND MUSIC SYSTEM
const backgroundMusicFiles = [
    "audioAssets/gameBackgroundMusic/2019-12-11_-_Retro_Platforming_-_David_Fesliyan.mp3",
    "audioAssets/gameBackgroundMusic/2021-08-16_-_8_Bit_Adventure_-_www.FesliyanStudios.com.mp3",
    "audioAssets/gameBackgroundMusic/2021-08-30_-_Boss_Time_-_www.FesliyanStudios.com.mp3"
];

let currentBackgroundMusic = null;

function playRandomBackgroundMusic() {
    // Stop current music if playing
    if (currentBackgroundMusic) {
        currentBackgroundMusic.pause();
        currentBackgroundMusic = null;
    }
    
    // Select random music file
    const randomIndex = Math.floor(Math.random() * backgroundMusicFiles.length);
    const selectedMusic = backgroundMusicFiles[randomIndex];
    
    // Create new audio element
    currentBackgroundMusic = new Audio(selectedMusic);
    currentBackgroundMusic.loop = true;
    currentBackgroundMusic.volume = 0.3; // Set volume to 30%
    
    // Play the music
    currentBackgroundMusic.play().catch(error => {
        console.log("Background music play failed:", error);
    });
}

// Initialize background music when page loads
document.addEventListener('DOMContentLoaded', function() {
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

// Function to calculate number of enemies for a wave
function calculateEnemies(round, wave) {
    // Wave 1 scales with 0.3 multiplier per round
    let wave1Enemies = Math.round(6 * (1 + 0.3 * (round - 1)));

    let enemiesForThisWave;
    if (wave === 1) {
        enemiesForThisWave = wave1Enemies;
    } else if (wave >= 2 && wave <= 3) {
        // Subsequent waves increment by +2 from wave 1
        enemiesForThisWave = wave1Enemies + 2 * (wave - 1);
    } else {
        enemiesForThisWave = wave1Enemies + 4; // default for waves beyond 3
    }

    return enemiesForThisWave;
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

// Function to update progress bar and counters dynamically
function updateProgress() {
    roundWave.innerHTML = `Round: ${currentRound} | Wave: ${currentWave}`;

    // Progress fills proportionally (1/3 per wave)
    const progress = (currentWave / maxWavesPerRound) * 100;
    progressBar.style.width = `${progress}%`;
}

// Initialize counters and progress bar
updateProgress();

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

    updateProgress(); // dynamically update progress bar and counters
}

// Advance to the next round
function nextRound() {
    currentRound++;
    currentWave = 1;
    updateProgress();
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
    pauseGame();
    
    // Get existing overlay elements
    const overlay = document.getElementById("wave-completion-overlay");
    const confirmButton = document.getElementById("wave-confirm-btn");
    
    // Random header colors
    const headerColors = ['#5f6ee7', '#4ab9a3', '#ab58a8', '#5fa1e7', '#85daeb'];
    
    // Assign random colors to card headers
    const cardHeaders = overlay.querySelectorAll('.card-header');
    cardHeaders.forEach((header, index) => {
        const randomColor = headerColors[Math.floor(Math.random() * headerColors.length)];
        header.style.background = randomColor;
    });
    
    // Show overlay
    overlay.style.display = "flex";
    
    // Set up confirm button click handler
    confirmButton.onclick = () => {
        // Hide overlay and resume game
        overlay.style.display = "none";
        resumeGame();
        onComplete();
    };
}

// Function to show round completion overlay with 2 cards
function showRoundCompletionCards(onComplete) {
    // Pause game
    pauseGame();
    
    // Get existing overlay elements
    const overlay = document.getElementById("round-completion-overlay");
    const confirmButton = document.getElementById("round-confirm-btn");
    
    // Random header colors
    const headerColors = ['#5f6ee7', '#4ab9a3', '#ab58a8', '#5fa1e7', '#85daeb'];
    
    // Assign random colors to card headers
    const cardHeaders = overlay.querySelectorAll('.card-header');
    cardHeaders.forEach((header, index) => {
        const randomColor = headerColors[Math.floor(Math.random() * headerColors.length)];
        header.style.background = randomColor;
    });
    
    // Show overlay
    overlay.style.display = "flex";
    
    // Set up confirm button click handler
    confirmButton.onclick = () => {
        // Hide overlay and resume game
        overlay.style.display = "none";
        resumeGame();
        onComplete();
    };
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
                    
                    // Handle matched enemies
                    matchedEnemies.forEach(matched => {
                        // Regular enemy - remove immediately
                        matched.enemyElement.remove();
                        
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
let isPaused = false;
let gameLoops = [];
let enemyMovements = [];

function togglePause() {
    isPaused = !isPaused;
    isGamePaused = isPaused; // Sync with existing pause variable
    const pauseOverlay = document.getElementById('pause-overlay');
    
    if (isPaused) {
        // Show pause overlay
        pauseOverlay.style.display = 'flex';
        
        // Pause background music
        if (currentBackgroundMusic) {
            currentBackgroundMusic.pause();
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
        
        // Resume background music
        if (currentBackgroundMusic) {
            currentBackgroundMusic.play().catch(error => {
                console.log("Background music resume failed:", error);
            });
        }
        
        // Resume game loops and animations
        resumeGameLoops();
        resumeEnemyMovements();
    }
}

function resumeGameLoops() {
    // Restart any game loops that were running
    // This would need to be implemented based on your specific game loops
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
    
    // Continue button event listener
    const continueBtn = document.getElementById('continue-btn');
    if (continueBtn) {
        continueBtn.addEventListener('click', togglePause);
    }
    
    // Card Archive button (placeholder functionality)
    const cardArchiveBtn = document.getElementById('card-archive-btn');
    if (cardArchiveBtn) {
        cardArchiveBtn.addEventListener('click', function() {
            console.log('Card Archive clicked - functionality to be implemented');
            // Could show card archive overlay here
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
            if (currentBackgroundMusic) {
                currentBackgroundMusic.volume = value / 100;
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
        
        // Update game controls
        updateGameControls();
        
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

function updateGameControls() {
    // This function will be called to update the game's control mappings
    // The actual game logic will need to reference customKeybinds instead of hardcoded keys
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
