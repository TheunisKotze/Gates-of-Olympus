var addChild, compileShader;
var __slice = Array.prototype.slice;
/*
Copyright 2010, Rehno Lindeque.
This game is licensed under GPL Version 2. See http://gatesofolympus.com/LICENSE for more information.
*/
addChild = function(parent) {
  var children;
  children = __slice.call(arguments, 1);
  return (parent.nodes = Array.concat(parent.nodes, children));
};
compileShader = function(gl, id) {
  var child, httpRequest, scriptElement, shader, shaderType, str;
  scriptElement = document.getElementById(id);
  if (!scriptElement) {
    return null;
  }
  if (scriptElement.type === "x-shader/x-fragment") {
    shaderType = gl.FRAGMENT_SHADER;
  } else if (scriptElement.type === "x-shader/x-vertex") {
    shaderType = gl.VERTEX_SHADER;
  } else {
    return null;
  }
  str = "";
  if (scriptElement.src) {
    if (window.XMLHttpRequest) {
      httpRequest = new XMLHttpRequest();
    } else {
      return null;
    }
    httpRequest.open("GET", scriptElement.src, false);
    httpRequest.overrideMimeType('text/plain; charset=utf-8');
    httpRequest.send();
    str = httpRequest.responseText;
  } else {
    child = scriptElement.firstChild;
    while (child) {
      if (child.nodeType === 3) {
        str += child.textContent;
      }
      child = child.nextSibling;
    }
  }
  shader = gl.createShader(shaderType);
  gl.shaderSource(shader, str);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(gl.getShaderInfoLog(shader));
    return null;
  }
  return shader;
};