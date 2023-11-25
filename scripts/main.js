import {CoreHUD} from "./core/hud.js";
import { register } from "./core/dnd5e.js";

Hooks.on("ready", () => {
  register();
  ui.ARGON = new CoreHUD();
});