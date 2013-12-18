var ai = require("./ai.js");
var util = require("./util.js");
var React = require("react-tools").React;
var _ = require('underscore');

const NUM_ROWS = 3;
const NUM_COLS = 3;
const humanPlayer = util.players.X;
const aiPlayer = util.players.O;

var Board = exports.Board = React.createClass({
  getInitialState: function () {
    return {board:util.makeBoard([[0,0]],[[2,1]])};
  },
  render: function () {
    var self = this;
    var board = this.state.board;

    var rows = _(NUM_ROWS).times(function (i) {
      var row = _(NUM_COLS).times(function (j) {
        for (var player in board) {
          if(util.arrayIn(board[player],[i,j])){
            return (
                <td x={i}
                    y={j}>
                  {_.invert(util.players)[player]}
                </td>
            );
          }
        }
        return (
            <td x={i}
                y={j}
                onClick={self.handleClick.bind(self,i,j)}>0</td>
        );
      });
      return <tr>{row}</tr>;
    });

    return (
        <table>
          {rows}
        </table>
    );
  },
  handleClick: function (i,j) {
    this.setState({board:util.makeMove(humanPlayer,this.state.board,[i,j])});
  }
});
