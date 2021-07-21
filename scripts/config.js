Hooks.once("init", function () {});

Hooks.on("renderItemSheet", (itemsheet, html) => {
  let echFlags = itemsheet.object.data.flags.enhancedcombathud;
  let confightml = `<div class="form-group stacked" id="test">
<label>${game.i18n.localize("enhancedcombathud.itemconfig.sets.text")}</label>
<div class="form-fields">
    <label class="checkbox">
        <input type="checkbox" ${
          echFlags?.set1 ? "checked" : ""
        } name="flags.enhancedcombathud.set1"> ${game.i18n.localize(
    "enhancedcombathud.itemconfig.set1.text"
  )}
    </label>
    <label class="checkbox">
        <input type="checkbox" ${
          echFlags?.set2 ? "checked" : ""
        } name="flags.enhancedcombathud.set2"> ${game.i18n.localize(
    "enhancedcombathud.itemconfig.set2.text"
  )}
    </label>
</div>
</div>`;
  html
    .find('div[class="form-group stacked weapon-properties"]')
    .before(confightml);
});
