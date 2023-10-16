import { EndpointClientConfig } from '../endpoint-client';
import { Endpoint } from '../endpoint';
export type SchemaAppId = {
    schemaAppId: string;
};
export type SchemaAppInvitationId = {
    invitationId: string;
};
export type SchemaAppInvitationSummary = {
    invitationId: string;
    acceptUrl: string;
};
export type SchemaAppInvitationCreate = SchemaAppId & {
    description?: string;
    acceptLimit?: number;
};
export type SchemaAppInvitation = SchemaAppId & {
    id: string;
    description?: string;
    expiration?: number;
    acceptUrl?: string;
    declineUrl?: string;
    shortCode?: string;
};
export type SchemaAppAcceptanceStatus = Omit<SchemaAppInvitation, 'id'> & {
    isAccepted?: boolean;
};
export declare class InvitesSchemaAppEndpoint extends Endpoint {
    constructor(config: EndpointClientConfig);
    create(schemaAppInvitation: SchemaAppInvitationCreate): Promise<SchemaAppInvitationId>;
    list(schemaAppId: string): Promise<SchemaAppInvitation[]>;
    revoke(invitationId: string): Promise<void>;
    getAcceptanceStatus(invitationId: string): Promise<SchemaAppAcceptanceStatus>;
    accept(shortCode: string): Promise<SchemaAppId>;
}
//# sourceMappingURL=invites-schemaApp.d.ts.map