import {Component, Input, OnInit} from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() fillerContent
  mobileQuery: MediaQueryList;
  constructor(private media: MediaMatcher) { }

  ngOnInit() {
    this.mobileQuery = this.media.matchMedia('(max-width: 600px)');

  }

}
