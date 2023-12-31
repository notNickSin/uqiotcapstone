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
exports.RulesEndpoint = void 0;
const endpoint_1 = require("../endpoint");
const endpoint_client_1 = require("../endpoint-client");
class RulesEndpoint extends endpoint_1.Endpoint {
    constructor(config) {
        super(new endpoint_client_1.EndpointClient('rules', config));
    }
    /**
     * List the rules for a location and the access token principal. The principal is the user in the case of a
     * PAT (personal access) token or the installed app in the case of a SmartApp token. The rules belonging to one
     * principal cannot see the rules belonging to another principal.
     * @param locationId UUID of the location, If the client is configured with a location ID this parameter
     * can be omitted
     */
    list(locationId) {
        return this.client.getPagedItems(undefined, { locationId: this.locationId(locationId) });
    }
    /**
     * Get a specific rule
     * @param id UUID of the rule
     * @param locationId UUID of the location, If the client is configured with a location ID this parameter
     * can be omitted
     */
    get(id, locationId) {
        return this.client.get(id, { locationId: this.locationId(locationId) });
    }
    /**
     * Delete a specific rule
     * @param id UUID of the rule
     * @param locationId UUID of the location, If the client is configured with a location ID this parameter
     * can be omitted
     */
    delete(id, locationId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.client.delete(id, { locationId: this.locationId(locationId) });
        });
    }
    /**
     * Create a rule
     * @param data the rule definition
     * @param locationId UUID of the location, If the client is configured with a location ID this parameter
     * can be omitted
     */
    create(data, locationId) {
        return this.client.post(undefined, data, { locationId: this.locationId(locationId) });
    }
    /**
     * Update a rule
     * @param id UUID of the rule
     * @param data the new rule definition
     * @param locationId UUID of the location, If the client is configured with a location ID this parameter
     * can be omitted
     */
    update(id, data, locationId) {
        return this.client.put(id, data, { locationId: this.locationId(locationId) });
    }
    /**
     * Execute a rule's actions
     * @param id UUID of the rule
     * @param locationId UUID of the location, If the client is configured with a location ID this parameter
     * can be omitted
     */
    execute(id, locationId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.client.post(`execute/${id}`, undefined, { locationId: this.locationId(locationId) });
        });
    }
}
exports.RulesEndpoint = RulesEndpoint;
