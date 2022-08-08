import { Constants } from "../helpers/Contants"
import { MenuButton } from "../objects/buttons/MenuButton"

export class OverMenu extends Phaser.Scene {
    private background: Phaser.GameObjects.Image
    private respawnButton: MenuButton
    private newGameButton: MenuButton

    private scoreText: Phaser.GameObjects.Text
    private scoreNumberText: Phaser.GameObjects.Text

    private killText: Phaser.GameObjects.Text
    private killNumberText: Phaser.GameObjects.Text

    private newgameText: Phaser.GameObjects.Text

    private container: Phaser.GameObjects.Container
    private zone: Phaser.GameObjects.Zone

    constructor() {
        super({
            key: "OverMenu"
        })
    }

    create(): void {
        this.createZone()

        this.createMenu()

        this.createContainer()

        this.checkGameStatus()

        this.inputHandler()
    }

    private createZone() {
        const width = this.sys.canvas.width
        const height = this.sys.canvas.height

        this.add.rectangle(0, 0, width, height, 0x000000, 0.7).setOrigin(0, 0)

        this.zone = this.add.zone(0, 0, width, height).setOrigin(0, 0)
    }

    private createMenu() {
        this.background = this.add.image(0, 0, "back").setScale(1.1, 1.9)

        this.createScoreText()
        this.createKillText()

        this.newgameText = this.add
            .text(-60, 50, "New game?", {
                fontSize: "20px",
                fontFamily: "Revalia",
                align: "center",
                stroke: "#000000",
                strokeThickness: 1
            })
            .setAlign("center")
            .setOrigin(0.5, 0.5)

        this.respawnButton = new MenuButton({
            scene: this,
            x: 50,
            y: -40,
            texture: "respawnButton"
        })
        this.newGameButton = new MenuButton({
            scene: this,
            x: 50,
            y: 50,
            texture: "newgameButton"
        })
    }

    private createScoreText() {
        this.scoreText = this.add
            .text(-60, -40, "Respawn?", {
                fontSize: "20px",
                fontFamily: "Revalia",
                align: "center",
                stroke: "#000000",
                strokeThickness: 1
            })
            .setAlign("center")
            .setOrigin(0.5, 0.5)

        this.scoreNumberText = this.add
            .text(50, -40, "0", {
                fontSize: "20px",
                fontFamily: "Revalia",
                align: "center",
                stroke: "#000000",
                strokeThickness: 1
            })
            .setAlign("center")
            .setOrigin(0.5, 0.5)
            .setVisible(false)
    }

    private createKillText() {
        this.killText = this.add
            .text(-60, -10, "Kill:", {
                fontSize: "20px",
                fontFamily: "Revalia",
                align: "center",
                stroke: "#000000",
                strokeThickness: 1
            })
            .setAlign("center")
            .setOrigin(0.5, 0.5)
            .setVisible(false)

        this.killNumberText = this.add
            .text(50, -10, "0", {
                fontSize: "20px",
                fontFamily: "Revalia",
                align: "center",
                stroke: "#000000",
                strokeThickness: 1
            })
            .setAlign("center")
            .setOrigin(0.5, 0.5)
            .setVisible(false)
    }

    private createContainer() {
        this.container = this.add.container(0, 0, [
            this.background,
            this.scoreText,
            this.scoreNumberText,
            this.killText,
            this.killNumberText,
            this.newgameText,
            this.respawnButton,
            this.newGameButton
        ])
        Phaser.Display.Align.In.Center(this.container, this.zone)

        this.tweens.add({
            targets: this.container,
            scale: {
                from: 0,
                to: 1
            },
            duration: 300,
            ease: "Linear",
            onComplete: () => {
                // this.createScoreAnimation()
            }
        })
    }

    private checkGameStatus() {
        if (this.killText.visible) return

        const status = this.registry.get("status")
        const countRespawn = this.registry.get("countRespawn") || 0

        let ableToRespawn =
            status != Constants.STATUS_TIMEOUT &&
            countRespawn < Constants.MAX_NUMBER_RESPAWN

        if (!ableToRespawn) {
            this.hideRespawnButton()
            this.showScoreAndKill()
        }
    }

    private hideRespawnButton() {
        this.respawnButton.disableInteractive()
        this.respawnButton.setTint(0x2b4865)
        this.respawnButton.visible = false
    }

    private showScoreAndKill() {
        this.scoreText.setText("Score:")
        this.scoreNumberText.visible = true
        this.killText.visible = true
        this.killNumberText.visible = true

        this.createScoreAnimation()
    }
    private createScoreAnimation() {
        this.tweens.add({
            targets: [this.scoreNumberText, this.killNumberText],
            scaleX: 1.2,
            scaleY: 1.2,
            yoyo: true,
            duration: 500
        })

        let score = this.registry.get("playerScore") || 0
        let kill = this.registry.get("playerKill") || 0
        this.tweenCountScore(score, kill)
        this.emitCongrats(score, kill)
    }

    private tweenCountScore(score: number, kill: number) {
        this.tweens.addCounter({
            from: 0,
            to: score,
            duration: 1000,
            onUpdate: (tween) => {
                this.scoreNumberText.setText(
                    Math.floor(tween.getValue()).toString()
                )
            }
        })
        this.tweens.addCounter({
            from: 0,
            to: kill,
            duration: 1000,
            onUpdate: (tween) => {
                this.killNumberText.setText(
                    Math.floor(tween.getValue()).toString()
                )
            }
        })
    }

    private emitCongrats(score: number, highScore: number) {
        this.time.delayedCall(1250, () => {
            this.emitFirework()
        })
    }

    private emitFirework() {
        const firework = this.add.particles("flares").createEmitter({
            alpha: { start: 1, end: 0, ease: "Cubic.easeIn" },
            angle: { start: 0, end: 360, steps: 100 },
            blendMode: "ADD",
            frame: {
                frames: ["red", "yellow", "green", "blue"],
                cycle: true,
                quantity: 500
            },
            frequency: 2000,
            gravityY: 300,
            lifespan: 1000,
            quantity: 500,
            reserve: 500,
            scale: { min: 0.025, max: 0.075 },
            speed: { min: 300, max: 600 },
            x: 300,
            y: 300
        })

        this.time.addEvent({
            delay: 1000,
            repeat: -1,
            callback: () => {
                const x = Phaser.Math.Between(50, this.sys.canvas.width)
                const y = Phaser.Math.Between(50, this.sys.canvas.height)
                firework.setPosition(x, y)
            }
        })
    }

    private inputHandler() {
        this.respawnButton.onClick(this.restartFunction)

        this.newGameButton.onClick(this.exitFunction)
    }

    private restartFunction = () => {
        this.respawnButton.setScale(1)
        // this.sound.play("click")
        this.tweens.add({
            targets: this.container,
            scale: {
                from: 1,
                to: 0
            },
            duration: 250,
            ease: "Linear",
            onComplete: () => {
                this.increaseCountRespawm()
                this.scene.stop()
                this.scene
                    .get(Constants.GAME_SCENE)
                    .events.emit(Constants.EVENT_PLAYER_RESPAWN)
                this.scene.resume(Constants.GAME_SCENE)
            }
        })
    }

    private exitFunction = () => {
        this.newGameButton.setScale(1)
        // this.sound.play("click")
        this.tweens.add({
            targets: this.container,
            scale: {
                from: 1,
                to: 0
            },
            duration: 250,
            ease: "Linear",
            onComplete: () => {
                this.removeSceneEvents()
                this.resetGlobalData()
                this.scene.get(Constants.GAME_SCENE).scene.stop()
                this.scene.get(Constants.HUD_SCENE).scene.stop()

                this.scene.start(Constants.MATCHING_SCENE)
                this.scene.stop()
            },
            delay: 100
        })
    }

    private increaseCountRespawm() {
        let countRespawn = this.registry.get("countRespawn") || 0
        this.registry.set("countRespawn", countRespawn + 1)
    }

    private removeSceneEvents() {
        const gameScene = this.scene.get(Constants.GAME_SCENE)
        const gameSceneEvents = Constants.GAME_SCENE_EVENTS

        for (const event of gameSceneEvents) {
            gameScene.events.off(event)
        }
    }

    private resetGlobalData() {
        this.registry.set("time", Constants.TIME_PER_MATCH)
        this.registry.set("playerKill", 0)
        this.registry.set("playerScore", 0)
        this.registry.set("countRespawn", 0)
        this.registry.set("status", Constants.STATUS_PLAYING)
    }

    update(time: number, delta: number): void {
        this.checkGameStatus()
    }
}
