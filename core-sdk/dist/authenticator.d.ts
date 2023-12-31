import { AxiosRequestConfig } from 'axios';
import { MutexInterface } from 'async-mutex';
import { EndpointClientConfig } from './endpoint-client';
/**
 * Implement this interface to implement a process for handling authentication.
 *
 * This is not meant to be a "service" in the traditional sense because
 * implementors are not expected to be stateless.
 */
export interface Authenticator {
    login?(): Promise<void>;
    logout?(): Promise<void>;
    refresh?(requestConfig: AxiosRequestConfig, clientConfig: EndpointClientConfig): Promise<void>;
    acquireRefreshMutex?(): Promise<MutexInterface.Releaser>;
    /**
     * Performs required authentication steps to add credentials to the axios config, typically via Bearer Auth headers.
     * Expected to call other functions such as @see refresh as needed to return valid credentials.
     *
     * @param requestConfig AxiosRequestConfig to add credentials to and return otherwise unmodified
     */
    authenticate(requestConfig: AxiosRequestConfig): Promise<AxiosRequestConfig>;
    /**
     * Performs required authentication steps and returns credentials as a string value
     * Expected to perform any required steps (such as token refresh) needed to return valid credentials.
     *
     * @returns {string} valid auth token
     */
    authenticateGeneric?(): Promise<string>;
}
/**
 * For use in tests or on endpoints that don't need any authentication.
 */
export declare class NoOpAuthenticator implements Authenticator {
    authenticate(requestConfig: AxiosRequestConfig): Promise<AxiosRequestConfig>;
    authenticateGeneric(): Promise<string>;
}
/**
 * A simple bearer token authenticator that knows nothing about refreshing
 * or logging in our out. If the token is expired, it simply won't work.
 */
export declare class BearerTokenAuthenticator implements Authenticator {
    token: string;
    constructor(token: string);
    authenticate(requestConfig: AxiosRequestConfig): Promise<AxiosRequestConfig>;
    authenticateGeneric(): Promise<string>;
}
export interface AuthData {
    authToken: string;
    refreshToken: string;
}
export interface RefreshData {
    refreshToken: string;
    clientId: string;
    clientSecret: string;
}
export interface RefreshTokenStore {
    getRefreshData(): Promise<RefreshData>;
    putAuthData(data: AuthData): Promise<void>;
}
/**
 * An authenticator that supports refreshing of the access token using a refresh token by loading
 * the refresh token, client ID, and client secret from a token store, performing the refresh, and
 * storing the new tokens.
 *
 * Note that corruption of the refresh token is unlikely but possible if two of the same
 * authenticators refresh the same token at the same time.
 */
export declare class RefreshTokenAuthenticator implements Authenticator {
    token: string;
    private tokenStore;
    constructor(token: string, tokenStore: RefreshTokenStore);
    authenticate(requestConfig: AxiosRequestConfig): Promise<AxiosRequestConfig>;
    refresh(requestConfig: AxiosRequestConfig, clientConfig: EndpointClientConfig): Promise<void>;
}
/**
 * A an authenticator that works like RefreshTokenAuthenticator but which can use a mutex to help
 * prevent corruption of the refresh token.
 *
 * Note that while `acquireRefreshMutex` is provided for you to use the mutex, the mutex is not
 * automatically used.
 */
export declare class SequentialRefreshTokenAuthenticator extends RefreshTokenAuthenticator {
    private refreshMutex;
    constructor(token: string, tokenStore: RefreshTokenStore, refreshMutex: MutexInterface);
    acquireRefreshMutex(): Promise<MutexInterface.Releaser>;
}
//# sourceMappingURL=authenticator.d.ts.map