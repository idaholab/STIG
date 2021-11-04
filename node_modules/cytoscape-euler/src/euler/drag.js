const defaultCoeff = 0.02;

function applyDrag( body, manualDragCoeff ){
  let dragCoeff;

  if( manualDragCoeff != null ){
    dragCoeff = manualDragCoeff;
  } else if( body.dragCoeff != null ){
    dragCoeff = body.dragCoeff;
  } else {
    dragCoeff = defaultCoeff;
  }

  body.force.x -= dragCoeff * body.velocity.x;
  body.force.y -= dragCoeff * body.velocity.y;
}

module.exports = { applyDrag };
