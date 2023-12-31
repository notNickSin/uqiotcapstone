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
exports.CapabilitiesEndpoint = exports.CapabilityPresentationOperator = exports.CustomCapabilityStatus = exports.CapabilitySchemaPropertyName = void 0;
const endpoint_1 = require("../endpoint");
const endpoint_client_1 = require("../endpoint-client");
const types_1 = require("../types");
var CapabilitySchemaPropertyName;
(function (CapabilitySchemaPropertyName) {
    CapabilitySchemaPropertyName["VALUE"] = "value";
    CapabilitySchemaPropertyName["UNIT"] = "unit";
    CapabilitySchemaPropertyName["DATA"] = "data";
})(CapabilitySchemaPropertyName = exports.CapabilitySchemaPropertyName || (exports.CapabilitySchemaPropertyName = {}));
var CustomCapabilityStatus;
(function (CustomCapabilityStatus) {
    CustomCapabilityStatus["PROPOSED"] = "proposed";
    CustomCapabilityStatus["LIVE"] = "live";
    CustomCapabilityStatus["DEPRECATED"] = "deprecated";
    CustomCapabilityStatus["DEAD"] = "dead";
})(CustomCapabilityStatus = exports.CustomCapabilityStatus || (exports.CustomCapabilityStatus = {}));
var CapabilityPresentationOperator;
(function (CapabilityPresentationOperator) {
    CapabilityPresentationOperator["CONTAINS"] = "CONTAINS";
    CapabilityPresentationOperator["DOES_NOT_CONTAIN"] = "DOES_NOT_CONTAIN";
    CapabilityPresentationOperator["EQUALS"] = "EQUALS";
    CapabilityPresentationOperator["DOES_NOT_EQUAL"] = "DOES_NOT_EQUAL";
    CapabilityPresentationOperator["GREATER_THAN"] = "GREATER_THAN";
    CapabilityPresentationOperator["GREATER_THAN_OR_EQUALS"] = "GREATER_THAN_OR_EQUALS";
    CapabilityPresentationOperator["LESS_THAN"] = "LESS_THAN";
    CapabilityPresentationOperator["LESS_THAN_OR_EQUALS"] = "LESS_THAN_OR_EQUALS";
})(CapabilityPresentationOperator = exports.CapabilityPresentationOperator || (exports.CapabilityPresentationOperator = {}));
class CapabilitiesEndpoint extends endpoint_1.Endpoint {
    constructor(config) {
        super(new endpoint_client_1.EndpointClient('capabilities', config));
    }
    /**
     * Get a list of custom capabilities for the given namespace.
     */
    list(namespace) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.client.getPagedItems(`namespaces/${namespace}`);
        });
    }
    listNamespaces() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.client.get('namespaces');
        });
    }
    /**
     * Gets a list of standard capabilities.
     */
    listStandard() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.client.getPagedItems();
        });
    }
    listVersions(capabilityId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.client.getPagedItems(capabilityId);
        });
    }
    get(capabilityId, capabilityVersion) {
        return this.client.get(`${capabilityId}/${capabilityVersion}`);
    }
    create(capability, params) {
        return this.client.post(undefined, capability, params);
    }
    update(capabilityId, capabilityVersion, capability) {
        return this.client.put(`${capabilityId}/${capabilityVersion}`, capability);
    }
    delete(capabilityId, capabilityVersion) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.delete(`${capabilityId}/${capabilityVersion}`);
            return types_1.SuccessStatusValue;
        });
    }
    getPresentation(capabilityId, capabilityVersion) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.client.get(`${capabilityId}/${capabilityVersion}/presentation`);
        });
    }
    createPresentation(capabilityId, capabilityVersion, presentation) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.client.post(`${capabilityId}/${capabilityVersion}/presentation`, presentation);
        });
    }
    updatePresentation(capabilityId, capabilityVersion, presentation) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.client.put(`${capabilityId}/${capabilityVersion}/presentation`, presentation);
        });
    }
    /**
     * Returns a list of the locales supported by the device profile
     * @param capabilityId UUID of the device profile
     * @param capabilityVersion version number of the capability, starting with 1
     */
    listLocales(capabilityId, capabilityVersion) {
        return this.client.getPagedItems(`${capabilityId}/${capabilityVersion}/i18n`);
    }
    /**
     *
     * @param capabilityId ID of the capability
     * @param tag locale tag, e.g. 'en', 'es', or 'ko'
     * @param capabilityVersion version number of the capability, starting with 1
     */
    getTranslations(capabilityId, capabilityVersion, tag) {
        return this.client.get(`${capabilityId}/${capabilityVersion}/i18n/${tag}`);
    }
    /**
     * Create the translations for a capability
     * @param capabilityId ID of the capability
     * @param capabilityVersion version number of the capability, starting with 1
     * @param data translations
     */
    createTranslations(capabilityId, capabilityVersion, data) {
        return this.client.post(`${capabilityId}/${capabilityVersion}/i18n`, data);
    }
    /**
     * Update the translations for a capability
     * @param capabilityId ID of the capability
     * @param capabilityVersion version number of the capability, starting with 1
     * @param data translations
     */
    updateTranslations(capabilityId, capabilityVersion, data) {
        return this.client.put(`${capabilityId}/${capabilityVersion}/i18n/${data.tag}`, data);
    }
    /**
     * Create or update the translations for a capability
     * @param capabilityId ID of the capability
     * @param capabilityVersion version number of the capability, starting with 1
     * @param data translations
     */
    upsertTranslations(capabilityId, capabilityVersion, data) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.createTranslations(capabilityId, capabilityVersion, data);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            }
            catch (error) {
                if ((_a = error.message) === null || _a === void 0 ? void 0 : _a.includes('Localization already exists')) {
                    return this.updateTranslations(capabilityId, capabilityVersion, data);
                }
                throw error;
            }
        });
    }
    /**
     * Retrieve the translations for the specified locale
     * @param capabilityId ID of the capability
     * @param capabilityVersion version number of the capability, starting with 1
     * @param tag locale tag, e.g. 'en', 'es', or 'ko'
     */
    deleteTranslations(capabilityId, capabilityVersion, tag) {
        return this.client.delete(`${capabilityId}/${capabilityVersion}/i18n/${tag}`);
    }
}
exports.CapabilitiesEndpoint = CapabilitiesEndpoint;
