import { Constants } from "../helpers/Contants"
import { getRandomName } from "../helpers/nameGenerator"

export class MatchingScene extends Phaser.Scene {
    private background: Phaser.GameObjects.TileSprite

    private textElements: Phaser.GameObjects.Text[]
    private countTextAppear: number
    private names: string[]
    constructor() {
        super({
            key: "MatchingScene"
        })
    }

    create(): void {
        this.createBackground()

        this.createVariables()

        this.createTexts()
    }

    private createBackground() {
        const width = Constants.GAMEWORLD_WIDTH
        const height = Constants.GAMEWORLD_HEIGHT

        this.background = this.add.tileSprite(
            width / 2,
            height / 2,
            width,
            height,
            "background"
        )
    }

    private createVariables() {
        this.textElements = []
        this.names = []
        this.countTextAppear = 0

        this.generateNames()
    }

    private generateNames() {
        let enemyNames: string[] = []

        let playerIndex = Phaser.Math.Between(
            0,
            Constants.INIT_ENEMY_NUMBER - 1
        )

        for (let i = 0; i < Constants.INIT_ENEMY_NUMBER; i++) {
            let name = getRandomName()
            while (this.names.includes(name)) {
                name = getRandomName()
            }
            enemyNames.push(name)
            this.names.push(name)

            if (i == playerIndex) {
                const playerName = this.registry.get("playerName")
                this.names.push(playerName)
            }
        }

        this.registry.set("enemyNames", enemyNames)
    }

    private createTexts() {
        this.addFindingText()

        const numberOfNames = Constants.INIT_ENEMY_NUMBER + 1
        let y = 80
        let idx = 1
        const color = new Phaser.Display.Color()

        for (let i = 0; i < numberOfNames; i++) {
            let x = idx * 190 - 55
            let name = this.names[i]

            color.random(50)
            const text = this.add.text(x, y, name, {
                fontSize: "25px",
                fontFamily: "Revalia",
                align: "center",
                stroke: "#000000",
                strokeThickness: 2
            })
            text.setTintFill(color.color)

            text.setScale(0).setOrigin(0.5, 0.5)

            let timeNameAppear = Phaser.Math.Between(500, 4000)

            this.tweens.add({
                targets: text,
                scale: 1,
                alpha: { from: 0, to: 1 },
                duration: timeNameAppear,
                onComplete: () => {
                    this.countTextAppear += 1
                    this.doneFinding()
                }
            })

            if (idx == 4) {
                idx = 1
                y += 60
            } else {
                idx += 1
            }
        }
    }

    private addFindingText() {
        this.add
            .text(445, 30, "Finding Player...", {
                fontSize: "35px",
                fontFamily: "Revalia",
                align: "center",
                stroke: "#000000",
                strokeThickness: 2,
                color: "#ffffff"
            })
            .setOrigin(0.5, 0.5)
    }

    private doneFinding() {
        if (this.countTextAppear != Constants.INIT_ENEMY_NUMBER + 1) return

        this.scene.start(Constants.HUD_SCENE)
        this.scene.start(Constants.GAME_SCENE)
        this.scene.bringToTop(Constants.HUD_SCENE)
        this.scene.stop()
    }
}
