import { Constants } from "../../helpers/Contants"

export class StaminaBar extends Phaser.GameObjects.Graphics {
    public stamina: number
    constructor(scene: Phaser.Scene) {
        super(scene)

        this.initBar()
        this.drawBar()

        this.scene.add.existing(this)
    }

    private initBar() {
        this.stamina = 1
        this.setScrollFactor(0)
        this.setDepth(5)
    }

    public drawBar() {
        this.clear()

        this.fillStyle(0x3ab4f2, 1)
        this.fillRect(
            Constants.STAMINA_X_POS,
            Constants.STAMINA_Y_POS,
            Constants.STAMINA_WIDTH * this.stamina,
            Constants.STAMINA_HEIGHT
        )
        this.lineStyle(2, 0xffffff)

        this.strokeRect(
            Constants.STAMINA_X_POS,
            Constants.STAMINA_Y_POS,
            Constants.STAMINA_WIDTH,
            Constants.STAMINA_HEIGHT
        )
        this.setDepth(5)
    }

    public consumeStamina() {
        this.stamina -= Constants.STAMINA_CONSUME_QTY
        if (this.stamina < 0) {
            this.stamina = 0
        }
        this.drawBar()
    }

    public getStamina() {
        return this.stamina
    }

    public rechargeStamina() {
        this.stamina = this.stamina + 0.1
        if (this.stamina > 1) {
            this.stamina = 1
        }
        this.drawBar()
    }
}
