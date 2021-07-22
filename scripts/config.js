Hooks.once("init", function () {});

Hooks.on("renderItemSheet", (itemsheet, html) => {
  let actionType = itemsheet.object.data.data.activation.type;
  let itemType = itemsheet.object.data.type;
  let echFlags = itemsheet.object.data.flags.enhancedcombathud;

  const configHtmlElements = {
    start: `<div class="form-group stacked" id="test">
    <label>${game.i18n.localize(
      "enhancedcombathud.itemconfig.sets.text"
    )}</label>
    <div class="form-fields">`,
    set1p: `<label class="checkbox">
            <input type="checkbox" ${
              echFlags?.set1p ? "checked" : ""
            } name="flags.enhancedcombathud.set1p"> ${game.i18n.localize(
      "enhancedcombathud.itemconfig.set1p.text"
    )}
        </label>`,
    set2p: `<label class="checkbox">
    <input type="checkbox" ${
      echFlags?.set2p ? "checked" : ""
    } name="flags.enhancedcombathud.set2p"> ${game.i18n.localize(
      "enhancedcombathud.itemconfig.set2p.text"
    )}
  </label>`,
    set1s: ` <label class="checkbox">
    <input type="checkbox" ${
      echFlags?.set1s ? "checked" : ""
    } name="flags.enhancedcombathud.set1s"> ${game.i18n.localize(
      "enhancedcombathud.itemconfig.set1s.text"
    )}
    </label>`,
    set2s: `<label class="checkbox">
    <input type="checkbox" ${
      echFlags?.set2s ? "checked" : ""
    } name="flags.enhancedcombathud.set2s"> ${game.i18n.localize(
      "enhancedcombathud.itemconfig.set2s.text"
    )}
    </label>`,
    end: `</div>
    </div>`,
  };

  let confightml = configHtmlElements.start;

  if(actionType === "action" || itemType === "weapon" || itemType === "consumable") {
    confightml += configHtmlElements.set1p;
    confightml += configHtmlElements.set2p;
  }
  if(actionType === "bonus" || itemType === "weapon" || itemType === "equipment"){
    confightml += configHtmlElements.set1s;
    confightml += configHtmlElements.set2s;
  }


  confightml+= configHtmlElements.end;
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
          canvas.hud.enhancedcombathud.clear();
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
