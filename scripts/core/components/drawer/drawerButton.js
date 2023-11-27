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

  async getData() {
    return {
      buttons: this._buttons,
    }
  }


}