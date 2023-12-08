import {ArgonComponent} from "../component.js";

export class PortraitPanel extends ArgonComponent {

  constructor (...args) {
    super(...args);
    this.refresh = debounce(this.refresh.bind(this), 100);
  }

  get classes() {
    return ["portrait-hud"]
  }

  get name() {
    return this.actor.name;
  }

  get image() {
    return this.actor.img;
  }

  get description() {
    return "";
  }

  get isDead() {
    return false;
  }

  get isDying() {
    return false;
  }

  get deathIcon() {
    return "fas fa-skull";
  }

  get successes() {
    return 0;
  }
  
  get failures() {
    return 0;
  }

  get configurationTemplate() {
    return null;
  }

  async getData() {
    const data = {
      name: this.name,
      image: this.image,
      description: this.description,
      isDead: this.isDead,
      isDying: this.isDying,
      deathIcon: this.deathIcon,
      successes: this.successes,
      failures: this.failures,
      playerDetailsBottom: game.settings.get("enhancedcombathud", "playerDetailsBottom"),
    }
    return data;
  }

  async activateListeners(html) {
    super.activateListeners(html);
    html.querySelector(".death-save-btn").addEventListener("click", this._onDeathSave.bind(this));
    if(this.configurationTemplate) html.querySelector("#argon-actor-config")?.addEventListener("click", this._onConfigure.bind(this));
    else html.querySelector(".portrait-actor-configuration")?.remove();
    const toggleMinimizeButton = this._buttons.find(button => button.id === "toggle-minimize");
    if(toggleMinimizeButton) {
      toggleMinimizeButton.element.addEventListener("click", (e) => {
        toggleMinimizeButton.element.classList.toggle("fa-flip-vertical")
      });
    }
  }

  async _onDeathSave(event) {
    console.error("Argon: PortraitPanel._onDeathSave not implemented");
  }

  async getStatBlocks() {
    return [];
  }

  async _getButtons() {
    return [
      {
        id: "roll-initiative",
        icon: "fas fa-dice-d20",
        label: "Roll Initiative",
        onClick: (e) => this.actor.rollInitiative({ rerollInitiative: true, createCombatants: true })
      },
      {
        id: "open-sheet",
        icon: "fas fa-suitcase",
        label: "Open Character Sheet",
        onClick: (e) => this.actor.sheet.render(true)
      },
      {
        id: "toggle-minimize",
        icon: "fas fa-caret-down",
        label: "Minimize",
        onClick: (e) => ui.ARGON.toggleMinimize()
      }
    ];
  }

  refresh() {
    this.render();
  }
  
  async _renderInner(data) {
    await super._renderInner(data);
    const statBlocks = await this.getStatBlocks();
    for (const block of statBlocks) {
      const sb = document.createElement("div");
      sb.classList.add("portrait-stat-block");
      for (const stat of block) {
        const span = document.createElement("span");
        span.innerText = stat.text;
        span.style.color = stat.color;
        if (stat.id != undefined) span.id = stat.id;
        sb.appendChild(span);
      }
      this.element.appendChild(sb);
    }
    this._buttons = await this._getButtons();
    const buttonsContainer = this.element.querySelector(".player-buttons");
    for(const button of this._buttons) {
      const btn = document.createElement("div");
      btn.classList.add("player-button");
      btn.innerHTML = `<i class="${button.icon}"></i>`;
      btn.dataset.tooltip = button.label;
      btn.onclick = button.onClick;
      button.element = btn;
      buttonsContainer.appendChild(btn);
    }
    const deathContainer = this.element.querySelector(".death-saves");
    deathContainer.classList.remove("no-buttons");
    if (!this.isDead && !this.isDying) {
      deathContainer.classList.add("hidden");
    } else {
      if (this.isDead) {
        deathContainer.childNodes.forEach(node => node.classList && node.classList.add("hidden"));
        deathContainer.classList.add("no-buttons");
        const deathBtn = deathContainer.querySelector(".death-save-btn");
        deathBtn.classList.remove("hidden");
        deathBtn.style.pointerEvents = "none";
      }
    }
  }

  async _onConfigure(event) {
    event.preventDefault();
    const template = this.configurationTemplate;


    (new ArgonPortraitConfig(this.actor, template)).render(true);
  }
}

class ArgonPortraitConfig extends FormApplication {
  constructor(actor, template) {
    super();
    this.actor = actor;
    this._template = template;
  }

  get title() {
    return `${game.i18n.localize("Configure")} ${this.actor.name}`;
  }

  get template() {
    return this._template;
  }

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      id: "argon-actor-config-form",
      title: ``,
      template: "",
      width: 400,
      height: "auto",
      closeOnSubmit: true
    });
  }

  getData() {
    return {actor: this.actor, ...this.actor};
  }

  async _updateObject(event, formData) {
    await this.actor.update(formData);
    ui.ARGON.refresh()
  }
}
