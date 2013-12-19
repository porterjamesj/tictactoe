var _ = require("underscore");

const ALLMOVES = [
  [0,0],
  [0,1],
  [0,2],
  [1,0],
  [1,1],
  [1,2],
  [2,0],
  [2,1],
  [2,2]
];
exports.ALLMOVES = ALLMOVES;

// enum of players
const players = {
  "X": 1,
  "O": -1
};
exports.players = players;

// hack to check if an array is in a nother array
var arrayIn = exports.arrayIn = function (outerArray,innerArray) {
  return _.find(outerArray, _.partial(_.isEqual, innerArray));
};

// functions for board construction

var emptyBoard = exports.emptyBoard = function () {
  var newBoard = {};
  newBoard[players.X] = [];
  newBoard[players.O] = [];
  return newBoard;
};

var makeBoard = exports.makeBoard = function (Xs, Os) {
  var board = emptyBoard();
  board[players.X] = Xs;
  board[players.O] = Os;
  return board;
};

// determine the valid moves on a board
var validMoves = exports.validMoves = function (board) {
  var occupied = board[players.X].concat(board[players.O]);
  return ALLMOVES.filter(function(square){
    if (arrayIn(occupied,square)) {
      return false;
    } else {
      return true;
    }
  });
};

// check if a move results in a win
// if called with a single argument, checks if the given squares
// constitute a win
var isWin = exports.isWin = function(moves,move) {
  var newMoves = move ? _.union(moves,[move]) : moves;
  var colCounts = _(3).times(function (n) {
    return newMoves.filter(function (move) {
      return move[0] === n;
    }).length;
  });
  var rowCounts = _(3).times(function (n) {
    return newMoves.filter(function (move) {
      return move[1] === n;
    }).length;
  });
  var diagCounts = _(3).times(function (n) {
    return newMoves.filter(function (move) {
      return move[1] === move[0];
    }).length;
  });
  var antidiagCounts = _(3).times(function (n) {
    return newMoves.filter(function (move) {
      return move[0]+move[1] === 2;
    }).length;
  });
  return _.some(_.union(rowCounts,colCounts,
                        diagCounts,antidiagCounts),function (n) { return n === 3;});
};

// report all moves with which a player can win on this board
var findWins = exports.findWins = function (player,board) {
  return _.filter(validMoves(board),_.partial(isWin,board[player]));
};

// make a move and return a new board
var makeMove = exports.makeMove = function (player,board,move) {
  var other = -player; // the other player
  var newBoard = {};
  newBoard[player] = board[player].slice();
  newBoard[player].push(move);
  newBoard[other] = board[other];
  return newBoard;
};

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
  var valid = validMoves(board);
  var other = -player;
  if (isWin(board[other])) {
    return -1;
  } else if (isWin(board[player])) {
    return 1;
  } else if (valid.length===0) {
    // the game is a tie
    return 0;
  } else {
    // more moves to make, recurse
    var maxVal = -Infinity;
    for (var i in valid) {
      var newBoard = makeMove(player,board,valid[i]);
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
