import { ArgonComponent } from "../../component.js";

export class ItemButton extends ArgonComponent{
  constructor ({item}) {
    super();
    this._item = item;
  }

  get classes() {
    return ["feature-element"];
  }

  get item() {
    return this._item;
  }

  get label() {
    return this.item.name;
  }

  get icon() {
    return this.item.img;
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
