import { Fish } from "../objects/fish/Fish"

export interface IArcConstructor {
    scene: Phaser.Scene
    x: number
    y: number
    radius: number | undefined
    fillColor: number | undefined
    fillAlpha: number | undefined
    fish: Fish
}
