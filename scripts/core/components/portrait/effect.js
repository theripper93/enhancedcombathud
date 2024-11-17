import { ArgonComponent } from "../component.js";


export class Effect extends ArgonComponent {
    constructor(effect) {
        super();
        this.effect = effect;
    }

    get classes() {
        return ["effect-icon"];
    }

    get label() {
        return this.effect.name;
    }

    get icon() {
        return this.effect.img;
    }

    get colorScheme() {
        return 0;
    }

    get hasTooltip() {
        return true;
    }

    async getTooltipData() {
        return {
            title: this.label,
            description: await TextEditor.enrichHTML(this.effect.tooltip),
        };
    }

    async getData() {
        return {
            label: this.label,
            icon: this.icon,
        };
    }

    activateListeners(html) {
        this.element.onmouseup = this._onMouseUp.bind(this);
        this.element.onmousedown = this._onMouseDown.bind(this);
        this.element.onmouseenter = this._onMouseEnter.bind(this);
        this.element.onmouseleave = this._onMouseLeave.bind(this);
    }

    async _onMouseDown(event) {}

    async _onMouseUp(event) {
        event.preventDefault();
        event.stopPropagation();
        if (event.button === 0) this._onLeftClick(event);
        if (event.button === 2) this._onRightClick(event);
    }

    async _onMouseEnter(event) {}

    async _onMouseLeave(event) {}

    async _onLeftClick(event) {
        console.error("ActionButton._onLeftClick not implemented");
    }

    async _onRightClick(event) {}
}
