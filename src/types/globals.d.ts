/*
Copyright 2018 Southern California Edison Company

ALL RIGHTS RESERVED
 */

import { ViewUtilitiesOptions } from '../graph/graphOptions';

export type Optional<T> = T | null | undefined;

declare module '*.json' {
  const value: any;
  export default value;
}

declare module 'cytoscape' {
  export interface Core {
    _private?: any;
    viewUtilities(viewoptions: ViewUtilitiesOptions): any;
    cxtmenu(options: ICXTMenuOptions): void;
    removeHighlights(): void;
    edgehandles(options: any): any;

  }

  export interface Union {
    filter(filter: (ele: CollectionElements, i: number) => boolean): CollectionElements;
  }

  export interface ICXTMenuOptions {
    selector: string;
    commands: Array<{
      content: string;
      select(ele: cytoscape.CollectionElements): void;
      disabled?: boolean;
    }>;
  }

  export interface CollectionElements {
    hideEles(): void;
    showEle(): void;
    showEles(): void;
    search(text: string): any;
    highlight(): void;
    removeHighlights(): void;
    closedNeighborhood(): CollectionElements;
  }
  export interface CollectionManipulation {
    hideEles(): void;
    showEle(): void;
  }

  export interface IOpacticyWidthHeightStyle {
    opacity: number;
    width: number;
    height: number;
  }

  export interface CollectionStyle {
    style(arg: IOpacticyWidthHeightStyle): any;
  }
  export interface CoreLayout {
    layout(layout: LayoutOptions | KlayOptions): CoreLayout;
    run(): void;
  }
  export interface KlayOptions {
    name: 'klay';
    nodeDimensionsIncludeLabels: boolean;
    fit: boolean; // fit viewport to graph
    padding: number; // padding on fit
    animate: boolean; // whether to transition the node positions
    animationDuration: number; // duration of animation in ms if enabled
    animationEasing: any; // easing of animation if enabled
    ready: Optional<any>; // callback on layoutready
    stop: Optional<any>; // callback on layoutstop
    priority(p: any): any;
    klay: any;
  }

  interface IConcentricLayoutOptions extends ShapedLayoutOptions {
    name: 'concentric';

    // where nodes start in radians, e.g. 3 / 2 * Math.PI,
    startAngle: number;
    // how many radians should be between the first and last node (defaults to full circle)
    sweep?: number;
    // whether the layout should go clockwise (true) or counterclockwise/anticlockwise (false)
    clockwise?: boolean;

    // whether levels have an equal radial distance betwen them, may cause bounding box overflow
    equidistant: false;
    minNodeSpacing: number; // min spacing between outside of nodes (used for radius adjustment)
    // height of layout area (overrides container height)
    height: undefined;
    // width of layout area (overrides container width)
    width: undefined;
    // Applies a multiplicative factor (>0) to expand or compress the overall area that the nodes take up
    spacingFactor: undefined;
    // returns numeric value for each node, placing higher nodes in levels towards the centre
    concentric(node: { degree(): number }): number;
    // the variation of concentric values in each level
    levelWidth(node: { maxDegree(): number }): number;
  }

  interface SpreadLayoutOptions extends BaseLayoutOptions, AnimatedLayoutOptions {
    name: 'spread';
    animate: boolean; // whether to show the layout as it's running
    fit: boolean; // Reset viewport to fit default simulationBounds
    minDist: number; // Minimum distance between nodes
    padding: number; // Padding
    expandingFactor: number;
    maxFruchtermanReingoldIterations: number; // Maximum number of initial force-directed iterations
    maxExpandIterations: number; // Maximum number of expanding iterations
    boundingBox: any; // Constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
    randomize: boolean;
  }
}

declare module 'electron' {
  export interface MenuItem {
    id?: string | number;
  }
}

// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
export type JSONValue = string | number | boolean | JSONObject | JSONArray;
export type JSONObject = Record<string, JSONValue>;
export interface JSONArray extends Array<JSONValue> { }

declare module JQuery {
  function controlgroup<TValue> (options: any): JQuery<TValue>;
  function checkboxradio (options: any): JQuery;
}
