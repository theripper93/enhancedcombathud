let ECHItems = {}

Hooks.once("ready",()=>{
  ECHItems[game.i18n.localize("enhancedcombathud.items.disengage.name")] = {
    "name": game.i18n.localize("enhancedcombathud.items.disengage.name"),
    "type": "consumable",
    "img": "modules/enhancedcombathud/icons/journey.svg",
    "data": {
      "description": {
        "value": "<p>If you take the Disengage action, your movement doesn't provoke opportunity attacks for the rest of the turn.</p>",
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
      "uses": {
        "value": 1,
        "max": "1",
        "per": "charges",
        "autoDestroy": true
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
    "type": "consumable",
    "img": "modules/enhancedcombathud/icons/cloak-dagger.svg",
    "data": {
      "description": {
        "value": "<p>When you take the Hide action, you make a Dexterity (Stealth) check in an attempt to hide, following the rules for hiding. If you succeed, you gain certain benefits.</p>\n<p data-content-chunk-id=\"d49da437-9800-4cdb-be60-5c1cc12e45f2\">Combatants often try to escape their foes' notice by hiding, casting the&nbsp;invisibility&nbsp;spell, or lurking in darkness.</p>\n<p data-content-chunk-id=\"c7a62036-4c31-4a7f-bd29-db5f4a873f8c\">When you attack a target that you can't see, you have disadvantage on the attack roll. This is true whether you're guessing the target's location or you're targeting a creature you can hear but not see. If the target isn't in the location you targeted, you automatically miss, but the DM typically just says that the attack missed, not whether you guessed the target's location correctly.</p>\n<p data-content-chunk-id=\"760a7b7d-7681-4f2c-a356-05594eca1bbd\">When a creature can't see you, you have advantage on attack rolls against it. If you are hidden--both unseen and unheard--when you make an attack, you give away your location when the attack hits or misses.</p>\n<p>&nbsp;</p>",
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
      "uses": {
        "value": 1,
        "max": "1",
        "per": "charges",
        "autoDestroy": true
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
    "type": "consumable",
    "img": "modules/enhancedcombathud/icons/shield-bash.svg",
    "data": {
      "description": {
        "value": "<p data-content-chunk-id=\"5242445d-e04b-437b-b1c4-4fef6622c350\">When you want to grab a creature or wrestle with it, you can use the Attack action to make a special melee attack, a grapple. If you're able to make multiple attacks with the Attack action, this attack replaces one of them.</p>\n<p data-content-chunk-id=\"55b5838a-271d-4cb3-b971-9769a49a921c\">The target of your grapple must be no more than one size larger than you and must be within your reach. Using at least one free hand, you try to seize the target by making a grapple check instead of an attack roll: a Strength (Athletics) check contested by the target's Strength (Athletics) or Dexterity (Acrobatics) check (the target chooses the ability to use). You succeed automatically if the target is&nbsp;incapacitated. If you succeed, you subject the target to the&nbsp;grappled&nbsp;condition. The condition specifies the things that end it, and you can release the target whenever you like (no action required).</p>\n<p data-content-chunk-id=\"a5d87cfc-afcc-4ae2-99c4-b4ed2af6a439\">Escaping a Grapple.&nbsp;A&nbsp;grappled&nbsp;creature can use its action to escape. To do so, it must succeed on a Strength (Athletics) or Dexterity (Acrobatics) check contested by your Strength (Athletics) check.</p>\n<p data-content-chunk-id=\"ea1b3c54-b95f-45cb-8c5c-1ed310d82ce2\">Moving a Grappled Creature.&nbsp;When you move, you can drag or carry the&nbsp;grappled&nbsp;creature with you, but your speed is halved, unless the creature is two or more sizes smaller than you.</p>\n<h4 id=\"ShovingaCreature\" data-content-chunk-id=\"5b230975-10b4-4cd0-bd03-2770875c21e5\">Shoving a Creature</h4>\n<p data-content-chunk-id=\"f4e214a2-2779-43c0-b318-23f5e5c47a9f\">Using the Attack action, you can make a special melee attack to shove a creature, either to knock it&nbsp;prone&nbsp;or push it away from you. If you're able to make multiple attacks with the Attack action, this attack replaces one of them.</p>\n<p data-content-chunk-id=\"d6bd6c9e-bda0-4b45-a5be-f9425e23783c\">The target must be no more than one size larger than you and must be within your reach. Instead of making an attack roll, you make a Strength (Athletics) check contested by the target's Strength (Athletics) or Dexterity (Acrobatics) check (the target chooses the ability to use). You succeed automatically if the target is&nbsp;incapacitated. If you succeed, you either knock the target&nbsp;prone&nbsp;or push it 5 feet away from you.</p>",
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
      "uses": {
        "value": 1,
        "max": "1",
        "per": "charges",
        "autoDestroy": true
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
    "type": "consumable",
    "img": "modules/enhancedcombathud/icons/walking-boot.svg",
    "data": {
      "description": {
        "value": "<p data-content-chunk-id=\"32f25854-3ca6-4afe-8790-0a87b06879b1\">When you take the Dash action, you gain extra movement for the current turn. The increase equals your speed, after applying any modifiers. With a speed of 30 feet, for example, you can move up to 60 feet on your turn if you dash.</p>\n<p data-content-chunk-id=\"8587443b-c938-455a-9861-09e5af6a9629\">Any increase or decrease to your speed changes this additional movement by the same amount. If your speed of 30 feet is reduced to 15 feet, for instance, you can move up to 30 feet this turn if you dash.</p>",
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
      "uses": {
        "value": 1,
        "max": "1",
        "per": "charges",
        "autoDestroy": true
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
    "type": "consumable",
    "img": "modules/enhancedcombathud/icons/armor-upgrade.svg",
    "data": {
      "description": {
        "value": "<p>When you take the Dodge action, you focus entirely on avoiding attacks. Until the start of your next turn, any attack roll made against you has disadvantage if you can see the attacker, and you make Dexterity saving throws with advantage. You lose this benefit if you are&nbsp;incapacitated&nbsp;or if your speed drops to 0.</p>",
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
      "uses": {
        "value": 1,
        "max": "1",
        "per": "charges",
        "autoDestroy": true
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
    "type": "consumable",
    "img": "modules/enhancedcombathud/icons/clockwork.svg",
    "data": {
      "description": {
        "value": "<p data-content-chunk-id=\"7cbedb62-3df7-482e-9bee-412289356aca\">Sometimes you want to get the jump on a foe or wait for a particular circumstance before you act. To do so, you can take the Ready action on your turn, which lets you act using your reaction before the start of your next turn.</p>\n<p data-content-chunk-id=\"ef9f90d3-f264-4278-a0f8-0684073c429f\">First, you decide what perceivable circumstance will trigger your reaction. Then, you choose the action you will take in response to that trigger, or you choose to move up to your speed in response to it. Examples include \"If the cultist steps on the trapdoor, I'll pull the lever that opens it,\" and \"If the goblin steps next to me, I move away.\"</p>\n<p data-content-chunk-id=\"6c8b0166-9e42-42fa-9ef6-6c01381032c9\">When the trigger occurs, you can either take your reaction right after the trigger finishes or ignore the trigger. Remember that you can take only one reaction per round.</p>\n<p data-content-chunk-id=\"2783c1c8-74e2-4b36-8eb7-2a7c4ea671e3\">When you ready a spell, you cast it as normal but hold its energy, which you release with your reaction when the trigger occurs. To be readied, a spell must have a casting time of 1 action, and holding onto the spell's magic requires concentration. If your concentration is broken, the spell dissipates without taking effect. For example, if you are concentrating on the&nbsp;web&nbsp;spell and ready&nbsp;magic missile, your&nbsp;web&nbsp;spell ends, and if you take damage before you release&nbsp;magic missile&nbsp;with your reaction, your concentration might be broken.</p>",
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
      "uses": {
        "value": 1,
        "max": "1",
        "per": "charges",
        "autoDestroy": true
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