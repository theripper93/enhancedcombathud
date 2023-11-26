import { PARTIALS_PATH } from "../hud.js";

export class ArgonComponent{
  constructor () {
    this.element = document.createElement(this.elementType);
    this.element.classList.add(...this.classes);
  }

  get actor() {
    return ui.ARGON._actor;
  }

  get token() {
    return ui.ARGON._token;
  }

  get template() {
    const isAncestorComponent = Object.getPrototypeOf(this.constructor) === ArgonComponent;
    return `${PARTIALS_PATH}${isAncestorComponent ? this.constructor.name : Object.getPrototypeOf(this.constructor).name}.hbs`
  }

  get classes(){
    return [];
  }

  get elementType(){
    return "div";
  }

  get colorScheme() {
    return null;
  }

  get visible() {
    return true;
  }

  setColorScheme() {
    if(this.colorScheme === null) return;
    switch (this.colorScheme) {
      case 1: this.element.classList.add("bonus-action"); break;
      case 2: this.element.classList.add("free-action"); break;
      case 3: this.element.classList.add("reaction"); break;
      case 4: this.element.classList.add("end-turn"); break;
    }
  }

  setVisibility() {
    this.element.classList.toggle("hidden", !this.visible);
  }

  async getData(){
    return {};
  }

  async render() {
    await this._renderInner();
    await this.activateListeners(this.element);
    return this.element;
  }

  async _renderInner() {
    const data = await this.getData();
    const rendered = await renderTemplate(this.template, data);
    const tempElement = document.createElement("div");
    tempElement.innerHTML = rendered;
    this.element.innerHTML = tempElement.firstElementChild.innerHTML;
    this.setColorScheme();
    this.setVisibility();
  }
  
  async activateListeners(html) { }
}