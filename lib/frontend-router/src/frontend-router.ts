import {ApplicationRoute} from './model/application-route';

/**
 *  this class is taken from http://krasimirtsonev.com/blog/article/A-modern-JavaScript-router-in-100-lines-history-api-pushState-hash-url
 */
export class FrontendRouter {

    private static router: FrontendRouter;
    _lastRouteResolved: any = null;
    routes: ApplicationRoute[] = [];
    _useHash: boolean = false;
    _hash: any = null;
    root: string;
    _notFoundHandler: any;
    _genericHooks: any;
    PARAMETER_REGEXP = /([:*])(\w+)/g;
    WILDCARD_REGEXP = /\*/g;
    REPLACE_VARIABLE_REGEXP = '([^\/]+)';
    REPLACE_WILDCARD = '(?:.*)';
    FOLLOWED_BY_SLASH_REGEXP = '(?:\/$|$)';
    MATCH_REGEXP_FLAGS = '';
    _defaultHandler: any;
    _listeningInterval: any;
    private _paused: boolean;

    static getRouter() {
        FrontendRouter.router = FrontendRouter.router || new FrontendRouter();

        return FrontendRouter.router;

    }

    _callLeave() {
        const lastRouteResolved = this._lastRouteResolved;

        if (lastRouteResolved && lastRouteResolved.hooks && lastRouteResolved.hooks.leave) {
            lastRouteResolved.hooks.leave(lastRouteResolved.params);
        }
    }

    isHashedRoot(url, useHash, hash): boolean {
        if (this.isPushStateAvailable() && !useHash) {
            return false;
        }
        if (!url.match(hash)) {
            return false;
        }
        let split = url.split(hash);
        return split.length < 2 || split[1] === '';
    }

    getAppRoot(url, routes) {
        var matched = routes.map(
            route => route.route === '' || route.route === '*' ? url : url.split(new RegExp(route.route + '($|\/)'))[0]
        )
        var fallbackURL = this.clean(url);

        if (matched.length > 1) {
            return matched.reduce((result, url) => {
                if (result.length > url.length) result = url;
                return result;
            }, matched[0]);
        } else if (matched.length === 1) {
            return matched[0];
        }
        return fallbackURL;
    }

    config(options: any) {
        this.root = options.root;
    }

    add(url: string, handler: () => void) {
        this.routes.push({url, handler})
    }

    listen() {
        // if (this.usePushState) {
        window.addEventListener('popstate', (args) => {
            this._onLocationChange(null)
        });
        window.addEventListener('pushstate', (args: any) => {
            this._onLocationChange(null)
        });

        let lastUrl = this.root;//  this._cLoc();
        let current = window.location.pathname;
        const scheduleCheck = () => {

            current = this.cleanLocation();
            if (lastUrl !== current) {
                lastUrl = current;
                this.resolve();
            }
            this._listeningInterval = setTimeout(scheduleCheck, 200);
        }
        scheduleCheck();


    }

    cleanLocation() {
        if (typeof window !== 'undefined') {
            if (typeof (window as any).__NAVIGO_WINDOW_LOCATION_MOCK__ !== 'undefined') {
                return (window as any).__NAVIGO_WINDOW_LOCATION_MOCK__;
            }
            return this.clean(window.location.href);
        }
        return '';
    }

    clean(s) {
        s = s || '';
        if (s instanceof RegExp) return s;
        return s.replace(/\/+$/, '').replace(/^\/+/, '^/');
    }

    _findLinks() {
        return [].slice.call(document.querySelectorAll('[data-navigo]'));
    }

    _onLocationChange(args) {
        this.resolve(args);
    }

    extractGETParameters(url) {
        return url.split(/\?(.*)?$/).slice(1).join('');
    }

    isPushStateAvailable() {
        return !!(
            typeof window !== 'undefined' &&
            window.history &&
            window.history.pushState
        );
    }

    getOnlyURL(url, useHash, hash) {
        let onlyURL = url, split;
        let cleanGETParam = str => str.split(/\?(.*)?$/)[0];

        if (typeof hash === 'undefined') {
            // To preserve BC
            hash = '#';
        }

        if (this.isPushStateAvailable() && !useHash) {
            onlyURL = cleanGETParam(url).split(hash)[0];
        } else {
            split = url.split(hash);
            onlyURL = split.length > 1 ? cleanGETParam(split[1]) : cleanGETParam(split[0]);
        }

        return onlyURL;
    }

    _getRoot() {
        if (this.root !== null) return this.root;
        this.root = this.getAppRoot(this.cleanLocation().split('?')[0], this.routes);
        return this.root;
    }

    manageHooks(handler, hooks?, params?) {
        if (hooks && typeof hooks === 'object') {
            if (hooks.before) {
                hooks.before((shouldRoute = true) => {
                    if (!shouldRoute) return;
                    handler();
                    hooks.after && hooks.after(params);
                }, params);
                return;
            } else if (hooks.after) {
                handler();
                hooks.after && hooks.after(params);
                return;
            }
        }
        handler();
    }

    replaceDynamicURLParts(route) {
        var paramNames = [], regexp;
        if (route instanceof RegExp) {
            regexp = route;
        } else {
            regexp = new RegExp(
                route.replace(this.PARAMETER_REGEXP, function (full, dots, name) {
                    paramNames.push(name);
                    return this.REPLACE_VARIABLE_REGEXP;
                })
                    .replace(this.WILDCARD_REGEXP, this.REPLACE_WILDCARD) + this.FOLLOWED_BY_SLASH_REGEXP
                , this.MATCH_REGEXP_FLAGS);
        }
        return {regexp, paramNames};
    }

    regExpResultToParams(match, names) {
        if (names.length === 0) return null;
        if (!match) return null;
        return match
            .slice(1, match.length)
            .reduce((params, value, index) => {
                if (params === null) params = {};
                params[names[index]] = decodeURIComponent(value);
                return params;
            }, null);
    }

    findMatchedRoutes(url, routes = []) {

        const result = routes
            .map(route => {
               // return route.url &&  url.startsWith(`/${route.url}`)
                const {regexp, paramNames} = this.replaceDynamicURLParts(this.clean(route.url));
                // const match = url.replace(/^\/+/, '/').match(regexp);
                const match = url.startsWith(`/${route.url}`) ? route.url : false;
                const params = this.regExpResultToParams(match, paramNames);
                return match ? {match, route, params} : false;
            });



        return result.filter(m => m);;
    }

    match(url, routes) {
        return this.findMatchedRoutes(url, routes)[0] || false;
    }

    resolve(current?) {
        current = current || window.location.pathname;
        var handler, m;
        const url = (current || this.cleanLocation()).replace(this._getRoot(), '');


        let GETParameters = this.extractGETParameters(current || this.cleanLocation());
        let onlyURL = this.getOnlyURL(url, this._useHash, this._hash);

        if (this._paused) return false;

        if (
            this._lastRouteResolved &&
            onlyURL === this._lastRouteResolved.url &&
            GETParameters === this._lastRouteResolved.query
        ) {
            if (this._lastRouteResolved.hooks && this._lastRouteResolved.hooks.already) {
                this._lastRouteResolved.hooks.already(this._lastRouteResolved.params);
            }
            return false;
        }

        m = this.match(onlyURL, this.routes);

        if (m) {
            this._callLeave();
            this._lastRouteResolved = {
                url: onlyURL,
                query: GETParameters,
                hooks: m.route.hooks,
                params: m.params,
                name: m.route.name
            };
            handler = m.route.handler;


            this.manageHooks(() => {
                this.manageHooks(() => {
                    m.route.route instanceof RegExp ?
                        handler(...(m.match.slice(1, m.match.length))) :
                        handler(m.params, GETParameters);
                }, m.route.hooks, m.params);
            }, this._genericHooks, m.params);
            return m;
        } else if (this._defaultHandler && (
            onlyURL === '' ||
            onlyURL === '/' ||
            onlyURL === this._hash ||
            this.isHashedRoot(onlyURL, this._useHash, this._hash)
        )) {
            this.manageHooks(() => {
                this.manageHooks(() => {
                    this._callLeave();
                    this._lastRouteResolved = {url: onlyURL, query: GETParameters, hooks: this._defaultHandler.hooks};
                    this._defaultHandler.handler(GETParameters);
                }, this._defaultHandler.hooks);
            }, this._genericHooks);
            return true;
        } else if (this._notFoundHandler) {
            this.manageHooks(() => {
                this.manageHooks(() => {
                    this._callLeave();
                    this._lastRouteResolved = {url: onlyURL, query: GETParameters, hooks: this._notFoundHandler.hooks};
                    this._notFoundHandler.handler(GETParameters);
                }, this._notFoundHandler.hooks);
            }, this._genericHooks);
        }
        return false;
    }

}