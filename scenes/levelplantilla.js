import Player from "./player.js";
import inventario from "./Inventario.js";
import { Interfaz } from "./Interfaz.js";
import { setupPointsSystem } from "./pointsSystem.js";

const Phaser = window.Phaser;

class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setScale(1, 1);
    this.setDepth(2);
    this.body.setAllowGravity(false);
    this.body.setCollideWorldBounds(true);
    this.body.setBounce(0, 0);
    this.body.setImmovable(true);
    this.speed = 80;
    this.direction = 1;
    this.setVelocityX(this.speed * this.direction);
    this.flipX = false;

    this.moveEvent = scene.time.addEvent({
      delay: 2000,
      callback: this.toggleDirection,
      callbackScope: this,
      loop: true,
    });
  }

  toggleDirection() {
    this.direction *= -1;
    this.setVelocityX(this.speed * this.direction);
    this.setFlipX(this.direction < 0);
  }
}

export default class NivelBase extends Phaser.Scene {
  constructor(key) {
    super(key); 
  }

  init(data) {
    this.points = data?.points || 0;
    this.score = this.points;
    this.savedPeopleTotal = data?.savedPeopleTotal || 0;
    this.pushedToWaterCount = 0;
    this.timeRemaining = 90;
  }

  crearNivel(mapKey) {
    const map = this.make.tilemap({ key: mapKey });
    const tileset = map.addTilesetImage("Texturetile", "tileset");
    const belowLayer = map.createLayer("Fondo", tileset, 0, 0).setDepth(0);
    const waterLayer = map.createLayer("Agua", tileset, 0, 0).setDepth(0);
    const lavalayer = map.createLayer("Lava", tileset, 0, 0).setDepth(0);
    this.waterLayer = waterLayer;
    this.lavaLayer = lavalayer;
    const platformLayer = map.createLayer("Paredes", tileset, 0, 0).setDepth(2);
    const objectsLayer = map.getObjectLayer("Objetos");

    const spawnPoint = map.findObject("Objetos", (obj) => obj.name === "player");
    
    this.player = new Player(this, spawnPoint.x, spawnPoint.y, "player");
    this.player.setScale(1, 1);
    this.player.vida = 3;
    this.player.lastEnemyHitAt = 0;
    
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    this.inventario = new inventario();
    this.inventario.items = [];
    setupPointsSystem(this);
    Interfaz(this);

    this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.timeRemaining = Math.max(0, this.timeRemaining - 1);
        this.updateHud();

        if (this.timeRemaining === 0) {
          this.scene.start("GameOverScene", {
            score: this.points,
            points: this.points,
            savedPeopleTotal: this.savedPeopleTotal,
            currentLevel: this.sys.settings.key,
          });
        }
      },
      loop: true,
    });

    platformLayer.setCollisionByExclusion([-1]);
    platformLayer.setCollisionByProperty({ collides: true });
    this.physics.add.collider(this.player, platformLayer);

    this.NPC1 = this.physics.add.group();
    this.NPC2 = this.physics.add.group();
    this.NPC3 = this.physics.add.group();
    this.stars = this.physics.add.group();
    this.enemigosGroup = this.physics.add.group();
    this.water = this.physics.add.group();
    this.lava = this.physics.add.group();
    this.itemPuntos = this.physics.add.group();
    this.itemDaño = this.physics.add.group();
    this.door = this.physics.add.group();
    this.check = 0
    objectsLayer.objects.forEach((objData) => {
      const { x = 0, y = 0, name, type } = objData;
      switch (type) {
        case "NPC1": {
          const npc = this.NPC1.create(x, y, "NPC1").setDepth(2);
          this.setupPushableNpc(npc);
          break;
        }
        case "NPC2": {
          const npc = this.NPC2.create(x, y, "NPC2").setDepth(2);
          this.setupPushableNpc(npc);
          break;
        }
        case "NPC3": {
          const npc = this.NPC3.create(x, y, "NPC3").setDepth(2);
          this.setupPushableNpc(npc);
          break;
        }
        case "water": this.water.create(x, y, "water").setDepth(1); break;
        case "lava": this.lava.create(x, y, "lava").setDepth(1); break;
        case "itemPuntos": {
          const itemPuntos = this.itemPuntos.create(x, y, "hidrante").setDepth(2);
          this.physics.add.existing(itemPuntos);
          itemPuntos.body.setAllowGravity(false);
          itemPuntos.body.setImmovable(true);
          this.itemPuntos.add(itemPuntos);
          break;
        }
        case "itemDaño": {
          const itemDaño = this.itemDaño.create(x, y, "ceniza").setDepth(2);
          this.physics.add.existing(itemDaño);
          itemDaño.body.setAllowGravity(false);
          itemDaño.body.setImmovable(true);
          this.itemDaño.add(itemDaño);
          break;
        }
        case "enemy": 
          const enemigonuevo = new Enemy(this, x, y, "enemy");
          this.enemigosGroup.add(enemigonuevo);
          break;
      }
    });

    this.physics.add.collider(this.NPC1, platformLayer);
    this.physics.add.collider(this.NPC2, platformLayer);
    this.physics.add.collider(this.NPC3, platformLayer);
    this.physics.add.collider(this.enemigosGroup, platformLayer);

    this.physics.add.overlap(this.player, this.enemigosGroup, this.enemycollide, null, this);
    this.physics.add.collider(this.player, this.NPC1, this.handleNpcPush, null, this);
    this.physics.add.collider(this.player, this.NPC3, this.handleNpcPush, null, this);
    this.physics.add.collider(this.player, this.NPC2, this.handleNpcPush, null, this);
    this.physics.add.collider(this.player, this.door, this.enterdoor, null, this);
    this.physics.add.overlap(this.player, this.itemPuntos, this.collectItem, null, this);
    this.physics.add.overlap(this.player, this.itemDaño, this.hitBadCollectible, null, this);
    this.physics.add.overlap(this.player, this.lava, this.hitLava, null, this);
    this.physics.add.overlap(this.NPC1, this.lava, this.npcEnterLava, null, this);
    this.physics.add.overlap(this.NPC2, this.lava, this.npcEnterLava, null, this);
    this.physics.add.overlap(this.NPC3, this.lava, this.npcEnterLava, null, this);

    this.npcAlertGroupIndex = 0;
    this.time.addEvent({
      delay: 15000,
      callback: () => this.spawnNpcAlert(),
      loop: true,
    });
  }

  update() {
    if (this.check == 3) {
      this.scene.restart();
    }

    if (Phaser.Input.Keyboard.JustDown(this.keyR)) {
      console.log("Reiniciando o acción R...");
    }

    if (this.syncHudWithCamera) {
      this.syncHudWithCamera();
    }

    this.checkNpcsInWater(this.NPC1);
    this.checkNpcsInWater(this.NPC2);
    this.checkNpcsInWater(this.NPC3);
    this.checkNpcsInLava(this.NPC1);
    this.checkNpcsInLava(this.NPC2);
    this.checkNpcsInLava(this.NPC3);
    this.checkPlayerInLava();
  }

  setupPushableNpc(npc) {
      npc.inWater = false;
    if (!npc || !npc.body) {
      return;
    }

    npc.body.setCollideWorldBounds(true);
    npc.body.setBounce(0, 0);
    npc.body.setDrag(900, 900);
    npc.body.setMaxVelocity(300, 300);
    npc.body.setImmovable(false);
    npc.pushable = true;
    npc.collected = false;
  }

  handleNpcPush(player, npc) {
    if (!npc || !npc.body || !player || !player.body) {
      return;
    }

    const velocityX = player.body.velocity.x;
    const velocityY = player.body.velocity.y;
    if (Math.abs(velocityX) < 20 && Math.abs(velocityY) < 20) {
      return;
    }

    npc.body.setVelocity(velocityX * 1.5, velocityY * 1.5);

    if (npc.texture && npc.texture.key === "NPC3" && !npc.collected) {
      npc.collected = true;
      this.inventario.items.push("NPC3");
      if (this.addPoints) {
        this.addPoints(30);
      } else {
        this.points += 30;
      }
      this.score = this.points;
    }
  }

  collectItem(player, itemPuntos) {
    if (!itemPuntos || !itemPuntos.active) {
      return;
    }

    if (itemPuntos.disableBody) {
      itemPuntos.disableBody(true, true);
    } else if (itemPuntos.destroy) {
      itemPuntos.destroy();
    }

    if (this.addPoints) {
      this.addPoints(10);
    } else {
      this.points += 10;
    }
    this.score = this.points;
  }

  hitBadCollectible(player, itemDaño) {
    if (!itemDaño || !itemDaño.active) {
      return;
    }

    if (itemDaño.disableBody) {
      itemDaño.disableBody(true, true);
    } else if (itemDaño.destroy) {
      itemDaño.destroy();
    }

    if (this.addPoints) {
      this.addPoints(-5);
    } else {
      this.points = Math.max(0, (this.points || 0) - 5);
    }

    if (player && player.vida != null) {
      player.vida = Math.max(0, player.vida - 1);
    }

    this.score = this.points;
    if (this.updateHud) {
      this.updateHud();
    }

    if (player && player.vida <= 0) {
      this.scene.start("GameOverScene", {
        score: this.points,
        points: this.points,
        savedPeopleTotal: this.savedPeopleTotal,
        currentLevel: this.sys.settings.key,
      });
      return;
    }
  }

  hitLava(player, lava) {
    if (player && player.vida != null) {
      player.vida = 0;
    }
    if (this.addPoints) {
      this.addPoints(-10);
    } else {
      this.points = Math.max(0, (this.points || 0) - 10);
    }

    if (this.updateHud) {
      this.updateHud();
    }

    if (player && player.vida <= 0) {
      this.scene.start("GameOverScene", {
        score: this.points,
        points: this.points,
        savedPeopleTotal: this.savedPeopleTotal,
        currentLevel: this.sys.settings.key,
      });
    }
  }

  npcEnterLava(npc, lava) {
    if (!npc || npc.inWater || !npc.active) return;

    if (npc.disableBody) {
      npc.disableBody(true, true);
    } else if (npc.destroy) {
      npc.destroy();
    }

    if (this.addPoints) {
      this.addPoints(-10);
    } else {
      this.points = Math.max(0, (this.points || 0) - 10);
    }
    this.score = this.points;
    if (this.updateHud) {
      this.updateHud();
    }
  }

  npcEnterWater(npc) {
    if (!npc || npc.inWater) return;
    npc.inWater = true;

    if (npc.disableBody) {
      npc.disableBody(true, true);
    } else if (npc.destroy) {
      npc.destroy();
    }

    this.pushedToWaterCount = (this.pushedToWaterCount || 0) + 1;
    this.savedPeopleTotal = (this.savedPeopleTotal || 0) + 1;
    if (this.addPoints) {
      this.addPoints(20);
    } else {
      this.points += 20;
    }
    this.score = this.points;
    if (this.updateHud) {
      this.updateHud();
    }

    if (this.pushedToWaterCount >= 4) {
      this.registry.set('score', this.score);

      const currentLevel = this.sys?.settings?.key;
      let nextScene = "Menu";
      if (currentLevel === "Level1") {
        nextScene = "Level2";
      } else if (currentLevel === "Level2") {
        nextScene = "Level3";
      } else if (currentLevel === "Level3") {
        nextScene = "VictoryScene";
      }

      this.scene.start(nextScene, {
        score: this.points,
        points: this.points,
        savedPeopleTotal: this.savedPeopleTotal,
        lives: this.player?.vida ?? 0,
      });
    }
  }

  checkNpcsInWater(group) {
    if (!group || !this.waterLayer) return;
    group.getChildren().forEach((npc) => {
      if (!npc || !npc.body || npc.inWater) return;
      const x = npc.body.center.x;
      const y = npc.body.center.y;
      const tile = this.waterLayer.getTileAtWorldXY(x, y);
      if (tile) {
        this.npcEnterWater(npc);
      }
    });
  }

  checkNpcsInLava(group) {
    if (!group || !this.lavaLayer) return;
    group.getChildren().forEach((npc) => {
      if (!npc || !npc.body || npc.inWater) return;
      const x = npc.body.center.x;
      const y = npc.body.center.y;
      const tile = this.lavaLayer.getTileAtWorldXY(x, y);
      if (tile) {
        this.npcEnterLava(npc, tile);
      }
    });
  }

  checkPlayerInLava() {
    if (!this.player || !this.player.body || !this.lavaLayer) return;
    const x = this.player.body.center.x;
    const y = this.player.body.center.y;
    const tile = this.lavaLayer.getTileAtWorldXY(x, y);
    if (tile) {
      this.hitLava(this.player, tile);
    }
  }

  spawnNpcAlert() {
    const groups = [this.NPC1, this.NPC2, this.NPC3].filter(
      (group) => group && group.getChildren().length > 0
    );

    if (groups.length === 0) {
      return;
    }

    const selectedGroup = groups[this.npcAlertGroupIndex % groups.length];
    this.npcAlertGroupIndex = (this.npcAlertGroupIndex + 1) % groups.length;

    const npcs = selectedGroup.getChildren().filter((npc) => npc && npc.active);
    if (npcs.length === 0) {
      return;
    }

    const npc = Phaser.Math.RND.pick(npcs);
    const alert = this.add.image(npc.x, npc.y, "alerta").setDepth(1);
    alert.setScale(2);

    this.time.delayedCall(5000, () => {
      if (alert && alert.active) {
        alert.destroy();
      }

      const ray = this.add.image(alert.x, alert.y - 355, "ray").setDepth(2);
      ray.setScale(0.8);
      const rayBounds = ray.getBounds();

      const groupsToCheck = [this.NPC1, this.NPC2, this.NPC3];
      groupsToCheck.forEach((group) => {
        if (!group) {
          return;
        }
        group.getChildren().forEach((candidateNpc) => {
          if (!candidateNpc || !candidateNpc.active) {
            return;
          }
          const npcBounds = candidateNpc.getBounds();
          if (Phaser.Geom.Intersects.RectangleToRectangle(npcBounds, rayBounds)) {
            candidateNpc.destroy();
            if (this.addPoints) {
              this.addPoints(-10);
            } else {
              this.points = Math.max(0, (this.points || 0) - 10);
            }
            this.check += 1
          }
        });
      });

      this.time.delayedCall(2000, () => {
        if (ray && ray.active) {
          ray.destroy();
        }
      });
    });
  }

  enterdoor(player, door) {
    if (this.inventario.items.length >= 5) {
      door.disableBody(true, true); 
      this.registry.set('score', this.score);
      this.scene.start("Level2"); 
    }
  }

  enemycollide(player, Enemy) {
    const now = this.time.now;
    if (player.lastEnemyHitAt && now - player.lastEnemyHitAt < 500) {
      return;
    }
    player.lastEnemyHitAt = now;

    player.vida = Math.max(0, player.vida - 1);
    if (player.vida <= 0) {
      player.isDead = true;
      this.scene.start("GameOverScene", {
        score: this.points,
        points: this.points,
        savedPeopleTotal: this.savedPeopleTotal,
        currentLevel: this.sys.settings.key,
      });
      return;
    }
  }
}