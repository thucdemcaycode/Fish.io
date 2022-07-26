import { Constants } from "../../../helpers/Contants"
import { calDistance } from "../../../helpers/Distance"
import { ISpriteConstructor } from "../../../interfaces/ISpriteConstructor"
import { Fish } from "../Fish"
import { Enemy } from "./Enemy"

export class HunterEnemy extends Enemy {
    private player: Fish
    private isChasing: boolean
    private timeChasing: number
    private isRunning: boolean
    private timeRunning: number

    constructor(aParams: ISpriteConstructor, player: Fish) {
        super(aParams)
        this.player = player

        this.initRangeChasing()

        this.initHunterPlayer()
    }

    private initRangeChasing() {
        this.rangeChasing = Constants.HUNTER_RANGE_INIT
    }

    private initHunterPlayer() {
        this.isChasing = false
        this.timeChasing = 0
        this.isRunning = false
        this.timeRunning = 0
    }

    update(): void {
        this.scene.physics.velocityFromRotation(
            this.rotation,
            this.playingSpeed,
            this.body.velocity
        )
        this.handleRotation()
        this.handleSprint()

        this.updateWeapon()

        this.handleHitWorldBound()

        this.findingPlayer()

        if (!this.isChasing) {
            this.rotateRandom()
        } else {
            this.chasing()
            this.handleChasing()
        }

        if (this.isRunning) {
            this.handleRunning()
        }

        this.sprintRandom()
        this.updateShield()
        this.updateNameText()
    }

    private findingPlayer() {
        if (!this.isChasing && !this.isRunning) {
            let distance = calDistance(
                this.x,
                this.y,
                this.player.x,
                this.player.y
            )

            if (distance < this.rangeChasing && this.player.isVulnerable()) {
                this.isChasing = true
                this.timeChasing = 4000
                this.trackTarget()
            }
        }
    }

    private chasing() {
        let distance = calDistance(this.x, this.y, this.player.x, this.player.y)
        if (distance < 50) {
            this.isChasing = false
            this.timeChasing = 0
            this.startRunning()
        }
        this.trackTarget()
    }
    private trackTarget() {
        let targetRadian = Phaser.Math.Angle.Between(
            this.x,
            this.y,
            this.player.x,
            this.player.y
        )
        this.tweenRotateRadian(targetRadian)
    }

    private handleChasing() {
        if (this.isChasing) {
            this.timeChasing -= 15
        }
        if (this.timeChasing < 0) {
            this.isChasing = false
            this.timeChasing = 0
            this.startRunning()
        }
    }

    private startRunning() {
        this.isRunning = true
        this.timeRunning = 10000

        let targetRadian = Phaser.Math.Angle.Between(
            this.x,
            this.y,
            this.player.x,
            this.player.y
        )
        this.tweenRotateRadian(-targetRadian)
    }

    private handleRunning() {
        this.timeRunning -= 15
        this.startRunning()
        if (this.timeRunning < 0) {
            this.isRunning = false
            this.timeRunning = 0
        }
    }

    protected handleHitWorldBound() {
        if (this.isRotating) return

        if (this.x < 80) {
            let angle = Phaser.Math.Between(-50, 50)
            this.tweenRotate(angle)
            this.initHunterPlayer()
        } else if (this.x > Constants.GAMEWORLD_WIDTH - 80) {
            let angle = Phaser.Math.Between(90, 180)
            this.tweenRotate(angle)
            this.initHunterPlayer()
        } else if (this.y < 80) {
            let angle = Phaser.Math.Between(0, 180)
            this.tweenRotate(angle)
            this.initHunterPlayer()
        } else if (this.y > Constants.GAMEWORLD_HEIGHT - 80) {
            let angle = Phaser.Math.Between(-180, 0)
            this.tweenRotate(angle)
            this.initHunterPlayer()
        }
    }

    protected checkEnemyRespawnRate = () => {
        let rate = Math.random()
        if (rate < Constants.HUNTER_ENEMY_RESPAWN_RATE) {
            this.hideFish()
        } else {
            this.destroyFish()
        }

        this.initHunterPlayer()
    }

    protected levelUp() {
        if (this.rangeChasing < Constants.HUNTER_RANGE_MAX) {
            this.rangeChasing += Constants.HUNTER_RANGE_STEP
        }
    }
}
