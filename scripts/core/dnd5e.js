export function register() {
    Hooks.on("argonInit", (CoreHUD) => {
        if (game.system.id !== "dnd5e") return;
        const ARGON = CoreHUD.ARGON;

        const actionTypes = {
            action: ["action", "legendary"],
            bonus: ["bonus"],
            reaction: ["reaction", "reactiondamage", "reactionmanual"],
            free: ["special"],
        };

        const itemTypes = {
            spell: ["spell"],
            feat: ["feat"],
            consumable: ["consumable", "equipment", "loot", "weapon"],
        };

        async function getTooltipDetails(item, type) {
            let title, description, itemType, subtitle, target, range, dt;
            let damageTypes = [];
            let properties = [];
            let materialComponents = "";

            if (type == "skill") {
                title = CONFIG.DND5E.skills[item];
                description = this.hudData.skills[item].tooltip;
            } else if (type == "save") {
                title = CONFIG.DND5E.abilities[item];
                description = this.hudData.saves[item].tooltip;
            } else {
                if (!item || !item.system) return;

                title = item.name;
                description = item.system.description.value;
                itemType = item.type;
                target = item.labels?.target || "-";
                range = item.labels?.range || "-";
                properties = [];
                dt = item.labels?.damageTypes?.split(", ");
                damageTypes = dt && dt.length ? dt : [];
                materialComponents = "";

                switch (itemType) {
                    case "weapon":
                        subtitle = CONFIG.DND5E.weaponTypes[item.system.weaponType];
                        properties.push(CONFIG.DND5E.itemActionTypes[item.system.actionType]);
                        for (let [key, value] of Object.entries(item.system.properties)) {
                            let prop = value && CONFIG.DND5E.weaponProperties[key] ? CONFIG.DND5E.weaponProperties[key] : undefined;
                            if (prop) properties.push(prop);
                        }
                        break;
                    case "spell":
                        subtitle = `${item.labels.level} ${item.labels.school}`;
                        properties.push(CONFIG.DND5E.spellSchools[item.system.school]);
                        properties.push(item.labels.duration);
                        properties.push(item.labels.save);
                        for (let comp of item.labels.components.all) {
                            properties.push(comp.abbr);
                        }
                        if (item.labels.materials) materialComponents = item.labels.materials;
                        break;
                    case "consumable":
                        subtitle = CONFIG.DND5E.consumableTypes[item.system.consumableType];
                        properties.push(CONFIG.DND5E.itemActionTypes[item.system.actionType]);
                        break;
                    case "feat":
                        subtitle = item.system.requirements;
                        properties.push(CONFIG.DND5E.itemActionTypes[item.system.actionType]);
                        break;
                }
            }

            if (description) description = await TextEditor.enrichHTML(description);
            let details = [];
            if (target || range) {
                details = [
                    {
                        label: "enhancedcombathud.tooltip.target.name",
                        value: target,
                    },
                    {
                        label: "enhancedcombathud.tooltip.range.name",
                        value: range,
                    },
                ];
            }

            const tooltipProperties = [];
            if (damageTypes?.length) damageTypes.forEach((d) => tooltipProperties.push({label: d, primary: true}));
            if (properties?.length) properties.forEach((p) => tooltipProperties.push({label: p, secondary: true}));

            return { title, description, subtitle, details, properties: tooltipProperties, footerText: materialComponents };
        }

        class DND5ePortraitPanel extends ARGON.PORTRAIT.PortraitPanel {
            constructor(...args) {
                super(...args);
            }

            get description() {
                const { type, system } = this.actor;
                const actor = this.actor;
                const isNPC = type === "npc";
                const isPC = type === "character";
                if (isNPC) {
                    const creatureType = game.i18n.localize(CONFIG.DND5E.creatureTypes[actor.system.details.type.value] ?? actor.system.details.type.custom);
                    const cr = system.details.cr >= 1 || system.details.cr <= 0 ? system.details.cr : `1/${1 / system.details.cr}`;
                    return `CR ${cr} ${creatureType}`;
                } else if (isPC) {
                    const classes = Object.values(actor.classes)
                        .map((c) => c.name)
                        .join(" / ");
                    return `Level ${system.details.level} ${classes} (${system.details.race})`;
                } else {
                    return "";
                }
            }

            get isDead() {
                return this.isDying && this.actor.type !== "character";
            }

            get isDying() {
                return this.actor.system.attributes.hp.value <= 0;
            }

            get successes() {
                return this.actor.system.attributes?.death?.success ?? 0;
            }

            get failures() {
                return this.actor.system.attributes?.death?.failure ?? 0;
            }

            async _onDeathSave(event) {
                this.actor.rollDeathSave({});
            }

            async getStatBlocks() {
                const HPText = game.i18n
                    .localize("DND5E.HitPoints")
                    .split(" ")
                    .map((word) => word.charAt(0).toUpperCase())
                    .join("");
                const ACText = game.i18n
                    .localize("DND5E.ArmorClass")
                    .split(" ")
                    .map((word) => word.charAt(0).toUpperCase())
                    .join("");
                const SpellDC = game.i18n.localize("DND5E.SaveDC").replace("{ability}", "").replace("{dc}", "").trim();

                const hpColor = this.actor.system.attributes.hp.temp ? "#6698f3" : "rgb(0 255 170)";
                const tempMax = this.actor.system.attributes.hp.tempmax;
                const hpMaxColor = tempMax ? (tempMax > 0 ? "rgb(222 91 255)" : "#ffb000") : "rgb(255 255 255)";

                return [
                    [
                        {
                            text: `${this.actor.system.attributes.hp.value + (this.actor.system.attributes.hp.temp ?? 0)}`,
                            color: hpColor,
                        },
                        {
                            text: `/`,
                        },
                        {
                            text: `${this.actor.system.attributes.hp.max + (this.actor.system.attributes.hp.tempmax ?? 0)}`,
                            color: hpMaxColor,
                        },
                        {
                            text: HPText,
                        },
                    ],
                    [
                        {
                            text: ACText,
                        },
                        {
                            text: this.actor.system.attributes.ac.value,
                            color: "var(--ech-movement-baseMovement-background)",
                        },
                    ],
                    [
                        {
                            text: SpellDC,
                        },
                        {
                            text: this.actor.system.attributes.spelldc,
                            color: "var(--ech-movement-baseMovement-background)",
                        },
                    ],
                ];
            }
        }

        class DND5eDrawerPanel extends ARGON.DRAWER.DrawerPanel {
            constructor(...args) {
                super(...args);
            }

            get categories() {
                const abilities = this.actor.system.abilities;
                const skills = this.actor.system.skills;
                const tools = this.actor.itemTypes.tool;

                const addSign = (value) => {
                    if (value >= 0) return `+${value}`;
                    return value;
                }

                const abilitiesButtons = Object.keys(abilities).map((ability) => {
                    const abilityData = abilities[ability];
                    return new ARGON.DRAWER.DrawerButton([
                        {
                            label: CONFIG.DND5E.abilities[ability].label,
                            onClick: (event) => this.actor.rollAbility(ability, {event}),
                        },
                        {
                            label: addSign(abilityData.mod),
                            onClick: (event) => this.actor.rollAbilityTest(ability, {event}),
                        },
                        {
                            label: addSign(abilityData.save),
                            onClick: (event) => this.actor.rollAbilitySave(ability, {event}),
                        }
                    ]);
                });

                const skillsButtons = Object.keys(skills).map((skill) => {
                    const skillData = skills[skill];
                    return new ARGON.DRAWER.DrawerButton([
                        {
                            label: CONFIG.DND5E.skills[skill].label,
                            onClick: (event) => this.actor.rollSkill(skill, {event})
                        },
                        {
                            label: `${addSign(skillData.mod)}<span style="margin: 0 1rem; filter: brightness(0.8)">(${skillData.passive})</span>`,
                            style: "display: flex; justify-content: flex-end;",
                        },
                    ]);
                });

                const toolButtons = tools.map((tool) => {
                    return new ARGON.DRAWER.DrawerButton([
                        {
                            label: tool.name,
                            onClick: (event) => tool.rollToolCheck({event})
                        },
                        {
                            label: addSign(abilities[tool.abilityMod].mod + tool.system.proficiencyMultiplier * this.actor.system.attributes.prof),
                        },
                    ]);
                });

                return [
                    {
                        gridCols: "5fr 2fr 2fr",
                        captions: [
                            {
                                label: "Abilities",
                                align: "left",
                            },
                            {
                                label: "Check",
                                align: "center",
                            },
                            {
                                label: "Save",
                                align: "center",
                            },
                        ],
                        align: ["left", "center", "center"],
                        buttons: abilitiesButtons,
                    },
                    {
                        gridCols: "7fr 2fr",
                        captions: [
                            {
                                label: "Skills",
                            },
                            {
                                label: "",
                            }
                        ],
                        buttons: skillsButtons,
                    },
                    {
                        gridCols: "7fr 2fr",
                        captions: [
                            {
                                label: "Tools",
                            },
                            {
                                label: "",
                            }
                        ],
                        buttons: toolButtons,
                    },
                ];
            }

            get title() {
                return `${game.i18n.localize("enhancedcombathud.hud.saves.name")} / ${game.i18n.localize("enhancedcombathud.hud.skills.name")} / ${game.i18n.localize("enhancedcombathud.hud.tools.name")}`;
            }
        }

        class DND5eActionActionPanel extends ARGON.MAIN.ActionPanel {
            constructor(...args) {
                super(...args);
            }

            get label() {
                return "DND5E.Action";
            }

            get hasAction() {
                return true;
            }

            async _getButtons() {
                const spellItems = this.actor.items.filter((item) => item.type === "spell" && actionTypes.action.includes(item.system.activation?.type));
                const featItems = this.actor.items.filter((item) => item.type === "feat" && actionTypes.action.includes(item.system.activation?.type));
                const consumableItems = this.actor.items.filter((item) => item.type === "consumable" && actionTypes.action.includes(item.system.activation?.type));

                const specialActions = Object.values(ECHItems);

                const buttons = [new DND5eItemButton({ item: null, isWeaponSet: true, isPrimary: true }), new ARGON.MAIN.BUTTONS.SplitButton(new DND5eSpecialActionButton(specialActions[0]), new DND5eSpecialActionButton(specialActions[1])), new DND5eButtonPanelButton({ type: "spell", items: spellItems, color: 0 }), new DND5eButtonPanelButton({ type: "feat", items: featItems, color: 0 }), new ARGON.MAIN.BUTTONS.SplitButton(new DND5eSpecialActionButton(specialActions[2]), new DND5eSpecialActionButton(specialActions[3])), new ARGON.MAIN.BUTTONS.SplitButton(new DND5eSpecialActionButton(specialActions[4]), new DND5eSpecialActionButton(specialActions[5])), new DND5eButtonPanelButton({ type: "consumable", items: consumableItems, color: 0 })];
                return buttons.filter((button) => button.items == undefined || button.items.length);
            }
        }

        class DND5eBonusActionPanel extends ARGON.MAIN.ActionPanel {
            constructor(...args) {
                super(...args);
            }

            get label() {
                return "DND5E.BonusAction";
            }

            get hasAction() {
                return true;
            }

            async _getButtons() {
                const buttons = [new DND5eItemButton({ item: null, isWeaponSet: true, isPrimary: false })];
                //buttons.push(new DND5eEquipmentButton({slot: 2}));
                for (const [type, types] of Object.entries(itemTypes)) {
                    const items = this.actor.items.filter((item) => types.includes(item.type) && actionTypes.bonus.includes(item.system.activation?.type));
                    if (!items.length) continue;
                    buttons.push(new DND5eButtonPanelButton({ type, items, color: 1 }));
                }
                return buttons;
            }
        }

        class DND5eReactionActionPanel extends ARGON.MAIN.ActionPanel {
            constructor(...args) {
                super(...args);
            }

            get label() {
                return "DND5E.Reaction";
            }

            get hasAction() {
                return true;
            }

            async _getButtons() {
                const buttons = [new DND5eItemButton({ item: null, isWeaponSet: true, isPrimary: true })];
                //buttons.push(new DND5eEquipmentButton({slot: 1}));
                for (const [type, types] of Object.entries(itemTypes)) {
                    const items = this.actor.items.filter((item) => types.includes(item.type) && actionTypes.reaction.includes(item.system.activation?.type));
                    if (!items.length) continue;
                    buttons.push(new DND5eButtonPanelButton({ type, items, color: 3 }));
                }
                return buttons;
            }
        }

        class DND5eFreeActionPanel extends ARGON.MAIN.ActionPanel {
            constructor(...args) {
                super(...args);
            }

            get label() {
                return "DND5E.Special";
            }

            get hasAction() {
                return true;
            }

            async _getButtons() {
                const buttons = [];

                for (const [type, types] of Object.entries(itemTypes)) {
                    const items = this.actor.items.filter((item) => types.includes(item.type) && actionTypes.free.includes(item.system.activation?.type));
                    if (!items.length) continue;
                    buttons.push(new DND5eButtonPanelButton({ type, items, color: 2 }));
                }
                return buttons;
            }
        }

        class DND5eItemButton extends ARGON.MAIN.BUTTONS.ItemButton {
            constructor(...args) {
                super(...args);
            }

            get hasTooltip() {
                return true;
            }

            async getTooltipData() {
                const tooltipData = await getTooltipDetails(this.item);
                tooltipData.propertiesLabel = "enhancedcombathud.tooltip.properties.name";
                return tooltipData;
            }

            async _onLeftClick(event) {
                ui.ARGON.interceptNextDialog(event.currentTarget)
                const used = await this.item.use({ event }, { event });
                if (used) {
                    DND5eItemButton.consumeActionEconomy(this.item);
                }
            }

            static consumeActionEconomy(item) {
                const activationType = item.system.activation?.type;
                let actionType = null;
                for (const [type, types] of Object.entries(actionTypes)) {
                    if (types.includes(activationType)) actionType = type;
                }
                if (!actionType) return;
                if (actionType === "action") {
                    ui.ARGON.components.main[0].isActionUsed = true;
                } else if (actionType === "bonus") {
                    ui.ARGON.components.main[1].isActionUsed = true;
                } else if (actionType === "reaction") {
                    ui.ARGON.components.main[2].isActionUsed = true;
                } else if (actionType === "free") {
                    ui.ARGON.components.main[3].isActionUsed = true;
                }
            }

            async render(...args) {
                await super.render(...args);
                if (this.item?.system.consumableType === "ammo") {
                    const weapons = this.actor.items.filter((item) => item.system.consume?.target === this.item.id);
                    ui.ARGON.updateItemButtons(weapons);
                }
            }

            get quantity() {
                const showQuantityItemTypes = ["consumable"];
                const consumeType = this.item.system.consume?.type;
                if (consumeType === "ammo") {
                    const ammoItem = this.actor.items.get(this.item.system.consume.target);
                    if (!ammoItem) return null;
                    return ammoItem.system.quantity;
                } else if (consumeType === "attribute") {
                    return getProperty(this.actor.system, this.item.system.consume.target);
                } else if (showQuantityItemTypes.includes(this.item.type)) {
                    return this.item.system.uses?.value ?? this.item.system.quantity;
                }
                return null;
            }
        }

        class DND5eButtonPanelButton extends ARGON.MAIN.BUTTONS.ButtonPanelButton {
            constructor({ type, items, color }) {
                super();
                this.type = type;
                this.items = items;
                this.color = color;
            }

            get colorScheme() {
                return this.color;
            }

            get label() {
                switch (this.type) {
                    case "spell":
                        return "enhancedcombathud.hud.castspell.name";
                    case "feat":
                        return "enhancedcombathud.hud.usepower.name";
                    case "consumable":
                        return "enhancedcombathud.hud.useitem.name";
                }
            }

            get icon() {
                switch (this.type) {
                    case "spell":
                        return "modules/enhancedcombathud/icons/spell-book.svg";
                    case "feat":
                        return "modules/enhancedcombathud/icons/mighty-force.svg";
                    case "consumable":
                        return "modules/enhancedcombathud/icons/drink-me.svg";
                }
            }

            get showPreparedOnly() {
                if (this.actor.type !== "character") return false;
                const classes = Object.keys(this.actor.classes);
                const requiresPreparation = ["cleric", "druid", "paladin", "wizard", "artificer", "ranger"].some((className) => classes.includes(className));
                return requiresPreparation;
            }

            async _getPanel() {
                if (this.type === "spell") {
                    const spellLevels = CONFIG.DND5E.spellLevels;
                    if (this.showPreparedOnly) {
                        const allowIfNotPrepared = ["atwill", "innate", "pact"];
                        this.items = this.items.filter((item) => {
                            if (allowIfNotPrepared.includes(item.system.preparation.mode)) return true;
                            if (item.system.level == 0) return true;
                            return item.system.preparation.prepared;
                        });
                    }
                    const spells = [
                        {
                            label: "DND5E.SpellPrepAtWill",
                            buttons: this.items.filter((item) => item.system.preparation.mode === "atwill").map((item) => new DND5eItemButton({ item })),
                            uses: { max: Infinity, value: Infinity },
                        },
                        {
                            label: "DND5E.SpellPrepInnate",
                            buttons: this.items.filter((item) => item.system.preparation.mode === "innate").map((item) => new DND5eItemButton({ item })),
                            uses: { max: Infinity, value: Infinity },
                        },
                        {
                            label: Object.values(spellLevels)[0],
                            buttons: this.items.filter((item) => item.system.level == 0).map((item) => new DND5eItemButton({ item })),
                            uses: { max: Infinity, value: Infinity },
                        },
                        {
                            label: "DND5E.PactMagic",
                            buttons: this.items.filter((item) => item.system.preparation.mode === "pact").map((item) => new DND5eItemButton({ item })),
                            uses: this.actor.system.spells.pact,
                        },
                    ];
                    for (const [level, label] of Object.entries(spellLevels)) {
                        const levelSpells = this.items.filter((item) => item.system.level == level);
                        if (!levelSpells.length || level == 0) continue;
                        spells.push({
                            label,
                            buttons: levelSpells.map((item) => new DND5eItemButton({ item })),
                            uses: this.actor.system.spells[`spell${level}`],
                        });
                    }
                    return new ARGON.MAIN.BUTTON_PANELS.ACCORDION.AccordionPanel({ accordionPanelCategories: spells.filter((spell) => spell.buttons.length).map(({ label, buttons, uses }) => new ARGON.MAIN.BUTTON_PANELS.ACCORDION.AccordionPanelCategory({ label, buttons, uses })) });
                } else {
                    return new ARGON.MAIN.BUTTON_PANELS.ButtonPanel({ buttons: this.items.map((item) => new DND5eItemButton({ item })) });
                }
            }
        }

        class DND5eSpecialActionButton extends ARGON.MAIN.BUTTONS.ActionButton {
            constructor(specialItem) {
                super();
                this.item = new CONFIG.Item.documentClass(specialItem, {
                    parent: this.actor,
                });
            }

            get label() {
                return this.item.name;
            }

            get icon() {
                return this.item.img;
            }

            async _onLeftClick(event) {
                const useCE = game.modules.get("dfreds-convenient-effects")?.active && game.dfreds.effectInterface.findEffectByName(this.label);
                let success = false;
                if (useCE) {
                    success = true;
                  await game.dfreds.effectInterface.toggleEffect(this.label, { overlay: false, uuids : [this.actor.uuid] });
                } else {
                    success = await this.item.use({ event }, { event });
                }
                if(success) {
                    DND5eItemButton.consumeActionEconomy(this.item);
                }
            }
        }

        class DND5eMovementHud extends ARGON.MovementHud {
            get movementMax() {
                return this.actor.system.attributes.movement.walk / canvas.scene.dimensions.distance;
            }
        }

        class DND5eWeaponSets extends ARGON.WeaponSets {
            async getDefaultSets() {
                const sets = await super.getDefaultSets();
                if (this.actor.type !== "npc") return sets;
                const actions = this.actor.items.filter((item) => item.type === "weapon" && item.system.activation?.type === "action");
                const bonus = this.actor.items.filter((item) => item.type === "weapon" && item.system.activation?.type === "bonus");
                return {
                    1: {
                        primary: actions[0]?.uuid ?? null,
                        secondary: bonus[0]?.uuid ?? null,
                    },
                    2: {
                        primary: actions[1]?.uuid ?? null,
                        secondary: bonus[1]?.uuid ?? null,
                    },
                    3: {
                        primary: actions[2]?.uuid ?? null,
                        secondary: bonus[2]?.uuid ?? null,
                    },
                };
            }

            async _onSetChange({sets, active}) {
                const switchEquip = game.settings.get("enhancedcombathud", "switchEquip");
                if (!switchEquip) return;
                const updates = [];
                const activeSet = sets[active];
                const activeItems = Object.values(activeSet).filter((item) => item);
                const inactiveSets = Object.values(sets).filter((set) => set !== activeSet);
                const inactiveItems = inactiveSets.flatMap((set) => Object.values(set)).filter((item) => item);
                activeItems.forEach((item) => {
                    if(!item.system?.equipped) updates.push({_id: item.id, "system.equipped": true});
                });
                inactiveItems.forEach((item) => {
                    if(item.system?.equipped) updates.push({_id: item.id, "system.equipped": false});
                });
                return await this.actor.updateEmbeddedDocuments("Item", updates);
            }
        }

        CoreHUD.definePortraitPanel(DND5ePortraitPanel);
        CoreHUD.defineDrawerPanel(DND5eDrawerPanel);
        CoreHUD.defineMainPanels([DND5eActionActionPanel, DND5eBonusActionPanel, DND5eReactionActionPanel, DND5eFreeActionPanel, ARGON.PREFAB.PassTurnPanel]);
        CoreHUD.defineMovementHud(DND5eMovementHud);
        CoreHUD.defineWeaponSets(DND5eWeaponSets);
    });
}
