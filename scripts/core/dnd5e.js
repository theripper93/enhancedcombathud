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
  
      async _getButtons() {
        const buttons = [];
        buttons.push(new DND5eEquipmentButton({slot: 1}));
        for (const [type, types] of Object.entries(itemTypes)) {
          const items = this.actor.items.filter(item => types.includes(item.type) && actionTypes.includes(item.system.activation?.type));
          if (!items.length) continue;
          buttons.push(new DND5eButtonPanelButton({type, items}));
        }
      }
    }
  
    class DND5eBonusActionPanel extends ARGON.MAIN.ActionPanel {
      constructor(...args) {
        super(...args);
      }
  
      async _getButtons() {
        const buttons = [];
        buttons.push(new DND5eEquipmentButton({slot: 2}));
        for (const [type, types] of Object.entries(itemTypes)) {
          const items = this.actor.items.filter(item => types.includes(item.type) && actionTypes.includes(item.system.activation?.type));
          if (!items.length) continue;
          buttons.push(new DND5eButtonPanelButton({type, items}));
        }
      }
    }
  
    class DND5eReactionActionPanel extends ARGON.MAIN.ActionPanel {
      constructor(...args) {
        super(...args);
      }
  
      async _getButtons() {
        const buttons = [];
        buttons.push(new DND5eEquipmentButton({slot: 1}));
        for (const [type, types] of Object.entries(itemTypes)) {
          const items = this.actor.items.filter(item => types.includes(item.type) && actionTypes.includes(item.system.activation?.type));
          if (!items.length) continue;
          buttons.push(new DND5eButtonPanelButton({type, items}));
        }
      }
    }
  
    class DND5eFreeActionPanel extends ARGON.MAIN.ActionPanel {
      constructor(...args) {
        super(...args);
      }
  
      async _getButtons() {
        const buttons = [];
        for (const [type, types] of Object.entries(itemTypes)) {
          const items = this.actor.items.filter(item => types.includes(item.type) && actionTypes.includes(item.system.activation?.type));
          if (!items.length) continue;
          buttons.push(new DND5eButtonPanelButton({type, items}));
        }
      }
    }
  
  
    class DND5eItemButton extends ARGON.MAIN.BUTTONS.ItemButton {
      constructor(...args) {
        super(...args);
      }
    }
  
    class DND5eButtonPanelButton extends ARGON.MAIN.BUTTONS.ButtonPanelButton {
      constructor({type, items}) {
        super();
        this.type = type;
        this.items = items;
      }
  
      async _getPanel() {
        if (this.type === "spell") {
          
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
