import { MODULE_ID } from "../main.js";

export class HandlebarsApplication extends foundry.applications.api.HandlebarsApplicationMixin(
    foundry.applications.api.ApplicationV2,
) {
    constructor() {
        super();
        this.constructor.registerPositionSetting();
        this.savePosition = foundry.utils.debounce(
            this.savePosition.bind(this),
            100,
        );
    }

    static registerPositionSetting() {
        if (
            this.POSITION_SETTING_REGISTERED ||
            !this.DEFAULT_OPTIONS.window?.savePosition
        )
            return;
        this.POSITION_SETTING_REGISTERED = true;
        game.settings.register(MODULE_ID, this.APP_ID + "-position", {
            scope: "client",
            config: false,
            type: Object,
            default: {},
        });
    }

    static resetSavedPosition() {
        game.settings.set(MODULE_ID, this.APP_ID + "-position", {});
    }

    savePosition(position) {
        const positionToSave = {
            left: position.left,
            top: position.top,
            width: position.width,
            height: position.height,
        };
        if (positionToSave.width === "auto") delete positionToSave.width;
        if (positionToSave.height === "auto") delete positionToSave.height;
        game.settings.set(MODULE_ID, this.APP_ID + "-position", positionToSave);
    }

    setPosition(...args) {
        const r = super.setPosition(...args);
        if (this.constructor.POSITION_SETTING_REGISTERED)
            this.savePosition(this.position);
        return r;
    }

    static get APP_ID() {
        return this.name
            .split(/(?=[A-Z])/)
            .join("-")
            .toLowerCase();
    }

    get APP_ID() {
        return this.constructor.APP_ID;
    }

    static get PARTS() {
        return {
            content: {
                template: `modules/${MODULE_ID}/templates/${this.APP_ID}.hbs`,
                classes: [],
                scrollable: [],
            },
        };
    }

    static get DEFAULT_OPTIONS() {
        return {
            tag: "div",
            id: this.APP_ID,
            window: {
                title: `${MODULE_ID}.${this.APP_ID}.title`,
                frame: true,
                positioned: true,
                icon: "",
                controls: [],
                minimizable: true,
                resizable: false,
                contentTag: "section",
                contentClasses: [],
                savePosition: false,
                preventEscapeClose: false
            },
            actions: {},
            form: {
                handler: undefined,
                submitOnChange: false,
                closeOnSubmit: false,
            },
            position: {
                width: 560,
                height: "auto",
            },
        };
    }

    async _prepareContext(options) {
        if (this.getData) return this.getData();
        const data = {};
        return { data };
    }

    activateListeners() {}

    _onRender(context, options) {
        super._onRender(context, options);
        if (this.constructor.DEFAULT_OPTIONS.window.preventEscapeClose) {
            foundry.applications.instances.delete(this.id, this);
            this.window.close.style.display = "none"
        }
        const html = this.element;
        if (this.activateListeners) this.activateListeners(html);
    }

    async render(options1 = {}, options2 = {}) {
        const activeOptions =
            typeof options1 === "boolean" ? options2 : options1;
        if (
            !activeOptions.position &&
            this.constructor.POSITION_SETTING_REGISTERED
        )
            activeOptions.position = game.settings.get(
                MODULE_ID,
                this.APP_ID + "-position",
            );
        return super.render(options1, options2);
    }
}

export function dynamicImport(url) {
    const dynamicImport = new Function("url", "return import(url)");
    return dynamicImport(url);
}

export function confirm(title, content, options = {}) {
    title = l(title);
    content = l(content);
    return foundry.applications.api.DialogV2.confirm({
        window: { title },
        content,
    });
}

export function prompt(title, content, options = {}) {
    title = l(title);
    content = l(content);
    return foundry.applications.api.DialogV2.prompt({
        window: { title },
        content,
        ...options,
    });
}

export function deepClone(obj) {
    return foundry.utils.deepClone(obj);
}

export function expandObject(obj) {
    return foundry.utils.expandObject(obj);
}

export function flattenObject(obj) {
    return foundry.utils.flattenObject(obj);
}

export function mergeObject(obj, other) {
    return foundry.utils.mergeObject(obj, other);
}

export function mergeClone(obj, other) {
    obj = foundry.utils.deepClone(obj);
    other = foundry.utils.deepClone(other);
    return foundry.utils.mergeObject(obj, other);
}

export function randomID(length = 20) {
    return foundry.utils.randomID(length);
}

export function setProperty(obj, key, value) {
    return foundry.utils.setProperty(obj, key, value);
}

export function getProperty(obj, key) {
    return foundry.utils.getProperty(obj, key);
}

export function l(x) {
    return game.i18n.localize(x);
}

export function easeInSine(x) {
    return 1 - Math.cos((x * Math.PI) / 2);
}

export function easeOutSine(x) {
    return Math.sin((x * Math.PI) / 2);
}

export function easeInOutSine(x) {
    return -(Math.cos(Math.PI * x) - 1) / 2;
}

export function easeInQuad(x) {
    return x * x;
}

export function easeOutQuad(x) {
    return 1 - (1 - x) * (1 - x);
}

export function easeInOutQuad(x) {
    return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
}

export function easeInCubic(x) {
    return x * x * x;
}

export function easeOutCubic(x) {
    return 1 - Math.pow(1 - x, 3);
}

export function easeInOutCubic(x) {
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

export function easeInQuart(x) {
    return x * x * x * x;
}

export function easeOutQuart(x) {
    return 1 - Math.pow(1 - x, 4);
}

export function easeInOutQuart(x) {
    return x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2;
}

export function easeInQuint(x) {
    return x * x * x * x * x;
}

export function easeOutQuint(x) {
    return 1 - Math.pow(1 - x, 5);
}

export function easeInOutQuint(x) {
    return x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2;
}

export function easeInExpo(x) {
    return x == 0 ? x : Math.pow(2, 10 * (x - 1));
}

export function easeOutExpo(x) {
    return x == 1 ? x : 1 - Math.pow(2, -10 * x);
}

export function easeInOutExpo(x) {
    return x == 0
        ? 0
        : x == 1
          ? 1
          : x < 0.5
            ? Math.pow(2, 20 * x - 10) / 2
            : (2 - Math.pow(2, -20 * x + 10)) / 2;
}

export function easeInCirc(x) {
    return 1 - Math.sqrt(1 - Math.pow(x, 2));
}

export function easeOutCirc(x) {
    return Math.sqrt(1 - Math.pow(x - 1, 2));
}

export function easeInOutCirc(x) {
    return x < 0.5
        ? 1 - Math.sqrt(1 - Math.pow(2 * x, 2)) / 2
        : (Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) / 2;
}

export function easeInElastic(x) {
    let s = 1.70158;
    let p = 0;
    let a = 1;
    if (x == 0) return 0;
    if ((x /= 1) == 1) return 1;
    if (!p) p = 0.3;
    if (a < 1) {
        a = 1;
        s = p / 4;
    } else {
        s = (p / (2 * Math.PI)) * Math.asin(1 / a);
    }
    return -(
        a *
        Math.pow(2, 10 * (x -= 1)) *
        Math.sin(((x * 1 - s) * (2 * Math.PI)) / p)
    );
}

export function easeOutElastic(x) {
    let s = 1.70158;
    let p = 0;
    let a = 1;
    if (x == 0) return 0;
    if ((x /= 1) == 1) return 1;
    if (!p) p = 0.3;
    if (a < 1) {
        a = 1;
        s = p / 4;
    } else {
        s = (p / (2 * Math.PI)) * Math.asin(1 / a);
    }
    return (
        a * Math.pow(2, -10 * x) * Math.sin(((x * 1 - s) * (2 * Math.PI)) / p) +
        1
    );
}

export function easeInOutElastic(x) {
    let s = 1.70158;
    let p = 0;
    let a = 1;
    if (x == 0) return 0;
    if ((x /= 1 / 2) == 2) return 1;
    if (!p) p = 0.3 * (0.3 + 1);
    if (a < 1) {
        a = 1;
        s = p / 4;
    } else {
        s = (p / (2 * Math.PI)) * Math.asin(1 / a);
    }
    if (x < 1)
        return (
            -0.5 *
            (a *
                Math.pow(2, 10 * (x -= 1)) *
                Math.sin(((x * 1 - s) * (2 * Math.PI)) / p))
        );
    return (
        a *
            Math.pow(2, -10 * (x -= 1)) *
            Math.sin(((x * 1 - s) * (2 * Math.PI)) / p) *
            0.5 +
        1
    );
}

export function easeInBack(x) {
    let s = 1.70158;
    return x * x * ((s + 1) * x - s);
}

export function easeOutBack(x) {
    let s = 1.70158;
    return 1 - (1 - x) * (1 - x) * ((s + 1) * x - s);
}

export function easeInOutBack(x) {
    let s = 1.70158;
    if ((x /= 1 / 2) < 1)
        return (1 / 2) * (x * x * (((s *= 1.525) + 1) * x - s));
    return (1 / 2) * ((x -= 2) * x * (((s *= 1.525) + 1) * x + s) + 2);
}

export function addColorPicker(input, { value, opacity = false } = {}) {
    const hexToComponents = (hex) => {
        const hexColor =
            hex.length < 9 ? hex + "f".repeat(9 - hex.length) : hex;

        const colorValue = hexColor.slice(0, 7);
        const alphaValue = parseInt(hexColor.slice(7, 9), 16) / 255;
        return { color: colorValue, alpha: alphaValue };
    };

    const componentsToHex = (color, alpha) => {
        const colorValue = color.replace("#", "");
        const alphaValue = Math.round(alpha * 255)
            .toString(16)
            .padStart(2, "0");
        return `#${colorValue}${alphaValue}`;
    };

    const textInput =
        input.type === "text"
            ? input
            : input.querySelector("input[type='text']");
    if (textInput.classList.contains("color-picker-added")) return;

    textInput.classList.add("color-picker-added");
    textInput.classList.add("color");
    const parent = textInput.parentElement;

    value ??= textInput.value || "#000000ff";

    const { color, alpha } = hexToComponents(value);

    const colorPickerElement = document.createElement("input");
    colorPickerElement.setAttribute("type", "color");
    if (opacity) colorPickerElement.style.maxWidth = "2rem";

    const alphaPickerHtml = `<range-picker min="0" max="1" step="0.01" value="${alpha}" data-tooltip="Alpha" style="min-width: 6rem;"></range-picker>`;
    const alphaPickerElement = new DOMParser()
        .parseFromString(alphaPickerHtml, "text/html")
        .querySelector("range-picker");

    const updateTextInput = (color, alpha) => {
        const hex = componentsToHex(color, alpha);
        if (!opacity) textInput.value = hex.slice(0, 7);
        else textInput.value = hex;
        textInput.dispatchEvent(new Event("change"));
    };

    colorPickerElement.value = color;
    alphaPickerElement.value = alpha;

    colorPickerElement.addEventListener("input", (event) => {
        const color = event.target.value;
        const alpha = alphaPickerElement.value;
        updateTextInput(color, alpha);
    });

    alphaPickerElement.addEventListener("input", (event) => {
        const alpha = event.target.value;
        const color = colorPickerElement.value;
        updateTextInput(color, alpha);
    });

    textInput.after(colorPickerElement);
    opacity && colorPickerElement.after(alphaPickerElement);
}
