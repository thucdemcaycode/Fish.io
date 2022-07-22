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

export class GameScene extends Phaser.Scene {
    private background: Phaser.GameObjects.TileSprite
    private player: Player
    private joystick: Joystick
    private sprintButton: SprintButton

    private enemies: Phaser.GameObjects.Group
    private collectibles: Phaser.GameObjects.Group

    constructor() {
        super({
            key: "GameScene"
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

            this.addNoobEnemy(x, y, texture)

            // let type = Phaser.Math.Between(1, 2)
            // switch (type) {
            //     case 1:
            //         this.addNoobEnemy(x, y, texture)
            //         break
            //     case 2:
            //         this.addCollectEnemy(x, y, texture)
            //         break
            // }
        }
    }

    private addCollectEnemy(x: number, y: number, texture: string) {
        const enemy = new CollectEnemy(
            {
                scene: this,
                x: this.player.x,
                y: this.player.y,
                texture: texture
            },
            this.collectibles
        )
        enemy.angle = Phaser.Math.Between(-180, 180)

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
    }
    private addNoobEnemy(x: number, y: number, texture: string) {
        const enemy = new NoobEnemy({
            scene: this,
            x: x,
            y: y,
            texture: texture
        })
        enemy.angle = Phaser.Math.Between(-180, 180)

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
        this.events.on("resume", () => {
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

        let textute = fishes[Math.floor(Math.random() * fishes.length)]

        const enemy = new NoobEnemy({
            scene: this,
            x: x,
            y: y,
            texture: textute
        })
        enemy.angle = Phaser.Math.Between(-180, 180)

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
        const width = Constants.GAMEWORLD_WIDTH
        const height = Constants.GAMEWORLD_HEIGHT

        this.player = new Player({
            scene: this,
            x: width / 2,
            y: height / 2,
            texture: "blueFish"
        })

        this.createPlayerControl()

        this.player.setPlayerName("Phucdepzai")
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
