var m = require("mori");
var vec = m.vector;
var set = m.set;
var hashmap = m.hash_map;

const ALLMOVES = exports.ALLMOVES = set([
  vec(0,0),
  vec(0,1),
  vec(0,2),
  vec(1,0),
  vec(1,1),
  vec(1,2),
  vec(2,0),
  vec(2,1),
  vec(2,2)
]);

// enum of players
var players = hashmap("X",1,"O",-1);
const X = m.get(players,"X");
const O = m.get(players,"O");
exports.players = players;

// functions for board construction

var emptyBoard = exports.emptyBoard = function () {
  return hashmap(X,set(),O,set());
};

var makeBoard = exports.makeBoard = function (Xs, Os) {
  return hashmap(X,m.set(Xs),O,m.set(Os));
};

// determine the valid moves on a board
var validMoves = exports.validMoves = function (board) {
  return m.set(m.filter(function(move){
    return !m.has_key(m.get(board,X),move) && !m.has_key(m.get(board,O),move);
  },ALLMOVES));
};

// check if a set of moves constitutes a wi
var isWin = exports.isWin = function(moves) {
  /*
   * Algorithm is to walk over the set of moves,
   * keeping track of how many moves we've seen
   * that are in each column, row, the diagonal, and
   * the antidiagonal. These moves are a win if there
   * are three moves in any of these
   */
  var col = [0,0,0]; // three slots, one for each column
  var row = [0,0,0]; // correspondingly for rows
  var diag = 0, antidiag = 0;
  m.each(moves, function (move) {
    var i = m.nth(move,0);
    var j = m.nth(move,1);
    // add to appropriate column and row
    col[i]++;
    row[j]++;
    // add to diag if we are on it
    if (i===j) { diag++; }
    if (i+j===2) { antidiag++; }
  });
  // now we return true if any of any row, col, or diag had three moves in it
  var all = col.concat(row,diag,antidiag);
  return all.filter(function (n) { return n===3; }).length > 0;
};

// report all moves with which a player can win on this board
var findWins = exports.findWins = function (player,board) {
  var valid = validMoves(board);
  var sofar = m.get(board,player);
  return m.set(m.filter(function (move) {
    return isWin(m.conj(sofar,move));
  },valid));
};

// make a move and return a new board
var makeMove = exports.makeMove = function (player,board,move) {
  return m.assoc(board,player,
                 m.conj(m.get(board,player),move));
};
