var util = require('./util.js');
var _ = require('underscore');

/*
 * negamaxInner - use negamax algorithm and alpha/beta pruning to
 * determine the value of `board` from the perspective of
 * `player`. values are as follows:
 *
 * -1: player will lose
 * 0: game will draw
 * 1: player has a path to victory
 *
 * Note that this implementation assumes that `player's` opponent
 * has just played, so `player` will be the next to make a move
 */
var negamaxInner = function (player, board, alpha, beta) {
  debugger;
  var valid = util.validMoves(board);
  var other = -player;
  if (util.isWin(board[other])) {
    return -1;
  } else if (util.isWin(board[player])) {
    return 1;
  } else if (valid.length===0) {
    // the game is a tie
    return 0;
  } else {
    // more moves to make, recurse
    var maxVal = -Infinity;
    for (var i in valid) {
      var newBoard = util.makeMove(player,board,valid[i]);
      var x = -negamaxInner(other, newBoard, -beta, -alpha);
      if (x>maxVal) { maxVal = x; }
      if (x>alpha) { alpha = x; }
      if (alpha>=beta) { return alpha; }
    }
  }
  return maxVal;
};


// interface to negamax that hides the a/B pruning
var negamax = exports.negamax = function (player,board) {
  return negamaxInner(player, board, -Infinity, Infinity);
};



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
      var val = -negamax(-player,play);
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
