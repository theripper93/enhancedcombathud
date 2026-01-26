// Convert 0-255 number to hex string
function numToHex(num) {
    return num.toString(16).padStart(2, "0");
}

// Convert hex string to 0-255 number
function hexToNum(hex) {
    return parseInt(hex, 16);
}


/**
 * @typedef HTMLAlphaColorPickerOptions
 * @property {string} value  A hexadecimal string representation of the color with alpha.
 * @property {number} step  A number representing the step of the alpha.
 * @property {number} min  A number representing the minimum value of the alpha.
 * @property {number} max  A number representing the maximum value of the alpha.
 */

/**
 * A custom HTMLElement used to select a color and an alpha using a linked pair of input fields.
 * @extends {AbstractFormInputElement<string>}
 */
export class HTMLAlphaColorPickerElement extends foundry.applications.elements.AbstractFormInputElement {

    /**
     * @param {HTMLAlphaColorPickerOptions} [options]
     */
    constructor({value, step, min, max} = {}) {
        super();
        value = value || this.getAttribute("value") || "#000000ff";
        this.value = value || this.getAttribute("value");
        this._color = value.slice(0, 7);
        this._alpha = hexToNum(value.slice(7, 9));
        this._step = (step || this.getAttribute("step")) || 1;
        this._min = (min || this.getAttribute("min")) || 0;
        this._max = (max || this.getAttribute("max")) || 255;
    }

    _getValue() {
        return this._color + numToHex(this._alpha);
    }

    _setValue(color) {
        this._color = color.slice(0, 7);
        this._alpha = hexToNum(color.slice(7, 9));
        this._value = color;
        this.setAttribute("value", color);
    }

    /** @override */
    static tagName = "alpha-color-picker";

    /* -------------------------------------------- */

    /**
     * The input element to define a Document UUID.
     * @type {HTMLInputElement}
     */
    #colorPicker;

    /**
     * The input element to define a Document UUID.
     * @type {HTMLInputElement}
     */
    #colorAlpha;

    #colorOutput;

    /* -------------------------------------------- */

    /** @override */
    _buildElements() {

        const container = document.createElement("div");
        container.style.display = "flex";
        container.style.flexDirection = "row";
        container.style.alignItems = "center";
        container.style.gap = "0.5rem";
        container.style.justifyContent = "space-between";

        // Create color selector element
        this.#colorPicker = new foundry.applications.elements.HTMLColorPickerElement({ value: this._color });
        this.#colorPicker.style.flex = "1";
        this._applyInputAttributes(this.#colorPicker);

        this.#colorAlpha = new foundry.applications.elements.HTMLRangePickerElement({ value: this._alpha, step: this._step, min: this._min, max: this._max });
        this.#colorAlpha.style.flex = "1";
        this._applyInputAttributes(this.#colorAlpha);

        this.#colorOutput = document.createElement("span");
        this.#colorOutput.style.background = this.value;
        // this.#colorOutput.style.opacity = this._alpha;
        this.#colorOutput.style.borderRadius = "50%";
        this.#colorOutput.style.width = "var(--input-height)";
        this.#colorOutput.style.height = "var(--input-height)";
        this.#colorOutput.style.border = "solid 1px";

        container.appendChild(this.#colorPicker);
        container.appendChild(this.#colorAlpha);
        container.appendChild(this.#colorOutput);

        return [container];

        // return [this.#colorPicker, this.#colorAlpha];
    }

    /* -------------------------------------------- */

    // /** @override */
    _refresh() {
        if ( !this.#colorPicker ) return; // Not yet connected
        this.#colorPicker._setValue(this._color);
        this.#colorPicker._refresh();
        this.#colorAlpha._setValue(this._alpha);
        this.#colorAlpha._refresh();
        this.#colorOutput.style.background = this.value;
        // this.#colorOutput.style.opacity = this._alpha / 255;
    }

    /* -------------------------------------------- */

    /** @override */
    _activateListeners() {
        const onChange = this.#onChangeInput.bind(this);
        this.#colorPicker.addEventListener("change", onChange);
        this.#colorAlpha.addEventListener("change", onChange);
    }

    /* -------------------------------------------- */

    /**
     * Handle changes to one of the inputs of the color picker element.
     * @param {InputEvent} event     The originating input change event
     */
    #onChangeInput(event) {
        event.stopPropagation();
        if(event.currentTarget === this.#colorPicker) {
            this._color = event.currentTarget.value;
        } else {
            this._alpha = event.currentTarget.value;
        }
        this.value = this.value;
    }

    /* -------------------------------------------- */
}