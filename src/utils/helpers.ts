import { Spine } from "pixi-spine";
import * as PIXI from "pixi.js";
import { Herd } from "../modules/Herd";
import { Herdsman } from "../modules/Herdsman";

export class Utils {
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

export type ControllerParams = {
  herd: Herd,
  herdsman: Herdsman,
  corral: PIXI.Sprite,
  score: PIXI.Text,
  lives: PIXI.Container
}

export type Point = {
  x: number,
  y: number
}

export type Subscription = {
  event: string,
  func: any,
  context: any
}

export enum State {
  idle = 1,
  play = 2,
  won = 3,
  lose = 4,
}

// export { Utils, ControllerParams, Point, State };