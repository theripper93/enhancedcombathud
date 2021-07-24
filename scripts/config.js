Hooks.once("init", function () {


  game.settings.register("enhancedcombathud", "scale", {
    name: game.i18n.localize("enhancedcombathud.settings.scale.name"),
    hint: game.i18n.localize("enhancedcombathud.settings.scale.hint"),
    scope: "client",
    config: true,
    range: {
      min: 0.1,
      max: 2,
      step: 0.1,
    },
    type: Number,
    default: 1,
  });

  game.settings.register("enhancedcombathud", "leftPos", {
    name: game.i18n.localize("enhancedcombathud.settings.leftPos.name"),
    hint: game.i18n.localize("enhancedcombathud.settings.leftPos.hint"),
    scope: "client",
    config: true,
    type: Number,
    default: 15,
  });

  game.settings.register("enhancedcombathud", "botPos", {
    name: game.i18n.localize("enhancedcombathud.settings.botPos.name"),
    hint: game.i18n.localize("enhancedcombathud.settings.botPos.hint"),
    scope: "client",
    config: true,
    type: Number,
    default: 15,
  });

  game.settings.register("enhancedcombathud", "preparedSpells", {
    name: game.i18n.localize("enhancedcombathud.settings.preparedSpells.name"),
    hint: game.i18n.localize("enhancedcombathud.settings.preparedSpells.hint"),
    scope: "client",
    config: true,
    type: Boolean,
    default: false,
  });
});

//Color Settings


Hooks.once("ready", function () {
  new window.Ardittristan.ColorSetting("enhancedcombathud", "fore-color", {
    name: game.i18n.localize("enhancedcombathud.settings.fore-color.text"),
    hint: game.i18n.localize("enhancedcombathud.settings.fore-color.hint"),
    label: game.i18n.localize("enhancedcombathud.settings.color.label"),
    restricted: true,
    defaultColor: "#B4D2DCFF",
    scope: "world",
  });
  new window.Ardittristan.ColorSetting("enhancedcombathud", "color", {
    name: game.i18n.localize("enhancedcombathud.settings.color.text"),
    hint: game.i18n.localize("enhancedcombathud.settings.color.hint"),
    label: game.i18n.localize("enhancedcombathud.settings.color.label"),
    restricted: true,
    defaultColor: "#414B55E6",
    scope: "world",
  });
  new window.Ardittristan.ColorSetting("enhancedcombathud", "color-bonus-action", {
    name: game.i18n.localize("enhancedcombathud.settings.color-bonus-action.text"),
    hint: game.i18n.localize("enhancedcombathud.settings.color-bonus-action.hint"),
    label: game.i18n.localize("enhancedcombathud.settings.color.label"),
    restricted: true,
    defaultColor: "#453B75E6",
    scope: "world",
  });
  new window.Ardittristan.ColorSetting("enhancedcombathud", "color-free-action", {
    name: game.i18n.localize("enhancedcombathud.settings.color-free-action.text"),
    hint: game.i18n.localize("enhancedcombathud.settings.color-free-action.hint"),
    label: game.i18n.localize("enhancedcombathud.settings.color.label"),
    restricted: true,
    defaultColor: "#3B5875E6",
    scope: "world",
  });
  new window.Ardittristan.ColorSetting("enhancedcombathud", "color-reaction", {
    name: game.i18n.localize("enhancedcombathud.settings.color-reaction.text"),
    hint: game.i18n.localize("enhancedcombathud.settings.color-reaction.hint"),
    label: game.i18n.localize("enhancedcombathud.settings.color.label"),
    restricted: true,
    defaultColor: "#753B3BE6",
    scope: "world",
  });
  new window.Ardittristan.ColorSetting("enhancedcombathud", "color-end-turn", {
    name: game.i18n.localize("enhancedcombathud.settings.color-end-turn.text"),
    hint: game.i18n.localize("enhancedcombathud.settings.color-end-turn.hint"),
    label: game.i18n.localize("enhancedcombathud.settings.color.label"),
    restricted: true,
    defaultColor: "#374B3CE6",
    scope: "world",
  });
});

Hooks.on("renderItemSheet", (itemsheet, html) => {
  let actionType = itemsheet.object.data.data.activation.type;
  let itemType = itemsheet.object.data.type;
  let echFlags = itemsheet.object.data.flags.enhancedcombathud;

  // Constant function that returns formatted label
  const labelTemplate = (set) => {
    return `<label class="checkbox">
      <input type="checkbox" 
        ${echFlags?.[set] ? "checked" : ""} 
        name="flags.enhancedcombathud.${set}"> 
        ${game.i18n.localize('enhancedcombathud.itemconfig.' + set + '.text')}
      </label>`;
  }

  const configHtmlElements = {
    start: `<div class="form-group stacked" id="test">
      <label>${game.i18n.localize("enhancedcombathud.itemconfig.sets.text")}</label>`,
    end: `</div>`
  };

  let confightml = configHtmlElements.start;

  if (actionType === "action" || itemType === "weapon" || itemType === "consumable") {
    confightml += `<div class="form-fields">`;
    confightml += labelTemplate('set1p');
    confightml += labelTemplate('set2p');
    confightml += labelTemplate('set3p');
    confightml += `</div>`;
  }
  if (actionType === "bonus" || itemType === "weapon" || itemType === "equipment") {
    confightml += `<div class="form-fields">`;
    confightml += labelTemplate('set1s');
    confightml += labelTemplate('set2s');
    confightml += labelTemplate('set3s');
    confightml += `</div>`;
  }
  confightml += configHtmlElements.end;

  html.find('div[class="form-group stacked"]').first().before(confightml);
});

Hooks.on("getSceneControlButtons", (controls, b, c) => {
  controls
    .find((x) => x.name == "token")
    .tools.push({
      active: false,
      icon: "ech-swords",
      name: "echtoggle",
      title: "Toggle",
      onClick: (toggle) => {
        if (toggle) {
          canvas.hud.enhancedcombathud.bind(_token);
        } else {
          canvas.hud.enhancedcombathud.close();
        }

        $(".ech-swords").parent().toggleClass("active", toggle);
      },
      toggle: true,
    });
});
Hooks.on("renderTokenHUD", (app, html, data) => {
  let $tokenHUDButton = $(
    `<div class="control-icon echtoggle"><i class="ech-swords"></i></div>`
  );
  $tokenHUDButton.toggleClass(
    "active",
    $('.control-tool[data-tool="echtoggle"]').hasClass("active")
  );

  html.find(".col.left").prepend($tokenHUDButton);
  html.find(".col.left").on("click", ".control-icon.echtoggle", (event) => {
    $('.control-tool[data-tool="echtoggle"]').trigger("click");
  });
});


Handlebars.registerHelper('spellSlots', function (obj) {
  return CombatHudCanvasElement.generateSpells(obj);
})

Handlebars.registerHelper('hasUses', function (data) {
  debugger
  let max = data.data.uses.max
  let current = data.data.uses.value
  let quantity = data.data.quantity
  if(quantity) return `class="feature-element has-count" data-item-count="${quantity}"`
  if(current) return `class="feature-element has-count" data-item-count="${current}"`
  return `class="feature-element"`
})