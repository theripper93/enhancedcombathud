Hooks.once("init", function () {


  game.settings.register("enhancedcombathud", "theme", {
    name: game.i18n.localize("enhancedcombathud.settings.theme.name"),
    hint: game.i18n.localize("enhancedcombathud.settings.theme.hint"),
    scope: "client",
    config: true,
    choices: {
      "custom": game.i18n.localize("enhancedcombathud.settings.theme.custom"),
      "helium": game.i18n.localize("enhancedcombathud.settings.theme.helium"),
      "neon": game.i18n.localize("enhancedcombathud.settings.theme.neon"),
      "argon": game.i18n.localize("enhancedcombathud.settings.theme.argon"),
      "krypton":  game.i18n.localize("enhancedcombathud.settings.theme.krypton"),
      "xenon": game.i18n.localize("enhancedcombathud.settings.theme.xenon"),
      "radon": game.i18n.localize("enhancedcombathud.settings.theme.radon"),
      "oganesson": game.i18n.localize("enhancedcombathud.settings.theme.oganesson"),
    },
    type: String,
    default: "custom",
    onChange: () => {canvas.hud.enhancedcombathud?.setColorSettings()}
  });

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

  game.settings.register("enhancedcombathud", "noAutoscale", {
    name: game.i18n.localize("enhancedcombathud.settings.noAutoscale.name"),
    hint: game.i18n.localize("enhancedcombathud.settings.noAutoscale.hint"),
    scope: "client",
    config: true,
    type: Boolean,
    default: false,
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

  game.settings.register("enhancedcombathud", "showTooltips", {
    name: game.i18n.localize("enhancedcombathud.settings.showTooltips.name"),
    hint: game.i18n.localize("enhancedcombathud.settings.showTooltips.hint"),
    scope: "client",
    config: true,
    type: Boolean,
    default: true,
  });

  game.settings.register("enhancedcombathud", "showTooltipsSpecial", {
    name: game.i18n.localize("enhancedcombathud.settings.showTooltipsSpecial.name"),
    hint: game.i18n.localize("enhancedcombathud.settings.showTooltipsSpecial.hint"),
    scope: "client",
    config: true,
    type: Boolean,
    default: true,
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
    onChange: () => {canvas.hud.enhancedcombathud?.setColorSettings()}
  });
  new window.Ardittristan.ColorSetting("enhancedcombathud", "color", {
    name: game.i18n.localize("enhancedcombathud.settings.color.text"),
    hint: game.i18n.localize("enhancedcombathud.settings.color.hint"),
    label: game.i18n.localize("enhancedcombathud.settings.color.label"),
    restricted: true,
    defaultColor: "#414B55E6",
    scope: "world",
    onChange: () => {canvas.hud.enhancedcombathud?.setColorSettings()}
  });
  new window.Ardittristan.ColorSetting("enhancedcombathud", "color-bonus-action", {
    name: game.i18n.localize("enhancedcombathud.settings.color-bonus-action.text"),
    hint: game.i18n.localize("enhancedcombathud.settings.color-bonus-action.hint"),
    label: game.i18n.localize("enhancedcombathud.settings.color.label"),
    restricted: true,
    defaultColor: "#453B75E6",
    scope: "world",
    onChange: () => {canvas.hud.enhancedcombathud?.setColorSettings()}
  });
  new window.Ardittristan.ColorSetting("enhancedcombathud", "color-free-action", {
    name: game.i18n.localize("enhancedcombathud.settings.color-free-action.text"),
    hint: game.i18n.localize("enhancedcombathud.settings.color-free-action.hint"),
    label: game.i18n.localize("enhancedcombathud.settings.color.label"),
    restricted: true,
    defaultColor: "#3B5875E6",
    scope: "world",
    onChange: () => {canvas.hud.enhancedcombathud?.setColorSettings()}
  });
  new window.Ardittristan.ColorSetting("enhancedcombathud", "color-reaction", {
    name: game.i18n.localize("enhancedcombathud.settings.color-reaction.text"),
    hint: game.i18n.localize("enhancedcombathud.settings.color-reaction.hint"),
    label: game.i18n.localize("enhancedcombathud.settings.color.label"),
    restricted: true,
    defaultColor: "#753B3BE6",
    scope: "world",
    onChange: () => {canvas.hud.enhancedcombathud?.setColorSettings()}
  });
  new window.Ardittristan.ColorSetting("enhancedcombathud", "color-end-turn", {
    name: game.i18n.localize("enhancedcombathud.settings.color-end-turn.text"),
    hint: game.i18n.localize("enhancedcombathud.settings.color-end-turn.hint"),
    label: game.i18n.localize("enhancedcombathud.settings.color.label"),
    restricted: true,
    defaultColor: "#374B3CE6",
    scope: "world",
    onChange: () => {canvas.hud.enhancedcombathud?.setColorSettings()}
  });

  new window.Ardittristan.ColorSetting("enhancedcombathud", "color-tooltip", {
    name: game.i18n.localize("enhancedcombathud.settings.color-tooltip.text"),
    hint: game.i18n.localize("enhancedcombathud.settings.color-tooltip.hint"),
    label: game.i18n.localize("enhancedcombathud.settings.color.label"),
    restricted: true,
    defaultColor: "#414B55E6",
    scope: "world",
    onChange: () => {canvas.hud.enhancedcombathud?.setColorSettings()}
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
  let max = data.data.uses.max
  let current = data.data.uses.value
  let quantity = data.data.quantity
  if(quantity) return `class="feature-element has-count" data-item-count="${quantity}"`
  if(current) return `class="feature-element has-count" data-item-count="${current}"`
  return `class="feature-element"`
})

Handlebars.registerHelper('generateSavingThrows', (str) => {
  let data = canvas.hud.enhancedcombathud.hudData[str];
  let localize = canvas.hud.enhancedcombathud.hudData.settings.localize
  let html = '';
  let prof = {
    '0': 'not-proficient',
    '0.5': 'half-proficiency',
    '1': 'proficient',
    '2': 'expertise'
  }

  if (Object.entries(data).length > 0) {
    html += `<li class="ability ability-title">${'Abilities'} <div><span>Check</span><span>Save</span></div></li>`
  }

  for(let [key, value] of Object.entries(data)) {
    console.log(value)
    html += `<li class="ability is-${str.substring(0, str.length - 1)} proficiency-is-${prof[value.proficient]}" data-roll="${str == 'tools' ? value.label : key}" data-modifier="save" >
        <span class="ability-name">${value.label}</span> 
        <div style="margin-left: auto;">
          <span data-type="check">${value.mod < 0 ? value.mod : '+' + value.mod }</span> 
          <span data-type="save">${value.save < 0 ? value.save : '+' + value.save }</span> 
        </div>
      </li>`
  }


  return html;
})

Handlebars.registerHelper('generateAbilities', function (str) {
  let data = canvas.hud.enhancedcombathud.hudData[str];
  let localize = canvas.hud.enhancedcombathud.hudData.settings.localize
  let html = '';
  let prof = {
    '0': 'not-proficient',
    '0.5': 'half-proficiency',
    '1': 'proficient',
    '2': 'expertise'
  }
  let $dropdown = $('<select></select>');

  for (let [key, value] of Object.entries(game.dnd5e.config.abilities)) {
    $dropdown.append(`<option value="${key}">${value.substring(0,3)}</option>`);
  }

  if (Object.entries(data).length > 0) {
    html += `<li class="ability ability-title">${localize[str]}</li>`
  }

  for(let [key, value] of Object.entries(data)){
    $dropdown.find(`[selected]`).removeAttr('selected');
    $dropdown.find(`[value="${value.ability}"]`).attr('selected', true);

    html += `<li class="ability is-${str.substring(0, str.length - 1)} proficiency-is-${prof[value.proficient]}" data-roll="${str == 'tools' ? value.label : key}" data-modifier="${value.ability}" >
        <span class="ability-code">${$dropdown.prop('outerHTML')}</span> <span class="ability-name">${value.label}</span> <span style="margin-left: auto;"><span class="ability-modifier" data-ability="${value.ability}" data-skill="${key}">${value.total < 0 ? value.total : '+'+value.total }</span> <span class="ability-passive">(${value.passive})</span></span>
      </li>`
  }

  return html;
})

$('body').on('click', '.ability-menu .ability-toggle', (event) => {
  $('body').toggleClass('ech-show-ability-menu');
  let element = document.querySelector('.extended-combat-hud');
  let ratio = element.style.transform.replace(/[^0-9.]+/g, '');
  let scaleHeight = ($(window).height()-$('.portrait-hud').outerHeight()*ratio)/(ratio)-70;
  $('.ability-menu ul').first().css({
    'max-height': $('body').hasClass('ech-show-ability-menu') ? `${scaleHeight}px` : '0px'
  })
})