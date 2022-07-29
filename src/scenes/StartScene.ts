import { Constants } from "../helpers/Contants"

export class StartScene extends Phaser.Scene {
    private background: Phaser.GameObjects.TileSprite

    constructor() {
        super({
            key: "StartScene"
        })
    }
    init() {
        this.initGlobalDataManager()
    }

    preload(): void {
        this.load.html("nameform", "./assets/text/nameform.html")
    }
    create() {
        this.createBackground()
        this.createDom()
    }
    update(): void {}

    private initGlobalDataManager(): void {
        this.registry.set("time", Constants.TIME_PER_MATCH)
        this.registry.set("playerKill", 0)
        this.registry.set("playerScore", 0)
        this.registry.set("status", Constants.STATUS_PLAYING)
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

    private createDom = () => {
        const width = Constants.GAMESCREEN_WIDTH
        const height = Constants.GAMESCREEN_HEIGHT

        let element = this.add
            .dom(width / 2, height / 2)
            .createFromCache("nameform")
            .setOrigin(0.5, 0.5)

        element.addListener("click")

        element.on("click", (event: any) => {
            if (event.target.name === "playButton") {
                let inputText: any = element.getChildByName("nameField")

                if (inputText.value !== "") {
                    element.removeListener("click")

                    this.registry.set("playerName", inputText.value)
                } else {
                    let name = "Player" + Phaser.Math.Between(1000, 5000)
                    this.registry.set("playerName", name)
                }

                this.scene.start("HUDScene")
                this.scene.start("GameScene")
                this.scene.bringToTop("HUDScene")
            }
        })

        this.tweens.add({
            targets: element,
            y: 150,
            duration: 2000,
            ease: "Power3"
        })
    }
}
