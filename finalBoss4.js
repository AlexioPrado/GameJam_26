// Final Boss 4 - Round 4
// Time-based boss with countdown mechanics

class FinalBoss4 {
    constructor(enemyElement, combo) {
        this.enemyElement = enemyElement;
        this.combo = combo;
        this.health = 3; // Fixed health for all bosses
        this.currentPhase = 1;
        this.timeBombActive = false;
        this.countdownTimer = 0;
        this.specialAbilityCooldown = 0;
        this.rageMode = false;
    }

    movementPattern() {
        const speed = this.rageMode ? 0.6 : 0.3;
        
        const playerRect = player.getBoundingClientRect();
        const enemyRect = this.enemyElement.getBoundingClientRect();
        
        let dx = playerRect.left - enemyRect.left;
        let dy = playerRect.top - enemyRect.top;
        
        // Rage mode: aggressive pursuit
        if (this.rageMode) {
            dx *= 1.5;
            dy *= 1.5;
        }
        
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance > 0) {
            dx /= distance;
            dy /= distance;
        }
        
        this.enemyElement.style.left = (this.enemyElement.offsetLeft + dx * speed) + "px";
        this.enemyElement.style.top = (this.enemyElement.offsetTop + dy * speed) + "px";
    }

    specialAbility() {
        if (this.specialAbilityCooldown <= 0) {
            if (this.currentPhase === 1) {
                this.deployTimeBomb();
            } else if (this.currentPhase === 2) {
                this.activateRageMode();
            }
            this.specialAbilityCooldown = 360;
        }
        this.specialAbilityCooldown--;
    }

    deployTimeBomb() {
        this.timeBombActive = true;
        this.countdownTimer = 180; // 3 seconds at 60fps
        
        this.enemyElement.style.animation = "pulse 0.5s infinite";
        
        const bombInterval = setInterval(() => {
            this.countdownTimer--;
            
            if (this.countdownTimer <= 0) {
                clearInterval(bombInterval);
                this.explodeBomb();
            }
        }, 16); // ~60fps
    }

    explodeBomb() {
        // Visual explosion effect
        this.enemyElement.style.filter = "brightness(3) saturate(2)";
        this.enemyElement.style.transform = "scale(1.5)";
        
        setTimeout(() => {
            this.enemyElement.style.filter = "";
            this.enemyElement.style.transform = "";
            this.enemyElement.style.animation = "";
            this.timeBombActive = false;
        }, 500);
        
        // Damage area effect (would affect player if in range)
        // This is visual for now, could be expanded for actual damage
    }

    activateRageMode() {
        this.rageMode = true;
        this.enemyElement.style.filter = "hue-rotate(-60deg) saturate(1.5) brightness(1.2)";
        
        setTimeout(() => {
            this.rageMode = false;
            this.enemyElement.style.filter = "";
        }, 5000);
    }

    onComboHit() {
        this.health--;
        
        if (this.health <= 0) {
            return true; // Boss defeated
        } else {
            if (this.health === 2 && this.currentPhase === 1) {
                this.currentPhase = 2;
                this.activateRageMode(); // Enter phase 2 with rage
            }
            
            // Hit feedback
            this.enemyElement.style.filter = "invert(1) brightness(2)";
            setTimeout(() => {
                this.enemyElement.style.filter = "";
            }, 250);
            
            return false;
        }
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = FinalBoss4;
}
