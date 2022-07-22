import { IWeaponConstructor } from "../../interfaces/IWeaponConstructor"
import { Fish } from "../fish/Fish"
import { FishHead } from "../fish/FishHead"
import { WeaponBody } from "./WeaponBody"

export class WeaponContainer extends Phaser.GameObjects.Container {
    private display: Phaser.GameObjects.Image
    private topPhysicsObject: WeaponBody
    private fish: Fish
    private weaponBodyGroup: WeaponBody[]

    private countFishHead: number
    private lastHeadX: number
    private weaponSize: number
    private fishHeads: Phaser.GameObjects.Group

    constructor(aParams: IWeaponConstructor) {
        super(aParams.scene, aParams.x, aParams.y)

        this.display = this.scene.add.image(0, 0, aParams.texture).setScale(0.7)

        this.add(this.display)

        this.initVaiables()
        this.fish = aParams.fish

        this.createBody()

        this.scene.add.existing(this)
    }

    private createBody() {
        const width = this.display.width
        const radius = 10

        this.topPhysicsObject = new WeaponBody({
            scene: this.scene,
            x: width * 0.6,
            y: 0,
            radius: radius,
            fillColor: undefined,
            fillAlpha: 0,
            fish: this.fish
        })

        this.scene.physics.add.existing(this.topPhysicsObject)

        this.add(this.topPhysicsObject)

        this.display.x += width * 0.35

        const body = this.topPhysicsObject.body as Phaser.Physics.Arcade.Body
        body.setCircle(20)
        body.setSize(15, 15)

        this.weaponBodyGroup.push(this.topPhysicsObject)
    }

    private initVaiables() {
        this.countFishHead = 0
        this.lastHeadX = 45
        this.weaponSize = 0.7
        this.fishHeads = this.scene.add.group({})
        this.weaponBodyGroup = []
    }

    update(x: number, y: number, rotation: number): void {
        this.x = x
        this.y = y
        this.rotation = rotation

        this.handleFishHeadRotation()
    }

    private handleFishHeadRotation() {
        this.fishHeads.children.each((head: any) => {
            head.rotate(this.angle)
        })
    }

    public getFishHead() {
        if (this.countFishHead < 3) {
            this.countFishHead += 1
            const headSize = 15 * (1 + this.weaponSize / 3.5)
            const fishHead = new FishHead({
                scene: this.scene,
                x: this.lastHeadX,
                y: 0,
                width: headSize,
                height: headSize,
                texture: "fishHead"
            })

            this.lastHeadX += 15 * (1 + this.weaponSize / 2.5)
            this.add(fishHead)
            this.fishHeads.add(fishHead)
        } else {
            this.fishHeads.clear(true, true)
            this.countFishHead = 0
            this.lastHeadX = 45 + this.display.x / 4
            if (this.weaponSize > 0.9) {
                this.lastHeadX = 45 + this.display.x * 0.8
            }
            this.upgradeWeapon()
        }
    }

    private upgradeWeapon() {
        if (this.weaponSize < 1.2) {
            this.weaponSize += 0.1
            this.display.setScale(this.weaponSize + 0.1, this.weaponSize)
            this.moveWeapon()
            this.movePhysicsBody()
            this.createNewPhysicsBody()
        }
    }

    private moveWeapon() {
        this.display.x *= 1.25
    }
    private movePhysicsBody() {
        const bodyWidth = 15 * (1 + this.weaponSize / 1.5)
        const bodyHeight = 15 * (1 + this.weaponSize / 2.5)

        this.topPhysicsObject.x =
            this.display.displayWidth * 0.4 + this.display.x

        const body = this.topPhysicsObject.body as Phaser.Physics.Arcade.Body
        body.setSize(bodyWidth, bodyHeight)
    }

    private createNewPhysicsBody() {
        let newPhysiscBody = new WeaponBody({
            scene: this.scene,
            x: this.display.displayWidth * 0.2 + this.display.x,
            y: 0,
            radius: 10,
            fillColor: undefined,
            fillAlpha: 0,
            fish: this.fish
        })

        this.scene.physics.add.existing(newPhysiscBody)

        this.add(newPhysiscBody)
        this.weaponBodyGroup.push(newPhysiscBody)

        const bodyWidth = 15 * (1 + this.weaponSize / 1.5)
        const bodyHeight = 15 * (1 + this.weaponSize / 2.5)

        const body = newPhysiscBody.body as Phaser.Physics.Arcade.Body
        body.setCircle(20)
        body.setSize(bodyWidth, bodyHeight)
    }

    public getPhysicsBodyGroup() {
        return this.weaponBodyGroup
    }

    // public reset() {
    //     this.fishHeads.clear(true, true)
    //     this.display.setScale(0.7)
    //     // this.display.x += this.width * 0.35

    //     this.weaponBodyGroup.forEach((weaponBody) => {
    //         weaponBody.destroy()
    //     })
    //     this.initVaiables()
    //     this.createBody()
    // }
}
