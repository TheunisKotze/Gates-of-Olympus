(function(){
  var canvas, dragging, gameScene, lastX, lastY, mouseDown, mouseMove, mouseUp, pitch, yaw;
  gameScene = SceneJS.scene({
    canvasId: "gameCanvas"
  }, SceneJS.lookAt({
    eye: {
      x: 0.0,
      y: 10.0,
      z: -15
    },
    look: {
      y: 1.0
    },
    up: {
      y: 1.0
    }
  }, SceneJS.camera({
    optics: {
      type: "perspective",
      fovy: 25.0,
      aspect: 1.0,
      near: 0.10,
      far: 300.0
    }
  }, SceneJS.lights({
    sources: [
      {
        type: "dir",
        color: {
          r: 1.0,
          g: 0.5,
          b: 0.5
        },
        diffuse: true,
        specular: true,
        dir: {
          x: 1.0,
          y: 1.0,
          z: -1.0
        }
      }, {
        type: "dir",
        color: {
          r: 0.5,
          g: 1.0,
          b: 0.5
        },
        diffuse: true,
        specular: true,
        dir: {
          x: 0.0,
          y: 1.0,
          z: -1.0
        }
      }, {
        type: "dir",
        color: {
          r: 0.2,
          g: 0.2,
          b: 1.0
        },
        diffuse: true,
        specular: true,
        dir: {
          x: -1.0,
          y: 0.0,
          z: -1.0
        }
      }
    ]
  }, SceneJS.rotate(function(data) {
    return {
      angle: data.get('pitch'),
      x: 1.0
    };
  }, SceneJS.rotate(function(data) {
    return {
      angle: data.get('yaw'),
      y: 1.0
    };
  }, SceneJS.material({
    baseColor: {
      r: 0.3,
      g: 0.3,
      b: 0.9
    },
    specularColor: {
      r: 0.9,
      g: 0.9,
      b: 0.9
    },
    specular: 0.9,
    shine: 6.0
  }, SceneJS.scale({
    x: 1.0,
    y: 1.0,
    z: 1.0
  }, SceneJS.objects.teapot()))))))));
  yaw = 0;
  pitch = 0;
  lastX = 0;
  lastY = 0;
  dragging = false;
  gameScene.setData({
    yaw: yaw,
    pitch: pitch
  }).render();
  canvas = document.getElementById(gameScene.getCanvasId());
  mouseDown = function(event) {
    lastX = event.clientX;
    lastY = event.clientY;
    dragging = true;
    return dragging;
  };
  mouseUp = function() {
    dragging = false;
    return dragging;
  };
  mouseMove = function(event) {
    if (dragging) {
      yaw += (event.clientX - lastX) * 0.5;
      pitch += (event.clientY - lastY) * -0.5;
      gameScene.setData({
        yaw: yaw,
        pitch: pitch
      }).render();
      lastX = event.clientX;
      lastY = event.clientY;
      return lastY;
    }
  };
  canvas.addEventListener('mousedown', mouseDown, true);
  canvas.addEventListener('mousemove', mouseMove, true);
  canvas.addEventListener('mouseup', mouseUp, true);
})();
