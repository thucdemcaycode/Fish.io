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
            this.sprintRandom()
        } else {
            this.chasing()
        }
    }

    private handleChasingItem() {
        this.collectibles.children.each((item: any) => {
            if (!this.isChasing) {
                let distance = calDistance(this.x, this.y, item.x, item.y)

                if (distance < 400) {
                    console.log(this.fishNameText.text, " Chasinggggg")
                    this.isChasing = true
                    let angle = Phaser.Math.Angle.Between(
                        this.x,
                        this.y,
                        item.x,
                        item.y
                    )
                    this.setTintFill(0xffffff)
                    this.rotation = angle + Math.PI / 2
                    this.targetPosition.push(item.x)
                    this.targetPosition.push(item.y)
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
        if (distance < 200) {
            console.log(this.fishNameText.text, "Done Chasinggggg")
            this.isChasing = false
            this.targetPosition = []
        }
    }
}
