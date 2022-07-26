import { Constants } from "../../../helpers/Contants"
import { ISpriteConstructor } from "../../../interfaces/ISpriteConstructor"
import { Enemy } from "./Enemy"

export class NoobEnemy extends Enemy {
    constructor(aParams: ISpriteConstructor) {
        super(aParams)
    }

    update(): void {
        this.scene.physics.velocityFromRotation(
            this.rotation,
            this.playingSpeed,
            this.body.velocity
        )
        this.handleRotation()
        this.handleSprint()

        this.updateWeapon()

        this.rotateRandom()
        this.sprintRandom()

        this.handleHitWorldBound()

        this.updateShield()
        this.updateNameText()
    }

    protected checkEnemyRespawnRate = () => {
        let rate = Math.random()
        if (rate < Constants.NOOB_ENEMY_RESPAWN_RATE) {
            this.hideFish()
        } else {
            this.destroyFish()
        }
    }
}
