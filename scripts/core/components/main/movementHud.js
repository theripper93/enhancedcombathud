import {ArgonComponent} from "../component.js";

const movementColors = ["base-movement", "dash-movement", "danger-movement"];
export class MovementHud extends ArgonComponent {

  constructor (...args) {
    super(...args);
    this._movementUsed = 0;
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

  onTokenUpdate(updates, context) {
    console.log("Measuring Path")
    if (updates.x === undefined && updates.y === undefined) return;
    const start = new PIXI.Point(this.token.x, this.token.y);
    const end = new PIXI.Point(updates.x ?? this.token.x, updates.y ?? this.token.y);
    const segments = [start, end];
    const distance = Math.floor(
      canvas.grid.measurePath(segments, { gridSpaces: true }).distance /
        canvas.dimensions.distance
    );
    if (context?.isUndo) {
      this.movementUsed -= distance;
    }
    else {
      this.movementUsed += distance;
    }
    this.updateMovement();
  }

  updateMovement() {
    if (!game.combat?.started) this.movementUsed = 0;
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

  _onNewRound(combat) {
    this.movementUsed = 0;
    this.updateMovement();
  }

  _onCombatEnd(combat) {
    this.movementUsed = 0;
    this.updateMovement();
  }

  async render(...args) {
    await super.render(...args);
    this.updateMovement();
  }
}
