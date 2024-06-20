import * as PIXI from "pixi.js";
import { Herdsman } from "../modules/Herdsman";

export interface IScene extends PIXI.DisplayObject {
    update(framesPassed: number): void;
    destroyScene(): void
}

type SheepControllerParams = {
    herdsman: Herdsman,
    corral: PIXI.Sprite
}

type ScoreControllerParams = {
    score: PIXI.BitmapText,
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
    idle = 'idle',
    play = 'play',
    won = 'won',
    lose = 'lose',
}

export { State };
export type { SheepControllerParams, ScoreControllerParams, Point, Subscription };