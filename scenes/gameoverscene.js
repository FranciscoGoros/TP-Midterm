export default class gameoverscene extends Phaser.Scene {
  constructor() {
    super("GameOverScene");
  }

  init(data) {
    this.savedPeopleTotal = data?.savedPeopleTotal || 0;
    this.pointsTotal = data?.points || data?.score || 0;
    this.currentLevel = data?.currentLevel || "Level1";
  }

  create() {
    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;

    this.add.text(centerX, centerY - 140, "GAME OVER", {
      fontSize: "64px",
      fontFamily: "sans-serif",
      fill: "#ffffff",
    }).setOrigin(0.5);

    this.add.text(centerX, centerY - 40, `Personas salvadas: ${this.savedPeopleTotal}`, {
      fontSize: "32px",
      fontFamily: "sans-serif",
      fill: "#ffffff",
    }).setOrigin(0.5);

    this.add.text(centerX, centerY + 20, `Puntos totales: ${this.pointsTotal}`, {
      fontSize: "32px",
      fontFamily: "sans-serif",
      fill: "#ffffff",
    }).setOrigin(0.5);

    const restartBackground = this.add.rectangle(centerX, centerY + 100, 320, 100, 0x004488).setOrigin(0.5);
    const restartText = this.add.text(centerX, centerY + 100, "REINICIAR NIVEL", {
      fontSize: "28px",
      fontFamily: "sans-serif",
      fill: "#ffffff",
    }).setOrigin(0.5);

    const menuBackground = this.add.rectangle(centerX, centerY + 220, 320, 100, 0x004488).setOrigin(0.5);
    const menuText = this.add.text(centerX, centerY + 220, "VOLVER AL MENÚ", {
      fontSize: "28px",
      fontFamily: "sans-serif",
      fill: "#ffffff",
    }).setOrigin(0.5);

    restartBackground.setInteractive({ useHandCursor: true });
    restartBackground.on("pointerdown", () => {
      this.scene.start(this.currentLevel, {
        score: this.pointsTotal,
        points: this.pointsTotal,
        savedPeopleTotal: this.savedPeopleTotal,
      });
    });
    restartText.setInteractive({ useHandCursor: true });
    restartText.on("pointerdown", () => {
      this.scene.start(this.currentLevel, {
        score: this.pointsTotal,
        points: this.pointsTotal,
        savedPeopleTotal: this.savedPeopleTotal,
      });
    });

    menuBackground.setInteractive({ useHandCursor: true });
    menuBackground.on("pointerdown", () => {
      this.scene.start("Menu");
    });
    menuText.setInteractive({ useHandCursor: true });
    menuText.on("pointerdown", () => {
      this.scene.start("Menu");
    });
  }
}
