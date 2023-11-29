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

  get totalWidth() {
    return this._realWidth + this.element.querySelector(".feature-accordion-title").offsetHeight;
  }

  async getData() {
    return {
      label: this.label,
    }
  }

  setVisibility(){}

  updateItem(item) {
    if (!this._buttons) return;
    for (const button of this._buttons) {
      if (button.item === item) button.render();
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
      button._parent = this;
      buttonContainer.appendChild(button.element);
    });
    const promises = this._buttons.map(button => button.render());
    await Promise.all(promises);
    this.setUses();
    let closestMultiplier = 0;
    [2, 3, 5, 7].forEach(multiplier => {
      if (this._buttons.length % multiplier === 0) closestMultiplier = multiplier;
    });
    if (this._buttons.length < 3) {
      buttonContainer.style.gridTemplateColumns = `repeat(${this._buttons.length}, 1fr)`;
    } else if (closestMultiplier) {
      buttonContainer.style.gridTemplateColumns = `repeat(${closestMultiplier}, 1fr)`;
    }
    this.element.style.transition = "none";
    this.element.style.width = `unset`;
    const width = this.element.offsetWidth;
    this._realWidth = width;
    this.element.style.width = `0px`;
    this.element.style.transition = null;
  }
}
