"use strict";
$(document).ready(function() {
  init();
})

var colors = ["DeepSkyBlue", "Green", "Red", "Yellow", "Purple"];
var countX = 12;
var countY = 10;
var marginX = 5;
var marginY = 5;
var diffX = 5;
var diffY = 5;

var stage;
var eggs;
var eggsMatrix;
var points;
// var eggWidth;
// var eggHeight;

function init() {
  stage = new createjs.Stage("eggsCanvas");
  var wrapper = $(".wrapper");
  stage.canvas.height = wrapper.height();
  stage.canvas.width = wrapper.width();
  var eggWidth = (wrapper.width() - marginX) / countX - diffX;
  var eggHeight = (wrapper.height() - marginY) / countY - diffY;

  initGame(eggWidth, eggHeight);

  createjs.Ticker.setFPS(120);
  createjs.Ticker.addEventListener("tick", stage);

  $("#resultModal .play-again").click(function() {
    $("#resultModal").modal("hide");
    initGame(eggWidth, eggHeight);
  });
}

function initGame(eggWidth, eggHeight) {
  eggs = new createjs.Container();
  eggsMatrix = new Array(countX);
  for(var i=0; i<countX; ++i)
    eggsMatrix[i] = new Array(countY);

  for (var i=0; i<countX; ++i)
    for (var j=0; j<countY; ++j) {
      var egg = createEgg(eggWidth, eggHeight, marginX+i*(eggWidth+diffX), marginY+j*(eggHeight+diffY), i, j);
      eggs.addChild(egg);
      eggsMatrix[i][j] = egg;
    }

  stage.addChild(eggs);

  points = 0;
  $(".points").text(points);
}

function createEgg(eggWidth, eggHeight, positionX, positionY, indX, indY) {
  var color = colors[Math.floor(Math.random() * colors.length)];
  var egg = new createjs.Shape();
  egg.graphics.beginFill(color);
  egg.graphics.beginStroke(createjs.Graphics.getRGB(0, 0, 0))
  egg.graphics.drawEllipse(0, 0, eggWidth, eggHeight);
  egg.x = positionX;
  egg.y = positionY;
  egg.newX = positionX;
  egg.newY = positionY;
  egg.indX = indX;
  egg.indY = indY;
  egg.color = color;
  egg.addEventListener("click", function() { clickEgg(egg, eggWidth, eggHeight); });
  return egg;
}

function clickEgg(egg, eggWidth, eggHeight) {
  var rem = calculateRemove(egg);
  for(var i=0; i<rem.length; ++i) {
    rem[i].removed = true;
    eggs.removeChild(rem[i]);
  }
  var emptyColumns = fallEggs(rem);
  if(emptyColumns.length > 0)
    shiftColumns(emptyColumns);
  updateEggs(eggWidth, eggHeight);
  updatePoints(rem.length);
  if(checkGameOver())
    showGameOver();
}

function calculateRemove(egg) {
  var toVisit = [];
  var found = [];
  toVisit.push(egg);
  while(toVisit.length > 0) {
    var tmpEgg = toVisit.pop();
    found.push(tmpEgg);
    var testEgg = [];
    if(tmpEgg.indX-1 >= 0)
      testEgg.push(eggsMatrix[tmpEgg.indX-1][tmpEgg.indY]);
    if(tmpEgg.indX+1 < countX)
      testEgg.push(eggsMatrix[tmpEgg.indX+1][tmpEgg.indY]);
    if(tmpEgg.indY-1 >=0)
      testEgg.push(eggsMatrix[tmpEgg.indX][tmpEgg.indY-1]);
    if(tmpEgg.indY+1 < countY)
      testEgg.push(eggsMatrix[tmpEgg.indX][tmpEgg.indY+1]);

    for(var i=0; i<testEgg.length; ++i)
      if(!testEgg[i].removed && testEgg[i].color == egg.color && !found.includes(testEgg[i]))
        toVisit.push(testEgg[i]);
  }
  return found;
}

function fallEggs(removed) {
  var columns = [];
  var emptyColumns = [];
  for(var i=0; i<removed.length; ++i)
    if(!columns.includes(removed[i].indX))
      columns.push(removed[i].indX);

  for(var i=0; i<columns.length; ++i) {
    var x = columns[i];
    var freePlace = [];
    for(var y=countY-1; y>=0; --y) {
      if (eggsMatrix[x][y].removed)
        freePlace.push(y);
      else if (freePlace.length != 0) {
        freePlace.push(y);
        switchEggsInColumn(x, freePlace.shift(), eggsMatrix[x][y].indY);
      }
    }
    if(freePlace.length == countY) {
      emptyColumns.push(x);
    }
  }
  return emptyColumns;
}

function switchEggsInColumn(x, oldEggIndY, newEggIndY) {
  var oldEgg = eggsMatrix[x][oldEggIndY];
  var newEgg = eggsMatrix[x][newEggIndY];

  eggsMatrix[x][oldEgg.indY] = newEgg;
  eggsMatrix[x][newEgg.indY] = oldEgg;

  var tmp = newEgg.y;
  // newEgg.y = oldEgg.y;
  newEgg.newY = oldEgg.y;
  oldEgg.y = tmp;

  tmp = newEgg.indY;
  newEgg.indY = oldEgg.indY;
  oldEgg.indY = tmp;
}

function shiftColumns(emptyColumns) {
  emptyColumns.sort();
  // while(emptyColumns.length != 0)
  //   for(var x=emptyColumns.pop(); x<countX-1; ++x)
  //     for(var y=0; y<countY; ++y)
  //       switchEggsInRow(eggsMatrix[x][y], eggsMatrix[x+1][y]);
  var x = emptyColumns[0];
  var freePlace = [];
  for(;x<countX; ++x) {
    if(emptyColumns.includes(x))
      freePlace.push(x);
    else if(freePlace.length != 0) {
      freePlace.push(x);
      switchEggsColumns(freePlace.shift(), x);
    }
    // x -> push
    // lub x przemieść i push
  }
}

function switchEggsColumns(x1, x2) {
  for(var y=0; y<countY; ++y) {
   var egg1 = eggsMatrix[x1][y];
   var egg2 = eggsMatrix[x2][y];
   switchEggsInRow(egg1,egg2);
  }
}

function switchEggsInRow(oldEgg, newEgg) {
  eggsMatrix[oldEgg.indX][oldEgg.indY] = newEgg;
  eggsMatrix[newEgg.indX][newEgg.indY] = oldEgg;

  var tmp = newEgg.x;
  // newEgg.x = oldEgg.x;
  newEgg.newX = oldEgg.x;
  oldEgg.x = tmp;

  tmp = newEgg.indX;
  newEgg.indX = oldEgg.indX;
  oldEgg.indX = tmp;
}

function updateEggs(eggWidth, eggHeight) {
  for (var i = eggs.children.length - 1; i >= 0; i--) {
    var egg = eggs.children[i];
    var newX = marginX+egg.indX*(eggWidth+diffX);
    var newY = marginY+egg.indY*(eggHeight+diffY);
    createjs.Tween.get(egg).to({y:newY}, 250, createjs.Ease.quadIn).to({x:newX}, 250, createjs.Ease.quadIn);
  }
}

function updatePoints(eggsCount) {
  points += calculatePoints(eggsCount);
  $(".points").text(points);
}

function calculatePoints(n) {
  if(n==1) return -10;
  var x1=Math.pow(n,3)/3;
  var x2=Math.pow(n,2);
  var x3=n+n/2+n/6;
  return x1-x2+x3;
}

function checkGameOver() {
  return eggs.children.length==0;
}

function showGameOver() {
  $("#resultModal").modal("show");
}
