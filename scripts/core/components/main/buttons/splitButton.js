import { ArgonComponent } from "../../component.js";

export class SplitButton extends ArgonComponent{
  constructor (button1, button2) {
    super();
    this.button1 = button1;
    this.button2 = button2;
  }

  get classes() {
    return ["action-element-container"];
  }

  async _renderInner() {
    await super._renderInner();
    this.element.appendChild(this.button1.element);
    this.element.appendChild(this.button2.element);
    await this.button1.render();
    await this.button2.render();
  }
}
