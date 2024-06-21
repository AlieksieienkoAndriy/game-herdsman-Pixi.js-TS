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
      ]
    }
  }