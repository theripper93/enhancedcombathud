import {CoreHUD} from "./core/hud.js";
import { register } from "./core/dnd5e.js";

CoreHUD.setControlHooks();

Hooks.on("ready", () => {
  register();
  ui.ARGON = new CoreHUD();
  ui.ARGON.bind(canvas.tokens.placeables[0]);
});