import { Constants } from "../../../helpers/Contants"
import { ISpriteConstructor } from "../../../interfaces/ISpriteConstructor"
import { WeaponContainer } from "../../weapons/WeaponContainer"
import { Fish } from "../Fish"

export class Boss extends Fish {
    protected playingSpeed: number
    protected timeSprint: number

    protected isRotating: boolean

    private rectangle: Phaser.GameObjects.Rectangle

    constructor(aParams: ISpriteConstructor) {
        super(aParams)

        this.initBoss()
    }

    private initBoss() {
        this.setFishSpeed(Constants.NORMAL_BOSS_SPEED)
        this.timeSprint = 0
        this.isRotating = false
        this.initRectangle()

        this.initBossSize()

        this.initBossName()
    }

    private initBossName() {
        let name = "Boss" + Phaser.Math.Between(1, 5000)
        this.fishNameText.setText(name)
        this.fishNameText.setColor("#FF1E00")
    }

    protected createAnims(key: string) {}

    protected initWeapon(key?: string) {
        const weaponKey = "saw"

        this.weapon = new WeaponContainer({
            scene: this.scene,
            x: this.x + 50,
            y: this.y,
            texture: weaponKey,
            fish: this
        })
    }

    private initRectangle() {
        this.rectangle = this.scene.add.rectangle(0, 0, 30, 30, 0xff1e00)
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
        this.setFishSpeed(Constants.SPRINT_BOSS_SPEED)
        this.timeSprint = 1000
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
        if (this.playingSpeed != Constants.NORMAL_BOSS_SPEED) {
            this.bubbleEmitter.visible = true
            this.timeSprint -= 15
            if (this.timeSprint < 0) {
                this.setFishSpeed(Constants.NORMAL_BOSS_SPEED)
                this.bubbleEmitter.visible = false
                this.timeSprint = 0
            }
        }
    }

    protected sprintRandom() {
        if (Math.random() > 0.998 && this.timeSprint == 0) {
            this.setFishSpeed(Constants.SPRINT_BOSS_SPEED)
            this.timeSprint = 1500
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

    protected initBossSize() {
        for (let i = 0; i < 16; i++) {
            this.weapon.getFishHead()
            this.upgradeFish()
        }
        this.shieldImage.setScale(0.3)
    }
}
