import { ActionPanel } from "../components/main/actionPanel.js";
import { AccordionPanel } from "../components/main/buttonPanel/accordionPanel.js";
import { AccordionPanelCategory } from "../components/main/buttonPanel/accordionPanelCategory.js";
import { MacroButton } from "../components/main/buttons/macroButton.js";
import { ButtonPanelButton } from "../components/main/buttons/buttonPanelButton.js";

export class MacroPanel extends ActionPanel {
    constructor(...args) {
        super(...args);
    }

    get label() {
        return "enhancedcombathud.hud.macro.name";
    }

    async _getButtons() {
        return [new MacroPanelButton({ color: "red" })];
    }
}

class MacroPanelButton extends ButtonPanelButton {
    constructor({ color, icon }) {
        super();
        this._type = "macro";
        this._color = color;
        this._icon = icon || `icons/svg/dice-target.svg`;
    }

    get hasContents() {
        return true;
    }

    get colorScheme() {
        return this._color;
    }

    get id() {
        return `${this.type}-${this.color}`;
    }

    get label() {
        return "enhancedcombathud.hud.macro.name";
    }

    get type() {
        return this._type;
    }

    get icon() {
        return this._icon;
    }

    async _getPanel() {
        const pages = [1, 2, 3, 4, 5];
        const accordionPanels = [];
        const pageLabel = game.i18n.localize("enhancedcombathud.hud.macro.page");
        for (const pageNum of pages) {
            const macros = game.user
                .getHotbarMacros(pageNum)
                .filter((m) => m.macro)
                .map((m) => m.macro);
            const buttons = macros.map((macro) => new MacroButton({ macro }));
            if (buttons.length) {
                accordionPanels.push(new AccordionPanelCategory({ label: `${pageLabel} ${pageNum}`, buttons }));
            }
        }
        return new AccordionPanel({ id: this.id, accordionPanelCategories: accordionPanels });
    }
}
