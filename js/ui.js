var ai = require("./ai.js");
var util = require("./util.js");
var React = require("react-tools").React;
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

var symbolFor = function (player) {
  return player===1?"X":"O";
};

var Board = exports.Board = React.createClass({
  getInitialState: function () {
    return {board:util.makeBoard([],[])};
  },
  render: function () {
    var self = this;
    var board = this.state.board;
    var dim = m.range(0,3); // the size of the board is determined by this
    /*
     * To draw the board we map over dim twice, returning a tr at the
     * first level and a td at the the second level, resutling in a
     * dim x dim sized table . By using the information in the board,
     * we can determine what the td should look like.
     */
    return React.DOM.table({}, amap(function (i) {
      return React.DOM.tr({}, amap(function (j) {
        var maybeTakenSpace = m.some(function (pair){
          var player = m.get(pair,0);
          var plays = m.get(pair,1);
          if (m.get(plays,vec(i,j))) {
            // in this case, player has played here
            return React.DOM.td({}, symbolFor(player));
          } else {
            // no one has played here
            return null;
          }
        },board);
        return maybeTakenSpace != null ?
          maybeTakenSpace : React.DOM.td({onClick:self.handleClick.bind(this,i,j)},
                                         '0');
        },dim));
    },dim));
  },
  handleClick: function (i,j) {
    // the new board after the human player's play
    debugger;
    var humanPlay = util.makeMove(humanPlayer,this.state.board,vec(i,j));
    // let the ai respond
    this.setState({board:ai.chooseMove(aiPlayer,humanPlay)});
  }
});
