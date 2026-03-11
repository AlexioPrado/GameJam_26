// Final Boss 3 - Round 3
// Shield-based boss with defensive mechanics

class FinalBoss3 {
    constructor(enemyElement, combo) {
        this.enemyElement = enemyElement;
        this.combo = combo;
        this.health = 3; // Fixed health for all bosses
        this.currentPhase = 1;
        this.shieldActive = false;
        this.shieldHealth = 2;
        this.specialAbilityCooldown = 0;
        this.defensiveMode = false;
    }

    movementPattern() {
        const speed = this.defensiveMode ? 0.2 : 0.35;
        
        const playerRect = player.getBoundingClientRect();
        const enemyRect = this.enemyElement.getBoundingClientRect();
        
        let dx = playerRect.left - enemyRect.left;
        let dy = playerRect.top - enemyRect.top;
        
        // Defensive mode: keep distance from player
        if (this.defensiveMode) {
            dx *= -1;
            dy *= -1;
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
                this.activateShield();
            } else if (this.currentPhase === 2) {
                this.enterDefensiveMode();
            }
            this.specialAbilityCooldown = 300;
        }
        this.specialAbilityCooldown--;
    }

    activateShield() {
        if (!this.shieldActive) {
            this.shieldActive = true;
            this.shieldHealth = 2;
            this.enemyElement.style.boxShadow = "0 0 25px rgba(0, 100, 255, 0.8)";
            this.enemyElement.style.border = "3px solid #0066ff";
        }
    }

    enterDefensiveMode() {
        this.defensiveMode = true;
        this.enemyElement.style.filter = "hue-rotate(180deg) brightness(1.2)";
        setTimeout(() => {
            this.defensiveMode = false;
            this.enemyElement.style.filter = "";
        }, 4000);
    }

    onComboHit() {
        // Check shield first
        if (this.shieldActive) {
            this.shieldHealth--;
            if (this.shieldHealth <= 0) {
                this.shieldActive = false;
                this.enemyElement.style.boxShadow = "";
                this.enemyElement.style.border = "";
            }
            
            // Shield hit feedback
            this.enemyElement.style.filter = "brightness(3) hue-rotate(180deg)";
            setTimeout(() => {
                this.enemyElement.style.filter = "";
            }, 200);
            
            return false; // Shield absorbed the hit
        }
        
        this.health--;
        
        if (this.health <= 0) {
            return true; // Boss defeated
        } else {
            if (this.health === 3 && this.currentPhase === 1) {
                this.currentPhase = 2;
                this.activateShield(); // Re-enter with shield
            }
            
            // Hit feedback
            this.enemyElement.style.transform = "scale(0.8)";
            setTimeout(() => {
                this.enemyElement.style.transform = "";
            }, 300);
            
            return false;
        }
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = FinalBoss3;
}
