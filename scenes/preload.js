
import Menu from "./menu.js";

const Phaser = window.Phaser;

export default class Preloader extends Phaser.Scene {
  constructor() {
    super("preload");
  }

  preload() {
    this.load.tilemapTiledJSON("map_level1", "public/assets/tilemap/map_level1.json");
    this.load.tilemapTiledJSON("map_level2", "public/assets/tilemap/map_level2.json");
    this.load.tilemapTiledJSON("map_level3", "public/assets/tilemap/map_level3.json");

    this.load.image("tileset", "public/assets/Texturetile.png");
    this.load.image("NPC1", "public/assets/npc1.png");
    this.load.image("NPC2", "public/assets/npc2.png");
    this.load.image("NPC3", "public/assets/npc3.png");
    this.load.image("water", "public/assets/water.png");
    this.load.image("player", "public/assets/playersprite.png");
    this.load.image("enemy", "public/assets/enemigo.png");
    this.load.image("alerta", "public/assets/alert.png");
    this.load.image("ray", "public/assets/ray.png");
    this.load.image("hidrante", "public/assets/itemPuntos.png");
    this.load.image("ceniza", "public/assets/Ceniza.png");
    this.load.image("lava", "public/assets/lava.png");
  }

  create() {
    this.scene.start("Menu");
  }
}