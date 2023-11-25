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

  async getData(){
    return {};
  }

  async _renderInner() {
    this.element.innerHTML = (await renderTemplate(this.template, await this.getData())).innerHTML;
    this.activateListeners(this.element);
  }
  
  async activateListeners(html) { }
}