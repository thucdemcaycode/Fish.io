import { Constants } from "../../helpers/Contants"
import { ICollectibleConstructor } from "../../interfaces/ICollectibleConstructor"

export class Collectible extends Phaser.GameObjects.Image {
    body: Phaser.Physics.Arcade.Body

    // variables
    private scaleTween: Phaser.Tweens.Tween
    private disappearTween: Phaser.Tweens.Tween

    public isCollectable: boolean
    private value: number

    constructor(aParams: ICollectibleConstructor) {
        super(
            aParams.scene,
            aParams.x,
            aParams.y,
            aParams.texture,
            aParams.frame
        )

        // variables
        this.value = aParams.value
        this.initSprite()
        this.scene.add.existing(this)
    }

    private initSprite() {
        this.setOrigin(0.5, 0.5)
        this.isCollectable = false
        this.initTween()

        this.scene.physics.world.enable(this)
    }

    private initTween() {
        if (this.value != Constants.SMALL_ITEM_VALUE) {
            let x = Phaser.Math.Between(this.x - 80, this.x + 80)
            let y = Phaser.Math.Between(this.y - 60, this.y + 80)
            this.scene.tweens.add({
                targets: this,
                x: { value: x, duration: 600, ease: "Power2" },
                y: { value: y, duration: 800, ease: "Power2" },
                alpha: { from: 0, to: 1 },
                repeat: 0,
                onComplete: () => {
                    this.isCollectable = true
                    this.disappearCollectible()
                }
            })
        } else {
            this.isCollectable = true
        }
        this.scaleTween = this.scene.tweens.add({
            targets: this,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 800,
            yoyo: true,
            repeat: -1
        })
    }

    update(): void {}

    public disappearCollectible() {
        this.disappearTween = this.scene.tweens.add({
            targets: this,
            scale: { from: 1.2, to: 0.2 },
            alpha: { from: 1, to: 0.2 },
            duration: 500,
            delay: 2500,
            onComplete: () => {
                this.destroy()
            }
        })
    }

    public getValue() {
        return this.value
    }

    public collect(): void {
        this.isCollectable = false
        if (this.disappearTween) {
            this.disappearTween.stop()
        }
        this.scaleTween.stop()
        this.scene.physics.world.disable(this)

        this.scene.tweens.add({
            targets: this,
            scale: { from: 1.2, to: 0.2 },
            alpha: { from: 1, to: 0.2 },
            duration: 500,
            onComplete: () => {
                this.destroy()
            }
        })
    }

    public canCollect() {
        return this.isCollectable
    }
}
