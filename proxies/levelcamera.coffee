
###
The camera proxy
###

class LevelCamera
  constructor: (levelNode) ->
    @optics = 
      type:   "ortho"
      left:   -12.5 * (canvasSize[0] / canvasSize[1])
      right:   12.5 * (canvasSize[0] / canvasSize[1])
      bottom: -12.5
      top:     12.5
      near:    0.1
      far:     300.0
    @node = 
      type: "camera"
      id:   "sceneCamera"
      optics: @optics
      nodes: [
          type: "matrix"
          elements: [
            1.0, 0.0, 0.0, 0.0
            0.0, 1.0, 0.0, 0.0
            0.0, 0.0, 1.0, platformScaleFactor
            0.0, 0.0, 0.0, 1.0
          ]
          nodes: [ levelNode ]
        ]
  
  withNode: -> SceneJS.withNode "sceneCamera"

  reconfigure: (canvasSize) -> 
    @optics.left  = -12.5 * (canvasSize[0] / canvasSize[1])
    @optics.right =  12.5 * (canvasSize[0] / canvasSize[1])
    @withNode().set("optics", @optics)

