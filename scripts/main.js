import {CoreHUD} from "./core/hud.js";
import { initConfig, registerKeybindings } from "./config.js";

CoreHUD.setControlHooks();

Hooks.on("init", () => {
  registerKeybindings();
});

Hooks.on("ready", () => {
  initConfig();
  ui.ARGON = new CoreHUD();
});