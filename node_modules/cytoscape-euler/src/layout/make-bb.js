module.exports = function( bb, cy ){
  if( bb == null ){
    bb = { x1: 0, y1: 0, w: cy.width(), h: cy.height() };
  } else { // copy
    bb = { x1: bb.x1, x2: bb.x2, y1: bb.y1, y2: bb.y2, w: bb.w, h: bb.h };
  }

  if( bb.x2 == null ){ bb.x2 = bb.x1 + bb.w; }
  if( bb.w == null ){ bb.w = bb.x2 - bb.x1; }
  if( bb.y2 == null ){ bb.y2 = bb.y1 + bb.h; }
  if( bb.h == null ){ bb.h = bb.y2 - bb.y1; }

  return bb;
};
