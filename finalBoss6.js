// Final Boss 6 - Round 6
// Illusion and deception boss with clone mechanics

class FinalBoss6 {
    constructor(enemyElement, combo) {
        this.enemyElement = enemyElement;
        this.combo = combo;
        this.health = 3; // Fixed health for all bosses
        this.currentPhase = 1;
        this.illusionActive = false;
        this.cloneCount = 0;
        this.maxClones = 3;
        this.specialAbilityCooldown = 0;
        this.realBossIndex = 0;
        this.clones = [];
    }

    movementPattern() {
        const speed = this.illusionActive ? 0.5 : 0.3;
        
        const playerRect = player.getBoundingClientRect();
        const enemyRect = this.enemyElement.getBoundingClientRect();
        
        let dx = playerRect.left - enemyRect.left;
        let dy = playerRect.top - enemyRect.top;
        
        // Illusion mode: erratic movement
        if (this.illusionActive) {
            dx += Math.sin(Date.now() * 0.005) * 50;
            dy += Math.cos(Date.now() * 0.003) * 50;
        }
        
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance > 0) {
            dx /= distance;
            dy /= distance;
        }
        
        this.enemyElement.style.left = (this.enemyElement.offsetLeft + dx * speed) + "px";
        this.enemyElement.style.top = (this.enemyElement.offsetTop + dy * speed) + "px";
        
        // Move clones if they exist
        this.moveClones();
    }

    specialAbility() {
        if (this.specialAbilityCooldown <= 0) {
            if (this.currentPhase === 1) {
                this.createIllusions();
            } else if (this.currentPhase === 2) {
                this.massIllusion();
            }
            this.specialAbilityCooldown = 300;
        }
        this.specialAbilityCooldown--;
    }

    createIllusions() {
        if (this.cloneCount < this.maxClones) {
            const clone = this.enemyElement.cloneNode(true);
            clone.style.opacity = "0.6";
            clone.style.filter = "hue-rotate(180deg)";
            clone.style.zIndex = "999";
            
            // Random position near original
            const offsetX = (Math.random() - 0.5) * 100;
            const offsetY = (Math.random() - 0.5) * 100;
            clone.style.left = (this.enemyElement.offsetLeft + offsetX) + "px";
            clone.style.top = (this.enemyElement.offsetTop + offsetY) + "px";
            
            document.body.appendChild(clone);
            this.clones.push(clone);
            this.cloneCount++;
            
            // Randomly set which one is real
            this.realBossIndex = Math.floor(Math.random() * (this.clones.length + 1));
            
            this.illusionActive = true;
            
            // Remove illusion after duration
            setTimeout(() => {
                this.removeIllusions();
            }, 5000);
        }
    }

    massIllusion() {
        // Create maximum illusions
        while (this.cloneCount < this.maxClones) {
            this.createIllusions();
        }
        
        // All clones move rapidly
        this.illusionActive = true;
        this.enemyElement.style.filter = "hue-rotate(270deg) brightness(1.5)";
        
        setTimeout(() => {
            this.enemyElement.style.filter = "";
            this.removeIllusions();
        }, 3000);
    }

    moveClones() {
        this.clones.forEach((clone, index) => {
            const speed = 0.4;
            const playerRect = player.getBoundingClientRect();
            const cloneRect = clone.getBoundingClientRect();
            
            let dx = playerRect.left - cloneRect.left;
            let dy = playerRect.top - cloneRect.top;
            
            // Clones move slightly differently
            if (index !== this.realBossIndex) {
                dx += Math.sin(Date.now() * 0.002 + index) * 30;
                dy += Math.cos(Date.now() * 0.002 + index) * 30;
            }
            
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance > 0) {
                dx /= distance;
                dy /= distance;
            }
            
            clone.style.left = (parseFloat(clone.style.left) + dx * speed) + "px";
            clone.style.top = (parseFloat(clone.style.top) + dy * speed) + "px";
        });
    }

    removeIllusions() {
        this.clones.forEach(clone => clone.remove());
        this.clones = [];
        this.cloneCount = 0;
        this.illusionActive = false;
    }

    onComboHit() {
        // Check if hit the real boss during illusion
        if (this.illusionActive && Math.random() > 0.3) {
            // 70% chance to hit a clone instead
            if (this.clones.length > 0) {
                const randomClone = this.clones[Math.floor(Math.random() * this.clones.length)];
                randomClone.style.opacity = "0.2";
                setTimeout(() => {
                    randomClone.style.opacity = "0.6";
                }, 500);
                return false; // Clone took the hit
            }
        }
        
        this.health--;
        
        if (this.health <= 0) {
            this.removeIllusions();
            return true; // Boss defeated
        } else {
            if (this.health === 3 && this.currentPhase === 1) {
                this.currentPhase = 2;
                this.massIllusion(); // Enter phase 2 with mass illusion
            }
            
            // Hit feedback
            this.enemyElement.style.filter = "contrast(2) brightness(1.5)";
            setTimeout(() => {
                this.enemyElement.style.filter = "";
            }, 200);
            
            return false;
        }
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = FinalBoss6;
}
