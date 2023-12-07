import { showRangeFinder, showRangeRings, clearRangeFinders, clearRanges } from "./components/main/buttons/itemButton.js";

export class TargetPicker{
  constructor ({token, targets, ranges}) {
    checkShowTargetPickerGuide();
    this.ranges = ranges;
    this.token = token;
    this.resolve = null;
    this.reject = null;
    this._targetCount = game.user.targets.size;
    this._maxTargets = targets;

    const targetTool = document.querySelector('.control-tool[data-tool="target"]')
    targetTool?.click();

    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
    this.targetHook = Hooks.on("targetToken", (user, token, targeted) => { 
      this.checkComplete();
    });

    this.movelistener = (event) => {
        this.update(event);
    };
    this.clicklistener = (event) => { 
      if(event.which === 3) {
        this.end(false);
      }
    };
    this.keyuplistener = (event) => { 
      //check for + and - keys
      if (event.key === "+" || event.key === "=") {
        this.maxTargets++;
      }
      if (event.key === "-" || event.key === "_") {
        if (this.maxTargets > 1) this.maxTargets--;
      }
    };
    document.addEventListener("mousemove", this.movelistener);
    document.addEventListener("mouseup", this.clicklistener);
    document.addEventListener("keyup", this.keyuplistener);
    this.init();
  }

  checkComplete() { 
      this.targetCount = game.user.targets.size;
      if (this.targetCount >= this.maxTargets) {
          this.end(true);
      }
  }

  set targetCount(count) { 
    this._targetCount = count;
    this.update();
  }

  get targetCount() {
    return this._targetCount;
  }

  set maxTargets(count) {
    this._maxTargets = count;
    this.update();
    this.checkComplete();
  }

  get maxTargets() {
    return this._maxTargets;
  }

  init() {
    if(game.settings.get("enhancedcombathud", "rangepickerclear")) (canvas.tokens.placeables[0] ?? _token)?.setTarget(false);
    const element = document.createElement("div");
    element.classList.add("ech-target-picker");
    document.body.appendChild(element);
    this.element = element;
    if (!this.maxTargets || this.targetCount == this.maxTargets) return this.end(true);
    showRangeRings(this.ranges.normal, this.ranges.long, this.token);
  }

  update(event) {
    if(!this.element) return;
    if (event) {
      const clientX = event.clientX;
      const clientY = event.clientY;
      this.element.style.left = clientX + 20 + "px";
      this.element.style.top = clientY + "px";
    }
    this.element.innerText = `${this.targetCount}/${this.maxTargets} Targets`;
  }

  end(res) {
    clearRanges(true);
    document.querySelector(".control-tool").click();
    this.resolve(res);
    this.element.remove();
    Hooks.off("targetToken", this.targetHook);
    document.removeEventListener("mousemove", this.movelistener);
    document.removeEventListener("mouseup", this.clicklistener);
    document.removeEventListener("keyup", this.keyuplistener);
    document.querySelector('.control-tool[data-tool="select"]')?.click();
  }
}

function checkShowTargetPickerGuide() {
  if (!game.settings.get("enhancedcombathud", "targetPickerGuideShown")) {
    window.ui.ARGON.showTargetPickerGuide();
  }
}

export async function showTargetPickerGuide() {
  let list = "";
  const elementsCount = 4;
  for (let i = 0; i < elementsCount; i++) {
    list += `<li class="notification info" style="font-weight: 900">${game.i18n.localize(`enhancedcombathud.targetPicker.dialog.list.${i}`)}</li>`;
  }
  const result = await Dialog.prompt({
    title: game.i18n.localize("enhancedcombathud.targetPicker.dialog.title"),
    content: `<ul class="guide-list" style="list-style:none;padding:0">${list}</ul>`,
    close: () => {return false},
  });
  if(result) game.settings.set("enhancedcombathud", "targetPickerGuideShown", true);
}