import {Component, Input, OnInit} from '@angular/core';
import {AppsState} from '../store/app.reducers';

interface AppMenu {
    appName: string;
    loaded: boolean;
}

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

    appsMenu: AppMenu[];

    constructor() {
    }

    private _apps: AppsState;

    @Input() set apps(apps: AppsState) {
        this._apps = apps;
        this.appsMenu = this.toAppsMenu(apps);
    }

    toAppsMenu(apps: AppsState) {
        return Object.keys(apps).map(key => ({appName: key, loaded: apps[key].loaded, title: apps[key].title}))
    }

    ngOnInit() {
    }

    navigationOccured(evt) {
        history.pushState({},
            evt.srcElement.attributes['href'].value,
            evt.srcElement.attributes['href'].value)
        evt.preventDefault();

    }

    render() {
      // const jQueryApp  = new TeamsComponent();
        const jQueryApp = document.createElement('teams-component');
       document.body.appendChild(jQueryApp)
    }

}
