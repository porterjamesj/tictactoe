var util = require('./util.js');
var _ = require('underscore');

// use negamax and some heuristics to choose a move
exports.chooseMove = function (player,board) {
  if (_.isEqual(board,util.emptyBoard())) {
    // play the corner
    return  util.makeMove(player,board,[0,0]);
  } else {
    // first check if we have a win
    var wins = util.findWins(player,board);
    if (wins.length > 0) {
      return util.makeMove(player,board,wins[0]);
    }
    // otherwise use negamax
    var valid = util.validMoves(board);
    var ok = undefined;
    for(var i = 0; i < valid.length; i++) {
      var play = util.makeMove(player,board,valid[i]);
      // the value of a play is the negation of its
      // value from my opponents point of view
      var val = -util.negamax(-player,play);
      if (val==1) {
        // this is a move we can win from; take it
        return play;
      } else if (val==0) {
        // we can draw from here, so its ok, but keep looking
        ok = play;
      }
    }
    return ok;
  }
};
