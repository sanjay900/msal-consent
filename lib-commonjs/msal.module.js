"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var msal_service_1 = require("./msal.service");
var msal_guard_service_1 = require("./msal-guard.service");
var broadcast_service_1 = require("./broadcast.service");
core_1.Injectable();
var WindowWrapper = (function (_super) {
    tslib_1.__extends(WindowWrapper, _super);
    function WindowWrapper() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return WindowWrapper;
}(Window));
exports.WindowWrapper = WindowWrapper;
var MsalModule = (function () {
    function MsalModule() {
    }
    MsalModule_1 = MsalModule;
    MsalModule.forRoot = function (config) {
        return {
            ngModule: MsalModule_1,
            providers: [
                { provide: msal_service_1.MSAL_CONFIG, useValue: config }, msal_service_1.MsalService, { provide: WindowWrapper, useValue: window }
            ]
        };
    };
    MsalModule = MsalModule_1 = tslib_1.__decorate([
        core_1.NgModule({
            imports: [common_1.CommonModule],
            declarations: [],
            providers: [msal_guard_service_1.MsalGuard, broadcast_service_1.BroadcastService],
        })
    ], MsalModule);
    return MsalModule;
    var MsalModule_1;
}());
exports.MsalModule = MsalModule;
//# sourceMappingURL=msal.module.js.map