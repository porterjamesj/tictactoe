var assert = require("assert");
var ai = require("../js/ai.js");

describe("validMoves",function(){
  it("should return empty squares", function(){
    assert.deepEqual(ai.validMoves({"X":[],"O":[]}),
                     ai.ALLMOVES);
  });
  it("should not return filled squares", function(){
    assert.deepEqual(ai.validMoves({"X":[[0,0]],"O":[[1,1],[1,2]]}),
                     [ [0,1],
                       [0,2],
                       [1,0],
                       [2,0],
                       [2,1],
                       [2,2] ]);
  });
});


describe("isWin",function(){
  it("should report wins correctly",function(){
    assert.equal(ai.isWin([[0,0],[2,2]],[1,1]), true);
  });
  it("should report nonwins correctly",function(){
    assert.equal(ai.isWin([[0,0],[2,2]],[0,1]), false);
  });
});


describe("findWins",function(){
  it("should report nothing if there are no winning moves",function(){
    assert.deepEqual(ai.findWins("X",{"X":[],"O":[]}),
                            []);
  });
  it("should find wins",function(){
    assert.deepEqual(ai.findWins("X",{"X":[[0,0],[0,2],[2,2]],"O":[]}),
                     [[0,1],[1,1],[1,2]]);
  });
});

describe("makeMove",function(){
  it("should return the correct board",function(){
    assert.deepEqual(ai.makeMove("X",{"X":[],"O":[]},[0,0]),
                     {"X":[[0,0]],"O":[]});
  });
});

describe("negamax",function(){
  it("should value opening move at 1",function(){
    assert.equal(ai.negamax("X",{"X":[[0,0],[0,1]],"O":[]}), 1);
  });
  it("should value move that lets opponent win at -1",function(){
    assert.equal(ai.negamax("X",{"X":[[2,2]],"O":[[0,0],[0,2]]}),-1);
  });
  it("should value move that results in a draw at 0",function(){
    assert.equal(ai.negamax("X",{"X":[[0,2],[2,0],[2,2],[1,0]],
                                  "O":[[0,0],[1,1],[1,2],[2,1]]}),
                 0);
  });
});
