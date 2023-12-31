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
exports.SequentialRefreshTokenAuthenticator = exports.RefreshTokenAuthenticator = exports.BearerTokenAuthenticator = exports.NoOpAuthenticator = void 0;
const axios_1 = __importDefault(require("axios"));
/**
 * For use in tests or on endpoints that don't need any authentication.
 */
class NoOpAuthenticator {
    authenticate(requestConfig) {
        return Promise.resolve(requestConfig);
    }
    authenticateGeneric() {
        return Promise.resolve('');
    }
}
exports.NoOpAuthenticator = NoOpAuthenticator;
/**
 * A simple bearer token authenticator that knows nothing about refreshing
 * or logging in our out. If the token is expired, it simply won't work.
 */
class BearerTokenAuthenticator {
    constructor(token) {
        this.token = token;
        // simple
    }
    authenticate(requestConfig) {
        return Promise.resolve(Object.assign(Object.assign({}, requestConfig), { headers: Object.assign(Object.assign({}, requestConfig.headers), { Authorization: `Bearer ${this.token}` }) }));
    }
    authenticateGeneric() {
        return Promise.resolve(this.token);
    }
}
exports.BearerTokenAuthenticator = BearerTokenAuthenticator;
/**
 * An authenticator that supports refreshing of the access token using a refresh token by loading
 * the refresh token, client ID, and client secret from a token store, performing the refresh, and
 * storing the new tokens.
 *
 * Note that corruption of the refresh token is unlikely but possible if two of the same
 * authenticators refresh the same token at the same time.
 */
class RefreshTokenAuthenticator {
    constructor(token, tokenStore) {
        this.token = token;
        this.tokenStore = tokenStore;
        // simple
    }
    authenticate(requestConfig) {
        return Promise.resolve(Object.assign(Object.assign({}, requestConfig), { headers: Object.assign(Object.assign({}, requestConfig.headers), { Authorization: `Bearer ${this.token}` }) }));
    }
    refresh(requestConfig, clientConfig) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const refreshData = yield this.tokenStore.getRefreshData();
            const headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + Buffer.from(`${refreshData.clientId}:${refreshData.clientSecret}`, 'ascii').toString('base64'),
                'Accept': 'application/json',
            };
            const axiosConfig = {
                url: (_a = clientConfig.urlProvider) === null || _a === void 0 ? void 0 : _a.authURL,
                method: 'POST',
                headers,
                data: `grant_type=refresh_token&client_id=${refreshData.clientId}&refresh_token=${refreshData.refreshToken}`,
            };
            const response = yield axios_1.default.request(axiosConfig);
            if (response.status > 199 && response.status < 300) {
                const authData = {
                    authToken: response.data.access_token,
                    refreshToken: response.data.refresh_token,
                };
                this.token = authData.authToken;
                requestConfig.headers = Object.assign(Object.assign({}, ((_b = requestConfig.headers) !== null && _b !== void 0 ? _b : {})), { Authorization: `Bearer ${this.token}` });
                return this.tokenStore.putAuthData(authData);
            }
            throw Error(`error ${response.status} refreshing token, with message ${response.data}`);
        });
    }
}
exports.RefreshTokenAuthenticator = RefreshTokenAuthenticator;
/**
 * A an authenticator that works like RefreshTokenAuthenticator but which can use a mutex to help
 * prevent corruption of the refresh token.
 *
 * Note that while `acquireRefreshMutex` is provided for you to use the mutex, the mutex is not
 * automatically used.
 */
class SequentialRefreshTokenAuthenticator extends RefreshTokenAuthenticator {
    constructor(token, tokenStore, refreshMutex) {
        super(token, tokenStore);
        this.refreshMutex = refreshMutex;
    }
    acquireRefreshMutex() {
        return this.refreshMutex.acquire();
    }
}
exports.SequentialRefreshTokenAuthenticator = SequentialRefreshTokenAuthenticator;
