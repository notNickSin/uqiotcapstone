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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmartThingsOAuthClient = exports.SmartThingsClient = void 0;
const axios_1 = __importDefault(require("axios"));
const rest_client_1 = require("./rest-client");
const apps_1 = require("./endpoint/apps");
const capabilities_1 = require("./endpoint/capabilities");
const devicepreferences_1 = require("./endpoint/devicepreferences");
const deviceprofiles_1 = require("./endpoint/deviceprofiles");
const channels_1 = require("./endpoint/channels");
const devices_1 = require("./endpoint/devices");
const drivers_1 = require("./endpoint/drivers");
const history_1 = require("./endpoint/history");
const hubdevices_1 = require("./endpoint/hubdevices");
const installedapps_1 = require("./endpoint/installedapps");
const invites_schemaApp_1 = require("./endpoint/invites-schemaApp");
const modes_1 = require("./endpoint/modes");
const locations_1 = require("./endpoint/locations");
const notifications_1 = require("./endpoint/notifications");
const organizations_1 = require("./endpoint/organizations");
const presentation_1 = require("./endpoint/presentation");
const rooms_1 = require("./endpoint/rooms");
const rules_1 = require("./endpoint/rules");
const scenes_1 = require("./endpoint/scenes");
const subscriptions_1 = require("./endpoint/subscriptions");
const schedules_1 = require("./endpoint/schedules");
const schema_1 = require("./endpoint/schema");
const services_1 = require("./endpoint/services");
const virtualdevices_1 = require("./endpoint/virtualdevices");
const endpoint_client_1 = require("./endpoint-client");
class SmartThingsClient extends rest_client_1.RESTClient {
    constructor(authenticator, config) {
        super(authenticator, config);
        this.apps = new apps_1.AppsEndpoint(this.config);
        this.capabilities = new capabilities_1.CapabilitiesEndpoint(this.config);
        this.channels = new channels_1.ChannelsEndpoint(this.config);
        this.devicePreferences = new devicepreferences_1.DevicePreferencesEndpoint(this.config);
        this.deviceProfiles = new deviceprofiles_1.DeviceProfilesEndpoint(this.config);
        this.devices = new devices_1.DevicesEndpoint(this.config);
        this.drivers = new drivers_1.DriversEndpoint(this.config);
        this.history = new history_1.HistoryEndpoint(this.config);
        this.hubdevices = new hubdevices_1.HubdevicesEndpoint(this.config);
        this.installedApps = new installedapps_1.InstalledAppsEndpoint(this.config);
        this.invitesSchema = new invites_schemaApp_1.InvitesSchemaAppEndpoint(this.config);
        this.locations = new locations_1.LocationsEndpoint(this.config);
        this.modes = new modes_1.ModesEndpoint(this.config);
        this.notifications = new notifications_1.NotificationsEndpoint(this.config);
        this.organizations = new organizations_1.OrganizationsEndpoint(this.config);
        this.presentation = new presentation_1.PresentationEndpoint(this.config);
        this.rooms = new rooms_1.RoomsEndpoint(this.config);
        this.rules = new rules_1.RulesEndpoint(this.config);
        this.scenes = new scenes_1.ScenesEndpoint(this.config);
        this.subscriptions = new subscriptions_1.SubscriptionsEndpoint(this.config);
        this.schedules = new schedules_1.SchedulesEndpoint(this.config);
        this.schema = new schema_1.SchemaEndpoint(this.config);
        this.services = new services_1.ServicesEndpoint(this.config);
        this.virtualDevices = new virtualdevices_1.VirtualDevicesEndpoint(this.config);
    }
    setLocation(id) {
        this.config.locationId = id;
        return this;
    }
    /**
     * @param headers http headers to be merged with existing client headers
     */
    clone(headers) {
        const config = Object.assign(Object.assign({}, this.config), { headers: Object.assign(Object.assign({}, this.config.headers), headers) });
        return new SmartThingsClient(this.config.authenticator, config);
    }
}
exports.SmartThingsClient = SmartThingsClient;
class SmartThingsOAuthClient {
    constructor(clientId, clientSecret, redirectUri, urlProvider) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.redirectUri = redirectUri;
        this.authURL = (urlProvider === null || urlProvider === void 0 ? void 0 : urlProvider.authURL) || endpoint_client_1.defaultSmartThingsURLProvider.authURL;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    redeemCode(authCode) {
        return __awaiter(this, void 0, void 0, function* () {
            const headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${Buffer.from(this.clientId + ':' + this.clientSecret).toString('base64')}`,
                'Accept': 'application/json',
            };
            const axiosConfig = {
                url: this.authURL,
                method: 'POST',
                headers,
                data: `grant_type=authorization_code&code=${authCode}&client_id=${this.clientId}&redirect_uri=${this.redirectUri}`,
            };
            const response = yield axios_1.default.request(axiosConfig);
            if (response.status > 199 && response.status < 300) {
                return response.data;
            }
            throw Error(`error ${response.status} with message ${response.data}`);
        });
    }
}
exports.SmartThingsOAuthClient = SmartThingsOAuthClient;
