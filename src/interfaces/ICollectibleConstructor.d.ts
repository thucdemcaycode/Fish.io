export interface ICollectibleConstructor {
    scene: Phaser.Scene
    x: number
    y: number
    texture: string
    value: number
    frame?: string | number
}
