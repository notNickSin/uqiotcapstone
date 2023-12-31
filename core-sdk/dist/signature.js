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
exports.SignatureVerifier = exports.HttpKeyResolver = void 0;
const axios_1 = __importDefault(require("axios"));
const sshpk_1 = __importDefault(require("sshpk"));
const http_signature_1 = __importDefault(require("http-signature"));
const endpoint_client_1 = require("./endpoint-client");
class HttpKeyResolver {
    constructor(config) {
        this.keyApiUrl = endpoint_client_1.defaultSmartThingsURLProvider.keyApiURL;
        this.keyCache = undefined;
        this.keyCacheTTL = (24 * 60 * 60 * 1000);
        if (config) {
            if (config.urlProvider) {
                this.keyApiUrl = config.urlProvider.keyApiURL;
            }
            if (config.keyCacheTTL) {
                this.keyCacheTTL = config.keyCacheTTL || (24 * 60 * 60 * 1000);
            }
            this.keyCache = config.keyCache;
        }
    }
    /**
     * Get Public Key for specified Key ID.
     *
     * @param {String} keyId The Key ID as specified on Authorization header.
     * @returns {Promise.<Object>} Promise of Public key or null if no key available.
     */
    getKey(keyId) {
        return __awaiter(this, void 0, void 0, function* () {
            const cache = this.keyCache;
            if (!keyId) {
                return null;
            }
            let publicKey = cache ? cache.get(keyId) : undefined;
            if (publicKey) {
                return publicKey;
            }
            const response = yield axios_1.default.get(`${this.keyApiUrl}${keyId}`);
            const cert = sshpk_1.default.parseCertificate(response.data, 'pem');
            if (cert && cert.subjectKey) {
                publicKey = cert.subjectKey;
            }
            if (publicKey) {
                if (cache) {
                    cache.set(keyId, publicKey, this.keyCacheTTL);
                }
                return publicKey;
            }
            return null;
        });
    }
}
exports.HttpKeyResolver = HttpKeyResolver;
class SignatureVerifier {
    constructor(keyResolver, logger) {
        this.keyResolver = keyResolver;
        this.logger = logger;
    }
    isAuthorized(request) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const keyResolver = this.keyResolver;
                const parsed = http_signature_1.default.parseRequest(request, undefined);
                const publicKey = yield keyResolver.getKey(parsed.keyId);
                return http_signature_1.default.verifySignature(parsed, publicKey);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            }
            catch (error) {
                if (this.logger) {
                    this.logger.error(error.message | error);
                }
            }
            return false;
        });
    }
}
exports.SignatureVerifier = SignatureVerifier;
