import {ShowsComponent} from './shows/shows.component';
import {ShowDetailsComponent} from './show-details/show-details.component';

export const routes = [{
  path: '',
  component: ShowsComponent
}, {
  path: 'show-details',
  component: ShowsComponent
}, {
  path: 'show-details/:id',
  component: ShowDetailsComponent
}]
