import { HandlebarsApplication, mergeClone, setProperty } from "../lib/utils.js";
import { defaultTheme } from "../config.js";

export class EchThemeOptions extends HandlebarsApplication {

    static get DEFAULT_OPTIONS() {
        return mergeClone(super.DEFAULT_OPTIONS, {
            tag: "form",
            id: "echThemeOptions",
            window: {
                title: "Theme Options",
                contentClasses: ["standard-form"],
                resizable: true,
            },
            actions: {
                fooAction: this.fooAction,
                barAction: this.barAction,	
            },
            form: {
                handler: this.#onSubmit,
                closeOnSubmit: false,
            },
            position: {
                width: 660,
                // height: window.innerHeight,
            }
        });
    }

    static get PARTS() {
        return {
            content: {
                template: "modules/enhancedcombathud/templates/theme-options.hbs",
                classes: ["standard-form", "scrollable"],
            },
            footer: {
                template: "templates/generic/form-footer.hbs",
            }
        };
    }

    createTheme() {
        new foundry.applications.api.DialogV2({
            window: { title: "Export Argon - Combat HUD Theme" },
            content: `
                <form id="echExportTheme">
                    <div class="form-group">
                        <label>${game.i18n.localize("enhancedcombathud.themeOptions.exportThemeName")}</label>
                        <input type="text" name="echExportThemeName"/>
                    </div>
                </form>`,
            buttons: [
                {
                    action: "export",
                    label: "Save",
                    callback: (event, button, dialog)  => {
                        const themeName = dialog.element.querySelector('input[name="echExportThemeName"]').value.slugify({strict: true});
                        const theme = new File([new Blob([JSON.stringify(this.getThemeColors())], { type: "application/json" })], `${themeName}.json`);
                        foundry.applications.apps.FilePicker.implementation.uploadPersistent("enhancedcombathud", "themes", theme).then((response) => {
                            this.buildDropdown(themeName);
                        });
                    },
                },
                {
                    action: "cancel",
                    label: "Cancel",
                    callback: (event) => {
                        return true;
                    },
                },
            ],
        }).render({force: true});
    }

    getThemeColors() {
        let theme = {};

        this.element.querySelectorAll('#echThemeOptions .window-content alpha-color-picker').forEach((input) => {
            setProperty(theme, input.name, input.getAttribute("value"));
        });

        // Export Theme
        return foundy.utils.expandObject(theme.colors);
    }

    async buildDropdown(selectedTheme) {
        if (typeof selectedTheme == "undefined") game.settings.get("enhancedcombathud", "echThemeData").theme;

        const echThemeOptions = this.element;
        const selectTheme = echThemeOptions.querySelector('select[name="theme"]');
        selectTheme.innerHTML = "";

        const coreThemes = (await foundry.applications.apps.FilePicker.implementation.browse("user", `modules/enhancedcombathud/scripts/themes`, { extensions: [".json"] })).files;
        const customThemes = (await foundry.applications.apps.FilePicker.implementation.browse("user", `modules/enhancedcombathud/storage/themes`, { extensions: [".json"] })).files;

        function createOption(file) {
            const filename = file.split("/")[file.split("/").length - 1].replace(/\.json/gi, "");
            const option = document.createElement("option");
            option.value = filename;
            const optionName = filename.replace(/-/g, " ");
            option.text = optionName.split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
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
        this.setThemeVisibility(selectedTheme);
    }

    _prepareContext(options) {
        // We need to use the stored settings, but do a check from the default settings
        // In case a new color was added since the last update
        // We build a new object with the default settings, and then overwrite the values with the stored settings
        let themeOptions = game.settings.get("enhancedcombathud", "echThemeData");
        themeOptions = foundry.utils.mergeObject(defaultTheme, themeOptions);

        const saveButton = {
            type: "submit",
            action: "submit",
            icon: "fas fa-save",
            label: "Save",
        };

        return {
            themeOptions: themeOptions,
            buttons: [saveButton],
        };
    }

    _onRender(context, options) {
        super._onRender(context, options);
        const html = this.element;
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

        this.buildDropdown(game.settings.get("enhancedcombathud", "echThemeData").theme);

        html.addEventListener("click", (event) => {
            if (event.target.matches("li h4.toggleOptions") || event.target.closest("li h4.toggleOptions")) {
                const toggleElement = event.target.matches("li h4.toggleOptions") 
                    ? event.target 
                    : event.target.closest("li h4.toggleOptions");
                
                const listItem = toggleElement.closest("li");
                const isOpened = listItem.classList.contains("show");
                
                const parentUl = toggleElement.closest("ul");
                parentUl.querySelectorAll("li.show").forEach(li => li.classList.remove("show"));
                
                listItem.classList.toggle("show", !isOpened);
                this.setPosition({height: "auto"});
            }
        });

        let themeOptions = game.settings.get("enhancedcombathud", "echThemeData");
        this.setThemeVisibility(themeOptions.theme);

        // Handle Theme Selection
        html
            .querySelector('select[name="theme"]')
            .addEventListener("change", (event) => {
                let selectedTheme = event.currentTarget.value;

                const updateColors = (theme) => {
                    html
                        .querySelectorAll('.color-picker')
                        .forEach((picker) => {
                            let name = picker.name.replace(/colors\./g, "");
                            let value = name.split(".").reduce((p, c) => (p && p[c]) || null, theme);

                            if (value != null) {
                                picker.setAttribute("value", value);
                                picker.value = value;
                                picker.style.backgroundColor = value;
                                picker.style.color = getTextColor(value);
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
                this.setThemeVisibility(selectedTheme);
                this.setPosition({height: "auto"});
            });

        // Export theme

        html.querySelector('button[name="export"]').addEventListener("click", (event) => {
            event.preventDefault();
            this.createTheme();
        });
    }

    _onChangeForm(formConfig, event) {
        const formData = new foundry.applications.ux.FormDataExtended(this.form).object;

        ui.ARGON.setColorSettings(foundry.utils.expandObject(formData));
    }

    static async #onSubmit() {
        const form = this.element;
        const formData = new foundry.applications.ux.FormDataExtended(form).object;

        await game.settings.set("enhancedcombathud", "echThemeData", foundry.utils.expandObject(formData));
    }

    setThemeVisibility(selectedTheme) {
        this.element.querySelector(".echThemeOptionsContainer").classList.toggle("hidden", selectedTheme != "custom");
        this.element.querySelector("button[name='export']").classList.toggle("hidden", selectedTheme != "custom");
    }

    async render(args) {
        // if (!game.modules.get("colorsettings")?.active) {
        //     ui.notifications.warn("The 'lib - Color Settings' module is required to customize the theme colors. Please install it from FoundryVTT's module repository.");
        // }
        return super.render(args);
    }

    _onClose(...args) {
        super._onClose(...args);
        ui.ARGON.setColorSettings();
    }
}