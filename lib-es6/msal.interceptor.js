import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/mergeMap';
import { MsalService } from "./msal.service";
import { BroadcastService } from "./broadcast.service";
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
                if (err instanceof HttpErrorResponse && err.status == 401) {
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
            return Observable.fromPromise(this.auth.acquireTokenSilent(scopes).then(function (token) {
                var JWT = "Bearer " + token;
                return req.clone({
                    setHeaders: {
                        Authorization: JWT,
                    },
                });
            })).mergeMap(function (req) { return next.handle(req).do(function (event) { }, function (err) {
                if (err instanceof HttpErrorResponse && err.status == 401) {
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
        Injectable(),
        tslib_1.__metadata("design:paramtypes", [MsalService, BroadcastService])
    ], MsalInterceptor);
    return MsalInterceptor;
}());
export { MsalInterceptor };
//# sourceMappingURL=msal.interceptor.js.map