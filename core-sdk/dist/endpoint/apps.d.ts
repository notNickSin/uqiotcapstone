import { EndpointClientConfig } from '../endpoint-client';
import { Endpoint } from '../endpoint';
import { IconImage, Owner, PrincipalType, SuccessResponse } from '../types';
export declare enum AppType {
    LAMBDA_SMART_APP = "LAMBDA_SMART_APP",
    WEBHOOK_SMART_APP = "WEBHOOK_SMART_APP",
    API_ONLY = "API_ONLY"
}
export declare enum AppClassification {
    AUTOMATION = "AUTOMATION",
    SERVICE = "SERVICE",
    DEVICE = "DEVICE",
    CONNECTED_SERVICE = "CONNECTED_SERVICE"
}
export declare enum AppTargetStatus {
    PENDING = "PENDING",
    CONFIRMED = "CONFIRMED"
}
export declare enum SignatureType {
    APP_RSA = "APP_RSA",
    ST_PADLOCK = "ST_PADLOCK"
}
export interface LambdaSmartApp {
    /**
     * A list of AWS ARNs referencing a Lambda function.
     */
    functions: string[];
}
export interface WebhookSmartApp {
    /**
     * A URL that should be invoked during execution.
     */
    targetUrl: string;
    /**
     * The registration status of a target url.
     */
    targetStatus?: AppTargetStatus;
    /**
     * The public half of an RSA key pair. Useful for verifying a Webhook
     * execution request signature to ensure it came from SmartThings.
     */
    publicKey?: string;
    /**
     * The http signature type used for authorizing event delivery.
     * APP_RSA generates an RSA key pair that will be used to verify requests
     * from SmartThings. ST_PADLOCK requires verification through SmartThings
     * public certificate.
     */
    signatureType?: SignatureType;
}
export interface ApiOnlySubscription {
    targetUrl: string;
    targetStatus: AppTargetStatus;
}
export interface ApiOnlyApp {
    subscription?: ApiOnlySubscription;
}
export interface ApiOnlyAppRequest {
    /**
     * Optional target url to receive events. Url scheme must be https.
     *
     * Must be <= 2048 characters.
     */
    targetUrl?: string;
}
export interface AppUISettings {
    dashboardCardsEnabled: boolean;
    preInstallDashboardCardsEnabled: boolean;
    pluginId?: string;
    pluginUri?: string;
}
export interface AppBase {
    /**
     * A user defined unique identifier for an app.  It is alpha-numeric, may
     * contain dashes, underscores, periods, and be less then 250 characters
     * long.  It must be unique within your account.
     */
    appName: string;
    /**
     * Denotes the type of app.
     */
    appType: AppType;
    /**
     * An App maybe associated to many classifications.  A classification
     * drives how the integration is presented to the user in the SmartThings
     * mobile clients.  These classifications include:
     *
     * AUTOMATION - Denotes an integration that should display under the "Automation" tab in mobile clients.
     * SERVICE - Denotes an integration that is classified as a "Service".
     * DEVICE - Denotes an integration that should display under the "Device" tab in mobile clients.
     * CONNECTED_SERVICE - Denotes an integration that should display under the "Connected Services" menu in mobile clients.
     */
    classifications: AppClassification[];
    /**
     * A default display name for an app.
     */
    displayName: string;
    /**
     * A default description for an app.
     */
    description: string;
}
export interface AppUpdateRequest extends AppBase {
    /**
     * Inform the installation systems that a particular app can only be
     * installed once within a user's account.
     */
    singleInstance?: boolean;
    /**
     * A default icon image for the app.
     */
    iconImage?: IconImage;
    /**
     * Details related to a Lambda Smart App implementation.
     * This model should only be specified for apps of type LAMBDA_SMART_APP.
     */
    lambdaSmartApp?: LambdaSmartApp;
    /**
     * Details related to a Webhook Smart App implementation.
     * This model should only be specified for apps of type WEBHOOK_SMART_APP.
     */
    webhookSmartApp?: WebhookSmartApp;
    /**
     * Details related to an ApiOnly Smart App implementation.
     * This model should only be specified for apps of type API_ONLY.
     */
    apiOnly?: ApiOnlyAppRequest;
    /**
     * A collection of settings to drive user interface in SmartThings clients.
     * Currently, only applicable for LAMBDA_SMART_APP and WEBHOOK_SMART_APP app types.
     */
    ui?: AppUISettings;
}
export interface AppCreateRequest extends AppUpdateRequest {
    /**
     * A globally unique, developer-defined identifier for an app. It is
     * alpha-numeric, may contain dashes, underscores, periods, and must
     * be less then 250 characters long.
     */
    appName: string;
    /**
     * Denotes the principal type to be used with the app.
     * Default is LOCATION.
     */
    principalType?: PrincipalType;
    /**
     * App OAuth settings.
     */
    oauth?: Partial<AppOAuthRequest>;
}
export interface PagedApp extends AppBase {
    /**
     * A globally unique identifier for an app.
     */
    appId: string;
    /**
     * A default icon image for the app.
     */
    iconImage: Required<IconImage>;
    /**
     * A typed model which provides information around ownership of a specific domain.
     */
    owner: Owner;
    /**
     * A UTC ISO-8601 Date-Time String
     */
    createdDate: string;
    /**
     * A UTC ISO-8601 Date-Time String
     */
    lastUpdatedDate: string;
}
export interface AppResponse extends PagedApp {
    /**
     * Denotes the principal type to be used with the app.
     * Default is LOCATION.
     */
    principalType: PrincipalType;
    /**
     * Inform the installation systems that a particular app can only be
     * installed once within a user's account.
     */
    singleInstance: boolean;
    /**
     * System generated metadata that impacts eligibility requirements around
     * installing an App.
     */
    installMetadata: {
        [key: string]: string;
    };
    lambdaSmartApp?: LambdaSmartApp;
    webhookSmartApp?: WebhookSmartApp;
    apiOnly?: ApiOnlyApp;
    ui: AppUISettings;
}
export interface AppCreationResponse {
    app: AppResponse;
    oauthClientId: string;
    oauthClientSecret: string;
}
export interface GenerateAppOAuthRequest {
    /**
     * A name given to the OAuth Client.
     */
    clientName: string;
    /**
     * A list of SmartThings API OAuth scope identifiers that maybe required to
     * execute your integration.
     */
    scope: string[];
}
export interface AppOAuthRequest extends GenerateAppOAuthRequest {
    /**
     * A list of redirect URIs.
     */
    redirectUris: string[];
}
export type AppOAuthResponse = AppOAuthRequest;
export interface GenerateAppOAuthResponse {
    oauthClientDetails: AppOAuthResponse;
    oauthClientId: string;
    oauthClientSecret: string;
}
export interface AppSettingsRequest {
    settings?: {
        [key: string]: string;
    };
}
export type AppSettingsResponse = Required<AppSettingsRequest>;
export interface AppListOptions {
    appType?: AppType;
    classification?: AppClassification | AppClassification[];
    tag?: {
        [key: string]: string;
    };
}
export declare class AppsEndpoint extends Endpoint {
    constructor(config: EndpointClientConfig);
    /**
     * Returns a list of all apps belonging to the principal (i.e. the user)
     */
    list(options?: AppListOptions): Promise<PagedApp[]>;
    /**
     * Returns a specific app
     * @param id either the appId UUID or the appName unique name
     */
    get(id: string): Promise<AppResponse>;
    /**
     * Create a new app. For WEBHOOK_SMART_APPs the default SignatureType is ST_PADLOCK.
     * @param data the app definition
     */
    create(data: AppCreateRequest): Promise<AppCreationResponse>;
    /**
     * Update an existing app
     * @param id either the appId UUID or the appName unique name
     * @param data the new app definition
     */
    update(id: string, data: AppUpdateRequest): Promise<AppResponse>;
    /**
     * Get the settings of an app. Settings are string name/value pairs for optional use by the app developer.
     * @param id either the appId UUID or the appName unique name
     */
    getSettings(id: string): Promise<AppSettingsResponse>;
    /**
     * Update the settings of an app. Settings are string name/value pairs for optional use by the app developer.
     * @param id either the appId UUID or the appName unique name
     * @param data the new app settings
     */
    updateSettings(id: string, data: AppSettingsRequest): Promise<AppSettingsResponse>;
    /**
     * Update the signature type of an app. The signature type determines what mechanism is used to verify
     * the identity of endpoint apps
     * @param id either the appId UUID or the appName unique name
     * @param signatureType the new signature type
     */
    updateSignatureType(id: string, signatureType: SignatureType): SuccessResponse;
    /**
     * Pings the targetUrl of the app to verify its existence. Endpoint apps and API Access apps must be registed
     * in order to receive events from SmartThings.
     * @param id either the appId UUID or the appName unique name
     */
    register(id: string): SuccessResponse;
    /**
     * Returns the OAuth information for this app, including the name, scopes, and redirect URLs, if any
     * @param id either the appId UUID or the appName unique name
     */
    getOauth(id: string): Promise<AppOAuthResponse>;
    /**
     * Updates the OAuth defintion for this app. Use this method to change the scopes or redirect
     * URLs (for API access apps). This method does not change the clientId or clientSecret of the app.
     * @param id either the appId UUID or the appName unique name
     * @param data new OAuth definition
     */
    updateOauth(id: string, data: AppOAuthRequest): Promise<AppOAuthResponse>;
    /**
     * Regenerate clientId and clientSecret for this app. Note that this operation will result in any currently
     * authorized installed app instances to need to be re-authorized to make calls to SmartThings.
     * @param id either the appId UUID or the appName unique name
     * @param data new OAuth definition
     */
    regenerateOauth(id: string, data: GenerateAppOAuthRequest): Promise<GenerateAppOAuthResponse>;
    /**
     * Deletes the specified app
     * @param id either the appId UUID or the appName unique name
     */
    delete(id: string): SuccessResponse;
}
//# sourceMappingURL=apps.d.ts.map