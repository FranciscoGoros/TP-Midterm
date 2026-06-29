import Menu from "./scenes/menu.js";
import Level1 from "./scenes/Level1.js";
import Level2 from "./scenes/Level2.js";
import Level3 from "./scenes/Level3.js";
import GameOverScene from "./scenes/gameoverscene.js";
import VictoryScene from "./scenes/victoryscene.js";
import preload from "./scenes/preload.js";

const config = {
  type: Phaser.AUTO,
  width: 720,
  height: 720,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
      render: {
      pixelArt: true,
      antialias: false, 
      roundPixels: true,
    },

  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: {y: 0},
      debug: false,
    },
  },

  scene: [preload, Menu, Level1, Level2, Level3, GameOverScene, VictoryScene],
};

window.game = new Phaser.Game(config);