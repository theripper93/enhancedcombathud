class CombatHud{
    constructor(token){
        this.actor = token.actor;
        this.actions = {
            attack: this.getItems({actionType:["action"],itemType:["weapon"],equipped:true}),
            spells: this.getItems({actionType:["action"],itemType:["spell"],prepared:true}),
            special: this.getItems({actionType:["action"],itemType:["weapone"]}),
            consumables: this.getItems({actionType:["action"],itemType:["consumable"]}),
        }
        this.bonus = {
            attack: this.getItems({actionType:["bonus"],itemType:["weapon"],equipped:true}),
            spells: this.getItems({actionType:["bonus"],itemType:["spell"],prepared:true}),
            special: this.getItems({actionType:["bonus"],itemType:["weapone"]}),
            consumables: this.getItems({actionType:["bonus"],itemType:["consumable"]}),
        }
        this.reactions = {
            attack: this.getItems({actionType:["reaction"],itemType:["weapon"],equipped:true}),
            spells: this.getItems({actionType:["reaction"],itemType:["spell"],prepared:true}),
            special: this.getItems({actionType:["reaction"],itemType:["weapone"]}),
            consumables: this.getItems({actionType:["reaction"],itemType:["consumable"]}),
        }
        this.special = {}
        this.other = {
            portrait: this.actor.data.img,
            name: this.actor.data.name,
            maxHp: this.actor.data.data.attributes.hp.max,
            currHp: this.actor.data.data.attributes.hp.value,
            movement: Math.round(this.actor.data.data.attributes.movement.walk/canvas.dimensions.distance),
            ac: this.actor.data.data.attributes.ac.value,
            classes: this.getClassesAsString(),
        }
        this.spellSlots = this.actor.data.data.spells
        this.resources = {
            action: true,
            bonus: true,
            other: true,
        }
        console.log(this)

    }
    getClassesAsString(){
        let classes = this.actor.data.data.classes
        let string = ''
        for(let [key,value] of Object.entries(classes)){
            string += "lvl "+value.levels+" "
            string += key[0].toUpperCase() + key.substring(1)
            string += value.subclass ? " (" + value.subclass[0].toUpperCase() + value.subclass.substring(1) + ")" : ""
        }
        return string
    }
    getItems(filters){
        const actionType = filters.actionType
        const itemType = filters.itemType
        const equipped = filters.equipped
        const prepared = filters.prepared
        let items = this.actor.data.items
        let filteredItems = items.filter((i) => {
            let itemData = i.data
            if(equipped === true && !itemData.data.equipped) return false
            if(prepared === true && itemData.data.preparation?.prepared === false) return false
            if(actionType && actionType.includes(itemData.data.activation?.type) && itemType && itemType.includes(itemData.type)) return true
            return false
        })
        let spells = {}
        if(prepared){
            for(let item of filteredItems){
                if(!spells[`${item.data.data.level}`]) spells[`${item.data.data.level}`]=[]
                spells[`${item.data.data.level}`].push(item)
            }
        }
        if(filters.prepared === true){
            return spells
        }else{
            return filteredItems
        }
    }
    _render(){
        canvas.hud.enhancedcombathud.bind(this)
    }
}

class CombatHudCanvasElement extends BasePlaceableHUD{

    static get defaultOptions() {
        const options = super.defaultOptions;
        options.classes = options.classes.concat(["levels-tooltip"]);
        options.template = "modules/enhancedcombathud/templates/ActionHUD.html";
        options.id = "id";
        return options;
      }

      getData() {
        const data = super.getData();
        return data;
      }
    
      setPosition() {
        if (!this.object) return;
        let posleft = this.object.center.x - this.object.width / 2;
        let postop = this.object.center.y - this.object.height / 2;
        const position = {
          width: canvas.grid.size * 1.2,
          height: canvas.grid.size * 0.8,
          left: posleft,
          top: postop,
          "font-size": canvas.grid.size / 3.5 + "px",
          display: "grid",
        };
        this.element.css(position);
      }
}
  
  Hooks.once("init", () => {
    Hooks.on("renderHeadsUpDisplay", async (app, html, data) => {
      html.append('<template id="levels-tooltip"></template>');
      canvas.hud.enhancedcombathud = new CombatHudCanvasElement();
    });
  });