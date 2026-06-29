export default class victoryscene extends Phaser.Scene {
  constructor() {
    super("VictoryScene");
  }

  init(data) {
    this.savedPeopleTotal = data?.savedPeopleTotal || 0;
    this.pointsTotal = data?.points || data?.score || 0;
    this.livesRemaining = data?.lives ?? data?.playerLives ?? 0;
  }

  create() {
    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;

    this.add.text(centerX, centerY - 140, "VICTORIA!!!!!!", {
      fontSize: "64px",
      fontFamily: "sans-serif",
      fill: "#ffffff",
    }).setOrigin(0.5);

    this.add.text(centerX, centerY - 40, `Personas salvadas: ${this.savedPeopleTotal}`, {
      fontSize: "32px",
      fontFamily: "sans-serif",
      fill: "#ffffff",
    }).setOrigin(0.5);

    this.add.text(centerX, centerY - 220, `Vidas restantes: ${this.livesRemaining}`, {
      fontSize: "32px",
      fontFamily: "sans-serif",
      fill: "#00ffc8",
    }).setOrigin(0.5);

    this.add.text(centerX, centerY + 80, `Puntos totales: ${this.pointsTotal}`, {
      fontSize: "32px",
      fontFamily: "sans-serif",
      fill: "#ffffff",
    }).setOrigin(0.5);


    
    const buttonBackground = this.add.rectangle(centerX, centerY + 180, 320, 100, 0x004488).setOrigin(0.5);
    const buttonText = this.add.text(centerX, centerY + 180, "VOLVER AL MENÚ", {
      fontSize: "28px",
      fontFamily: "sans-serif",
      fill: "#ffffff",
    }).setOrigin(0.5);

    buttonBackground.setInteractive({ useHandCursor: true });
    buttonBackground.on("pointerdown", () => {
      this.scene.start("Menu");
    });
    buttonText.setInteractive({ useHandCursor: true });
    buttonText.on("pointerdown", () => {
      this.scene.start("Menu");
    });
  }
}
