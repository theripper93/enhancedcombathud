import { ArgonComponent } from "../../component.js";

export class ActionButton extends ArgonComponent{
  constructor () {
    super();
  }

  get classes() {
    return ["action-element", "ech-blur"];
  }

  get label() {
    return "";
  }

  get icon() {
    return "";
  }

  get quantity() {
    return null;
  }

  async getData() {
    return {
      label: this.label,
      icon: this.icon
    }
  }

  async _renderInner() {
    await super._renderInner();
    this.element.style.backgroundImage = `url(${this.icon})`;
    if(Number.isNumeric(this.quantity)) {
      this.element.classList.add("has-count");
      this.element.dataset.itemCount = this.quantity;
    }
  }
}
