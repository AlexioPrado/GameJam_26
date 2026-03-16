// Game Over Screen JavaScript

// Get game data from localStorage or URL parameters
function getGameData() {
    // First try to get from localStorage
    const storedScore = localStorage.getItem('finalScore');
    const storedCombo = localStorage.getItem('highestCombo');
    
    let finalScore = 0;
    let highestCombo = 0;
    
    // If localStorage has data, use it
    if (storedScore !== null) {
        finalScore = parseInt(storedScore);
    }
    
    if (storedCombo !== null) {
        highestCombo = parseInt(storedCombo);
    }
    
    // Also check URL parameters for new data
    const params = new URLSearchParams(window.location.search);
    const urlScore = parseInt(params.get('score')) || 0;
    const urlCombo = parseInt(params.get('combo')) || 0;
    
    // Use URL parameters if they're newer/higher
    if (urlScore > 0) {
        finalScore = urlScore;
        localStorage.setItem('finalScore', finalScore);
    }
    
    if (urlCombo > 0) {
        highestCombo = urlCombo;
        localStorage.setItem('highestCombo', highestCombo);
    }
    
    return { finalScore, highestCombo };
}

// Update highest combo if current combo is higher
function updateHighScore(currentScore, currentCombo) {
    const storedHighScore = parseInt(localStorage.getItem('finalScore')) || 0;
    const storedHighCombo = parseInt(localStorage.getItem('highestCombo')) || 0;
    
    // Update if current score is higher
    if (currentScore > storedHighScore) {
        localStorage.setItem('finalScore', currentScore);
    }
    
    // Update if current combo is higher
    if (currentCombo > storedHighCombo) {
        localStorage.setItem('highestCombo', currentCombo);
    }
}

// Leaderboard management (shared with startMenu.js)
function getLeaderboard() {
    const leaderboard = localStorage.getItem('leaderboard');
    return leaderboard ? JSON.parse(leaderboard) : [];
}

function saveLeaderboard(leaderboard) {
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
}

function addToLeaderboard(name, score, combo) {
    const leaderboard = getLeaderboard();
    
    // Check if player already exists
    const existingPlayerIndex = leaderboard.findIndex(entry => entry.name === name);
    
    if (existingPlayerIndex !== -1) {
        // Player exists, check if new score is higher
        const existingEntry = leaderboard[existingPlayerIndex];
        
        if (score > existingEntry.score || (score === existingEntry.score && combo > existingEntry.combo)) {
            // Replace with better score
            leaderboard[existingPlayerIndex] = {
                name: name,
                score: score,
                combo: combo,
                date: new Date().toISOString()
            };
        } else {
            // New score is not better, don't update
            return leaderboard;
        }
    } else {
        // New player, add to leaderboard
        leaderboard.push({
            name: name,
            score: score,
            combo: combo,
            date: new Date().toISOString()
        });
    }
    
    // Sort by score (descending), then by combo (descending)
    leaderboard.sort((a, b) => {
        if (b.score !== a.score) {
            return b.score - a.score;
        }
        return b.combo - a.combo;
    });
    
    // Keep only top 10 players
    const top10 = leaderboard.slice(0, 10);
    saveLeaderboard(top10);
    
    return top10;
}

function displayLeaderboard(containerId, highlightName = null) {
    const leaderboard = getLeaderboard();
    const leaderboardList = document.getElementById(containerId);
    
    if (!leaderboardList) return;
    
    leaderboardList.innerHTML = '';
    
    if (leaderboard.length === 0) {
        leaderboardList.innerHTML = `
            <div class="leaderboard-header">
                <div class="rank">#</div>
                <div class="player-name">NAME</div>
                <div class="player-score">SCORE</div>
                <div class="player-combo">COMBO</div>
            </div>
            <div class="no-entries">No high scores yet!</div>
        `;
        return;
    }
    
    // Add header row
    const headerElement = document.createElement('div');
    headerElement.className = 'leaderboard-header';
    headerElement.innerHTML = `
        <div class="rank">#</div>
        <div class="player-name">NAME</div>
        <div class="player-score">SCORE</div>
        <div class="player-combo">COMBO</div>
    `;
    leaderboardList.appendChild(headerElement);
    
    leaderboard.forEach((entry, index) => {
        const entryElement = document.createElement('div');
        entryElement.className = 'leaderboard-entry';
        
        // Highlight current player's entry
        if (highlightName && entry.name === highlightName) {
            entryElement.classList.add('current-player');
        }
        
        entryElement.innerHTML = `
            <div class="rank">#${index + 1}</div>
            <div class="player-name">${entry.name}</div>
            <div class="player-score">${entry.score.toLocaleString()}</div>
            <div class="player-combo">${entry.combo}x</div>
        `;
        leaderboardList.appendChild(entryElement);
    });
}

// Initialize game over screen
document.addEventListener('DOMContentLoaded', function() {
    const gameData = getGameData();
    const currentPlayerName = localStorage.getItem('currentPlayerName') || 'Anonymous';
    
    // Add current player to leaderboard if they have a score
    if (gameData.finalScore > 0) {
        addToLeaderboard(currentPlayerName, gameData.finalScore, gameData.highestCombo);
    }
    
    // Update score displays
    const finalScoreElement = document.getElementById('final-score');
    const highestComboElement = document.getElementById('highest-combo');
    
    if (finalScoreElement) {
        finalScoreElement.textContent = gameData.finalScore.toLocaleString();
        // Animate the score counting up
        animateScore(finalScoreElement, gameData.finalScore);
        
        // Reset final score to 0 after displaying
        setTimeout(() => {
            localStorage.setItem('finalScore', '0');
        }, 2500); // Reset after animation completes
    }
    
    if (highestComboElement) {
        highestComboElement.textContent = gameData.highestCombo;
        // Animate the combo display
        animateCombo(highestComboElement, gameData.highestCombo);
        
        // Reset highest combo to 0 after displaying
        setTimeout(() => {
            localStorage.setItem('highestCombo', '0');
        }, 2000); // Reset after animation completes
    }
    
    // Display leaderboard with current player highlighted
    displayLeaderboard('end-leaderboard-list', currentPlayerName);
    
    // Add event listeners to buttons
    const playAgainBtn = document.getElementById('play-again-btn');
    const mainMenuBtn = document.getElementById('main-menu-btn');
    
    if (playAgainBtn) {
        playAgainBtn.addEventListener('click', function() {
            // Navigate back to the game page to restart
            window.location.href = 'gamePage.html';
        });
    }
    
    if (mainMenuBtn) {
        mainMenuBtn.addEventListener('click', function() {
            // Navigate back to the main menu
            window.location.href = 'index.html';
        });
    }
    
    // Add keyboard controls
    document.addEventListener('keydown', function(event) {
        switch(event.key.toLowerCase()) {
            case 'enter':
            case ' ':
                // Press Enter/Space to play again
                window.location.href = 'gamePage.html';
                break;
            case 'escape':
                // Press Escape to go to main menu
                window.location.href = 'index.html';
                break;
        }
    });
    
    // Add hover sound effects (if audio is available)
    addHoverEffects();
});

// Animate score counting up
function animateScore(element, targetScore) {
    let currentScore = 0;
    const increment = Math.ceil(targetScore / 50); // Animate over 50 steps
    const duration = 2000; // 2 seconds
    const stepTime = duration / 50;
    
    const timer = setInterval(() => {
        currentScore += increment;
        if (currentScore >= targetScore) {
            currentScore = targetScore;
            clearInterval(timer);
        }
        element.textContent = currentScore.toLocaleString();
        
        // Add a little bounce effect when complete
        if (currentScore === targetScore) {
            element.style.transform = 'scale(1.2)';
            setTimeout(() => {
                element.style.transform = 'scale(1)';
            }, 200);
        }
    }, stepTime);
}

// Animate combo display
function animateCombo(element, targetCombo) {
    let currentCombo = 0;
    const increment = Math.ceil(targetCombo / 30); // Animate over 30 steps
    const duration = 1500; // 1.5 seconds
    const stepTime = duration / 30;
    
    // Start animation after a short delay
    setTimeout(() => {
        const timer = setInterval(() => {
            currentCombo += increment;
            if (currentCombo >= targetCombo) {
                currentCombo = targetCombo;
                clearInterval(timer);
            }
            element.textContent = currentCombo + 'x';
            
            // Add glow effect when complete
            if (currentCombo === targetCombo) {
                element.style.textShadow = '0 0 30px rgba(255, 215, 0, 0.8)';
                setTimeout(() => {
                    element.style.textShadow = '0 0 15px rgba(255, 255, 255, 0.3)';
                }, 500);
            }
        }, stepTime);
    }, 500);
}

// Add hover effects to buttons
function addHoverEffects() {
    const buttons = document.querySelectorAll('.play-again-btn, .main-menu-btn');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            // Add a subtle scale effect
            this.style.transform = 'translateY(-3px) scale(1.05)';
        });
        
        button.addEventListener('mouseleave', function() {
            // Reset transform
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Function to show game over screen (to be called from gamePage.js)
function showGameOver(finalScore, highestCombo) {
    // Update high scores in localStorage
    updateHighScore(finalScore, highestCombo);
    
    // Navigate to game over screen
    window.location.href = `endMenu.html?score=${finalScore}&combo=${highestCombo}`;
}

// Export function for use in gamePage.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { showGameOver };
}