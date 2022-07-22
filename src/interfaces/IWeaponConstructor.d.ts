import { Fish } from "../objects/fish/Fish"

export interface IWeaponConstructor {
    scene: Phaser.Scene
    x: number
    y: number
    texture: string
    frame?: string | number
    fish: Fish
}
