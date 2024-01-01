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
    this._movementUsed = value;
  }

  get movementMax() { }

  onTokenUpdate(updates) {
    if (updates.x === undefined && updates.y === undefined) return;
    const ray = new Ray({ x: this.token.x, y: this.token.y }, { x: updates.x ?? this.token.x, y: updates.y ?? this.token.y });
    const segments = [{ ray }];
    const distance = Math.floor(
      canvas.grid.measureDistances(segments, { gridSpaces: true }) /
        canvas.dimensions.distance
    );
    this.movementUsed += distance;
    this.updateMovement();
  }

  updateMovement() {
    if (!game.combat?.started) this.movementUsed = 0;
    const movementColor = movementColors[Math.min(Math.floor((this.movementUsed) / this.movementMax), 2)]

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