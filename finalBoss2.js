// Final Boss 2 - Round 2
// Single boss with unique mechanics

class FinalBoss2 {
    constructor(enemyElement, combo) {
        this.enemyElement = enemyElement;
        this.combo = combo;
        this.health = 3; // Fixed health for all bosses
        this.currentPhase = 1;
        this.attackTimer = null;
        this.specialAbilityCooldown = 0;
        this.cloneCount = 0;
        this.maxClones = 2;
    }

    // Boss-specific movement pattern
    movementPattern() {
        const speed = 0.4;
        
        // Teleportation movement for phase 2
        if (this.currentPhase === 2 && this.specialAbilityCooldown <= 0) {
            this.teleport();
            this.specialAbilityCooldown = 180; // 3 second cooldown
        }
        
        const playerRect = player.getBoundingClientRect();
        const enemyRect = this.enemyElement.getBoundingClientRect();
        
        let dx = playerRect.left - enemyRect.left;
        let dy = playerRect.top - enemyRect.top;
        
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance > 0) {
            dx /= distance;
            dy /= distance;
        }
        
        this.enemyElement.style.left = (this.enemyElement.offsetLeft + dx * speed) + "px";
        this.enemyElement.style.top = (this.enemyElement.offsetTop + dy * speed) + "px";
    }

    teleport() {
        // Random teleport within game bounds
        const gameBounds = document.body.getBoundingClientRect();
        const newX = Math.random() * (gameBounds.width - 100);
        const newY = Math.random() * (gameBounds.height - 100);
        
        this.enemyElement.style.left = newX + "px";
        this.enemyElement.style.top = newY + "px";
        
        // Visual teleport effect
        this.enemyElement.style.opacity = "0.3";
        setTimeout(() => {
            this.enemyElement.style.opacity = "1";
        }, 500);
    }

    specialAbility() {
        if (this.specialAbilityCooldown <= 0) {
            if (this.currentPhase === 1) {
                this.createClones();
            } else if (this.currentPhase === 2) {
                this.teleport();
            }
            this.specialAbilityCooldown = 240;
        }
        this.specialAbilityCooldown--;
    }

    createClones() {
        if (this.cloneCount < this.maxClones) {
            // Create visual clone effect
            this.enemyElement.style.boxShadow = "0 0 15px rgba(255, 0, 255, 0.6)";
            setTimeout(() => {
                this.enemyElement.style.boxShadow = "";
            }, 2000);
            this.cloneCount++;
        }
    }

    onComboHit() {
        this.health--;
        
        if (this.health <= 0) {
            return true; // Boss defeated
        } else {
            if (this.health === 2 && this.currentPhase === 1) {
                this.currentPhase = 2;
                this.teleport(); // Enter phase 2 with teleport
            }
            
            // Hit feedback
            this.enemyElement.style.transform = "scale(1.2)";
            setTimeout(() => {
                this.enemyElement.style.transform = "";
            }, 200);
            
            return false;
        }
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = FinalBoss2;
}
