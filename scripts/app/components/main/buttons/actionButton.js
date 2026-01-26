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

  get colorScheme() {
    return 0;
  }

  async getData() {
    return {
      label: this.label,
      icon: this.icon
    }
  }

  activateListeners(html) {
    this.element.onmouseup = this._onMouseUp.bind(this);
    this.element.onmousedown = this._onMouseDown.bind(this);
    this.element.onmouseenter = this._onMouseEnter.bind(this);
    this.element.onmouseleave = this._onMouseLeave.bind(this);
  }

  async _onMouseDown(event) {
  }

  async _onMouseUp(event) {
    event.preventDefault();
    event.stopPropagation();
    if (event.button === 0) this._onLeftClick(event);
    if (event.button === 2) this._onRightClick(event);
  }

  async _onMouseEnter(event) { }

  async _onMouseLeave(event) { }

  async _onLeftClick(event) {
    console.error("ActionButton._onLeftClick not implemented");
  }

  async _onRightClick(event) {
  }

  async _renderInner() {
    await super._renderInner();
    this.element.style.backgroundImage = `url("${this.icon}")`;
    if(Number.isNumeric(this.quantity)) {
      this.element.classList.add("has-count");
      this.element.dataset.itemCount = this.quantity;
    }
  }
}
