import { Optional } from './Optional';
/* eslint-disable */
export type KlayOptions = {
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
};
/* eslint-enable */
