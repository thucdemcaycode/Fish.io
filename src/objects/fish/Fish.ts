import { Constants } from "../../helpers/Contants"
import { getRandomName } from "../../helpers/nameGenerator"
import { ISpriteConstructor } from "../../interfaces/ISpriteConstructor"
import { Shield } from "../shield/Shield"
import { WeaponBody } from "../weapons/WeaponBody"
import { WeaponContainer } from "../weapons/WeaponContainer"

export class Fish extends Phaser.GameObjects.Sprite {
    body: Phaser.Physics.Arcade.Body
    private ainmKey: string

    private isDying: boolean
    private speed: number
    protected fishSize: number
    protected score: number

    protected fishNameText: Phaser.GameObjects.Text
    protected shieldImage: Phaser.GameObjects.Image

    protected countKillFish: number

    protected weapon: WeaponContainer

    constructor(aParams: ISpriteConstructor) {
        super(
            aParams.scene,
            aParams.x,
            aParams.y,
            aParams.texture,
            aParams.frame
        )

        this.initSprite()
        this.ainmKey = aParams.texture + "Swimming"
        this.createAnims(aParams.texture)

        this.scene.add.existing(this)
    }

    private initSprite() {
        this.initVariables()

        this.initWeapon()

        this.initShield()

        this.initFishNameText()

        this.addFishToRankBoard()

        this.setScale(this.fishSize)
        this.setOrigin(0.5, 0.5)
        this.setFlipX(false)
        this.setDepth(1)

        this.scene.physics.world.enable(this)
        this.body.setCollideWorldBounds(true)
    }

    private initVariables() {
        this.isDying = false
        this.speed = Constants.NORMAL_SPEED
        this.countKillFish = 0
        this.fishSize = 0.7
        this.score = 0
    }

    protected initWeapon() {
        this.weapon = new WeaponContainer({
            scene: this.scene,
            x: this.x + 50,
            y: this.y,
            texture: "shortSword",
            fish: this
        })
    }

    private initShield() {
        this.shieldImage = new Shield({
            scene: this.scene,
            x: this.x,
            y: this.y,
            texture: "shield"
        })

        this.activeShield()
    }
    protected activeShield() {
        this.alpha = 0.5
        this.weapon.alpha = 0.5

        this.shieldImage.alpha = 1
        this.shieldImage.active = true
        this.shieldImage.visible = true

        this.scene.time.delayedCall(3000, () => {
            this.shieldImage.active = false
            this.shieldImage.visible = false
            this.alpha = 1
            this.weapon.alpha = 1
        })
    }

    private initFishNameText() {
        this.fishNameText = this.scene.add.text(this.x, this.y - 70, "", {
            fontSize: "25px",
            fontFamily: "Revalia",
            align: "center",
            stroke: "#000000",
            strokeThickness: 2
        })

        this.fishNameText.setOrigin(0.5, 0.5)
        this.fishNameText.setText(getRandomName())
        this.fishNameText.setDepth(3)
    }

    private addFishToRankBoard() {
        this.scene.events.emit(
            Constants.EVENT_NEW_FISH,
            this.fishNameText.text,
            this.score
        )
    }

    public isVulnerable(): boolean {
        return !this.shieldImage.active && this.visible
    }

    private createAnims(key: string) {
        this.anims.create({
            key: this.ainmKey,
            frames: this.anims.generateFrameNumbers(key, {
                start: 0,
                end: 19
            }),
            frameRate: 30,
            repeat: -1
        })
        this.play(this.ainmKey)
    }

    update(): void {}

    protected updateShield() {
        this.shieldImage.update(this.x, this.y, this.rotation)
    }

    protected updateNameText() {
        this.fishNameText.x = this.x
        this.fishNameText.y = this.y - 70
    }

    protected updateWeapon() {
        this.weapon.update(this.x, this.y, this.rotation)
    }

    protected handleRotation() {
        const onCircle1 = this.angle >= -90 && this.angle <= 0
        const onCircle2 = this.angle > 0 && this.angle <= 90
        const onCircle3 = this.angle > 90 && this.angle <= 180
        const onCircle4 = this.angle >= -180 && this.angle < -90

        if (onCircle1 || onCircle2) {
            this.setFlipY(false)
        }

        if (onCircle3 || onCircle4) {
            this.setFlipY(true)
        }
    }

    public getWeapon(): WeaponBody[] {
        return this.weapon.getPhysicsBodyGroup()
    }

    public growFish(): void {}

    public gotHit(): void {}

    public killOtherFish() {
        this.updateRankingBoard()

        this.weapon.getFishHead()
        this.countKillFish += 1
        if (this.countKillFish >= 4) {
            this.countKillFish = 0
            this.upgradeFish()
        }
    }

    protected updateRankingBoard() {
        this.score += 50
        this.scene.events.emit(
            Constants.EVENT_FISH_SCORE,
            this.fishNameText.text,
            this.score
        )
    }

    private upgradeFish() {
        if (this.fishSize < 1.2) {
            this.fishSize += 0.1
            this.setScale(this.fishSize)
        }
    }

    public getIgnoreObjects(): any {
        return [this.fishNameText]
    }
}
