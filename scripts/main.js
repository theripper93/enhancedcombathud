import { CoreHud } from "./app/CoreHud.js";
import { initConfig } from "./config.js";
import { registerSettings } from "./settings.js";
import { HTMLAlphaColorPickerElement } from "./AlphaColorPicker.js";
import "../scss/module.scss";

export const MODULE_ID = "enhancedcombathud";

Object.defineProperty(globalThis.CONFIG, "ARGON", {
  get: () => {
    return CoreHud.ARGON;
  }
});

CoreHud.setControlHooks();

Hooks.on("init", () => {
  registerKeybindings();
  window.customElements.define(HTMLAlphaColorPickerElement.tagName, HTMLAlphaColorPickerElement);
});

Hooks.on("ready", () => {
  initConfig();
  registerSettings();
  ui.ARGON = new CoreHud();
});

export function registerKeybindings() {
    game.keybindings.register("enhancedcombathud", "toggleHud", {
        name: "enhancedcombathud.hotkey.toggle.name",
        editable: [{ key: "KeyA", modifiers: [foundry.helpers.interaction.KeyboardManager.MODIFIER_KEYS.SHIFT] }],
        restricted: false,
        onDown: () => {},
        onUp: () => {
            ui.ARGON.toggle();
        },
    });
}
