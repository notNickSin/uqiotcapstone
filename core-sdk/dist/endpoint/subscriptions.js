"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionsEndpoint = exports.SubscriptionSource = void 0;
const endpoint_1 = require("../endpoint");
const endpoint_client_1 = require("../endpoint-client");
/* eslint-enable */
var SubscriptionSource;
(function (SubscriptionSource) {
    SubscriptionSource["DEVICE"] = "DEVICE";
    SubscriptionSource["CAPABILITY"] = "CAPABILITY";
    SubscriptionSource["MODE"] = "MODE";
    SubscriptionSource["DEVICE_LIFECYCLE"] = "DEVICE_LIFECYCLE";
    SubscriptionSource["DEVICE_HEALTH"] = "DEVICE_HEALTH";
    SubscriptionSource["SECURITY_ARM_STATE"] = "SECURITY_ARM_STATE";
    SubscriptionSource["HUB_HEALTH"] = "HUB_HEALTH";
    SubscriptionSource["SCENE_LIFECYCLE"] = "SCENE_LIFECYCLE";
})(SubscriptionSource = exports.SubscriptionSource || (exports.SubscriptionSource = {}));
class SubscriptionsEndpoint extends endpoint_1.Endpoint {
    constructor(config) {
        super(new endpoint_client_1.EndpointClient('installedapps', config));
    }
    /**
     * Returns a list of all the subscriptions for an installed app.
     * @param installedAppId UUID of the installed app. This parameter is not required if the client id configured
     * with an installedAppId
     */
    list(installedAppId) {
        return this.client.getPagedItems(`${this.installedAppId(installedAppId)}/subscriptions`);
    }
    /**
     * Gets the definition of a specific subscription for the specified installed app.
     * @param name the alphanumeric name of the subscription
     * @param installedAppId UUID of the installed app. This parameter is not required if the client id configured
     * with an installedAppId
     */
    get(name, installedAppId) {
        return this.client.get(`${this.installedAppId(installedAppId)}/subscriptions/${name}`);
    }
    /**
     * Deletes one or more subscriptions of an installed app
     * @param subscriptionId UUID of the subscription to delete. If not specified then all subscriptions associated with the
     * installed app instance are deleted.
     * @param installedAppId UUID of the installed app. This parameter is not required if the client id configured
     * with an installedAppId
     */
    delete(subscriptionId, installedAppId) {
        if (subscriptionId) {
            return this.client.delete(`${this.installedAppId(installedAppId)}/subscriptions/${subscriptionId}`);
        }
        return this.client.delete(`${this.installedAppId(installedAppId)}/subscriptions`);
    }
    /**
     * Create a subscription for an installed app instance
     * @param data the definition of the subscription
     * @param installedAppId UUID of the installed app. This parameter is not required if the client id configured
     * with an installedAppId
     */
    create(data, installedAppId) {
        return this.client.post(`${this.installedAppId(installedAppId)}/subscriptions`, data);
    }
    /**
     * Deletes a subscription of an installed app
     * @param name name of the subscription to delete. If not specified then all subscriptions associated with the
     * installed app instance are deleted.
     * @param installedAppId UUID of the installed app. This parameter is not required if the client id configured
     * with an installedAppId
     * @deprecated use delete(name) instead
     */
    unsubscribe(name, installedAppId) {
        return this.client.delete(`${this.installedAppId(installedAppId)}/subscriptions/${name}`);
    }
    /**
     * Deletes all subscriptions of an installed app
     * @param installedAppId UUID of the installed app. This parameter is not required if the client id configured
     * with an installedAppId
     * @deprecated use delete() instead
     */
    unsubscribeAll(installedAppId) {
        return this.client.delete(`${this.installedAppId(installedAppId)}/subscriptions`);
    }
    /**
     * Creates device event subscriptions for one or more devices specified in a SmartApp device configuration setting.
     * This method is intended for use from SmartApps or API Access apps and must be called from a client configured
     * with an installedAppId. Use the create() method if the client is not
     * so configured.
     * @param devices a SmartApp device configuration setting configured with one or more devices
     * @param capability alphanumeric ID of the capability to subscribe to or '*' to subscribed to all capabilities of
     * the devices
     * @param attribute string defining what attribute(s) and attribute value(s) to subscribe to. Specifying an attribute
     * name such as 'switch' subscribed to all values of the switch attribute. Specifying a name.value string such as
     * 'switch.on' subscribed to only the on values of the switch. Specifying the wildcard '*' subscribes to all
     * values of all attributes of the capability.
     * @param subscriptionName the alphanumeric subscription name
     * @param options map of options, stateChange only a modes. If not stateChangeOnly is not specified the default
     * is true. If modes is not specified then events are sent for all modes.
     */
    subscribeToDevices(devices, capability, attribute, subscriptionName, options = {}) {
        const ops = [];
        if (devices) {
            const segs = attribute.split('.');
            const attributeName = segs[0];
            const attributeValue = segs.length > 1 ? segs[1] : '*';
            const path = `${this.installedAppId()}/subscriptions`;
            devices.forEach((item, index) => {
                if (item.deviceConfig) {
                    const device = {
                        deviceId: item.deviceConfig.deviceId,
                        componentId: item.deviceConfig.componentId,
                        capability: capability,
                        attribute: attributeName,
                        stateChangeOnly: options.stateChangeOnly !== undefined ? options.stateChangeOnly : true,
                        subscriptionName: `${subscriptionName}_${index}`,
                        value: attributeValue,
                    };
                    if (options.modes) {
                        device.modes = options.modes;
                    }
                    const body = {
                        sourceType: SubscriptionSource.DEVICE,
                        device,
                    };
                    ops.push(this.client.post(path, body));
                }
            });
        }
        return Promise.all(ops);
    }
    /**
     * Creates a device subscription to a specific capability for all devices in a location. This method is intended
     * for use from SmartApps or API Access apps and must be called from a client configured
     * with an installedAppId and locationId. Use the create() method if the client is not
     * so configured.
     * @param capability alphanumeric ID of the capability
     * @param attribute string defining what attribute(s) and attribute value(s) to subscribe to. Specifying an attribute
     * name such as 'switch' subscribed to all values of the switch attribute. Specifying a name.value string such as
     * 'switch.on' subscribed to only the on values of the switch. Specifying the wildcard '*' subscribes to all
     * values of all attributes of the capability.
     * @param subscriptionName the alphanumber subscription name
     * @param options map of options, stateChange only a modes. If not stateChangeOnly is not specified the default
     * is true. If modes is not specified then events are sent for all modes.
     */
    subscribeToCapability(capability, attribute, subscriptionName, options = {}) {
        const segs = attribute.split('.');
        const attributeName = segs[0];
        const attributeValue = segs.length > 1 ? segs[1] : '*';
        const path = `${this.installedAppId()}/subscriptions`;
        const capabilityDetail = {
            locationId: this.locationId(),
            capability,
            attribute: attributeName,
            stateChangeOnly: options.stateChangeOnly !== undefined ? options.stateChangeOnly : true,
            subscriptionName,
            value: attributeValue,
        };
        const body = {
            sourceType: SubscriptionSource.CAPABILITY,
            capability: capabilityDetail,
        };
        if (options.modes) {
            body.capability.modes = options.modes;
        }
        return this.client.post(path, body);
    }
    /**
     * Subscribes to the mode change events from a location. This method is intended
     * for use from SmartApps or API Access apps and must be called from a client configured
     * with an installedAppId and locationId. Use the create() method if the client is not
     * so configured.
     * @param subscriptionName alphanumeric subscription name
     */
    subscribeToModeChange(subscriptionName) {
        const path = `${this.installedAppId()}/subscriptions`;
        const body = {
            sourceType: SubscriptionSource.MODE,
            mode: {
                locationId: this.locationId(),
                subscriptionName,
            },
        };
        return this.client.post(path, body);
    }
    /**
     * Subscribes to device lifecycle events (i.e. create, update, and delete) from a location. This method is intended
     * for use from SmartApps or API Access apps and must be called from a client configured
     * with an installedAppId and locationId. Use the create() method if the client is not
     * so configured.
     * @param subscriptionName alphanumeric subscription name
     */
    subscribeToDeviceLifecycle(subscriptionName) {
        const path = `${this.installedAppId()}/subscriptions`;
        const body = {
            sourceType: SubscriptionSource.DEVICE_LIFECYCLE,
            deviceLifecycle: {
                locationId: this.locationId(),
                subscriptionName,
            },
        };
        return this.client.post(path, body);
    }
    /**
     * Subscribes to device health events (i.e. online and offline) from a location. This method is intended
     * for use from SmartApps or API Access apps and must be called from a client configured
     * with an installedAppId and locationId. Use the create() method if the client is not
     * so configured.
     * @param subscriptionName alphanumeric subscription name
     */
    subscribeToDeviceHealth(subscriptionName) {
        const path = `${this.installedAppId()}/subscriptions`;
        const body = {
            sourceType: SubscriptionSource.DEVICE_HEALTH,
            deviceHealth: {
                locationId: this.locationId(),
                subscriptionName,
            },
        };
        return this.client.post(path, body);
    }
    /**
     * Subscribes to security system events from a location. This method is intended
     * for use from SmartApps or API Access apps and must be called from a client configured
     * with an installedAppId and locationId. Use the create() method if the client is not
     * so configured.
     * @param subscriptionName alphanumeric subscription name
     */
    subscribeToSecuritySystem(subscriptionName) {
        const path = `${this.installedAppId()}/subscriptions`;
        const body = {
            sourceType: SubscriptionSource.SECURITY_ARM_STATE,
            securityArmState: {
                locationId: this.locationId(),
                subscriptionName,
            },
        };
        return this.client.post(path, body);
    }
    /**
     * Subscribes to hub health events from a location. This method is intended
     * for use from SmartApps or API Access apps and must be called from a client configured
     * with an installedAppId and locationId. Use the create() method if the client is not
     * so configured.
     * @param subscriptionName alphanumeric subscription name
     */
    subscribeToHubHealth(subscriptionName) {
        const path = `${this.installedAppId()}/subscriptions`;
        const body = {
            sourceType: SubscriptionSource.HUB_HEALTH,
            hubHealth: {
                locationId: this.locationId(),
                subscriptionName,
            },
        };
        return this.client.post(path, body);
    }
    /**
     * Subscribes to scene lifecycle events from a location. This method is intended
     * for use from SmartApps or API Access apps and must be called from a client configured
     * with an installedAppId and locationId. Use the create() method if the client is not
     * so configured.
     * @param subscriptionName alphanumeric subscription name
     */
    subscribeToSceneLifecycle(subscriptionName) {
        const path = `${this.installedAppId()}/subscriptions`;
        const body = {
            sourceType: SubscriptionSource.SCENE_LIFECYCLE,
            sceneLifecycle: {
                locationId: this.locationId(),
                subscriptionName,
            },
        };
        return this.client.post(path, body);
    }
}
exports.SubscriptionsEndpoint = SubscriptionsEndpoint;
