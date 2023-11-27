import {ArgonComponent} from "../component.js";
import { localize } from "../../hud.js";

export class DrawerPanel extends ArgonComponent{
  
  get classes(){
    return ["ability-menu"];
  }

  get elementType(){
    return "div";
  }

  get title() {
    return "Drawer Panel";
  }

  get categories() {
    return [];
  }

  async getData(){
    return {
      title: this.title,
      categories: this.categories,
    };
  }

  async _renderInner() {
    await super._renderInner();
    const buttonPromises = [];
    const categories = this.categories;
    for (const category of categories) {
      const index = categories.indexOf(category);
      const container = this.element.querySelector(`.ability-title[data-index="${index}"]`);
      if (!container) continue;
      const buttons = category.buttons;
      if(!buttons) continue;
      for (const button of buttons) {
        container.after(button.element);
        button.setGrid(category.gridCols);
        button.setAlign(category.captions.map((caption) => caption.align));
        buttonPromises.push(button.render());
      }
    }
    await Promise.all(buttonPromises);
    return this.element;    
  }
}