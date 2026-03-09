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

// player body
const playerBody = document.createElement("img");
playerBody.src = "playerAssets/player.png";
playerBody.classList.add("player-body");

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

// pick random face
const randomFace = faces[Math.floor(Math.random() * faces.length)];

const face = document.createElement("img");
face.src = randomFace;
face.classList.add("player-face");

// assemble player
player.appendChild(playerBody);
player.appendChild(face);

document.body.appendChild(player);