"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var core_1 = require("@angular/core");
require("rxjs/add/operator/filter");
require("rxjs/add/operator/map");
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var BroadcastService = (function () {
    function BroadcastService() {
        this._msalSubject = new BehaviorSubject_1.BehaviorSubject(1);
        this.msalItem$ = this._msalSubject.asObservable();
    }
    BroadcastService.prototype.broadcast = function (type, payload) {
        this._msalSubject.next({ type: type, payload: payload });
    };
    BroadcastService.prototype.getMSALSubject = function () {
        return this._msalSubject;
    };
    BroadcastService.prototype.getMSALItem = function () {
        return this.msalItem$;
    };
    BroadcastService.prototype.subscribe = function (type, callback) {
        return this.msalItem$
            .filter(function (message) { return message.type === type; })
            .map(function (message) { return message.payload; })
            .subscribe(callback);
    };
    BroadcastService = tslib_1.__decorate([
        core_1.Injectable(),
        tslib_1.__metadata("design:paramtypes", [])
    ], BroadcastService);
    return BroadcastService;
}());
exports.BroadcastService = BroadcastService;
//# sourceMappingURL=broadcast.service.js.map