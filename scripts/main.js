import {CoreHUD} from "./core/hud.js";
import { initConfig, registerKeybindings } from "./config.js";

Object.defineProperty(globalThis.CONFIG, "ARGON", {
  get: () => {
    return CoreHUD.ARGON;
  }
});

CoreHUD.setControlHooks();

Hooks.on("init", () => {
  registerKeybindings();
});

Hooks.on("ready", () => {
  initConfig();
  ui.ARGON = new CoreHUD();
});