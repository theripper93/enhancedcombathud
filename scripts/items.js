let ECHItems = {}

Hooks.once("ready",()=>{
  ECHItems[game.i18n.localize("enhancedcombathud.items.disengage.name")] = {
    "name": game.i18n.localize("enhancedcombathud.items.disengage.name"),
    "type": "feat",
    "img": "modules/enhancedcombathud/icons/journey.svg",
    "data": {
      "description": {
        "value": game.i18n.localize("enhancedcombathud.items.disengage.desc"),
        "chat": "",
        "unidentified": ""
      },
      "source": "",
      "quantity": 1,
      "weight": 0,
      "price": 0,
      "attuned": false,
      "attunement": 0,
      "equipped": false,
      "rarity": "",
      "identified": true,
      "activation": {
        "type": "action",
        "cost": 1,
        "condition": ""
      },
      "duration": {
        "value": 1,
        "units": "turn"
      },
      "target": {
        "value": null,
        "width": null,
        "units": "",
        "type": "self"
      },
      "range": {
        "value": null,
        "long": null,
        "units": ""
      },
      "consume": {
        "type": "",
        "target": "",
        "amount": null
      },
      "ability": "",
      "actionType": "util",
      "attackBonus": 0,
      "chatFlavor": "",
      "critical": null,
      "damage": {
        "parts": [],
        "versatile": ""
      },
      "formula": "",
      "save": {
        "ability": "",
        "dc": null,
        "scaling": "spell"
      },
    },
    "effects": [
      {
        "_id": "8FtZnIC1vbyKZ6xF",
        "changes": [],
        "disabled": false,
        "duration": {
          "startTime": null,
          "turns": 1
        },
        "icon": "modules/enhancedcombathud/icons/journey.svg",
        "label": "Disengage",
        "origin": "Item.wyQkeuZkttllAFB1",
        "transfer": false,
        "flags": {
          "dae": {
            "stackable": "none",
            "macroRepeat": "none",
            "specialDuration": [],
            "transfer": false
          }
        },
        "tint": ""
      }
    ],
    "sort": 0,
    "flags": {
      "core": {
        "sourceId": "Item.wyQkeuZkttllAFB1"
      },
      "enhancedcombathud": {
        "set1p": false,
        "set2p": false,
        "set3p": false
      },
      "midi-qol": {
        "onUseMacroName": ""
      }
    }
  }
  ECHItems[game.i18n.localize("enhancedcombathud.items.hide.name")] = {
    "name": game.i18n.localize("enhancedcombathud.items.hide.name"),
    "type": "feat",
    "img": "modules/enhancedcombathud/icons/cloak-dagger.svg",
    "data": {
      "description": {
        "value": game.i18n.localize("enhancedcombathud.items.hide.desc"),
        "chat": "",
        "unidentified": ""
      },
      "source": "",
      "quantity": 1,
      "weight": 0,
      "price": 0,
      "attuned": false,
      "attunement": 0,
      "equipped": false,
      "rarity": "",
      "identified": true,
      "activation": {
        "type": "action",
        "cost": 1,
        "condition": ""
      },
      "duration": {
        "value": null,
        "units": ""
      },
      "target": {
        "value": null,
        "width": null,
        "units": "",
        "type": "self"
      },
      "range": {
        "value": null,
        "long": null,
        "units": ""
      },

      "consume": {
        "type": "",
        "target": "",
        "amount": null
      },
      "recharge": {
        "value": null,
        "charged": false
      },
      "ability": "",
      "actionType": "util",
      "attackBonus": 0,
      "chatFlavor": "",
      "critical": null,
      "damage": {
        "parts": [],
        "versatile": ""
      },
      "formula": "",
      "save": {
        "ability": "",
        "dc": null,
        "scaling": "spell"
      },
      "consumableType": "trinket"
    },
    "effects": [
      {
        "_id": "SZkbtgGCICrpH0GJ",
        "changes": [],
        "disabled": false,
        "duration": {
          "startTime": null,
          "turns": 10
        },
        "icon": "modules/enhancedcombathud/icons/cloak-dagger.svg",
        "label": "Hide",
        "transfer": false,
        "flags": {
          "dae": {
            "stackable": "none",
            "macroRepeat": "none",
            "specialDuration": [],
            "transfer": false
          }
        },
        "tint": ""
      }
    ],
    "sort": 0,
    "flags": {
      "enhancedcombathud": {
        "set1p": false,
        "set2p": false,
        "set3p": false,
        "set1s": false,
        "set2s": false,
        "set3s": false
      },
      "midi-qol": {
        "onUseMacroName": ""
      }
    }
  }
  ECHItems[game.i18n.localize("enhancedcombathud.items.shove.name")] = {
    "name": game.i18n.localize("enhancedcombathud.items.shove.name"),
    "type": "feat",
    "img": "modules/enhancedcombathud/icons/shield-bash.svg",
    "data": {
      "description": {
        "value": game.i18n.localize("enhancedcombathud.items.shove.desc"),
        "chat": "",
        "unidentified": ""
      },
      "source": "",
      "quantity": 1,
      "weight": 0,
      "price": 0,
      "attuned": false,
      "attunement": 0,
      "equipped": false,
      "rarity": "",
      "identified": true,
      "activation": {
        "type": "action",
        "cost": 1,
        "condition": ""
      },
      "duration": {
        "value": null,
        "units": ""
      },
      "target": {
        "value": 1,
        "width": null,
        "units": "",
        "type": "creature"
      },
      "range": {
        "value": null,
        "long": null,
        "units": "touch"
      },

      "consume": {
        "type": "",
        "target": "",
        "amount": null
      },
      "ability": "",
      "actionType": "util",
      "attackBonus": 0,
      "chatFlavor": "",
      "critical": null,
      "damage": {
        "parts": [],
        "versatile": ""
      },
      "formula": "",
      "save": {
        "ability": "",
        "dc": null,
        "scaling": "spell"
      },
      "consumableType": "trinket"
    },
    "effects": [],
    "sort": 0,
    "flags": {
      "enhancedcombathud": {
        "set1p": false,
        "set2p": false,
        "set3p": false
      },
      "midi-qol": {
        "onUseMacroName": ""
      }
    }
  }
  ECHItems[game.i18n.localize("enhancedcombathud.items.dash.name")] = {
    "name": game.i18n.localize("enhancedcombathud.items.dash.name"),
    "type": "feat",
    "img": "modules/enhancedcombathud/icons/walking-boot.svg",
    "data": {
      "description": {
        "value": game.i18n.localize("enhancedcombathud.items.dash.desc"),
        "chat": "",
        "unidentified": ""
      },
      "source": "",
      "quantity": 1,
      "weight": 0,
      "price": 0,
      "attuned": false,
      "attunement": 0,
      "equipped": false,
      "rarity": "",
      "identified": true,
      "activation": {
        "type": "action",
        "cost": 1,
        "condition": ""
      },
      "duration": {
        "value": null,
        "units": ""
      },
      "target": {
        "value": null,
        "width": null,
        "units": "",
        "type": "self"
      },
      "range": {
        "value": null,
        "long": null,
        "units": ""
      },

      "consume": {
        "type": "",
        "target": "",
        "amount": null
      },
      "ability": "",
      "actionType": "util",
      "attackBonus": 0,
      "chatFlavor": "",
      "critical": null,
      "damage": {
        "parts": [],
        "versatile": ""
      },
      "formula": "",
      "save": {
        "ability": "",
        "dc": null,
        "scaling": "spell"
      },
      "consumableType": "trinket"
    },
    "effects": [
      {
        "_id": "PPMPZY1t3AUB7UGA",
        "changes": [],
        "disabled": false,
        "duration": {
          "startTime": null,
          "rounds": 1
        },
        "icon": "modules/enhancedcombathud/icons/walking-boot.svg",
        "label": "Dash",
        "transfer": false,
        "flags": {
          "dae": {
            "stackable": "none",
            "macroRepeat": "none",
            "specialDuration": [],
            "transfer": false
          }
        },
        "tint": ""
      }
    ],
    "sort": 0,
    "flags": {
      "enhancedcombathud": {
        "set1p": false,
        "set2p": false,
        "set3p": false
      },
      "midi-qol": {
        "onUseMacroName": ""
      }
    }
  }
  ECHItems[game.i18n.localize("enhancedcombathud.items.dodge.name")] = {
    "name": game.i18n.localize("enhancedcombathud.items.dodge.name"),
    "type": "feat",
    "img": "modules/enhancedcombathud/icons/armor-upgrade.svg",
    "data": {
      "description": {
        "value": game.i18n.localize("enhancedcombathud.items.dodge.desc"),
        "chat": "",
        "unidentified": ""
      },
      "source": "",
      "quantity": 1,
      "weight": 0,
      "price": 0,
      "attuned": false,
      "attunement": 0,
      "equipped": false,
      "rarity": "",
      "identified": true,
      "activation": {
        "type": "action",
        "cost": 1,
        "condition": ""
      },
      "duration": {
        "value": 1,
        "units": "round"
      },
      "target": {
        "value": null,
        "width": null,
        "units": "",
        "type": "self"
      },
      "range": {
        "value": null,
        "long": null,
        "units": ""
      },

      "consume": {
        "type": "",
        "target": "",
        "amount": null
      },
      "ability": "",
      "actionType": "util",
      "attackBonus": 0,
      "chatFlavor": "",
      "critical": null,
      "damage": {
        "parts": [],
        "versatile": ""
      },
      "formula": "",
      "save": {
        "ability": "",
        "dc": null,
        "scaling": "spell"
      },
      "consumableType": "trinket"
    },
    "effects": [
      {
        "_id": "2xH2YQ6pm430O0Aq",
        "changes": [],
        "disabled": false,
        "duration": {
          "startTime": null,
          "turns": 1
        },
        "icon": "modules/enhancedcombathud/icons/armor-upgrade.svg",
        "label": "Dodge",
        "origin": "Item.pakEYcgLYxtKGv7J",
        "transfer": false,
        "flags": {
          "dae": {
            "stackable": "none",
            "macroRepeat": "none",
            "specialDuration": [],
            "transfer": false
          }
        },
        "tint": ""
      }
    ],
    "sort": 0,
    "flags": {
      "enhancedcombathud": {
        "set1p": false,
        "set2p": false,
        "set3p": false
      },
      "midi-qol": {
        "onUseMacroName": ""
      }
    }
  }
  ECHItems[game.i18n.localize("enhancedcombathud.items.ready.name")] = {
    "name": game.i18n.localize("enhancedcombathud.items.ready.name"),
    "type": "feat",
    "img": "modules/enhancedcombathud/icons/clockwork.svg",
    "data": {
      "description": {
        "value": game.i18n.localize("enhancedcombathud.items.ready.desc"),
        "chat": "",
        "unidentified": ""
      },
      "source": "",
      "quantity": 1,
      "weight": 0,
      "price": 0,
      "attuned": false,
      "attunement": 0,
      "equipped": false,
      "rarity": "",
      "identified": true,
      "activation": {
        "type": "action",
        "cost": 1,
        "condition": ""
      },
      "duration": {
        "value": null,
        "units": ""
      },
      "target": {
        "value": null,
        "width": null,
        "units": "",
        "type": ""
      },
      "range": {
        "value": null,
        "long": null,
        "units": ""
      },

      "consume": {
        "type": "",
        "target": "",
        "amount": null
      },
      "ability": "",
      "actionType": "util",
      "attackBonus": 0,
      "chatFlavor": "",
      "critical": null,
      "damage": {
        "parts": [],
        "versatile": ""
      },
      "formula": "",
      "save": {
        "ability": "",
        "dc": null,
        "scaling": "spell"
      },
      "consumableType": "trinket"
    },
    "effects": [
      {
        "_id": "BevDb0J80M9BdoEl",
        "changes": [],
        "disabled": false,
        "duration": {
          "startTime": null,
          "turns": 1
        },
        "icon": "modules/enhancedcombathud/icons/clockwork.svg",
        "label": "Ready",
        "transfer": false,
        "flags": {
          "dae": {
            "stackable": "none",
            "macroRepeat": "none",
            "specialDuration": [],
            "transfer": false
          }
        },
        "tint": ""
      }
    ],
    "sort": 0,
    "flags": {
      "enhancedcombathud": {
        "set1p": false,
        "set2p": false,
        "set3p": false
      },
      "midi-qol": {
        "onUseMacroName": ""
      }
    }
  }
})

const themes = {
  
  helium:{
    "--ech-fore-color":"#d0d0d0ff",
    "--ech-color":"#3e3e3e7d",
    "--ech-color-bonus-action":"#3e3e3e7d",
    "--ech-color-free-action":"#3e3e3e7d",
    "--ech-color-reaction":"#3e3e3e7d",
    "--ech-color-end-turn":"#3e3e3e7d",
  },
  neon:{
    "--ech-fore-color":"#e3e3e3de",
    "--ech-color":"#711c91b9",
    "--ech-color-bonus-action":"#133e7cc5",
    "--ech-color-free-action":"#091833c8",
    "--ech-color-reaction":"#1c3353cd",
    "--ech-color-end-turn":"#662862be",
  },
  argon:{
    "--ech-fore-color":"#B4D2DCFF",
    "--ech-color":"#414B55E6",
    "--ech-color-bonus-action":"#453B75E6",
    "--ech-color-free-action":"#3B5875E6",
    "--ech-color-reaction":"#753B3BE6",
    "--ech-color-end-turn":"#374B3CE6",
  },
  krypton:{
    "--ech-fore-color":"#d1d9bdde",
    "--ech-color":"#2f661eb9",
    "--ech-color-bonus-action":"#249a26c5",
    "--ech-color-free-action":"#249a26c5",
    "--ech-color-reaction":"#249a26c5",
    "--ech-color-end-turn":"#2f661eb9",
  },
  xenon:{
    "--ech-fore-color":"#d9e3e3de",
    "--ech-color":"#688ab6b9",
    "--ech-color-bonus-action":"#5489ccb9",
    "--ech-color-free-action":"#3680deb9",
    "--ech-color-reaction":"#1066d3b9",
    "--ech-color-end-turn":"#1b3e6ab9",
  },
  radon:{
    "--ech-fore-color":"#e3d9d9de",
    "--ech-color":"#fc123a5d",
    "--ech-color-bonus-action":"#f916167d",
    "--ech-color-free-action":"#f916167d",
    "--ech-color-reaction":"#f916167d",
    "--ech-color-end-turn":"#9f12127d",
  },
  oganesson:{
    "--ech-fore-color":"#727272de",
    "--ech-color":"#ffffff46",
    "--ech-color-bonus-action":"#ffffff46",
    "--ech-color-free-action":"#ffffff46",
    "--ech-color-reaction":"#ffffff46",
    "--ech-color-end-turn":"#bdbdbd66",
  },
}