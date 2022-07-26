export const Constants = {
    GAMEWORLD_WIDTH: 2016,
    GAMEWORLD_HEIGHT: 1512,
    GAMESCREEN_WIDTH: 840,
    GAMESCREEN_HEIGHT: 380,
    NORMAL_SPEED: 100,
    NORMAL_BOSS_SPEED: 120,
    SPRINT_SPEED: 300,
    SPRINT_BOSS_SPEED: 300,
    STAMINA_X_POS: 220,
    STAMINA_Y_POS: 30,
    STAMINA_WIDTH: 400,
    STAMINA_HEIGHT: 20,
    STAMINA_CONSUME_QTY: 0.0025,
    INIT_ENEMY_NUMBER: 19,
    KILLING_SCORE: 50,
    GET_ITEM_SCORE: 20,
    TIME_PER_MATCH: 120,
    MAX_NUMBER_RESPAWN: 2,
    FISH_TEXTURE_KEY: [
        "blueFish",
        "yellowFish",
        "redFish",
        "greenFish",
        "purpleFish"
    ],
    FISH_HEAD_TEXTURE_KEY: [
        "fish1",
        "fish2",
        "fish3",
        "fish4",
        "fish5",
        "fish6",
        "fish7",
        "fish8",
        "fish9",
        "fish10",
        "fish11",
        "fish12",
        "fish13",
        "fish14",
        "fish15"
    ],
    WEAPON_TEXTURE_KEY: [
        "shortSword",
        "longSword",
        "spear1",
        "spear2",
        "katana1",
        "katana2",
        "katana3",
        "blade1",
        "blade2",
        "blade3",
        "flame1",
        "flame2",
        "flame3",
        "ice1",
        "ice2"
    ],
    EVENT_NEW_FISH: "newFish",
    EVENT_FISH_SCORE: "fishScore",
    EVENT_PLAYER_RESPAWN: "respawn",
    EVENT_NEW_ENEMY: "newEnemy",
    EVENT_FISH_RESPAWN_OR_LEFT: "respawnOrLeft",
    EVENT_BOSS_COMING: "bossComing",
    EVENT_ZOOM_OUT: "zoomOut",
    GAME_SCENE_EVENTS: [
        "newFish",
        "fishScore",
        "respawn",
        "newEnemy",
        "respawnOrLeft",
        "bossComing",
        "zoomIn"
    ],
    STAB_SOUND: "stab",
    GET_STAB_SOUND: "getStab",
    SWALLOW_SOUND: "swallow",
    BUBBLE_SOUND: "bubble",
    FISH_DIE_SOUND: "fishDie",
    START_GAME_SOUND: "startGameMusic",
    BOSS_COMING_SOUND: "bossComing",
    GAME_SCENE: "GameScene",
    OVER_SCENE: "OverMenu",
    START_SCENE: "StartScene",
    HUD_SCENE: "HUDScene",
    MATCHING_SCENE: "MatchingScene",
    STATUS_PLAYING: "playing",
    STATUS_WAITING: "waiting",
    STATUS_TIMEOUT: "timeout",
    SMALL_ITEM_VALUE: 0.05,
    BIG_ITEM_VALUE: 0.1,
    NOOB_ENEMY_RATE: 0.3,
    NOOB_ENEMY_RESPAWN_RATE: 0.5,
    COLLECT_ENEMY_RATE: 0.6,
    COLLECT_ENEMY_RESPAWN_RATE: 0.6,
    CHASING_ENEMY_RATE: 0.8,
    CHASING_ENEMY_RESPAWN_RATE: 0.9,
    HUNTER_ENEMY_RATE: 1,
    HUNTER_ENEMY_RESPAWN_RATE: 0.8,
    HUNTER_RANGE_INIT: 525,
    HUNTER_RANGE_MAX: 575,
    HUNTER_RANGE_STEP: 25,
    COLLECT_RANGE_INIT: 400,
    COLLECT_RANGE_MAX: 475,
    COLLECT_RANGE_STEP: 25,
    CHASING_RANGE_INIT: 300,
    CHASING_RANGE_MAX: 350,
    CHASING_RANGE_STEP: 10,
    TIME_BOSS_COMING: 45
}
