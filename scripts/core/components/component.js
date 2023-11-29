import { PARTIALS_PATH } from "../hud.js";
import { Tooltip } from "../tooltip.js";

export class ArgonComponent {
    constructor() {
        this.element = document.createElement(this.elementType);
        this.element.classList.add(...this.classes);
        this._tooltip = null;
        this._parent = null;
    }

    get parent() {
        return this._parent;
    }

    get actor() {
        return ui.ARGON._actor;
    }

    get token() {
        return ui.ARGON._token;
    }

    get template() {
        const isAncestorComponent = Object.getPrototypeOf(this.constructor) === ArgonComponent;
        return `${PARTIALS_PATH}${isAncestorComponent ? this.constructor.name : Object.getPrototypeOf(this.constructor).name}.hbs`;
    }

    get classes() {
        return [];
    }

    get elementType() {
        return "div";
    }

    get colorScheme() {
        return null;
    }

    get visible() {
        return true;
    }

    get hasTooltip() {
        return false;
    }

    get tooltipOrientation() {
        return null;
    }

    setColorScheme() {
        if (this.colorScheme === null) return;
        switch (this.colorScheme) {
            case 1:
                this.element.classList.add("bonus-action");
                break;
            case 2:
                this.element.classList.add("free-action");
                break;
            case 3:
                this.element.classList.add("reaction");
                break;
            case 4:
                this.element.classList.add("end-turn");
                break;
        }
    }

    setVisibility() {
        this.element.classList.toggle("hidden", !this.visible);
    }

    /**
     * @typedef {Object} TooltipData
     * @property {string} title - The name or title of the item.
     * @property {string} description - The detailed description of the item, enriched as HTML content.
     * @property {string} subtitle - A brief subtitle providing additional context about the item.
     * @property {Array<{ label: string, value: any }>} details - An array of objects containing specific details about the item.
     * @property {string} propertiesLabel - The label for the properties section.
     * @property {Array<{ label: string, primary?: boolean, secondary?: boolean }>} properties - An array of objects representing the properties of the item.
     * @property {Array<string>} footerText - An array of strings providing additional footer text.
     */

    async getTooltipData() {
        return null;
    }

    async getData() {
        return {};
    }

    async activateTooltipListeners() {
        if (!game.settings.get("enhancedcombathud", "showTooltips")) return;
        const html = this.element;
        html.onmouseenter = this._onTooltipMouseEnter.bind(this);
        html.onmouseleave = this._onTooltipMouseLeave.bind(this);
    }

    async _onTooltipMouseEnter(event) {
        const tooltipData = await this.getTooltipData();
        if (!tooltipData) return;
        this._tooltip = new Tooltip(tooltipData, this.element, this.tooltipOrientation);
        this._tooltip.render();
    }

    async _onTooltipMouseLeave(event) {
        if (!this._tooltip) return;
        this._tooltip._destroy();
        this._tooltip = null;
    }

    async render() {
        await this._renderInner();
        await this.activateListeners(this.element);
        if (this.hasTooltip) await this.activateTooltipListeners();
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

    async activateListeners(html) {}
}
