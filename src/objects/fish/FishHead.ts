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
}
