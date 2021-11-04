/**
 * This file defines configuration options for the asyncforce module. Every
 * configuration is optional. You can find its description and default value below.
 */
module.exports = validateOptions;

function validateOptions(options) {
  options = options || {};

  /**
   * Do we need to run 3D layout or 2D?
   */
  options.is3d = typeof options.is3d === 'boolean' ? options.is3d : false;

  // These options are in separate object since they configure web worker behavior
  // not layout.
  var async = (options.async = options.async || {});

  /**
   * Web worker computes layout in cycles. After each cycle is done web worker
   * notifies the main thread with updated positions. This options defines
   * how many layout steps should web worker complete within one cycle.
   */
  async.stepsPerCycle = typeof async.stepsPerCycle === 'number' ? async.stepsPerCycle : 5;

  /**
   * By default layout will be computed as long as each iteration brings too
   * much movement to the system. However if you'd like to compute only N iterations
   * of layout, you can set this option to N. Once layout reaches N it will consider
   * system stable and will not compute more iterations.
   */
  async.maxIterations = typeof async.maxIterations === 'number' ? async.maxIterations : Number.POSITIVE_INFINITY;

  /**
   * Unlike requestAnimationFrame() web workers are executed even when page is
   * not active (e.g. user switched to a different browser tab). This can result
   * in unnecessary CPU consumption and battery drain.
   *
   * By default asyncforce will calculate layout as long as you call
   * `asncforce.step()`. Normally you will call this method from
   * requestAnimationFrame() handler to manage CPU resources.
   *
   * However, if you prefer to keep computing layout in background set this
   * options to true. Layout will be computed until system is considered stable
   * (see `maxIterations` above).
   */
  async.waitForStep = typeof async.waitForStep === 'boolean' ? async.waitForStep : true;
  return options;
}
