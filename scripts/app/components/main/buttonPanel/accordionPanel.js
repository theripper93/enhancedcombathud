import { ArgonComponent } from "../../component.js";
import { ButtonPanel } from "./buttonPanel.js";

export class AccordionPanel extends ArgonComponent {
    constructor({ accordionPanelCategories, id }) {
        super();
        this._subPanels = accordionPanelCategories;
        this._id = id ?? null;
        this.saveState = foundry.utils.debounce(this.saveState, 100);
    }

    get classes() {
        return ["features-container", "is-spells"];
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
            subPanels: this._subPanels.map((panel) => panel.visible),
        };
        ui.ARGON.setPanelState(state, this);
    }

    restoreState() {
        if (!this.id) return;
        const state = ui.ARGON.getPanelState(this);
        if (!state) return;
        this.toggle(state.visible, true);
        for (let i = 0; i < state.subPanels.length; i++) {
            this._subPanels[i]?.toggle(state.subPanels[i], true);
        }
    }

    updateItem(item) {
        if (!this._subPanels) return;
        for (const panel of this._subPanels) {
            panel.updateItem(item);
        }
    }

    async toggleDefaults() {
        let totalActionBarWidth = ui.ARGON.actionBarWidth;
        for (const panel of this._subPanels) {
            totalActionBarWidth -= panel.totalWidth;
            if (totalActionBarWidth < 0) break;
            panel.toggle(true);
        }
    }

    async _renderInner() {
        await super._renderInner();
        this._subPanels.forEach((panel) => {
            this.element.appendChild(panel.element);
            panel._parent = this;
        });
        const promises = this._subPanels.map((panel) => panel.render());
        await Promise.all(promises);
        await this.toggleDefaults();
        this.restoreState();
    }
}
