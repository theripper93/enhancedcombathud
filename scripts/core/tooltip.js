import { PARTIALS_PATH } from "./hud.js";

export class Tooltip {
    constructor(tooltipData, triggerElement, orientation, locked = false) {
        this.element = document.createElement("div");
        this.element.classList.add(...this.classes);
        if (tooltipData.classes) this.element.classList.add(...tooltipData.classes);
        this._tooltipData = tooltipData;
        this._triggerElement = triggerElement;
        this._orientation = orientation;
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

    async render(...args) {
        await this._renderInner();
        const activeTooltips = document.querySelectorAll(".ech-tooltip") || [];
        activeTooltips.forEach((tooltip) => !tooltip.classList.contains("ech-locked") && tooltip.remove());

        this.element.style.top = 0;
        this.element.style.left = 0;
        document.querySelector("body").append(this.element);
        this.element.classList.add("ech-show-tooltip");
        if (this._locked) {
            this.element.classList.add("ech-locked");
            this.element.style.pointerEvents = "all";
            this.element.addEventListener("mouseleave", () => this._destroy());
        }
        const details = this.element.querySelector(".ech-tooltip-details");
        let closestMultiplier = 3;
        [2, 3].forEach((multiplier) => {
            if (details.children.length % multiplier === 0) closestMultiplier = multiplier;
        });

        details.style.gridTemplateColumns = `repeat(${Math.min(details.children.length, closestMultiplier)}, 1fr)`;
        this.setPosition(this._orientation);
        this._scrollableElement = this.element.querySelector(".ech-tooltip-description");
        ui.ARGON._tooltip = this;
        return this.element;
    }

    async _renderInner() {
        const data = await this.getData();
        this._data = data;
        const rendered = await renderTemplate(this.template, data);
        const tempElement = document.createElement("div");
        tempElement.innerHTML = rendered;
        this.element.innerHTML = tempElement.firstElementChild.innerHTML;
        if (!data.subtitle) this.element.classList.add("hide-subtitle");
    }

    setPosition(orientation, scale, margin = 10) {
        const tooltipElement = this.element;
        const triggeringElement = this._triggerElement;
        orientation ??= TooltipManager.TOOLTIP_DIRECTIONS.UP;
        scale ??= 1;
        scale *= game.settings.get("enhancedcombathud", "tooltipScale");
        if (!tooltipElement || !triggeringElement) return;
        const tooltipRect = tooltipElement.getBoundingClientRect();
        const triggeringRect = triggeringElement.getBoundingClientRect();

        const triggerCenterX = triggeringRect.left + triggeringRect.width / 2;
        const triggerCenterY = triggeringRect.top + triggeringRect.height / 2;

        switch (orientation) {
            case TooltipManager.TOOLTIP_DIRECTIONS.UP:
                tooltipElement.style.transformOrigin = "bottom center";
                break;
            case TooltipManager.TOOLTIP_DIRECTIONS.DOWN:
                tooltipElement.style.transformOrigin = "top center";
                break;
            case TooltipManager.TOOLTIP_DIRECTIONS.LEFT:
                tooltipElement.style.transformOrigin = "center right";
                break;
            case TooltipManager.TOOLTIP_DIRECTIONS.RIGHT:
                tooltipElement.style.transformOrigin = "center left";
                break;
            case TooltipManager.TOOLTIP_DIRECTIONS.CENTER:
                tooltipElement.style.transformOrigin = "center center";
                break;
            default:
                console.error("Invalid orientation:", orientation);
                return;
        }

        tooltipElement.style.transform = `scale(${scale})`;
        const marginLeft = margin || 0;
        const marginTop = margin || 0;

        let left = 0;
        let top = 0;

        switch (orientation) {
            case TooltipManager.TOOLTIP_DIRECTIONS.UP:
                left = triggerCenterX - tooltipRect.width / 2;
                top = triggeringRect.top - tooltipRect.height - marginTop;
                break;
            case TooltipManager.TOOLTIP_DIRECTIONS.DOWN:
                top = triggeringRect.bottom + marginTop;
                left = triggerCenterX - tooltipRect.width / 2;
                break;
            case TooltipManager.TOOLTIP_DIRECTIONS.LEFT:
                left = triggeringRect.left - tooltipRect.width - marginLeft;
                top = triggerCenterY - tooltipRect.height / 2;
                break;
            case TooltipManager.TOOLTIP_DIRECTIONS.RIGHT:
                left = triggeringRect.right + marginLeft;
                top = triggerCenterY - tooltipRect.height / 2;
                break;
            case TooltipManager.TOOLTIP_DIRECTIONS.CENTER:
                left = triggerCenterX - tooltipRect.width / 2;
                top = triggerCenterY - tooltipRect.height / 2;
                break;
            default:
                console.error("Invalid orientation:", orientation);
        }

        left = Math.max(0, left);
        top = Math.max(0, top);

        tooltipElement.style.left = left + "px";
        tooltipElement.style.top = top + "px";
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
