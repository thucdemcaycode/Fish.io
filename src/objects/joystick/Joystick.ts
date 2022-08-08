import VirtualJoyStick from "phaser3-rex-plugins/plugins/virtualjoystick"

export class Joystick extends VirtualJoyStick {
    private currentScene: Phaser.Scene
    private baseCircle: Phaser.GameObjects.Shape
    private thumbCircle: Phaser.GameObjects.Shape

    constructor(scene: Phaser.Scene) {
        const base = scene.add.circle(0, 0, 40, 0x888888, 0.5).setDepth(5)
        const thumb = scene.add.circle(0, 0, 20, 0xffffff, 0.5).setDepth(5)

        const config = {
            x: 120,
            y: 280,
            radius: 40,
            base: base,
            thumb: thumb
        }

        super(scene, config)
        this.currentScene = scene
        this.baseCircle = base
        this.thumbCircle = thumb
    }

    public onPressDown = () => {
        this.baseCircle.setAlpha(1)
        this.thumbCircle.setAlpha(1)
    }

    public offPressDown = () => {
        this.baseCircle.setAlpha(0.5)
        this.thumbCircle.setAlpha(0.5)
    }

    public getIgnoreObjects() {
        return [this.baseCircle, this.thumbCircle]
    }

    public moveToPlayerTouch(x: number, y: number) {
        this.x = x
        this.y = y
    }
}
