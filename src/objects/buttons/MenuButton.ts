import { IImageConstructor } from "../../interfaces/IImageConstructor"

export class MenuButton extends Phaser.GameObjects.Image {
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
        this.on("pointerover", () => {
            this.setTint(0x76ba99)
            // this.scene.sound.play("mouseover")
        })

        this.on("pointerout", () => {
            this.clearTint()
            this.setScale(0.4)
        })

        this.on("pointerdown", () => {
            this.setScale(0.5)
        })
    }

    public onClick(callback: Function) {
        this.on("pointerup", callback)
    }
}
