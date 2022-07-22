import { IFishHeadConstructor } from "../../interfaces/IFishHeadConstructor"

export class FishHead extends Phaser.GameObjects.Image {
    constructor(aParams: IFishHeadConstructor) {
        super(
            aParams.scene,
            aParams.x,
            aParams.y,
            aParams.texture,
            aParams.frame
        )

        this.setDisplaySize(aParams.width, aParams.height)

        this.scene.add.existing(this)
    }

    rotate(angle: number): void {
        const onCircle1 = angle >= -90 && angle <= 0
        const onCircle2 = angle > 0 && angle <= 90
        const onCircle3 = angle > 90 && angle <= 180
        const onCircle4 = angle >= -180 && angle < -90

        if (onCircle1 || onCircle2) {
            this.setFlipY(false)
        }

        if (onCircle3 || onCircle4) {
            this.setFlipY(true)
        }
    }
}
