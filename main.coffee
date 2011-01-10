###
Gates of Olympus (A multi-layer Tower Defense game...)
Copyright 2010-2011, Rehno Lindeque, Theunis Kotze.

* Please visit http://gatesofolympus.com/.
* This game is licensed under GPL Version 2. See http://gatesofolympus.com/LICENSE for more information.
###


###
Initialization and rendering loop
###

canvas = document.getElementById(scene.node.canvasId)
canvas.width = window.innerWidth
canvas.height = window.innerHeight
scene.withNode().render()
gui.initialize()


###
Sound
###
###
marchSound = document.getElementById('march')
marchSoundListener = () ->
	this.pause()
	this.currentTime = 0
	this.play()
	
marchSound.addEventListener('ended', marchSoundListener, false)
###

# Manual webgl initialization (for rendering things stand-alone
#customGL = canvas.getContext("experimental-webgl");
customGL = canvas.getContext("experimental-webgl",
#  alpha: true
  antialias: false
#  stencil: true
#  premultipliedAlpha: true
)
#customGL = canvas.getContext("webgl");

###
Development
###

# Comment out these lines when pushing to the web (production environment)

SceneJS.setDebugConfigs({ webgl: { logTrace: true } })


###
Game logic
###

# Towers
#level.createTowers()

# Creatures
#level.creatures.addCreature(Scorpion)
level.creatures.addCreature(Fish)
#level.creatures.addCreature(Snake)

#floydInit()
floodInit()

###
User input 
###

# Calculate the intersection of any xy-plane 
intersectRayXYPlane = (rayOrigin, rayDirection, planeZ) ->
  if rayDirection[2] == 0
    null                  # The ray is parallel to the plane
  else
    zDist = planeZ - rayOrigin[2]
    dist = zDist / rayDirection[2]
    #alert "z " + zDist + " dist " + dist
    if dist < 0
      #alert "Plane behind camera.."
      null
    else
      addVec3(rayOrigin, mulVec3Scalar(rayDirection, dist))

# Mouse inputs
mouseLastX = 0
mouseLastY = 0
mouseDragging = false

# Calculate tower placement
calcTowerPlacement = (level, intersection) ->
  x: Math.floor(intersection[0] / (cellScale * platformScales[level]) + gridHalfSize)
  y: Math.floor(intersection[1] / (cellScale * platformScales[level]) + gridHalfSize)

# Update the placement of the platform according to the mouse coordinates and tower selection
updateTowerPlacement = ->
  mouseX = mouseLastX
  mouseY = mouseLastY
  canvasElement = document.getElementById("gameCanvas");
  mouseX -= canvasElement.offsetLeft
  mouseY -= canvasElement.offsetTop
  
  # Transform ray origin into world space
  sceneLookAt = levelLookAt.withSceneLookAt()
  lookAtEye  = sceneLookAt.get("eye")
  lookAtUp   = sceneLookAt.get("up")
  lookAtLook = sceneLookAt.get("look")
  rayOrigin  = [lookAtEye.x, lookAtEye.y, lookAtEye.z]
  yAxis      = [lookAtUp.x, lookAtUp.y, lookAtUp.z]
  zAxis      = [lookAtLook.x, lookAtLook.y, lookAtLook.z]
  zAxis      = subVec3(zAxis, rayOrigin)
  zAxis      = normalizeVec3(zAxis)
  xAxis      = normalizeVec3(cross3Vec3(zAxis,yAxis))
  yAxis      = cross3Vec3(xAxis, zAxis)
  screenX    = mouseX / canvasSize[0]
  screenY    = 1.0 - mouseY / canvasSize[1]
  rayOrigin  = addVec3(rayOrigin, mulVec3Scalar(xAxis, lerp(screenX, levelCamera.optics.left, levelCamera.optics.right)))
  rayOrigin  = addVec3(rayOrigin, mulVec3Scalar(yAxis, lerp(screenY, levelCamera.optics.bottom, levelCamera.optics.top)))
  rayOrigin  = addVec3(rayOrigin, mulVec3Scalar(xAxis, gameSceneOffset[0]))
  rayOrigin  = addVec3(rayOrigin, mulVec3Scalar(yAxis, gameSceneOffset[1]))
  rayOrigin  = addVec3(rayOrigin, mulVec3Scalar(zAxis, gameSceneOffset[2]))
  
  rayDirection = zAxis
  
  # Find the intersection with one of the platforms
  intersection = intersectRayXYPlane(rayOrigin, rayDirection, platformScaleHeights[0])
  #alert intersection + " [" + rayOrigin + "] [" + rayDirection + "] " + platformHeights[0]
  if intersection? and Math.abs(intersection[0]) < platformScaleLengths[0] and Math.abs(intersection[1]) < platformScaleLengths[0]
    #alert "Platform 1 intersected (" + intersection[0] + "," + intersection[1] + ")"
    towerPlacement.level  = 0
    towerPlacement.cell = calcTowerPlacement(towerPlacement.level, intersection)
  else 
    intersection = intersectRayXYPlane(rayOrigin, rayDirection, platformScaleHeights[1])
    if intersection? and Math.abs(intersection[0]) < platformScaleLengths[1] and Math.abs(intersection[1]) < platformScaleLengths[1]
      #alert "Platform 2 intersected (" + intersection[0] + "," + intersection[1] + ")"
      towerPlacement.level  = 1
      towerPlacement.cell = calcTowerPlacement(towerPlacement.level, intersection)
    else
      intersection = intersectRayXYPlane(rayOrigin, rayDirection, platformScaleHeights[2])
      if intersection? and Math.abs(intersection[0]) < platformScaleLengths[2] and Math.abs(intersection[1]) < platformScaleLengths[2]
        #alert "Platform 3 intersected (" + intersection[0] + "," + intersection[1] + ")"
        towerPlacement.level  = 2
        towerPlacement.cell = calcTowerPlacement(towerPlacement.level, intersection)
      else
        towerPlacement.level  = -1
        towerPlacement.cell.x = -1
        towerPlacement.cell.y = -1
        
  # Update the placement tower node
  if towerPlacement.level != -1 and gui.selectedDais != -1
    SceneJS.withNode("placementTower")
      .set(
        #x: intersection[0]
        #y: intersection[1]
        x: (towerPlacement.cell.x - gridSize * 0.5 + 0.5) * cellScale
        y: (towerPlacement.cell.y - gridSize * 0.5 + 0.5) * cellScale
        z:  platformHeights[towerPlacement.level]
		  )
      .node("placementTowerModel")
      .set("selection", [gui.selectedDais])
  else
    SceneJS.withNode("placementTower").node("placementTowerModel").set("selection", [])
  null

keyDown = (event) ->
  #switch String.fromCharCode(event.keyCode)
  switch event.keyCode
    when key1   then gui.selectDais(0)
    when key2   then gui.selectDais(1)
    when key3   then gui.selectDais(2)
    when keyESC then gui.deselectDais()
  updateTowerPlacement()

mouseDown = (event) ->
  mouseLastX = event.clientX
  mouseLastY = event.clientY
  mouseDragging = true
  
mouseUp = ->
  #alert "Up! " + mouseDragging + " " + towerPlacement + " " + gui.selectedDais
  if towerPlacement.level != -1 and gui.selectedDais != -1
    level.addTower(towerPlacement, gui.selectedDais)
    dirtyLevel[towerPlacement.level] = true
  mouseDragging = false
  
  # Determine which object has been picked
  scene.withNode().pick(mouseLastX, mouseLastY)
  
  # Render the scene after picking to avoid flickering
  renderExtras()

mouseMove = (event) ->
  if mouseDragging
    levelLookAt.angle += (event.clientX - mouseLastX) * mouseSpeed
    levelLookAt.update()
  mouseLastX = event.clientX
  mouseLastY = event.clientY
  if not mouseDragging
    updateTowerPlacement()

canvas.addEventListener('mousedown', mouseDown, true)
canvas.addEventListener('mousemove', mouseMove, true)
canvas.addEventListener('mouseup', mouseUp, true)
document.onkeydown = keyDown

window.onresize = ->
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  canvasSize[0] = window.innerWidth
  canvasSize[1] = window.innerHeight
  backgroundCamera.reconfigure(canvasSize)
  levelCamera.reconfigure(canvasSize)
  guiCamera.reconfigure()

renderExtras = ->
  # Render the gui additions
  #gui.daises[0].daisClouds.render(customGL, timeline.time)

  # Calculate common rendering parameters
  eye = levelLookAt.backgroundLookAtNode.eye
  look = levelLookAt.backgroundLookAtNode.look
  up = levelLookAt.backgroundLookAtNode.up
  view = lookAtMat4c(
    eye.x, eye.y, 0.0,
    look.x, look.y, 1.0,
    up.x, up.y, up.z
  )

  optics = backgroundCamera.optics
  projection = perspectiveMatrix4(
    optics.fovy * Math.PI / 180.0
    optics.aspect
    optics.near
    optics.far
  )
  
  # Render the atmospheric dome
  #if not CloudDomeModule.vertexBuffer then CloudDomeModule.createResources(customGL) 
  #CloudDomeModule.renderDome(customGL, inverseMat4(projection), inverseMat4(view))
  #atmosphere.render(customGL, inverseMat4(projection), inverseMat4(view), sun.position)
  atmosphere.render(customGL, mat4To3(view), inverseMat4(projection), optics.near, sun.position)
  
  # Render astronomical objects
  moon.render(customGL, view, projection, timeline.time)
  sun.render(customGL, view, projection, timeline.time)

  # Render the gui additions
  for c in [0..numTowerTypes-1]
    gui.daises[c].daisClouds.render(customGL, timeline.time)

renderScene = ->
  # Render the scenejs scene
  scene.withNode().render()
  renderExtras()

window.render = ->
  # Animate the gui daises
  for c in [0..(2*numTowerTypes-1)]
    guiDaisRotVelocity[c] += (Math.random() - 0.5) * 0.005
    guiDaisRotVelocity[c] -= 0.0003 if guiDaisRotPosition[c] > 0
    guiDaisRotVelocity[c] += 0.0003 if guiDaisRotPosition[c] < 0
    guiDaisRotVelocity[c] = clamp(guiDaisRotVelocity[c], -0.5, 0.5)
    guiDaisRotPosition[c] += guiDaisRotVelocity[c]
    guiDaisRotPosition[c] = clamp(guiDaisRotPosition[c], -30.0, 30.0)
  
  gui.update()
  # ai must be updated before level, as creatures get updated there
  updateAI()
  level.update()

  # Animate the sun / moon lighting
  lightAmount = clamp((sun.position[2] + 0.7) * 1.2, 0.2, 1.5)
  scene.updateSunLight([lightAmount, lightAmount, lightAmount], negateVector3(sun.position))
  lightAmount = clamp((moon.position[2] + 0.5) * 0.5, 0.2, 0.75)
  scene.updateMoonLight([lightAmount, lightAmount, lightAmount], negateVector3(moon.position))
  
  # Update game events
  timeline.update(1.0/60.0);
  
  # Render the scene
  renderScene()

interval = window.setInterval("window.render()", 10);

#SceneJS.withNode("gameScene").start({ fps: 100 });

