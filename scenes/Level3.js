import NivelBase from "./levelplantilla.js";

export default class Level3 extends NivelBase {
  constructor() {
    super("Level3");
  }

  create() {
    this.crearNivel("map_level3");
  }

  enterdoor(player, door) {
    if (this.inventario.items.length >= 5) {
      door.disableBody(true, true); 
      this.registry.set('score', this.score);
      this.scene.start("VictoryScene", {
        score: this.points,
        points: this.points,
        savedPeopleTotal: this.savedPeopleTotal,
        lives: player?.vida ?? 0,
      }); 
    }
  }
}
