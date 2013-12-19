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
  var diagCounts = newMoves.filter(function (move) {
      return move[1] === move[0];
    }).length;
  var antidiagCounts = newMoves.filter(function (move) {
      return move[0]+move[1] === 2;
    }).length;
  return _.some(_.union(rowCounts,colCounts,
                        [diagCounts],[antidiagCounts]),function (n) { return n === 3;});
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
