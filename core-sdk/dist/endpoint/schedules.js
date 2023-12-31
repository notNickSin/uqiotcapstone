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
exports.SchedulesEndpoint = void 0;
const lodash_isstring_1 = __importDefault(require("lodash.isstring"));
const lodash_isdate_1 = __importDefault(require("lodash.isdate"));
const endpoint_1 = require("../endpoint");
const endpoint_client_1 = require("../endpoint-client");
const types_1 = require("../types");
/**
 * Converts a date if the format returned by the SmartThings mobile client into a cron expression that runs
 * one per day
 * @param value ISO date value of the form '2020-02-08T16:35:00.000-0800' or simple 24 hour hh:ss time string of the
 * format 16:35
 */
function parseDate(value) {
    try {
        if (/^[0-9-]+T[0-9][0-9]:[0-9][0-9]:/.test(value)) {
            const time = value.split('T')[1];
            const hours = time.slice(0, 2);
            const minutes = time.slice(3, 5);
            return `${minutes} ${hours} * * ? *`;
        }
        if (/^[0-9][0-9]?:[0-9][0-9]$/.test(value)) {
            const time = value.split(':');
            return `${time[1]} ${time[0]} * * ? *`;
        }
    }
    catch (error) {
        throw Error(`Error parsing time format '${value}' ${error}`);
    }
    throw Error(`Unsupported time format '${value}'`);
}
class SchedulesEndpoint extends endpoint_1.Endpoint {
    constructor(config) {
        super(new endpoint_client_1.EndpointClient('installedapps', config));
    }
    /**
     * Returns a list of schedules for an installed app
     * @param installedAppId UUID of the installed app. If the client is configured with an installed app ID then this
     * parameter is not needed.
     */
    list(installedAppId) {
        return this.client.getPagedItems(`${this.installedAppId(installedAppId)}/schedules`);
    }
    /**
     * Get a specific schedule
     * @param name the alphanumeric name of the schedule
     * @param installedAppId UUID of the installed app. If the client is configured with an installed app ID then this
     * parameter is not needed.
     */
    get(name, installedAppId) {
        return this.client.get(`${this.installedAppId(installedAppId)}/schedules/${name}`);
    }
    /**
     * Create a schedule
     * @param data the schedule definition
     * @param installedAppId UUID of the installed app. If the client is configured with an installed app ID then this
     * parameter is not needed.
     */
    create(data, installedAppId) {
        return this.client.post(`${this.installedAppId(installedAppId)}/schedules`, data);
    }
    /**
     * Delete one or more schedules
     * @param name the name of the schedule to be deleted. If not specified then all schedules of the installed app are
     * deleted.
     * @param installedAppId UUID of the installed app. If the client is configured with an installed app ID then this
     * parameter is not needed.
     */
    delete(name, installedAppId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (name) {
                yield this.client.delete(`${this.installedAppId(installedAppId)}/schedules/${name}`);
            }
            else {
                yield this.client.delete(`${this.installedAppId(installedAppId)}/schedules`);
            }
            return types_1.SuccessStatusValue;
        });
    }
    /**
     * Create a schedule using a cron expression.
     * @param name the name of the schedule
     * @param expression the cron expression
     * @param timezone optional time zone. If not specified and the client is configured with a locationId of a location
     * that has geo-coordinates set, then the time zone of those coordinates is used. If that's not the case the time
     * zone defaults to UTC. Note that in order for the coordinates lookup to work, the API token must include the
     * r:locations:* scope.
     * @param installedAppId UUID of the installed app. If the client is configured with an installed app ID then this
     * parameter is not needed.
     */
    schedule(name, expression, timezone, installedAppId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!timezone) {
                const location = yield this.client.get(`/locations/${this.locationId()}`);
                timezone = location.timeZoneId || 'UTC';
            }
            const body = {
                name,
                cron: {
                    expression,
                    timezone,
                },
            };
            return this.create(body, installedAppId);
        });
    }
    /**
     * Create a schedule that runs at a specific time once per day
     * @param name the name of the schedule
     * @param dateOrConfig either a SmartApp date configuration setting, an ISO date string of the format
     * '2020-02-08T16:35:00.000-0800', a 24 hour hh:mm time expression (i.e. 16:35), or a Date object.
     * configuration setting
     * @param timezone optional time zone. Not required if the input is a Date object. Otherwise
     * if not specified and the client is configured with a locationId of a location
     * that has geo-coordinates set, then the time zone of those coordinates is used. If that's not the case the time
     * zone defaults to UTC. Note that in order for the coordinates lookup to work, the API token must include the
     * r:locations:* scope.
     * @param installedAppId UUID of the installed app. If the client is configured with an installed app ID then this
     * parameter is not needed.
     */
    runDaily(name, dateOrConfig, timezone, installedAppId) {
        return __awaiter(this, void 0, void 0, function* () {
            let expression;
            if (Array.isArray(dateOrConfig) && dateOrConfig[0].stringConfig && dateOrConfig[0].stringConfig.value) {
                expression = parseDate(dateOrConfig[0].stringConfig.value);
            }
            else if ((0, lodash_isstring_1.default)(dateOrConfig)) {
                expression = parseDate(dateOrConfig);
            }
            else if ((0, lodash_isdate_1.default)(dateOrConfig)) {
                expression = `${dateOrConfig.getUTCMinutes()} ${dateOrConfig.getUTCHours()} * * ? *`;
                timezone = 'UTC';
            }
            else {
                throw Error(`Invalid date format '${dateOrConfig}'`);
            }
            if (!timezone) {
                const location = yield this.client.get(`/locations/${this.locationId()}`);
                timezone = location.timeZoneId || 'UTC';
            }
            const data = {
                name,
                cron: {
                    expression, timezone,
                },
            };
            return this.create(data, installedAppId);
        });
    }
    /**
     *
     * @param name
     * @param dateTime
     * @param overwrite
     * @param installedAppId
     */
    runOnce(name, dateTime, overwrite = true, installedAppId) {
        const time = dateTime instanceof Date ? dateTime.getTime() : dateTime;
        const body = {
            name,
            once: {
                time,
                overwrite,
            },
        };
        return this.create(body, installedAppId);
    }
    /**
     * Creates a one-time schedule that runs after the specified period of time.
     * @param name the name of the schedule
     * @param delay the amount of time that should elapse before the schedule runs, in seconds
     * @param overwrite if true then a second call with the same name that's made before the first one has run will
     * replace the first schedule, so that only the second one runs. If false then each call to runIn will result in
     * a schedule execution. Defaults to true.
     * @param installedAppId UUID of the installed app. If the client is configured with an installed app ID then this
     * parameter is not needed.
     */
    runIn(name, delay, overwrite = true, installedAppId) {
        const time = Date.now() + (1000 * delay);
        const body = {
            name,
            once: {
                time,
                overwrite,
            },
        };
        return this.create(body, installedAppId);
    }
    /**
     * Deletes the schedule with the specified name
     * @param name the schedule name
     * @param installedAppId UUID of the installed app. If the client is configured with an installed app ID then this
     * parameter is not needed.
     * @deprecated use delete(name) instead
     */
    unschedule(name, installedAppId) {
        return this.delete(name, installedAppId);
    }
    /**
     * Deletes all schedules for the installed app
     * @param installedAppId UUID of the installed app. If the client is configured with an installed app ID then this
     * parameter is not needed.
     * @deprecated use delete() instead
     */
    unscheduleAll(installedAppId) {
        return this.delete(installedAppId);
    }
}
exports.SchedulesEndpoint = SchedulesEndpoint;
