function updateEggs() {
  for (var i = eggs.children.length - 1; i >= 0; i--) {
    var egg = eggs.children[i];
    if(egg.newX !== undefined)
      createjs.Tween.get(egg).to({x:egg.newX, y:egg.newY}, 250, createjs.Ease.quadIn);
    egg.newX = undefined;
    egg.newY = undefined;
  }
}
