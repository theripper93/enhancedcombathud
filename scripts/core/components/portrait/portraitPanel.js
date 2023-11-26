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
      failures: this.failures
    }
    return data;
  }

  async activateListeners(html) {
    super.activateListeners(html);
    html.querySelector(".death-save-btn").addEventListener("click", this._onDeathSave.bind(this));
  }

  async _onDeathSave(event) {
    console.error("Argon: PortraitPanel._onDeathSave not implemented");
  }

  async getStatBlocks() {
    return [];
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