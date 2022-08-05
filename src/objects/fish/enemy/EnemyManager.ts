import { Constants } from "../../../helpers/Contants"
import { Player } from "../Player"
import { ChasingEnemy } from "./ChasingEnemy"
import { CollectEnemy } from "./CollectEnemy"
import { Enemy } from "./Enemy"
import { HunterEnemy } from "./HunterEnemy"
import { NoobEnemy } from "./NoobEnemy"

export class EnemyManager {
    private scene: Phaser.Scene

    private player: Player
    private enemies: Phaser.GameObjects.Group
    private weapons: Phaser.GameObjects.Group[]

    private fishes: Phaser.GameObjects.Group
    private collectibles: Phaser.GameObjects.Group

    constructor(
        scene: Phaser.Scene,
        collectibles: Phaser.GameObjects.Group,
        player: Player
    ) {
        this.scene = scene
        this.collectibles = collectibles
        this.player = player

        this.initVariables()

        this.createEnemies()

        this.changeEnemyName()
    }

    private initVariables() {
        this.weapons = []

        this.fishes = this.scene.add.group({ runChildUpdate: true })
        this.fishes.add(this.player)
    }

    private createEnemies() {
        this.enemies = this.scene.add.group({
            /*classType: Enemy*/
            runChildUpdate: true
        })

        const width = Constants.GAMEWORLD_WIDTH
        const height = Constants.GAMEWORLD_HEIGHT
        const fishes = Constants.FISH_TEXTURE_KEY

        for (let i = 0; i < Constants.INIT_ENEMY_NUMBER; i++) {
            let x = Phaser.Math.Between(70, width - 70)
            let y = Phaser.Math.Between(70, height - 70)

            let texture = fishes[Math.floor(Math.random() * fishes.length)]
            this.generateEnemy(x, y, texture)
        }
    }

    private changeEnemyName() {
        let enemyNames = this.scene.registry.get("enemyNames") as string[]

        this.enemies.children.each((enemy: any) => {
            let name = enemyNames.pop()
            enemy.setFishName(name)
        })
    }

    public getEnemies() {
        return this.enemies
    }
    public getFishes() {
        return this.fishes
    }
    public getWeapons() {
        return this.weapons
    }

    public countEnemyAlive() {
        return this.enemies.countActive()
    }

    private generateEnemy = (x: number, y: number, texture: string) => {
        let type = Math.random()
        if (type < Constants.NOOB_ENEMY_RATE) {
            this.addNoobEnemy(x, y, texture)
        } else if (type < Constants.COLLECT_ENEMY_RATE) {
            this.addCollectEnemy(x, y, texture)
        } else if (type < Constants.CHASING_ENEMY_RATE) {
            this.addChasingEnemy(x, y, texture)
        } else if (type <= Constants.HUNTER_ENEMY_RATE) {
            this.addHunterEnemy(x, y, texture)
        }
    }
    private addCollectEnemy(x: number, y: number, texture: string) {
        const enemy = new CollectEnemy(
            {
                scene: this.scene,
                x: x,
                y: y,
                texture: texture
            },
            this.collectibles
        )
        enemy.angle = Phaser.Math.Between(-180, 180)

        this.enemies.add(enemy)
        this.weapons.push(enemy.getWeapon())
        this.fishes.add(enemy)
        this.emitNewEnemyEvent(enemy)
    }

    private addHunterEnemy(x: number, y: number, texture: string) {
        const enemy = new HunterEnemy(
            {
                scene: this.scene,
                x: x,
                y: y,
                texture: texture
            },
            this.player
        )
        enemy.angle = Phaser.Math.Between(-180, 180)
        // enemy.setTintFill(0xffffff)

        this.enemies.add(enemy)
        this.weapons.push(enemy.getWeapon())
        this.fishes.add(enemy)
        this.emitNewEnemyEvent(enemy)
    }

    private addChasingEnemy(x: number, y: number, texture: string) {
        const enemy = new ChasingEnemy(
            {
                scene: this.scene,
                x: x,
                y: y,
                texture: texture
            },
            this.fishes
        )
        enemy.angle = Phaser.Math.Between(-180, 180)
        // enemy.setTintFill(0xb93160)

        this.enemies.add(enemy)
        this.weapons.push(enemy.getWeapon())
        this.fishes.add(enemy)
        this.emitNewEnemyEvent(enemy)
    }

    private addNoobEnemy(x: number, y: number, texture: string) {
        const enemy = new NoobEnemy({
            scene: this.scene,
            x: x,
            y: y,
            texture: texture
        })
        enemy.angle = Phaser.Math.Between(-180, 180)

        this.enemies.add(enemy)
        this.weapons.push(enemy.getWeapon())
        this.fishes.add(enemy)
        this.emitNewEnemyEvent(enemy)
    }

    public spawnEnemy() {
        const width = Constants.GAMEWORLD_WIDTH
        const height = Constants.GAMEWORLD_HEIGHT
        const fishes = Constants.FISH_TEXTURE_KEY

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

    private emitNewEnemyEvent = (enemy: Enemy) => {
        this.scene.events.emit(Constants.EVENT_NEW_ENEMY, enemy)
    }
}
