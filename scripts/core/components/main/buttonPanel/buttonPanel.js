import { ArgonComponent } from "../../component.js";

export class ButtonPanel extends ArgonComponent{
  constructor ({buttons}) {
    super();
    this.element.dataset.iscontainer = true;
    this._buttons = buttons;
  }

  get classes() {
    return ["features-container"]
  }

  get visible() {
    return this.element.classList.contains("show");
  }

  toggle(toggle) {
    if (toggle === undefined) toggle = !this.visible;
    if(toggle) ui.ARGON.collapseAllPanels();
    this.element.classList.toggle("show", toggle);
  }

  async _renderInner() {
    await super._renderInner();
    this._buttons.forEach(button => {
      this.element.appendChild(button.element);
    });
    const promises = this._buttons.map(button => button.render());
    await Promise.all(promises);
  }
}
