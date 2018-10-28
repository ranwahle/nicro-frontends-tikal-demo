import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {Location} from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'app';

  constructor(private router: Router, private location: Location) {
  }

  ngOnInit() {
    const myParent: any = window.parent;
    if (myParent && myParent.microAppsEventsManager && myParent.microAppsEventsManager.dispatch) {
      this.assignAppState();
      myParent.microAppsEventsManager.dispatch('loaded', {appName: 'show-details', context: window})
      this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          myParent.microAppsEventsManager.dispatch('routeChanged', event.url)
        }
      })
    }


  }


  private assignAppState() {
    const myWindow = window as any;
    if (!myWindow.setState) {
      myWindow.setState = url => {
        console.log('setting state', url)
        this.location.replaceState(url)
      }
    }
  }
}
