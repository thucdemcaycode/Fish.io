import { IImageConstructor } from "../../interfaces/IImageConstructor"
import { Button } from "./Button"

export class SprintButton extends Button {
    private circleHitArea: Phaser.GameObjects.Arc
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
        this.circleHitArea = this.scene.add
            .circle(720, 280, 70)
            .setOrigin(0.5, 0.5)
            .setScrollFactor(0)
            .setInteractive()
            .setDepth(6)
    }

    public onPress(callback: Function) {
        this.circleHitArea.on(Phaser.Input.Events.POINTER_DOWN, () => {
            this.onPressDownEffect()
            callback()
        })
    }
    public unPress(callback: Function) {
        this.circleHitArea.on(Phaser.Input.Events.POINTER_OUT, () => {
            this.unPressDownEffect()
            callback()
        })
    }
}
