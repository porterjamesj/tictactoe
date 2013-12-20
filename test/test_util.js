var assert = require('assert');
var util = require("../js/util.js");
var m = require("mori");
var vec = m.vector;
var set = m.set;
var hashmap = m.hash_map;
const X = m.get(util.players,"X");
const O = m.get(util.players,"O");

describe("validMoves",function(){
  it("should return empty squares", function(){
    assert(m.equals(util.validMoves(util.emptyBoard()),
                    util.ALLMOVES));
  });
  it("should not return filled squares", function(){
    assert(m.equals(
      util.validMoves(util.makeBoard([vec(0,0)],[vec(1,1),vec(1,2)])),
      set([vec(0,1),vec(0,2),vec(1,0),vec(2,0),vec(2,1),vec(2,2)])
    ));
  });
});


describe("isWin",function(){
  it("should report wins correctly for center moves",function(){
    assert.equal(util.isWin(set([vec(0,0),vec(2,2),vec(1,1)])), true);
  });
  it("should report wins correctly for edge moves",function(){
    assert.equal(util.isWin(set([vec(0,0),vec(0,2),vec(0,1)])), true);
  });
  it("should report nonwins correctly",function(){
    assert.equal(util.isWin(set([vec(0,0),vec(2,2),vec(0,1)])), false);
  });
});


describe("findWins",function(){
  it("should report nothing if there are no winning moves",function(){
    assert(m.equals(util.findWins(X,util.emptyBoard()), set()));
  });
  it("should find wins from a center move",function(){
    assert(m.equals(
      util.findWins(X,util.makeBoard(set([vec(0,0),vec(0,2),vec(2,2)]),set())),
      set([vec(0,1),vec(1,1),vec(1,2)])
    ));
  });
  it("should find wins from an edge move",function(){
    assert(m.equals(
      util.findWins(X,util.makeBoard(set([vec(0,1),vec(0,2)]),set())),
      set([vec(0,0)])
    ));
  });
});


describe("makeMove",function(){
  it("should return the correct board",function(){
    assert(m.equals(util.makeMove(X,util.makeBoard([],[]),vec(0,0)),
                    util.makeBoard([vec(0,0)],[])));
  });
});

describe("isOver",function(){
  it("should say if a player won",function(){
    assert(m.equals(util.isOver(util.makeBoard([vec(0,0),vec(0,1),vec(0,2)],[])),
                    X));
  });
  it("should detect draws",function(){
    assert(m.equals(util.isOver(
      util.makeBoard([vec(0,0),vec(1,1),vec(0,2),vec(2,1),vec(1,2)],
                     [vec(0,1),vec(1,0),vec(2,2),vec(2,0)])),
                    0));
  });
  it("should return null if game is not over",function(){
    assert(m.equals(util.isOver(
      util.makeBoard([vec(0,0),vec(1,2)],
                     [vec(0,1),vec(1,0),vec(2,2),vec(2,0)])),
                    null));
  });

});
