import * as PIXI from "pixi.js";

export const manifest: PIXI.AssetInitOptions = {
    manifest: {
      bundles: [
        {
          name: "images",
          assets: {
            "bg": "resources/images/lawn.jpg",            
          }
        },
        {
          name: "atlases",
          assets: {
            "sheeps": "resources/atlases/sheeps.json",
            "atlas": "resources/atlases/atlas.json",
          }
        },
        {
          name: "fonts",
          assets: {
            "DoHyeon": "resources/fonts/DoHyeon-Regular.ttf",
            "desyrel": "resources/bitmap_fonts/desyrel.xml",
          }
        },
        {
          name: "spines",
          assets: {
            "spineboy": "resources/spine/boy/spineboy-pro.json",
          }
        },
        {
          name: "sounds",
          assets: {
            "bg_sound": "resources/sounds/bg.mp3",
            "collect_sound": "resources/sounds/collect.mp3",
            "sheep_sound": "resources/sounds/sheep.mp3",
            "win_sound": "resources/sounds/win.mp3",
            "fail_sound": "resources/sounds/fail.mp3",
            "steps_sound": "resources/sounds/steps.mp3",
            "lost_sound": "resources/sounds/lost.mp3",
          }
        },
      ]
    }
  }