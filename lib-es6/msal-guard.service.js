import * as tslib_1 from "tslib";
import { Inject, Injectable } from "@angular/core";
import { ActivatedRoute, Router, } from "@angular/router";
import { MSAL_CONFIG, MsalService } from "./msal.service";
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/pairwise';
import { Location, PlatformLocation } from "@angular/common";
import { MsalConfig } from "./msal-config";
import { BroadcastService } from "./broadcast.service";
import { Constants } from "msal";
var MsalGuard = (function () {
    function MsalGuard(config, authService, router, activatedRoute, location, platformLocation, broadcastService) {
        this.config = config;
        this.authService = authService;
        this.router = router;
        this.activatedRoute = activatedRoute;
        this.location = location;
        this.platformLocation = platformLocation;
        this.broadcastService = broadcastService;
        this.isEmpty = function (str) {
            return (typeof str === "undefined" || !str || 0 === str.length);
        };
    }
    MsalGuard.prototype.canActivate = function (route, state) {
        var _this = this;
        this.authService.getLogger().verbose("location change event from old url to new url");
        this.authService.updateDataFromCache([this.config.clientID]);
        if (!this.authService._oauthData.isAuthenticated && !this.authService._oauthData.userName) {
            if (state.url) {
                if (!this.authService._renewActive && !this.authService.loginInProgress()) {
                    var loginStartPage = this.getBaseUrl() + state.url;
                    if (loginStartPage !== null) {
                        this.authService.getCacheStorage().setItem(Constants.angularLoginRequest, loginStartPage);
                    }
                    if (this.config.popUp) {
                        return new Promise(function (resolve, reject) {
                            _this.authService.loginPopup(_this.config.consentScopes, _this.config.extraQueryParameters).then(function (token) {
                                resolve(true);
                            }, function (error) {
                                reject(false);
                            });
                        });
                    }
                    else {
                        this.authService.loginRedirect(this.config.consentScopes, this.config.extraQueryParameters);
                    }
                }
            }
        }
        else if (!this.authService._oauthData.isAuthenticated && this.authService._oauthData.userName) {
            this.authService.acquireTokenSilent([this.config.clientID]).then(function (token) {
                if (token) {
                    _this.authService._oauthData.isAuthenticated = true;
                    _this.broadcastService.broadcast("msal:loginSuccess", token);
                }
            }, function (error) {
                _this.broadcastService.broadcast("msal:loginFailure", { error: error });
            });
        }
        else {
            return true;
        }
    };
    MsalGuard.prototype.getBaseUrl = function () {
        var currentAbsoluteUrl = window.location.href;
        var currentRelativeUrl = this.location.path();
        if (this.isEmpty(currentRelativeUrl)) {
            if (currentAbsoluteUrl.endsWith("/")) {
                currentAbsoluteUrl = currentAbsoluteUrl.replace(/\/$/, '');
            }
            return currentAbsoluteUrl;
        }
        else {
            var index = currentAbsoluteUrl.indexOf(currentRelativeUrl);
            return currentAbsoluteUrl.substring(0, index);
        }
    };
    MsalGuard = tslib_1.__decorate([
        Injectable(),
        tslib_1.__param(0, Inject(MSAL_CONFIG)),
        tslib_1.__metadata("design:paramtypes", [MsalConfig, MsalService, Router, ActivatedRoute, Location, PlatformLocation, BroadcastService])
    ], MsalGuard);
    return MsalGuard;
}());
export { MsalGuard };
//# sourceMappingURL=msal-guard.service.js.map