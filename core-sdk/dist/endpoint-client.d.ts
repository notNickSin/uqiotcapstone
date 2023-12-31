import { Authenticator } from './authenticator';
import { Logger } from './logger';
export interface HttpClientHeaders {
    [name: string]: string;
}
export type HttpClientParamValue = string | string[] | number;
export interface HttpClientParams {
    [name: string]: HttpClientParamValue;
}
export type HttpClientMethod = 'get' | 'GET' | 'post' | 'POST' | 'put' | 'PUT' | 'patch' | 'PATCH' | 'delete' | 'DELETE';
export interface SmartThingsURLProvider {
    baseURL: string;
    authURL: string;
    keyApiURL: string;
}
export declare const defaultSmartThingsURLProvider: SmartThingsURLProvider;
export interface EndpointClientConfig {
    authenticator: Authenticator;
    urlProvider?: SmartThingsURLProvider;
    logger?: Logger;
    loggingId?: string;
    version?: string;
    headers?: HttpClientHeaders;
    locationId?: string;
    installedAppId?: string;
    /**
     * You can use this to supply a method that can log RFC 2068 warning headers.
     *
     * The messages are parsed into `WarningFromHeader` but if for any reason that parsing
     * fails, the headers are simply returned as a comma-separated string.
     */
    warningLogger?: (warnings: WarningFromHeader[] | string) => void | Promise<void>;
}
export interface ItemsList {
    items: [];
    _links?: {
        next?: {
            href: string;
        };
        previous?: {
            href: string;
        };
    };
}
export interface EndpointClientRequestOptions<T> {
    headerOverrides?: HttpClientHeaders;
    dryRun?: boolean;
    dryRunReturnValue?: T;
}
export interface WarningFromHeader {
    code: number;
    agent: string;
    text: string;
    date?: string;
}
/**
 * Parses Axios comma-joined warning headers into individual warnings. If, for any reason, the
 * header string cannot be parsed, it will be returned unchanged.
 *
 * This method does not handle escaped quotes inside quoted strings.
 */
export declare const parseWarningHeader: (header: string) => WarningFromHeader[] | string;
export declare class EndpointClient {
    readonly basePath: string;
    readonly config: EndpointClientConfig;
    private logger;
    constructor(basePath: string, config: EndpointClientConfig);
    setHeader(name: string, value: string): EndpointClient;
    removeHeader(name: string): EndpointClient;
    private url;
    request<T = any>(method: HttpClientMethod, path?: string, data?: any, params?: HttpClientParams, options?: EndpointClientRequestOptions<T>): Promise<T>;
    get<T = any>(path?: string, params?: HttpClientParams, options?: EndpointClientRequestOptions<T>): Promise<T>;
    post<T = any>(path?: string, data?: any, params?: HttpClientParams, options?: EndpointClientRequestOptions<T>): Promise<T>;
    put<T = any>(path?: string, data?: any, params?: HttpClientParams, options?: EndpointClientRequestOptions<T>): Promise<T>;
    patch<T = any>(path?: string, data?: any, params?: HttpClientParams, options?: EndpointClientRequestOptions<T>): Promise<T>;
    delete<T = any>(path?: string, params?: HttpClientParams, options?: EndpointClientRequestOptions<T>): Promise<T>;
    getPagedItems<T = any>(path?: string, params?: HttpClientParams, options?: EndpointClientRequestOptions<ItemsList>): Promise<T[]>;
}
//# sourceMappingURL=endpoint-client.d.ts.map