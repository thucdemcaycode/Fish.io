import { Constants } from "../../helpers/Contants"
import { ISpriteConstructor } from "../../interfaces/ISpriteConstructor"
import { Joystick } from "../joystick/Joystick"
import { Fish } from "./Fish"
import { StaminaBar } from "./StaminaBar"

export class Player extends Fish {
    private playingSpeed: number
    private joystick: Joystick

    private staminaBar: StaminaBar
    private bubbleSound: Phaser.Sound.BaseSound

    private weaponKey: string

    constructor(aParams: ISpriteConstructor) {
        super(aParams)

        this.initPlayer()
    }

    private initPlayer() {
        this.setFishSpeed(Constants.NORMAL_SPEED)

        this.initStaminaBar()

        this.bubbleSound = this.scene.sound.add(Constants.BUBBLE_SOUND, {
            volume: 0.5
        })
    }

    update(): void {
        this.handleJoystickInput()
        this.handleRotation()

        this.staminaControl()
        this.updateWeapon()
        this.updateShield()
        this.updateNameText()
    }

    public setPlayerName(name: string) {
        this.fishNameText.setText(name)
    }

    private initStaminaBar() {
        this.staminaBar = new StaminaBar(this.scene)
    }

    private handleJoystickInput() {
        const force = this.joystick.force

        if (force != 0) {
            this.scene.physics.velocityFromRotation(
                this.joystick.rotation,
                this.playingSpeed,
                this.body.velocity
            )
            this.rotation = this.joystick.rotation
            this.joystick.onPressDown()
        }
    }

    private setFishSpeed = (speed: number) => {
        this.playingSpeed = speed
    }

    public addJoystick(joystick: Joystick) {
        this.joystick = joystick
    }

    public sprintFish = () => {
        if (this.staminaBar.getStamina() > 0) {
            this.setFishSpeed(Constants.SPRINT_SPEED)
            this.bubbleEmitter.visible = true

            if (this.joystick.force == 0) {
                this.fishMoving()
            }

            if (!this.bubbleSound.isPlaying) {
                this.bubbleSound.play()
            }
        }
    }
    public unSprintFish = () => {
        this.setFishSpeed(Constants.NORMAL_SPEED)
        this.bubbleSound.stop()
        this.bubbleEmitter.visible = false
        if (this.joystick.force == 0) {
            this.fishMoving()
        }
    }

    private fishMoving() {
        this.scene.physics.velocityFromRotation(
            this.rotation,
            this.playingSpeed,
            this.body.velocity
        )
    }

    private staminaControl() {
        if (
            this.playingSpeed != Constants.NORMAL_SPEED &&
            this.staminaBar.stamina != 0
        ) {
            this.staminaBar.consumeStamina()
        } else if (this.playingSpeed == Constants.SPRINT_SPEED) {
            this.unSprintFish()
        }
    }

    public getCollectible() {
        this.updateRankingBoard()
        this.staminaBar.rechargeStamina()
    }

    public gotHit(): void {
        this.scene.physics.world.disable(this)
        this.scene.physics.world.disable(this.weapon.getPhysicsBodyGroup())

        this.scene.tweens.add({
            targets: [this, this.weapon, this.fishNameText],
            scale: { from: 1.2, to: 0.2 },
            alpha: { from: 1, to: 0.2 },
            duration: 500,
            onComplete: () => {
                this.weaponKey = this.weapon.getTextureKey()
                this.weapon.destroy()
                this.hideFish()
                // this.scene.scene.pause()
                this.scene.scene.launch("OverMenu")
            }
        })
    }

    private hideFish() {
        this.initWeapon(this.weaponKey)
        this.fishNameText.visible = false
        this.visible = false
        this.weapon.visible = false
        this.bubbleEmitter.visible = false
    }

    public fishRespawn() {
        this.shieldImage.active = true
        this.fishNameText.visible = true
        this.visible = true
        this.weapon.visible = true
        this.scene.physics.world.enable(this)

        this.countKillFish = 0
        this.fishSize = 0.7

        this.scene.tweens.add({
            targets: [this, this.fishNameText],
            scale: { from: 0.2, to: 0.7 },
            alpha: { from: 0.2, to: 0.5 },
            duration: 500,
            onComplete: () => {
                this.textNameRespawn()
                this.activeShield()
            }
        })
    }

    private textNameRespawn() {
        this.fishNameText.setScale(1)
        this.fishNameText.setAlpha(1)
    }

    public getIgnoreObjects() {
        return [this.fishNameText, this.staminaBar]
    }
}
