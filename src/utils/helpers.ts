import { Spine } from "pixi-spine";
import * as PIXI from "pixi.js";

 class Utils {
  static hitRectangle(a: PIXI.Container | Spine, b: PIXI.Container) {
    const ab = (a as PIXI.Container).getBounds();
    const bb = b.getBounds();
    
    return ab.x + ab.width > bb.x && ab.x < bb.x + bb.width && ab.y + ab.height > bb.y && ab.y < bb.y + bb.height;
  };

  static getRandomNum(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
} 

export { Utils };