import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import { BehaviorSubject } from "rxjs/BehaviorSubject";
var BroadcastService = (function () {
    function BroadcastService() {
        this._msalSubject = new BehaviorSubject(1);
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
        Injectable(),
        tslib_1.__metadata("design:paramtypes", [])
    ], BroadcastService);
    return BroadcastService;
}());
export { BroadcastService };
//# sourceMappingURL=broadcast.service.js.map