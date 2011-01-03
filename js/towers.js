var Towers, archerTowerUpdate, catapultTowerUpdate;
/*
Copyright 2010, Rehno Lindeque.
This game is licensed under GPL Version 2. See http://gatesofolympus.com/LICENSE for more information.
*/
/*
Tower types
*/
archerTowerUpdate = function(index) {};
catapultTowerUpdate = function(index) {};
/*
Collection of all towers
*/
Towers = function() {
  var _a, c;
  SceneJS.createNode(BlenderExport.ArcherTower);
  SceneJS.createNode(BlenderExport.CatapultTower);
  SceneJS.createNode(BlenderExport.BallistaTower);
  this.towers = new Array(sqrGridSize * levels);
  _a = (sqrGridSize * levels);
  for (c = 0; (0 <= _a ? c < _a : c > _a); (0 <= _a ? c += 1 : c -= 1)) {
    this.towers[c] = -1;
  }
  this.towers[10] = -2;
  this.towers[sqrGridSize + 18] = -2;
  return this;
};
Towers.prototype.update = function() {};