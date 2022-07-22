import { IImageConstructor } from "../../interfaces/IImageConstructor"

export class Collectible extends Phaser.GameObjects.Image {
    body: Phaser.Physics.Arcade.Body

    // variables
    private scaleTween: Phaser.Tweens.Tween
    private disappearTween: Phaser.Tweens.Tween

    constructor(aParams: IImageConstructor) {
        super(
            aParams.scene,
            aParams.x,
            aParams.y,
            aParams.texture,
            aParams.frame
        )

        // variables
        this.initSprite()
        this.scene.add.existing(this)
    }

    private initSprite() {
        this.setOrigin(0.5, 0.5)
        this.initTween()

        // physics
        this.scene.physics.world.enable(this)
    }

    private initTween() {
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

    public collect(): void {
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
}
