import { IImageConstructor } from "../../interfaces/IImageConstructor"

export class Button extends Phaser.GameObjects.Image {
    constructor(aParams: IImageConstructor) {
        super(
            aParams.scene,
            aParams.x,
            aParams.y,
            aParams.texture,
            aParams.frame
        )

        this.setInteractive()

        this.setScrollFactor(0)

        this.inputHandler()

        this.scene.add.existing(this)
    }

    private inputHandler() {
        this.on(Phaser.Input.Events.POINTER_UP, () => {
            this.setScale(1)
            this.setAlpha(0.5)
        })
        this.on(Phaser.Input.Events.POINTER_OUT, this.unPressDownEffect)
        this.on(Phaser.Input.Events.POINTER_DOWN, this.onPressDownEffect)
    }

    public onPress(callback: Function) {
        this.on(Phaser.Input.Events.POINTER_DOWN, callback)
    }
    public unPress(callback: Function) {
        this.on(Phaser.Input.Events.POINTER_OUT, callback)
    }

    public onPressDownEffect = () => {
        this.setScale(1.1)
        this.setAlpha(0.8)
    }
    public unPressDownEffect = () => {
        this.setScale(1)
        this.setAlpha(0.5)
    }
}
