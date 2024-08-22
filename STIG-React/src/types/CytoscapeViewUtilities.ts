//declare module 'cytoscape-view-utilities';

declare module 'cytoscape-view-utilities' {
    import { Core, CollectionElements } from 'cytoscape';

    interface ViewUtilities {
        highlight(elements: CollectionElements): void;
        hide(elements: CollectionElements): void;
        show(elements: CollectionElements): void;
    }

    function viewUtilities(options?: any): (cy: Core) => ViewUtilities;

    export default viewUtilities;
}