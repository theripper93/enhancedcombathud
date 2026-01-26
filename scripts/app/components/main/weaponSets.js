import { ArgonComponent } from "../component.js";

export class WeaponSets extends ArgonComponent {
    get classes() {
        return ["weapon-sets"];
    }

    async activateListeners(html) {
        super.activateListeners(html);
        this.element.querySelectorAll(".set").forEach((set) => {
            //set.addEventListener("dragover", this._onDragOver.bind(this));
            set.addEventListener("drop", this._onDrop.bind(this));
            set.addEventListener("click", this._onClick.bind(this));
            set.addEventListener("dragstart", this._onDragStart.bind(this));
            set.addEventListener("dragend", this._onDragEnd.bind(this));
            set.addEventListener("contextmenu", this._onContextMenu.bind(this));
        });
        const activeSet = this.actor.getFlag("enhancedcombathud", "activeWeaponSet") || "1";
        this.element.querySelectorAll(".weapon-set").forEach((element) => {
            element.classList.toggle("active", element.dataset.set === activeSet);
        });

        this.onSetChange(await this.getSetData());
    }

    async getSetData() {
        const sets = await this._getSets();
        const active = this.actor.getFlag("enhancedcombathud", "activeWeaponSet") || "1";
        return { sets, active };
    }

    async _getSets() {
        const sets = foundry.utils.mergeObject(await this.getDefaultSets(), foundry.utils.deepClone(this.actor.getFlag("enhancedcombathud", "weaponSets") || {}));

        for (const [set, slots] of Object.entries(sets)) {
            slots.primary = slots.primary ? await fromUuid(slots.primary) : null;
            slots.secondary = slots.secondary ? await fromUuid(slots.secondary) : null;
        }
        return sets;
    }

    async getDefaultSets() {
        return {
            1: {
                primary: null,
                secondary: null,
            },
            2: {
                primary: null,
                secondary: null,
            },
            3: {
                primary: null,
                secondary: null,
            },
        };
    }

    async getData() {
        return {
            sets: await this._getSets(),
        };
    }

    async _onDrop(event) {
        try {
            event.preventDefault();
            event.stopPropagation();
            const data = JSON.parse(event.dataTransfer.getData("text/plain"));
            if (data?.type !== "Item") return;
            const set = event.currentTarget.dataset.set;
            const slot = event.currentTarget.dataset.slot;
            const sets = this.actor.getFlag("enhancedcombathud", "weaponSets") || {};
            sets[set] = sets[set] || {};
            sets[set][slot] = data.uuid;

            await this.actor.setFlag("enhancedcombathud", "weaponSets", sets);
            await this.render();
        } catch (error) {}
    }

    async _onClick(event) {
        event.preventDefault();
        event.stopPropagation();
        const set = event.currentTarget.dataset.set;
        this.element.querySelectorAll(".weapon-set").forEach((element) => {
            element.classList.toggle("active", element.dataset.set === set);
        });
        await this.actor.setFlag("enhancedcombathud", "activeWeaponSet", set);
        this.onSetChange(await this.getSetData());
    }

    async _onDragEnd(event) {
        event.preventDefault();
        event.stopPropagation();
        const set = event.currentTarget.dataset.set;
        const slot = event.currentTarget.dataset.slot;
        const sets = this.actor.getFlag("enhancedcombathud", "weaponSets") || {};
        sets[set] = sets[set] || {};
        sets[set][slot] = null;

        await this.actor.setFlag("enhancedcombathud", "weaponSets", sets);
        await this.render();
    }

    async _onDragStart(event) {
        const set = event.currentTarget.dataset.set;
        const slot = event.currentTarget.dataset.slot;
        const sets = this.actor.getFlag("enhancedcombathud", "weaponSets") || {};
        sets[set] = sets[set] || {};
        const uuid = sets[set][slot];
        if (!uuid) return;
        event.dataTransfer.setData(
            "text/plain",
            JSON.stringify({
                type: "Item",
                uuid,
            }),
        );
    }

    async _onContextMenu(event) {
        event.preventDefault();
        event.stopPropagation();
        const set = event.currentTarget.dataset.set;
        const slot = event.currentTarget.dataset.slot;
        const sets = this.actor.getFlag("enhancedcombathud", "weaponSets") || {};
        sets[set] = sets[set] || {};
        sets[set][slot] = null;

        await this.actor.setFlag("enhancedcombathud", "weaponSets", sets);
        await this.render();
    }

    async onSetChange({ sets, active }) {
        Hooks.callAll("argon-onSetChangeUpdateItem", { sets, active });
        Hooks.callAll("argon-onSetChangeComplete", { sets, active });
        await this._onSetChange({ sets, active });
    }

    async _onSetChange({ sets, active }) {
        console.error("WeaponSets._onSetChange() is not implemented");
    }
}
