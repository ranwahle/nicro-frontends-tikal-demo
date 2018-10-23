/**
 * This interface represents micro app data
 */
export interface MicroApp {
    id: string;
    entryUrl: string;
    title: string;
    type?: 'component' | 'iframe'

    /**
     * For components - the component to create
     */
    componentId?: string;
}