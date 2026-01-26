import {ArgonComponent} from "../../component.js";
import { TargetPicker } from "../../../targetPicker.js";

export class ItemButton extends ArgonComponent{
  constructor ({item, isWeaponSet=false, isPrimary=false, inActionPanel=undefined}) {
    super();
    this._item = item;
    this._isWeaponSet = isWeaponSet;
    this._isPrimary = isPrimary;
    this._inActionPanel = inActionPanel ?? isWeaponSet;
    if (this.isWeaponSet) this.hookId = Hooks.on("argon-onSetChangeUpdateItem", this._onSetChange.bind(this));
    ui.ARGON.addItemButtons(this);
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

  get quantitySecondary() {
    return null;
  }

  get ranges(){
    return {
      normal: null,
      long: null
    }
  }

  get targets() {
    return 0;
  }

  get useTargetPicker() {
    return game.settings.get("enhancedcombathud", "rangepicker");
  }

  get useRangeFinder() {
    return game.Levels3DPreview?._active && game.settings.get("enhancedcombathud", "rangefinder");
  }

  get visible() {
    return !!this.item;
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
    if(!this.token || !this.useRangeFinder) return;
    showRangeRings(this.ranges.normal, this.ranges.long, this.token);
    showRangeFinder(this.ranges.normal, this.token);
  }

  async _onMouseLeave(event) {
    clearRanges();
    clearRangeFinders();
  }

  async _onPreLeftClick(event) {
    if (this.useTargetPicker && this.targets > 0) {
      isTargetPicker = true;
      const picker = new TargetPicker({token: this.token, targets: this.targets, ranges: this.ranges});
      const result = await picker.promise;
      isTargetPicker = false;
      if(!result) return;
    }
    this._onLeftClick(event);
  }

  async _onLeftClick(event) {
    console.error("ActionButton._onLeftClick not implemented");
  }

  async _onRightClick(event) {
  }

  async _renderInner() {
    await super._renderInner();
    if (!this.item) {
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

let isTargetPicker = false;

const rangeRings = {
  normal: null,
  long: null
}

export function clearRanges(force = false) {
  if(!game.Levels3DPreview?._active) return;
  if(isTargetPicker && !force) return;
  if (rangeRings.normal) {
    rangeRings.normal.remove();
    rangeRings.normal = null;
  }
  if (rangeRings.long) {
    rangeRings.long.remove();
    rangeRings.long = null;
  }
}

export function showRangeRings(normal, long, object, tokenSizeOffset) {
  if(!game.Levels3DPreview?._active) return;
  clearRanges(true);
  if (normal) rangeRings.normal = new game.Levels3DPreview.CONFIG.entityClass.RangeRingEffect(object, normal + tokenSizeOffset);
  if (long) rangeRings.long = new game.Levels3DPreview.CONFIG.entityClass.RangeRingEffect(object, long + tokenSizeOffset, "#ff0000");
}

export async function showRangeFinder(range, object){
  if(!game.Levels3DPreview?._active || !range) return;
  const sett = game.settings.get("enhancedcombathud", "rangefinder")
  const showRangeFinder = sett != "none";
  if(!showRangeFinder) return;
  const RangeFinder = game.Levels3DPreview.CONFIG.entityClass.RangeFinder; 
  game.Levels3DPreview.rangeFinders.forEach(rf => {
        rf.destroy();
  })
  const visTokens = canvas.tokens.placeables.filter(t => t.visible)
  for(let t of visTokens){
    const dist = game.Levels3DPreview.helpers.ruler3d.measureMinTokenDistance(game.Levels3DPreview.tokens[object.id],game.Levels3DPreview.tokens[t.id])
    const distDiff = range - dist;
    if(distDiff >= 0){
      new RangeFinder(t, {sources: [object], text: ""})
    }else{
      new RangeFinder(t, {
        sources: [object],
        text: `-${Math.abs(distDiff.toFixed(2))}${canvas.scene.grid.units}`,
        style: {
          color: 'rgb(210 119 119);',
        }
      })
    }
  }
  
}

export function clearRangeFinders() {
  if(!game.Levels3DPreview?._active) return;
  game.Levels3DPreview.rangeFinders.forEach(rf => {rf.destroy();})
}