export default class Menu extends Phaser.Scene {
  constructor() {

    super("Menu");
  }

  init() {

  }

  create() {
    const rectangle_button = this.add.rectangle(350, 500, 300, 100, 0x08888).setOrigin(0.5);
    const button = this.add.text(350, 500, "START", {
      fontSize: "48px",
      fontFamily: "sans-serif",
      fill: "#ffffff",
    }).setOrigin(0.5);


    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;

    this.add.text(centerX, centerY - 140, "SPLASH4", {
      fontSize: "64px",
      fontFamily: "sans-serif",
      fill: "#ffffff",
    }).setOrigin(0.5);


    rectangle_button.setInteractive({ useHandCursor: true });
    rectangle_button.on("pointerdown", () => {
      this.scene.start("Level1");
    });

    button.setInteractive({ useHandCursor: true });
    button.on("pointerdown", () => {
      this.scene.start("Level1");
    });


  }
}
