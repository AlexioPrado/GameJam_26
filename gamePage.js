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
    // vertical movement
    if (keysPressed["w"]) playerY -= speed;
    if (keysPressed["s"]) playerY += speed;

    // horizontal movement
    if (keysPressed["a"]) playerX -= speed;
    if (keysPressed["d"]) playerX += speed;

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
const maxWavesPerRound = 4; // 3 normal waves + 1 final wave

// Function to update progress and counters
function updateProgressBar(round, wave) {
    // Display "Final Battle" if wave 4
    if (wave === maxWavesPerRound) {
        roundWave.innerHTML = `Round: ${round} | Final Battle`;
        
        // Show boss name below for final battle
        const bossName = getBossName(round);
        if (document.getElementById("boss-name")) {
            document.getElementById("boss-name").innerHTML = `Boss: ${bossName}`;
        } else {
            const bossNameElement = document.createElement("div");
            bossNameElement.id = "boss-name";
            bossNameElement.innerHTML = `Boss: ${bossName}`;
            bossNameElement.style.fontSize = "18px";
            bossNameElement.style.marginTop = "5px";
            roundWave.parentNode.appendChild(bossNameElement);
        }
    } else {
        roundWave.innerHTML = `Round: ${round} | Wave: ${wave}`;
        
        // Hide boss name for regular waves
        const bossNameElement = document.getElementById("boss-name");
        if (bossNameElement) {
            bossNameElement.remove();
        }
    }

    // Progress fills proportionally (1/4 per wave)
    const progress = (wave / maxWavesPerRound) * 100;
    progressBar.style.width = `${progress}%`;
}

// Get boss name based on round
function getBossName(round) {
    switch(round) {
        case 1: return "Chiikawa, Hachiware, Usagi";
        case 2: return "Humbah";
        case 3: return "Zumbah";
        case 4: return "Jumbah";
        case 5: return "Jingbah";
        case 6: return "Zing Zing Zingbah";
        case 7: return "Phil Collins";
        default: return "Unknown Boss";
    }
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
        enemiesForThisWave = 5; // default for wave 4 or others
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
        const enemiesThisBatch = Math.min(2, enemiesToSpawn - spawnedCount);
        
        for (let i = 0; i < enemiesThisBatch; i++) {
            // Check if this is wave 4 (final battle) - spawn final bosses
            if (wave === maxWavesPerRound) {
                spawnFinalBoss(round, enemies);
            } else {
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
                const maxComboLength = 5 + (currentRound - 1);
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
        }

        spawnedCount += enemiesThisBatch;
        if (spawnedCount >= enemiesToSpawn) clearInterval(spawnInterval);
    }, spawnIntervalTime);

    return enemies;
}

// Spawn final boss for wave 4
function spawnFinalBoss(round, enemies) {
    const boss = document.createElement("div");
    boss.classList.add("enemy", "final-boss");
    
    // Larger size for final boss
    const size = 100;
    boss.style.width = size + "px";
    boss.style.height = size + "px";
    boss.style.position = "absolute";
    
    // Center spawn for dramatic entrance
    const gameBounds = document.body.getBoundingClientRect();
    boss.style.left = (gameBounds.width / 2 - size / 2) + "px";
    boss.style.top = "-150px";
    
    // Get boss image based on round
    const bossImg = document.createElement("img");
    bossImg.src = `enemyAssets/finalBoss/R${round}/Chiikawa.png`; // Default to Chiikawa, could randomize
    bossImg.style.width = "100%";
    bossImg.style.height = "100%";
    bossImg.style.objectFit = "contain";
    
    // Arrow combo container (longer combos for bosses)
    const arrowContainer = document.createElement("div");
    arrowContainer.classList.add("arrow-container");
    
    // Boss combos are longer and more complex
    const comboLength = 8; // Fixed combo length for all bosses
    const enemyComboDirections = [];
    
    const arrowFiles = ["arrowUp.png","arrowDown.png","arrowLeft.png","arrowRight.png"];
    for (let j = 0; j < comboLength; j++) {
        const randomArrow = arrowFiles[Math.floor(Math.random() * arrowFiles.length)];
        
        let direction;
        if (randomArrow.includes("Up")) direction = "Up";
        else if (randomArrow.includes("Down")) direction = "Down";
        else if (randomArrow.includes("Left")) direction = "Left";
        else if (randomArrow.includes("Right")) direction = "Right";
        
        enemyComboDirections.push(direction);
        
        const arrow = document.createElement("img");
        arrow.src = `arrowAssets/${randomArrow}`;
        arrow.classList.add("enemy-arrow");
        
        if (direction === "Up") arrow.classList.add("arrow-up");
        else if (direction === "Down") arrow.classList.add("arrow-down");
        else if (direction === "Left") arrow.classList.add("arrow-left");
        else if (direction === "Right") arrow.classList.add("arrow-right");
        
        arrowContainer.appendChild(arrow);
    }
    
    // Save boss combo to global array
    enemyCombos.push({
        enemyElement: boss,
        combo: enemyComboDirections,
        isBoss: true,
        bossClass: `FinalBoss${round}`
    });
    
    // Position arrow container
    arrowContainer.style.position = "absolute";
    arrowContainer.style.bottom = "calc(100% + 15px)";
    arrowContainer.style.left = "50%";
    arrowContainer.style.transform = "translateX(-50%)";
    arrowContainer.style.display = "flex";
    arrowContainer.style.gap = "3px";
    
    // Assemble boss
    boss.appendChild(bossImg);
    boss.appendChild(arrowContainer);
    
    document.body.appendChild(boss);
    enemies.push(boss);
    
    // Create boss instance with special abilities
    const BossClass = getBossClass(round);
    if (BossClass) {
        const bossInstance = new BossClass(boss, enemyComboDirections);
        boss.bossInstance = bossInstance;
        
        // Start boss behavior loop
        startBossBehavior(bossInstance);
    }
    
    // Dramatic entrance animation
    setTimeout(() => {
        boss.style.transition = "top 1s ease-out";
        boss.style.top = "100px";
    }, 100);
}

// Get boss class based on round
function getBossClass(round) {
    switch(round) {
        case 1: return FinalBoss1;
        case 2: return FinalBoss2;
        case 3: return FinalBoss3;
        case 4: return FinalBoss4;
        case 5: return FinalBoss5;
        case 6: return FinalBoss6;
        case 7: return FinalBoss7;
        default: return FinalBoss1;
    }
}

// Start boss behavior loop
function startBossBehavior(bossInstance) {
    function bossLoop() {
        if (bossInstance.enemyElement.parentNode) {
            bossInstance.movementPattern();
            bossInstance.specialAbility();
            requestAnimationFrame(bossLoop);
        }
    }
    bossLoop();
}

// Example usage
spawnEnemiesForWave(currentRound, currentWave);

// Movement speed of enemies (pixels per frame)
const enemySpeed = 0.7;

function moveEnemiesTowardPlayer() {
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
    // Display "Final Battle" if wave 4
    if (currentWave === maxWavesPerRound) {
        roundWave.innerHTML = `Round: ${currentRound} | Final Battle`;
    } else {
        roundWave.innerHTML = `Round: ${currentRound} | Wave: ${currentWave}`;
    }

    // Progress fills proportionally
    const progress = (currentWave / maxWavesPerRound) * 100;
    progressBar.style.width = `${progress}%`;
}

// Initialize counters and progress bar
updateProgress(currentRound, currentWave);

// ------------------------
// ROUND AND WAVE MANAGEMENT FUNCTIONS (do not increment yet)
// ------------------------

// Advance to the next wave
function nextWave() {
    if (currentWave < maxWavesPerRound) {
        currentWave++;
    } else {
        // If wave 4 reached, next wave would reset and round could increment
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

// Function to check collision between two DOM elements
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
        // Advance to next wave
        nextWave();
        
        // Spawn enemies for the new wave
        spawnEnemiesForWave(currentRound, currentWave);
    }
    // If no enemies left and we're in final battle (wave 4)
    else if (enemies.length === 0 && currentWave === maxWavesPerRound) {
        // Advance to next round
        nextRound();
        
        // Spawn enemies for the new round's first wave
        spawnEnemiesForWave(currentRound, 1); // Change currentWave to 1
    }
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

    // Only act if key wasn't already pressed
    if (!keysPressedArrow[key]) {
        keysPressedArrow[key] = true;

        // Handle arrow key input
        if (arrowKeyMap[key]) {
            const arrowImg = document.createElement("img");
            arrowImg.src = arrowKeyMap[key];
            arrowImg.classList.add("player-arrow");

            // Add class for colored background and add to combo list
            if (key === "arrowup") {
                arrowImg.classList.add("arrow-up");
                playerComboDirections.push("Up");
            } else if (key === "arrowdown") {
                arrowImg.classList.add("arrow-down");
                playerComboDirections.push("Down");
            } else if (key === "arrowleft") {
                arrowImg.classList.add("arrow-left");
                playerComboDirections.push("Left");
            } else if (key === "arrowright") {
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

        // Enter → compare player combo with enemy combos, then clear
        else if (key === "enter") {
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
                
                // Handle matched enemies
                if (matchedEnemies.length > 0) {
                    matchedEnemies.forEach(matched => {
                        // Check if this is a boss
                        const enemyCombo = enemyCombos.find(ec => ec.enemyElement === matched.enemyElement);
                        
                        if (enemyCombo && enemyCombo.isBoss && matched.enemyElement.bossInstance) {
                            // Handle boss hit
                            const bossDefeated = matched.enemyElement.bossInstance.onComboHit();
                            
                            if (bossDefeated) {
                                // Boss defeated - remove from game
                                matched.enemyElement.remove();
                                
                                // Remove from enemyCombos array
                                const index = enemyCombos.findIndex(ec => ec.enemyElement === matched.enemyElement);
                                if (index > -1) {
                                    enemyCombos.splice(index, 1);
                                }
                            }
                            // If boss not defeated, don't remove - it survives with reduced health
                        } else {
                            // Regular enemy - remove immediately
                            matched.enemyElement.remove();
                            
                            // Remove from enemyCombos array
                            const index = enemyCombos.findIndex(ec => ec.enemyElement === matched.enemyElement);
                            if (index > -1) {
                                enemyCombos.splice(index, 1);
                            }
                        }
                    });
                    
                    // Check if wave is complete after defeating enemies
                    checkWaveCompletion();
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

// Keyup resets
document.addEventListener("keyup", (e) => {
    const key = e.key.toLowerCase();
    keysPressedArrow[key] = false;
});