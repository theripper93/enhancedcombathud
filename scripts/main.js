import {CoreHUD} from "./core/hud.js";
import { initConfig } from "./config.js";
import {register} from "./core/dnd5e.js";

CoreHUD.setControlHooks();

Hooks.on("ready", () => {
  initConfig();
  ui.ARGON = new CoreHUD();
});