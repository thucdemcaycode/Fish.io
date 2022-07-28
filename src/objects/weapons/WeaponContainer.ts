import { Constants } from "../../helpers/Contants"
import { IWeaponConstructor } from "../../interfaces/IWeaponConstructor"
import { Fish } from "../fish/Fish"
import { FishHead } from "../fish/FishHead"
import { WeaponBody } from "./WeaponBody"

export class WeaponContainer extends Phaser.GameObjects.Container {
    private display: Phaser.GameObjects.Image
    private topPhysicsObject: WeaponBody
    private fish: Fish
    private weaponBodyGroup: Phaser.GameObjects.Group

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

        this.weaponBodyGroup.add(this.topPhysicsObject)
    }

    private initVaiables() {
        this.countFishHead = 0
        this.lastHeadX = 45
        this.weaponSize = 0.7
        this.fishHeads = this.scene.add.group({})
        this.weaponBodyGroup = this.scene.add.group({ runChildUpdate: true })
    }

    update(x: number, y: number, rotation: number): void {
        this.x = x
        this.y = y
        this.rotation = rotation

        this.handleWeaponRotate(this.angle)
    }

    private handleFishHeadRotation(isFliped: boolean) {
        this.fishHeads.children.each((head: any) => {
            head.setFlipY(isFliped)
        })
    }

    private handleWeaponRotate(angle: number): void {
        const onCircle1 = angle >= -90 && angle <= 0
        const onCircle2 = angle > 0 && angle <= 90
        const onCircle3 = angle > 90 && angle <= 180
        const onCircle4 = angle >= -180 && angle < -90

        if (onCircle1 || onCircle2) {
            this.display.setFlipY(false)
            this.handleFishHeadRotation(false)
        }

        if (onCircle3 || onCircle4) {
            this.display.setFlipY(true)
            this.handleFishHeadRotation(true)
        }
    }

    public getFishHead() {
        if (this.countFishHead < 3) {
            this.countFishHead += 1
            const headSize = 15 * (1 + this.weaponSize / 3.5)

            const fishHeadKeys = Constants.FISH_HEAD_TEXTURE_KEY

            let headKey =
                fishHeadKeys[Math.floor(Math.random() * fishHeadKeys.length)]

            const fishHead = new FishHead({
                scene: this.scene,
                x: this.lastHeadX,
                y: 0,
                width: headSize,
                height: headSize,
                texture: headKey
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
            } else if (this.weaponSize > 1.1) {
                this.lastHeadX = 45 + this.display.x * 0.7
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
        this.weaponBodyGroup.add(newPhysiscBody)

        const bodyWidth = 15 * (1 + this.weaponSize / 1.5)
        const bodyHeight = 15 * (1 + this.weaponSize / 2.5)

        const body = newPhysiscBody.body as Phaser.Physics.Arcade.Body
        body.setCircle(20)
        body.setSize(bodyWidth, bodyHeight)
    }

    public getPhysicsBodyGroup() {
        return this.weaponBodyGroup
    }

    public getTextureKey() {
        return this.display.texture.key
    }
}
