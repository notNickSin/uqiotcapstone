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
exports.SchemaEndpoint = exports.SchemaPageType = void 0;
const endpoint_1 = require("../endpoint");
const endpoint_client_1 = require("../endpoint-client");
const types_1 = require("../types");
var SchemaPageType;
(function (SchemaPageType) {
    SchemaPageType["requiresLogin"] = "requiresLogin";
    SchemaPageType["loggedIn"] = "loggedIn";
})(SchemaPageType = exports.SchemaPageType || (exports.SchemaPageType = {}));
class SchemaEndpoint extends endpoint_1.Endpoint {
    constructor(config) {
        super(new endpoint_client_1.EndpointClient('schema', config));
    }
    /**
     * Returns a list of all ST Schema C2C connectors belonging to the principal (i.e. the user)
     */
    list() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.client.get('apps');
            return response.endpointApps;
        });
    }
    /**
     * Returns a specific ST Schema connector
     * @param id the "endpointApp" UUID of the connector, e.g. "viper_799ff3a0-8249-11e9-9bf1-b5c7d651c2c3"
     */
    get(id) {
        return this.client.get(`apps/${id}`);
    }
    /**
     * Create an ST Schema connector
     * @param data definition of the connector
     */
    create(data) {
        return this.client.post('apps', data);
    }
    /**
     * Update an ST Schema connector
     * @param id the "endpointApp" UUID of the connector, e.g. "viper_799ff3a0-8249-11e9-9bf1-b5c7d651c2c3"
     * @param data new definition of the connector
     */
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.put(`apps/${id}`, data);
            return types_1.SuccessStatusValue;
        });
    }
    /**
     * Re-generate the OAuth clientId and clientSecret for an ST Schema connector. The old clientId and clientSecret
     * will no longer be valid after this operation.
     * @param id the "endpointApp" UUID of the connector, e.g. "viper_799ff3a0-8249-11e9-9bf1-b5c7d651c2c3"
     */
    regenerateOauth(id) {
        return this.client.post('oauth/stclient/credentials', { endpointAppId: id });
    }
    /**
     * Delete an ST Schema connector
     * @param id the "endpointApp" UUID of the connector, e.g. "viper_799ff3a0-8249-11e9-9bf1-b5c7d651c2c3"
     */
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.delete(`apps/${id}`);
            return types_1.SuccessStatusValue;
        });
    }
    /**
     * Get the page definition of an ST Schema installed instance in the specified location.
     * @param id the "endpointApp" UUID of the connector, e.g. "viper_799ff3a0-8249-11e9-9bf1-b5c7d651c2c3"
     * @param locationId UUID of the location in which the connector is or is to be installed.
     */
    getPage(id, locationId) {
        return this.client.get(`install/${id}?locationId=${locationId}&type=oauthLink`);
    }
    /**
     * Returns a list of the installed ST Schema connector instances in the specified location
     * @param locationId UUID of the location
     */
    installedApps(locationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.client.get(`installedapps/location/${this.locationId(locationId)}`);
            return response === undefined ? [] : response.installedSmartApps;
        });
    }
    /**
     * Returns a specific installed instance of an ST Schema connector. The returned object includes a list of the
     * devices created by the instance.
     * @param id UUID of the installed app instance
     */
    getInstalledApp(id) {
        return this.client.get(`installedapps/${id}`);
    }
    /**
     * Deletes a specific installed instance of an ST Schema connector. This operation will also delete all
     * devices created by this instance
     * @param id
     */
    deleteInstalledApp(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.delete(`installedapps/${id}`);
            return types_1.SuccessStatusValue;
        });
    }
}
exports.SchemaEndpoint = SchemaEndpoint;
