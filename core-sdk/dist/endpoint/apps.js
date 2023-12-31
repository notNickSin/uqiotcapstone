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
exports.AppsEndpoint = exports.SignatureType = exports.AppTargetStatus = exports.AppClassification = exports.AppType = void 0;
const endpoint_client_1 = require("../endpoint-client");
const endpoint_1 = require("../endpoint");
var AppType;
(function (AppType) {
    AppType["LAMBDA_SMART_APP"] = "LAMBDA_SMART_APP";
    AppType["WEBHOOK_SMART_APP"] = "WEBHOOK_SMART_APP";
    AppType["API_ONLY"] = "API_ONLY";
})(AppType = exports.AppType || (exports.AppType = {}));
var AppClassification;
(function (AppClassification) {
    AppClassification["AUTOMATION"] = "AUTOMATION";
    AppClassification["SERVICE"] = "SERVICE";
    AppClassification["DEVICE"] = "DEVICE";
    AppClassification["CONNECTED_SERVICE"] = "CONNECTED_SERVICE";
})(AppClassification = exports.AppClassification || (exports.AppClassification = {}));
var AppTargetStatus;
(function (AppTargetStatus) {
    AppTargetStatus["PENDING"] = "PENDING";
    AppTargetStatus["CONFIRMED"] = "CONFIRMED";
})(AppTargetStatus = exports.AppTargetStatus || (exports.AppTargetStatus = {}));
var SignatureType;
(function (SignatureType) {
    SignatureType["APP_RSA"] = "APP_RSA";
    SignatureType["ST_PADLOCK"] = "ST_PADLOCK";
})(SignatureType = exports.SignatureType || (exports.SignatureType = {}));
class AppsEndpoint extends endpoint_1.Endpoint {
    constructor(config) {
        super(new endpoint_client_1.EndpointClient('apps', config));
    }
    /**
     * Returns a list of all apps belonging to the principal (i.e. the user)
     */
    list(options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {};
            if ('appType' in options && options.appType) {
                params.appType = options.appType;
            }
            if ('classification' in options && options.classification) {
                params.classification = options.classification;
            }
            if ('tag' in options && options.tag) {
                for (const key of Object.keys(options.tag)) {
                    params[`tag:${key}`] = options.tag[key];
                }
            }
            return this.client.getPagedItems(undefined, params);
        });
    }
    /**
     * Returns a specific app
     * @param id either the appId UUID or the appName unique name
     */
    get(id) {
        return this.client.get(id);
    }
    /**
     * Create a new app. For WEBHOOK_SMART_APPs the default SignatureType is ST_PADLOCK.
     * @param data the app definition
     */
    create(data) {
        // TODO -- use of query params might be temporary
        const params = {};
        if (data.webhookSmartApp) {
            params.requireConfirmation = 'true';
            params.signatureType = data.webhookSmartApp.signatureType || 'ST_PADLOCK';
        }
        return this.client.post(undefined, data, params);
    }
    /**
     * Update an existing app
     * @param id either the appId UUID or the appName unique name
     * @param data the new app definition
     */
    update(id, data) {
        return this.client.put(id, data);
    }
    /**
     * Get the settings of an app. Settings are string name/value pairs for optional use by the app developer.
     * @param id either the appId UUID or the appName unique name
     */
    getSettings(id) {
        return this.client.get(`${id}/settings`);
    }
    /**
     * Update the settings of an app. Settings are string name/value pairs for optional use by the app developer.
     * @param id either the appId UUID or the appName unique name
     * @param data the new app settings
     */
    updateSettings(id, data) {
        return this.client.put(`${id}/settings`, data);
    }
    /**
     * Update the signature type of an app. The signature type determines what mechanism is used to verify
     * the identity of endpoint apps
     * @param id either the appId UUID or the appName unique name
     * @param signatureType the new signature type
     */
    updateSignatureType(id, signatureType) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.put(`${id}/signature-type`, { signatureType });
            return Promise.resolve();
        });
    }
    /**
     * Pings the targetUrl of the app to verify its existence. Endpoint apps and API Access apps must be registed
     * in order to receive events from SmartThings.
     * @param id either the appId UUID or the appName unique name
     */
    register(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.put(`${id}/register`);
            return Promise.resolve();
        });
    }
    /**
     * Returns the OAuth information for this app, including the name, scopes, and redirect URLs, if any
     * @param id either the appId UUID or the appName unique name
     */
    getOauth(id) {
        return this.client.get(`${id}/oauth`);
    }
    /**
     * Updates the OAuth defintion for this app. Use this method to change the scopes or redirect
     * URLs (for API access apps). This method does not change the clientId or clientSecret of the app.
     * @param id either the appId UUID or the appName unique name
     * @param data new OAuth definition
     */
    updateOauth(id, data) {
        return this.client.put(`${id}/oauth`, data);
    }
    /**
     * Regenerate clientId and clientSecret for this app. Note that this operation will result in any currently
     * authorized installed app instances to need to be re-authorized to make calls to SmartThings.
     * @param id either the appId UUID or the appName unique name
     * @param data new OAuth definition
     */
    regenerateOauth(id, data) {
        return this.client.post(`${id}/oauth/generate`, data);
    }
    /**
     * Deletes the specified app
     * @param id either the appId UUID or the appName unique name
     */
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.delete(id);
            return Promise.resolve();
        });
    }
}
exports.AppsEndpoint = AppsEndpoint;
