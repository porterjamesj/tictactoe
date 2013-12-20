var ai = require("./ai.js");
var util = require("./util.js");
var React = require("react");
var m = require("mori");
var vec = m.vector;

const NUM_ROWS = 3;
const NUM_COLS = 3;
const humanPlayer = m.get(util.players,"X");
const aiPlayer = m.get(util.players,"O");

// convenience wrapper for having mori's map return an array
var amap = function (f,coll) {
  return m.into_array(m.map(f,coll));
};

// draw the correct symbol for a player
var symbolFor = function (player) {
  return player===1?"X":"O";
};

// generate a random game opening (the randomness is in who goes first)
var randOpening = function () {
  return Math.random()>0.5?
    {board:util.makeBoard([],[])} : {board:util.makeBoard([],[vec(0,0)])};
};

/*
 * To draw the table for a board of size dim, we map over the range
 * (0,dim) twice, returning a tr at the first level and a td at the
 * the second level, resutling in a dim x dim sized table . By using
 * the information in the board, we can determine what the td should
 * look like.
 */
var makeTable = function (board, dim) {
  var self = this;
  var range = m.range(0,dim); // the size of the board is determined by this
  return React.DOM.table({}, amap(function (i) {
    return React.DOM.tr({}, amap(function (j) {
      var maybeTakenSpace = m.some(function (pair){
        var player = m.get(pair,0);
        var plays = m.get(pair,1);
        if (m.get(plays,vec(i,j))) {
          // in this case, player has played here
          return React.DOM.td({className:symbolFor(player)},
                              symbolFor(player));
        } else {
          // no one has played here
          return null;
        }
      },board);
      return maybeTakenSpace != null ? maybeTakenSpace :
        React.DOM.td({onClick:self.handleClick.bind(this,i,j)},' ');
    },range));
  },range));
};


/* The game component consists of the table for the board
 * and a brief message describing the game state.
 */
var Game = exports.Game = React.createClass({
  getInitialState: function () {
    return randOpening();
  },
  render: function () {
    var board = this.state.board;
    // draw 3 by 3 board
    var table = makeTable.call(this,board,3);

    // check if the game is over
    var over = util.isOver(board);
    var message;
    if (over === null) {
      message = "Click to make a move.";
    } else if (over===0) {
      message = "Draw! Refresh to play again.";
    } else if (over===-1) {
      message = "AI wins! Refresh to play again";
    } else if (over===1) {
      message = "You win! Refresh to play again";
    }

    // Return a div with the board and a message
    return React.DOM.div({},
                         [React.DOM.p({className:"banner"},message),table]);
  },
  handleClick: function (i,j) {
    // the new board after the human player's play
    var humanPlay = util.makeMove(humanPlayer,this.state.board,vec(i,j));
    if(util.isOver(humanPlay) != null) {
      // if that ends the game, just leave the state here
      this.setState({board:humanPlay});
    } else {
      // if not, let the ai respond
      this.setState({board:ai.chooseMove(aiPlayer,humanPlay)});
    }
  }
});
