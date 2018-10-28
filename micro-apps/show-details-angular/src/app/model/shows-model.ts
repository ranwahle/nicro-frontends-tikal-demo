import {Show} from './show';
import {Country} from './country';

export interface Schedule {
  time: string;
  days: string[];
}

export interface Rating {
  average?: number;
}


export interface Externals {
  tvrage?: number;
  thetvdb?: number;
  imdb: string;
}



export interface Self {
  href: string;
}

export interface Previousepisode {
  href: string;
}

export interface Links {
  self: Self;
  previousepisode: Previousepisode;
}



export interface RootObject {
  score: number;
  show: Show;
}



