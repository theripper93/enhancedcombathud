import { ArgonComponent } from "../../component.js";

export class ButtonPanel extends ArgonComponent{
  constructor ({buttons}) {
    super();
    this._buttons = buttons;
  }
}
