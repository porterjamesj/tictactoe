var assert = require("assert");
var ai = require("../js/ai.js");
var util = require("../js/util.js");
const X = util.players.X;
const O = util.players.O;
const empty = util.emptyBoard();

describe("chooseMove",function(){
  it("should choose the corner on an empty board", function(){
    assert.deepEqual(ai.chooseMove(X,util.emptyBoard()),
                     util.makeMove(X,empty,[0,0]));
  });
  it("should take a win if one exists", function(){
    assert.deepEqual(ai.chooseMove(X,util.makeBoard([[0,0],[0,2]],[])),
                     util.makeBoard([[0,0],[0,2],[0,1]],[]));
  });
});
