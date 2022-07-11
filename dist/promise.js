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
exports.TooManyRequestsError = void 0;
const scholarly_1 = require("@millenmortier/scholarly");
const wait_1 = __importDefault(require("./wait"));
class TooManyRequestsError extends Error {
}
exports.TooManyRequestsError = TooManyRequestsError;
/**
 * Keep pulling scholar results until there's nothing left anymore
 *
 * We should be really tentative with sending requests to Google, since they
 * rate limit very heavily, so we wait 2seconds in between each call
 */
function query(query, limit) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        let allResults = [];
        let startOffset = 0;
        let pageSize = 10; // Google Scholar page size always seems to be 10. Don't think there's a way to change this
        let foundResults;
        let callCount = 0;
        try {
            while (foundResults !== 0 || foundResults < limit) {
                if (callCount > 0) {
                    yield (0, wait_1.default)(2000);
                }
                const results = yield (0, scholarly_1.search)(query, startOffset);
                allResults = allResults.concat(results);
                startOffset += pageSize;
                foundResults = results.length;
            }
            if (foundResults > limit) {
                allResults = allResults.slice(0, limit);
            }
        }
        catch (err) {
            if (((_a = err.response) === null || _a === void 0 ? void 0 : _a.status) === 429) {
                // Too many requests
                throw new TooManyRequestsError((_b = err.response) === null || _b === void 0 ? void 0 : _b.data);
            }
            else {
                throw err;
            }
        }
        return allResults;
    });
}
exports.default = query;
