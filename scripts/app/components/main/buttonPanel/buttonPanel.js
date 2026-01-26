import { ArgonComponent } from "../../component.js";

export class ButtonPanel extends ArgonComponent {
    constructor({ buttons, id }) {
        super();
        this.element.dataset.iscontainer = true;
        this._id = id ?? null;
        this._buttons = buttons;
        this.saveState = foundry.utils.debounce(this.saveState, 100);
    }

    get classes() {
        return ["features-container"];
    }

    get visible() {
        return this.element.classList.contains("show");
    }

    get id() {
        return this._id;
    }

    setVisibility() {}

    toggle(toggle, noTransition = false) {
        if (toggle === undefined) toggle = !this.visible;
        if (toggle) ui.ARGON.collapseAllPanels();
        if (noTransition) this.element.style.transition = "none";
        this.element.classList.toggle("show", toggle);
        if (noTransition) setTimeout(() => (this.element.style.transition = null), 1);
        this.saveState();
    }

    saveState() {
        if (!this.id) return;
        const state = {
            visible: this.visible,
        };
        ui.ARGON.setPanelState(state, this);
    }

    restoreState() {
        if (!this.id) return;
        const state = ui.ARGON.getPanelState(this);
        if (!state) return;
        this.toggle(state.visible, true);
    }

    updateItem(item) {
        if (!this._buttons) return;
        for (const button of this._buttons) {
            if (button.item === item) button.render();
        }
    }

    async _renderInner() {
        await super._renderInner();
        this._buttons.forEach((button) => {
            button._parent = this;
            this.element.appendChild(button.element);
        });
        const promises = this._buttons.map((button) => button.render());
        await Promise.all(promises);
        this.restoreState();
    }
}
