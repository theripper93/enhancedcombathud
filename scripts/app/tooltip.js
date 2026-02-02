import { PARTIALS_PATH } from "./CoreHud.js";

export class Tooltip {
    constructor(tooltipData, triggerElement, orientation, locked = false) {
        this.element = document.createElement("div");
        this.element.classList.add(...this.classes);
        if (tooltipData.classes) this.element.classList.add(...tooltipData.classes);
        this._tooltipData = tooltipData;
        this._triggerElement = triggerElement;
        this._orientation = orientation ?? foundry.helpers.interaction.TooltipManager.TOOLTIP_DIRECTIONS.UP; //orientation;
        this._locked = locked;
    }

    get template() {
        return `${PARTIALS_PATH}Tooltip.hbs`;
    }

    get classes() {
        return ["ech-tooltip"];
    }

    async getData() {
        return this._tooltipData;
    }

    get directionClass() {
        switch(this._orientation) {
            case foundry.helpers.interaction.TooltipManager.TOOLTIP_DIRECTIONS.UP:
                return "ech-tooltip-up";
            case foundry.helpers.interaction.TooltipManager.TOOLTIP_DIRECTIONS.DOWN:
                return "ech-tooltip-down";
            case foundry.helpers.interaction.TooltipManager.TOOLTIP_DIRECTIONS.LEFT:
                return "ech-tooltip-left";
            case foundry.helpers.interaction.TooltipManager.TOOLTIP_DIRECTIONS.RIGHT:
                return "ech-tooltip-right";
        }
        return "";
    }

    async render(...args) {
        await this._renderInner();
        const details = this.element.querySelector(".ech-tooltip-details");
        if (details) {
            let closestMultiplier = 3;
            [2, 3].forEach((multiplier) => {
                if (details.children.length % multiplier === 0) closestMultiplier = multiplier;
            });
            details.style.gridTemplateColumns = `repeat(${Math.min(details.children.length, closestMultiplier)}, 1fr)`;
        }

        const body = this.element.querySelector('.ech-tooltip-body');
        if (!body.textContent.trim()) {
            body.style.display = 'none';
        }

        ui.ARGON._tooltip = this;
        game.tooltip.activate(this._triggerElement, { html: this.element, cssClass: `ech-tooltip-container ${this.directionClass}` , direction: this._orientation });
        const scale = game.settings.get("enhancedcombathud", "tooltipScale");
        document.querySelector(".ech-tooltip-container").style.setProperty('--ech-tooltip-scale', scale);
        return this.element;
    }

    async _renderInner() {
        const data = await this.getData();
        this._data = data;
        const rendered = await (foundry.applications?.handlebars?.renderTemplate ?? renderTemplate) (this.template, data);
        const tempElement = document.createElement("div");
        tempElement.innerHTML = rendered;
        this.element.innerHTML = tempElement.firstElementChild.innerHTML;
        if (!data.subtitle) this.element.classList.add("hide-subtitle");
    }


    setScrollDelta(delta) {
        if (!this._scrollableElement) return;
        this._scrollableElement.scrollTop += delta;
    }

    _destroy(force = false) {
        if (ui.ARGON._tooltip === this) ui.ARGON._tooltip = null;
        if (force) {
            this.element.remove();
            return;
        }
        this.element.animate([{ opacity: 1 }, { opacity: 0 }], {
            duration: 300,
            easing: "ease-in-out",
        }).onfinish = () => {
            this.element.remove();
        };
    }
}
