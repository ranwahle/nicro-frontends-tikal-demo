import {Externals, Links,  Rating, Schedule} from './shows-model';
import {Image} from './image';
import {WebChannel} from './web-channel';
import {Network} from './network';

export interface Show {
  id: number;
  url: string;
  name: string;
  type: string;
  language: string;
  genres: string[];
  status: string;
  runtime: number;
  premiered: string;
  officialSite: string;
  schedule: Schedule;
  rating: Rating;
  weight: number;
  network: Network;
  webChannel: WebChannel;
  externals: Externals;
  image: Image;
  summary: string;
  updated: number;
  _links: Links;
}
