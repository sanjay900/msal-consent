"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var Observable_1 = require("rxjs/Observable");
require("rxjs/add/observable/fromPromise");
require("rxjs/add/operator/mergeMap");
var msal_service_1 = require("./msal.service");
var broadcast_service_1 = require("./broadcast.service");
var MsalInterceptor = (function () {
    function MsalInterceptor(auth, broadcastService) {
        this.auth = auth;
        this.broadcastService = broadcastService;
    }
    MsalInterceptor.prototype.intercept = function (req, next) {
        var _this = this;
        var scopes = this.auth.getScopesForEndpoint(req.url);
        this.auth.verbose('Url: ' + req.url + ' maps to scopes: ' + scopes);
        if (scopes === null) {
            return next.handle(req);
        }
        var tokenStored = this.auth.getCachedTokenInternal(scopes);
        if (tokenStored && tokenStored.token) {
            req = req.clone({
                setHeaders: {
                    Authorization: "Bearer " + tokenStored.token,
                }
            });
            return next.handle(req).do(function (event) { }, function (err) {
                if (err instanceof http_1.HttpErrorResponse && err.status == 401) {
                    var scopes = _this.auth.getScopesForEndpoint(req.url);
                    var tokenStored = _this.auth.getCachedTokenInternal(scopes);
                    if (tokenStored && tokenStored.token) {
                        _this.auth.clearCacheForScope(tokenStored.token);
                    }
                    _this.broadcastService.broadcast('msal:notAuthorized', { err: err, scopes: scopes });
                }
            });
        }
        else {
            return Observable_1.Observable.fromPromise(this.auth.acquireTokenSilent(scopes).then(function (token) {
                var JWT = "Bearer " + token;
                return req.clone({
                    setHeaders: {
                        Authorization: JWT,
                    },
                });
            })).mergeMap(function (req) { return next.handle(req).do(function (event) { }, function (err) {
                if (err instanceof http_1.HttpErrorResponse && err.status == 401) {
                    var scopes = _this.auth.getScopesForEndpoint(req.url);
                    var tokenStored = _this.auth.getCachedTokenInternal(scopes);
                    if (tokenStored && tokenStored.token) {
                        _this.auth.clearCacheForScope(tokenStored.token);
                    }
                    _this.broadcastService.broadcast('msal:notAuthorized', { err: err, scopes: scopes });
                }
            }); }); //calling next.handle means we are passing control to next interceptor in chain
        }
    };
    MsalInterceptor = tslib_1.__decorate([
        core_1.Injectable(),
        tslib_1.__metadata("design:paramtypes", [msal_service_1.MsalService, broadcast_service_1.BroadcastService])
    ], MsalInterceptor);
    return MsalInterceptor;
}());
exports.MsalInterceptor = MsalInterceptor;
//# sourceMappingURL=msal.interceptor.js.map