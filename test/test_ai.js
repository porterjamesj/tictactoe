var assert = require("assert");
var ai = require("../js/ai.js");
var util = require("../js/util.js");
var m = require("mori");
var vec = m.vector;
var set = m.set;

const X = m.get(util.players,"X");
const O = m.get(util.players,"O");

describe("negamax",function(){
  it("should value boards that let the opponent win at -1",function(){
    assert.equal(ai.negamax(X,util.makeBoard([vec(2,2)],[vec(0,0),vec(0,2)])),-1);
    assert.equal(ai.negamax(X,util.makeBoard([vec(2,1),vec(1,0)],
                                             [vec(0,0),vec(2,0),vec(0,2)])),
                 -1);

  });
  it("should value boards that result in a draws at 0",function(){
    assert.equal(ai.negamax(X,util.makeBoard([vec(0,2),vec(2,0),vec(2,2),vec(1,0)],
                                               [vec(0,0),vec(1,1),vec(1,2),vec(2,1)])),
                 0);
  });
  it("should value boards that result in wins at 1",function(){
    assert.equal(ai.negamax(X,util.makeBoard([vec(0,2),vec(2,0),vec(0,0)],
                                             [vec(2,2)])),
                 1);
  });

});


describe("chooseMove",function(){
  it("should choose the corner on an empty board", function(){
    assert(m.equals(ai.chooseMove(X,util.emptyBoard()),
                     util.makeMove(X,util.emptyBoard(),vec(0,0))));
  });
  it("should take a win if one exists", function(){
    assert(m.equals(ai.chooseMove(X,util.makeBoard([vec(0,0),vec(0,2)],[])),
                     util.makeBoard([vec(0,0),vec(0,2),vec(0,1)],[])));
  });
});
