import { defaultTheme } from "./config.js";
import { EchThemeOptions } from "./app/EchThemeOptions.js";

export function registerSettings() {
        game.settings.register("enhancedcombathud", "globalTheme", {
        name: game.i18n.localize("enhancedcombathud.settings.globalTheme.name"),
        hint: game.i18n.localize("enhancedcombathud.settings.globalTheme.hint"),
        scope: "world",
        config: true,
        type: String,
        requiresReload: true,
        choices: {
            client: game.i18n.localize("enhancedcombathud.settings.globalTheme.choices.client"),
            world: game.i18n.localize("enhancedcombathud.settings.globalTheme.choices.world"),
        },
        default: "client",
        onChange: () => ui.ARGON.refresh(),
    });

    const globalTheme = game.settings.get("enhancedcombathud", "globalTheme");

    game.settings.register("enhancedcombathud", "echThemeData", {
        name: "Data used for Theming",
        type: Object,
        default: defaultTheme,
        scope: globalTheme,
        config: false,
        onChange: () => {
            ui.ARGON.setColorSettings();
            ui.ARGON.refresh();
        },
    });

    game.settings.register("enhancedcombathud", "targetPickerGuideShown", {
        type: Boolean,
        default: false,
        scope: "client",
        config: false,
    });

    // Define a settings submenu which handles advanced configuration needs
    game.settings.registerMenu("enhancedcombathud", "echThemeOptions", {
        name: game.i18n.localize("enhancedcombathud.settings.thememenu.name"),
        label: game.i18n.localize("enhancedcombathud.settings.thememenu.label"),
        hint: game.i18n.localize("enhancedcombathud.settings.thememenu.hint"),
        icon: "fas fa-bars",
        type: EchThemeOptions,
        restricted: globalTheme === "world",
    });

    game.settings.register("enhancedcombathud", "rangefinder", {
        name: game.i18n.localize("enhancedcombathud.settings.rangefinder.name"),
        hint: game.i18n.localize("enhancedcombathud.settings.rangefinder.hint"),
        scope: "world",
        config: true,
        type: Boolean,
        default: true,
        onChange: () => ui.ARGON.refresh(),
    });

    game.settings.register("enhancedcombathud", "rangepicker", {
        name: game.i18n.localize("enhancedcombathud.settings.rangepicker.name"),
        hint: game.i18n.localize("enhancedcombathud.settings.rangepicker.hint"),
        scope: "world",
        config: true,
        type: Boolean,
        default: true,
        onChange: () => ui.ARGON.refresh(),
    });

    game.settings.register("enhancedcombathud", "rangepickerclear", {
        name: game.i18n.localize("enhancedcombathud.settings.rangepickerclear.name"),
        hint: game.i18n.localize("enhancedcombathud.settings.rangepickerclear.hint"),
        scope: "world",
        config: true,
        type: Boolean,
        default: false,
        onChange: () => ui.ARGON.refresh(),
    });

    game.settings.register("enhancedcombathud", "openCombatStart", {
        name: game.i18n.localize("enhancedcombathud.settings.openCombatStart.name"),
        hint: game.i18n.localize("enhancedcombathud.settings.openCombatStart.hint"),
        scope: "world",
        config: true,
        type: Boolean,
        default: false,
        onChange: () => ui.ARGON.refresh(),
    });

    game.settings.register("enhancedcombathud", "dialogTheme", {
        name: game.i18n.localize("enhancedcombathud.settings.dialogTheme.name"),
        hint: game.i18n.localize("enhancedcombathud.settings.dialogTheme.hint"),
        scope: "world",
        config: true,
        type: Boolean,
        default: true,
    });

    game.settings.register("enhancedcombathud", "autoScale", {
        name: game.i18n.localize("enhancedcombathud.settings.autoScale.name"),
        hint: game.i18n.localize("enhancedcombathud.settings.autoScale.hint"),
        scope: "client",
        config: true,
        type: Boolean,
        default: true,
        onChange: () => ui.ARGON.refresh(),
    });

    game.settings.register("enhancedcombathud", "scale", {
        name: game.i18n.localize("enhancedcombathud.settings.scale.name"),
        hint: game.i18n.localize("enhancedcombathud.settings.scale.hint"),
        scope: "client",
        config: true,
        range: {
            min: 0.1,
            max: 1,
            step: 0.01,
        },
        type: Number,
        default: 0.5,
        onChange: () => ui.ARGON.refresh(),
    });

    game.settings.register("enhancedcombathud", "alwaysOn", {
        name: game.i18n.localize("enhancedcombathud.settings.alwaysOn.name"),
        hint: game.i18n.localize("enhancedcombathud.settings.alwaysOn.hint"),
        scope: "client",
        config: true,
        type: Boolean,
        default: false,
        onChange: () => ui.ARGON.refresh(),
    });

    game.settings.register("enhancedcombathud", "leftPos", {
        name: game.i18n.localize("enhancedcombathud.settings.leftPos.name"),
        hint: game.i18n.localize("enhancedcombathud.settings.leftPos.hint"),
        scope: "client",
        config: true,
        type: Number,
        default: 15,
        onChange: () => ui.ARGON.refresh(),
    });

    game.settings.register("enhancedcombathud", "botPos", {
        name: game.i18n.localize("enhancedcombathud.settings.botPos.name"),
        hint: game.i18n.localize("enhancedcombathud.settings.botPos.hint"),
        scope: "client",
        config: true,
        type: Number,
        default: 15,
        onChange: () => ui.ARGON.refresh(),
    });

    game.settings.register("enhancedcombathud", "hideMacroPlayers", {
        name: game.i18n.localize("enhancedcombathud.settings.hideMacroPlayers.name"),
        hint: game.i18n.localize("enhancedcombathud.settings.hideMacroPlayers.hint"),
        scope: "client",
        config: true,
        type: Boolean,
        default: true,
        onChange: () => ui.ARGON.refresh(),
    });

    game.settings.register("enhancedcombathud", "playerDetailsBottom", {
        name: game.i18n.localize("enhancedcombathud.settings.playerDetailsBottom.name"),
        hint: game.i18n.localize("enhancedcombathud.settings.playerDetailsBottom.hint"),
        scope: "client",
        config: true,
        type: Boolean,
        default: false,
        onChange: () => ui.ARGON.refresh(),
    });

    game.settings.register("enhancedcombathud", "showTooltips", {
        name: game.i18n.localize("enhancedcombathud.settings.showTooltips.name"),
        hint: game.i18n.localize("enhancedcombathud.settings.showTooltips.hint"),
        scope: "client",
        config: true,
        type: Boolean,
        default: true,
        onChange: () => ui.ARGON.refresh(),
    });

    game.settings.register("enhancedcombathud", "tooltipScale", {
        name: game.i18n.localize("enhancedcombathud.settings.tooltipScale.name"),
        hint: game.i18n.localize("enhancedcombathud.settings.tooltipScale.hint"),
        scope: "client",
        config: true,
        range: {
            min: 0.1,
            max: 1,
            step: 0.01,
        },
        type: Number,
        default: 0.7,
        onChange: () => ui.ARGON.refresh(),
    });

    game.settings.register("enhancedcombathud", "fadeOutInactive", {
        name: game.i18n.localize("enhancedcombathud.settings.fadeOutInactive.name"),
        hint: game.i18n.localize("enhancedcombathud.settings.fadeOutInactive.hint"),
        scope: "client",
        config: true,
        type: Boolean,
        default: false,
        onChange: () => {
            ui.ARGON.setColorSettings();
            ui.ARGON.refresh();
        },
    });

    game.settings.register("enhancedcombathud", "fadeoutDelay", {
        name: game.i18n.localize("enhancedcombathud.settings.fadeoutDelay.name"),
        hint: game.i18n.localize("enhancedcombathud.settings.fadeoutDelay.hint"),
        scope: "client",
        config: true,
        type: Number,
        default: 4,
        onChange: () => {
            ui.ARGON.setColorSettings();
            ui.ARGON.refresh();
        },
    });

    game.settings.register("enhancedcombathud", "fadeoutOpacity", {
        name: game.i18n.localize("enhancedcombathud.settings.fadeoutOpacity.name"),
        hint: game.i18n.localize("enhancedcombathud.settings.fadeoutOpacity.hint"),
        scope: "client",
        config: true,
        type: Number,
        range: {
            min: 0,
            max: 1,
            step: 0.05,
        },
        default: 0.1,
        onChange: () => {
            ui.ARGON.setColorSettings();
            ui.ARGON.refresh();
        },
    });

    game.settings.register("enhancedcombathud", "noBlur", {
        name: game.i18n.localize("enhancedcombathud.settings.noBlur.name"),
        hint: game.i18n.localize("enhancedcombathud.settings.noBlur.hint"),
        scope: "client",
        config: true,
        type: Boolean,
        default: false,
        onChange: () => {
            ui.ARGON.setColorSettings();
            ui.ARGON.refresh();
        },
    });

    game.settings.register("enhancedcombathud", "suppressWarnings", {
        name: game.i18n.localize("enhancedcombathud.settings.suppressWarnings.name"),
        hint: game.i18n.localize("enhancedcombathud.settings.suppressWarnings.hint"),
        scope: "world",
        config: true,
        type: Boolean,
        default: false,
    });
}

