import { IArcConstructor } from "../../interfaces/IArcConstructor"
import { Fish } from "../fish/Fish"

export class WeaponBody extends Phaser.GameObjects.Arc {
    private fish: Fish
    constructor(aParams: IArcConstructor) {
        super(
            aParams.scene,
            aParams.x,
            aParams.y,
            aParams.radius,
            undefined,
            undefined,
            undefined,
            aParams.fillColor,
            aParams.fillAlpha
        )
        this.fish = aParams.fish
    }

    public hitFish() {
        this.fish.killOtherFish()
    }
}
