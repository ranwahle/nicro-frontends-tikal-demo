import {Component, OnInit} from '@angular/core';
import {EventManager} from '../../../lib/src/event-manager';
import {Observable} from 'rxjs';
import {MicroAppsManager} from '../../../lib';
import {MicroAppInfo} from './model/micro-app-info';
import {AppLoadedAction} from './store/app.actions';
import {select, Store} from '@ngrx/store';
import {microAppsSelector} from './store/app.selectors';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Shows app';
  microApps$: Observable<{ [appName: string]: MicroAppInfo }>
  private appsEventManager: EventManager;

  constructor(private store: Store<any>) {

  }

  ngOnInit() {
    this.microApps$ = this.store.pipe(select(microAppsSelector));
    const appManager = new MicroAppsManager();
    appManager.configuraArea({
      frameContentFillingMethod: 'SourceUrl', frameAreaSelector: '#micro-apps-frame'
    })
    appManager.initApps([
      {id: 'schedules', entryUrl: '/schedule/', title: 'schedules',  componentId: 'schedule-component'},
      {id: 'show-details', entryUrl: '/show-details-app/', title: 'Shows'},
     // {id: 'team-details', entryUrl: '/team-details-app', title: 'Team Details'}
    ])
    this.appsEventManager = (window as any).microAppsEventsManager;

    this.appsEventManager.subscribe(
      'loaded', args => {
        const loadedApp =
          appManager.findAppByWindow(args.context);
        if (loadedApp) {
          this.store.dispatch(new AppLoadedAction(loadedApp))
        } else {
          this.store.dispatch(new AppLoadedAction( appManager.findAppByComponentName(args.context)))

        }

      });

    this.appsEventManager.subscribe('routeChanged', args => {
      if (appManager.shownApp) {
        window.history.replaceState(null, null, `${appManager.shownApp.id}${args}`);
      }
    })
  }

}
