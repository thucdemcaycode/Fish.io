import { IImageConstructor } from "../../interfaces/IImageConstructor"
import { Button } from "./Button"

export class SprintButton extends Button {
    constructor(aParams: IImageConstructor) {
        super(aParams)
        this.placeButton()
    }

    private placeButton() {
        this.setAlpha(0.5)
        this.setPosition(720, 280)
        this.setDepth(5)
    }
}
