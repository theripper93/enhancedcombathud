import { ArgonComponent } from "../../component.js";

export class AccordionPanelCategory extends ArgonComponent {
    constructor({ label, uses = {}, buttons }) {
        super();
        this.element.dataset.iscontainer = true;
        this._label = label;
        if (typeof uses === "object" && !uses.max) uses.max = uses.value;
        this._uses = uses;
        this._buttons = buttons;
        ui.ARGON._accordionPanelCategories.add(this);
        this.setUses = foundry.utils.debounce(this.setUses, 100);
    }

    get classes() {
        return ["features-accordion"];
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
        return typeof this._uses === "object" ? this._uses : this._uses();
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
        };
    }

    setVisibility() {}

    updateItem(item) {
        if (!this._buttons) return;
        for (const button of this._buttons) {
            if (button.item === item) button.render();
        }
    }

    setUses() {
        this._setUses();
    }

    _setUses() {
        if (!Number.isNumeric(this.uses.value)) return;
        const usesElement = this.buttonContainer.querySelector(".feature-spell-slots");
        usesElement.innerHTML = "";
        if (this.uses.value === Infinity) {
            usesElement.innerHTML = `<span class="spell-slot spell-cantrip"><i class="fas fa-infinity"></i></span>`;
            return;
        }
        for (let index = 0; index < this.uses.max; index++) {
            //spellSlots.push(index < spellSlotDetails.value);
            usesElement.innerHTML += `<span class="spell-slot spell-${index < this.uses.max - this.uses.value ? "used" : "available"}"></span>`;
        }
    }

    async activateListeners(html) {
        this.element.querySelector(".feature-accordion-title").addEventListener("click", () => {
            this.toggle();
        });
    }

    toggle(toggle, noTransition = false) {
        if (toggle === undefined) toggle = !this.visible;
        if (noTransition) {
            this.element.style.transition = "none";
            this.buttonContainer.style.transition = "none";
        }
        this.element.classList.toggle("show", toggle);
        this.element.style.width = toggle ? `${this._realWidth}px` : "0px";
        if (noTransition)
            setTimeout(() => {
                this.element.style.transition = null;
                this.buttonContainer.style.transition = null;
            }, 1);
        this.parent.saveState();
    }

    get buttonMultipliers() {
        return [2, 3, 5, 7];
    }

    async _renderInner() {
        await super._renderInner();
        const buttonContainer = this.buttonContainer;
        this._buttons.forEach((button) => {
            button._parent = this;
            buttonContainer.appendChild(button.element);
        });
        const promises = this._buttons.map((button) => button.render());
        await Promise.all(promises);
        this._setUses();
        let closestMultiplier = 0;
        this.buttonMultipliers.forEach((multiplier) => {
            if (this._buttons.length % multiplier === 0) closestMultiplier = multiplier;
        });
        if (this._buttons.length < 3) {
            buttonContainer.style.gridTemplateColumns = `repeat(${this._buttons.length}, 1fr)`;
        } else if (closestMultiplier) {
            buttonContainer.style.gridTemplateColumns = `repeat(${closestMultiplier}, 1fr)`;
        }
        this.element.style.transition = "none";
        this.element.style.width = `unset`;
        await new Promise((resolve) => setTimeout(resolve, 1));
        const width = this.element.offsetWidth;
        this._realWidth = width;
        this.element.style.width = `0px`;
        this.element.style.transition = null;
    }
}
