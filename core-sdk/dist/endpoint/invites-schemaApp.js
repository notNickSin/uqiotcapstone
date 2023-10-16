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
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvitesSchemaAppEndpoint = void 0;
const endpoint_client_1 = require("../endpoint-client");
const endpoint_1 = require("../endpoint");
class InvitesSchemaAppEndpoint extends endpoint_1.Endpoint {
    constructor(config) {
        super(new endpoint_client_1.EndpointClient('invites/schemaApp', config));
    }
    create(schemaAppInvitation) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.client.post('', schemaAppInvitation);
        });
    }
    list(schemaAppId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.client.getPagedItems('', { schemaAppId });
        });
    }
    revoke(invitationId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.delete(invitationId);
        });
    }
    getAcceptanceStatus(invitationId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.client.get('checkAcceptance', { invitationId });
        });
    }
    accept(shortCode) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.client.put(`${shortCode}/accept`);
        });
    }
}
exports.InvitesSchemaAppEndpoint = InvitesSchemaAppEndpoint;
