import { IImageConstructor } from "../../interfaces/IImageConstructor"

export class Shield extends Phaser.GameObjects.Image {
    constructor(aParams: IImageConstructor) {
        super(
            aParams.scene,
            aParams.x,
            aParams.y,
            aParams.texture,
            aParams.frame
        )

        this.initShield()

        this.scene.add.existing(this)
    }

    private initShield() {
        this.setOrigin(0.5, 0.5)
        this.alpha = 1
        this.setScale(0.2)
        this.setDepth(2)
    }

    update(x: number, y: number, rotation: number): void {
        if (this.active) {
            this.x = x
            this.y = y
            this.rotation = rotation
        }
    }
}
