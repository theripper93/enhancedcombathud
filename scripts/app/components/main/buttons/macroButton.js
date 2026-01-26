import {ArgonComponent} from "../../component.js";

export class MacroButton extends ArgonComponent{
  constructor ({macro, inActionPanel=undefined}) {
    super();
    this._macro = macro;
    this._inActionPanel = inActionPanel ?? false;
  }

  get classes() {
    return ["feature-element"];
  }

  get inActionPanel() {
    return this._inActionPanel;
  }

  get macro() {
    return this._macro;
  }

  get label() {
    return this.macro.name;
  }

  get icon() {
    return this.macro.img;
  }

  get quantity() {
    return null;
  }

  get quantitySecondary() {
    return null;
  }

  get visible() {
    return !!this.macro;
  }

  async getData() {
    if (!this.visible) return {};
    const quantity = this.quantity;
    const quantitySecondary = this.quantitySecondary;
    return {
      label: this.label,
      icon: this.icon,
      quantity: quantity,
      hasQuantity: Number.isNumeric(quantity),
      quantitySecondary: this.quantitySecondary,
      hasQuantitySecondary: Number.isNumeric(quantitySecondary),
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
    if (event.button === 0) this._onPreLeftClick(event);
    if (event.button === 2) this._onRightClick(event);
  }

  async _onMouseEnter(event) {
  }

  async _onMouseLeave(event) {
  }

  async _onPreLeftClick(event) {
    this._onLeftClick(event);
  }

  async _onLeftClick(event) {
    this.macro.execute();
  }

  async _onRightClick(event) {
  }

  async _renderInner() {
    await super._renderInner();
    if (!this.macro) {
      this.element.style.display = "none";
      return;
    }
    this.element.style.display = "";
    this.element.style.backgroundImage = `url("${this.icon}")`;
    const quantity = this.quantity;
    const quantitySecondary = this.quantitySecondary;
    if (Number.isNumeric(quantity) || Number.isNumeric(quantitySecondary)) {
      const isBothZero = (( quantity ?? 0) + (quantitySecondary ?? 0)) === 0;
      this.element.style.filter = isBothZero ? "grayscale(1)" : null;
    }
    if (this.inActionPanel) {
      this.element.classList.remove("feature-element");
      this.element.classList.add("action-element", "item-button");
      const title = this.element.querySelector(".feature-element-title");
      if (title) {        
        title.classList.remove("feature-element-title");
        title.classList.add("action-element-title");
      }
    }
  }
}