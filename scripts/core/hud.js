import {ArgonComponent} from "./components/component.js";
import { DrawerButton } from "./components/drawer/drawerButton.js";
import { DrawerPanel } from "./components/drawer/drawerPanel.js";
import { AccordionPanel } from "./components/main/buttonPanel/accordionPanel.js";
import { AccordionPanelCategory } from "./components/main/buttonPanel/accordionPanelCategory.js";
import { ButtonPanel } from "./components/main/buttonPanel/buttonPanel.js";
import { ActionButton } from "./components/main/buttons/actionButton.js";
import { ButtonPanelButton } from "./components/main/buttons/buttonPanelButton.js";
import { ItemButton } from "./components/main/buttons/itemButton.js";
import {SplitButton} from "./components/main/buttons/splitButton.js";
import {ActionPanel} from "./components/main/actionPanel.js";
import {PortraitPanel} from "./components/portrait/portraitPanel.js";
import {WeaponSets} from "./components/main/weaponSets.js";
import { MovementHud } from "./components/main/movementHud.js";
import {ArgonTooltip} from "./tooltip.js";

export const MODULE_ID = "enhancedcombathud";
export const TEMPLATE_PATH = `modules/${MODULE_ID}/templates/`;
export const PARTIALS_PATH = `modules/${MODULE_ID}/templates/partials/`;

export function localize(string){
  return game.i18n.localize(string);
}

const mainSystemComponents = {
  PORTRAIT: null,
  DRAWER: null,
  MAIN: [],
  WEAPONSETS: WeaponSets,
  MOVEMENT: MovementHud,
}


export class CoreHUD extends Application{
  constructor () {
    super();
    this._itemButtons = [];
    Hooks.callAll(`argonInit`, CoreHUD);
    Hooks.on("argon-onSetChangeComplete", this._updateActionContainers.bind(this));
    Hooks.on("updateItem", this._onUpdateItem.bind(this));
  }

  static get defaultOptions() {
    return {
      ...super.defaultOptions,
      id: "enhancedcombathud",
      template: "modules/enhancedcombathud/templates/coreHUD.hbs",
      popOut: false,
      dragDrop: [{dragSelector: null, dropSelector: null}],
    }
  }

  _canDragDrop(selector) {
    return true;
  }

  get buttonPanelContainer(){
    return this.element[0].querySelector(".action-hud");
  }

  get actionBarWidth() {
    let totalActionBarWidth = 0;
    this.element[0].querySelectorAll(".actions-container").forEach(element => {
      totalActionBarWidth += element.offsetWidth;
    });
    return totalActionBarWidth;
  }

  get itemButtons() {
    return this._itemButtons;
  }

  async _updateActionContainers() {
    this.components.main.forEach(component => component.updateVisibility());
  }

  _onUpdateItem(item) {
    if (item.parent !== this._actor) return;
    for (const itemButton of this.itemButtons) {
      if (itemButton.item === item) itemButton.render();
    }
  }

  updateItemButtons(items) {
    if(!Array.isArray(items)) items = [items];
    for (const itemButton of this.itemButtons) {
      if (items.includes(itemButton.item)) itemButton.render();
    }
  }

  async _renderInner(data) {
    const element = await super._renderInner(data);
    const html = element[0];
    this.components = {
      weaponSets: new mainSystemComponents.WEAPONSETS(),
      movement: new mainSystemComponents.MOVEMENT(),
      portrait: new mainSystemComponents.PORTRAIT(),
      drawer: new mainSystemComponents.DRAWER(),
      main: mainSystemComponents.MAIN.map(component => new component()),
    }

    html.appendChild(this.components.weaponSets.element);
    html.appendChild(this.components.portrait.element);
    html.appendChild(this.components.drawer.element);
    html.appendChild(this.components.movement.element);

    const actionHudElement = document.createElement("div");
    actionHudElement.classList.add("action-hud");
    html.appendChild(actionHudElement);

    for (const component of this.components.main) {
      const buttonCount = await component._getButtons();
      if(buttonCount.length) actionHudElement.appendChild(component.element);
    }
    
    const promises = []
    Object.values(this.components).forEach(component => {
      Array.isArray(component) ? component.forEach(c => promises.push(c.render())) : promises.push(component.render());
    });

    await Promise.all(promises);
    this._updateActionContainers();
    return element;
  }

  bind(target) {
    this._itemButtons = [];
    if (target instanceof Token || target instanceof TokenDocument) {
      this._actor = target.actor;
      this._token = target instanceof Token ? target : target.object;
    }
    else if (target instanceof Actor) {
      this._actor = target;
      this._token = target.token ?? target.parent ?? target.getActiveTokens()[0] ?? null;
    }
    else {
      throw new Error("Invalid argument");
    }
    if(!this._actor) console.error("Argon: No actor found");
    this.render(true);
  }

  collapseAllPanels() {
    this.element[0].querySelectorAll(".features-container.show").forEach(element => {
      element.classList.remove("show");
    });
  }

  static definePortraitPanel(panel) {
    mainSystemComponents.PORTRAIT = panel;
  }

  static defineDrawerPanel(panel) {
    mainSystemComponents.DRAWER = panel;
  }

  static defineMainPanels(panels) {
    mainSystemComponents.MAIN.push(...panels);
  }

  static defineWeaponSets(weaponSets) {
    mainSystemComponents.WEAPONSETS = weaponSets;
  }

  static defineMovementHud(movementHud) {
    mainSystemComponents.MOVEMENT = movementHud;
  }

  static get ARGON() {
    return {
      CORE: {
        CoreHUD,
        ArgonTooltip,
        ArgonComponent,
      },
      MAIN: {
        BUTTONS: {
          ActionButton,
          ButtonPanelButton,
          ItemButton,
          SplitButton,
        },
        ActionPanel,
        BUTTON_PANELS: {
          ButtonPanel,
          ACCORDION: {
            AccordionPanel,
            AccordionPanelCategory,
          }
        }
      },
      PORTRAIT: {
        PortraitPanel,
      },
      DRAWER: {
        DrawerButton,
        DrawerPanel,
      },
      WeaponSets,
      MovementHud,
    }
  }
}