Hooks.once("init", function () {});

Hooks.on("renderItemSheet", (itemsheet, html) => {
  let echFlags = itemsheet.object.data.flags.enhancedcombathud;
  let confightml = `<div class="form-group stacked" id="test">
<label>${game.i18n.localize("enhancedcombathud.itemconfig.sets.text")}</label>
<div class="form-fields">
    <label class="checkbox">
        <input type="checkbox" ${
          echFlags?.set1p ? "checked" : ""
        } name="flags.enhancedcombathud.set1p"> ${game.i18n.localize(
    "enhancedcombathud.itemconfig.set1p.text"
  )}
    </label>
    <label class="checkbox">
        <input type="checkbox" ${
          echFlags?.set2p ? "checked" : ""
        } name="flags.enhancedcombathud.set2p"> ${game.i18n.localize(
    "enhancedcombathud.itemconfig.set2p.text"
  )}
    </label>
    <label class="checkbox">
    <input type="checkbox" ${
      echFlags?.set1s ? "checked" : ""
    } name="flags.enhancedcombathud.set1s"> ${game.i18n.localize(
"enhancedcombathud.itemconfig.set1s.text"
)}
</label>
<label class="checkbox">
    <input type="checkbox" ${
      echFlags?.set2s ? "checked" : ""
    } name="flags.enhancedcombathud.set2s"> ${game.i18n.localize(
"enhancedcombathud.itemconfig.set2s.text"
)}
</label>
</div>
</div>`;
  html
    .find('div[class="form-group stacked weapon-properties"]')
    .before(confightml);
});



Hooks.on("getSceneControlButtons", (controls, b, c) => {
    if (!_patrol) _patrol = Patrol.get();
    controls.find(x => x.name == "token").tools.push({
      active: false,
      icon: "ech-swords",
      name: "echtoggle",
      title: "Toggle",
      onClick: (toggle) => {
        if(toggle){
          canvas.hud.enhancedcombathud.bind(_token)
        }else{
          canvas.hud.enhancedcombathud.clear()
        }
      },
      toggle: true,
    });
});
