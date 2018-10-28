import {Component, OnInit} from '@angular/core';
import {ShowsService} from '../shows.service';

@Component({
  selector: 'app-shows',
  templateUrl: './shows.component.html',
  styleUrls: ['./shows.component.css']
})
export class ShowsComponent implements OnInit {

  showsList: any;

  constructor(private showsService: ShowsService) {

  }

  ngOnInit() {
  }

  searchShow(showName: string) {
    this.showsService.searchShow(showName).subscribe(result => {
      this.showsList = result;
    })
  }

}
