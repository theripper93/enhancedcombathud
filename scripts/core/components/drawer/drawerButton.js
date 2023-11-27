import {ArgonComponent} from "../component.js";
import { PARTIALS_PATH } from "../../hud.js";

export class DrawerButton extends ArgonComponent{
  constructor (buttons) {
    super();
    this._buttons = buttons;
  }

  get classes() {
    return ["ability"];
  }

  get elementType() {
    return "li";
  }

  setGrid(gridCols) {
    this.element.style.gridTemplateColumns = gridCols;
  }

  setAlign(align) {
    this._textAlign = align;
  }

  setTextAlign() {
    if (!this._textAlign) return;
    Array.from(this.element.children).forEach((child, index) => {
      child.style.textAlign = this._textAlign[index];
    });
  }

  async activateListeners(html) {
    await super.activateListeners(html);
    for (const button of this._buttons) {
      if (!button.interactive) continue;
      const index = this._buttons.indexOf(button);
      const el = this.element.querySelector(`span[data-index="${index}"]`);
      if (!el) continue;
      el.onclick = button.onClick;
    }
    this.setTextAlign();
  }

  async getData() {
    this._buttons.forEach((button) => {
      if(button.onClick) button.interactive = true;
    });
    return {
      buttons: this._buttons,
    }
  }


}