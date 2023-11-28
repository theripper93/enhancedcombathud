import {CoreHUD} from "./core/hud.js";
import { initConfig } from "./config.js";

CoreHUD.setControlHooks();

Hooks.on("ready", () => {
  initConfig();
  ui.ARGON = new CoreHUD();
});