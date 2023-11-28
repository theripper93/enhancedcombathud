import { PARTIALS_PATH } from "./hud.js";

export class Tooltip {
    constructor(tooltipData, triggerElement, orientation) {
        this.element = document.createElement("div");
        this.element.classList.add(...this.classes);
        this._tooltipData = tooltipData;
        this._triggerElement = triggerElement;
        this._orientation = orientation;
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
        activeTooltips.forEach((tooltip) => tooltip.remove());

        this.element.style.top = 0;
        this.element.style.left = 0;
        document.querySelector("body").append(this.element);
        this.element.classList.add("ech-show-tooltip");
        const details = this.element.querySelector(".ech-tooltip-details");
        let closestMultiplier = 3;
        [2, 3].forEach(multiplier => {
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
        if(!data.subtitle) this.element.classList.add("hide-subtitle");
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

        switch (orientation) {
            case TooltipManager.TOOLTIP_DIRECTIONS.UP:
                tooltipElement.style.left = triggerCenterX - tooltipRect.width / 2 + "px";
                tooltipElement.style.top = triggeringRect.top - tooltipRect.height - marginTop + "px";
                break;
            case TooltipManager.TOOLTIP_DIRECTIONS.DOWN:
                tooltipElement.style.left = triggerCenterX - tooltipRect.width / 2 + "px";
                tooltipElement.style.top = triggeringRect.bottom + marginTop + "px";
                break;
            case TooltipManager.TOOLTIP_DIRECTIONS.LEFT:
                tooltipElement.style.left = triggeringRect.left - tooltipRect.width - marginLeft + "px";
                tooltipElement.style.top = triggerCenterY - tooltipRect.height / 2 + "px";
                break;
            case TooltipManager.TOOLTIP_DIRECTIONS.RIGHT:
                tooltipElement.style.left = triggeringRect.right + marginLeft + "px";
                tooltipElement.style.top = triggerCenterY - tooltipRect.height / 2 + "px";
                break;
            case TooltipManager.TOOLTIP_DIRECTIONS.CENTER:
                tooltipElement.style.left = triggerCenterX - tooltipRect.width / 2 + "px";
                tooltipElement.style.top = triggerCenterY - tooltipRect.height / 2 + "px";
                break;
            default:
                console.error("Invalid orientation:", orientation);
        }
  }
  
  setScrollDelta(delta) {
    if(!this._scrollableElement) return;
    this._scrollableElement.scrollTop += delta;
  }

    _destroy(force = false) {
        if(ui.ARGON._tooltip === this) ui.ARGON._tooltip = null;
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
