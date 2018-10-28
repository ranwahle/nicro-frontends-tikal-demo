import {ShowsComponent} from './shows/shows.component';
import {ShowDetailsComponent} from './show-details/show-details.component';

export const routes = [{
  path: '',
  component: ShowsComponent
}, {
  path: ':id',
  component: ShowDetailsComponent
}]
