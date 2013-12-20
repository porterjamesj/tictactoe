var util = require('./util.js');
var m = require("mori");
var vec = m.vector;
var set = m.set;

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
  var valid = util.validMoves(board);
  var other = -player;
  var count = m.count(valid);
  if (util.isWin(m.get(board,other))) {
    return -1;
  } else if (util.isWin(m.get(board,player))) {
    return 1;
  } else if (count===0) {
    // the game is a tie
    return 0;
  } else {
    // more moves to make, recurse
    var maxVal = -Infinity;
    var maybePruned = m.some(function (move) {
      var newBoard = util.makeMove(player,board,move);
      var x = -negamaxInner(other, newBoard, -beta, -alpha);
      if (x>maxVal) { maxVal = x; }
      if (x>alpha) { alpha = x; }
      if (alpha>=beta) { return alpha; }
      // if we can't alpha/beta prune, we have to keep looking
      // return null to indicate this to some
      return null;
    },valid);
  }
  // we alpha/beta pruning occurred, we want to return that value
  // if it didn't, we just return the max value we saw
  return maybePruned ? maybePruned: maxVal;
};


// interface to negamax that hides the a/B pruning
var negamax = exports.negamax = function (player,board) {
  return negamaxInner(player, board, -Infinity, Infinity);
};


// some heuristics to make the first move
// as fast as the rest
function heuristics (plays) {
  var numPlays = m.count(plays);
  if (numPlays===0) {
    // play the corner if the board is empty
    return vec(0,0);
  } else if (numPlays===1) {
    if (m.get(plays,vec(1,1))) {
      // play the corner if the center is taken
      return vec(0,0);
    } else {
      // play the center
      return vec(1,1);
    }
  } else {
    return null;
  }
};


// use negamax and some heuristics to choose a move
exports.chooseMove = function (player,board) {
  var plays = m.union(m.get(board,player),m.get(board,-player));
  var heuristic = heuristics(plays);
  if (heuristic != null) {
    return util.makeMove(player,board,heuristic);
  } else{
    // first check if we have a win
    var wins = util.findWins(player,board);
    if (!m.is_empty(wins)) {
      return util.makeMove(player,board,m.first(wins));
    }
    // otherwise use negamax
    var valid = m.seq(util.validMoves(board));
    var ok = undefined;
    for(var i = 0; i < m.count(valid); i++) {
      var play = util.makeMove(player,board,m.nth(valid,i));
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
