import {Component, OnDestroy, OnInit} from '@angular/core';
import {Show} from '../model/show';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {ShowsService} from '../shows.service';
import {first} from 'rxjs/operators';

@Component({
  selector: 'app-show-details',
  templateUrl: './show-details.component.html',
  styleUrls: ['./show-details.component.scss']
})
export class ShowDetailsComponent implements OnInit, OnDestroy {

  show: Show;
  subscriptions: Subscription;
  constructor(private activaRoute: ActivatedRoute, private showsService: ShowsService) { }

  ngOnInit() {
    this.subscriptions = this.activaRoute.params.subscribe(parameters => {
      this.showsService.getShowById(+parameters['id']).pipe(first())
        .subscribe(show => this.show = show)
    })
  }

  ngOnDestroy() {
    if (this.subscriptions)  {
      this.subscriptions.unsubscribe();
    }
  }

  getShowSchedule(show: Show) {

  }

}
