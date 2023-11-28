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

  setVisibility(){}

  toggle(toggle) {
    if (toggle === undefined) toggle = !this.visible;
    if(toggle) ui.ARGON.collapseAllPanels();
    this.element.classList.toggle("show", toggle);
  }

  updateItem(item) {
    if (!this._subPanels) return;
    for (const panel of this._subPanels) {
      panel.updateItem(item);
    }
  }

  async _renderInner() {
    await super._renderInner();
    this._subPanels.forEach(panel => {
      this.element.appendChild(panel.element);
      panel._parent = this;
    });
    const promises = this._subPanels.map(panel => panel.render());
    await Promise.all(promises);
    let totalActionBarWidth = ui.ARGON.actionBarWidth;
    for (const panel of this._subPanels) { 
      totalActionBarWidth -= panel.totalWidth;
      if (totalActionBarWidth < 0) break;
      panel.toggle(true);
    }
  }
}