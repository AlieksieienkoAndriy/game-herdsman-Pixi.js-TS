import * as PIXI from "pixi.js";
import { Herdsman } from "../modules/Herdsman";

type ControllerParams = {    
    herdsman: Herdsman,
    corral: PIXI.Sprite,
    score: PIXI.Text,
    lives: PIXI.Container
}

type Point = {
    x: number,
    y: number
}

type Subscription = {
    event: string,
    func: any,
    context: any
}

enum State {
    idle = 1,
    play = 2,
    won = 3,
    lose = 4,
}

export { State };
export type { ControllerParams, Point, Subscription };