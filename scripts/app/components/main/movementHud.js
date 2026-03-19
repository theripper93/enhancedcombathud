import { ArgonComponent } from "../component.js";

const movementColors = ["base-movement", "dash-movement", "danger-movement"];
export class MovementHud extends ArgonComponent {

  constructor(...args) {
    super(...args);
    this._movementUsed = 0;
  }

  get visible() {
    return game.combat?.started;
  }

  get classes() {
    return ["movement-hud"]
  }

  get movementUsed() {
    return this._movementUsed;
  }

  set movementUsed(value) {
    this._movementUsed = Math.max(value, 0);
  }

  get movementMax() { }

  get movementColor() {
    return movementColors[Math.min(Math.floor((this.movementUsed) / this.movementMax), 2)];
  }

  get movementIcon() {
    return CONFIG.Token.movement?.actions[this.movementMode]?.img;
  }

  get movementMode() {
    return this.token.document.movementAction || "walk";
  }

  getData() {
    return {
      movementIcon: this.movementIcon
    };
  }

  onTokenUpdate(updates, context) {
    if (updates.movementAction) this.render();
    if (!updates._movementHistory) return;
    this.updateMovement();
  }

  updateMovementUsed() {
    this.movementUsed = Math.round(this.token.document.movementHistory.reduce((acc, movement) => {
      acc += movement.cost;
      return acc;
    }, 0) / canvas.scene.dimensions.distance);
  }

  updateMovement() {

    this.updateMovementUsed();
    
    const movementColor = this.movementColor;
    const disabledBars = (this.movementUsed % this.movementMax) || 0;
    const barsNumber = this.movementMax - disabledBars;

    const barsContainer = this.element.querySelector(".movement-spaces");
    let newHtml = "";
    for (let i = 0; i < barsNumber; i++) {
      newHtml += `<div class="movement-space  ${movementColor}"></div>`;
    }
    for (let i = 0; i < disabledBars; i++) {
      newHtml += `<div class="movement-space"></div>`;
    }
    this.element.querySelector(".movement-current").innerText = barsNumber;
    this.element.querySelector(".movement-max").innerText = ((Math.floor((this.movementUsed) / this.movementMax) + 1) * this.movementMax) || 0;
    barsContainer.innerHTML = newHtml;
  }

  _onNewTurn(combat, updates) {} 

  _onNewRound(combat, updates) {}

  _onCombatEnd(combat, updates) {}

  async render(...args) {
    await super.render(...args);
    this.updateMovement();
  }
}
