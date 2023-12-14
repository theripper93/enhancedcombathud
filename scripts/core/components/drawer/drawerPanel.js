import {ArgonComponent} from "../component.js";
import { localize } from "../../hud.js";

export class DrawerPanel extends ArgonComponent {

    get classes() {
        return ["ability-menu"];
    }

    get elementType() {
        return "div";
    }

    get title() {
        return "Drawer Panel";
    }

    get categories() {
        return [];
    }

    async getData() {
        this._processCategories();
        return {
            title: this.title,
            categories: this._categories,
        };
    }

    _processCategories() {
        let categories = this.categories;
        const title = this.title;
        if (!categories[0]?.categories) categories = [{title, categories}];
        this._categories = categories
    }

    async activateListeners(html) {
        html.querySelectorAll(".ability-toggle .ability.ability-title").forEach(el => {
            el.addEventListener("click", (event) => {
                const index = el.dataset.index;
                this._expandPanel(index);
            });
        })
    }

    _expandPanel(index) {
        if(isNaN(index)) return;
        const el = this.element.querySelector(`.ability-toggle .ability.ability-title[data-index="${index}"]`);
        const element = ui.ARGON.element[0];
        const ratio = parseFloat(element?.style.transform.split(" ")[0].replace(/[^0-9.]+/g, "") ?? 1);
        const scaleHeight = (window.innerHeight - (document.querySelector(".portrait-hud")?.offsetHeight || 200) * ratio) / ratio - 70;
        let expanded = null;
        this.element.querySelectorAll(`.ability-toggle .ability.ability-title`).forEach(el => el.classList.remove("active"));
        this.element.querySelectorAll(`.collapsible-panel`).forEach(el => {
            if(el.style.maxHeight !== "0px") expanded = el.dataset.index;
            el.style.maxHeight = "0px"
        });
        if (expanded != index) {
            ui.ARGON._lastExpandedDrawer = index;
            this.element.querySelector(`.collapsible-panel[data-index="${index}"]`).style.maxHeight = `${scaleHeight}px`;
            el.classList.add("active");
        } else {
            ui.ARGON._lastExpandedDrawer = null;
        }
        document.body.classList.toggle("ech-show-ability-menu", expanded != index);
    }

    async _renderInner() {
        await super._renderInner();
        const buttonPromises = [];
        for (const panel of this._categories) {
            const panelIndex = this._categories.indexOf(panel);
            for (const category of panel.categories) {
                const index = panel.categories.indexOf(category);
                const container = this.element.querySelector(`.collapsible-panel[data-index="${panelIndex}"] .ability-title[data-index="${index}"]`);
                if (!container) continue;
                if (!category.buttons) continue;
                const buttons = [...category.buttons].reverse();
                for (const button of buttons) {
                    button._parent = this;
                    container.after(button.element);
                    button.setGrid(category.gridCols);
                    button.setAlign(category.captions.map((caption) => caption.align));
                    buttonPromises.push(button.render());
                }
            }
        }
        await Promise.all(buttonPromises);
        this.element.querySelectorAll(`.collapsible-panel`).forEach(el => {el.style.maxHeight = "0px"});
        this._expandPanel(ui.ARGON._lastExpandedDrawer);
        return this.element;
    }
}