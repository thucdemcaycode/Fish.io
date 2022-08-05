import { GameScene } from "./scenes/GameScene"
import { BootScene } from "./scenes/BootScene"
import { OverMenu } from "./scenes/OverMenu"
import { HUDScene } from "./scenes/HUDScene"
import { StartScene } from "./scenes/StartScene"
import { MatchingScene } from "./scenes/MatchingScene"

export const GameConfig: Phaser.Types.Core.GameConfig = {
    title: "Fish.io",
    version: "1.0.0",
    width: 840,
    height: 380,
    zoom: 1,
    type: Phaser.AUTO,

    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    parent: "game",
    input: {
        keyboard: true,
        mouse: true
    },
    dom: {
        createContainer: true
    },
    disableContextMenu: true,
    physics: {
        default: "arcade",
        arcade: {
            debug: false
        }
    },
    scene: [BootScene, StartScene, MatchingScene, HUDScene, GameScene, OverMenu]
}
