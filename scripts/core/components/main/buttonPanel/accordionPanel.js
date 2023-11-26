import { ArgonComponent } from "../../component.js";
import {ButtonPanel} from "./buttonPanel.js";

export class AccordionPanel extends ArgonComponent{
  constructor ({accordionPanelCategories}) {
    super();
    this._subPanels = accordionPanelCategories;
  }

  get classes() {
    return ["features-container", "is-spells"]
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
    this._subPanels.forEach(panel => {
      this.element.appendChild(panel.element);
    });
    const promises = this._subPanels.map(panel => panel.render());
    await Promise.all(promises);
  }
}