import { Player } from "../objects/fish/Player"
import { Constants } from "../helpers/Contants"
import { SprintButton } from "../objects/buttons/SprintButton"
import { Joystick } from "../objects/joystick/Joystick"
import { Collectible } from "../objects/collectibles/Collectible"
import { Enemy } from "../objects/fish/enemy/Enemy"
import { Fish } from "../objects/fish/Fish"
import { WeaponBody } from "../objects/weapons/WeaponBody"
import { NoobEnemy } from "../objects/fish/enemy/NoobEnemy"
import { CollectEnemy } from "../objects/fish/enemy/CollectEnemy"
import { HunterEnemy } from "../objects/fish/enemy/HunterEnemy"
import { ChasingEnemy } from "../objects/fish/enemy/ChasingEnemy"

export class GameScene extends Phaser.Scene {
    private background: Phaser.GameObjects.TileSprite
    private player: Player
    private joystick: Joystick
    private sprintButton: SprintButton

    private enemies: Phaser.GameObjects.Group
    private fishes: Phaser.GameObjects.Group
    private collectibles: Phaser.GameObjects.Group

    private minimap: Phaser.Cameras.Scene2D.Camera

    constructor() {
        super({
            key: "GameScene"
        })
    }

    create() {
        this.createBackground()

        this.createMinimap()

        this.createGameButtons()

        this.createGameObjects()

        this.createColliders()

        this.createCamera()

        this.inputHandler()

        this.eventListener()
    }

    update(time: number, delta: number): void {
        this.player.update()
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

        this.ignoreFromMinimap()
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
                texture: "meat2"
            })

            this.collectibles.add(newCollectible)
        }
    }

    private createEnemies() {
        this.enemies = this.add.group({
            /*classType: Enemy*/
            runChildUpdate: true
        })

        const width = Constants.GAMEWORLD_WIDTH
        const height = Constants.GAMEWORLD_HEIGHT
        const fishes = Constants.FISH_TEXTTURE_KEY

        for (let i = 0; i < 12; i++) {
            let x = Phaser.Math.Between(70, width - 70)
            let y = Phaser.Math.Between(70, height - 70)

            let texture = fishes[Math.floor(Math.random() * fishes.length)]
            this.generateEnemy(x, y, texture)
        }
    }

    private createMinimap() {
        this.minimap = this.cameras
            .add(10, 10, 150, 100)
            .setZoom(0.18)
            .setName("mini")

        this.minimap.setBounds(
            0,
            0,
            this.background.width,
            this.background.height
        )
    }

    private ignoreFromMinimap() {
        this.minimap.startFollow(this.player)

        this.minimap.ignore(this.joystick.getIgnoreObjects())
        this.minimap.ignore(this.sprintButton)
        this.minimap.ignore(this.player.getIgnoreObjects())
        this.minimap.ignore(this.collectibles)
    }

    private generateEnemy = (x: number, y: number, texture: string) => {
        let type = Math.random()
        if (type < 0.2) {
            this.addNoobEnemy(x, y, texture)
        } else if (type < 0.5) {
            this.addCollectEnemy(x, y, texture)
        } else if (type < 0.9) {
            this.addChasingEnemy(x, y, texture)
        } else if (type <= 1) {
            this.addHunterEnemy(x, y, texture)
        }
    }

    private addCollectEnemy(x: number, y: number, texture: string) {
        const enemy = new CollectEnemy(
            {
                scene: this,
                x: x,
                y: y,
                texture: texture
            },
            this.collectibles
        )
        enemy.angle = Phaser.Math.Between(-180, 180)
        // enemy.setTintFill(0xef5b0c)

        this.addEnemyCollider(enemy)
    }

    private addHunterEnemy(x: number, y: number, texture: string) {
        const enemy = new HunterEnemy(
            {
                scene: this,
                x: x,
                y: y,
                texture: texture
            },
            this.player
        )
        enemy.angle = Phaser.Math.Between(-180, 180)
        // enemy.setTintFill(0xffffff)

        this.addEnemyCollider(enemy)
    }

    private addChasingEnemy(x: number, y: number, texture: string) {
        const enemy = new ChasingEnemy(
            {
                scene: this,
                x: x,
                y: y,
                texture: texture
            },
            this.fishes
        )
        enemy.angle = Phaser.Math.Between(-180, 180)
        // enemy.setTintFill(0xb93160)

        this.addEnemyCollider(enemy)
    }

    private addNoobEnemy(x: number, y: number, texture: string) {
        const enemy = new NoobEnemy({
            scene: this,
            x: x,
            y: y,
            texture: texture
        })
        enemy.angle = Phaser.Math.Between(-180, 180)

        this.addEnemyCollider(enemy)
    }

    private addEnemyCollider = (enemy: Enemy) => {
        this.physics.add.overlap(
            enemy.getWeapon(),
            this.player,
            this.weaponHitFish,
            undefined,
            this
        )

        this.physics.add.overlap(
            enemy.getWeapon(),
            this.enemies,
            this.weaponHitFish,
            undefined,
            this
        )

        this.enemies.add(enemy)
        this.fishes.add(enemy)

        this.minimap.ignore(enemy.getIgnoreObjects())
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
        this.events.on(Constants.EVENT_PLAYER_RESPAWN, () => {
            this.player.fishRespawn()
            this.physics.add.overlap(
                this.player.getWeapon(),
                this.enemies,
                this.weaponHitFish,
                undefined,
                this
            )
        })
    }

    private spawnEnemy() {
        const width = Constants.GAMEWORLD_WIDTH
        const height = Constants.GAMEWORLD_HEIGHT
        const fishes = Constants.FISH_TEXTTURE_KEY

        let playerX = this.player.x
        let playerY = this.player.y

        let x = Phaser.Math.Between(70, width - 70)
        let y = Phaser.Math.Between(70, height - 70)

        let distance = Math.sqrt(
            Math.pow(playerX - x, 2) + Math.pow(playerY - y, 2)
        )

        while (distance < 500) {
            x = Phaser.Math.Between(70, width - 70)
            y = Phaser.Math.Between(70, height - 70)
            distance = Math.sqrt(
                Math.pow(playerX - x, 2) + Math.pow(playerY - y, 2)
            )
        }

        let texture = fishes[Math.floor(Math.random() * fishes.length)]

        this.generateEnemy(x, y, texture)
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
            this.enemies,
            this.collectibles,
            this.enemyHitCollectible,
            undefined,
            this
        )

        this.physics.add.overlap(
            this.player.getWeapon(),
            this.enemies,
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
        this.fishes = this.add.group({
            runChildUpdate: true
        })
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

        this.fishes.add(this.player)
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

        collectible.collect()
        player.getCollectible()
    }

    private enemyHitCollectible = (
        enemy: Phaser.Types.Physics.Arcade.GameObjectWithBody,
        collectible: Phaser.Types.Physics.Arcade.GameObjectWithBody
    ) => {
        if (!(enemy instanceof Enemy)) return
        if (!(collectible instanceof Collectible)) return

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

        if (fish == weapon.getFishOwner()) return

        weapon.hitFish()
        this.createCollectible(fish.x, fish.y)
        fish.gotHit()

        if (this.enemies.countActive() <= Constants.FISH_ALIVE) {
            this.time.delayedCall(4000, () => {
                this.spawnEnemy()
            })
        }
    }

    private createCollectible = (x: number, y: number) => {
        this.time.delayedCall(700, () => {
            const newCollectible = new Collectible({
                scene: this,
                x: x,
                y: y,
                texture: "meat"
            })

            newCollectible.disappearCollectible()

            this.collectibles.add(newCollectible)
        })
    }
}
