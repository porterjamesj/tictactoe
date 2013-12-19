var assert = require("assert");
var ai = require("../js/ai.js");
var util = require("../js/util.js");
const X = util.players.X;
const O = util.players.O;
const empty = util.emptyBoard();

describe("negamax",function(){
  it("should value boards that let the opponent win at -1",function(){
    assert.equal(ai.negamax(X,util.makeBoard([[2,2]],[[0,0],[0,2]])),-1);
    assert.equal(ai.negamax(X,util.makeBoard([[2,1],[1,0]],
                                               [[0,0],[2,0],[0,2]])),
                 -1);

  });
  it("should value boards that result in a draws at 0",function(){
    assert.equal(ai.negamax(X,util.makeBoard([[0,2],[2,0],[2,2],[1,0]],
                                               [[0,0],[1,1],[1,2],[2,1]])),
                 0);
  });
  it("should value boards that result in wins at 1",function(){
    assert.equal(ai.negamax(X,util.makeBoard([[0,2],[2,0],[0,0]],
                                                [[2,2]])),
                 1);
  });

});


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
