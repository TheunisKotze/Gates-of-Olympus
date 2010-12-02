/*
Copyright 2010, Rehno Lindeque.
This game is licensed under GPL Version 2. See http://gatesofolympus.com/LICENSE for more information.
*/var Skybox;
/*
A proxy for the skybox
*/
Skybox = function() {
  this.node = {
    type: "scale",
    x: 100.0,
    y: 100.0,
    z: 100.0,
    nodes: [
      {
        type: "material",
        baseColor: {
          r: 0.0,
          g: 0.0,
          b: 0.0
        },
        specularColor: {
          r: 1.0,
          g: 1.0,
          b: 1.0
        },
        specular: 0.0,
        shine: 0.0,
        nodes: [
          {
            type: "texture",
            layers: [
              {
                uri: "textures/sky.png"
              }
            ],
            nodes: [
              {
                type: "geometry",
                primitive: "triangles",
                positions: [1, 1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1, 1, 1, 1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1, 1, 1, 1, 1, -1, -1, 1, -1, -1, 1, 1, -1, 1, 1, -1, 1, -1, -1, -1, -1, -1, -1, 1, -1, -1, -1, 1, -1, -1, 1, -1, 1, -1, -1, 1, 1, -1, -1, -1, -1, -1, -1, 1, -1, 1, 1, -1],
                uv: [1, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1],
                indices: [0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14, 15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23]
              }
            ]
          }
        ]
      }
    ]
  };
  return this;
};var Level, towerNode, towerPlacementNode;
/*
Tower scene graph nodes
*/
towerNode = function(index, id, instances) {
  return {
    type: "material",
    baseColor: {
      r: 0.0,
      g: 0.0,
      b: 0.0
    },
    specularColor: {
      r: 1.0,
      g: 1.0,
      b: 1.0
    },
    specular: 0.0,
    shine: 0.0,
    nodes: [
      {
        type: "texture",
        id: id,
        layers: [
          {
            uri: towerTextureURI[index]
          }
        ],
        nodes: instances
      }
    ]
  };
};
towerPlacementNode = function() {
  return {
    type: "translate",
    id: "placementTower",
    z: platformHeights[1],
    nodes: [
      {
        type: "selector",
        id: "placementTowerModel",
        selection: [0],
        nodes: [
          towerNode(0, "placementTower" + 0, [
            {
              type: "instance",
              target: towerIds[0]
            }
          ]), towerNode(1, "placementTower" + 1, [
            {
              type: "instance",
              target: towerIds[1]
            }
          ])
        ]
      }
    ]
  };
};
/*
A proxy for the whole level with platforms and creatures etc.
*/
Level = function() {
  this.towers = new Towers();
  this.creatures = new Creatures();
  this.towerNodes = [
    {
      archerTowers: towerNode(0, "archerTowers0", []),
      catapultTowers: towerNode(1, "catapultTowers0", [])
    }, {
      archerTowers: towerNode(0, "archerTowers1", []),
      catapultTowers: towerNode(1, "catapultTowers1", [])
    }, {
      archerTowers: towerNode(0, "archerTowers2", []),
      catapultTowers: towerNode(1, "catapultTowers2", [])
    }
  ];
  this.node = this.createNode();
  return this;
};
Level.prototype.getTowerRoot = function(level, towerType) {
  switch (towerType) {
    case 0:
      return this.towerNodes[level].archerTowers;
    case 1:
      return this.towerNodes[level].catapultTowers;
    default:
      return null;
  }
};
Level.prototype.addTower = function(towerPlacement, towerType) {
  var cx, cy, cz, index, node, parentNode;
  index = towerPlacement.level * sqrGridSize + towerPlacement.cell.y * gridSize + towerPlacement.cell.x;
  if (this.towers.towers[index] === -1) {
    this.towers.towers[index] = towerType;
    parentNode = this.getTowerRoot(towerPlacement.level, towerType);
    node = {
      type: "instance",
      target: towerIds[towerType]
    };
    cx = towerPlacement.cell.x;
    cy = towerPlacement.cell.y;
    cz = towerPlacement.level;
    SceneJS.withNode(parentNode.nodes[0].id).add("nodes", [
      {
        type: "translate",
        x: cellScale * (cx - gridSize / 2) + cellScale * 0.5,
        y: cellScale * (cy - gridSize / 2) + cellScale * 0.5,
        nodes: [node]
      }
    ]);
  }
  return null;
};
Level.prototype.update = function() {
  return this.creatures.update();
};
Level.prototype.createNode = function() {
  return {
    type: "material",
    baseColor: {
      r: 0.75,
      g: 0.78,
      b: 0.85
    },
    specularColor: {
      r: 0.9,
      g: 0.9,
      b: 0.9
    },
    specular: 0.9,
    shine: 6.0,
    nodes: [
      {
        type: "translate",
        z: platformHeights[1],
        nodes: [this.creatures.node]
      }, towerPlacementNode(), this.createPlatformNode(0), this.createPlatformNode(1), this.createPlatformNode(2)
    ]
  };
};
Level.prototype.createPlatformNode = function(k) {
  return {
    type: "translate",
    z: platformHeights[k],
    nodes: [platformGeometry("level" + k), this.towerNodes[k].archerTowers, this.towerNodes[k].catapultTowers]
  };
};var LevelCamera;
/*
The camera proxy
*/
LevelCamera = function(levelNode) {
  this.optics = {
    type: "ortho",
    left: -12.5 * (canvasSize[0] / canvasSize[1]),
    right: 12.5 * (canvasSize[0] / canvasSize[1]),
    bottom: -12.5,
    top: 12.5,
    near: 0.1,
    far: 300.0
  };
  this.node = {
    type: "camera",
    id: "sceneCamera",
    optics: this.optics,
    nodes: [
      {
        type: "light",
        mode: "dir",
        color: {
          r: 1.0,
          g: 1.0,
          b: 1.0
        },
        diffuse: true,
        specular: false,
        dir: {
          x: 1.0,
          y: 1.0,
          z: -1.0
        }
      }, {
        type: "matrix",
        elements: [1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, platformScaleFactor, 0.0, 0.0, 0.0, 1.0],
        nodes: [levelNode]
      }
    ]
  };
  return this;
};
LevelCamera.prototype.withNode = function() {
  return SceneJS.withNode("sceneCamera");
};
LevelCamera.prototype.reconfigure = function(canvasSize) {
  this.optics.left = -12.5 * (canvasSize[0] / canvasSize[1]);
  this.optics.right = 12.5 * (canvasSize[0] / canvasSize[1]);
  return this.withNode().set("optics", this.optics);
};var LevelLookAt;
/*
The look-at proxy for the main game scene
*/
LevelLookAt = function(cameraNode, backgroundCameraNode) {
  this.angle = 0.0;
  this.radius = 10.0;
  this.lookAtNode = {
    type: "lookAt",
    id: "SceneLookAt",
    eye: {
      x: 0.0,
      y: -this.radius,
      z: 7.0
    },
    look: {
      x: 0.0,
      y: 0.0,
      z: 0.0
    },
    up: {
      x: 0.0,
      y: 0.0,
      z: 1.0
    },
    nodes: [cameraNode]
  };
  this.backgroundLookAtNode = {
    type: "lookAt",
    id: "BackgroundLookAt",
    eye: {
      x: 0.0,
      y: -this.radius,
      z: 7.0
    },
    look: {
      x: 0.0,
      y: 0.0,
      z: 0.0
    },
    up: {
      x: 0.0,
      y: 0.0,
      z: 1.0
    },
    nodes: [backgroundCameraNode]
  };
  this.node = {
    nodes: [
      {
        type: "translate",
        x: gameSceneOffset[0],
        y: gameSceneOffset[1],
        z: gameSceneOffset[2],
        nodes: [this.lookAtNode]
      }
    ]
  };
  return this;
};
LevelLookAt.prototype.withSceneLookAt = function() {
  return SceneJS.withNode("SceneLookAt");
};
LevelLookAt.prototype.withBackgroundLookAt = function() {
  return SceneJS.withNode("BackgroundLookAt");
};
LevelLookAt.prototype.update = function() {
  this.lookAtNode.eye = {
    x: (Math.sin(this.angle)) * this.radius,
    y: (Math.cos(this.angle)) * -this.radius,
    z: 7.0
  };
  this.backgroundLookAtNode.eye = this.lookAtNode.eye;
  this.withSceneLookAt().set("eye", this.lookAtNode.eye);
  return this.withBackgroundLookAt().set("eye", this.lookAtNode.eye);
};var GUIDais, guiDaisNode;
/*
A proxy for dais tower selection gui element
*/
guiDaisNode = function(id, index) {
  return {
    type: "translate",
    id: id,
    x: index * 1.5,
    nodes: [
      {
        type: "rotate",
        sid: "rotZ",
        angle: guiDaisRotPosition[index * 2],
        z: 1.0,
        nodes: [
          {
            type: "rotate",
            sid: "rotX",
            angle: guiDaisRotPosition[index * 2],
            x: 1.0,
            nodes: [
              {
                type: "texture",
                layers: [
                  {
                    uri: "textures/dais.jpg"
                  }
                ],
                nodes: [
                  {
                    type: "instance",
                    target: "NumberedDais"
                  }
                ]
              }, {
                type: "texture",
                layers: [
                  {
                    uri: towerTextureURI[index]
                  }
                ],
                nodes: [
                  {
                    type: "instance",
                    target: towerIds[index]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  };
};
GUIDais = function(index) {
  this.index = index;
  this.id = "dais" + index;
  this.node = guiDaisNode(this.id, index);
  return this;
};
GUIDais.prototype.update = function() {
  return SceneJS.withNode(this.id).node(0).set({
    angle: guiDaisRotPosition[this.index * 2],
    z: 1.0
  }).node(0).set({
    angle: guiDaisRotPosition[this.index * 2 + 1],
    x: 1.0
  });
};var GUI;
/*
Top level GUI container
*/
GUI = function() {
  this.daises = new Array(2);
  this.daises[0] = new GUIDais(0);
  this.daises[1] = new GUIDais(1);
  this.daisGeometry = SceneJS.createNode(BlenderExport.NumberedDais);
  this.selectedDais = -1;
  this.lightNode = {
    type: "light",
    mode: "dir",
    color: {
      r: 1.0,
      g: 1.0,
      b: 1.0
    },
    diffuse: true,
    specular: false,
    dir: {
      x: 1.0,
      y: 1.0,
      z: -1.0
    }
  };
  this.lookAtNode = {
    type: "lookAt",
    eye: {
      x: 0.0,
      y: -10.0,
      z: 4.0
    },
    look: {
      x: 0.0,
      y: 0.0
    },
    up: {
      z: 1.0
    }
  };
  this.node = {
    type: "translate",
    x: 8.0,
    y: 4.0,
    nodes: [
      {
        type: "material",
        baseColor: {
          r: 1.0,
          g: 1.0,
          b: 1.0
        },
        specularColor: {
          r: 1.0,
          g: 1.0,
          b: 1.0
        },
        specular: 0.0,
        shine: 0.0
      }, this.daises[0].node, this.daises[1].node
    ]
  };
  return this;
};
GUI.prototype.initialize = function() {
  SceneJS.withNode(this.daises[0].id).bind("picked", function(event) {
    return alert("#0 picked!");
  });
  return SceneJS.withNode(this.daises[1].id).bind("picked", function(event) {
    return alert("#1 picked!");
  });
};
GUI.prototype.update = function() {
  this.daises[0].update();
  return this.daises[1].update();
};
GUI.prototype.selectDais = function(daisNumber) {
  if (this.selectedDais >= 0) {
    $("#daisStats #daisStats" + this.selectedDais).removeClass("enabled");
    $("#daisStats #daisStats" + this.selectedDais).addClass("disabled");
  }
  this.selectedDais = daisNumber;
  $("#daisStats #daisStats" + daisNumber).removeClass("disabled");
  return $("#daisStats #daisStats" + daisNumber).addClass("enabled");
};
GUI.prototype.deselectDais = function() {
  if (this.selectedDais >= 0) {
    $("#daisStats #daisStats" + this.selectedDais).removeClass("enabled");
    $("#daisStats #daisStats" + this.selectedDais).addClass("disabled");
  }
  return (this.selectedDais = -1);
};var GUICamera;
GUICamera = function(gui, referenceCamera) {
  this.referenceCamera = referenceCamera;
  this.node = {
    type: "camera",
    id: "guiCamera",
    optics: levelCamera.optics,
    nodes: [gui.lightNode, gui.node]
  };
  return this;
};
GUICamera.prototype.withNode = function() {
  return SceneJS.withNode("guiCamera");
};
GUICamera.prototype.reconfigure = function() {
  return this.withNode().set("optics", this.referenceCamera.optics);
};var BackgroundCamera;
/*
Background proxies
*/
BackgroundCamera = function(backgroundNode) {
  this.optics = {
    type: "perspective",
    fovy: 25.0,
    aspect: canvasSize[0] / canvasSize[1],
    near: 0.10,
    far: 300.0
  };
  this.node = {
    type: "camera",
    id: "backgroundCamera",
    optics: this.optics
  };
  return this;
};
BackgroundCamera.prototype.withNode = function() {
  return SceneJS.withNode("backgroundCamera");
};
BackgroundCamera.prototype.reconfigure = function(canvasSize) {
  this.optics.aspect = canvasSize[0] / canvasSize[1];
  return this.withNode().set("optics", this.optics);
};var Moon, MoonModule;
/*
A proxy for the moon
*/
/*
Moon Module
*/
MoonModule = {
  vertexBuffer: null,
  textureCoordBuffer: null,
  shaderProgram: null,
  texture: null,
  createResources: function(gl) {
    var fragmentShader, tex, textureCoords, vertexShader, vertices;
    tex = (this.texture = gl.createTexture());
    tex.image = new Image();
    tex.image.src = "textures/moon.png";
    tex.image.onload = function() {
      return configureTexture(gl, tex);
    };
    this.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    vertices = [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    this.textureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordBuffer);
    textureCoords = [1.0, 0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
    this.shaderProgram = gl.createProgram();
    vertexShader = compileShader(gl, "moon-vs");
    fragmentShader = compileShader(gl, "moon-fs");
    gl.attachShader(this.shaderProgram, vertexShader);
    gl.attachShader(this.shaderProgram, fragmentShader);
    gl.linkProgram(this.shaderProgram);
    if (!gl.getProgramParameter(this.shaderProgram, gl.LINK_STATUS)) {
      alert("Could not initialise shaders");
    }
    gl.useProgram(this.shaderProgram);
    this.shaderProgram.vertexPosition = gl.getAttribLocation(this.shaderProgram, "vertexPosition");
    gl.enableVertexAttribArray(this.shaderProgram.vertexPosition);
    this.shaderProgram.textureCoord = gl.getAttribLocation(this.shaderProgram, "textureCoord");
    gl.enableVertexAttribArray(this.shaderProgram.textureCoord);
    this.shaderProgram.pos = gl.getUniformLocation(this.shaderProgram, "pos");
    this.shaderProgram.view = gl.getUniformLocation(this.shaderProgram, "view");
    this.shaderProgram.projection = gl.getUniformLocation(this.shaderProgram, "projection");
    this.shaderProgram.exposure = gl.getUniformLocation(this.shaderProgram, "exposure");
    this.shaderProgram.colorSampler = gl.getUniformLocation(this.shaderProgram, "colorSampler");
    return null;
  },
  destroyResources: function() {
    if (document.getElementById(canvas.canvasId)) {
      if (this.shaderProgram) {
        this.shaderProgram.destroy();
      }
      if (this.vertexBuffer) {
        this.vertexBuffer.destroy();
      }
      if (this.textureCoordBuffer) {
        this.textureCoordBuffer.destroy();
      }
      if (this.texture) {
        this.texture.destroy();
      }
    }
    return null;
  },
  render: function(gl, view, projection, pos) {
    var k, saveState, shaderProgram;
    saveState = {
      blend: gl.getParameter(gl.BLEND),
      depthTest: gl.getParameter(gl.DEPTH_TEST)
    };
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable(gl.BLEND);
    shaderProgram = this.shaderProgram;
    gl.useProgram(shaderProgram);
    for (k = 2; k <= 7; k++) {
      gl.disableVertexAttribArray(k);
    }
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.uniform1i(shaderProgram.colorSampler, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.enableVertexAttribArray(shaderProgram.vertexPosition);
    gl.vertexAttribPointer(shaderProgram.vertexPosition, 2, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordBuffer);
    gl.enableVertexAttribArray(shaderProgram.textureCoord);
    gl.vertexAttribPointer(shaderProgram.textureCoord, 2, gl.FLOAT, false, 0, 0);
    gl.uniform3f(shaderProgram.pos, pos[0], pos[1], pos[2]);
    gl.uniformMatrix4fv(shaderProgram.view, false, new Float32Array(view));
    gl.uniformMatrix4fv(shaderProgram.projection, false, new Float32Array(projection));
    gl.uniform1f(shaderProgram.exposure, 0.4);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, null);
    if (!saveState.blend) {
      gl.disable(gl.BLEND);
    }
    return null;
  }
};
/*
SceneJS listeners
*/
SceneJS._eventModule.addListener(SceneJS._eventModule.RESET, function() {
  return MoonModule.destroyResources();
});
/*
Moon proxy
*/
Moon = function() {
  this.velocity = [0.01, 0.0];
  return this;
};
Moon.prototype.render = function(gl, view, projection, time) {
  var cosAzim, cosIncl, orbit, position, sinAzim, sinIncl;
  orbit = [this.velocity[0] * time, this.velocity[1] * time];
  if (!MoonModule.vertexBuffer) {
    MoonModule.createResources(gl);
  }
  cosIncl = Math.cos(orbit[0]);
  sinIncl = Math.sin(orbit[0]);
  cosAzim = Math.cos(orbit[1]);
  sinAzim = Math.sin(orbit[1]);
  position = [cosIncl * sinAzim, cosIncl * cosAzim, sinIncl];
  return MoonModule.render(gl, view, projection, position);
};var Sun, SunModule;
/*
A proxy for the sun
*/
/*
Sun Module
*/
SunModule = {
  vertexBuffer: null,
  textureCoordBuffer: null,
  shaderProgram: null,
  texture: null,
  createResources: function(gl) {
    var fragmentShader, textureCoords, vertexShader, vertices;
    this.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    vertices = [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    this.textureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordBuffer);
    textureCoords = [1.0, 0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
    this.shaderProgram = gl.createProgram();
    vertexShader = compileShader(gl, "sun-vs");
    fragmentShader = compileShader(gl, "sun-fs");
    gl.attachShader(this.shaderProgram, vertexShader);
    gl.attachShader(this.shaderProgram, fragmentShader);
    gl.linkProgram(this.shaderProgram);
    if (!gl.getProgramParameter(this.shaderProgram, gl.LINK_STATUS)) {
      alert("Could not initialise shaders");
    }
    gl.useProgram(this.shaderProgram);
    this.shaderProgram.vertexPosition = gl.getAttribLocation(this.shaderProgram, "vertexPosition");
    gl.enableVertexAttribArray(this.shaderProgram.vertexPosition);
    this.shaderProgram.textureCoord = gl.getAttribLocation(this.shaderProgram, "textureCoord");
    gl.enableVertexAttribArray(this.shaderProgram.textureCoord);
    this.shaderProgram.pos = gl.getUniformLocation(this.shaderProgram, "pos");
    this.shaderProgram.view = gl.getUniformLocation(this.shaderProgram, "view");
    this.shaderProgram.projection = gl.getUniformLocation(this.shaderProgram, "projection");
    this.shaderProgram.exposure = gl.getUniformLocation(this.shaderProgram, "exposure");
    return null;
  },
  destroyResources: function() {
    if (document.getElementById(canvas.canvasId)) {
      if (this.shaderProgram) {
        this.shaderProgram.destroy();
      }
      if (this.vertexBuffer) {
        this.vertexBuffer.destroy();
      }
      if (this.textureCoordBuffer) {
        this.textureCoordBuffer.destroy();
      }
    }
    return null;
  },
  render: function(gl, view, projection, pos) {
    var k, saveState, shaderProgram;
    saveState = {
      blend: gl.getParameter(gl.BLEND),
      depthTest: gl.getParameter(gl.DEPTH_TEST)
    };
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable(gl.BLEND);
    shaderProgram = this.shaderProgram;
    gl.useProgram(shaderProgram);
    for (k = 2; k <= 7; k++) {
      gl.disableVertexAttribArray(k);
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.enableVertexAttribArray(shaderProgram.vertexPosition);
    gl.vertexAttribPointer(shaderProgram.vertexPosition, 2, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordBuffer);
    gl.enableVertexAttribArray(shaderProgram.textureCoord);
    gl.vertexAttribPointer(shaderProgram.textureCoord, 2, gl.FLOAT, false, 0, 0);
    gl.uniform3f(shaderProgram.pos, pos[0], pos[1], pos[2]);
    gl.uniformMatrix4fv(shaderProgram.view, false, new Float32Array(view));
    gl.uniformMatrix4fv(shaderProgram.projection, false, new Float32Array(projection));
    gl.uniform1f(shaderProgram.exposure, 0.4);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    if (!saveState.blend) {
      gl.disable(gl.BLEND);
    }
    return null;
  }
};
/*
SceneJS listeners
*/
SceneJS._eventModule.addListener(SceneJS._eventModule.RESET, function() {
  return SunModule.destroyResources();
});
/*
Sun proxy
*/
Sun = function() {
  this.velocity = [0.01, 0.0];
  this.position = [0.0, 0.0, 0.0];
  return this;
};
Sun.prototype.render = function(gl, view, projection, time) {
  var cosAzim, cosIncl, orbit, sinAzim, sinIncl;
  orbit = [Math.PI * 0.3 + this.velocity[0] * time, this.velocity[1] * time];
  if (!SunModule.vertexBuffer) {
    SunModule.createResources(gl);
  }
  cosIncl = Math.cos(orbit[0]);
  sinIncl = Math.sin(orbit[0]);
  cosAzim = Math.cos(orbit[1]);
  sinAzim = Math.sin(orbit[1]);
  this.position = [cosIncl * sinAzim, cosIncl * cosAzim, sinIncl];
  return SunModule.render(gl, view, projection, this.position);
};var DaisClouds, DaisCloudsModule;
/*
Copyright 2010, Rehno Lindeque.
This game is licensed under GPL Version 2. See http://gatesofolympus.com/LICENSE for more information.
*/
/*
A scenejs extension that renders a cloud particles around the daises
*/
/*
Dais Clouds Module
*/
DaisCloudsModule = {
  vertexBuffer: null,
  shaderProgram: null,
  createResources: function(gl) {
    var fragmentShader, vertexShader, vertices;
    this.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    vertices = [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    this.shaderProgram = gl.createProgram();
    vertexShader = compileShader(gl, "clouddome-vs");
    fragmentShader = compileShader(gl, "clouddome-fs");
    gl.attachShader(this.shaderProgram, vertexShader);
    gl.attachShader(this.shaderProgram, fragmentShader);
    gl.linkProgram(this.shaderProgram);
    if (!gl.getProgramParameter(this.shaderProgram, gl.LINK_STATUS)) {
      alert("Could not initialise shaders");
    }
    gl.useProgram(this.shaderProgram);
    this.shaderProgram.vertexPosition = gl.getAttribLocation(this.shaderProgram, "vertexPosition");
    gl.enableVertexAttribArray(this.shaderProgram.vertexPosition);
    return null;
  },
  destroyResources: function() {
    if (document.getElementById(canvas.canvasId)) {
      if (this.shaderProgram) {
        this.shaderProgram.destroy();
      }
      if (this.vertexBuffer) {
        this.vertexBuffer.destroy();
      }
    }
    return null;
  },
  render: function(gl, view, projection) {
    var saveState;
    saveState = {
      blend: gl.getParameter(gl.BLEND),
      depthTest: gl.getParameter(gl.DEPTH_TEST)
    };
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable(gl.BLEND);
    if (!saveState.blend) {
      gl.disable(gl.BLEND);
    }
    return null;
  }
};
/*
SceneJS listeners
*/
SceneJS._eventModule.addListener(SceneJS._eventModule.RESET, function() {
  return DaisCloudsModule.destroyResources();
});
/*
Dias clouds node type
*/
DaisClouds = function() {};
DaisClouds.prototype.render = function(gl, view, projection, time) {
  if (!DaisCloudsModule.vertexBuffer) {
    DaisCloudsModule.createResources(gl);
  }
  return DaisCloudsModule.render(gl, view, projection);
};var Atmosphere, AtmosphereModule;
/*
Copyright 2010, Rehno Lindeque.

 * This file is Dual licensed under the MIT or GPL Version 2 licenses.
 * It is intended to be compatible with http://scenejs.org/license so that changes can be back-ported.
*/
/*
A scenejs extension that renders the atmosphere (atmospheric scattering) using a full-screen quad and some procedural shaders.
*/
/*
Atmosphere Module
*/
AtmosphereModule = {
  vertexBuffer: null,
  shaderProgram: null,
  transmittanceProgram: null,
  transmittanceTexture: null,
  createTransmittanceResources: function(gl) {
    var fragmentShader, frameBuffer, textureHeight, textureWidth, vertexShader;
    this.transmittanceProgram = gl.createProgram();
    vertexShader = compileShader(gl, "fullscreenquad-vs");
    fragmentShader = compileShader(gl, "atmosphere-hi-transmittance-fs");
    gl.attachShader(this.transmittanceProgram, vertexShader);
    gl.attachShader(this.transmittanceProgram, fragmentShader);
    gl.linkProgram(this.transmittanceProgram);
    if (!gl.getProgramParameter(this.transmittanceProgram, gl.LINK_STATUS)) {
      alert("Could not initialise shaders");
    }
    gl.useProgram(this.transmittanceProgram);
    this.transmittanceProgram.vertexPosition = gl.getAttribLocation(this.transmittanceProgram, "vertexPosition");
    textureWidth = 256;
    textureHeight = 64;
    this.transmittanceTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.transmittanceTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.enableVertexAttribArray(this.transmittanceProgram.vertexPosition);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.vertexAttribPointer(this.shaderProgram.vertexPosition, 2, gl.FLOAT, false, 0, 0);
    frameBuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.transmittanceTexture, 0);
    gl.viewport(0, 0, textureWidth, textureHeight);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.deleteFramebuffer(frameBuffer);
    return null;
  },
  createResources: function(gl) {
    var fragmentShader, vertexShader, vertices;
    this.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    vertices = [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    this.shaderProgram = gl.createProgram();
    vertexShader = compileShader(gl, "fullscreenquad-vs");
    fragmentShader = compileShader(gl, "atmosphere-hi-fs");
    gl.attachShader(this.shaderProgram, vertexShader);
    gl.attachShader(this.shaderProgram, fragmentShader);
    gl.linkProgram(this.shaderProgram);
    if (!gl.getProgramParameter(this.shaderProgram, gl.LINK_STATUS)) {
      alert("Could not initialise shaders");
    }
    this.shaderProgram.camera = gl.getUniformLocation(this.shaderProgram, "camera");
    this.shaderProgram.sun = gl.getUniformLocation(this.shaderProgram, "sun");
    this.shaderProgram.invProjection = gl.getUniformLocation(this.shaderProgram, "invProjection");
    this.shaderProgram.invView = gl.getUniformLocation(this.shaderProgram, "invView");
    this.shaderProgram.exposure = gl.getUniformLocation(this.shaderProgram, "exposure");
    gl.useProgram(this.shaderProgram);
    this.shaderProgram.vertexPosition = gl.getAttribLocation(this.shaderProgram, "vertexPosition");
    return null;
  },
  destroyResources: function() {
    if (document.getElementById(canvas.canvasId)) {
      if (this.shaderProgram) {
        this.shaderProgram.destroy();
      }
      if (this.vertexBuffer) {
        this.vertexBuffer.destroy();
      }
    }
    return null;
  },
  render: function(gl, invView, invProjection, sun) {
    var saveState;
    saveState = {
      blend: gl.getParameter(gl.BLEND),
      depthTest: gl.getParameter(gl.DEPTH_TEST)
    };
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable(gl.BLEND);
    gl.depthMask(false);
    gl.useProgram(this.shaderProgram);
    gl.enableVertexAttribArray(this.shaderProgram.vertexPosition);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.vertexAttribPointer(this.shaderProgram.vertexPosition, 2, gl.FLOAT, false, 0, 0);
    gl.uniform3f(this.shaderProgram.camera, 0.0, 0.0, 1.0);
    gl.uniform3f(this.shaderProgram.sun, sun);
    gl.uniformMatrix4fv(this.shaderProgram.invProjection, false, new Float32Array(invProjection));
    gl.uniformMatrix4fv(this.shaderProgram.invView, false, new Float32Array(invView));
    gl.uniform1f(this.shaderProgram.exposure, 1.0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    if (!saveState.blend) {
      gl.disable(gl.BLEND);
    }
    gl.depthMask(true);
    return null;
  }
};
/*
SceneJS listeners
*/
SceneJS._eventModule.addListener(SceneJS._eventModule.RESET, function() {
  return AtmosphereModule.destroyResources();
});
/*
Cloud dome node type
*/
Atmosphere = function() {};
Atmosphere.prototype.render = function(gl, invView, invProjection, sun) {
  if (!AtmosphereModule.vertexBuffer) {
    AtmosphereModule.createResources(gl);
  }
  AtmosphereModule.render(gl, invView, invProjection, sun);
  return null;
};