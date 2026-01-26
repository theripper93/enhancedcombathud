import {ArgonComponent} from "../component.js";

export class ButtonHud extends ArgonComponent {

  constructor (...args) {
    super(...args);
  }

  get classes() {
    return ["movement-hud"]
  }

  async _getButtons() {
    console.error("ButtonHud._getButtons() is not implemented");
    return [];
  }

  async render(...args) {
    await super.render(...args);
    this.buttons = await this._getButtons();
    for(const button of this.buttons) {
      const buttonEl = document.createElement("div");
      buttonEl.classList.add("button-hud-button");
      if(this.buttons.length > 4) buttonEl.classList.add("button-hud-button-small");
      const i = document.createElement("i");
      if (button.color) i.style.color = button.color;
      if (button.label && this.buttons.length > 4) buttonEl.dataset.tooltip = game.i18n.localize(button.label);
      i.classList.add(...button.icon.split(" "));
      buttonEl.appendChild(i);
      if (button.label && this.buttons.length <= 4) {
        const span = document.createElement("span");
        span.textContent = game.i18n.localize(button.label);
        buttonEl.appendChild(span);
      }
      buttonEl.addEventListener("click", button.onClick);
      this.element.appendChild(buttonEl);
    }
    this.element.style.display = "grid";
    if (this.buttons.length <= 4) {
      this.element.style.gridTemplateRows = `repeat(${this.buttons.length}, 1fr)`;
    } else {
      this.element.style.gridTemplateColumns = `repeat(2, 1fr)`;
      this.element.style.gridTemplateRows = `repeat(${Math.ceil(this.buttons.length / 2)}, 1fr)`;
    }
  }
}