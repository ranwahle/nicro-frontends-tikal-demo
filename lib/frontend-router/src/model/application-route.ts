export interface ApplicationRoute {
    url: string;
    handler: () => void;
}