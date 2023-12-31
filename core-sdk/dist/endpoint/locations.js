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
exports.LocationsEndpoint = void 0;
const endpoint_1 = require("../endpoint");
const endpoint_client_1 = require("../endpoint-client");
const types_1 = require("../types");
class LocationsEndpoint extends endpoint_1.Endpoint {
    constructor(config) {
        super(new endpoint_client_1.EndpointClient('locations', config));
    }
    /**
     * List all Locations currently available in a user account.
     */
    list() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.client.getPagedItems();
        });
    }
    /**
     * Get a specific Location from a user's account.
     * @param id UUID of the location
     * @param options optional query parameters passed wth request
     */
    get(id, options = { allowed: false }) {
        const params = { allowed: options.allowed.toString() };
        return this.client.get(this.locationId(id), params);
    }
    /**
     * Create a Location for a user.
     * The Location will be created geographically close to the country code provided in the request body.
     * If Location creation is not supported in the requested country code, the API will return a 422 error
     * response with an error code of UnsupportedGeoRegionError.
     *
     * @param location definition of the location
     */
    create(location) {
        return this.client.post(undefined, location);
    }
    /**
     * Update one or more fields of a specified Location.
     * @param id UUID of the location
     * @param location new location definition
     */
    update(id, location) {
        return this.client.put(id, location);
    }
    /**
     * Delete a Location from a user's account.
     * @param id UUID of the location
     */
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.delete(id);
            return types_1.SuccessStatusValue;
        });
    }
}
exports.LocationsEndpoint = LocationsEndpoint;
