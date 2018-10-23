import {MicroApp} from './model/micro-app';
import {AreaConfig} from './model/area-config';
import {FrontendRouter} from '../frontend-router';
import {EventManager} from './event-manager';
import {MicroAppsServiceManager} from './micro-apps-service-manager';
import {MICRO_APPS_EVENTS} from './micro-apps-events';

const anyWindow = window as any;

/**
 * This class configure micro apps
 */
export class MicroAppsManager {

    private areaConfigOptions: AreaConfig;
    private router: FrontendRouter;
    shownApp: MicroApp;
    apps: MicroApp[];

    constructor() {
        anyWindow.microAppsEventsManager = new EventManager();
        anyWindow.microAppsServiceManager = new MicroAppsServiceManager();
    }

    configuraArea(areaConfig: AreaConfig) {
        this.areaConfigOptions = areaConfig;
        this.router = FrontendRouter.getRouter();
    }

    initApps(microApps: MicroApp[]) {

        this.router.config({root: ''})
        microApps.forEach(app => {
            if (app.type !== 'component') {
                this.router.add(app.id, () => {
                    this.showFrame(app);
                    this.setAppState(app);
                    this.shownApp = app;
                })
                this.createFrame(app);
            } else {
                this.router.add(app.id, () => {
                    this.hideFrames();
                    this.showComponent(app);
                })
            }
        })
        this.router.add('', () => this.hideFrames())

        this.router.listen()



        this.apps = microApps;
    }

    /**
     * Gets micro app context window
     * @param {MicroApp} app
     * @returns {any}
     */
    getAppContextWindow(app: MicroApp) {
        return  (document.querySelector(`#micro-app-frame-${app.id}`) as any).contentWindow;
    }

    setAppState(app: MicroApp) {
        const contentWindow =  this.getAppContextWindow(app);
        if (contentWindow.setState) {
            contentWindow.setState(window.location.pathname.substring(`${app.id}/`.length))
        } else {
            const thisLocation = window.location.pathname;
            // Sure memory leak...
            anyWindow.microAppsEventsManager.subscribe(MICRO_APPS_EVENTS.loaded, args => {
                const contentApp = this.findAppByWindow(args.context);
                if (!contentApp) {
                    return;
                }
                if (app.id === contentApp.id && args.context.setState) {
                    args.context.setState(thisLocation.substring(`${app.id}/`.length))
                }
            })
        }
    }

    hideFrames() {
        const frames = document.querySelectorAll('iframe.micro-app-frame');
        for (let index = 0; index < frames.length; index++) {

            frames[index].classList.remove('shown');
        }
        if (!this.apps) {
            return;
        }
        const coponentApps = this.apps.filter(app => app.type === 'component');
        coponentApps.forEach(componentApp => {
            const componentElement =  document.querySelector(componentApp.componentId);
            if (componentElement) {
                componentElement.setAttribute('hidden', '')
            }
        });
    }
    findAppByComponentName(componentId) {
        return this.apps.find(app => app.componentId === componentId)
    }

    findAppByWindow(window) {
        const frames = document.querySelectorAll('iframe.micro-app-frame');
        for (let index = 0; index < frames.length; index++) {
            if ((frames[index] as any).contentWindow === window) {
                return this.apps.find(app => frames[index].id === `micro-app-frame-${app.id}`)
            }
        }
        return undefined;
    }
    showComponent(app: MicroApp) {
        const frameArea = document.querySelector(this.areaConfigOptions.frameAreaSelector);
        const component = document.createElement(app.componentId);
        frameArea.appendChild(component);
    }

    showFrame(app: MicroApp) {
        this.hideFrames();
        document.querySelector(`#micro-app-frame-${app.id}`).classList.add('shown')
    }

    createFrame(app: MicroApp) {
        if (!this.areaConfigOptions) {
            throw({message: 'please set area configuration by using configureArea method'})
        }
        const frameArea = document.querySelector(this.areaConfigOptions.frameAreaSelector);

        if (!frameArea) {
            const error = {message: `No element found by the selector "${this.areaConfigOptions.frameAreaSelector}"`};
            console.error('error init app', error)
            throw(error);
        }

        const frame = document.createElement('iframe');
        frame.id = `micro-app-frame-${app.id}`;
        frame.className = 'micro-app-frame';
        if (this.areaConfigOptions.frameContentFillingMethod === 'SourceUrl') {
            frame.src = app.entryUrl;
        } else {
            this.fetchContent(app, frame);
        }
        frameArea.appendChild(frame);


    }


    private fetchContent(app: MicroApp, frame) {
        fetch(app.entryUrl).then((response) => {
            response.text().then(content => {
                content = content.replace('<head>', `<head><base href="${app.entryUrl}">`)

                const frameWindow = frame.contentWindow;
                const frameDocument = frameWindow.document;

                frameDocument.write(content)
                frameDocument.close();
            })
        }, err => {
            console.error(`Unable to fetch ${app.entryUrl}`, err)
        })
    }


}