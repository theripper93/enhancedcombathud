import { MODULE_ID } from "../main.js";

/**
 * Imports the Socket class from the specified module.
 * @module lib/socket
 */
/* import { Socket } from "./lib/socket.js"; */

/**
 * Registers a socket event with the specified name, callback function, and default options.
 * @param {string} eventName - The name of the event.
 * @param {function} callback - The function to call when the event is received.
 * @param {object} defaultOptions - The default options for the event.
 * @param {boolean} defaultOptions.response - If true, the event will wait for a response from other users.
 * @param {number} defaultOptions.timeout - The time in milliseconds to wait for a response.
 * @returns {void}
 * @example
 * Socket.register("rollSkill", async ({ skill, actorId }) => {
 *    const actor = game.actors.get(actorId) ?? game.user.character;
 *    return await actor.rollSkill(skill);
 * }, { response: true, timeout: 30000 });
 */
/* Socket.register("eventName", ({ data }) => {}, defaultOptions); */

/**
 * Calls a socket event with the specified data and options.
 * @param {object} data - The data to send to other users.
 * @param {object | string | array} options - The options for the event.
 * @param {string | array} options.users - The users to send the event to.
 * @param {boolean} options.response - If true, the event will wait for a response from other users.
 * @param {number} options.timeout - The time in milliseconds to wait for a response.
 * @returns {Promise} - The promise will resolve with the results from other users.
 * @example
 * const results = await Socket.rollSkill({ skill: "acr", actorId: "f4y54ytw34s32" }, "others");
 */
/* const results = await Socket.eventName({ data }, options); */

/**
 * Constants representing special user identifiers that can be used in place of a userId field.
 * These constants can be accessed using the `Socket.USERS` object. You can use their lower case string values as well.
 * @namespace
 * @property {string} GMS - All Game Masters (GMs).
 * @property {string} PLAYERS - All players.
 * @property {string} ALL - All users.
 * @property {string} OTHERS - All users except the current user.
 * @property {string} FIRSTGM - The first Game Master.
 * @property {string} SELF - The current user.
 */

export class Socket {
    static __$callbacks = {};

    static __$stores = {};

    static __$promises = {};

    static USERS = {
        GMS: "gms",
        PLAYERS: "players",
        ALL: "all",
        OTHERS: "others",
        FIRSTGM: "firstGM",
        SELF: "self",
    };

    static __$reserved = ["__$eventName", "__$response", "__$onMessage", "__$parseUsers", "register", "USERS"];

    static async __$onMessage(data) {
        const options = data.__$socketOptions;

        if (options.__$storeName) {
            if (options.__$request) {
                const store = this.__$stores[options.__$storeName];
                const _isLive = store._isLive;
                if (!_isLive) return;
                game.socket.emit(`module.${MODULE_ID}`, { __$socketOptions: { __$storeName: options.__$storeName, user: game.user.id }, data: store.getData() });
            } else {
                this.__$stores[options.__$storeName].synchronize(data.data, game.users.get(options.user));
            }
            return;
        }

        if (options.__$eventName === "__$response") {
            const key = options.__$responseKey;
            if (this.__$promises[key]) {
                this.__$promises[key].resolve({ user: game.users.get(options.__$userId), response: data.result });
                delete this.__$promises[key];
            }
            return;
        }
        if (!options.users.includes(game.user.id)) return;
        const callback = this.__$callbacks[options.__$eventName];
        delete data.__$socketOptions;
        const result = await callback(data);
        if (options.response) {
            const key = `${options.__$eventId}.${game.user.id}`;
            const data = { __$socketOptions: { __$eventName: "__$response", __$responseKey: key, __$userId: game.user.id }, result };
            this.__$socket.emit(`module.${MODULE_ID}`, data);
        }
    }

    static __$parseUsers(options) {
        if (Array.isArray(options?.users)) return options;
        if (typeof options === "string") options = { users: options };
        if (Array.isArray(options)) options = { users: options };
        options.users = options.users || this.USERS.ALL;
        const active = game.users.filter((u) => u.active);
        const users = options.users;
        if (users === this.USERS.ALL) {
            options.users = active.map((u) => u.id);
        } else if (users === this.USERS.GMS) {
            options.users = active.filter((u) => u.isGM).map((u) => u.id);
        } else if (users === this.USERS.PLAYERS) {
            options.users = active.filter((u) => !u.isGM).map((u) => u.id);
        } else if (users === this.USERS.OTHERS) {
            options.users = active.filter((u) => u.id !== game.user.id).map((u) => u.id);
        } else if (users === this.USERS.FIRSTGM) {
            options.users = [game.users.activeGM.id];
        } else if (users === this.USERS.SELF) {
            options.users = [game.user.id];
        }
        return options;
    }

    static register(eventName, callback, defaultOptions = {}) {
        if (!this.__$socket) {
            this.__$socket = game.socket;
            game.socket.on(`module.${MODULE_ID}`, this.__$onMessage.bind(this));
        }

        if (this.__$reserved.includes(eventName)) {
            throw new Error(`Socket event name ${eventName} is reserved`);
        }

        this.__$callbacks[eventName] = callback;

        const wrappedCallback = async (data = {}, options = {}) => {
            options = { ...defaultOptions, ...options };    
            options = this.__$parseUsers(options);
            const eventId = foundry.utils.randomID();
            options.__$eventId = eventId;
            options.__$eventName = eventName;
            const promises = [];
            const local = options.users.includes(game.user.id);
            options.users = options.users.filter((u) => u !== game.user.id);
            if (options.response) {
                for (const user of options.users) {
                    promises.push(
                        new Promise((resolve, reject) => {
                            const key = `${eventId}.${user}`;
                            this.__$promises[key] = { resolve, reject };
                        }),
                    );
                }

                setTimeout(() => {
                    for (const user of options.users) {
                        const key = `${eventId}.${user}`;
                        if (this.__$promises[key]) {
                            this.__$promises[key].reject({ user: game.users.get(user), response: "timeout" });
                            delete this.__$promises[key];
                        }
                    }
                }, options.timeout || 30000);
            }

            data.__$socketOptions = options;
            this.__$socket.emit(`module.${MODULE_ID}`, data);

            const results = [];

            if (local) {
                const localWrapper = async () => {
                    return { user: game.user, response: await callback(data) };
                };
                promises.push(localWrapper());
            }

            const allPromises = await Promise.all(promises);
            for (const promise of allPromises) {
                results.push(promise);
            }

            return results;
        };

        this[eventName] = wrappedCallback.bind(this);
    }

    static registerStore(storeName, initialValue = {}, callback = null) {
        if (this.__$reserved.includes(storeName)) {
            throw new Error(`Store name ${storeName} is reserved`);
        }

        if (typeof initialValue !== "object") {
            throw new Error("Initial value for store must be an object");
        }

        this.__$stores[storeName] = new SynchronizedStore(storeName, initialValue, callback);

        Object.defineProperty(this, storeName, {
            get: () => {
                return this.__$stores[storeName].getData();
            },
            set: (value) => {
                this.__$stores[storeName].setData(value);
            },
        });

        return this.__$stores[storeName];
    }
}

class SynchronizedStore {
    constructor(storeName, initialValue, callback) {
        this._storeName = storeName;

        this._onChange = callback;

        this._data = initialValue;

        this._timestamp = Date.now();

        this._isLive = false;

        //request value from other users
        game.socket.emit(`module.${MODULE_ID}`, { __$socketOptions: { __$storeName: this._storeName, __$request: true, user: game.user.id } });
    }

    synchronize(data) {
        this._data = data;
        this._timestamp = Date.now();
        this._isLive = true;
        this._onChange?.(this.data);
    }

    getData() {
        return this._data;
    }

    setData(value) {
        this.synchronize(value);
        game.socket.emit(`module.${MODULE_ID}`, { __$socketOptions: { __$storeName: this._storeName, user: game.user.id }, data: value });
    }
}
