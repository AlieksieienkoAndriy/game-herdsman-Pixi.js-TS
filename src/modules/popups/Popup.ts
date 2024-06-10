import * as PIXI from "pixi.js";
import { Listener } from "../../utils/Listener";

export abstract class Popup {  
  container: PIXI.Container;
  listener: Listener = Listener.getInstance();

  constructor() {
    this.container = new PIXI.Container();
    this.container.zIndex = 2;
    
    this.createBackground();
    this.createText();
    this.createButton();    
  }

  createBackground() {
    const bg = new PIXI.Sprite(PIXI.Texture.WHITE);
    bg.tint = 0x000000;
    bg.width = 1440;
    bg.height = 810;
    bg.alpha = 0.7;
    this.container.addChild(bg as PIXI.DisplayObject);
  };

  createText() {    
  }

  createButton() {    
  }
}