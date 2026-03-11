// Final Boss 5 - Round 5
// Multi-attack boss with projectile mechanics

class FinalBoss5 {
    constructor(enemyElement, combo) {
        this.enemyElement = enemyElement;
        this.combo = combo;
        this.health = 3; // Fixed health for all bosses
        this.currentPhase = 1;
        this.projectileCooldown = 0;
        this.multiAttackMode = false;
        this.specialAbilityCooldown = 0;
        this.projectiles = [];
    }

    movementPattern() {
        const speed = this.multiAttackMode ? 0.25 : 0.35;
        
        const playerRect = player.getBoundingClientRect();
        const enemyRect = this.enemyElement.getBoundingClientRect();
        
        let dx = playerRect.left - enemyRect.left;
        let dy = playerRect.top - enemyRect.top;
        
        // Multi-attack mode: strategic positioning
        if (this.multiAttackMode) {
            // Keep medium distance for better projectile coverage
            const idealDistance = 200;
            const currentDistance = Math.sqrt(dx * dx + dy * dy);
            
            if (currentDistance < idealDistance) {
                dx *= -1;
                dy *= -1;
            }
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
                this.fireProjectiles();
            } else if (this.currentPhase === 2) {
                this.activateMultiAttackMode();
            }
            this.specialAbilityCooldown = 240;
        }
        this.specialAbilityCooldown--;
    }

    fireProjectiles() {
        if (this.projectileCooldown <= 0) {
            // Create visual projectile effect
            const projectile = document.createElement("div");
            projectile.style.position = "absolute";
            projectile.style.width = "10px";
            projectile.style.height = "10px";
            projectile.style.backgroundColor = "#ff6600";
            projectile.style.borderRadius = "50%";
            projectile.style.boxShadow = "0 0 10px #ff6600";
            projectile.style.left = this.enemyElement.offsetLeft + "px";
            projectile.style.top = this.enemyElement.offsetTop + "px";
            projectile.style.zIndex = "1000";
            
            document.body.appendChild(projectile);
            this.projectiles.push(projectile);
            
            // Animate projectile toward player
            const playerRect = player.getBoundingClientRect();
            const targetX = playerRect.left + playerRect.width / 2;
            const targetY = playerRect.top + playerRect.height / 2;
            
            const animateProjectile = () => {
                const currentX = parseFloat(projectile.style.left);
                const currentY = parseFloat(projectile.style.top);
                
                const dx = targetX - currentX;
                const dy = targetY - currentY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance > 5) {
                    projectile.style.left = (currentX + dx * 0.1) + "px";
                    projectile.style.top = (currentY + dy * 0.1) + "px";
                    requestAnimationFrame(animateProjectile);
                } else {
                    projectile.remove();
                    const index = this.projectiles.indexOf(projectile);
                    if (index > -1) {
                        this.projectiles.splice(index, 1);
                    }
                }
            };
            
            requestAnimationFrame(animateProjectile);
            this.projectileCooldown = 60; // 1 second cooldown
        }
        this.projectileCooldown--;
    }

    activateMultiAttackMode() {
        this.multiAttackMode = true;
        this.enemyElement.style.filter = "hue-rotate(90deg) saturate(1.3)";
        this.enemyElement.style.boxShadow = "0 0 20px rgba(0, 255, 0, 0.8)";
        
        // Fire multiple projectiles in sequence
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                this.fireProjectiles();
            }, i * 200);
        }
        
        setTimeout(() => {
            this.multiAttackMode = false;
            this.enemyElement.style.filter = "";
            this.enemyElement.style.boxShadow = "";
        }, 4000);
    }

    onComboHit() {
        this.health--;
        
        if (this.health <= 0) {
            // Clean up projectiles
            this.projectiles.forEach(p => p.remove());
            this.projectiles = [];
            return true; // Boss defeated
        } else {
            if (this.health === 2 && this.currentPhase === 1) {
                this.currentPhase = 2;
                this.activateMultiAttackMode(); // Enter phase 2 with multi-attack
            }
            
            // Hit feedback
            this.enemyElement.style.filter = "sepia(1) brightness(2)";
            setTimeout(() => {
                this.enemyElement.style.filter = "";
            }, 300);
            
            return false;
        }
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = FinalBoss5;
}
