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
exports.DevicesEndpoint = exports.DeviceHealthState = exports.DeviceIntegrationType = exports.DeviceNetworkSecurityLevel = void 0;
const endpoint_1 = require("../endpoint");
const endpoint_client_1 = require("../endpoint-client");
const types_1 = require("../types");
const HEADER_OVERRIDES = { Accept: 'application/vnd.smartthings+json;v=20170916' };
var DeviceNetworkSecurityLevel;
(function (DeviceNetworkSecurityLevel) {
    DeviceNetworkSecurityLevel["UNKNOWN"] = "UNKNOWN";
    DeviceNetworkSecurityLevel["ZWAVE_LEGACY_NON_SECURE"] = "ZWAVE_LEGACY_NON_SECURE";
    DeviceNetworkSecurityLevel["ZWAVE_S0_LEGACY"] = "ZWAVE_S0_LEGACY";
    DeviceNetworkSecurityLevel["ZWAVE_S0_FALLBACK"] = "ZWAVE_S0_FALLBACK";
    DeviceNetworkSecurityLevel["ZWAVE_S2_UNAUTHENTICATED"] = "ZWAVE_S2_UNAUTHENTICATED";
    DeviceNetworkSecurityLevel["ZWAVE_S2_AUTHENTICATED"] = "ZWAVE_S2_AUTHENTICATED";
    DeviceNetworkSecurityLevel["ZWAVE_S2_ACCESS_CONTROL"] = "ZWAVE_S2_ACCESS_CONTROL";
    DeviceNetworkSecurityLevel["ZWAVE_S2_FAILED"] = "ZWAVE_S2_FAILED";
    DeviceNetworkSecurityLevel["ZWAVE_S0_FAILED"] = "ZWAVE_S0_FAILED";
    DeviceNetworkSecurityLevel["ZWAVE_S2_DOWNGRADE"] = "ZWAVE_S2_DOWNGRADE";
    DeviceNetworkSecurityLevel["ZWAVE_S0_DOWNGRADE"] = "ZWAVE_S0_DOWNGRADE";
})(DeviceNetworkSecurityLevel = exports.DeviceNetworkSecurityLevel || (exports.DeviceNetworkSecurityLevel = {}));
var DeviceIntegrationType;
(function (DeviceIntegrationType) {
    DeviceIntegrationType["BLE"] = "BLE";
    DeviceIntegrationType["BLE_D2D"] = "BLE_D2D";
    DeviceIntegrationType["DTH"] = "DTH";
    DeviceIntegrationType["ENDPOINT_APP"] = "ENDPOINT_APP";
    DeviceIntegrationType["GROUP"] = "GROUP";
    DeviceIntegrationType["HUB"] = "HUB";
    DeviceIntegrationType["IR"] = "IR";
    DeviceIntegrationType["IR_OCF"] = "IR_OCF";
    DeviceIntegrationType["LAN"] = "LAN";
    DeviceIntegrationType["MATTER"] = "MATTER";
    DeviceIntegrationType["MOBILE"] = "MOBILE";
    DeviceIntegrationType["MQTT"] = "MQTT";
    DeviceIntegrationType["OCF"] = "OCF";
    DeviceIntegrationType["PENGYOU"] = "PENGYOU";
    DeviceIntegrationType["SHP"] = "SHP";
    DeviceIntegrationType["VIDEO"] = "VIDEO";
    DeviceIntegrationType["VIPER"] = "VIPER";
    DeviceIntegrationType["VIRTUAL"] = "VIRTUAL";
    DeviceIntegrationType["WATCH"] = "WATCH";
    DeviceIntegrationType["ZIGBEE"] = "ZIGBEE";
    DeviceIntegrationType["ZWAVE"] = "ZWAVE";
    DeviceIntegrationType["EDGE_CHILD"] = "EDGE_CHILD";
})(DeviceIntegrationType = exports.DeviceIntegrationType || (exports.DeviceIntegrationType = {}));
var DeviceHealthState;
(function (DeviceHealthState) {
    DeviceHealthState["ONLINE"] = "ONLINE";
    DeviceHealthState["OFFLINE"] = "OFFLINE";
    DeviceHealthState["UNKNOWN"] = "UNKNOWN";
})(DeviceHealthState = exports.DeviceHealthState || (exports.DeviceHealthState = {}));
class DevicesEndpoint extends endpoint_1.Endpoint {
    constructor(config) {
        super(new endpoint_client_1.EndpointClient('devices', config));
    }
    /**
     * Returns a list of devices matching the query options or all devices accessible by the principal (i.e. user)
     * if no options are specified. If the includeHealth option is set to true then the response will also contain
     * the health status of each device (i.e. if it is online or offline). If the includeStatus option is set to true
     * then the response will also include the status of all attributes (i.e. value and timestamp)
     *
     * @param options query options, capability, capabilitiesMode ('and' or 'or'), locationId, deviceId. which can
     * be single values or arrays, and includeHealth & includeStatus booleans
     */
    list(options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {};
            if ('capability' in options && options.capability) {
                params.capability = options.capability;
            }
            if ('locationId' in options && options.locationId) {
                params.locationId = options.locationId;
            }
            else if (this.client.config.locationId) {
                params.locationId = this.client.config.locationId;
            }
            if ('deviceId' in options && options.deviceId) {
                params.deviceId = options.deviceId;
            }
            if ('capabilitiesMode' in options && options.capabilitiesMode) {
                params.capabilitiesMode = options.capabilitiesMode;
            }
            if ('includeRestricted' in options && options.includeRestricted !== undefined) {
                params.includeRestricted = options.includeRestricted.toString();
            }
            if ('accessLevel' in options && options.accessLevel) {
                params.accessLevel = options.accessLevel;
            }
            if ('includeHealth' in options && options.includeHealth !== undefined) {
                params.includeHealth = options.includeHealth.toString();
            }
            if ('includeStatus' in options && options.includeStatus !== undefined) {
                params.includeStatus = options.includeStatus.toString();
            }
            if ('installedAppId' in options && options.installedAppId) {
                params.installedAppId = options.installedAppId;
            }
            if ('max' in options && options.max) {
                params.max = options.max;
            }
            if ('page' in options && options.page) {
                params.page = options.page;
            }
            if ('type' in options && options.type) {
                params.type = options.type;
            }
            return this.client.getPagedItems(undefined, params, { headerOverrides: HEADER_OVERRIDES });
        });
    }
    /**
     * Returns all devices in the location specified in the client configuration. Throws an error if no location is
     * specified in the client config. For use only in SmartApps.
     * @deprecated use list() instead
     */
    listInLocation() {
        if (this.client.config.locationId) {
            return this.list({ locationId: this.client.config.locationId });
        }
        return Promise.reject(Error('Location ID not defined'));
    }
    /**
     * Returns all devices accessible by the principal (i.e. user)
     * @deprecated use list() instead
     */
    listAll() {
        return this.list();
    }
    /**
     * Returns devices with the specified capability.
     * @deprecated use list({capability: 'switch'} instead
     */
    findByCapability(capability) {
        if (this.client.config.locationId) {
            return this.list({ locationId: this.locationId(), capability: capability });
        }
        return Promise.reject(Error('Location ID not defined'));
    }
    /**
     * Returns a description of the specified device
     * @param id UUID of the device
     * @param options optional includeHealth and includeStatus parameters.
     * If the includeHealth option is set to true then the response will also contain
     * the health status of each device (i.e. if it is online or offline). If the includeStatus option is set to true
     * then the response will also include the status of all attributes (i.e. value and timestamp)
     */
    get(id, options = {}) {
        const params = {};
        if ('includeHealth' in options && options.includeHealth !== undefined) {
            params.includeHealth = options.includeHealth.toString();
        }
        if ('includeStatus' in options && options.includeStatus !== undefined) {
            params.includeStatus = options.includeStatus.toString();
        }
        return this.client.get(id, params, { headerOverrides: HEADER_OVERRIDES });
    }
    /**
     * Deletes the specified device
     * @param id UUID of the device
     */
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.delete(id);
            return types_1.SuccessStatusValue;
        });
    }
    /**
     * Install a device.
     * @param definition the device definition. If the client configuration specifies a locationId and installedAppId
     * then these values don't need to be included in the definition.
     */
    create(definition) {
        return __awaiter(this, void 0, void 0, function* () {
            let data;
            if (definition.app) {
                data = {
                    label: definition.label,
                    roomId: definition.roomId,
                    locationId: this.locationId(definition.locationId),
                    app: Object.assign(Object.assign({}, definition.app), { installedAppId: this.installedAppId(definition.app.installedAppId) }),
                };
            }
            else if (definition.profileId) {
                data = {
                    label: definition.label,
                    roomId: definition.roomId,
                    locationId: this.locationId(definition.locationId),
                    app: {
                        installedAppId: this.installedAppId(definition.installedAppId),
                        profileId: definition.profileId,
                        externalId: definition.externalId,
                    },
                };
            }
            else {
                throw Error('Invalid device creation data');
            }
            return this.client.post('', data);
        });
    }
    /**
     * Update a device. Currently only the device label can be changed
     * @param id UUID of the device
     * @param data new device definition with the label specified
     */
    update(id, data) {
        return this.client.put(id, data);
    }
    /**
     * Update the deviceProfileId of a device. Note that currently this method can
     * only be called with an installedApp token with the i:deviceprofiles scope
     * on a device created by that app.
     * @param id UUID of the device
     * @param data the new device profile
     */
    updateProfile(id, data) {
        return this.client.put(`${id}/profile`, data, undefined, { headerOverrides: HEADER_OVERRIDES });
    }
    /**
     * Returns the current values of all device attributes
     * @param id UUID of the device
     */
    getStatus(id) {
        return this.client.get(`${id}/status`);
    }
    /**
     * Returns the current values of all device attributes
     * @deprecated use getStatus instead
     */
    getState(id) {
        return this.client.get(`${id}/status`);
    }
    /**
     * Gets the attribute values of the specified component of the device
     * @param id UUID of the device
     * @param componentId alphanumeric component ID, e.g. 'main'
     */
    getComponentStatus(id, componentId) {
        return this.client.get(`${id}/components/${componentId}/status`);
    }
    /**
     * Gets the attribute values of the specified component of the device
     * @deprecated use getComponentStatus instead
     */
    getComponentState(id, componentId) {
        return this.client.get(`${id}/components/${componentId}/status`);
    }
    /**
     * Gets the attribute values of the specified component capability
     * @param id UUID of the device
     * @param componentId alphanumeric component ID, e.g. 'main'
     * @param capabilityId alphanumeric capability ID, e.g. 'switchLevel'
     */
    getCapabilityStatus(id, componentId, capabilityId) {
        return this.client.get(`${id}/components/${componentId}/capabilities/${capabilityId}/status`);
    }
    /**
     * Gets the attribute values of the specified component capability
     * @deprecated use getCapabilityStatus instead
     */
    getCapabilityState(id, componentId, capabilityId) {
        return this.client.get(`${id}/components/${componentId}/capabilities/${capabilityId}/status`);
    }
    /**
     * Returns the health status of the device
     * @param id UUID of the device
     */
    getHealth(id) {
        return this.client.get(`${id}/health`).catch(reason => {
            if (reason.statusCode === 404) {
                return {
                    deviceId: id,
                    state: DeviceHealthState.UNKNOWN,
                };
            }
            return Promise.reject(reason);
        });
    }
    /**
     * Sends the specified list of commands to the device
     * @param id UUID of the device
     * @param commands list of commands
     */
    executeCommands(id, commands) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.client.post(`${id}/commands`, { commands });
        });
    }
    /**
     * Sends the specified command to the device
     * @param id UUID of the device
     * @param command a single device command
     */
    executeCommand(id, command) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.executeCommands(id, [command]);
        });
    }
    /**
     * Sends the specified commands to the device
     * @deprecated use executeCommands instead
     */
    postCommands(id, commands) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.client.post(`${id}/commands`, commands);
        });
    }
    /**
     * Sends the specified command or commands to the device and component defined in the specified config entry. The
     * end result is the same as calling the executeCommand method, but this method accepts a SmartApp config entry
     * for convenience
     * @param item installedApp config entry specifying the device UUID and component
     * @param capabilityIdOrCmdList either a capability ID or list of commands. If a list of commands is specified
     * then the command and args parameters are not required.
     * @param command the command name. Required when a capability ID has been specified in the previous parameter
     * @param args list of arguments. Required when a capability ID has been specified and the command has arguments
     */
    sendCommand(item, capabilityIdOrCmdList, command, args) {
        return __awaiter(this, void 0, void 0, function* () {
            let commands;
            const { deviceConfig } = item;
            if (deviceConfig) {
                if (Array.isArray(capabilityIdOrCmdList)) {
                    commands = capabilityIdOrCmdList.map(it => {
                        return {
                            component: deviceConfig.componentId,
                            capability: it.capability,
                            command: it.command,
                            arguments: it.arguments || [],
                        };
                    });
                }
                else {
                    commands = [
                        {
                            component: deviceConfig.componentId,
                            capability: capabilityIdOrCmdList,
                            command,
                            arguments: args || [],
                        },
                    ];
                }
                return this.client.post(`${deviceConfig.deviceId}/commands`, { commands });
            }
            return Promise.reject(Error('Device config not found'));
        });
    }
    /**
     * Sends the specified command or commands to the devices and components defined in the specified config entry list. The
     * end result is the same as calling the executeCommand method, but this method accepts a SmartApp config entry
     * for convenience
     * @param items a list of the installedApp config entries specifying device UUIDs and component IDs
     * @param capabilityIdOrCmdList either a capability ID or list of commands. If a list of commands is specified
     * then the command and args parameters are not required.
     * @param command the command name. Required when a capability ID has been specified in the previous parameter
     * @param args list of arguments. Required when a capability ID has been specified and the command has arguments
     */
    sendCommands(items, capabilityIdOrCmdList, command, args) {
        const results = (items !== null && items !== void 0 ? items : [])
            .map(item => this.sendCommand(item, capabilityIdOrCmdList, command, args));
        return Promise.allSettled(results);
    }
    /**
     * Creates events for the specified device
     * @param id UUID of the device
     * @param deviceEvents list of events
     */
    createEvents(id, deviceEvents) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.post(`${id}/events`, { deviceEvents });
            return types_1.SuccessStatusValue;
        });
    }
    /**
     * @deprecated use createEvents instead
     * @param id
     * @param deviceEvents
     */
    sendEvents(id, deviceEvents) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.post(`${id}/events`, deviceEvents);
        });
    }
    /**
     * Get a device presentation. If mnmn is omitted the default SmartThingsCommunity mnmn is used.
     * @param deviceId UUID of the device
     */
    getPresentation(deviceId) {
        return this.client.get('/presentation', { deviceId });
    }
    /**
     * Get the preference values of the device
     * @param deviceId UUID of the device
     */
    getPreferences(deviceId) {
        return this.client.get(`${deviceId}/preferences`, undefined, { headerOverrides: HEADER_OVERRIDES });
    }
    /**
     * Convenience function that returns hue and saturation of the named color
     * @deprecated
     */
    namedColor(color, sat = 100) {
        let hueColor = 0;
        const saturation = sat;
        switch (color) {
            case 'Blue':
                hueColor = 70;
                break;
            case 'Green':
                hueColor = 39;
                break;
            case 'Yellow':
                hueColor = 25;
                break;
            case 'Orange':
                hueColor = 10;
                break;
            case 'Purple':
                hueColor = 75;
                break;
            case 'Pink':
                hueColor = 83;
                break;
            case 'Red':
                hueColor = 100;
                break;
            default:
                hueColor = 0;
        }
        return { hue: hueColor, saturation };
    }
}
exports.DevicesEndpoint = DevicesEndpoint;
