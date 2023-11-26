import {ArgonComponent} from "../component.js";
import { localize } from "../../hud.js";

export class DrawerPanel extends ArgonComponent{
  constructor (drawerButtons) {
    super();
    this.drawerButtons = drawerButtons;
  }
  
  get classes(){
    return ["ability-menu"];
  }

  get elementType(){
    return "div";
  }

  async getData(){
    return {};
  }

  async _renderInner() {
    await super._renderInner();
    if(!this.drawerButtons) return;
    for(const group of this.drawerButtons){
      const groupElement = document.createElement("div");
      groupElement.classList.add("drawer-group");
      groupElement.innerText = localize(group.name);
      this.element.appendChild(groupElement);
      for (const button of group.buttons) {
        button._renderInner();
        this.element.appendChild(button.element);
      }
    }
  }
}