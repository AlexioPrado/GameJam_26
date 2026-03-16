// Leaderboard management
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

function displayLeaderboard() {
    const leaderboard = getLeaderboard();
    const leaderboardList = document.getElementById('leaderboard-list');
    
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
        
        entryElement.innerHTML = `
            <div class="rank">#${index + 1}</div>
            <div class="player-name">${entry.name}</div>
            <div class="player-score">${entry.score.toLocaleString()}</div>
            <div class="player-combo">${entry.combo}x</div>
        `;
        leaderboardList.appendChild(entryElement);
    });
}

function startGame() {
    const nameInput = document.getElementById('player-name');
    const playerName = nameInput.value.trim();
    
    // Validate name input
    if (!playerName) {
        alert('Please enter your name to start the game!');
        nameInput.focus();
        return;
    }
    
    if (playerName.length < 2) {
        alert('Name must be at least 2 characters long!');
        nameInput.focus();
        return;
    }
    
    if (playerName.length > 10) {
        alert('Name must be 10 characters or less!');
        nameInput.focus();
        return;
    }
    
    if (playerName.includes(' ')) {
        alert('Name cannot contain spaces!');
        nameInput.focus();
        return;
    }
    
    // Save player name to localStorage for game page
    localStorage.setItem('currentPlayerName', playerName);
    
    // Navigate to game page
    window.location.href = "gamePage.html";
}

// Initialize leaderboard on page load
document.addEventListener('DOMContentLoaded', function() {
    displayLeaderboard();
    
    // Add enter key support and space prevention for name input
    const nameInput = document.getElementById('player-name');
    if (nameInput) {
        nameInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                startGame();
            }
        });
        
        // Prevent spaces from being typed
        nameInput.addEventListener('keydown', function(event) {
            if (event.key === ' ') {
                event.preventDefault();
            }
        });
        
        // Prevent spaces from being pasted
        nameInput.addEventListener('input', function(event) {
            const value = event.target.value;
            if (value.includes(' ')) {
                event.target.value = value.replace(/\s/g, '');
            }
        });
        
        // Focus on name input for better UX
        nameInput.focus();
    }
});