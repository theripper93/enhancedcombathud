class CombatHud {
  constructor(token) {
    this.token = token;
    this.actor = token.actor;
    this.settings = {
      spellMode: game.settings.get("enhancedcombathud", "preparedSpells"),
      localize: {
        mainactions: game.i18n.localize(
          "enhancedcombathud.hud.mainactions.name"
        ),
        castspell: game.i18n.localize("enhancedcombathud.hud.castspell.name"),
        usepower: game.i18n.localize("enhancedcombathud.hud.usepower.name"),
        useitem: game.i18n.localize("enhancedcombathud.hud.useitem.name"),
        bonusaction: game.i18n.localize(
          "enhancedcombathud.hud.bonusaction.name"
        ),
        reaction: game.i18n.localize("enhancedcombathud.hud.reaction.name"),
        specialaction: game.i18n.localize(
          "enhancedcombathud.hud.specialaction.name"
        ),
        pass: game.i18n.localize("enhancedcombathud.hud.pass.name"),
        endturn: game.i18n.localize("enhancedcombathud.hud.endturn.name"),
        hp: game.i18n.localize("enhancedcombathud.hud.hp.name"),
        ac: game.i18n.localize("enhancedcombathud.hud.ac.name"),
        of: game.i18n.localize("enhancedcombathud.hud.of.name"),
        inv: game.i18n.localize("enhancedcombathud.hud.inventory.name"),
        spells: {
          0: game.dnd5e.config.spellLevels["0"],
          pact: game.dnd5e.config.spellPreparationModes.pact,
          will: game.dnd5e.config.spellPreparationModes.atwill,
          innate: game.i18n.localize("enhancedcombathud.hud.spells.innate"),
          1: game.dnd5e.config.spellLevels["1"],
          2: game.dnd5e.config.spellLevels["2"],
          3: game.dnd5e.config.spellLevels["3"],
          4: game.dnd5e.config.spellLevels["4"],
          5: game.dnd5e.config.spellLevels["5"],
          6: game.dnd5e.config.spellLevels["6"],
          7: game.dnd5e.config.spellLevels["7"],
          8: game.dnd5e.config.spellLevels["8"],
          9: game.dnd5e.config.spellLevels["9"],
        },
      },
    };
    this.actions = {
      attack: this.getItems({
        actionType: ["action"],
        itemType: ["weapon"],
        equipped: true,
      }),
      spells: this.getItems({
        actionType: ["action"],
        itemType: ["spell"],
        prepared: true,
      }),
      special: this.getItems({ actionType: ["action"], itemType: ["feat"] }),
      consumables: this.getItems({
        actionType: ["action"],
        itemType: ["consumable"],
      }),
    };
    this.bonus = {
      attack: this.getItems({
        actionType: ["bonus"],
        itemType: ["weapon"],
        equipped: true,
      }),
      spells: this.getItems({
        actionType: ["bonus"],
        itemType: ["spell"],
        prepared: true,
      }),
      special: this.getItems({ actionType: ["bonus"], itemType: ["weapon"] }),
      consumables: this.getItems({
        actionType: ["bonus"],
        itemType: ["consumable"],
      }),
    };
    this.reactions = {
      attack: this.getItems({
        actionType: ["reaction"],
        itemType: ["weapon"],
        equipped: true,
      }),
      spells: this.getItems({
        actionType: ["reaction"],
        itemType: ["spell"],
        prepared: true,
      }),
      special: this.getItems({
        actionType: ["reaction"],
        itemType: ["weapon"],
      }),
      consumables: this.getItems({
        actionType: ["reaction"],
        itemType: ["consumable"],
      }),
    };
    this.free = {
      special: this.getItems({ actionType: ["special"], itemType: ["feat"] }),
    };
    this.other = {
      portrait: this.actor.data.img,
      name: this.actor.data.name,
      maxHp: this.actor.data.data.attributes.hp.max,
      currHp: this.actor.data.data.attributes.hp.value,
      movement: {
        max: Math.round(
          this.actor.data.data.attributes.movement.walk /
            canvas.dimensions.distance
        ),
        current: 0,
        moved: 0,
      },
      ac: this.actor.data.data.attributes.ac.value,
      classes: this.getClassesAsString(),
      specialItemsNames: {
        disengage: game.i18n.localize("enhancedcombathud.items.disengage.name"),
        hide: game.i18n.localize("enhancedcombathud.items.hide.name"),
        shove: game.i18n.localize("enhancedcombathud.items.shove.name"),
        dash: game.i18n.localize("enhancedcombathud.items.dash.name"),
        dodge: game.i18n.localize("enhancedcombathud.items.dodge.name"),
        ready: game.i18n.localize("enhancedcombathud.items.ready.name"),
      },
    };
    this.resources = {
      action: true,
      bonus: true,
      other: true,
    };
    this.sets = this.getSets();
    this.sets.active = this.actor.data.flags.enhancedcombathud?.activeSet
      ? this.sets[`${this.actor.data.flags.enhancedcombathud?.activeSet}`]
      : this.sets.set1;
    this.resources = {
      action: true,
      bonus: true,
      reaction: true,
    };
    this.skills = game.dnd5e.config.skills;
    this.saves = game.dnd5e.config.abilities;

    console.log(this);
  }
  getClassesAsString() {
    let classes = this.actor.data.data.classes;
    if (!classes) return "";
    if (Object.keys(classes).length === 0)
      return this.actor.labels.creatureType;
    let string = "";
    for (let [key, value] of Object.entries(classes)) {
      string += "lvl " + value.levels + " ";
      string += key[0].toUpperCase() + key.substring(1);
      string += value.subclass
        ? " (" +
          value.subclass[0].toUpperCase() +
          value.subclass.substring(1) +
          ") "
        : "";
    }
    return string;
  }
  getItems(filters) {
    const actionType = filters.actionType;
    const itemType = filters.itemType;
    const equipped = filters.equipped;
    const prepared = filters.prepared;

    let items = this.actor.data.items;

    let filteredItems = items.filter((i) => {
      let itemData = i.data;
      if (equipped === true && !itemData.data.equipped) return false;
      if (
        this.settings.spellMode &&
        prepared === true &&
        itemData.data.preparation?.prepared === false &&
        itemData.data.preparation?.prepared != "always"
      )
        return false;
      if (
        actionType &&
        actionType.includes(itemData.data.activation?.type) &&
        itemType &&
        itemType.includes(itemData.type)
      )
        return true;
      return false;
    });
    let spells = {};
    spells[this.settings.localize.spells["0"]] = [];
    spells[this.settings.localize.spells["innate"]] = [];
    spells[this.settings.localize.spells["will"]] = [];
    spells[this.settings.localize.spells["pact"]] = [];
    spells[this.settings.localize.spells["1"]] = [];
    spells[this.settings.localize.spells["2"]] = [];
    spells[this.settings.localize.spells["3"]] = [];
    spells[this.settings.localize.spells["4"]] = [];
    spells[this.settings.localize.spells["5"]] = [];
    spells[this.settings.localize.spells["6"]] = [];
    spells[this.settings.localize.spells["7"]] = [];
    spells[this.settings.localize.spells["8"]] = [];
    spells[this.settings.localize.spells["9"]] = [];
    if (prepared) {
      for (let item of filteredItems) {
        let key = item.labels.level;
        switch (item.data.data.preparation.mode) {
          case "innate":
            key = this.settings.localize.spells["innate"];
            break;

          case "atwill":
            key = this.settings.localize.spells["will"];
            break;

          case "pact":
            key = this.settings.localize.spells["pact"];
            break;
        }
        spells[key].push(item);
      }

      for (let spellLevel of Object.keys(spells)) {
        if (spells[spellLevel].length == 0) {
          delete spells[spellLevel];
        }
      }
    }

    if (filters.prepared === true) {
      return spells;
    } else {
      return filteredItems;
    }
  }
  findItemByName(itemName) {
    let items = this.actor.data.items;
    let item = items.find((i) => i.data.name == itemName);
    return item;
  }
  getSets() {
    let items = this.actor.data.items;
    let sets = {
      set1: {
        primary: null,
        secondary: null,
      },
      set2: {
        primary: null,
        secondary: null,
      },
      set3: {
        primary: null,
        secondary: null,
      },
    };
    for (let item of items) {
      if (item.data.flags.enhancedcombathud?.set1p) sets.set1.primary = item;
      if (item.data.flags.enhancedcombathud?.set2p) sets.set2.primary = item;
      if (item.data.flags.enhancedcombathud?.set3p) sets.set3.primary = item;
      if (item.data.flags.enhancedcombathud?.set1s) sets.set1.secondary = item;
      if (item.data.flags.enhancedcombathud?.set2s) sets.set2.secondary = item;
      if (item.data.flags.enhancedcombathud?.set3s) sets.set3.secondary = item;
    }
    return sets;
  }
  _render() {
    canvas.hud.enhancedcombathud.bind(this.token);
  }
  async switchSets(active) {
    if (this.sets.active == this.sets.set1) {
      await this.sets.set1.primary?.update({ "data.equipped": false });
      await this.sets.set1.secondary?.update({ "data.equipped": false });
    } else if (this.sets.active == this.sets.set2) {
      await this.sets.set2.primary?.update({ "data.equipped": false });
      await this.sets.set2.secondary?.update({ "data.equipped": false });
    } else if (this.sets.active == this.sets.set3) {
      await this.sets.set3.primary?.update({ "data.equipped": false });
      await this.sets.set3.secondary?.update({ "data.equipped": false });
    }
    this.sets.active = this.sets[active];
    this.actor.setFlag("enhancedcombathud", "activeSet", active);
    await this.sets.active.primary?.update({ "data.equipped": true });
    await this.sets.active.secondary?.update({ "data.equipped": true });
  }
  set hasAction(value) {
    $(canvas.hud.enhancedcombathud.element)
      .find('.actions-container.has-actions[data-actionbartype="actions"]')
      .toggleClass("actions-used", !value);
  }
  set hasReaction(value) {
    $(canvas.hud.enhancedcombathud.element)
      .find('.actions-container.has-actions[data-actionbartype="reactions"]')
      .toggleClass("actions-used", !value);
  }
  set hasBonus(value) {
    $(canvas.hud.enhancedcombathud.element)
      .find('.actions-container.has-actions[data-actionbartype="bonus"]')
      .toggleClass("actions-used", !value);
  }
  get spellSlots() {
    return this.actor.data.data.spells;
  }
  get movementColor() {}
}

class CombatHudCanvasElement extends BasePlaceableHUD {
  static get defaultOptions() {
    const options = super.defaultOptions;
    options.template =
      "modules/enhancedcombathud/templates/extendedCombatHud.html";
    options.id = "enhancedcombathud";

    return options;
  }

  getData() {
    const data = super.getData();
    data.hudData = new CombatHud(this.object);
    this.hudData = data.hudData;
    return data;
  }

  close() {
    super.close();
    this.toggleMacroPlayers(true);
  }

  setPosition() {
    if (!this.object) return;
    this.rigHtml();
    const position = {
      "z-index": 100,
      left: game.settings.get("enhancedcombathud", "leftPos") + "px",
      bottom: game.settings.get("enhancedcombathud", "botPos") + "px",
    };
    this.element.css(position);
    this.toggleMacroPlayers(false);
  }

  rigHtml() {
    this.clearEmpty();
    this.setColorSettings();
    this.updatePass();
    this.updateMovement();
    this.rigButtons();
    this.rigAccordion();
    this.initSets();
    this.rigAutoScale();
  }

  setColorSettings() {
    document.documentElement.style.setProperty(
      "--ech-fore-color",
      game.settings.get("enhancedcombathud", "fore-color")
    );
    document.documentElement.style.setProperty(
      "--ech-color",
      game.settings.get("enhancedcombathud", "color")
    );
    document.documentElement.style.setProperty(
      "--ech-bonus-action",
      game.settings.get("enhancedcombathud", "color-bonus-action")
    );
    document.documentElement.style.setProperty(
      "--ech-free-action",
      game.settings.get("enhancedcombathud", "color-free-action")
    );
    document.documentElement.style.setProperty(
      "--ech-reaction",
      game.settings.get("enhancedcombathud", "color-reaction")
    );
    document.documentElement.style.setProperty(
      "--ech-end-turn",
      game.settings.get("enhancedcombathud", "color-end-turn")
    );
  }

  rigAutoScale() {
    let echHUDWidth = $(".extended-combat-hud").outerWidth();
    let windowWidth = $(window).width() - 340;
    let scale = game.settings.get("enhancedcombathud", "noAutoscale")
      ? game.settings.get("enhancedcombathud", "scale")
      : (1 / (echHUDWidth / windowWidth)) *
        game.settings.get("enhancedcombathud", "scale");

    $(".extended-combat-hud").css({
      transform: `scale(${scale > 1 ? 1 : scale})`,
    });
  }

  rigButtons() {
    let _this = this;
    this.element.unbind("click");
    this.element.unbind("mouseenter");
    this.element.on("click", '[data-type="trigger"]', async (event) => {
      let itemName = $(event.currentTarget).data("itemname");
      let actionDataSet = event.currentTarget.dataset.atype;
      if (!_this.hudData.findItemByName(itemName))
        await this.addSpecialItem(itemName);
      let confimed = await game.dnd5e.rollItemMacro(itemName);
      let item = _this.hudData.findItemByName(itemName) ?? ECHItems[itemName];
      if (confimed && game.combat?.started) {
        if (actionDataSet) {
          this.updateActionEconomy(actionDataSet);
        } else {
          this.updateActionEconomy(
            item.data?.data?.activation?.type ?? item.data.activation.type
          );
        }
      }

      if (!item) {
        $(event.currentTarget).remove();
      } else {
        let uses = item.data.data.quantity || item.data.data.uses.value
        let isAmmo = item.data.data.consume?.type == "ammo";
        let ammoItem = isAmmo ? this.hudData.actor.items.find(i => i.id == item.data.data.consume?.target) : null;
        let ammoCount = confimed ? ammoItem?.data?.data?.quantity-item.data.data.consume?.amount : ammoItem?.data?.data?.quantity;
        event.currentTarget.dataset.itemCount = isAmmo ? ammoCount : uses
      }
      this.updateSpellSlots();
    });
    this.element.on("mouseenter", '[data-type="trigger"]', (event) => {
      let $element = $(event.currentTarget);
      let itemName = $(event.currentTarget).data("itemname");

      const offset = $element.offset();

      $(".ech-tooltip").remove();

      setTimeout(() => {
        this.drawTooltip(itemName, {
          top: offset.top - $(document).scrollTop(),
          left: offset.left - $(document).scrollLeft(),
        });
      }, 100);
    });
    this.element.on("mouseleave", '[data-type="trigger"]', (event) => {
      // Allow User to hover over Tooltip
      setTimeout(() => {
        $(".ech-tooltip:not(.is-hover)").remove();
      }, 100);
    });
    $("body").on("mouseenter", ".ech-tooltip", (event) => {
      $(event.currentTarget).addClass("is-hover");
    });
    $("body").on("mouseleave", ".ech-tooltip.is-hover", (event) => {
      $(event.currentTarget).remove();
    });
    this.element.on("click", '[data-pass="true"]', async (event) => {
      if (game.combat?.current?.tokenId == this.hudData.token.id)
        game.combat?.nextTurn();
    });
    this.element.on("click", '[data-type="menu"]', (event) => {
      let category = event.currentTarget.dataset.menu;
      let actionType = event.currentTarget.dataset.actiontype;
      let isActive = $(event.currentTarget).hasClass("active");
      // data-containeractiontype="actions"
      //data-actiontype="bonus"
      // Hide Open Menus
      $(_this.element).find(`div[data-iscontainer="true"]`).removeClass("show");
      // Remove Active State from Menu Toggle
      $(_this.element).find('div[data-type="menu"]').removeClass("active");
      // Add Active State to Clicked Menu
      $(event.currentTarget).toggleClass("active", !isActive);
      // Show Active Menu
      $(_this.element)
        .find(
          `div[class="features-container ${category}"][data-containeractiontype="${actionType}"]`
        )
        .toggleClass(
          "show",
          $(event.currentTarget).hasClass("active") && !isActive
        );
    });
    this.element.on("click", '[data-type="switchWeapons"]', async (event) => {
      let $element = $(event.currentTarget);

      if (!$element.hasClass("active")) {
        $(this.element)
          .find('[data-type="switchWeapons"].active')
          .removeClass("active");
        $element.addClass("active");
        this.switchSets($element[0].dataset.value);
      }
    });
  }

  rigAccordion() {
    this.element.find(".features-container").each((index, featureContainer) => {
      // 375 = Portrait | 320 = Sidebar
      let spellHudWidth = 375 + 320;
      $(featureContainer)
        .find(".features-accordion")
        .each((index, element) => {
          let $element = $(element);
          let numberOfFeatures = $element.find(".feature-element").length;

          spellHudWidth +=
            numberOfFeatures > 3 ? 450 + 53 : numberOfFeatures * 150 + 53;

          $element.css({
            width: `${
              numberOfFeatures > 3 ? 450 + 53 : numberOfFeatures * 150 + 53
            }px`,
          });
          $element.find(".features-accordion-content").css({
            "min-width": `${
              numberOfFeatures > 3 ? 450 : numberOfFeatures * 150
            }px`,
          });
        });

      // If container is smaller than window size, then open containers.
      $(featureContainer)
        .find(".features-accordion")
        .toggleClass("show", spellHudWidth < $(window).width());
    });

    // If container is larger than window, allow accordion usage
    //if (spellHudWidth > $(window).width()) {
    this.element.on("click", ".feature-accordion-title", (event) => {
      let $element = $(event.currentTarget);
      let $accordion = $element.closest(".features-accordion");
      let $container = $element.closest(".features-container");

      if ($container.width() + 503 > $(window).width()) {
        $container.find(".features-accordion").removeClass("show");
      }

      $accordion.toggleClass("show");
    });
    //}
  }

  clearEmpty() {
    let menuButtons = $(this.element).find('[data-type="menu"]');
    for (let button of menuButtons) {
      let category = button.dataset.actiontype;
      let itemType = button.dataset.itemtype;
      let objectToCheck = this.hudData[category][itemType];
      if (
        objectToCheck == [] ||
        objectToCheck == {} ||
        !objectToCheck ||
        objectToCheck.length == 0 ||
        Object.keys(objectToCheck).length === 0
      ) {
        $(button).remove();
      }
    }
    let categroyContainers = $(this.element).find("[data-actionbartype]");
    for (let container of categroyContainers) {
      let actiontype = container.dataset.actionbartype;
      let remove = true;
      for (let [key, value] of Object.entries(this.hudData[actiontype])) {
        if (
          !(
            value == [] ||
            value == {} ||
            !value ||
            value.length == 0 ||
            Object.keys(value).length === 0
          )
        ) {
          remove = false;
        }
      }
      if (remove) $(container).remove();
    }
  }

  async switchSets(set) {
    await this.hudData.switchSets(set);
    let primary = $(this.element).find('div[data-set="setp"]');
    let secondary = $(this.element).find('div[data-set="sets"]');
    this.updateSetElement(primary, this.hudData.sets.active.primary);
    this.updateSetElement(secondary, this.hudData.sets.active.secondary);
  }
  updateSetElement(element, item) {
    if (!item) {
      element.css({ display: "none" });
      return;
    }
    let isAmmo = item.data.data.consume?.type == "ammo";
    let ammoItem = isAmmo ? this.hudData.actor.items.find(i => i.id == item.data.data.consume?.target) : null;
    element.toggleClass("has-count", isAmmo);
    element[0].dataset.itemCount = ammoItem?.data?.data?.quantity
    if(element[1])element[1].dataset.itemCount = ammoItem?.data?.data?.quantity
    element
      .data("itemname", item.name)
      .prop("data-itemname", item.name)
      .css({ "background-image": `url(${item.data.img})`, display: "flex" })
      .find(".action-element-title")
      .text(item.name);
  }
  initSets() {
    let set =
      this.hudData.actor.data.flags.enhancedcombathud?.activeSet || "set1";
    this.switchSets(set);
    $(this.element)
      .find('div[data-type="switchWeapons"]')
      .removeClass("active");
    $(this.element).find(`div[data-value="${set}"]`).addClass("active");
  }

  resetActionsUses() {
    this.hudData.hasAction = true;
    this.hudData.hasBonus = true;
    this.hudData.hasReaction = true;
  }

  newRound() {
    this.resetActionsUses();
    this.hudData.other.movement.current = this.hudData.other.movement.max;
    this.hudData.other.movement.moved = 0;
    this.updateMovement(0, true);
  }

  updateActionEconomy(actionType) {
    switch (actionType) {
      case "action":
        this.hudData.hasAction = false;
        break;
      case "bonus":
        this.hudData.hasBonus = false;
        break;
      case "reaction":
        this.hudData.hasReaction = false;
        break;
    }
  }

  updateMovement(bars = 0, reset = false) {
    bars = game.combat?.started && !reset ? bars : 0;
    let movementColor;
    switch (bars) {
      case 0:
        movementColor = "base-movement";
        break;
      case 1:
        movementColor = "dash-movement";
        break;
      case 2:
        movementColor = "danger-movement";
        break;
    }
    let disabledBars =
      game.combat?.started && !reset ? this.hudData.other.movement.current : 0;
    let barsNumber =
      game.combat?.started && !reset
        ? this.hudData.other.movement.max - disabledBars
        : this.hudData.other.movement.max;
    let $element = $(this.element).find(".movement-spaces");
    let newHtml = "";
    for (let i = 0; i < barsNumber; i++) {
      newHtml += `<div class="movement-space  ${movementColor}"></div>`;
    }
    for (let i = 0; i < disabledBars; i++) {
      newHtml += `<div class="movement-space"></div>`;
    }
    $(this.element).find(".movement-current").text(barsNumber);
    $(this.element)
      .find(".movement-max")
      .text((bars + 1) * this.hudData.other.movement.max);
    $element.html(newHtml);
  }

  updatePortrait(hp, maxhp, ac) {
    let hpelel = $(this.element).find("span[data-hp-value]");
    let maxhpel = $(this.element).find("span[data-hp-max]");
    let acelel = $(this.element).find("span[data-ac-value]");
    hpelel[0].dataset.hpValue = hp;
    maxhpel[0].dataset.hpMax = maxhp;
    acelel[0].dataset.acValue = ac;
  }

  async addSpecialItem(itemName) {
    if (!ECHItems[itemName]) return;
    await this.hudData.actor.createOwnedItem(ECHItems[itemName]);
  }

  updatePass() {
    let element = $(this.element).find("div[data-passcont]");
    if (this.hudData.token.id == game.combat?.current?.tokenId) {
      element.css({ display: "flex" });
    } else {
      element.css({ display: "none" });
    }
  }

  toggleMacroPlayers(togg) {
    $("#players").css("display", togg ? "block" : "none");
    $("#hotbar").css("display", togg ? "flex" : "none");
  }

  static generateSpells(obj) {
    let _this = canvas.hud.enhancedcombathud.hudData;
    let convertSpellSlot;
    if (obj == _this.settings.localize.spells.pact) {
      convertSpellSlot = "pact";
    } else if (obj.match(/\d+/)) {
      convertSpellSlot = "spell" + obj.match(/\d+/)[0];
    }
    let spellSlots = "";
    if (
      obj == _this.settings.localize.spells["0"] ||
      obj == _this.settings.localize.spells.will ||
      obj == _this.settings.localize.spells.innate
    ) {
      spellSlots =
        '<span class="spell-slot spell-cantrip"><i class="fas fa-infinity"></i></span>';
    } else {
      let spellSlotDetails = _this.spellSlots[convertSpellSlot];

      for (let index = 0; index < spellSlotDetails.max; index++) {
        //spellSlots.push(index < spellSlotDetails.value);
        spellSlots += `<span class="spell-slot spell-${
          index < spellSlotDetails.max - spellSlotDetails.value
            ? "used"
            : "available"
        }"></span>`;
      }
    }
    return spellSlots;
  }

  updateSpellSlots() {
    $(this.element)
      .find(".feature-spell-slots")
      .each((index, element) => {
        let spellSlot = element.dataset.type;
        element.innerHTML = CombatHudCanvasElement.generateSpells(spellSlot);
      });
  }

  drawTooltip(itemName, offset) {
    const showTooltip = game.settings.get("enhancedcombathud", "showTooltips");
    const showTooltipSpecial = game.settings.get(
      "enhancedcombathud",
      "showTooltipsSpecial"
    );
    if (!showTooltip) return;
    if (!showTooltipSpecial && ECHItems[itemName]) return;
    let item = this.hudData.actor.items.find((i) => i.data.name == itemName);
    if (!item) {
      item = {};
      item.data = ECHItems[itemName];
    }
    if (!item || !item.data) return;
    const title = item.data.name;
    const description = item.data.data.description.value;
    const itemType = item.data.type;
    let subtitle;
    let target = item.labels?.target || "-";
    let range = item.labels?.range || "-";
    let properties = [];
    let dt = item.labels?.damageTypes?.split(", ");
    let damageTypes = dt && dt.length ? dt : [];
    switch (itemType) {
      case "weapon":
        subtitle = game.dnd5e.config.weaponTypes[item.data.data.weaponType];
        properties.push(
          game.dnd5e.config.itemActionTypes[item.data.data.actionType]
        );
        for (let [key, value] of Object.entries(item.data.data.properties)) {
          let prop =
            value && game.dnd5e.config.weaponProperties[key]
              ? game.dnd5e.config.weaponProperties[key]
              : undefined;
          if (prop) properties.push(prop);
        }

        break;
      case "spell":
        subtitle = `${item.labels.level} ${item.labels.school}`;
        properties.push(game.dnd5e.config.spellSchools[item.data.data.school]);
        properties.push(item.labels.duration);
        properties.push(item.labels.save);
        for (let comp of item.labels.components) {
          properties.push(game.dnd5e.config.spellComponents[comp]);
        }
        break;
      case "consumable":
        subtitle =
          game.dnd5e.config.consumableTypes[item.data.data.consumableType] +
          " " +
          item.data.data.chatFlavor;
        properties.push(
          game.dnd5e.config.itemActionTypes[item.data.data.actionType]
        );
        break;
      case "feat":
        subtitle = item.data.data.requirements;
        properties.push(
          game.dnd5e.config.itemActionTypes[item.data.data.actionType]
        );
        break;
    }

    const tooltip = ({
      title,
      subtitle,
      description,
      target,
      range,
      properties,
      offset,
    }) => {
      return `<div class="ech-tooltip" style="top: ${offset.top}px; left: ${
        offset.left
      }px;">
          <div class="ech-tooltip-header">
            <h2>${title}</h2>
          </div>
          <div class="ech-tooltip-body">
            <h4 class="ech-tooltip-subtitle">${subtitle}</h4>
            <div class="ech-tooltip-description">${description}</div>
            <div class="ech-tooltip-details">
              <div>
                <span>${game.i18n.localize(
                  "enhancedcombathud.tooltip.target.name"
                )}</span>
                <span>${target}</span>
              </div>
              <div>
                <span>${game.i18n.localize(
                  "enhancedcombathud.tooltip.range.name"
                )}</span>
                <span>${range}</span></div>
              </div>
            <div class="ech-tooltip-properties">
              <h3>${game.i18n.localize(
                "enhancedcombathud.tooltip.properties.name"
              )}</h3>
              ${properties.join("\n")}
            </div>
          </div>
        </div>`;
    };

    let listOfProperties = [];
    for (let damt of damageTypes) {
      if (damt)
        listOfProperties.push(
          `<span class="ech-tooltip-badge damt">${damt}</span>`
        );
    }
    for (let prop of properties) {
      if (prop)
        listOfProperties.push(
          `<span class="ech-tooltip-badge prop">${prop}</span>`
        );
    }

    $(".extended-combat-hud").before(
      tooltip({
        title: title,
        subtitle: subtitle,
        description: description,
        target: target,
        range: range,
        properties: listOfProperties,
        offset: offset,
      })
    );
  }
}

Hooks.once("init", () => {
  Hooks.on("renderHeadsUpDisplay", async (app, html, data) => {
    //html.append('<template id="enhancedcombathud"></template>');
    canvas.hud.enhancedcombathud = new CombatHudCanvasElement();
  });
});

Hooks.on("updateActor", (actor, updates) => {
  if (
    actor.id == canvas.hud.enhancedcombathud?.hudData?.actor?.id &&
    (updates?.data?.attributes?.ac?.value ||
      updates?.data?.attributes?.hp?.value ||
      updates?.data?.attributes?.hp?.max)
  ) {
    let ad = actor.data.data.attributes;
    canvas.hud.enhancedcombathud.updatePortrait(
      ad.hp.value,
      ad.hp.max,
      ad.ac.value
    );
  }
});

Hooks.on("updateActiveEffect", (activeEffect, updates) => {
  let actor = activeEffect.parent;
  if (!actor || actor?.id != canvas.hud.enhancedcombathud?.hudData?.actor?.id)
    return;
  let ad = actor.data.data.attributes;
  for (let change of activeEffect.data.changes) {
    if (change.key == "data.attributes.ac.value") {
      canvas.hud.enhancedcombathud.updatePortrait(
        ad.hp.value,
        ad.hp.max,
        ad.ac.value
      );
      return;
    }
  }
});

Hooks.on("controlToken", (token, controlled) => {
  if (controlled && canvas.hud.enhancedcombathud?.rendered) {
    canvas.hud.enhancedcombathud.close();
    setTimeout(() => {
      canvas.hud.enhancedcombathud.bind(canvas.tokens.get(token.id));
    }, 250);
  }
});

Hooks.on("preUpdateToken", (token, updates) => {
  if (
    canvas.hud.enhancedcombathud?.hudData?.actor?.id == token.actor.id &&
    game.combat?.started &&
    ("x" in updates || "y" in updates)
  ) {
    let ttoken = canvas.tokens.get(token.id);
    let newX = updates.x || ttoken.x;
    let newY = updates.y || ttoken.y;
    let oldX = ttoken.x;
    let oldY = ttoken.y;
    const ray = new Ray({ x: oldX, y: oldY }, { x: newX, y: newY });
    const segments = [{ ray }];
    let distance = Math.floor(
      canvas.grid.measureDistances(segments, { gridSpaces: true }) /
        canvas.dimensions.distance
    );
    canvas.hud.enhancedcombathud.hudData.other.movement.moved += distance;
    const bars = Math.floor(
      canvas.hud.enhancedcombathud.hudData.other.movement.moved /
        canvas.hud.enhancedcombathud.hudData.other.movement.max
    );
    canvas.hud.enhancedcombathud.hudData.other.movement.current =
      canvas.hud.enhancedcombathud.hudData.other.movement.moved -
      bars * canvas.hud.enhancedcombathud.hudData.other.movement.max;
    canvas.hud.enhancedcombathud.updateMovement(bars);
  }
});

Hooks.on("updateCombat", (combat, updates) => {
  if (canvas.hud.enhancedcombathud?.hudData && "round" in updates) {
    canvas.hud.enhancedcombathud.newRound();
  }
  canvas.hud.enhancedcombathud?.updatePass();
});

Hooks.on("deleteCombat", (combat, updates) => {
  canvas.hud.enhancedcombathud?.newRound();
});
