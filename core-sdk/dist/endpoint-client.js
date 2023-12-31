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
exports.EndpointClient = exports.parseWarningHeader = exports.defaultSmartThingsURLProvider = void 0;
const axios_1 = __importDefault(require("axios"));
const qs_1 = __importDefault(require("qs"));
const logger_1 = require("./logger");
exports.defaultSmartThingsURLProvider = {
    baseURL: 'https://api.smartthings.com',
    authURL: 'https://auth-global.api.smartthings.com/oauth/token',
    keyApiURL: 'https://key.smartthings.com',
};
/**
 * Convert to string and scrub sensitive values like auth tokens
 * Meant to be used before logging the request
 */
function scrubConfig(config) {
    const message = JSON.stringify(config);
    const bearerRegex = /"(Bearer [0-9a-f]{8})[0-9a-f-]{28}"/i;
    if (bearerRegex.test(message)) {
        return message.replace(bearerRegex, '"$1-xxxx-xxxx-xxxx-xxxxxxxxxxxx"');
    }
    else { // assume there is some other auth format and redact the entire header value
        const authHeaderRegex = /"(Authorization":")([\s\S]*)"/i;
        return message.replace(authHeaderRegex, '"$1(redacted)"');
    }
}
/**
 * Parses Axios comma-joined warning headers into individual warnings. If, for any reason, the
 * header string cannot be parsed, it will be returned unchanged.
 *
 * This method does not handle escaped quotes inside quoted strings.
 */
const parseWarningHeader = (header) => {
    if (header === '') {
        return [];
    }
    const warnings = header.match(/[^, ]+ [^, ]+ "[^"]+"( "[^"]+")?/g);
    if (!warnings) {
        return header;
    }
    let failed = false;
    const retVal = warnings.map(warning => {
        const fields = warning.match(/^(?<code>\d+) (?<agent>[^ ]+) "(?<text>.*?)"( "(?<date>.*?)")?$/);
        if (!fields) {
            failed = true;
            return { code: 1, agent: '-', text: 'unused' };
        }
        const { code, agent, text, date } = fields.groups;
        return { code: parseInt(code), agent, text, date };
    });
    return failed ? header : retVal;
};
exports.parseWarningHeader = parseWarningHeader;
class EndpointClient {
    constructor(basePath, config) {
        this.basePath = basePath;
        this.config = config;
        this.logger = config.logger ? config.logger : logger_1.noLogLogger;
    }
    setHeader(name, value) {
        if (!this.config.headers) {
            this.config.headers = {};
        }
        this.config.headers[name] = value;
        return this;
    }
    removeHeader(name) {
        if (this.config.headers) {
            delete this.config.headers[name];
        }
        return this;
    }
    url(path) {
        var _a, _b, _c;
        if (path) {
            if (path.startsWith('/')) {
                return `${(_a = this.config.urlProvider) === null || _a === void 0 ? void 0 : _a.baseURL}${path}`;
            }
            else if (path.startsWith('https://')) {
                return path;
            }
            return `${(_b = this.config.urlProvider) === null || _b === void 0 ? void 0 : _b.baseURL}/${this.basePath}/${path}`;
        }
        return `${(_c = this.config.urlProvider) === null || _c === void 0 ? void 0 : _c.baseURL}/${this.basePath}`;
    }
    /* eslint-disable @typescript-eslint/no-explicit-any */
    request(method, path, data, params, options) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const headers = this.config.headers ? Object.assign({}, this.config.headers) : {};
            if (this.config.loggingId) {
                headers['X-ST-CORRELATION'] = this.config.loggingId;
            }
            if (this.config.version) {
                const versionString = `application/vnd.smartthings+json;v=${this.config.version}`;
                // Prepare the accept header
                if (typeof headers.Accept === 'undefined' || headers.Accept === 'application/json') {
                    headers.Accept = versionString;
                }
                else {
                    headers.Accept = `${versionString}, ${headers.Accept}`;
                }
            }
            let axiosConfig = {
                url: this.url(path),
                method,
                headers: (options === null || options === void 0 ? void 0 : options.headerOverrides) ? Object.assign(Object.assign({}, headers), options.headerOverrides) : headers,
                params,
                data,
                paramsSerializer: params => qs_1.default.stringify(params, { indices: false }),
            };
            axiosConfig = yield this.config.authenticator.authenticate(axiosConfig);
            if (this.logger.isDebugEnabled()) {
                this.logger.debug(`making axios request: ${scrubConfig(axiosConfig)}`);
            }
            if (options === null || options === void 0 ? void 0 : options.dryRun) {
                if (options.dryRunReturnValue) {
                    return options.dryRunReturnValue;
                }
                throw new Error('skipping request; dry run mode');
            }
            try {
                const response = yield axios_1.default.request(axiosConfig);
                if (this.logger.isTraceEnabled()) {
                    this.logger.trace(`axios response ${response.status}: data=${JSON.stringify(response.data)}`);
                }
                if (((_a = response.headers) === null || _a === void 0 ? void 0 : _a.warning) && this.config.warningLogger) {
                    // warningLogger allows for return of a promise or just void for flexibility
                    // it's not important to us here that it finish.
                    // eslint-disable-next-line @typescript-eslint/no-floating-promises
                    this.config.warningLogger((0, exports.parseWarningHeader)(response.headers.warning));
                }
                return response.data;
            }
            catch (error) {
                if (this.logger.isTraceEnabled()) {
                    if (error.response) {
                        // server responded with non-200 response code
                        this.logger.trace(`axios response ${error.response.status}: data=${JSON.stringify(error.response.data)}`);
                    }
                    else if (error.request) {
                        // server never responded
                        this.logger.trace(`no response from server for request ${JSON.stringify(error.request)}`);
                    }
                    else {
                        this.logger.trace(`error making request: ${error.message}`);
                    }
                }
                if (error.response && error.response.status === 401 && this.config.authenticator.refresh) {
                    if (this.config.authenticator.acquireRefreshMutex) {
                        const release = yield this.config.authenticator.acquireRefreshMutex();
                        try {
                            yield this.config.authenticator.refresh(axiosConfig, this.config);
                            const response = yield axios_1.default.request(axiosConfig);
                            return response.data;
                        }
                        finally {
                            release();
                        }
                    }
                    else {
                        yield this.config.authenticator.refresh(axiosConfig, this.config);
                        const response = yield axios_1.default.request(axiosConfig);
                        return response.data;
                    }
                }
                // Annotate message with SmartThings API error data
                if (error.response && error.response.data) {
                    error.message = error.message + ': ' + JSON.stringify(error.response.data);
                }
                throw error;
            }
        });
    }
    get(path, params, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('get', path, undefined, params, options);
        });
    }
    post(path, data, params, options) {
        return this.request('post', path, data, params, options);
    }
    put(path, data, params, options) {
        return this.request('put', path, data, params, options);
    }
    patch(path, data, params, options) {
        return this.request('patch', path, data, params, options);
    }
    delete(path, params, options) {
        return this.request('delete', path, undefined, params, options);
    }
    getPagedItems(path, params, options) {
        return __awaiter(this, void 0, void 0, function* () {
            let list = yield this.get(path, params, options);
            const result = list.items;
            while (list._links && list._links.next) {
                list = yield this.get(list._links.next.href, undefined, options);
                result.push(...list.items);
            }
            return result;
        });
    }
}
exports.EndpointClient = EndpointClient;
