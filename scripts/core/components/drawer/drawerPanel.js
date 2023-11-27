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
        return {
            title: this.title,
            categories: this.categories,
        };
    }

    async activateListeners(html) {
        html.querySelector(".ability-toggle").addEventListener("click", function (event) {
            document.body.classList.toggle("ech-show-ability-menu");
            const element = ui.ARGON.element[0];
            const ratio = parseFloat(element.style.transform.split(" ")[0].replace(/[^0-9.]+/g, ""));
            const scaleHeight = (window.innerHeight - document.querySelector(".portrait-hud").offsetHeight * ratio) / ratio - 70;
            document.querySelector(".ability-menu ul").style.maxHeight = document.body.classList.contains("ech-show-ability-menu") ? `${scaleHeight}px` : "0px";
        });
    }

    async _renderInner() {
        await super._renderInner();
        const buttonPromises = [];
        const categories = this.categories;
        for (const category of categories) {
            const index = categories.indexOf(category);
            const container = this.element.querySelector(`.ability-title[data-index="${index}"]`);
            if (!container) continue;
            if (!category.buttons) continue;
            const buttons = [...category.buttons].reverse();
            for (const button of buttons) {
                container.after(button.element);
                button.setGrid(category.gridCols);
                button.setAlign(category.captions.map((caption) => caption.align));
                buttonPromises.push(button.render());
            }
        }
        await Promise.all(buttonPromises);
        return this.element;
    }
}