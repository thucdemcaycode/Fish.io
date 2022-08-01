import { Player } from "../objects/fish/Player"
import { Constants } from "../helpers/Contants"
import { SprintButton } from "../objects/buttons/SprintButton"
import { Joystick } from "../objects/joystick/Joystick"
import { Collectible } from "../objects/collectibles/Collectible"
import { Enemy } from "../objects/fish/enemy/Enemy"
import { Fish } from "../objects/fish/Fish"
import { WeaponBody } from "../objects/weapons/WeaponBody"
import { EnemyManager } from "../objects/fish/enemy/EnemyManager"

export class GameScene extends Phaser.Scene {
    private background: Phaser.GameObjects.TileSprite
    private player: Player
    private joystick: Joystick
    private sprintButton: SprintButton

    private enemyManager: EnemyManager
    private collectibles: Phaser.GameObjects.Group

    constructor() {
        super({
            key: "GameScene"
        })
    }

    init() {
        this.sound.play(Constants.START_GAME_SOUND, {
            volume: 0.6
        })
    }

    create() {
        this.createBackground()

        this.createGameButtons()

        this.createGameObjects()

        this.createColliders()

        this.createCamera()

        this.inputHandler()

        this.eventListener()
    }

    update(time: number, delta: number): void {
        this.player.update()
        this.updateTrackingEnemies()
    }

    private updateTrackingEnemies() {
        this.enemyManager.getEnemies().children.each((enemy: any) => {
            if (!(enemy instanceof Enemy)) return

            if (!this.cameras.main.worldView.contains(enemy.x, enemy.y)) {
                // Show rectangle object
                const centerX = this.cameras.main.worldView.centerX
                const centerY = this.cameras.main.worldView.centerY

                this.trackEnemy(centerX, centerY, enemy.x, enemy.y, enemy)
            } else {
                enemy.hideRectangle()
            }
        })
    }

    private trackEnemy(
        centerX: number,
        centerY: number,
        x: number,
        y: number,
        enemy: Enemy
    ) {
        let line = new Phaser.Geom.Line(centerX, centerY, x, y)

        let point = Phaser.Geom.Intersects.GetLineToRectangle(
            line,
            this.cameras.main.worldView
        )

        if (point.length != 0) {
            let pointX: number = point[0].x
            let pointY: number = point[0].y

            enemy.showRectangle(pointX, pointY)
        }
    }

    private createCamera() {
        this.cameras.main.setBounds(
            0,
            0,
            this.background.displayWidth,
            this.background.displayHeight
        )
        this.cameras.main.startFollow(this.player)
        // this.cameras.main.setZoom(0.5)
    }

    private createBackground() {
        const width = Constants.GAMEWORLD_WIDTH
        const height = Constants.GAMEWORLD_HEIGHT

        this.background = this.add.tileSprite(
            width / 2,
            height / 2,
            width,
            height,
            "background"
        )
    }

    private createGameButtons() {
        this.input.addPointer(1)
        this.createJoystick()
        this.createSprintButton()
    }

    private createGameObjects() {
        this.createPlayer()

        this.createCollectibles()

        this.createEnemies()
    }

    private createCollectibles() {
        this.collectibles = this.add.group({
            /*classType: Collectible*/
        })

        const width = Constants.GAMEWORLD_WIDTH
        const height = Constants.GAMEWORLD_HEIGHT

        for (let i = 0; i < 20; i++) {
            let x = Phaser.Math.Between(50, width - 50)
            let y = Phaser.Math.Between(50, height - 50)
            const newCollectible = new Collectible({
                scene: this,
                x: x,
                y: y,
                texture: "energy",
                value: Constants.SMALL_ITEM_VALUE
            })

            this.collectibles.add(newCollectible)
        }
    }

    private createEnemies() {
        this.enemyManager = new EnemyManager(
            this,
            this.collectibles,
            this.player
        )
    }

    private inputHandler() {
        this.input.keyboard.on("keydown-SPACE", () => {
            this.player.sprintFish()
            this.sprintButton.onPressDownEffect()
        })
        this.input.keyboard.on("keyup-SPACE", () => {
            this.player.unSprintFish()
            this.sprintButton.unPressDownEffect()
        })
    }

    private eventListener() {
        this.events.on(Constants.EVENT_PLAYER_RESPAWN, this.addPlayerCollider)

        this.events.on(Constants.EVENT_NEW_ENEMY, this.addNewEnemyCollider)
    }

    private createColliders() {
        this.physics.world.setBounds(
            0,
            0,
            Constants.GAMEWORLD_WIDTH,
            Constants.GAMEWORLD_HEIGHT,
            true,
            true,
            true,
            true
        )

        this.physics.add.overlap(
            this.player,
            this.collectibles,
            this.playerHitCollectible,
            undefined,
            this
        )

        this.physics.add.overlap(
            this.enemyManager.getEnemies(),
            this.collectibles,
            this.enemyHitCollectible,
            undefined,
            this
        )

        this.physics.add.overlap(
            this.player.getWeapon(),
            this.enemyManager.getEnemies(),
            this.weaponHitFish,
            undefined,
            this
        )

        const weapons = this.enemyManager.getWeapons()
        for (const weapon of weapons) {
            this.physics.add.overlap(
                weapon,
                this.player,
                this.weaponHitFish,
                undefined,
                this
            )

            this.physics.add.overlap(
                weapon,
                this.enemyManager.getEnemies(),
                this.weaponHitFish,
                undefined,
                this
            )
        }
    }

    private addNewEnemyCollider = (enemy: Enemy) => {
        this.physics.add.overlap(
            enemy.getWeapon(),
            this.player,
            this.weaponHitFish,
            undefined,
            this
        )

        this.physics.add.overlap(
            enemy.getWeapon(),
            this.enemyManager.getEnemies(),
            this.weaponHitFish,
            undefined,
            this
        )
    }

    private addPlayerCollider = () => {
        this.registry.set("status", Constants.STATUS_PLAYING)
        this.player.fishRespawn()
        this.physics.add.overlap(
            this.player.getWeapon(),
            this.enemyManager.getEnemies(),
            this.weaponHitFish,
            undefined,
            this
        )
    }

    private createJoystick() {
        this.joystick = new Joystick(this)
    }

    private createSprintButton() {
        this.sprintButton = new SprintButton({
            scene: this,
            x: 0,
            y: 0,
            texture: "sprintButton"
        })
    }

    private createPlayer() {
        const width = Constants.GAMEWORLD_WIDTH
        const height = Constants.GAMEWORLD_HEIGHT

        this.player = new Player({
            scene: this,
            x: width / 2,
            y: height / 2,
            texture: "blueFish"
        })

        this.createPlayerControl()

        const playerName = this.registry.get("playerName")

        this.player.setPlayerName(playerName)
    }

    private createPlayerControl() {
        this.player.addJoystick(this.joystick)

        this.sprintButton.onPress(this.player.sprintFish)
        this.sprintButton.unPress(this.player.unSprintFish)
    }

    private playerHitCollectible = (
        player: Phaser.Types.Physics.Arcade.GameObjectWithBody,
        collectible: Phaser.Types.Physics.Arcade.GameObjectWithBody
    ) => {
        if (!(player instanceof Player)) return
        if (!(collectible instanceof Collectible)) return

        if (!collectible.canCollect()) return

        this.sound.play(Constants.SWALLOW_SOUND, {
            volume: 0.6
        })

        player.getCollectible(collectible.getValue())
        collectible.collect()
    }

    private enemyHitCollectible = (
        enemy: Phaser.Types.Physics.Arcade.GameObjectWithBody,
        collectible: Phaser.Types.Physics.Arcade.GameObjectWithBody
    ) => {
        if (!(enemy instanceof Enemy)) return
        if (!(collectible instanceof Collectible)) return

        if (!collectible.canCollect()) return

        collectible.collect()
        enemy.getCollectible()
    }

    private weaponHitFish = (
        weapon: Phaser.Types.Physics.Arcade.GameObjectWithBody,
        fish: Phaser.Types.Physics.Arcade.GameObjectWithBody
    ) => {
        if (!(weapon instanceof WeaponBody)) return
        if (!(fish instanceof Fish)) return

        if (!fish.isVulnerable()) return

        const fishKilling = weapon.getFishOwner()

        if (fish == fishKilling) return

        this.soundWeaponHitFish(fishKilling, fish)

        this.emitEventFishKillFish(
            fishKilling.getFishName(),
            fish.getFishName()
        )

        weapon.hitFish()
        this.createCollectible(fish.x, fish.y)
        fish.gotHit()

        if (this.enemyManager.countEnemyAlive() <= Constants.FISH_ALIVE) {
            this.time.delayedCall(3000, () => {
                this.enemyManager.spawnEnemy()
            })
        }
    }

    private createCollectible = (x: number, y: number) => {
        this.time.delayedCall(300, () => {
            const meat1 = new Collectible({
                scene: this,
                x: x,
                y: y,
                texture: "meat",
                value: Constants.BIG_ITEM_VALUE
            })
            const meat2 = new Collectible({
                scene: this,
                x: x,
                y: y,
                texture: "meat2",
                value: Constants.BIG_ITEM_VALUE
            })

            this.collectibles.add(meat1)
            this.collectibles.add(meat2)
        })

        if (Math.random() > 0.4) {
            this.spawnCollectible()
        }
    }

    private spawnCollectible = () => {
        const width = Constants.GAMEWORLD_WIDTH
        const height = Constants.GAMEWORLD_HEIGHT

        let x = Phaser.Math.Between(50, width - 50)
        let y = Phaser.Math.Between(50, height - 50)
        const newCollectible = new Collectible({
            scene: this,
            x: x,
            y: y,
            texture: "energy",
            value: Constants.SMALL_ITEM_VALUE
        })

        this.collectibles.add(newCollectible)
    }

    private soundWeaponHitFish(fish: Fish, fishGetStab: Fish) {
        if (fish instanceof Player) {
            this.sound.play(Constants.STAB_SOUND)
        } else if (fishGetStab instanceof Player) {
            this.sound.play(Constants.GET_STAB_SOUND)
            this.sound.play(Constants.FISH_DIE_SOUND, {
                volume: 0.5
            })
        }
    }

    private emitEventFishKillFish = (fish: string, fishKilled: string) => {
        this.events.emit(Constants.EVENT_FISH_KILL_FISH, fish, fishKilled)
    }
}
