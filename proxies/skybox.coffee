#
# Copyright 2010-2011, Rehno Lindeque, Theunis Kotze.
# This game is licensed under GPL Version 2. See http://gatesofolympus.com/LICENSE for more information.
#

###
A proxy for the skybox
###

class Skybox
  constructor: ->
    @node = 
      type: "scale"
      x: 100.0
      y: 100.0
      z: 100.0
      nodes: [
        type:           "material"
        baseColor:      { r: 0.0, g: 0.0, b: 0.0 }
        specularColor:  { r: 1.0, g: 1.0, b: 1.0 }
        specular:       0.0
        shine:          0.0
        nodes: [
          type: "texture"
          layers: [{uri:"textures/sky.png"}]
          nodes: [
            type:       "geometry"
            primitive:  "triangles"
            positions:  [1, 1, 1,-1, 1, 1,-1,-1, 1, 1,-1, 1, 1, 1, 1, 1,-1, 1, 1,-1,-1, 1, 1,-1, 1, 1, 1, 1, 1,-1,-1, 1,-1,-1, 1, 1,-1, 1, 1,-1, 1,-1,-1,-1,-1,-1,-1, 1,-1,-1,-1, 1,-1,-1, 1,-1, 1,-1,-1, 1, 1,-1,-1,-1,-1,-1,-1, 1,-1, 1, 1,-1]
            uv:         [1,1,0,1,0,0,1,0,0,1,0,0,1,0,1,1,1,0,1,1,0,1,0,0,1,1,0,1,0,0,1,0,0,0,1,0,1,1,0,1,0,0,1,0,1,1,0,1]
            indices:    [0,1,2,0,2,3,4,5,6,4,6,7,8,9,10,8,10,11,12,13,14,12,14,15,16,17,18,16,18,19,20,21,22,20,22,23]
          ]
        ]
      ]

