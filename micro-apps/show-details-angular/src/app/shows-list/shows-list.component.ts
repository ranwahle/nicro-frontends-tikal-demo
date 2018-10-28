import {Component, Input, OnInit} from '@angular/core';
import {Show} from '../model/show';

@Component({
  selector: 'app-shows-list',
  templateUrl: './shows-list.component.html',
  styleUrls: ['./shows-list.component.css']
})
export class ShowsListComponent implements OnInit {

  @Input() shows: Show[];

  constructor() {
  }

  ngOnInit() {
  }

}
