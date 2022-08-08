import { Constants } from "../helpers/Contants"

export class HUDScene extends Phaser.Scene {
    private textElements: Map<string, Phaser.GameObjects.Text>

    private totalFish: number

    private rankingBoard: { [key: string]: number }
    private leaders: (string | number)[][]

    private timer: Phaser.Time.TimerEvent
    private playerKill: number
    private playerScore: number

    private timeBossComing: number

    constructor() {
        super({
            key: "HUDScene"
        })
    }

    create(): void {
        this.createTexts()

        this.decorateBoard()

        this.createVariables()

        this.eventListener()

        this.createTimer()
    }

    private createTexts() {
        this.textElements = new Map([
            ["NAME1", this.addText(630, 5, "1. Top 1 server")],
            ["SCORE1", this.addText(790, 5, "500")],
            ["NAME2", this.addText(630, 30, "2. Top 1 server")],
            ["SCORE2", this.addText(790, 30, "400")],
            ["NAME3", this.addText(630, 55, "3. Top 1 server")],
            ["SCORE3", this.addText(790, 55, "300")],
            ["NAME4", this.addText(630, 80, "4. Top 1 server")],
            ["SCORE4", this.addText(790, 80, "200")],
            ["NAME5", this.addText(630, 105, "5. Top 1 server")],
            ["SCORE5", this.addText(790, 105, "100")],
            ["TIME", this.addText(80, 15, "")],
            ["KILLED", this.addText(80, 40, "Killed: 0")],
            ["SCORE", this.addText(80, 60, "Score: 0")]
        ])
    }

    private createTimer() {
        this.timer = this.time.addEvent({
            delay: 1000,
            callback: this.updateTime,
            callbackScope: this,
            loop: true
        })
    }

    private updateTime() {
        if (this.registry.values.time == 0) {
            this.gameTimeOut()
            return
        }

        this.registry.values.time -= 1
        let time = this.registry.values.time
        if (time == this.timeBossComing) {
            this.warningBossComing()
        }

        let minutes = Math.floor(time / 60)
        let seconds = time - minutes * 60
        let secondText: string
        if (seconds < 10) {
            secondText = "0" + seconds
        } else {
            secondText = seconds.toString()
        }

        this.textElements
            .get("TIME")
            ?.setText(`Time left: ${minutes}:${secondText}`)
    }

    private gameTimeOut() {
        this.timer.destroy()
        const currentStatus = this.registry.get("status")
        this.registry.set("status", "timeout")

        const gameScene = this.scene.get(Constants.GAME_SCENE)
        gameScene.scene.pause()
        this.scene.pause()

        if (currentStatus != Constants.STATUS_WAITING) {
            this.scene.launch(Constants.OVER_SCENE)
        }
    }

    private warningBossComing() {
        const currentStatus = this.registry.get("status")
        if (currentStatus == Constants.STATUS_WAITING) {
            this.timeBossComing -= 10
            return
        }

        this.sound.play(Constants.BOSS_COMING_SOUND)

        const width = this.sys.canvas.width
        const height = this.sys.canvas.height

        const textComing = this.add
            .image(width / 2, height / 2, "bossComing")
            .setOrigin(0.5, 0.5)

        const backgroundBossComing = this.add
            .image(width / 2, height / 2, "backgroundBoss")
            .setOrigin(0.5, 0.5)
            .setDisplaySize(width, height)

        this.tweens.add({
            targets: backgroundBossComing,
            alpha: 0.5,
            yoyo: true,
            duration: 500,
            repeat: 3,
            onComplete: () => {
                backgroundBossComing.destroy()
            }
        })

        this.tweens.add({
            targets: textComing,
            alpha: 0.5,
            scale: 1.2,
            yoyo: true,
            duration: 500,
            repeat: 3,
            onComplete: () => {
                textComing.destroy()
                this.emitEventBoss()
            }
        })
    }

    private emitEventBoss() {
        const gameScene = this.scene.get(Constants.GAME_SCENE)
        gameScene.events.emit(Constants.EVENT_BOSS_COMING)
    }

    private decorateBoard() {
        this.decorateFirstRank()
        this.decorateSecondRank()
        this.decorateThirdRank()
        this.decorateTimeText()
        this.decoratePlayerText()
    }

    private decorateFirstRank() {
        const firstRankName = this.textElements.get("NAME1")
        const firstRankScore = this.textElements.get("SCORE1")

        firstRankName?.setColor("#FFF80A")
        firstRankName?.setFontSize(23)
        firstRankScore?.setColor("#FFF80A")
        firstRankScore?.setFontSize(23)
    }

    private decorateSecondRank() {
        const secondRankName = this.textElements.get("NAME2")
        const secondRankScore = this.textElements.get("SCORE2")

        secondRankName?.setColor("#B2A4FF")
        secondRankName?.setFontSize(22)
        secondRankScore?.setColor("#B2A4FF")
        secondRankScore?.setFontSize(22)
    }

    private decorateThirdRank() {
        const thirdRankName = this.textElements.get("NAME3")
        const thirdRankScore = this.textElements.get("SCORE3")

        thirdRankName?.setColor("#CA955C")
        thirdRankName?.setFontSize(21)
        thirdRankScore?.setColor("#CA955C")
        thirdRankScore?.setFontSize(21)
    }

    private decorateTimeText() {
        const timeText = this.textElements.get("TIME")

        timeText?.setColor("#7DCE13")
        timeText?.setPosition(55, 15)

        let time = Constants.TIME_PER_MATCH

        let minutes = Math.floor(time / 60)
        let seconds = time - minutes * 60
        let secondText: string
        if (seconds < 10) {
            secondText = "0" + seconds
        } else {
            secondText = seconds.toString()
        }

        timeText?.setText(`Time left: ${minutes}:${secondText}`)
    }

    private decoratePlayerText() {
        const killText = this.textElements.get("KILLED")

        killText?.setColor("#F4E06D")
        killText?.setPosition(55, 40)

        const scoreText = this.textElements.get("SCORE")

        scoreText?.setColor("#F6FBF4")
        scoreText?.setPosition(55, 65)
    }

    private createVariables() {
        this.rankingBoard = {}
        this.totalFish = 0
        this.playerKill = 0
        this.playerScore = 0
        this.timeBossComing = Constants.TIME_BOSS_COMING
    }

    private addText(x: number, y: number, value: string) {
        const text = this.add.text(x, y, value, {
            fontSize: "20px",
            fontFamily: "Revalia",
            align: "center",
            stroke: "#000000",
            strokeThickness: 2
        })
        return text
    }

    private eventListener() {
        const game = this.scene.get("GameScene")

        game.events.on(Constants.EVENT_NEW_FISH, this.addNewFish, this)
        game.events.on(Constants.EVENT_FISH_SCORE, this.checkFishScore, this)

        // game.events.on(
        //     Constants.EVENT_FISH_RESPAWN_OR_LEFT,
        //     this.showFishName,
        //     this
        // )
    }

    private addNewFish(name: string, score: number) {
        this.rankingBoard[name] = score
        this.totalFish += 1

        if (this.totalFish == 5) {
            this.initBoard()
        }
    }

    private initBoard() {
        let fishes: (string | number)[][] = Object.keys(this.rankingBoard).map(
            (key: string) => {
                return [key, this.rankingBoard[key]]
            }
        )
        fishes.sort(function (first: any, second: any) {
            return second[1] - first[1]
        })

        if (fishes.length < 5) return

        this.leaders = fishes

        for (let i = 0; i < 5; i++) {
            const name = "NAME" + (i + 1)
            const score = "SCORE" + (i + 1)
            // @ts-ignore
            this.textElements.get(name).setText(fishes[i][0])
            // @ts-ignore
            this.textElements.get(score).setText(fishes[i][1])
        }
    }

    private updatePlayerText() {
        let currentKill = this.registry.get("playerKill")
        if (currentKill != this.playerKill) {
            this.textElements.get("KILLED")?.setText(`Killed: ${currentKill}`)
            this.playerKill = currentKill
        }

        let currentScore = this.registry.get("playerScore")
        if (currentScore != this.playerScore) {
            this.textElements.get("SCORE")?.setText(`Score: ${currentScore}`)
            this.playerScore = currentScore
        }
    }

    private checkFishScore(name: string, score: number) {
        this.rankingBoard[name] = score
        if (!this.leaders || this.leaders.length < 5) {
            return
        }
        if (score > this.leaders[4][1]) {
            this.updateBoard()
        }
    }

    private updateBoard() {
        let fishes: (string | number)[][] = Object.keys(this.rankingBoard).map(
            (key: string) => {
                return [key, this.rankingBoard[key]]
            }
        )
        fishes.sort(function (first: any, second: any) {
            return second[1] - first[1]
        })

        this.leaders = fishes

        for (let i = 0; i < 5; i++) {
            const name = "NAME" + (i + 1)
            const textName = i + 1 + ". " + fishes[i][0]
            const score = "SCORE" + (i + 1)
            const scoreText = fishes[i][1]

            // @ts-ignore
            this.textElements.get(name).setText(textName)
            // @ts-ignore
            this.textElements.get(score).setText(scoreText)
        }
    }

    private showFishName = (content: string) => {
        const text = this.add.text(635, 200, content, {
            fontSize: "15px",
            fontFamily: "Revalia",
            align: "center",
            stroke: "#000000",
            strokeThickness: 2
        })

        this.tweens.add({
            targets: text,
            alpha: { from: 1, to: 0.5 },
            y: 140,
            duration: 1500,
            ease: "Power0",
            yoyo: false,
            onComplete: () => {
                text.destroy()
            }
        })
    }

    update(time: number, delta: number): void {
        this.updatePlayerText()
    }
}
