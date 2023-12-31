"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstalledAppsEndpoint = exports.InstalledAppMessageType = exports.DashboardLifecycleEventType = exports.InstalledAppClassification = exports.InstalledAppStatus = exports.InstallConfigurationStatus = exports.InstalledAppType = exports.ConfigValueType = void 0;
const endpoint_1 = require("../endpoint");
const endpoint_client_1 = require("../endpoint-client");
const types_1 = require("../types");
var ConfigValueType;
(function (ConfigValueType) {
    ConfigValueType["STRING"] = "STRING";
    ConfigValueType["DEVICE"] = "DEVICE";
    ConfigValueType["PERMISSION"] = "PERMISSION";
    ConfigValueType["MODE"] = "MODE";
    ConfigValueType["SCENE"] = "SCENE";
    ConfigValueType["MESSAGE"] = "MESSAGE";
})(ConfigValueType = exports.ConfigValueType || (exports.ConfigValueType = {}));
var InstalledAppType;
(function (InstalledAppType) {
    InstalledAppType["LAMBDA_SMART_APP"] = "LAMBDA_SMART_APP";
    InstalledAppType["WEBHOOK_SMART_APP"] = "WEBHOOK_SMART_APP";
    InstalledAppType["API_ONLY"] = "API_ONLY";
    InstalledAppType["BEHAVIOR"] = "BEHAVIOR";
})(InstalledAppType = exports.InstalledAppType || (exports.InstalledAppType = {}));
var InstallConfigurationStatus;
(function (InstallConfigurationStatus) {
    InstallConfigurationStatus["STAGED"] = "STAGED";
    InstallConfigurationStatus["DONE"] = "DONE";
    InstallConfigurationStatus["AUTHORIZED"] = "AUTHORIZED";
    InstallConfigurationStatus["REVOKED"] = "REVOKED";
})(InstallConfigurationStatus = exports.InstallConfigurationStatus || (exports.InstallConfigurationStatus = {}));
var InstalledAppStatus;
(function (InstalledAppStatus) {
    InstalledAppStatus["PENDING"] = "PENDING";
    InstalledAppStatus["AUTHORIZED"] = "AUTHORIZED";
    InstalledAppStatus["REVOKED"] = "REVOKED";
    InstalledAppStatus["DISABLED"] = "DISABLED";
})(InstalledAppStatus = exports.InstalledAppStatus || (exports.InstalledAppStatus = {}));
var InstalledAppClassification;
(function (InstalledAppClassification) {
    InstalledAppClassification["AUTOMATION"] = "AUTOMATION";
    InstalledAppClassification["SERVICE"] = "SERVICE";
    InstalledAppClassification["DEVICE"] = "DEVICE";
    InstalledAppClassification["CONNECTED_SERVICE"] = "CONNECTED_SERVICE";
    InstalledAppClassification["HIDDEN"] = "HIDDEN";
})(InstalledAppClassification = exports.InstalledAppClassification || (exports.InstalledAppClassification = {}));
var DashboardLifecycleEventType;
(function (DashboardLifecycleEventType) {
    DashboardLifecycleEventType["CREATE"] = "CREATE";
    DashboardLifecycleEventType["UPDATE"] = "UPDATE";
    DashboardLifecycleEventType["DELETE"] = "DELETE";
})(DashboardLifecycleEventType = exports.DashboardLifecycleEventType || (exports.DashboardLifecycleEventType = {}));
var InstalledAppMessageType;
(function (InstalledAppMessageType) {
    InstalledAppMessageType["PREDEFINED"] = "PREDEFINED";
    InstalledAppMessageType["ADHOC"] = "ADHOC";
})(InstalledAppMessageType = exports.InstalledAppMessageType || (exports.InstalledAppMessageType = {}));
class InstalledAppsEndpoint extends endpoint_1.Endpoint {
    constructor(config) {
        super(new endpoint_client_1.EndpointClient('installedapps', config));
    }
    /**
     * Returns a list of installed app instances matching the query options or all instances accessible by the principal
     * (i.e. user) if no options are specified.
     *
     * @param options query options, locationId, installedAppStatus, installedAppType, deviceId. These can
     * be single values or arrays.
     */
    list(options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {};
            if ('locationId' in options && options.locationId) {
                params.locationId = options.locationId;
            }
            else if (this.client.config.locationId) {
                params.locationId = this.client.config.locationId;
            }
            if ('installedAppStatus' in options && options.installedAppStatus) {
                params.installedAppStatus = options.installedAppStatus;
            }
            if ('installedAppType' in options && options.installedAppType) {
                params.installedAppType = options.installedAppType;
            }
            if ('deviceId' in options && options.deviceId) {
                params.deviceId = options.deviceId;
            }
            if ('appId' in options && options.appId) {
                params.appId = options.appId;
            }
            if ('modeId' in options && options.modeId) {
                params.modeId = options.modeId;
            }
            if ('max' in options && options.max) {
                params.max = options.max;
            }
            if ('page' in options && options.page) {
                params.page = options.page;
            }
            return this.client.getPagedItems(undefined, params);
        });
    }
    /**
     * Returns the specified installed app definition
     * @param id UUID of the installed app
     */
    get(id) {
        return this.client.get(this.installedAppId(this.installedAppId(id)));
    }
    /**
     * Returns the token info for an installed app principal
     */
    tokenInfo() {
        return this.client.get('me');
    }
    /**
     * Creates an installed app instance
     * @param data configuration data for the app instance
     */
    create(data) {
        return this.client.post(undefined, data);
    }
    /**
     * Updates the display name of an installled app instance
     * @param id UUID of the installed app
     * @param data request containing the display name
     */
    update(id, data) {
        return this.client.put(id, data);
    }
    /**
     * List configurations of an installed app instance
     * @param id UUID of the installed app
     * @param options including the desired configuration status
     */
    listConfigurations(id, options = {}) {
        const params = {};
        if ('configurationStatus' in options && options.configurationStatus) {
            params.configurationStatus = options.configurationStatus;
        }
        if ('max' in options && options.max) {
            params.max = options.max;
        }
        if ('page' in options && options.page) {
            params.page = options.page;
        }
        return this.client.getPagedItems(`${id}/configs`, params);
    }
    /**
     * Returns a specific installed app configuration
     * @param id UUID of the installed app
     * @param configurationId UUID of the configuration
     */
    getConfiguration(id, configurationId) {
        return this.client.get(`${id}/configs/${configurationId}`);
    }
    /**
     * Returns the most recent configuration, authorized or not
     * @param id The installedAppId
     */
    getLatestConfiguration(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const items = (yield this.listConfigurations(id)).sort((a, b) => {
                return a.lastUpdatedDate === b.lastUpdatedDate ? 0 : a.lastUpdatedDate < b.lastUpdatedDate ? 1 : -1;
            });
            if (items.length > 0) {
                const item = items[0];
                return this.getConfiguration(item.installedAppId, item.configurationId);
            }
            return undefined;
        });
    }
    /**
     * Returns the current authorized configuration, or undefined if there is no authorized configuration
     * @param id UUID of the installed app
     */
    getAuthorizedConfiguration(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const items = yield this.listConfigurations(id, { configurationStatus: InstallConfigurationStatus.AUTHORIZED });
            if (items.length > 0) {
                const item = items[0];
                return this.getConfiguration(item.installedAppId, item.configurationId);
            }
            return undefined;
        });
    }
    /**
     * Returns the current authorized configuration, or the latest configuration of any status if none are authorized
     * @param id UUID of the installed app
     */
    getCurrentConfiguration(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let item = yield this.getAuthorizedConfiguration(id);
            if (!item) {
                item = yield this.getLatestConfiguration(id);
            }
            return item;
        });
    }
    /**
     * Updates an Installed App configuration. Call implicitly operates on the latest 'STAGED' configuration.
     * @param id UUID of the installed app
     * @param data the new configuration
     */
    updateConfiguration(id, data) {
        return this.client.put(`${id}/configs`, data);
    }
    /**
     * Allows specific configuration keys to be removed / upserted from any configuration that may already exist.
     * This operation is only supported on install configurations in status of 'STAGED'. Useful for iteratively
     * configuring an installed app.
     * @param id UUID of the installed app
     * @param configurationId UUID of the configuration
     * @param data requests containing upserts and removals of configuration items
     */
    patchConfiguration(id, configurationId, data) {
        return this.client.put(`${id}/configs/${configurationId}`, data);
    }
    /**
     * Deletes an installed app instance. If the client is configured with an installedApp ID this value can be
     * omitted.
     * @param id UUID of the installed app
     */
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.delete(this.installedAppId(id));
            return types_1.SuccessStatusValue;
        });
    }
    /**
     * Create events for an installed app. Note that this method is here in support of future functionality not yet
     * available in the SmartThings platform.
     * @param data object contain lists of events
     * @param id UUID of the installed app. This value does not need to be specified if the client is configured with
     * an installed app ID
     */
    createEvent(data, id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.post(`${this.installedAppId(id)}/events`, data);
            return types_1.SuccessStatusValue;
        });
    }
    /**
     * Send a message to a message group. Note that this method is here in support of future functionality not yet
     * available in the SmartThings platform.
     * @param data the message
     * @param id UUID of the installed app. This value does not need to be specified if the client is configured with
     * an installed app ID
     */
    sendMessage(data, id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.post(`${this.installedAppId(id)}/send-message`, data);
            return types_1.SuccessStatusValue;
        });
    }
}
exports.InstalledAppsEndpoint = InstalledAppsEndpoint;
