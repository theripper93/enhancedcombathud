import { ArgonComponent } from "../../component.js";

export class AccordionPanelCategory extends ArgonComponent{
  constructor ({label, uses = {}, buttons}) {
    super();
    this.element.dataset.iscontainer = true;
    this._label = label;
    if(!uses.max) uses.max = uses.value;
    this._uses = uses;
    this._buttons = buttons;
  }

  get classes() {
    return ["features-accordion"]
  }

  get buttonContainer() {
    return this.element.querySelector(".features-accordion-content");
  }

  get visible() {
    return this.element.classList.contains("show");
  }

  get label() {
    return this._label;
  }

  get uses() {
    return this._uses;
  }

  get buttons() {
    return this._buttons;
  }

  async getData() {
    return {
      label: this.label,
    }
  }

  setUses() {
    if(!Number.isNumeric(this.uses.value)) return;
    const usesElement = this.buttonContainer.querySelector(".feature-spell-slots");
    if (this.uses.value === Infinity) {
      usesElement.innerHTML = `<span class="spell-slot spell-cantrip"><i class="fas fa-infinity"></i></span>`;
      return;
    }
    for (let index = 0; index < this.uses.max; index++) {
      //spellSlots.push(index < spellSlotDetails.value);
      usesElement.innerHTML += `<span class="spell-slot spell-${
        index < this.uses.max - this.uses.value
          ? "used"
          : "available"
      }"></span>`;
    }
  }

  async activateListeners(html) {
    this.element.querySelector(".feature-accordion-title").addEventListener("click", () => {
      this.toggle();
    });
  }

  toggle(toggle) {
    if (toggle === undefined) toggle = !this.visible;
    this.element.classList.toggle("show", toggle);
    this.element.style.width = toggle ? `${this._realWidth}px` : "0px";
  }

  async _renderInner() {
    await super._renderInner();
    const buttonContainer = this.buttonContainer;
    this._buttons.forEach(button => {
      buttonContainer.appendChild(button.element);
    });
    const promises = this._buttons.map(button => button.render());
    await Promise.all(promises);
    this.setUses();
    if (this._buttons.length < 3) {
      buttonContainer.style.gridTemplateColumns = `repeat(${this._buttons.length}, 1fr)`;
    }
    this.element.classList.add("show");
    const width = this.element.offsetWidth;
    this.element.style.width = `0px`;
    this.element.classList.remove("show");
    this._realWidth = width;
  }
}
