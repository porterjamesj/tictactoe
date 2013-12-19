var assert = require("assert");
var util = require("../js/util.js");
const X = util.players.X;
const O = util.players.O;

describe("validMoves",function(){
  it("should return empty squares", function(){
    assert.deepEqual(util.validMoves(util.emptyBoard()),
                     util.ALLMOVES);
  });
  it("should not return filled squares", function(){
    assert.deepEqual(util.validMoves(util.makeBoard([[0,0]],[[1,1],[1,2]])),
                     [ [0,1],
                       [0,2],
                       [1,0],
                       [2,0],
                       [2,1],
                       [2,2] ]);
  });
});


describe("isWin",function(){
  it("should report wins correctly for center moves",function(){
    assert.equal(util.isWin([[0,0],[2,2]],[1,1]), true);
  });
  it("should report wins correctly for edge moves",function(){
    assert.equal(util.isWin([[0,0],[0,2]],[0,1]), true);
  });
  it("should report nonwins correctly",function(){
    assert.equal(util.isWin([[0,0],[2,2]],[0,1]), false);
  });
});


describe("findWins",function(){
  it("should report nothing if there are no winning moves",function(){
    assert.deepEqual(util.findWins(X,util.emptyBoard()), []);
  });
  it("should find wins from a center move",function(){
    assert.deepEqual(util.findWins(X,util.makeBoard([[0,0],[0,2],[2,2]],[])),
                     [[0,1],[1,1],[1,2]]);
  });
  it("should find wins from an edge move",function(){
    assert.deepEqual(util.findWins(X,util.makeBoard([[0,1],[0,2]],[])),
                     [[0,0]]);
  });
});


describe("makeMove",function(){
  it("should return the correct board",function(){
    assert.deepEqual(util.makeMove(X,util.makeBoard([],[]),[0,0]),
                     util.makeBoard([[0,0]],[]));
  });
});


describe("negamax",function(){
  it("should value boards that let the opponent win at -1",function(){
    assert.equal(util.negamax(X,util.makeBoard([[2,2]],[[0,0],[0,2]])),-1);
    assert.equal(util.negamax(X,util.makeBoard([[2,1],[1,0]],
                                               [[0,0],[2,0],[0,2]])),
                 -1);

  });
  it("should value boards that result in a draws at 0",function(){
    assert.equal(util.negamax(X,util.makeBoard([[0,2],[2,0],[2,2],[1,0]],
                                               [[0,0],[1,1],[1,2],[2,1]])),
                 0);
  });
  it("should value boards that result in wins at 1",function(){
    assert.equal(util.negamax(X,util.makeBoard([[0,2],[2,0],[0,0]],
                                                [[2,2]])),
                 1);
  });

});
