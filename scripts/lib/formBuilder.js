import { MODULE_ID } from "../main.js";

const PARTIAL_KEY = "6uy8g1tXqHlhlp65dhiL-genericFormHelper-" + MODULE_ID;

export class FormBuilder {
    constructor() {
        this.submitButton();
    }

    #tabs = [];
    #fields = [];
    #buttons = [];
    #options = {
        position: {
            width: 560,
            height: "auto",
        },
        window: {},
    };

    #currentTab = null;
    #currentFieldset = null;
    #object = null;
    #app = null;

    get app() {
        return this.#app;
    }

    async render() {
        const app = this.form();
        app.render(true);
        return app.promise;
    }

    form() {
        if (this.#app) return this.#app;
        const app = new FormHelper({ tabs: this.#tabs, fields: this.#fields, buttons: this.#buttons, options: this.#options });
        this.#app = app;
        return app;
    }

    getHTML() {
        const app = this.form();
        const data = app._prepareContext();
        FormHelper.registerPartial();
        return renderTemplate(PARTIAL_KEY, data);
    }

    getAsClass(options) {
        const classData = { ...options, tabs: this.#tabs, fields: this.#fields, buttons: this.#buttons, options: this.#options };

        return class extends FormHelper {
            constructor(data = {}) {
                super({ ...classData, ...data });
            }
        };
    }

    onRender(callback) {
        this.#options.onRender = callback;
        return this;
    }

    registerAsMenu({ moduleId, key, name, label, icon, hint, scope, restricted, defaultValue, onChange, requiresReload } = {}) {
        moduleId ??= MODULE_ID;
        scope ??= "world";
        restricted ??= true;
        defaultValue ??= {};
        key ??= "settings";
        icon ??= "fas fa-cogs";
        label ??= "Configure";
        name ??= "Configuration Menu";
        hint ??= "Configure the module settings";

        const menuOptions = {
            settingsMenu: {
                requiresReload,
                onChange,
                moduleId,
                key,
            },
        };

        const cls = this.getAsClass(menuOptions);

        game.settings.registerMenu(moduleId, key + "-menu", {
            name,
            label,
            hint,
            icon,
            scope,
            restricted,
            type: cls,
        });

        game.settings.register(moduleId, key, {
            scope,
            config: false,
            default: defaultValue,
            type: Object,
            onChange,
            requiresReload,
        });

        return {
            getSetting: () => game.settings.get(moduleId, key),
            setSetting: (value) => game.settings.set(moduleId, key, value),
        };
    }

    async insertHTML(element, selector, insertion = "afterend") {
        const html = await this.getHTML();

        const tempEl = document.createElement("div");
        tempEl.innerHTML = html;
        const insertionEl = tempEl.children[0];

        const el = selector ? element.querySelector(selector) : element;
        if (!el) throw new Error(`Element ${selector} not found`);
        el.insertAdjacentElement(insertion, insertionEl);
        return insertionEl;
    }

    #addField(field) {
        if (this.#object && field.name) {
            const objectValue = foundry.utils.getProperty(this.#object, field.name);
            if (objectValue !== undefined) field.value = objectValue;
        }

        if (this.#currentFieldset) return this.#currentFieldset.fields.push(field);
        if (this.#currentTab) return this.#currentTab.fields.push(field);
        return this.#fields.push(field);
    }

    title(title) {
        this.#options.window.title = title;
        return this;
    }

    resizable(resizable = true) {
        this.#options.window.resizable = resizable;
        return this;
    }

    info(info) {
        this.#options.info = info;
        return this;
    }

    object(object) {
        this.#object = object;
        return this;
    }

    size({ width, height }) {
        this.#options.position = {
            width: width ?? 560,
            height: height ?? "auto",
        };
        return this;
    }

    submitButton({ enabled = true, label = "Confirm", icon = "fa-solid fa-check" } = {}) {
        const submitButton = {
            type: "submit",
            action: "submit",
            icon,
            label,
        };
        if (!enabled) this.#buttons = this.#buttons.filter((b) => b.action !== "submit");
        else this.#buttons.push(submitButton);
        return this;
    }

    tab({ id, group, icon, label, active = false } = {}) {
        group ??= "sheet";
        if (!id && this.#currentTab) {
            this.#currentTab = null;
            return this;
        }
        if (!id) throw new Error("You must provide an id for the tab");
        const tab = {
            id,
            group,
            icon,
            label,
            active,
            fields: [],
        };
        this.#tabs.push(tab);
        this.#currentTab = tab;
        return this;
    }

    fieldset({ legend } = {}) {
        if (!legend && this.#currentFieldset) {
            this.#currentFieldset = null;
            return this;
        }
        if (!legend) throw new Error("You must provide a legend for the fieldset");
        const fieldset = {
            legend,
            fieldset: true,
            fields: [],
        };
        this.#addField(fieldset);
        this.#currentFieldset = fieldset;
        return this;
    }

    html(html) {
        const field = {
            html,
        };
        this.#addField(field);
        return this;
    }

    text({ name, label, hint, value }) {
        const field = {
            field: new foundry.data.fields.StringField(),
            name,
            label,
            hint,
            value,
        };
        this.#addField(field);
        return this;
    }

    number({ name, label, hint, value, min, max, step }) {
        const field = {
            field: new foundry.data.fields.NumberField(),
            name,
            label,
            hint,
            value,
            min,
            max,
            step,
        };
        this.#addField(field);
        return this;
    }

    checkbox({ name, label, hint, value }) {
        const field = {
            field: new foundry.data.fields.BooleanField(),
            name,
            label,
            hint,
            value,
        };
        this.#addField(field);
        return this;
    }

    color({ name, label, hint, value }) {
        const field = {
            field: new foundry.data.fields.ColorField(),
            name,
            label,
            hint,
            value,
        };
        this.#addField(field);
        return this;
    }

    file({ name, type, label, hint, value }) {
        type ??= "imagevideo";
        const types = FILE_PICKER_TYPES[type];
        const dataField = new foundry.data.fields.FilePathField({ categories: types });
        dataField.categories = [type];
        const field = {
            field: dataField,
            name,
            label,
            hint,
            type,
            value,
        };
        this.#addField(field);
        return this;
    }

    select({ name, label, hint, value, options }) {
        const dType = inferSelectDataType(options);
        const field = {
            field: dType === Number ? new foundry.data.fields.NumberField({ choices: options, required: true }) : new foundry.data.fields.StringField({ choices: options, required: true, blank: false }),
            name,
            label,
            hint,
            value: value ?? options[0]?.key,
            options,
        };
        this.#addField(field);
        return this;
    }

    multiSelect({ name, label, hint, value, options }) {
        const dType = inferSelectDataType(options);
        const dataField = dType === Number ? new foundry.data.fields.NumberField({ choices: options, nullable: false }) : new foundry.data.fields.StringField({ choices: options, nullable: false });
        const field = {
            field: new foundry.data.fields.SetField(dataField),
            name,
            label,
            hint,
            value,
            options,
        };
        this.#addField(field);
        return this;
    }

    editor({ name, label, hint, value }) {
        const field = {
            field: new foundry.data.fields.HTMLField(),
            name,
            label,
            hint,
            value,
        };
        this.#addField(field);
        return this;
    }

    textArea({ name, label, hint, value }) {
        const field = {
            field: new foundry.data.fields.JSONField(),
            name,
            label,
            hint,
            value,
            stacked: true,
        };
        this.#addField(field);
        return this;
    }

    script({ name, label, hint, value }) {
        const field = {
            field: new foundry.data.fields.JavaScriptField(),
            name,
            label,
            hint,
            value,
        };
        this.#addField(field);
        return this;
    }

    uuid({name, label, hint, value, type, multiple}) {
        const dataField = {
            field: new foundry.data.fields.DocumentUUIDField({type},{}),
            name,
            label,
            hint,
            value,
            type,
            multiple,
        };
        let field;
        if (multiple) {
            field = {
                field: new foundry.data.fields.SetField(dataField.field),
                name,
                label,
                hint,
                value,
                multiple,
            };
        } else {
            field = dataField;
        }
        this.#addField(field);
        return this;
    }

    button({ label, action, icon, callback }) {
        action ??= foundry.utils.randomID();
        const button = {
            action,
            type: "button",
            icon,
            label,
            callback,
        };
        this.#buttons.push(button);
        return this;
    }
}

const FILE_PICKER_TYPES = {
    imagevideo: ["IMAGE", "VIDEO"],
    image: ["IMAGE"],
    video: ["VIDEO"],
    audio: ["AUDIO"],
    font: ["FONT"],
    graphics: ["GRAPHICS"],
};

function inferSelectDataType(options) {
    const values = Array.isArray(options) ? options.map((o) => o.key) : Object.keys(options);
    try {
        const isNumber = values.every((v) => {
            const n = JSON.parse(v);
            return typeof n === "number";
        });
        if (isNumber) return Number;
    } catch (e) {
        return String;
    }
    return String;
}

export class FormHelper extends foundry.applications.api.HandlebarsApplicationMixin(foundry.applications.api.ApplicationV2) {
    constructor(data) {
        const actions = {};
        data.buttons.forEach((b) => (actions[b.action] = b.callback));
        super({ actions, ...data.options });
        FormHelper.registerPartial();
        this.menu = data.settingsMenu;
        this.resolve;
        this.reject;
        this.promise = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
        this.onRenderFunction = data.options.onRender;
        this.#info = data.options.info;
        this.processFormStructure(data);
    }

    #fields;

    #buttons;

    #info;

    static DEFAULT_OPTIONS = {
        classes: ["form-helper"],
        tag: "form",
        window: {
            contentClasses: ["standard-form"],
        },
        position: {
            width: 560,
            height: "auto",
        },
        form: {
            handler: this.#onSubmit,
            closeOnSubmit: true,
        },
        actions: {},
    };

    static PARTS = {
        tabs: {
            template: "templates/generic/tab-navigation.hbs",
        },
        genericForm: {
            template: PARTIAL_KEY,
            classes: ["standard-form", "scrollable"],
        },
        footer: {
            template: "templates/generic/form-footer.hbs",
        },
    };

    static registerPartial() {
        if (Handlebars.partials[PARTIAL_KEY]) return;
        const compiledTemplate = Handlebars.compile(GENERIC_FORM_HBS);
        Handlebars.registerPartial(PARTIAL_KEY, compiledTemplate);
    }

    processFormStructure(data) {
        const currentSetting = this.menu ? game.settings.get(this.menu.moduleId, this.menu.key) : {};
        const isMenu = !!this.menu;

        if (data.tabs?.length) {
            this.__tabs = {};
            const active = data.tabs.find((t) => t.active);
            if (!active) data.tabs[0].active = true;
            for (const tab of data.tabs) {
                this.__tabs[tab.id] = {
                    id: tab.id,
                    group: tab.group,
                    icon: tab.icon,
                    label: tab.label,
                    active: tab.active ?? false,
                    fields: tab.fields ?? [],
                };

                if (isMenu) {
                    const fields = tab.fields ?? [];
                    for (const field of fields) {
                        const settingValue = foundry.utils.getProperty(currentSetting, field.name);
                        if (settingValue !== undefined) field.value = settingValue;
                    }
                }
            }
        }

        if (isMenu) {
            const fields = data.fields ?? [];
            for (const field of fields) {
                const settingValue = foundry.utils.getProperty(currentSetting, field.name);
                if (settingValue !== undefined) field.value = settingValue;
            }
        }

        this.#fields = data.fields ?? [];

        this.#buttons = data.buttons ?? [];
    }

    _onClose(options) {
        super._onClose(options);
        if (!this.promise.resolved) this.resolve(false);
    }

    _prepareContext(options) {
        return {
            tabs: this.#getTabs(),
            fields: this.#fields,
            info: this.#info,
            buttons: [...this.#buttons.filter((b) => b.type !== "submit"), ...this.#buttons.filter((b) => b.type === "submit")],
        };
    }

    _onRender(context, options) {
        super._onRender(context, options);
        if (!this.__tabs) {
            this.element.querySelector("nav").classList.add("hidden");
        }
        if(this.onRenderFunction) this.onRenderFunction.bind(this)(context, options);
    }

    #getTabs() {
        const tabs = this.__tabs ?? {};
        for (const v of Object.values(tabs)) {
            v.cssClass = v.active ? "active" : "";
            if (v.active) break;
        }
        return tabs;
    }

    changeTab(...args) {
        super.changeTab(...args);
    }

    _onChangeForm(formConfig, event) {
        super._onChangeForm(formConfig, event);
        const formData = new FormDataExtended(this.element);
    }

    getFormData() {
        const formData = new FormDataExtended(this.element);
        return foundry.utils.expandObject(formData.object);
    }

    static async #onSubmit(event, form, formData) {
        const data = foundry.utils.expandObject(formData.object);
        this.resolve(data);
        if (this.menu) {
            if (this.menu.requiresReload) SettingsConfig.reloadConfirm();
            if (this.menu.onChange) this.menu.onChange(data);
            return game.settings.set(this.menu.moduleId, this.menu.key, data);
        }
    }
}

const FIELD_INNER_HBS = `
    {{#if field.fieldset}}
    <fieldset>
        <legend>{{localize field.legend}}</legend>
        {{#each field.fields as |f|}}
        {{#if f.html}}{{{f.html}}}{{else}}
        {{formField f.field stacked=f.stacked type=f.type label=f.label hint=f.hint name=f.name value=f.value min=f.min max=f.max step=f.step localize=true}}
        {{/if}}
        {{/each}}
    </fieldset>
    {{else}}
    {{#if field.html}}{{{field.html}}}{{else}}
    {{formField field.field stacked=field.stacked multiple=field.multiple type=field.type label=field.label hint=field.hint name=field.name value=field.value min=field.min max=field.max step=field.step localize=true}}
    {{/if}}
    {{/if}}
        `;

const GENERIC_FORM_HBS = `<div>
    {{#if info}}{{{info}}}{{/if}}
    {{#each tabs as |tab|}}

    <section class="tab standard-form scrollable {{tab.cssClass}}" data-tab="{{tab.id}}" data-group="{{tab.group}}">
        {{#each tab.fields as |field|}}
        ${FIELD_INNER_HBS}
        {{/each}}
    </section>

    {{/each}}

    {{#each fields as |field|}}
    ${FIELD_INNER_HBS}
    {{/each}}
</div>`;    