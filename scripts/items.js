let ECHItems = {}

Hooks.once("ready",()=>{
  ECHItems[game.i18n.localize("enhancedcombathud.items.disengage.name")] = {
    "name": game.i18n.localize("enhancedcombathud.items.disengage.name"),
    "type": "feat",
    "img": "modules/enhancedcombathud/icons/journey.svg",
    "system": {
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
    "system": {
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
    "system": {
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
    "system": {
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
    "system": {
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
          "rounds": 1
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
    "system": {
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
  if(game.settings.get("enhancedcombathud", "noAA")){
    for(let key of Object.keys(ECHItems)) {
      delete ECHItems[key].effects
    }
  }
})