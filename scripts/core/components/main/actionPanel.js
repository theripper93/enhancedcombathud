import {ArgonComponent} from "../component.js";
import { localize } from "../../hud.js";

export class ActionPanel extends ArgonComponent{

  get classes() {
    return ["actions-container"]
  }

  get label() {
    return "Action Panel";
  }

  async _getButtons() {
    console.warn("ActionPanel._getButtons() is not implemented");
    return [];
  }

  async _renderInner() {
    await super._renderInner();
    this.element.dataset.title = localize(this.label);
    const buttons = await this._getButtons();
    for (const button of buttons) {
      this.element.appendChild(button.element);
      button.render();
    }
  }
}