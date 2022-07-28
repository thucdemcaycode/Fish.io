import { Constants } from "../helpers/Contants"

export class HUDScene extends Phaser.Scene {
    private textElements: Map<string, Phaser.GameObjects.Text>

    private totalFish: number

    private rankingBoard: { [key: string]: number }
    private leaders: (string | number)[][]

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
            ["SCORE5", this.addText(790, 105, "100")]
        ])
    }

    private decorateBoard() {
        this.decorateFirstRank()
        this.decorateSecondRank()
        this.decorateThirdRank()
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

    private createVariables() {
        this.rankingBoard = {}
        this.totalFish = 0
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
        // game.events.on(Constants.EVENT_FISH_KILL_FISH, this.showFishName, this)
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

    private checkFishScore(name: string, score: number) {
        this.rankingBoard[name] = score
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

    private showFishName = (fish: string, fishKilled: string) => {
        let content = fish + " killed " + fishKilled
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
}
