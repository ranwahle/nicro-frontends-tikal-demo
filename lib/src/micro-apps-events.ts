export const MICRO_APPS_EVENTS = {
    loaded: 'loaded',
    routeChanged: 'routeChanged'
}

export class MicroAppsEvents {
    dispatchAppEvent(eventName: string, args: any) {
        const parent: any = window.parent;
        if (parent && parent !== window
         && parent.appEvents && parent.appEvents.appEventDispatch) {
            parent.appEvents.appEventDispatch(eventName)
        }
    }
}