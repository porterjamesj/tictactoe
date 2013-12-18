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
var isWin = exports.isWin = function(moves,i) {
  var winPairs = [
    [ [i[0]+1,i[1]], [i[0]-1,i[1]] ],
    [ [i[0],i[1]+1], [i[0],i[1]-1] ],
    [ [i[0]+1,i[1]-1], [i[0]-1,i[1]+1] ],
    [ [i[0]-1,i[1]-1], [i[0]+1,i[1]+1] ]
  ];

  if(_.some(winPairs,function (pair) {
    return arrayIn(moves,pair[0]) && arrayIn(moves,pair[1]);
  })) {
    return true;
  } else {
    // not a win
    return false;
  }
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

// decide if the game is over
var gameOver = exports.gameOver = function (valid,wins) {
  if (valid.length===1 || wins.length>0) {
    return true;
  } else {
    return false;
  }
};

// evaulate a board given the wins each player has on it
var evaluate = function (myWins,otherWins) {
  if (otherWins.length > 0) {
    return -1;
  } else if (myWins.length > 0) {
    return 1;
  } else {
    return 0;
  }
};

// compute the value of the Board according to negamax
var negamaxInner = function (player, board, alpha, beta) {
  var valid = validMoves(board);
  var other = -player;
  var myWins = findWins(player,board);
  var otherWins = findWins(other,board);
  if (gameOver(valid,myWins.concat(otherWins))) {
    return evaluate(myWins,otherWins);
  } else {
    // more moves to make, recurse
    var maxVal = -Infinity;
    var pruned = _.find(valid, function (move) {
      var newBoard = makeMove(player,board,move);
      var x = -negamaxInner(other, newBoard, -beta, -alpha);
      if (x > maxVal) { maxVal = x; }
      if (x > alpha) { alpha = x; }
      if (alpha >= beta) { return alpha; }
      return undefined;
    });
    return pruned ? pruned : maxVal;
  }
};


// interface to negamax that hides the a/B pruning
var negamax = exports.negamax = function (player,board) {
  return negamaxInner(player, board, -Infinity, Infinity);
};
