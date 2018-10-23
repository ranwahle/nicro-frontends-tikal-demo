/**
 * This interface holds configuration for micro apps area
 */

export interface AreaConfig {
    /**
     * Selector for the area of which the app frames will be
     */
    frameAreaSelector: string;

    /**
     * content filling method
     * sourceUrl - set the src attribute
     * ContentFetch - Fetch the content from the server and fill the frame by using document.write
     */
    frameContentFillingMethod: 'SourceUrl' | 'ContentFetch';
}