// Final Boss 1 - Round 1
// Chiikawa, Hachiware, Usagi

// Boss-specific attack patterns and behaviors
class FinalBoss1 {
    constructor(enemyElement, combo) {
        this.enemyElement = enemyElement;
        this.combo = combo;
        this.health = 3; // Fixed health for all bosses
        this.currentPhase = 1;
        this.attackTimer = null;
        this.specialAbilityCooldown = 0;
    }

    // Boss-specific movement pattern
    movementPattern() {
        // Slower but more deliberate movement than regular enemies
        const speed = 0.3; // Half the speed of regular enemies
        
        // Move toward player but with some evasion
        const playerRect = player.getBoundingClientRect();
        const enemyRect = this.enemyElement.getBoundingClientRect();
        
        let dx = playerRect.left - enemyRect.left;
        let dy = playerRect.top - enemyRect.top;
        
        // Add some evasion based on current phase
        if (this.currentPhase === 2) {
            // Phase 2: More erratic movement
            dx += Math.sin(Date.now() * 0.002) * 100;
            dy += Math.cos(Date.now() * 0.002) * 100;
        }
        
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance > 0) {
            dx /= distance;
            dy /= distance;
        }
        
        this.enemyElement.style.left = (this.enemyElement.offsetLeft + dx * speed) + "px";
        this.enemyElement.style.top = (this.enemyElement.offsetTop + dy * speed) + "px";
    }

    // Boss-specific special ability
    specialAbility() {
        if (this.specialAbilityCooldown <= 0) {
            // Phase 1: Speed boost
            if (this.currentPhase === 1) {
                this.speedBoost();
            }
            // Phase 2: Shield activation
            else if (this.currentPhase === 2) {
                this.activateShield();
            }
            this.specialAbilityCooldown = 300; // 5 second cooldown at 60fps
        }
        this.specialAbilityCooldown--;
    }

    speedBoost() {
        // Temporary speed increase
        this.enemyElement.style.filter = "hue-rotate(120deg)";
        setTimeout(() => {
            this.enemyElement.style.filter = "";
        }, 2000);
    }

    activateShield() {
        // Visual shield effect
        this.enemyElement.style.boxShadow = "0 0 20px rgba(0, 255, 255, 0.8)";
        setTimeout(() => {
            this.enemyElement.style.boxShadow = "";
        }, 3000);
    }

    // Handle successful combo hit
    onComboHit() {
        this.health--;
        
        if (this.health <= 0) {
            return true; // Boss defeated
        } else {
            // Phase transition at half health
            if (this.health === 1 && this.currentPhase === 1) {
                this.currentPhase = 2;
                this.activateShield(); // Enter phase 2 with shield
            }
            
            // Visual feedback for hit
            this.enemyElement.style.filter = "brightness(2) saturate(0)";
            setTimeout(() => {
                this.enemyElement.style.filter = "";
            }, 300);
            
            return false; // Boss still alive
        }
    }
}

// Export for use in main game
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FinalBoss1;
}
