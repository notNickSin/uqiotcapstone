"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RESTClient = void 0;
const endpoint_client_1 = require("./endpoint-client");
// TODO:
// add site version specification and at other levels; need to support header and url versions
// server specification
class RESTClient {
    constructor(authenticator, config) {
        const defaultConfig = {
            authenticator,
            urlProvider: endpoint_client_1.defaultSmartThingsURLProvider,
            useAuth: true,
        };
        const headers = (config && config.headers)
            ? Object.assign(Object.assign({}, RESTClient.defaultHeaders), config.headers) : Object.assign({}, RESTClient.defaultHeaders);
        this.config = Object.assign(Object.assign(Object.assign({}, defaultConfig), config), { headers });
    }
}
exports.RESTClient = RESTClient;
RESTClient.defaultHeaders = {
    'Content-Type': 'application/json;charset=utf-8',
    Accept: 'application/json',
};
