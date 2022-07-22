import { Constants } from "../../../helpers/Contants"
import { ISpriteConstructor } from "../../../interfaces/ISpriteConstructor"
import { Fish } from "../Fish"

export class Enemy extends Fish {
    protected playingSpeed: number
    protected timeSprint: number

    constructor(aParams: ISpriteConstructor) {
        super(aParams)

        this.initEnemy()
    }

    private initEnemy() {
        this.setFishSpeed(Constants.NORMAL_SPEED)
        this.timeSprint = 0
    }

    protected setFishSpeed = (speed: number) => {
        this.playingSpeed = speed
    }

    public getCollectible() {
        this.setFishSpeed(Constants.SPRINT_SPEED)
        this.timeSprint = 2000
    }

    public gotHit(): void {
        this.scene.physics.world.disable(this)
        this.scene.physics.world.disable(this.weapon.getPhysicsBodyGroup())

        this.scene.tweens.add({
            targets: [this, this.weapon, this.fishNameText],
            scale: { from: 1.2, to: 0.2 },
            alpha: { from: 1, to: 0.2 },
            duration: 500,
            onComplete: () => {
                this.fishNameText.destroy()
                this.destroy()
                this.weapon.destroy()
            }
        })
    }

    protected rotateRandom() {
        if (Math.random() > 0.999) {
            const angle = Phaser.Math.Between(-180, 180)
            this.angle = angle
        }
    }

    protected handleSprint() {
        if (this.playingSpeed != Constants.NORMAL_SPEED) {
            this.timeSprint -= 15
            if (this.timeSprint < 0) {
                this.setFishSpeed(Constants.NORMAL_SPEED)
                this.timeSprint = 0
            }
        }
    }

    protected sprintRandom() {
        if (Math.random() > 0.998 && this.timeSprint == 0) {
            this.setFishSpeed(Constants.SPRINT_SPEED)
            this.timeSprint = 2000
        }
    }

    protected handleHitWorldBound() {
        if (this.x < 80) {
            let angle = Phaser.Math.Between(-50, 50)
            this.angle = angle
        } else if (this.x > Constants.GAMEWORLD_WIDTH - 80) {
            let angle = Phaser.Math.Between(90, 180)
            this.angle = angle
        } else if (this.y < 80) {
            let angle = Phaser.Math.Between(0, 180)
            this.angle = angle
        } else if (this.y > Constants.GAMEWORLD_HEIGHT - 80) {
            let angle = Phaser.Math.Between(-180, 0)
            this.angle = angle
        }
    }
}
