
###
Tower scene graph nodes
###

towerNode = (index, id, instances) -> 
  type: "material"
  baseColor:      { r: 0.0, g: 0.0, b: 0.0 }
  specularColor:  { r: 1.0, g: 1.0, b: 1.0 }
  specular:       0.0
  shine:          0.0
  nodes: [
    type:   "texture"
    id:     id
    layers: [ uri: towerTextureURI[index] ]
    nodes:  instances
  ]

towerPlacementNode = ->
  type: "translate"
  id: "placementTower" 
  z: platformHeights[1]
  nodes: [
    type: "selector"
    id: "placementTowerModel"
    selection: [0]
    nodes: [
      towerNode(0, "placementTower"+0, [{ type: "instance", target: towerIds[0] }])
      towerNode(1, "placementTower"+1, [{ type: "instance", target: towerIds[1] }])
      towerNode(2, "placementTower"+2, [{ type: "instance", target: towerIds[2] }])
    ]
  ]

###
A proxy for the whole level with platforms and creatures etc.
###

class Level
  constructor: () ->
    @towers = new Towers
    @creatures = new Creatures
    @towerNodes = [
        archerTowers:   towerNode(0, "archerTowers0", [])
        catapultTowers: towerNode(1, "catapultTowers0", [])
        ballistaTowers: towerNode(2, "ballistaTowers0", [])
      ,
        archerTowers:   towerNode(0, "archerTowers1", [])
        catapultTowers: towerNode(1, "catapultTowers1", [])
        ballistaTowers: towerNode(2, "ballistaTowers1", [])
      ,
        archerTowers:   towerNode(0, "archerTowers2", [])
        catapultTowers: towerNode(1, "catapultTowers2", [])
        ballistaTowers: towerNode(2, "ballistaTowers2", [])
      ]
    @node = @createNode()
  
  # Get the root node for placing towers
  getTowerRoot: (level, towerType) ->
    switch towerType
      when 0 then @towerNodes[level].archerTowers
      when 1 then @towerNodes[level].catapultTowers
      when 2 then @towerNodes[level].ballistaTowers
      else null
  
  # Add a tower of the specified type at the position indicated by the tower placement
  addTower: (towerPlacement, towerType) ->
    index = towerPlacement.level * sqrGridSize + towerPlacement.cell.y * gridSize + towerPlacement.cell.x
    #alert towerPlacement.cell.x + " " + towerPlacement.cell.y
    if @towers.towers[index] == -1
      @towers.towers[index] = towerType
      parentNode = @getTowerRoot(towerPlacement.level, towerType)
      node = { type: "instance", target: towerIds[towerType] }
      cx = towerPlacement.cell.x
      cy = towerPlacement.cell.y
      cz = towerPlacement.level
      SceneJS.withNode(parentNode.nodes[0].id)
        .add("nodes", [
          type: "translate"
          x: cellScale * (cx - gridSize / 2) + cellScale * 0.5
          y: cellScale * (cy - gridSize / 2) + cellScale * 0.5
          nodes: [ node ]
        ])
    null
  
  #createTowers: ->
  #  for cz in [0...levels]
  #    for cy in [0...gridSize]
  #      for cx in [0...gridSize]
  #        t = @towers.towers[cz * sqrGridSize + cy * gridSize + cx]
  #        if t != -1
  #          switch t
  #            when 0 
  #              parentNode = @towerNodes[cz].archerTowers
  #            when 1 
  #              parentNode = @towerNodes[cz].catapultTowers
  #          
  #          SceneJS.withNode(parentNode.nodes[0].id)
  #            .add("nodes", [
  #              type: "translate"
  #              x: cellScale * (cx - gridSize / 2) + cellScale * 0.5
  #              y: cellScale * (cy - gridSize / 2) + cellScale * 0.5
  #              nodes: [
  #                type: "instance"
  #                target: towerIds[t]
  #              ]
  #            ])
  #  null
  
  # Update the game logic related to the level
  update: ->
    @creatures.update()
  
  # Create the node hierarchy for the level
  createNode: ->
    type: "material"
    #baseColor:      { r: 0.7, g: 0.7, b: 0.7 }
    baseColor:      { r: 0.75, g: 0.78, b: 0.85 }
    specularColor:  { r: 0.9, g: 0.9, b: 0.9 }
    specular:       0.9
    shine:          6.0
    nodes: [
      type: "translate"
      z: platformHeights[1]
      nodes: [ @creatures.node ]
    ,
      towerPlacementNode()
    ,
      @createPlatformNode(0)
    ,
      @createPlatformNode(1)
    ,
      @createPlatformNode(2)
    ]
  
  # Create the node hierarchy for one platform
  createPlatformNode: (k) ->
    type: "translate"
    z: platformHeights[k]
    nodes: @platformGeometry("level" + k).concat([
      @towerNodes[k].archerTowers
      @towerNodes[k].catapultTowers
      @towerNodes[k].ballistaTowers
    ])
  
  # Create the platform geometry
  platformGeometry: (platformId) ->
    s = gridSize * cellScale  # scale size of the grid in world space
    n = gridSize
    p = new Array((n+1) * (n+1) * 3)
    #i = new Array(n * n * 6)
    i = new Array(n * n * 3)
    
    for cy in [0..n]
      for cx in [0..n]
        p[((cy * (n+1) + cx) * 3 + 0)] = s * (cx  ) / n - s * 0.5
        p[((cy * (n+1) + cx) * 3 + 1)] = s * (cy  ) / n - s * 0.5
        p[((cy * (n+1) + cx) * 3 + 2)] = 0.0
    
    for cy in [0..n-1]
      for cx in [0..n-1]
        gridIndex = (cy*n + cx*2) * 6
        i[gridIndex + 0..gridIndex + 5] = [
          (cy  )*(n+1) + (cx + 0), 
          (cy  )*(n+1) + (cx + 1),
          (cy+1)*(n+1) + (cx + 0),
          (cy+1)*(n+1) + (cx + 0),
          (cy  )*(n+1) + (cx + 1),
          (cy+1)*(n+1) + (cx + 1)
        ]
    [
      type:   "geometry"
      resource: platformId
      id: platformId
      primitive: "triangles"
      positions: p
      indices: i
    ]

