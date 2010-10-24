#!/bin/sh
coffee --no-wrap -c -o js scenejsclouddome.coffee
coffee --no-wrap -c -o js scenejsdaisclouds.coffee
coffee --no-wrap -c -o js global.coffee
coffee --no-wrap -c -o js common.coffee
coffee --no-wrap -c -o js resources.coffee
coffee --no-wrap -c -o js creatures.coffee
coffee --no-wrap -c -o js scene.coffee
coffee --no-wrap -c -o js timeline.coffee
coffee --no-wrap -c -o js events.coffee
coffee --no-wrap -c -o js/proxies proxies.coffee
coffee --no-wrap -c -o js/proxies proxies/skybox.coffee
coffee --no-wrap -c -o js/proxies proxies/level.coffee
coffee --no-wrap -c -o js/proxies proxies/levelcamera.coffee
coffee --no-wrap -c -o js/proxies proxies/levellookat.coffee
coffee --no-wrap -c -o js/proxies proxies/guidais.coffee
coffee --no-wrap -c -o js/proxies proxies/gui.coffee
coffee --no-wrap -c -o js/proxies proxies/guicamera.coffee
coffee --no-wrap -c -o js/proxies proxies/backgroundcamera.coffee

cat \
js/proxies/proxies.js \
js/proxies/skybox.js \
js/proxies/level.js \
js/proxies/levelcamera.js \
js/proxies/levellookat.js \
js/proxies/guidais.js \
js/proxies/gui.js \
js/proxies/guicamera.js \
js/proxies/backgroundcamera.js \
> js/proxies.js

coffee           -c -o js main.coffee
