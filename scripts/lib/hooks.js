const HOOKS = [];


export class Hook{

    constructor (hookName, callback, options = { on: true, debug: false }) {
        this.hookName = hookName;
        this.callback = callback;
        this.options = options;
        if (options.on) this.on();
        HOOKS.push(this);
    }

    on() {
        if(this.hookId) this.log(`Hook ${this.hookName} already registered, skipping`, this);
        else this.hookId = Hooks.on(this.hookName, this.callback);
        return this.hookId;
    }

    off() {
        if (!this.hookId) this.log(`Hook ${this.hookName} not registered, skipping`, this);
        else {
            try {
                Hooks.off(this.hookName, this.hookId);
            } catch (err) { }
        }
        this.hookId = null;
        return this.hookId;
    }

    log(...args) {
        if (!this.options.debug) return;
        return console.log(...args);
    }

    destroy() {
        this.off();
        HOOKS.splice(HOOKS.indexOf(this), 1);
    }

    static on(hookName, callback) {
        return new Hook(hookName, callback);
    }

    static off(hookName, hookIdOrCallback, destroy = true) {
        let hook = HOOKS.find(h => h.hookName === hookName && (h.hookId === hookIdOrCallback || h.callback === hookIdOrCallback));
        if(!hook) return console.log(`Hook ${hookName} not found`);
        if (destroy) return hook.destroy();
        else hook.off();
        return hook;
    }
}