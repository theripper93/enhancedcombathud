class CombatHud {
  constructor(token) {
    this.token = token;
    this.actor = token.actor;
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
      special: this.getItems({ actionType: ["action"], itemType: ["weapone"] }),
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
      special: this.getItems({ actionType: ["bonus"], itemType: ["weapone"] }),
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
        itemType: ["weapone"],
      }),
      consumables: this.getItems({
        actionType: ["reaction"],
        itemType: ["consumable"],
      }),
    };
    this.special = {};
    this.other = {
      portrait: this.actor.data.img,
      name: this.actor.data.name,
      maxHp: this.actor.data.data.attributes.hp.max,
      currHp: this.actor.data.data.attributes.hp.value,
      movement: Math.round(
        this.actor.data.data.attributes.movement.walk /
          canvas.dimensions.distance
      ),
      ac: this.actor.data.data.attributes.ac.value,
      classes: this.getClassesAsString(),
      specialItemsNames: {
          disengage: "Disengage",
          hide: "Hide",
          shove: "Shove",
          dash: "Dash",
          dodge: "Dodge",
          ready: "Ready",
      }
    };
    this.spellSlots = this.actor.data.data.spells;
    this.resources = {
      action: true,
      bonus: true,
      other: true,
    };
    this.sets = this.getSets();
    this.sets.active = this.actor.data.flags.enhancedcombathud?.activeSet
      ? this.sets[`set${this.actor.data.flags.enhancedcombathud?.activeSet}`]
      : this.sets.set1;
    this.test = "test"
    console.log(this);
  }
  getClassesAsString() {
    let classes = this.actor.data.data.classes;
    let string = "";
    for (let [key, value] of Object.entries(classes)) {
      string += "lvl " + value.levels + " ";
      string += key[0].toUpperCase() + key.substring(1);
      string += value.subclass
        ? " (" +
          value.subclass[0].toUpperCase() +
          value.subclass.substring(1) +
          ")"
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
      if (prepared === true && itemData.data.preparation?.prepared === false)
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
    if (prepared) {
      for (let item of filteredItems) {
        if (!spells[`${item.data.data.level}`])
          spells[`${item.data.data.level}`] = [];
        spells[`${item.data.data.level}`].push(item);
      }
    }
    if (filters.prepared === true) {
      return spells;
    } else {
      return filteredItems;
    }
  }

  getSets() {
    let items = this.actor.data.items;
    let set1 = [];
    let set2 = [];
    for (let item of items) {
      if (item.data.flags.enhancedcombathud?.set1) set1.push(item);
      if (item.data.flags.enhancedcombathud?.set2) set2.push(item);
    }
    return { set1: set1, set2: set2 };
  }
  _render() {
    canvas.hud.enhancedcombathud.bind(this.token);
  }
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
    return data;
  }

  setPosition() {
    if (!this.object) return;
    this.rigButtons();
    const position = {
      bottom: "15px",
      position: "absolute",
      left: "15px",
      "z-index": 100,
      transform: "scale(0.8)",
      "transform-origin" : "left bottom",
    };
    this.element.css(position);
  }

  rigButtons() {
    this.element.unbind("click");
    this.element.on("click", '[data-type="trigger"]', (event) => {
      let itemName = event.currentTarget.dataset.itemname;
      game.dnd5e.rollItemMacro(itemName);
    });
    this.element.on("click", '[data-type="category"]', (event) => {
      let category = event.currentTarget.dataset.category;
      game.dnd5e.rollItemMacro(itemName);
    });

    /*// Feature Accordion
    this.element.on('click', '.feature-accordion-title', (event) => {
      let $element = $(event.currentTarget);
      let $accordion = $element.closest('.features-accordion');
      let numberOfFeatures = $accordion.find('.feature-element').length;

      // hide Open Elements
      $accordion.closest('.features-container').find('.features-accordion.show').removeClass('show').css({
        width: '0px'
      });

      if ($accordion.hasClass('show')) {
        $accordion.css({
          width: `0px`
        });
      }else{
        $accordion.css({
          width: `${numberOfFeatures > 3 ? 615 : numberOfFeatures * 205}px`
        });
      }
      $accordion.toggleClass('show');
    })*/
  }
}

Hooks.once("init", () => {
  Hooks.on("renderHeadsUpDisplay", async (app, html, data) => {
    //html.append('<template id="enhancedcombathud"></template>');
    canvas.hud.enhancedcombathud = new CombatHudCanvasElement();
  });
});
