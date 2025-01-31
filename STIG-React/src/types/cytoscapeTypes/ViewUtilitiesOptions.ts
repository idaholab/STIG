/* eslint-disable */
export type ViewUtilitiesOptions = {
  node: {
    highlighted: any; // styles for when nodes are highlighted.
    unhighlighted: any; // styles for when nodes are unhighlighted.
  };
  edge: {
    highlighted: any; // styles for when edges are highlighted.
    unhighlighted: any; // styles for when edges are unhighlighted.
  };
  setVisibilityOnHide?: boolean; // whether to set visibility on hide/show
  setDisplayOnHide?: boolean; // whether to set display on hide/show
  neighbor?: any; // return desired neighbors of tapheld node

  neighborSelectTime?: number; // ms, time to taphold to select desired neighbors
  searchBy?: string[];
};
/* eslint-enable */