export type ContextMenu = {
  menuRadius?: () => number;
  selector: string;
  commands: Array<{
    content: string;
    select(ele: cytoscape.CollectionElements): void;
    disabled?: boolean;
  }>;
  fillColor?: string; // the background colour of the menu
  activeFillColor?: string; // the color used to indicate the selected command
  activePadding?: number; // additional size in pixels for the active command
  indicatorSize?: number; // the size in pixels of the pointer to the active command, will default to the node size if the node size is smaller than the indicator size
  separatorWidth?: number; // the empty spacing in pixels between successive commands
  spotlightPadding?: number; // extra spacing in pixels between the element and the spotlight
  adaptativeNodeSpotlightRadius?: boolean; // specify whether the spotlight radius should adapt to the node size
  minSpotlightRadius?: number; // the minimum radius in pixels of the spotlight (ignored for the node if adaptativeNodeSpotlightRadius is enabled but still used for the edge & background)
  maxSpotlightRadius?: number; // the maximum radius in pixels of the spotlight (ignored for the node if adaptativeNodeSpotlightRadius is enabled but still used for the edge & background)
  openMenuEvents?: string; // space-separated cytoscape events that will open the menu; only `cxttapstart` and/or `taphold` work here
  itemColor?: string; // the colour of text in the command's content
  itemTextShadowColor?: string; // the text shadow colour of the command's content, 'transparent'
  zIndex?: number; // the z-index of the ui div
  atMouse?: boolean; // draw menu at mouse position
  outsideMenuCancel?: number; // if set to a number, this will cancel the command if the pointer is released outside of the spotlight, padded by the number given
};
