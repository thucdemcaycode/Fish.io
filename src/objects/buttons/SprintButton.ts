import { IImageConstructor } from "../../interfaces/IImageConstructor"
import { Button } from "./Button"

export class SprintButton extends Button {
    constructor(aParams: IImageConstructor) {
        super(aParams)
        this.placeButton()
        this.createHitArea()
    }

    private placeButton() {
        this.setAlpha(0.5)
        this.setPosition(720, 280)
        this.setDepth(5)
    }

    private createHitArea() {
        this.removeInteractive()
        this.setInteractive(
            new Phaser.Geom.Circle(this.width / 2, this.height / 2, 90),
            Phaser.Geom.Circle.Contains
        )
    }
}
