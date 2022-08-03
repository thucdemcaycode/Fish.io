import { Constants } from "../../../helpers/Contants"
import { calDistance } from "../../../helpers/Distance"
import { ISpriteConstructor } from "../../../interfaces/ISpriteConstructor"
import { Fish } from "../Fish"

export class Enemy extends Fish {
    protected playingSpeed: number
    protected timeSprint: number

    protected isRotating: boolean
    private waitingRespawn: boolean
    private timeRespawn: number

    private rectangle: Phaser.GameObjects.Rectangle

    constructor(aParams: ISpriteConstructor) {
        super(aParams)

        this.initEnemy()
    }

    private initEnemy() {
        this.setFishSpeed(Constants.NORMAL_SPEED)
        this.timeSprint = 0
        this.isRotating = false
        this.waitingRespawn = false
        this.timeRespawn = 0
        this.initRectangle()
    }

    private initRectangle() {
        this.rectangle = this.scene.add.rectangle(0, 0, 20, 20, 0xffea11)
        this.rectangle.setOrigin(0.5, 0.5)
        this.rectangle.visible = false
    }

    public showRectangle(x: number, y: number, distance: number) {
        this.rectangle.setPosition(x, y)
        this.rectangle.visible = true

        this.scaleTrackingRectangle(distance)
    }

    public hideRectangle() {
        this.rectangle.visible = false
        this.rectangle.setScale(1)
    }

    private scaleTrackingRectangle(distance: number) {
        if (distance >= 1000) {
            this.rectangle.setScale(0.5)
        } else if (distance > 750) {
            this.rectangle.setScale(0.7)
        } else if (distance > 500) {
            this.rectangle.setScale(0.8)
        } else {
            this.rectangle.setScale(1.1)
        }
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

        this.fishScale = this.scale
        this.weaponScale = this.weapon.scale

        this.scene.tweens.add({
            targets: [this, this.weapon, this.fishNameText],
            scale: { from: 1.2, to: 0.2 },
            alpha: { from: 1, to: 0.2 },
            duration: 500,
            onComplete: () => {
                this.checkEnemyRespawnRate()
            }
        })
    }

    protected checkEnemyRespawnRate = () => {}

    protected hideFish() {
        this.active = false
        this.fishNameText.visible = false
        this.visible = false
        this.weapon.visible = false
        this.bubbleEmitter.visible = false
        this.rectangle.visible = false

        this.changeRespawnPosition()

        this.timeRespawn = Phaser.Math.Between(3000, 5000)
        this.waitingRespawn = true
    }

    public handleRespawn = () => {
        if (!this.waitingRespawn) return

        if (this.timeRespawn < 0) {
            this.timeRespawn = 0
            this.waitingRespawn = false
            this.fishRespawn()
        } else {
            this.timeRespawn -= 15
        }
    }

    private changeRespawnPosition() {
        const width = Constants.GAMEWORLD_WIDTH
        const height = Constants.GAMEWORLD_HEIGHT

        let currentX = this.x
        let currentY = this.y

        let x = Phaser.Math.Between(70, width - 70)
        let y = Phaser.Math.Between(70, height - 70)

        let distance = calDistance(currentX, currentY, x, y)

        while (distance < 800) {
            x = Phaser.Math.Between(70, width - 70)
            y = Phaser.Math.Between(70, height - 70)
            distance = calDistance(currentX, currentY, x, y)
            console.log(Math.random())
        }

        this.x = x
        this.y = y
    }

    protected destroyFish = () => {
        console.log(this.getFishName() + " destroy")
        this.rectangle.destroy()
        this.bubbleEmitter.remove()
        this.fishNameText.destroy()
        this.destroy()
        this.weapon.destroy()
    }

    public fishRespawn() {
        console.log(this.getFishName() + " respawn")
        this.active = true
        this.shieldImage.active = true
        this.fishNameText.visible = true
        this.visible = true
        this.weapon.visible = true
        this.scene.physics.world.enable(this)
        this.scene.physics.world.enable(this.weapon.getPhysicsBodyGroup())

        this.scene.tweens.add({
            targets: [this, this.weapon, this.fishNameText],
            scale: { from: 0.2, to: 0.7 },
            alpha: { from: 0.2, to: 0.5 },
            duration: 500,
            onComplete: () => {
                this.textNameRespawn()
                this.activeShield()
                this.weaponRespawn()
            }
        })
    }

    private textNameRespawn() {
        this.fishNameText.setScale(1)
        this.fishNameText.setAlpha(1)
    }

    private weaponRespawn() {
        this.weapon.setScale(this.weaponScale)
        this.weapon.setAlpha(1)
        this.setScale(this.fishScale)
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

    private emitEventRespawnOrLeft = (text: string) => {
        this.scene.events.emit(Constants.EVENT_FISH_RESPAWN_OR_LEFT, text)
    }
}
