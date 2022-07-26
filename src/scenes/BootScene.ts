export class BootScene extends Phaser.Scene {
    private loadingBar: Phaser.GameObjects.Graphics
    private progressBar: Phaser.GameObjects.Graphics

    constructor() {
        super({
            key: "BootScene"
        })
    }

    preload(): void {
        // set the background, create the loading and progress bar
        this.cameras.main.setBackgroundColor(0x000000)
        this.createLoadingGraphics()

        this.load.on(
            "progress",
            (value: number) => {
                this.progressBar.clear()
                this.progressBar.fillStyle(0x88e453, 1)
                this.progressBar.fillRect(
                    this.cameras.main.width / 4,
                    this.cameras.main.height / 2 - 16,
                    (this.cameras.main.width / 2) * value,
                    16
                )
            },
            this
        )

        this.load.on(
            "complete",
            () => {
                this.progressBar.destroy()
                this.loadingBar.destroy()
            },
            this
        )

        this.load.script(
            "webfont",
            "https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js"
        )

        this.load.audio("stab", "./assets/sounds/stab.wav")
        this.load.audio("getStab", "./assets/sounds/get_stab.mp3")
        this.load.audio("swallow", "./assets/sounds/swallow.mp3")
        this.load.audio("bubble", "./assets/sounds/bubble.mp3")
        this.load.audio("fishDie", "./assets/sounds/fishDie.wav")
        this.load.audio("startGameMusic", "./assets/sounds/startGameMusic.wav")
        this.load.audio("backgroundMusic", "./assets/sounds/bgMusic.wav")
        this.load.audio("bossComing", "./assets/sounds/bossComing.wav")

        this.load.atlas(
            "flares",
            "./assets/particles/flares.png",
            "./assets/particles/flares.json"
        )

        this.load.pack("preload", "./assets/pack.json", "preload")
    }
    update(): void {
        this.scene.start("StartScene")
    }
    create() {}
    private createLoadingGraphics(): void {
        this.loadingBar = this.add.graphics()
        this.loadingBar.fillStyle(0xffffff, 1)
        this.loadingBar.fillRect(
            this.cameras.main.width / 4 - 2,
            this.cameras.main.height / 2 - 18,
            this.cameras.main.width / 2 + 4,
            20
        )
        this.progressBar = this.add.graphics()
    }
}
