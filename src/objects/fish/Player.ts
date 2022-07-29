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

    private weaponScale: number
    private fishScale: number

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

    public getCollectible(value: number) {
        this.updateRankingBoard(Constants.GET_ITEM_SCORE)
        this.staminaBar.rechargeStamina(value)
    }

    public gotHit(): void {
        this.scene.physics.world.disable(this)
        this.scene.physics.world.disable(this.weapon.getPhysicsBodyGroup())

        this.fishScale = this.scale
        this.weaponScale = this.weapon.scale

        this.setTimeScaleSlowMotion()

        this.scene.tweens.add({
            targets: [this, this.weapon, this.fishNameText],
            scale: { from: 1.2, to: 0.2 },
            alpha: { from: 1, to: 0.2 },
            duration: 500,
            onComplete: () => {
                this.resetTimeScale()
                this.hideFish()
                this.scene.registry.set("status", Constants.STATUS_WAITING)
                this.scene.scene.launch("OverMenu")
            }
        })
    }

    private setTimeScaleSlowMotion() {
        this.scene.tweens.timeScale = 0.5
        this.scene.physics.world.timeScale = 3
        this.scene.time.timeScale = 0.5
    }

    private resetTimeScale() {
        this.scene.tweens.timeScale = 1
        this.scene.physics.world.timeScale = 1
        this.scene.time.timeScale = 1
    }

    protected updateRankingBoard(score: number) {
        this.score += score
        this.scene.events.emit(
            Constants.EVENT_FISH_SCORE,
            this.getFishName(),
            this.score
        )

        this.updatePlayerGlobal()
    }

    private updatePlayerGlobal() {
        this.scene.registry.set("playerKill", this.numberOfKilling)
        this.scene.registry.set("playerScore", this.score)
    }

    private hideFish() {
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
        this.scene.physics.world.enable(this.weapon.getPhysicsBodyGroup())

        this.scene.tweens.add({
            targets: [this, this.weapon, this.fishNameText],
            scale: { from: 0.2, to: 0.7 },
            alpha: { from: 0.2, to: 0.5 },
            duration: 500,
            onComplete: () => {
                this.textNameRespawn()
                this.activeShield()
                this.weaponRespawn()
            }
        })
    }

    private textNameRespawn() {
        this.fishNameText.setScale(1)
        this.fishNameText.setAlpha(1)
    }

    private weaponRespawn() {
        this.weapon.setScale(this.weaponScale)
        this.weapon.setAlpha(1)
        this.setScale(this.fishScale)
    }

    public getIgnoreObjects() {
        return [this.fishNameText, this.staminaBar]
    }
}
