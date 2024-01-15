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
import {MovementHud} from "./components/main/movementHud.js";
import { ButtonHud } from "./components/main/buttonHud.js";
import {Tooltip} from "./tooltip.js";
import { showTargetPickerGuide } from "./targetPicker.js";

import { PassTurnPanel } from "./prefab/passTurnPanel.js";

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
  BUTTONHUD: null,
}

const supportedActorTypes = [];


export class CoreHUD extends Application{
  constructor () {
    super();
    this.performModuleCheck();
    this._itemButtons = new Set();
    this._accordionPanelCategories = new Set();
    this._batchItemsUpdates = new Set();
    this._hudState = new Map();
    this._tooltip = null;
    this._target = null;
    this._enabled = false;
    this.components = {
      main: [],
    };
    this.refresh = debounce(this.refresh, 200);
    this._batchUpdateItemButtons = debounce(this._batchUpdateItemButtons, 200);

    Hooks.callAll(`argonInit`, CoreHUD);
    Hooks.on("argon-onSetChangeComplete", this._updateActionContainers.bind(this));
    Hooks.on("updateItem", this._onUpdateItem.bind(this));
    //Hooks.on("combatStart", this._onCombatStart.bind(this)); #Hook is only firing for the user starting the combat for some reason
    Hooks.on("updateCombat", this._onUpdateCombat.bind(this));
    Hooks.on("deleteCombat", this._onDeleteCombat.bind(this));
    Hooks.on("updateActor", this._onUpdateActor.bind(this));
    Hooks.on("updateToken", this._onUpdateToken.bind(this));
    Hooks.on("controlToken", this._onControlToken.bind(this));
    Hooks.on("createItem", this._onCreateItem.bind(this));
    Hooks.on("deleteItem", this._onDeleteItem.bind(this));
    Hooks.on("createActiveEffect", this._onChangeActiveEffect.bind(this));
    Hooks.on("deleteActiveEffect", this._onChangeActiveEffect.bind(this));
    Hooks.on("updateActiveEffect", this._onChangeActiveEffect.bind(this));

    this.setColorSettings();

    document.addEventListener("wheel", (event) => ui.ARGON._tooltip && ui.ARGON._tooltip.setScrollDelta(event.deltaY));

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
    return this._buttonPanelContainer;
  }

  get actionBarWidth() {
    let totalActionBarWidth = 0;
    this.element[0].querySelectorAll(".actions-container").forEach(element => {
      totalActionBarWidth += element.offsetWidth;
    });
    return totalActionBarWidth;
  }

  get itemButtons() {
    return Array.from(this._itemButtons);
  }

  addItemButtons(buttons) {
    if (!Array.isArray(buttons)) buttons = [buttons];
    this._itemButtons.add(...buttons);
  }

  get accordionPanelCategories() {
    return Array.from(this._accordionPanelCategories);
  }

  async _updateActionContainers() {
    this.components.main.forEach(component => component.updateVisibility());
  }

  _onCombatStart(combat) {
    const openCombatStart = game.settings.get("enhancedcombathud", "openCombatStart");
    if (openCombatStart) this.bind(canvas.tokens.controlled[0] ?? _token);
    this.components.movement?._onNewRound(combat);
    this.components.main.forEach(component => component._onNewRound(combat));
    this.updateSidePortraitHuds();
  }

  _onUpdateCombat(combat, updates) {
    this.components.combat?.forEach(component => component.updateVisibility());
    if ("round" in updates) {
      this.components.main?.forEach(component => component._onNewRound(combat));
      this.components.movement?._onNewRound(combat);
    }
    if(updates.round === 1 && updates.turn === 0) this._onCombatStart(combat);
    this.updateSidePortraitHuds();
  }

  _onDeleteCombat(combat) {
    this.components.movement?._onCombatEnd(combat);
    const openCombatStart = game.settings.get("enhancedcombathud", "openCombatStart");
    if (openCombatStart) this.enabled = false;
    this.updateSidePortraitHuds();
  }

  _onUpdateItem(item) {
    if (item.parent !== this._actor) return;
    this.accordionPanelCategories.forEach(category => category.setUses());
    for (const itemButton of this.itemButtons) {
      if (itemButton.item === item) itemButton.render();
    }
  }

  updateItemButtons(items) {
    if (!Array.isArray(items)) items = [items];
    this._batchItemsUpdates.add(...items);
    this._batchUpdateItemButtons();
  }

  _batchUpdateItemButtons() {
    for (const itemButton of this.itemButtons) {
      if (this._batchItemsUpdates.has(itemButton.item)) itemButton.render();
    }
    this._batchItemsUpdates.clear();
  }

  _onUpdateActor(actor) {
    if (actor !== this._actor) return;
    this.components.portrait.refresh();
    this.accordionPanelCategories.forEach(category => category.setUses());
    for (const itemButton of this.itemButtons) {
      if (Number.isNumeric(itemButton.quantity)) itemButton.render();
    }
    this.components.main.forEach(component => component.updateActionUse());
  }

  _onCreateItem(item) {
    if(item.parent === this._actor) this._checkItemCount();
  }

  _onDeleteItem(item) {
    if(item.parent === this._actor) this._checkItemCount();
  }

  _onChangeActiveEffect(activeEffect) {
    if(activeEffect.parent !== this._actor) return;
    this.components.portrait.refresh();
  }

  _checkItemCount() {
    const itemCount = this._actor.items.size;
    if (itemCount !== this._itemsCount) {
      this._itemsCount = itemCount;
      this.refresh();
    }
  }

  _onUpdateToken(tokenDocument, updates) {
    if (tokenDocument !== this._token?.document) return;
    if(updates.actorId) this.bind(tokenDocument);
    else this.components.movement?.onTokenUpdate(updates);
  }

  _onControlToken(token, controlled) {
    if (!controlled && !canvas.tokens.controlled.length) {
      setTimeout(() => {
        if(!canvas.tokens.controlled.length) this.bind(null);
      }, 100);
    }
    if (!controlled) return;
    if (this.enabled || game.settings.get("enhancedcombathud", "alwaysOn")) {
      this.bind(token)
    }
  }

  async getData(data) {
    return {
      fadeOutInactive: game.settings.get("enhancedcombathud", "fadeOutInactive"),
    }
  }

  getState() {
    return this._hudState.get(this._actor);
  }

  setState(state) {
    this._hudState.set(this._actor, state);
  }

  getPanelState(panel) {
    const state = this.getState();
    if (!state) return;
    return state[panel.id];
  }

  setPanelState(state, panel) {
    const currState = this.getState();
    if (!currState) return;
    currState[panel.id] = state;
    this.setState(currState);
  }

  async _renderInner(data) {
    const _prevState = this._hudState.get(this._actor);
    if(!_prevState) this._hudState.set(this._actor, {});
    const element = await super._renderInner(data);
    const html = element[0];
    this.components = {
      weaponSets: new mainSystemComponents.WEAPONSETS(),
      movement: this._token && mainSystemComponents.MOVEMENT ? new mainSystemComponents.MOVEMENT() : null,
      buttonHud: mainSystemComponents.BUTTONHUD ? new mainSystemComponents.BUTTONHUD() : null,
      portrait: new mainSystemComponents.PORTRAIT(),
      drawer: new mainSystemComponents.DRAWER(),
      main: mainSystemComponents.MAIN.map(component => new component()),
    }

    html.appendChild(this.components.weaponSets.element);
    html.appendChild(this.components.portrait.element);
    html.appendChild(this.components.drawer.element);
    if (this.components.movement) html.appendChild(this.components.movement.element);
    if (this.components.buttonHud) html.appendChild(this.components.buttonHud.element);

    const actionHudElement = document.createElement("div");
    actionHudElement.classList.add("action-hud");
    this._buttonPanelContainer = actionHudElement;
    html.appendChild(actionHudElement);

    for (const component of this.components.main) {
      const buttonCount = await component._getButtons();
      if(buttonCount.length) actionHudElement.appendChild(component.element);
    }
    
    const promises = []
    Object.values(this.components).forEach(component => {
      if(component) Array.isArray(component) ? component.forEach(c => promises.push(c.render())) : promises.push(component.render());
    });

    await Promise.all(promises);
    this._updateActionContainers();
    this.updateSidePortraitHuds();
    this.components.combat = this.components.main.filter(component => component instanceof PassTurnPanel);
    this._itemsCount = this._actor.items.size;

    return element;
  }

  activateListeners(html) {
    this.toggleMinimize(document.body.classList.contains("minimize-ech-hud"));
  }

  get enabled() {
    return this._enabled;
  }

  set enabled(value) {
    const target = typeof value === 'boolean' ? canvas.tokens.controlled[0] ?? game.user.character : value;
    this._enabled = !!value;
    this.bind(value ? target ?? null : null)
  }

  async bind(target) {
    //await this.close();
    if (!target) {
      this._target = null;
      this._token = null;
      this._actor = null;
      this._itemsCount = null;
      this._batchItemsUpdates.clear();
      this.toggleUiElements(false);
      this.updateSceneControlButton();
      return this.close();
    }
    this._itemButtons.clear();
    this._accordionPanelCategories.clear();
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
    if (!this._actor) console.error("Argon: No actor found");
    const actorType = this._actor.type;
    if (supportedActorTypes.length && !supportedActorTypes.includes(actorType)) {
      const suppressWarnings = game.settings.get("enhancedcombathud", "suppressWarnings");
      if(!suppressWarnings) ui.notifications.error(localize("enhancedcombathud.err.unsupportedActorType").replace("%t", actorType));
      else console.error(localize("enhancedcombathud.err.unsupportedActorType").replace("%t", actorType));
      this._target = null;
      this._token = null;
      this._actor = null;
      return this.close();
    }
    this._target = target;
    this._enabled = true;
    this._batchItemsUpdates.clear();
    this.toggleUiElements(true);
    this.updateSceneControlButton();
    this.render(true);
  }

  toggle(toggle) {
    toggle = toggle ?? !this.enabled;
    this.enabled = toggle;
  }

  updateSceneControlButton() {
    const btn = document.querySelector(`.control-tool[data-tool="echtoggle"]`);
    if (!btn) return;
    try {      
      document.querySelector(`.control-tool[data-tool="echtoggle"]`).classList.toggle("active", !!this._target);
      ui.controls.controls.find(c=>c.name == "token").tools.find(t=> t.name== "echtoggle").active = !!this._target;
    } catch (e) {}
  }

  toggleUiElements(toggle) {
    const hideMacroPlayers = game.settings.get("enhancedcombathud", "hideMacroPlayers");
    if(!hideMacroPlayers) toggle = false;
    const hotbar = document.querySelector("#hotbar");
    const fps = document.querySelector("#fps");
    const players = document.querySelector("#players");
    [hotbar, fps, players].filter(element => element).forEach(element => {
      element.classList.toggle("ech-hidden", toggle);
    });
  }

  collapseAllPanels() {
    this.element[0].querySelectorAll(".features-container.show").forEach(element => {
      element.classList.remove("show");
    });
  }

  updateSidePortraitHuds() {
    this.components.movement?.setVisibility();
    this.components.buttonHud?.setVisibility();
    if(!this.components?.portrait?.element) return;
    if (!this.components.movement?.visible && !this.components.buttonHud?.visible) this.components.portrait.element.style.marginRight = "0px";
    else this.components.portrait.element.style.marginRight = "";
  }

  toggleMinimize(forceState) {
    const body = document.body;
    const html = this.element[0];
  
    const isMinimizeEchHud = body.classList.contains("minimize-ech-hud");

    const newState = forceState ?? !isMinimizeEchHud;
  
    body.classList.toggle("minimize-ech-hud", newState);
    html.classList.toggle("minimize-hud", newState);

    this.setPosition(false);
  }

  setPosition(preventTransition = true) {
    const html = this.element[0];

    if(preventTransition) html.style.transition = "none";
  
    const isMinimizeHud = html.classList.contains("minimize-hud");
  
    const echHUDWidth = html.offsetWidth;
    const windowWidth = window.innerWidth - 340;
    const scale = !game.settings.get("enhancedcombathud", "autoScale")
      ? game.settings.get("enhancedcombathud", "scale")
      : window.innerHeight / 2000//(1 / (echHUDWidth / windowWidth)) * game.settings.get("enhancedcombathud", "scale");
  
    const position = {
      bottom: isMinimizeHud ? "0px" : `${game.settings.get("enhancedcombathud", "botPos")}px`,
      left: `${game.settings.get("enhancedcombathud", "leftPos")}px`,
      transform: isMinimizeHud ? `scale(${scale > 1 ? 1 : scale}) translateY(100%)` : `scale(${scale > 1 ? 1 : scale})`,
      width: `calc(100vw * ${scale < 1 ? 1 + parseFloat(1 - scale) * 1 : 1})`,
    };
  
    for (let prop in position) {
      html.style[prop] = position[prop];
    }
    setTimeout(() => {
      html.style.transition = null;
    }, 500);
  }

  performModuleCheck() {
    const systemModule = game.modules.get(`enhancedcombathud-${game.system.id}`);
    if (systemModule?.active) return;
    const systemModuleElement = `<a href="https://foundryvtt.com/packages/enhancedcombathud-${game.system.id}" target="_blank">Argon - Combat HUD (${game.system.id.toUpperCase()})</a>`;
    ui.notifications.error(localize("enhancedcombathud.err.moduleNotActive").replace("%m", systemModuleElement), {permanent: true});
  }

  interceptNextDialog(element) {

    if(!element) return;

    function getOffset(el) {
      const rect = el.getBoundingClientRect();
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
      return {
        top: rect.top + scrollTop,
        left: rect.left + scrollLeft
      };
    }
  
    const offset = getOffset(element);
  
    // Close Previous Highjacked Windows
    const previousWindows = document.querySelectorAll(".ech-highjack-window .close");
    previousWindows.forEach(closeButton => closeButton.click());
  
    // Position Windows next to Saves/Skills/Tools Menu
    const hookId = Hooks.once("renderDialog", (dialog, html) => {
      html = html[0];
      offset.top += -window.scrollY - dialog.position.height / 2;
      offset.left +=
        element.getBoundingClientRect().width + 10 - window.scrollX;
  
      html.style.top = offset.top > 0 ? offset.top + "px" : "0";
      html.style.left = offset.left + "px";
      if(game.settings.get("enhancedcombathud", "dialogTheme")) html.classList.add("ech-highjack-window");
  
      // Update dialog with new position data for dragging.
      dialog.position.left = offset.left;
      dialog.position.top = offset.top > 0 ? offset.top : 0;
  
      // If Dialog allows you to select Modifier, use modifier from ability modifier by default
      const abilitySelect = html.querySelector('select[name="ability"]');
      if (abilitySelect && !abilitySelect.value) {
        abilitySelect.value = element.dataset.modifier;
      }
    });
  
    setTimeout(() => {
      Hooks.off("renderDialog", hookId)
    }, 200);
  }

  showTargetPickerGuide() {
    showTargetPickerGuide();
    Hooks.once("renderDialog", (dialog, html) => {
      if(game.settings.get("enhancedcombathud", "dialogTheme")) html[0].classList.add("ech-highjack-window");
    });
  }

  refresh() {
    if(this.rendered) this.render(true);
  }

  static setControlHooks() {
    Hooks.on("getSceneControlButtons", (controls, b, c) => {
      controls
        .find((x) => x.name == "token")
        .tools.push({
          active: ui.ARGON?._target,
          icon: "fa-duotone fa-swords",
          name: "echtoggle",
          title: game.i18n.localize("enhancedcombathud.controls.toggle.title"),
          onClick: function (toggle) {
            ui.ARGON.toggle(toggle);
          },
          toggle: true,
        });
    });
    Hooks.on("renderTokenHUD", (app, html, data) => {
      html = html[0];
      const button = document.createElement("div");
      button.classList.add("control-icon");
      button.innerHTML = '<i class="fa-duotone fa-swords"></i>';
      button.classList.toggle("active", ui.ARGON.enabled);
      html.querySelector(".col.left").prepend(button);
      button.onclick = (event) => {
        const target = app.object ?? canvas.tokens.controlled[0];
        ui.ARGON.toggle(!ui.ARGON.enabled ? target : null)
        button.classList.toggle("active");
      };
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

  static defineButtonHud(buttonHud) {
    mainSystemComponents.BUTTONHUD = buttonHud;
  }

  static defineSupportedActorTypes(actorTypes) {
    supportedActorTypes.push(...actorTypes);
  }

  static get ARGON() {
    return {
      CORE: {
        CoreHUD,
        Tooltip,
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
      ButtonHud,
      PREFAB: {
        PassTurnPanel,
      }
    }
  }

  async setColorSettings() {
    document.documentElement.style.setProperty(
      "--ech-fadeout-deleay",
      game.settings.get("enhancedcombathud", "fadeoutDelay") + "s"
    );
    document.documentElement.style.setProperty(
      "--ech-fadeout-opacity",
      game.settings.get("enhancedcombathud", "fadeoutOpacity")
    );

    Object.flatten = function (data) {
      var result = {};
      function recurse(cur, prop) {
        if (Object(cur) !== cur) {
          result[prop] = cur;
        } else if (Array.isArray(cur)) {
          for (var i = 0, l = cur.length; i < l; i++)
            recurse(cur[i], prop + "[" + i + "]");
          if (l == 0) result[prop] = [];
        } else {
          var isEmpty = true;
          for (var p in cur) {
            isEmpty = false;
            recurse(cur[p], prop ? prop + "." + p : p);
          }
          if (isEmpty && prop) result[prop] = {};
        }
      }
      recurse(data, "");
      return result;
    };
    function setThemeColors(colors) {
      Object.entries(Object.flatten(colors)).forEach(([key, value]) => {
        document.documentElement.style.setProperty(
          `--ech-${key.replace(/\./g, "-")}`,
          value
        );
      });
    }

    let theme = game.settings.get("enhancedcombathud", "echThemeData");

    if (theme.theme == "custom") {
      setThemeColors(theme.colors);
    } else {
      const json = await this.getThemeJson(theme.theme);
      setThemeColors(json);
    }

    const noBlur = game.settings.get("enhancedcombathud", "noBlur");

    if (noBlur) document.documentElement.style.setProperty("--ech-blur-amount", "");
    
  }

  async getThemeJson(themeName) {
    let file;
    file = await fetch(`./modules/enhancedcombathud/scripts/themes/${themeName}.json`)
    if (!file.ok) file = await fetch(`./modules/enhancedcombathud/storage/themes/${themeName}.json`)
    if (!file.ok) {
      ui.notifications.error("Argon: Theme not found");
      file = await fetch(`./modules/enhancedcombathud/scripts/themes/argon.json`)
    }
    const json = await file.json();
    return json;
  }
}


