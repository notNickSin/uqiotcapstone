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
exports.ServicesEndpoint = exports.ServiceSubscriptionType = exports.ServiceCapabilitiesEnum = void 0;
const endpoint_1 = require("../endpoint");
const endpoint_client_1 = require("../endpoint-client");
const types_1 = require("../types");
var ServiceCapabilitiesEnum;
(function (ServiceCapabilitiesEnum) {
    ServiceCapabilitiesEnum["weather"] = "weather";
    ServiceCapabilitiesEnum["airQuality"] = "airQuality";
    ServiceCapabilitiesEnum["forecast"] = "forecast";
    ServiceCapabilitiesEnum["airQualityForecast"] = "airQualityForecast";
})(ServiceCapabilitiesEnum = exports.ServiceCapabilitiesEnum || (exports.ServiceCapabilitiesEnum = {}));
var ServiceSubscriptionType;
(function (ServiceSubscriptionType) {
    ServiceSubscriptionType["DIRECT"] = "DIRECT";
    ServiceSubscriptionType["EXECUTION"] = "EXECUTION";
})(ServiceSubscriptionType = exports.ServiceSubscriptionType || (exports.ServiceSubscriptionType = {}));
/* Example:
    {
        "locationId": "8d17bc64-1a98-4cf5-9428-4408783a2121",
        "airQuality": {...},
        "forecast": {...},
        "weather": {...}
    }
 */
class ServicesEndpoint extends endpoint_1.Endpoint {
    constructor(config) {
        super(new endpoint_client_1.EndpointClient('services/coordinate/locations', config));
    }
    /**
     * Returns the location's city, latitude, longitude, and list of location services subscriptions, if any
     * @param locationId UUID of the location. If the client is configured with a location ID this parameter
     * can be omitted
     */
    getLocationServiceInfo(locationId) {
        return this.client.get(`${this.locationId(locationId)}`);
    }
    /**
     * Returns the list of location service capability names available for this location. Currently airQuality,
     * forecast, and weather, for locations have have geo-coordinates set
     * @param locationId UUID of the location. If the client is configured with a location ID this parameter
     * can be omitted
     */
    getServiceCapabilities(locationId) {
        return this.client.get(`${this.locationId(locationId)}/capabilities`)
            .then(response => {
            return response.name;
        });
    }
    /**
     * Subscribe to changes in any location service capability value
     * @param params the subscription definition
     * @param installedAppId UUID of the installed app instance. If the client is configured with an installedAppId this
     * parameter can be omitted
     * @param locationId UUID of the location. If the client is configured with a location ID this parameter
     * can be omitted
     */
    createSubscription(params, installedAppId, locationId) {
        const data = Object.assign({ type: ServiceSubscriptionType.DIRECT, isaId: this.installedAppId(installedAppId) }, params);
        return this.client.post(`${this.locationId(locationId)}/subscriptions`, data);
    }
    /**
     * Update a location service subscription.
     * @param id UUID of the subscription
     * @param params the subscription definition
     * @param installedAppId UUID of the installed app instance. If the client is configured with an installedAppId this
     * parameter can be omitted
     * @param locationId UUID of the location. If the client is configured with a location ID this parameter
     * can be omitted
     */
    updateSubscription(id, params, installedAppId, locationId) {
        const data = Object.assign({ type: ServiceSubscriptionType.DIRECT, isaId: this.installedAppId(installedAppId) }, params);
        return this.client.put(`${this.locationId(locationId)}/subscriptions/${id}`, data);
    }
    deleteSubscription(id, installedAppId, locationId) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO - remove when API returns 200 on delete when there are no subscriptions
            try {
                yield this.client.delete(`${this.locationId(locationId)}/subscriptions/${id}`, { isaId: this.installedAppId(installedAppId) });
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            }
            catch (error) {
                if (!(error.response.status === 400 &&
                    error.response.data.error &&
                    error.response.data.error.message === 'Installed App ID is not found')) {
                    throw error;
                }
            }
            return types_1.SuccessStatusValue;
        });
    }
    deleteSubscriptions(installedAppId, locationId) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO - remove when API returns 200 on delete when there are no subscriptions
            try {
                yield this.client.delete(`${this.locationId(locationId)}/subscriptions`, { isaId: this.installedAppId(installedAppId) });
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            }
            catch (error) {
                if (!(error.response.status === 400 &&
                    error.response.data.error &&
                    error.response.data.error.message === 'Installed App ID is not found')) {
                    throw error;
                }
            }
            return types_1.SuccessStatusValue;
        });
    }
    /**
     *
     * @param capability Comma separated string of capabilities (weather, airQuality, forecast, airQualityForcast).
     * For example, \&quot;weather,airQuality\&quot;
     * @param locationId
     */
    getCapability(capability, locationId) {
        return this.client.get(`${this.locationId(locationId)}/capabilities`, { name: capability });
    }
    /**
     *
     * @param capabilities Comma separated string of capabilities (weather, airQuality, forecast, airQualityForcast).
     * For example, \&quot;weather,airQuality\&quot;
     * @param locationId
     */
    getCapabilities(capabilities, locationId) {
        const capabilityList = capabilities.join(',');
        return this.client.get(`${this.locationId(locationId)}/capabilities`, { name: capabilityList });
    }
}
exports.ServicesEndpoint = ServicesEndpoint;
