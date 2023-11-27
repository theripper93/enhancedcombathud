import {ArgonComponent} from "../component.js";

export class PortraitPanel extends ArgonComponent {
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
    if (!this.isDead && !this.isDying) {
      deathContainer.classList.add("hidden");
    } else {
      if (this.isDead) {
        deathContainer.childNodes.forEach(node => node.classList.add("hidden"));
        const deathBtn = deathContainer.querySelector(".death-save-btn");
        deathBtn.classList.remove("hidden");
        deathBtn.style.pointerEvents = "none";
      }
    }
  }
}