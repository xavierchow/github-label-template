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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.Label = void 0;
var GH_HOST = "https://api.github.com";
var debug_1 = require("debug");
var debug = debug_1["default"]("gh-label-tmpl:Label");
var axios_1 = require("axios");
var assert = require("assert");
var Label = /** @class */ (function () {
    function Label(owner, repo, token) {
        this.owner = owner;
        this.repo = repo;
        this.token = token;
        this.axiosInstance = axios_1["default"].create({
            baseURL: GH_HOST + "/repos/" + this.owner + "/" + this.repo,
            headers: { "user-agent": "gh-label" }
        });
    }
    Label.prototype.getAll = function () {
        return __awaiter(this, void 0, void 0, function () {
            var config, resp;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        config = {
                            url: "/labels"
                        };
                        if (this.token) {
                            config.headers = {
                                Authorization: "token " + this.token
                            };
                        }
                        return [4 /*yield*/, this.axiosInstance.request(config)];
                    case 1:
                        resp = _a.sent();
                        debug("original labels: %j", resp);
                        return [2 /*return*/, resp.data.map(function (label) {
                                return { name: label.name, color: label.color };
                            })];
                }
            });
        });
    };
    Label.prototype.remove = function (labelName) {
        return __awaiter(this, void 0, void 0, function () {
            var config, resp;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        config = {
                            url: "/labels/" + labelName,
                            method: "DELETE",
                            headers: {
                                Authorization: "token " + this.token
                            }
                        };
                        return [4 /*yield*/, this.axiosInstance.request(config)];
                    case 1:
                        resp = _a.sent();
                        if (resp.status !== 204) {
                            throw new Error("DELETE label failed with statusCode " + resp.status);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Label.prototype.removeAll = function () {
        return __awaiter(this, void 0, void 0, function () {
            var createRemovePromise;
            var _this = this;
            return __generator(this, function (_a) {
                createRemovePromise = function (labelName) {
                    return _this.remove(labelName);
                };
                return [2 /*return*/, this.getAll()
                        .then(function (labels) {
                        return labels.map(function (l) { return createRemovePromise(l.name); });
                    })
                        .then(function (removePromises) {
                        return Promise.all(removePromises);
                    })];
            });
        });
    };
    Label.prototype.createAll = function (labels) {
        if (!Array.isArray(labels)) {
            return Promise.reject(new Error("Invalid import json"));
        }
        return Promise.all(labels.map(this.create, this));
    };
    Label.prototype.create = function (label) {
        assert(label.name);
        assert(label.color);
        var config = {
            url: "/labels",
            method: "POST",
            headers: {
                Authorization: "token " + this.token
            },
            data: label
        };
        return this.axiosInstance.request(config);
    };
    return Label;
}());
exports.Label = Label;
