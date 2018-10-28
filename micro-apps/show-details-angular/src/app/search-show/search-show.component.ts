import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-search-show',
  templateUrl: './search-show.component.html',
  styleUrls: ['./search-show.component.css']
})
export class SearchShowComponent implements OnInit {

  showName: string;
  @Output() searchShow = new EventEmitter<string>();
  constructor() { }

  invokeSearchShow() {
    this.searchShow.emit(this.showName);
  }

  ngOnInit() {
  }

}
