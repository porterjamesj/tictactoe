var ai = require("./ai.js");
var util = require("./util.js");
var React = require("react-tools").React;
var _ = require('underscore');

const NUM_ROWS = 3;
const NUM_COLS = 3;

var Board = exports.Board = React.createClass({
  getInitialState: function () {
    return {board:util.makeBoard([[0,0]],[[2,1]])};
  },
  render: function () {
    var board = this.state.board;
    var rows = _(NUM_ROWS).times(function (i) {
      var row = _(NUM_COLS).times(function (j) {
        for (var player in board) {
          if(util.arrayIn(board[player],[i,j])){
            return <td>{player}</td>;
          }
        }
        return <td>0</td>;
      });
      return <tr>{row}</tr>;
    });
    return (
        <table>
          {rows}
        </table>
    );
  }
});
