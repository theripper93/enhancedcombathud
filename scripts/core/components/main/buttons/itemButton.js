import { ArgonComponent } from "../../component.js";

export class ItemButton extends ArgonComponent{
  constructor ({item, isWeaponSet=false, isPrimary=false, inActionPanel=undefined}) {
    super();
    this._item = item;
    this._isWeaponSet = isWeaponSet;
    this._isPrimary = isPrimary;
    this._inActionPanel = inActionPanel ?? isWeaponSet;
    if(this.isWeaponSet) this.hookId = Hooks.on("argon-onSetChangeUpdateItem", this._onSetChange.bind(this));
  }

  get classes() {
    return ["feature-element"];
  }

  get isWeaponSet() {
    return this._isWeaponSet;
  }

  get isPrimary() {
    return this._isPrimary;
  }

  get inActionPanel() {
    return this._inActionPanel;
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

  get visible() {
    return !!this.item;
  }

  async getData() {
    if(!this.visible) return {};
    return {
      label: this.label,
      icon: this.icon
    }
  }

  setItem(item) {
    if (!this.isWeaponSet) return console.error("Cannot set item on non-weapon set button");
    this._item = item;
    this.render();
  }

  async _onSetChange({sets, active}) {
    const activeSet = sets[active];

    const item = this.isPrimary ? activeSet.primary : activeSet.secondary;
    this.setItem(item);    
  }

  async _renderInner() {
    await super._renderInner();
    if (!this.item) {
      this.element.style.display = "none";
      return;
    }
    this.element.style.display = "";
    this.element.style.backgroundImage = `url(${this.icon})`;
    if(Number.isNumeric(this.quantity)) {
      this.element.classList.add("has-count");
      this.element.dataset.itemCount = this.quantity;
    }
    if (this.inActionPanel) {
      this.element.classList.remove("feature-element");
      this.element.classList.add("action-element", "item-button");
      const title = this.element.querySelector(".feature-element-title");
      title.classList.remove("feature-element-title");
      title.classList.add("action-element-title");
    }
  }
}
