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
    "enemyAssets/faces/face_j.png",
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
    } else {
        roundWave.innerHTML = `Round: ${round} | Wave: ${wave}`;
    }

    // Progress fills proportionally (1/4 per wave)
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
        enemiesForThisWave = 5; // default for wave 4 or others
    }

    return enemiesForThisWave;
}

// Function to spawn enemies gradually, each with a random face
function spawnEnemiesForWave(round, wave) {
    const enemiesToSpawn = calculateEnemies(round, wave);
    let spawnedCount = 0;

    const maxSimultaneous = 2; // max enemies spawning at once
    const spawnIntervalTime = 1000; // 1 second per batch

    const enemies = [];

    const spawnInterval = setInterval(() => {
        const enemiesThisBatch = Math.min(maxSimultaneous, enemiesToSpawn - spawnedCount);

        for (let i = 0; i < enemiesThisBatch; i++) {
            const enemy = document.createElement("div");
            enemy.classList.add("enemy");
            enemy.style.position = "absolute";

            // Enemy body image
            const randomBody = enemyBodies[Math.floor(Math.random() * enemyBodies.length)];
            const enemyImg = document.createElement("img");
            enemyImg.src = randomBody;
            enemyImg.classList.add("enemy-body");

            // Enemy face image
            const randomFace = faces[Math.floor(Math.random() * faces.length)];
            const faceImg = document.createElement("img");
            faceImg.src = randomFace;
            faceImg.classList.add("enemy-face");

            // Center face and fit within enemy container while keeping aspect ratio
            faceImg.style.position = "absolute";
            faceImg.style.top = "50%";
            faceImg.style.left = "50%";
            faceImg.style.transform = "translate(-50%, -50%)";
            faceImg.style.maxWidth = "60%";   // fit within enemy width
            faceImg.style.maxHeight = "60%";  // fit within enemy height
            faceImg.style.objectFit = "contain"; // keep original aspect ratio

            // Append images
            enemy.appendChild(enemyImg);
            enemy.appendChild(faceImg);

            // Random spawn position
            const pos = getRandomEdgePosition();
            enemy.style.left = `${pos.x}px`;
            enemy.style.top = `${pos.y}px`;

            document.body.appendChild(enemy);
            enemies.push(enemy);
        }

        spawnedCount += enemiesThisBatch;

        if (spawnedCount >= enemiesToSpawn) {
            clearInterval(spawnInterval);
        }
    }, spawnIntervalTime);

    return enemies;
}

// Example usage
spawnEnemiesForWave(currentRound, currentWave);

// Movement speed of enemies (pixels per frame)
const enemySpeed = 1;

// Function to move all enemies toward the player
function moveEnemiesTowardPlayer() {
    const enemies = document.querySelectorAll(".enemy");

    const playerRect = player.getBoundingClientRect();
    const playerX = playerRect.left + playerRect.width / 2;
    const playerY = playerRect.top + playerRect.height / 2;

    enemies.forEach(enemy => {
        const enemyRect = enemy.getBoundingClientRect();
        let enemyX = enemyRect.left + enemyRect.width / 2;
        let enemyY = enemyRect.top + enemyRect.height / 2;

        // Compute vector toward player
        let dx = playerX - enemyX;
        let dy = playerY - enemyY;

        // Normalize vector
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance > 0) { // avoid division by zero
            dx /= distance;
            dy /= distance;

            // Move enemy
            enemy.style.left = (enemy.offsetLeft + dx * enemySpeed) + "px";
            enemy.style.top = (enemy.offsetTop + dy * enemySpeed) + "px";
        }
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
updateProgress();

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
            }
            // else: player is immune, enemy remains
        }
    });

    requestAnimationFrame(checkEnemyCollisions);
}

// Start collision checking
checkEnemyCollisions();

const pauseButton = document.getElementById("pause-button");

pauseButton.addEventListener("click", () => {
    console.log("Pause button clicked!");
    // Future: toggle game pause here
});