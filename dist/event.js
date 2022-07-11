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
const events_1 = require("events");
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
function query(query) {
    const emitter = new events_1.EventEmitter();
    (() => __awaiter(this, void 0, void 0, function* () {
        var _a;
        let startOffset = 0;
        let pageSize = 10; // Google Scholar page size always seems to be 10. Don't think there's a way to change this
        let foundResults;
        let callCount = 0;
        try {
            while (foundResults !== 0) {
                if (callCount > 0) {
                    yield (0, wait_1.default)(2000);
                }
                const results = yield (0, scholarly_1.search)(query, startOffset);
                startOffset += pageSize;
                foundResults = results.length;
                if (foundResults > 0) {
                    emitter.emit('data', results);
                }
            }
        }
        catch (err) {
            if (((_a = err.response) === null || _a === void 0 ? void 0 : _a.status) === 429) {
                // Too many requests
                emitter.emit('tooManyRequests', err);
            }
            else {
                emitter.emit('error', err);
            }
        }
        emitter.emit('end');
    }))();
    return emitter;
}
exports.default = query;
