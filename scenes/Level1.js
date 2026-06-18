import Player from "./player.js";
import inventario from "./Inventario.js";
import { Interfaz } from "./Interfaz.js";

const Phaser = window.Phaser;

export default class Level1 extends Phaser.Scene {
  constructor() {
    super("Level1");
  }

  init() {
    this.score = 0;
  }

    // Cambiar estas cosas por nuevos assets no te olvides ok
  preload() {
    this.load.tilemapTiledJSON("map", "public/assets/tilemap/map.json");
    this.load.image("tileset", "public/assets/Texturetile.png");
    this.load.image("NPC1", "public/assets/star.png");
    this.load.image("NPC2", "public/assets/door.png");
    this.load.image("NPC3", "public/assets/ruby.png");
    this.load.image("water", "public/assets/gold.png");
    this.load.image("dude", "./public/assets/Personaje.png", {
    });
    this.load.image("enemy", "./public/assets/Enemigo.png", {
    });
  }

  create() {
    const map = this.make.tilemap({ key: "map" });
    const tileset = map.addTilesetImage("Texturetile", "tileset");
  
    const belowLayer = map.createLayer("Fondo", tileset, 0, 0);
    const platformLayer = map.createLayer("Plataformas", tileset, 0, 0);
    const objectsLayer = map.getObjectLayer("Objetos");

    const spawnPoint = map.findObject(
      "Personas",
      (obj) => obj.name === "player"
    );
    console.log("spawnPoint", spawnPoint);
  
    this.player = new Player(this, spawnPoint.x, spawnPoint.y, "dude");
    this.player.setScale(1, 1);
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    this.inventario = new inventario();
    this.enemigosGroup = this.physics.add.group();

    Interfaz(this);

    platformLayer.setCollisionByExclusion([-1]);
    platformLayer.setCollisionByProperty({ collides: true });
    this.physics.add.collider(this.player, platformLayer);

    this.NPC1 = this.physics.add.group();
    this.NPC2 = this.physics.add.group();
    this.NPC3 = this.physics.add.group();
    this.stars = this.physics.add.group();
    this.enemigosGroup = this.physics.add.group();



    objectsLayer.objects.forEach((objData) => {
      console.log(objData);
      const { x = 0, y = 0, name, type } = objData;
      switch (type) {
        case "NPC1": {
          // add star to scene
          // console.log("estrella agregada: ", x, y);
          const NPC1 = this.NPC1.create(x, y, "NPC1");
          break;
        }

        case "NPC2": {
          const NPC2 = this.NPC2.create(x, y, "NPC2");
          break;
        }
        
        case "enemy" : {
        
          const enemigonuevo = new Enemigo(this, x, y, "enemy");
          this.enemigosGroup.add(enemigonuevo);
          break;
        }



        case "water" : {

          const water = this.water.create(x, y, "water");
          break;

        }

        case "NPC3": {
          const NPC3 = this.NPC3.create(x, y, "NPC3");
          break;
        }
      }
    });

    this.physics.add.overlap(
      this.player,
      this.enemigosGroup,
      this.enemycollide,
      null,
      this
    );


    this.physics.add.collider(
      this.player,
      this.stars,
      this.collectStar,
      null,
      this
    );

    this.physics.add.collider(
      this.player,
      this.NPC3,
      this.pushnpc3,
      null,
      this
    );


    this.physics.add.collider(
      this.player,
      this.NPC2,
      this.pushnpc2,
      null,
      this
    );

    this.physics.add.collider(
      this.player,
      this.door,
      this.enterdoor,
      null,
      this
    );

  }

  update() {
    if (Phaser.Input.Keyboard.JustDown(this.keyR)) {
      console.log("Phaser.Input.Keyboard.JustDown(this.keyR)");
    }
  }

  enterdoor(player, door) {
    if (this.inventario.items.length >= 5) {
      door.disableBody(true, true); 
      this.registry.set('score', this.score);
      this.scene.start("Level2");
    }

    
  }

  pushnpc1(player, NPC1) {
    NPC1.disableBody(true, true);
    this.inventario.items.push("NPC1");
    console.log(this.inventario.items);
    this.score += 10;
    this.Interfaz.setText(`Objetos: ${this.inventario.items.length}`);
    this.Puntos.setText(`Puntos: ${this.score}`);
  }


  pushnpc3(player, NPC3) {
    NPC3.disableBody(true, true);
    this.inventario.items.push("NPC3");
    console.log(this.inventario.items);
    this.Interfaz.setText(`Objetos: ${this.inventario.items.length}`);
    this.score += 30;
    this.Puntos.setText(`Puntos: ${this.score}`);
  }


  pushnpc2(player, NPC2) {
    NPC2.disableBody(true, true);
    this.inventario.items.push("NPC2");
    console.log(this.inventario.items);
    this.Interfaz.setText(`Objetos: ${this.inventario.items.length}`);
    this.score += 10;
    this.Puntos.setText(`Puntos: ${this.score}`);

    if (this.stars.countActive(true) === 0) {
      //  A new batch of stars to collect
      this.stars.children.iterate(function (child) {
        child.enableBody(true, child.x, 0, true, true);
      });
    }
  }

  enemycollide(player, enemy) {
    this.player.vida -= 1;
    enemy.disableBody(true, true);
  }
}