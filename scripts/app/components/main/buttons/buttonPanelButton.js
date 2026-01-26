import { ArgonComponent } from "../../component.js";

export class ButtonPanelButton extends ArgonComponent{

  get classes() {
    const base = ["action-element", "ech-blur"];
    return base;
  }

  get label() {
    return "";
  }

  get icon() {
    return "";
  }

  get colorScheme() {
    return 0;
  }

  get buttonPanelContainer() {
    return ui.ARGON.buttonPanelContainer;
  }

  updateItem(item) {
    if (!this.panel) return;
    this.panel.updateItem(item);
  }

  async getData() {
    return {
      label: this.label,
      icon: this.icon
    }
  }

  async activateListeners(html) {
    await super.activateListeners(html);
    this.element.onclick = this._onClick.bind(this);
  }

  async _onClick(event) {
    event.preventDefault();
    event.stopPropagation();
    this.panel.toggle();
  }

  async _renderInner() {
    await super._renderInner();
    this.element.style.backgroundImage = `url("${this.icon}")`;
    this.panel = await this._getPanel();
    this.panel._parent = this;
    this.buttonPanelContainer.appendChild(this.panel.element);
    await this.panel.render();
  }

  async _getPanel() {
    console.warn("ButtonPanelButton.getPanel() is not implemented");
    return null;
  }
}