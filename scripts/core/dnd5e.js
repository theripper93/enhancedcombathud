export function register() {
  Hooks.on("argonInit", (CoreHUD) => {
    const ARGON = CoreHUD.ARGON;
  
    const actionTypes = {
      action: ["action", "legendary"],
      bonus: ["bonus"],
      reaction: ["reaction", "reactiondamage", "reactionmanual"],
      free: ["special"]
    }
  
    const itemTypes = {
      spell: ["spell"],
      feat: ["feat"],
      consumable: ["consumable", "equipment", "loot", "weapon"],
    }
  
    class DND5ePortraitPanel extends ARGON.PORTRAIT.PortraitPanel {
      constructor(...args) {
        super(...args);
      }
    }
  
    class DND5eDrawerPanel extends ARGON.DRAWER.DrawerPanel {
      constructor(...args) {
        super(...args);
      }
    }
  
    class DND5eActionActionPanel extends ARGON.MAIN.ActionPanel {
      constructor(...args) {
        super(...args);
      }

      get label() {
        return "DND5E.Action";
      }
  
      async _getButtons() {
        const buttons = [];
        //buttons.push(new DND5eEquipmentButton({slot: 1}));
        for (const [type, types] of Object.entries(itemTypes)) {
          const items = this.actor.items.filter(item => types.includes(item.type) && actionTypes.action.includes(item.system.activation?.type));
          if (!items.length) continue;
          buttons.push(new DND5eButtonPanelButton({type, items, color: 0}));
        }
        return buttons;
      }
    }
  
    class DND5eBonusActionPanel extends ARGON.MAIN.ActionPanel {
      constructor(...args) {
        super(...args);
      }

      get label() {
        return "DND5E.BonusAction";
      }
  
      async _getButtons() {
        const buttons = [];
        //buttons.push(new DND5eEquipmentButton({slot: 2}));
        for (const [type, types] of Object.entries(itemTypes)) {
          const items = this.actor.items.filter(item => types.includes(item.type) && actionTypes.bonus.includes(item.system.activation?.type));
          if (!items.length) continue;
          buttons.push(new DND5eButtonPanelButton({type, items, color: 1}));
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
  
      async _getButtons() {
        const buttons = [];
        //buttons.push(new DND5eEquipmentButton({slot: 1}));
        for (const [type, types] of Object.entries(itemTypes)) {
          const items = this.actor.items.filter(item => types.includes(item.type) && actionTypes.reaction.includes(item.system.activation?.type));
          if (!items.length) continue;
          buttons.push(new DND5eButtonPanelButton({type, items, color: 3}));
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
  
      async _getButtons() {
        const buttons = [];
        for (const [type, types] of Object.entries(itemTypes)) {
          const items = this.actor.items.filter(item => types.includes(item.type) && actionTypes.free.includes(item.system.activation?.type));
          if (!items.length) continue;
          buttons.push(new DND5eButtonPanelButton({type, items, color: 2}));
        }
        return buttons;
      }
    }
  
  
    class DND5eItemButton extends ARGON.MAIN.BUTTONS.ItemButton {
      constructor(...args) {
        super(...args);
      }
    }
  
    class DND5eButtonPanelButton extends ARGON.MAIN.BUTTONS.ButtonPanelButton {
      constructor({type, items, color}) {
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
          case "spell": return "enhancedcombathud.hud.castspell.name";
          case "feat": return "enhancedcombathud.hud.usepower.name";
          case "consumable": return "enhancedcombathud.hud.useitem.name";
        }
      }

      get icon() {
        switch (this.type) {
          case "spell": return "modules/enhancedcombathud/icons/spell-book.svg";
          case "feat": return "modules/enhancedcombathud/icons/mighty-force.svg";
          case "consumable": return "modules/enhancedcombathud/icons/drink-me.svg";
        }
      }
  
      async _getPanel() {
        if (this.type === "spell") {
          const spellLevels = CONFIG.DND5E.spellLevels;
          const spells = [
            {
              label: "DND5E.SpellPrepAtWill",
              buttons: this.items.filter(item => item.system.preparation.mode === "atwill").map(item => new DND5eItemButton({item})),
              uses: {max: Infinity, value: Infinity},
            },
            {
              label: "DND5E.SpellPrepInnate",
              buttons: this.items.filter(item => item.system.preparation.mode === "innate").map(item => new DND5eItemButton({item})),
              uses: {max: Infinity, value: Infinity},
            },
            {
              label: "DND5E.PactMagic",
              buttons: this.items.filter(item => item.system.preparation.mode === "pact").map(item => new DND5eItemButton({item})),
              uses: this.actor.system.spells.pact,
            }
          ];
          for (const [level, label] of Object.entries(spellLevels)) {
            const levelSpells = this.items.filter(item => item.system.level == level);
            if (!levelSpells.length) continue;
            const slots = level == 0 ? {max: Infinity, value: Infinity} : this.actor.system.spells[`spell${level}`]
            spells.push({
              label,
              buttons: levelSpells.map(item => new DND5eItemButton({item})),
              uses: slots,
            });
          }
          return new ARGON.MAIN.BUTTON_PANELS.ACCORDION.AccordionPanel({accordionPanelCategories: spells.filter(spell=>spell.buttons.length).map(({label, buttons, uses}) => new ARGON.MAIN.BUTTON_PANELS.ACCORDION.AccordionPanelCategory({label, buttons, uses}))});
        } else {
          return new ARGON.MAIN.BUTTON_PANELS.ButtonPanel({buttons: this.items.map(item => new DND5eItemButton({item}))});
        }
      }
    }
  
    class DND5eEquipmentButton extends ARGON.MAIN.BUTTONS.EquipmentButton {
      constructor(...args) {
        super(...args);
      }
    }

    class DND5eSpellAccordion extends ARGON.MAIN.BUTTON_PANELS.ACCORDION.AccordionPanel { }
  
  
  
  
  
  
  
  
  
  
  
  
  
  
    CoreHUD.definePortraitPanel(DND5ePortraitPanel);
    CoreHUD.defineDrawerPanel(DND5eDrawerPanel);
    CoreHUD.defineMainPanels([
      DND5eActionActionPanel,
      DND5eBonusActionPanel,
      DND5eReactionActionPanel,
      DND5eFreeActionPanel,
    ]);
  
  
  
  
  });
  
}
