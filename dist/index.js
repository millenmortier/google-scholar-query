"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryAsPromise = exports.queryAsEvent = void 0;
var event_1 = require("./event");
Object.defineProperty(exports, "queryAsEvent", { enumerable: true, get: function () { return __importDefault(event_1).default; } });
var promise_1 = require("./promise");
Object.defineProperty(exports, "queryAsPromise", { enumerable: true, get: function () { return __importDefault(promise_1).default; } });
