import * as PIXI from "pixi.js";

export const manifest: PIXI.AssetInitOptions = {
    manifest: {
      bundles: [
        {
          name: "images",
          assets: {
            "bg": "resources/sprites/lawn.jpg",
            "corral": "resources/sprites/corral.png",
            "black_bg": "resources/sprites/black_bg.png",
            "restart_button": "resources/sprites/restart_button.png"
          }
        },
        {
          name: "atlasses",
          assets: {
            "sheeps": "resources/sprites/sheeps.json",
          }
        },
        {
          name: "fonts",
          assets: {
            "DoHyeon": "resources/fonts/DoHyeon-Regular.ttf",
          }
        },
        {
          name: "spines",
          assets: {
            "spineboy": "resources/spine/boy/spineboy-pro.json",
          }
        },
      ]
    }
  }