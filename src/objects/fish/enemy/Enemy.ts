import { Constants } from "../../../helpers/Contants"
import { ISpriteConstructor } from "../../../interfaces/ISpriteConstructor"
import { Fish } from "../Fish"

export class Enemy extends Fish {
    protected playingSpeed: number
    protected timeSprint: number

    protected isRotating: boolean

    private rectangle: Phaser.GameObjects.Rectangle

    constructor(aParams: ISpriteConstructor) {
        super(aParams)

        this.initEnemy()
    }

    private initEnemy() {
        this.setFishSpeed(Constants.NORMAL_SPEED)
        this.timeSprint = 0
        this.isRotating = false
        this.initRectangle()
    }

    private initRectangle() {
        this.rectangle = this.scene.add.rectangle(0, 0, 20, 20, 0xffea11)
        this.rectangle.setOrigin(0.5, 0.5)
        this.rectangle.visible = false
    }

    public showRectangle(x: number, y: number) {
        this.rectangle.setPosition(x, y)
        this.rectangle.visible = true
    }

    public hideRectangle() {
        this.rectangle.visible = false
    }

    protected setFishSpeed = (speed: number) => {
        this.playingSpeed = speed
    }

    public getCollectible() {
        this.updateRankingBoard(Constants.GET_ITEM_SCORE)
        this.setFishSpeed(Constants.SPRINT_SPEED)
        this.timeSprint = 800
    }

    public gotHit(): void {
        this.scene.physics.world.disable(this)
        this.scene.physics.world.disable(this.weapon.getPhysicsBodyGroup())

        this.bubbleEmitter.visible = false

        this.scene.tweens.add({
            targets: [this, this.weapon, this.fishNameText],
            scale: { from: 1.2, to: 0.2 },
            alpha: { from: 1, to: 0.2 },
            duration: 500,
            onComplete: () => {
                this.rectangle.destroy()
                this.bubbleEmitter.remove()
                this.fishNameText.destroy()
                this.destroy()
                this.weapon.destroy()
            }
        })
    }

    protected rotateRandom() {
        if (this.isRotating) return
        if (Math.random() > 0.998) {
            const angle = Phaser.Math.Between(-180, 180)
            this.tweenRotate(angle)
        }
    }

    protected tweenRotate(angle: number) {
        this.isRotating = true

        const currentAngle = this.angle
        let diff = angle - currentAngle
        if (diff < -180) {
            diff += 360
        } else if (diff > 180) {
            diff -= 360
        }

        let duration = Phaser.Math.Between(0, 400)

        this.scene.tweens.add({
            targets: this,
            angle: currentAngle + diff,
            duration: duration,
            onComplete: () => {
                this.isRotating = false
            }
        })
    }
    protected tweenRotateRadian(targetRadian: number) {
        this.isRotating = true

        const currentRadian = this.rotation
        let diff = targetRadian - currentRadian

        if (diff < -Math.PI) {
            diff += Math.PI * 2
        } else if (diff > Math.PI) {
            diff -= Math.PI * 2
        }

        let duration = Phaser.Math.Between(100, 400)

        this.scene.tweens.add({
            targets: this,
            rotation: currentRadian + diff,
            duration: duration,
            onComplete: () => {
                this.isRotating = false
            }
        })
    }

    protected handleSprint() {
        if (this.playingSpeed != Constants.NORMAL_SPEED) {
            this.bubbleEmitter.visible = true
            this.timeSprint -= 15
            if (this.timeSprint < 0) {
                this.setFishSpeed(Constants.NORMAL_SPEED)
                this.bubbleEmitter.visible = false
                this.timeSprint = 0
            }
        }
    }

    protected sprintRandom() {
        if (Math.random() > 0.9985 && this.timeSprint == 0) {
            this.setFishSpeed(Constants.SPRINT_SPEED)
            this.timeSprint = 1000
        }
    }

    protected handleHitWorldBound() {
        if (this.isRotating) return

        if (this.x < 80) {
            let angle = Phaser.Math.Between(-50, 50)
            this.tweenRotate(angle)
        } else if (this.x > Constants.GAMEWORLD_WIDTH - 80) {
            let angle = Phaser.Math.Between(90, 180)
            this.tweenRotate(angle)
        } else if (this.y < 80) {
            let angle = Phaser.Math.Between(0, 180)
            this.tweenRotate(angle)
        } else if (this.y > Constants.GAMEWORLD_HEIGHT - 80) {
            let angle = Phaser.Math.Between(-180, 0)
            this.tweenRotate(angle)
        }
    }

    public getIgnoreObjects(): any {
        return [this.fishNameText, this.rectangle]
    }
}
