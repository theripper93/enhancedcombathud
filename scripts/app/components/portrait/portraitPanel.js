import { HandlebarsApplication, mergeClone } from "../../../lib/utils.js";
import { ArgonComponent } from "../component.js";
import {Effect} from "./effect.js";

export class PortraitPanel extends ArgonComponent {
    constructor(...args) {
        super(...args);
        this.refresh = foundry.utils.debounce(this.refresh.bind(this), 100);
    }

    get classes() {
        return ["portrait-hud"];
    }

    get name() {
        return this.actor.name;
    }

    get image() {
        return this.actor.img;
    }

    get description() {
        return "";
    }

    get isDead() {
        return false;
    }

    get isDying() {
        return false;
    }

    get deathIcon() {
        return "fas fa-skull";
    }

    get successes() {
        return 0;
    }

    get failures() {
        return 0;
    }

    get configurationTemplate() {
        return null;
    }

    get effectClass() {
        return Effect;
    }

    async getEffects() {
        const effects = [];
        for(const effect of this.actor.temporaryEffects) {
            effects.push({img: effect.img, name: effect.name, uuid: effect.uuid,tooltip: await foundry.applications.ux.TextEditor.implementation.enrichHTML(effect.description)});
        }
        return effects;
    }

    async getData() {
        const data = {
            name: this.name,
            image: this.image,
            description: this.description,
            isDead: this.isDead,
            isDying: this.isDying,
            deathIcon: this.deathIcon,
            successes: this.successes,
            failures: this.failures,
            playerDetailsBottom: game.settings.get("enhancedcombathud", "playerDetailsBottom"),
        };
        return data;
    }

    async activateListeners(html) {
        super.activateListeners(html);
        html.querySelector(".death-save-btn").addEventListener("click", this._onDeathSave.bind(this));
        if (this.configurationTemplate) html.querySelector("#argon-actor-config")?.addEventListener("click", this._onConfigure.bind(this));
        else html.querySelector(".portrait-actor-configuration")?.remove();
        const toggleMinimizeButton = this._buttons.find((button) => button.id === "toggle-minimize");
        if (toggleMinimizeButton) {
            toggleMinimizeButton.element.addEventListener("click", (e) => {
                toggleMinimizeButton.element.classList.toggle("fa-flip-vertical");
            });
        }
    }

    async _onDeathSave(event) {
        console.error("Argon: PortraitPanel._onDeathSave not implemented");
    }

    async getStatBlocks() {
        return [];
    }

    async _getButtons() {
        return [
            {
                id: "roll-initiative",
                icon: "fas fa-dice-d20",
                label: "Roll Initiative",
                onClick: async (e) => {
                    if(this.token.combatant?.initiative !== undefined) {
                        const response = await foundry.applications.api.DialogV2.confirm({
                            window: {
                                title: game.i18n.localize(`enhancedcombathud.confirmRerollInitiativeTitle`),
                            },
                            content: game.i18n.localize(`enhancedcombathud.confirmRerollInitiativeContent`),
                            defaultYes: false,
                        });
                        if (!response) return;
                    } 
                    this.actor.rollInitiative({ rerollInitiative: true, createCombatants: true })
                },
            },
            {
                id: "open-sheet",
                icon: "fas fa-suitcase",
                label: "Open Character Sheet",
                onClick: (e) => this.actor.sheet.render(true),
            },
            {
                id: "toggle-minimize",
                icon: "fas fa-caret-down",
                label: "Minimize",
                onClick: (e) => ui.ARGON.toggleMinimize(),
            },
        ];
    }

    refresh() {
        this.render();
    }

    async _renderInner(data) {
        await super._renderInner(data);
        const statBlocks = await this.getStatBlocks();
        for (const block of statBlocks) {
            const sb = document.createElement("div");
            sb.classList.add("portrait-stat-block");
            for (const stat of block) {
                const span = document.createElement("span");
                span.innerText = stat.text;
                span.style.color = stat.color;
                if (stat.id != undefined) span.id = stat.id;
                sb.appendChild(span);
            }
            this.element.appendChild(sb);
        }
        this._buttons = await this._getButtons();
        const buttonsContainer = this.element.querySelector(".player-buttons");
        for (const button of this._buttons) {
            const btn = document.createElement("div");
            btn.classList.add("player-button");
            btn.innerHTML = `<i class="${button.icon}"></i>`;
            btn.dataset.tooltip = button.label;
            btn.onclick = button.onClick;
            button.element = btn;
            buttonsContainer.appendChild(btn);
        }
        const deathContainer = this.element.querySelector(".death-saves");
        deathContainer.classList.remove("no-buttons");
        if (!this.isDead && !this.isDying) {
            deathContainer.classList.add("hidden");
        } else {
            if (this.isDead) {
                deathContainer.childNodes.forEach((node) => node.classList && node.classList.add("hidden"));
                deathContainer.classList.add("no-buttons");
                const deathBtn = deathContainer.querySelector(".death-save-btn");
                deathBtn.classList.remove("hidden");
                deathBtn.style.pointerEvents = "none";
            }
        }
        const effectsContainer = this.element.querySelector(".effects-container");
        const effects = await this.getEffects();
        const effectElements = effects.map((effect) => new this.effectClass(effect));
        effectsContainer.innerHTML = "";
        for (const effect of effectElements) {
            effect.element.addEventListener("contextmenu", async (event) => {
                event.preventDefault();
                event.stopPropagation();
                const uuid = effect.effect.uuid;
                const effectToDelete = await fromUuid(uuid);
                const statusEffect = CONFIG.statusEffects.find((s) => s.img === effectToDelete.img);

                const response = await foundry.applications.api.DialogV2.confirm({
                    window: {
                        title: game.i18n.localize(`enhancedcombathud.deleteEffectTitle`),
                    },
                    content: game.i18n.localize(`enhancedcombathud.deleteEffectContent`) + game.i18n.localize(effect?.label ?? statusEffect?.name ?? "") + "?",
                    defaultYes: false,
                });
                if (!response) return;
                if (!effectToDelete) {
                    this.token?.toggleEffect(uuid);
                    return;
                }
                await effectToDelete.delete();
                this.render(true);
            });
            effectsContainer.appendChild(effect.element);
        }
        await Promise.all(effectElements.map((effect) => effect.render()));
    }

    async _onConfigure(event) {
        event.preventDefault();
        const template = this.configurationTemplate;

        new (getArgonPortraitConfig(template))(this.actor).render({force: true});
    }
}

function getArgonPortraitConfig(template) {
    return class ArgonPortraitConfig extends HandlebarsApplication {
        constructor(actor) {
            super();
            this.actor = actor;
        }

        get title() {
            return `${game.i18n.localize("Configure")} ${this.actor.name}`;
        }

        static get DEFAULT_OPTIONS() {
            return mergeClone(super.DEFAULT_OPTIONS, {
                tag: "form",
                id: "argon-actor-config-form",
                window: {
                    contentClasses: ["standard-form"],
                },
                form: {
                    handler: this.#onSubmit,
                    closeOnSubmit: true,
                },
                position: {
                    width: 400
                }
            });
        }

        static get PARTS() {
            return {
                content: {
                    template: template,
                    classes: ["standard-form", "scrollable"],
                },
                footer: {
                    template: "templates/generic/form-footer.hbs",
                }
            };
        }

        _prepareContext(...args) {
            const saveButton = {
                type: "submit",
                action: "submit",
                icon: "fas fa-save",
                label: "Save",
            };
            return { actor: this.actor, ...this.actor, buttons: [saveButton] };
        }

        static async #onSubmit() {
            const form = this.element;
            const formData = new foundry.applications.ux.FormDataExtended(form).object;

            await this.actor.update(formData);
            ui.ARGON.refresh();
        }
    }
}