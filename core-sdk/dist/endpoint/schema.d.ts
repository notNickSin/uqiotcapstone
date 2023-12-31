import { Endpoint } from '../endpoint';
import { EndpointClientConfig } from '../endpoint-client';
import { Status } from '../types';
export interface SchemaApp extends SchemaAppRequest {
    /**
     * Viper endpoint app id for the partner
     */
    endpointAppId?: string;
    /**
     * user id for the partner
     */
    userId?: string;
    /**
     * Organization that this app belongs to
     */
    organizationId?: string;
    /**
     * Client ID assigned by SmartThings for this app
     */
    stClientId?: string;
    /**
     * Possible values - '', 'cst', 'wwst'
     */
    certificationStatus?: string;
}
export type PartnerSTConnection = 'connected' | 'disconnected';
export interface SchemaAppRequest {
    /**
     * The name of the endpoint app
     */
    appName?: string;
    /**
     * The name of the partner/brand
     */
    partnerName?: string;
    /**
     * oAuth authorization url of the partner
     */
    oAuthAuthorizationUrl?: string;
    /**
     * lambda arn of the partner for US region (default)
     */
    lambdaArn?: string;
    /**
     * lambda arn of the partner for EU region
     */
    lambdaArnEU?: string;
    /**
     * lambda arn of the partner for AP region
     */
    lambdaArnAP?: string;
    /**
     * lambda arn of the partner for CN region
     */
    lambdaArnCN?: string;
    /**
     * url of partner icon
     */
    icon?: string;
    /**
     * url of partner icon in 2x dimensions
     */
    icon2x?: string;
    /**
     * url of partner icon in 3x dimensions
     */
    icon3x?: string;
    /**
     * Client id for the partner oAuth
     */
    oAuthClientId?: string;
    /**
     * Client secret for the partner oAuth
     */
    oAuthClientSecret?: string;
    /**
     * oAuth token refresh url of the partner
     */
    oAuthTokenUrl?: string;
    /**
     * oAuth scope for the partner. Example 'remote_control:all' for Lifx
     */
    oAuthScope?: string;
    /**
     * Possible values - 'lambda' or 'webhook'
     */
    hostingType?: string;
    /**
     * Possible values - 'alexa-schema', 'st-schema', 'google-schema'
     */
    schemaType?: string;
    /**
     * webhook url for the partner
     */
    webhookUrl?: string;
    /**
     * email for the partner
     */
    userEmail: string;
    /**
     * Data to support deep-linking to partner's mobile app
     */
    viperAppLinks?: ViperAppLinks;
}
export interface ViperAppLinks {
    android?: string;
    ios?: string;
    isLinkingEnabled?: boolean;
}
export interface DeviceResult {
    /**
     * deviceId created by DM
     */
    deviceId?: string;
    /**
     * initial device name from the partner
     */
    name?: string;
}
export interface InstalledSchemaApp {
    /**
     * Possible values - __requiresLogin__ or __loggedIn__. These two values determine what fields are returned in this response. If value is "requiresLogin", only "oAuthLink" is returned in the response. If value is "loggedIn", only isaId, partnerName, appName, devices and icons are returned.
     */
    pageType?: string;
    /**
     * isaId (Installed App Id)
     */
    isaId?: string;
    /**
     * partner or brand name eg LIFX Inc.
     */
    partnerName?: string;
    /**
     * Connector name. eg Lifx (Connect)
     */
    appName?: string;
    /**
     * url of partner icon
     */
    icon?: string;
    /**
     * url of partner icon in 2x dimensions
     */
    icon2x?: string;
    /**
     * url of partner icon in 3x dimensions
     */
    icon3x?: string;
    /**
     * location of the installed smart app
     */
    locationId?: string;
    devices?: DeviceResult[];
    /**
     * generated oAuth link for the user to login to partner server. This will only be returned when the user is not logged in.
     */
    oAuthLink?: string;
    /**
     * connection status between partner and ST platform
     */
    partnerSTConnection?: PartnerSTConnection;
}
export interface SchemaCreateResponse {
    endpointAppId?: string;
    stClientId: string;
    stClientSecret: string;
}
export declare enum SchemaPageType {
    requiresLogin = "requiresLogin",
    loggedIn = "loggedIn"
}
export interface SchemaPage {
    /**
     * The type of the page being returned, which is determined by the authentication state of the connector instance,
     * i.e. 'requiresLogin' or 'loggedIn'
     */
    pageType: SchemaPageType;
}
export interface UnauthorizedSchemaPage extends SchemaPage {
    /**
     * An href to the OAuth page for this connector that allows authentication and connection to the SmartThings
     * patform.
     */
    oAuthLink?: string;
}
export interface AuthorizedSchemaPage extends SchemaPage {
    isaId?: string;
    locationId?: string;
    devices?: DeviceResult[];
    icon?: string;
    icon2x?: string;
    icon3x?: string;
    partnerName?: string;
    appName?: string;
}
export declare class SchemaEndpoint extends Endpoint {
    constructor(config: EndpointClientConfig);
    /**
     * Returns a list of all ST Schema C2C connectors belonging to the principal (i.e. the user)
     */
    list(): Promise<SchemaApp[]>;
    /**
     * Returns a specific ST Schema connector
     * @param id the "endpointApp" UUID of the connector, e.g. "viper_799ff3a0-8249-11e9-9bf1-b5c7d651c2c3"
     */
    get(id: string): Promise<SchemaApp>;
    /**
     * Create an ST Schema connector
     * @param data definition of the connector
     */
    create(data: SchemaAppRequest): Promise<SchemaCreateResponse>;
    /**
     * Update an ST Schema connector
     * @param id the "endpointApp" UUID of the connector, e.g. "viper_799ff3a0-8249-11e9-9bf1-b5c7d651c2c3"
     * @param data new definition of the connector
     */
    update(id: string, data: SchemaAppRequest): Promise<Status>;
    /**
     * Re-generate the OAuth clientId and clientSecret for an ST Schema connector. The old clientId and clientSecret
     * will no longer be valid after this operation.
     * @param id the "endpointApp" UUID of the connector, e.g. "viper_799ff3a0-8249-11e9-9bf1-b5c7d651c2c3"
     */
    regenerateOauth(id: string): Promise<SchemaCreateResponse>;
    /**
     * Delete an ST Schema connector
     * @param id the "endpointApp" UUID of the connector, e.g. "viper_799ff3a0-8249-11e9-9bf1-b5c7d651c2c3"
     */
    delete(id: string): Promise<Status>;
    /**
     * Get the page definition of an ST Schema installed instance in the specified location.
     * @param id the "endpointApp" UUID of the connector, e.g. "viper_799ff3a0-8249-11e9-9bf1-b5c7d651c2c3"
     * @param locationId UUID of the location in which the connector is or is to be installed.
     */
    getPage(id: string, locationId: string): Promise<AuthorizedSchemaPage | UnauthorizedSchemaPage>;
    /**
     * Returns a list of the installed ST Schema connector instances in the specified location
     * @param locationId UUID of the location
     */
    installedApps(locationId?: string): Promise<InstalledSchemaApp[]>;
    /**
     * Returns a specific installed instance of an ST Schema connector. The returned object includes a list of the
     * devices created by the instance.
     * @param id UUID of the installed app instance
     */
    getInstalledApp(id: string): Promise<InstalledSchemaApp>;
    /**
     * Deletes a specific installed instance of an ST Schema connector. This operation will also delete all
     * devices created by this instance
     * @param id
     */
    deleteInstalledApp(id: string): Promise<Status>;
}
//# sourceMappingURL=schema.d.ts.map