import { AnimatedLayoutOptions, BaseLayoutOptions } from "cytoscape";

export type SpreadLayoutOptions = 
  BaseLayoutOptions & 
  AnimatedLayoutOptions &
  {
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