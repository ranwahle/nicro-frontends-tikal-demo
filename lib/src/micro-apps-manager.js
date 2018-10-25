var router_1 = require('@frontend/router');
/**
 * This class configure micro apps
 */
var MicroAppsManager = (function () {
    function MicroAppsManager() {
    }
    MicroAppsManager.prototype.configuraArea = function (areaConfig) {
        this.areaConfigOptions = areaConfig;
    };
    MicroAppsManager.prototype.initApps = function (micorApps) {
        var _this = this;
        var router = new router_1.FrontendRouter();
        micorApps.forEach(function (app) {
            router.add(app.name, function () { return _this.showFrame(app); });
            _this.createFrame(app);
        });
    };
    MicroAppsManager.prototype.showFrame = function (app) {
    };
    MicroAppsManager.prototype.createFrame = function (app) {
        if (!this.areaConfigOptions) {
            throw ({ message: 'please set area configuration by using configureArea method' });
        }
        var frameArea = document.querySelector(this.areaConfigOptions.frameAreaSelector);
        if (!frameArea) {
            throw ({ message: "No element found by the selector \"" + this.areaConfigOptions.frameAreaSelector + "\"" });
        }
        var frame = document.createElement('iframe');
        frame.id = "micro-app-frame-" + app.name;
        frameArea.appendChild(frame);
    };
    return MicroAppsManager;
})();
exports.MicroAppsManager = MicroAppsManager;
//# sourceMappingURL=micro-apps-manager.js.map