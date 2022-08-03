import { Constants } from "../../../helpers/Contants"
import { calDistance } from "../../../helpers/Distance"
import { ISpriteConstructor } from "../../../interfaces/ISpriteConstructor"
import { Enemy } from "./Enemy"

export class CollectEnemy extends Enemy {
    private collectibles: Phaser.GameObjects.Group
    private isChasing: boolean
    private targetPosition: number[]

    constructor(aParams: ISpriteConstructor, items: Phaser.GameObjects.Group) {
        super(aParams)
        this.collectibles = items

        this.initCollectEnemy()
    }
    private initCollectEnemy() {
        this.isChasing = false
        this.targetPosition = []
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

        this.updateShield()
        this.updateNameText()

        this.handleHitWorldBound()

        this.handleChasingItem()

        if (!this.isChasing) {
            this.rotateRandom()
        } else {
            this.chasing()
        }
        this.sprintRandom()
    }

    private handleChasingItem() {
        this.collectibles.children.each((item: any) => {
            if (!this.isChasing && item.isCollectable) {
                let distance = calDistance(this.x, this.y, item.x, item.y)

                if (distance < 400) {
                    this.isChasing = true
                    this.targetPosition.push(item.x)
                    this.targetPosition.push(item.y)
                    this.trackTarget()
                }
            }
        })
    }
    private chasing() {
        let distance = calDistance(
            this.x,
            this.y,
            this.targetPosition[0],
            this.targetPosition[1]
        )
        if (distance < 10) {
            this.isChasing = false
            this.targetPosition = []
            this.tweenRotate(-this.angle)
        }
    }

    private trackTarget() {
        let targetRadian = Phaser.Math.Angle.Between(
            this.x,
            this.y,
            this.targetPosition[0],
            this.targetPosition[1]
        )
        this.tweenRotateRadian(targetRadian)
    }

    protected handleHitWorldBound() {
        if (this.isRotating) return

        if (this.x < 80) {
            let angle = Phaser.Math.Between(-50, 50)
            this.tweenRotate(angle)
            this.initCollectEnemy()
        } else if (this.x > Constants.GAMEWORLD_WIDTH - 80) {
            let angle = Phaser.Math.Between(90, 180)
            this.tweenRotate(angle)
            this.initCollectEnemy()
        } else if (this.y < 80) {
            let angle = Phaser.Math.Between(0, 180)
            this.tweenRotate(angle)
            this.initCollectEnemy()
        } else if (this.y > Constants.GAMEWORLD_HEIGHT - 80) {
            let angle = Phaser.Math.Between(-180, 0)
            this.tweenRotate(angle)
            this.initCollectEnemy()
        }
    }

    protected checkEnemyRespawnRate = () => {
        let rate = Math.random()
        if (rate < Constants.COLLECT_ENEMY_RESPAWN_RATE) {
            this.hideFish()
        } else {
            this.destroyFish()
        }
    }
}
