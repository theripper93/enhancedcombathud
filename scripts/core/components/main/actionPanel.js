import {ArgonComponent} from "../component.js";
import {localize} from "../../hud.js";
import {ButtonPanelButton} from "./buttons/buttonPanelButton.js";
import {SplitButton} from "./buttons/splitButton.js";

export class ActionPanel extends ArgonComponent{

  constructor (...args) {
    super(...args);
    this._buttons = [];
    this._isActionUsed = false;
  }

  get classes() {
    return ["actions-container"]
  }

  get label() {
    return "Action Panel";
  }

  get buttons() {
    return this._buttons;
  }

  get hasAction() {
    return false;
  }

  get isActionUsed() {
    if(!game.combat?.started) return false;
    return this._isActionUsed;
  }

  set isActionUsed(value) {
    this._isActionUsed = value;
    this.updateActionUse();
  }

  _onNewRound(combat) {
    this.isActionUsed = false;
  }

  updateVisibility() {
    if (!this._buttons) return;
    let count = this._buttons.length;
    for (const button of this._buttons) {
      if (button.visible === false) count--;
    }
    this.element.classList.toggle("hidden", count === 0);
  }

  updateActionUse() {
    this.element.classList.toggle("has-actions", this.hasAction);
    this.element.classList.toggle("actions-used", this.isActionUsed);
  }

  updateItem(item) {
    if (!this._buttons) return;
    for (const button of this._buttons) {
      if (button.item === item) button.render();
      if (button instanceof ButtonPanelButton) button.updateItem(item);
      if (button instanceof SplitButton) {
        if (button.button1.item === item) button.button1.render();
        if (button.button2.item === item) button.button2.render();
      }
    }
  }

  async _getButtons() {
    console.warn("ActionPanel._getButtons() is not implemented");
    return [];
  }

  async _renderInner() {
    await super._renderInner();
    this.element.dataset.title = localize(this.label);
    const buttons = await this._getButtons();
    this._buttons = buttons;
    for (const button of buttons) {
      this.element.appendChild(button.element);
      button.render();
    }
    this.updateActionUse();
    this.updateVisibility();
  }
}