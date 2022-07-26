import { Constants } from "../../../helpers/Contants"
import { calDistance } from "../../../helpers/Distance"
import { ISpriteConstructor } from "../../../interfaces/ISpriteConstructor"
import { Fish } from "../Fish"
import { Enemy } from "./Enemy"

export class ChasingEnemy extends Enemy {
    private fishes: Phaser.GameObjects.Group
    private targetFish: Fish | undefined
    private isChasing: boolean
    private timeChasing: number

    private isRunning: boolean
    private timeRunning: number

    constructor(aParams: ISpriteConstructor, fishes: Phaser.GameObjects.Group) {
        super(aParams)
        this.fishes = fishes

        this.initChasingEnemy()
    }

    private initChasingEnemy() {
        this.isChasing = false
        this.timeChasing = 0
        this.targetFish = undefined
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

        this.findingFishes()

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

    private findingFishes() {
        let currentDistance: number
        if (this.targetFish) {
            currentDistance = calDistance(
                this.x,
                this.y,
                this.targetFish.x,
                this.targetFish.y
            )
        } else {
            currentDistance = 500
        }

        this.fishes.children.each((fish: any) => {
            if (fish != this && !this.isRunning && fish.isVulnerable()) {
                let distance = calDistance(this.x, this.y, fish.x, fish.y)

                if (distance < 300 && distance < currentDistance) {
                    this.isChasing = true
                    this.timeChasing = 3000
                    this.targetFish = fish
                    this.trackTarget()
                }
            }
        })
    }

    private chasing() {
        if (this.targetFish != undefined) {
            let distance = calDistance(
                this.x,
                this.y,
                this.targetFish.x,
                this.targetFish.y
            )

            if (distance < 50 || !this.targetFish.isVulnerable()) {
                this.isChasing = false
                this.timeChasing = 0
                this.targetFish = undefined

                this.startRunning()
            } else {
                this.trackTarget()
            }
        }
    }
    private trackTarget() {
        if (this.targetFish != undefined) {
            let angle = Phaser.Math.Angle.Between(
                this.x,
                this.y,
                this.targetFish.x,
                this.targetFish.y
            )
            this.rotation = angle
        }
    }

    private handleChasing() {
        if (this.isChasing) {
            this.timeChasing -= 15
        }
        if (this.timeChasing < 0 || !this.targetFish) {
            this.isChasing = false
            this.timeChasing = 0
        }
    }

    private handleRunning() {
        this.timeRunning -= 20
        if (this.timeRunning < 0) {
            this.isRunning = false
            this.timeRunning = 0
        }
    }

    private startRunning() {
        this.isRunning = true
        this.timeRunning = 1000

        this.angle = -this.angle
    }

    protected handleHitWorldBound() {
        if (this.x < 80) {
            let angle = Phaser.Math.Between(-50, 50)
            this.angle = angle
            this.initChasingEnemy()
        } else if (this.x > Constants.GAMEWORLD_WIDTH - 80) {
            let angle = Phaser.Math.Between(90, 180)
            this.angle = angle
            this.initChasingEnemy()
        } else if (this.y < 80) {
            let angle = Phaser.Math.Between(0, 180)
            this.angle = angle
            this.initChasingEnemy()
        } else if (this.y > Constants.GAMEWORLD_HEIGHT - 80) {
            let angle = Phaser.Math.Between(-180, 0)
            this.angle = angle
            this.initChasingEnemy()
        }
    }
}
