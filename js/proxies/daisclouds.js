var DaisClouds, DaisCloudsModule, DaisCloudsNode;
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
    var fragmentShader, k, vertexShader, vertices;
    this.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    vertices = [];
    for (k = 0; k <= 19; k++) {
      vertices[k] = Math.random();
    }
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    this.shaderProgram = gl.createProgram();
    vertexShader = compileShader(gl, "cloudparticle-vs");
    fragmentShader = compileShader(gl, "cloudparticle-fs");
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
    var k, saveState, shaderProgram;
    saveState = {
      blend: gl.getParameter(gl.BLEND),
      depthTest: gl.getParameter(gl.DEPTH_TEST)
    };
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable(gl.BLEND);
    shaderProgram = this.shaderProgram;
    gl.useProgram(shaderProgram);
    for (k = 1; k <= 7; k++) {
      gl.disableVertexAttribArray(k);
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.enableVertexAttribArray(shaderProgram.vertexPosition);
    gl.vertexAttribPointer(shaderProgram.vertexPosition, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.POINTS, 0, 20);
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
DaisCloudsNode = SceneJS.createNodeType("dais-clouds");
DaisCloudsNode.prototype._render = function(traversalContext) {
  if (SceneJS._traversalMode === SceneJS._TRAVERSAL_MODE_RENDER) {
    this._renderNodes(traversalContext);
    this.view = identityMat4();
    this.projection = identityMat4();
  }
  return null;
};
DaisCloudsNode.prototype.getView = function() {
  return this.view;
};
DaisCloudsNode.prototype.getProjection = function() {
  return this.projection;
};
/*
Dias clouds proxy
*/
DaisClouds = function(index) {
  this.node = {
    type: "dais-clouds",
    id: "dais" + index + "clouds"
  };
  return this;
};
DaisClouds.prototype.withNode = function() {
  return SceneJS.withNode(this.node.id);
};
DaisClouds.prototype.render = function(gl, time) {
  var nodeRef, projection, view;
  nodeRef = this.withNode();
  view = nodeRef.get("view");
  projection = nodeRef.get("projection");
  if (!DaisCloudsModule.vertexBuffer) {
    DaisCloudsModule.createResources(gl);
  }
  return DaisCloudsModule.render(gl, view, projection);
};