const defaultTheme = {
    theme: "custom",
    font: "Roboto",
    colors: {
        portrait: {
            base: {
                background: "#414B55E6",
                color: "#B4D2DCFF",
                border: "#757f89FF",
            },
        },
        mainAction: {
            base: {
                background: "#414B55E6",
                color: "#B4D2DCFF",
                border: "#757f89FF",
            },
            hover: {
                background: "#747e88e6",
                color: "#B4D2DCFF",
                border: "#757f89FF",
            },
        },
        bonusAction: {
            base: {
                background: "#453B75E6",
                color: "#B4D2DCFF",
                border: "#757f89FF",
            },
            hover: {
                background: "#9288c2e6",
                color: "#B4D2DCFF",
                border: "#757f89FF",
            },
        },
        freeAction: {
            base: {
                background: "#3B5875E6",
                color: "#B4D2DCFF",
                border: "#757f89FF",
            },
            hover: {
                background: "#88a5c2e6",
                color: "#B4D2DCFF",
                border: "#757f89FF",
            },
        },
        reaction: {
            base: {
                background: "#753B3BE6",
                color: "#B4D2DCFF",
                border: "#757f89FF",
            },
            hover: {
                background: "#c28888e6",
                color: "#B4D2DCFF",
                border: "#757f89FF",
            },
        },
        endTurn: {
            base: {
                background: "#374B3CE6",
                color: "#B4D2DCFF",
                border: "#757f89FF",
            },
            hover: {
                background: "#849889e6",
                color: "#B4D2DCFF",
                border: "#757f89FF",
            },
        },
        tooltip: {
            header: {
                background: "#ffffffCC",
                color: "#414146",
                border: "#757f89FF",
            },
            subtitle: {
                background: "#32505a",
                color: "#ffffff",
                border: "#757f89FF",
            },
            body: {
                background: "#5a7896B3",
                color: "#ffffff",
                border: "#757f89FF",
            },
        },
        abilityMenu: {
            background: "#414B55E6",
            color: "#B4D2DCFF",
            border: "#757f89FF",
            base: { color: "#B4D2DCFF", boxShadow: "#757f89CC" },
            hover: { color: "#B4D2DCFF", boxShadow: "#757f89CC" },
        },
        buttons: {
            base: {
                background: "#5096c3",
                color: "#ffffff",
                border: "#5096c3",
            },
            hover: {
                background: "#55bef5",
                color: "#ffffffff",
                border: "#55bef5",
            },
        },
        movement: {
            used: { background: "#7d879180", boxShadow: "#00000000" },
            baseMovement: { background: "#5abef5FF", boxShadow: "#6ed2ffCC" },
            dashMovement: { background: "#c8c85aFF", boxShadow: "#dcdc6eCC" },
            dangerMovement: { background: "#c85f5aFF", boxShadow: "#dc736eCC" },
        },
    },
};

export class echThemeOptions extends FormApplication {
    static get defaultOptions() {
        return {
            ...super.defaultOptions,
            title: "Theme Options",
            id: "echThemeOptions",
            template: "modules/enhancedcombathud/templates/theme-options.hbs",
            resizable: true,
            width: 660,
            height: $(window).height(),
            createTheme: () => {
                new Dialog({
                    title: "Export Argon - Combat HUD Theme",
                    content: `<form id="echExportTheme">
            <div class="form-group">
              <label>${game.i18n.localize("enhancedcombathud.themeOptions.exportThemeName")}</label>
              <input type="text" name="echExportThemeName"/>
            </div>
          </form>`,
                    buttons: {
                        export: {
                            label: "Save",
                            callback: (event) => {
                                console.log(event);
                                console.log(echThemeOptions.defaultOptions.getThemeColors());
                                const themeName = $(event).find('input[name="echExportThemeName"]').val();
                                const theme = new File([new Blob([JSON.stringify(echThemeOptions.defaultOptions.getThemeColors())], { type: "application/json" })], `${themeName}.json`);
                                FilePicker.uploadPersistent("enhancedcombathud", "themes", theme).then((response) => {
                                    echThemeOptions.defaultOptions.buildDropdown(themeName);
                                });
                            },
                        },
                        cancel: {
                            label: "Cancel",
                            callback: (event) => {
                                return true;
                            },
                        },
                    },
                    default: "export",
                    render: (html) => {
                        let $dialog = $(html);
                        $dialog.find('button[data-button="export"]').prop("disabled", true);
                        $dialog.find('input[name="echExportThemeName"]').on("keyup", (event) => {
                            let $input = $dialog.find('input[name="echExportThemeName"]');
                            $input.val(
                                $input
                                    .val()
                                    .replace(/[^a-z0-9]/gi, "-")
                                    .replace(/-{2,}/g, "-")
                                    .toLowerCase(),
                            );
                            $dialog.find('button[data-button="export"]').prop("disabled", $input.val().length <= 1);
                        });
                        $dialog.find('input[name="echExportThemeName"]').focus();
                    },
                }).render(true);
            },
            getThemeColors: () => {
                function setDeepObj(obj, path, val) {
                    var props = path.split(".");
                    for (var i = 0, n = props.length - 1; i < n; ++i) {
                        obj = obj[props[i]] = obj[props[i]] || {};
                    }
                    obj[props[i]] = val;
                    return obj;
                }

                let theme = {};

                $('#echThemeOptions .window-content button[name="colored"]').each((index, button) => {
                    let $button = $(button);
                    setDeepObj(theme, $button.data("setting"), $button.attr("value"));
                });

                // Export Theme
                return theme.colors;
            },
            buildDropdown: async (selectedTheme) => {
                if (typeof selectedTheme == "undefined") game.settings.get("enhancedcombathud", "echThemeData").theme;

                const echThemeOptions = document.getElementById("echThemeOptions");
                const selectTheme = echThemeOptions.querySelector('select[name="theme"]');
                selectTheme.innerHTML = "";

                const coreThemes = (await FilePicker.browse("user", `./modules/enhancedcombathud/scripts/themes`, {extensions: [".json"]})).files;

                const customThemes = (await FilePicker.browse("user", `./modules/enhancedcombathud/storage/themes`, {extensions: [".json"]})).files;



                function createOption(file) {
                    const filename = file.split("/")[file.split("/").length - 1].replace(/\.json/gi, "");
                    const option = document.createElement("option");
                    option.value = filename;
                    option.text = filename[0].toUpperCase() + filename.substring(1);
                    selectTheme.appendChild(option);
                }

                function createOptGroup(label) {
                    const optgroup = document.createElement("optgroup");
                    optgroup.label = label;
                    selectTheme.appendChild(optgroup);
                }

                createOption("custom");
                createOptGroup("Core Themes");
                coreThemes.forEach(createOption);
                createOptGroup("Custom Themes");
                customThemes.forEach(createOption);

                echThemeOptions.querySelector('select[name="theme"]').value = selectedTheme;

            },
        };
    }
    getData() {
        // We need to use the stored settings, but do a check from the default settings
        // In case a new color was added since the last update
        // We build a new object with the default settings, and then overwrite the values with the stored settings
        let themeOptions = game.settings.get("enhancedcombathud", "echThemeData");
        themeOptions = mergeObject(defaultTheme, themeOptions);

        return {
            themeOptions: themeOptions,
        };
    }
    activateListeners(html) {
        super.activateListeners(html);
        // Hex to rgba
        function _convertHexUnitTo256(hexStr) {
            return parseInt(hexStr.repeat(2 / hexStr.length), 16);
        }
        const getTextColor = (hexColor) => {
            const rgbaColor = (hex) => {
                const hexArr = hex.slice(1).match(new RegExp(".{2}", "g"));
                const [r, g, b, a] = hexArr.map(_convertHexUnitTo256);
                return [r, g, b, Math.round((a / 256 + Number.EPSILON) * 100) / 100];
            };

            const rgba = rgbaColor(hexColor);
            const brightness = Math.round((rgba[0] * 299 + rgba[1] * 587 + rgba[2] * 114) / 1000);

            if (rgba[3] > 0.5) {
                return brightness > 125 ? "black" : "white";
            } else {
                return "black";
            }
        };

        echThemeOptions.defaultOptions.buildDropdown(game.settings.get("enhancedcombathud", "echThemeData").theme);

        $(html).on("click", "li h4.toggleOptions", (event) => {
          let isOpened = $(event.currentTarget).closest("li").hasClass("show");
        
          $(event.currentTarget).closest("ul").find("li.show").removeClass("show");
          $(event.currentTarget).closest("li").toggleClass("show", !isOpened);
        });

        // Handle Theme Selection
        $(html)
            .find('select[name="theme"]')
            .on("change", (event) => {
                let selectedTheme = $(event.currentTarget).val();
                const updateColors = (theme) => {
                    $(html)
                        .find('button[name="colored"]')
                        .each((index, button) => {
                            let $button = $(button);
                            let setting = $button.data("setting").replace(/colors\./g, "");
                            let value = setting.split(".").reduce((p, c) => (p && p[c]) || null, theme);

                            if (value != null) {
                                $button.attr("value", value).css({
                                    "background-color": value,
                                    color: getTextColor(value),
                                });
                            }
                        });
                };

                if (selectedTheme != "custom") {
                    ui.ARGON.getThemeJson(selectedTheme).then((theme) => {
                        updateColors(theme);
                    });
                } else {
                    updateColors(game.settings.get("enhancedcombathud", "echThemeData").colors);
                }
            });

        // Export theme

        html[0].querySelector('button[name="export"]').addEventListener("click", (event) => {
            event.preventDefault();
            echThemeOptions.defaultOptions.createTheme()
        });
    }
    async _updateObject(event, formData) {
        function setDeepObj(obj, path, val) {
            var props = path.split(".");
            for (var i = 0, n = props.length - 1; i < n; ++i) {
                obj = obj[props[i]] = obj[props[i]] || {};
            }
            obj[props[i]] = val;
            return obj;
        }

        let themeOptions = game.settings.get("enhancedcombathud", "echThemeData");

        $(event.srcElement)
            .find('button[name="colored"]')
            .each((index, button) => {
                let $button = $(button);
                setDeepObj(formData, $button.data("setting"), $button.attr("value"));
            });

        await game.settings.set("enhancedcombathud", "echThemeData", formData);
        ui.ARGON.setColorSettings();
    }
}

export function initConfig() {


    Handlebars.registerHelper("echLocalize", (data, data2, data3) => {
        let str = `.${data}`;
        if (typeof data2 == "string")
          str += `${data2.charAt(0).toUpperCase() + data2.slice(1)}`;
        if (typeof data3 == "string")
          str += `${data3.charAt(0).toUpperCase() + data3.slice(1)}`;
      
        return game.i18n.localize(`enhancedcombathud.themeOptions${str}`);
    });
    
    Handlebars.registerHelper("ifObject", function (item, options) {
        if (typeof item === "object") {
          return options.fn(this);
        } else {
          return options.inverse(this);
        }
    });

    Hooks.on("pickerDone", (element, color) => {
        // Handle Theme
        let $element = $(element);
        let $settings = $element.closest("#echThemeOptions");

        if ($settings.length > 0) {
            $settings.find('.window-content select[name="theme"]').val("custom");
        }
    });

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
            ui.ARGON.refresh()
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
        type: echThemeOptions,
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
            ui.ARGON.refresh()
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
            ui.ARGON.refresh()
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
            ui.ARGON.refresh()
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
            ui.ARGON.refresh()
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

export function registerKeybindings() {
    game.keybindings.register("enhancedcombathud", "toggleHud", {
        name: "enhancedcombathud.hotkey.toggle.name",
        editable: [{ key: "KeyA", modifiers: [KeyboardManager.MODIFIER_KEYS.SHIFT] }],
        restricted: false,
        onDown: () => {},
        onUp: () => {
            ui.ARGON.toggle();
        },
    });
}
