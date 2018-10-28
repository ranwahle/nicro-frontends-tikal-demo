import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {Show} from './model/show';

@Injectable({
  providedIn: 'root'
})
export class ShowsService {

  constructor(private http: HttpClient) { }

  searchShow(showName: string) {
    return this.http.get(`http://api.tvmaze.com/search/shows?q=${showName}`).pipe(
      map((result: any[]) => result.map(show_score => show_score.show))
    )
  }
  getShowById(showId: number) : Observable<Show> {
    return this.http.get<Show>(`http://api.tvmaze.com/shows/${showId}`)

  }
}
