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

  get maxActions() {
    return 3;
  }
  
  get currentActions() {
    return 2;
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
    const actionsContainer = this.element.querySelector(".actions-uses-container");
    if (!actionsContainer) return;

    const childrenArray = Array.from(actionsContainer.children);

    if (childrenArray.length !== this.maxActions) {
      actionsContainer.innerHTML = "";
      for (let i = 0; i < this.maxActions; i++) {
        const action = document.createElement("div");
        action.classList.add("action-pip");
        actionsContainer.appendChild(action);
      }
    }

    let availableActions = this.currentActions;
    for (const child of childrenArray) {
      child.classList.toggle("actions-used", availableActions <= 0);
      availableActions--;
    }

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

  async getData() {
    return {
      maxActions: Array.apply(null, Array(this.maxActions)),
    }
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