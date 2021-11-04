const nop = function(){};

let tick = function( state ){
  let s = state;
  let l = state.layout;

  let tickIndicatesDone = l.tick( s );

  if( s.firstUpdate ){
    if( s.animateContinuously ){ // indicate the initial positions have been set
      s.layout.emit('layoutready');
    }
    s.firstUpdate = false;
  }

  s.tickIndex++;

  let duration = Date.now() - s.startTime;

  return !s.infinite && ( tickIndicatesDone || s.tickIndex >= s.maxIterations || duration >= s.maxSimulationTime );
};

let multitick = function( state, onNotDone = nop, onDone = nop ){
  let done = false;
  let s = state;

  for( let i = 0; i < s.refresh; i++ ){
    done = !s.running || tick( s );

    if( done ){ break; }
  }

  if( !done ){
    onNotDone();
  } else {
    onDone();
  }
};

module.exports = { tick, multitick };
