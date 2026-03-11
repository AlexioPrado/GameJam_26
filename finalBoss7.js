// Final Boss 7 - Round 7
// Ultimate boss with combination of all previous mechanics

class FinalBoss7 {
    constructor(enemyElement, combo) {
        this.enemyElement = enemyElement;
        this.combo = combo;
        this.health = 3; // Fixed health for all bosses
        this.currentPhase = 1;
        this.abilities = {
            shield: false,
            teleport: false,
            projectiles: false,
            illusions: false,
            rage: false,
            timeBombs: false
        };
        this.specialAbilityCooldown = 0;
        this.abilityRotation = 0;
        this.clones = [];
        this.projectiles = [];
        this.shieldHealth = 0;
    }

    movementPattern() {
        let speed = 0.3;
        
        // Speed increases with rage mode
        if (this.abilities.rage) speed *= 2;
        
        // Erratic movement during illusions
        if (this.abilities.illusions) {
            speed *= 1.5;
        }
        
        const playerRect = player.getBoundingClientRect();
        const enemyRect = this.enemyElement.getBoundingClientRect();
        
        let dx = playerRect.left - enemyRect.left;
        let dy = playerRect.top - enemyRect.top;
        
        // Teleportation movement
        if (this.abilities.teleport && Math.random() < 0.02) {
            this.teleport();
        }
        
        // Strategic positioning for projectiles
        if (this.abilities.projectiles) {
            const idealDistance = 250;
            const currentDistance = Math.sqrt(dx * dx + dy * dy);
            if (currentDistance < idealDistance) {
                dx *= -1;
                dy *= -1;
            }
        }
        
        // Erratic movement
        if (this.abilities.illusions) {
            dx += Math.sin(Date.now() * 0.004) * 60;
            dy += Math.cos(Date.now() * 0.006) * 60;
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
            // Rotate through abilities based on phase
            this.executeAbility();
            this.specialAbilityCooldown = 180; // 3 second cooldown
        }
        this.specialAbilityCooldown--;
    }

    executeAbility() {
        const abilityList = this.getAvailableAbilities();
        const ability = abilityList[this.abilityRotation % abilityList.length];
        this.abilityRotation++;
        
        switch(ability) {
            case 'shield':
                this.activateShield();
                break;
            case 'teleport':
                this.teleport();
                break;
            case 'projectiles':
                this.fireProjectiles();
                break;
            case 'illusions':
                this.createIllusions();
                break;
            case 'rage':
                this.activateRage();
                break;
            case 'timeBombs':
                this.deployTimeBomb();
                break;
        }
    }

    getAvailableAbilities() {
        const abilities = [];
        
        if (this.currentPhase >= 1) abilities.push('shield', 'teleport');
        if (this.currentPhase >= 2) abilities.push('projectiles', 'illusions');
        if (this.currentPhase >= 3) abilities.push('rage', 'timeBombs');
        
        return abilities;
    }

    activateShield() {
        this.abilities.shield = true;
        this.shieldHealth = 3;
        this.enemyElement.style.boxShadow = "0 0 30px rgba(0, 150, 255, 0.9)";
        this.enemyElement.style.border = "4px solid #0096ff";
    }

    teleport() {
        const gameBounds = document.body.getBoundingClientRect();
        const newX = Math.random() * (gameBounds.width - 150);
        const newY = Math.random() * (gameBounds.height - 150);
        
        this.enemyElement.style.opacity = "0";
        setTimeout(() => {
            this.enemyElement.style.left = newX + "px";
            this.enemyElement.style.top = newY + "px";
            this.enemyElement.style.opacity = "1";
        }, 200);
        
        // Visual effect
        this.enemyElement.style.filter = "brightness(3)";
        setTimeout(() => {
            this.enemyElement.style.filter = "";
        }, 300);
    }

    fireProjectiles() {
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const projectile = document.createElement("div");
                projectile.style.position = "absolute";
                projectile.style.width = "15px";
                projectile.style.height = "15px";
                projectile.style.backgroundColor = "#ff0066";
                projectile.style.borderRadius = "50%";
                projectile.style.boxShadow = "0 0 15px #ff0066";
                projectile.style.left = this.enemyElement.offsetLeft + "px";
                projectile.style.top = this.enemyElement.offsetTop + "px";
                projectile.style.zIndex = "1000";
                
                document.body.appendChild(projectile);
                this.projectiles.push(projectile);
                
                // Animate toward player
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
                        projectile.style.left = (currentX + dx * 0.08) + "px";
                        projectile.style.top = (currentY + dy * 0.08) + "px";
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
            }, i * 100);
        }
    }

    createIllusions() {
        for (let i = 0; i < 2; i++) {
            const clone = this.enemyElement.cloneNode(true);
            clone.style.opacity = "0.5";
            clone.style.filter = "hue-rotate(120deg)";
            clone.style.zIndex = "998";
            
            const offsetX = (Math.random() - 0.5) * 150;
            const offsetY = (Math.random() - 0.5) * 150;
            clone.style.left = (this.enemyElement.offsetLeft + offsetX) + "px";
            clone.style.top = (this.enemyElement.offsetTop + offsetY) + "px";
            
            document.body.appendChild(clone);
            this.clones.push(clone);
        }
        
        this.abilities.illusions = true;
        
        setTimeout(() => {
            this.removeIllusions();
        }, 4000);
    }

    removeIllusions() {
        this.clones.forEach(clone => clone.remove());
        this.clones = [];
        this.abilities.illusions = false;
    }

    activateRage() {
        this.abilities.rage = true;
        this.enemyElement.style.filter = "hue-rotate(-30deg) saturate(2) brightness(1.3)";
        this.enemyElement.style.animation = "shake 0.2s infinite";
        
        setTimeout(() => {
            this.abilities.rage = false;
            this.enemyElement.style.filter = "";
            this.enemyElement.style.animation = "";
        }, 3000);
    }

    deployTimeBomb() {
        this.abilities.timeBombs = true;
        this.enemyElement.style.animation = "pulse 0.3s infinite";
        
        setTimeout(() => {
            this.enemyElement.style.filter = "brightness(3) saturate(0)";
            this.enemyElement.style.transform = "scale(1.8)";
            
            setTimeout(() => {
                this.enemyElement.style.filter = "";
                this.enemyElement.style.transform = "";
                this.enemyElement.style.animation = "";
                this.abilities.timeBombs = false;
            }, 500);
        }, 2000);
    }

    onComboHit() {
        // Check shield first
        if (this.abilities.shield && this.shieldHealth > 0) {
            this.shieldHealth--;
            if (this.shieldHealth <= 0) {
                this.abilities.shield = false;
                this.enemyElement.style.boxShadow = "";
                this.enemyElement.style.border = "";
            }
            
            this.enemyElement.style.filter = "brightness(2) hue-rotate(180deg)";
            setTimeout(() => {
                this.enemyElement.style.filter = "";
            }, 200);
            
            return false;
        }
        
        this.health--;
        
        if (this.health <= 0) {
            // Clean up all effects
            this.removeIllusions();
            this.projectiles.forEach(p => p.remove());
            this.projectiles = [];
            return true; // Boss defeated
        } else {
            // Phase transitions
            if (this.health === 5 && this.currentPhase === 1) {
                this.currentPhase = 2;
                this.activateShield();
            } else if (this.health === 2 && this.currentPhase === 2) {
                this.currentPhase = 3;
                this.activateRage();
            }
            
            // Hit feedback
            this.enemyElement.style.filter = "invert(1) brightness(2) contrast(1.5)";
            setTimeout(() => {
                this.enemyElement.style.filter = "";
            }, 250);
            
            return false;
        }
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = FinalBoss7;
}
