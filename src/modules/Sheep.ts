import anime from "animejs";
import * as PIXI from "pixi.js";
import { CONFIG } from "../config";
import { Herdsman } from "./Herdsman";
import { Point } from "../utils/types";


export class Sheep {
  sprite!: PIXI.AnimatedSprite;
  isFolowing: boolean = false;
  isRunningAway: boolean = false;
  protected _walk: any;


  constructor(pos: Point) {
    this._init(pos);
    this._addListeners();
  }

  protected _init(pos: Point) {
    const config = CONFIG.game.sheep;    
    
    const sheet: PIXI.Spritesheet = PIXI.Assets.get('sheeps');

    this.sprite = new PIXI.AnimatedSprite(sheet.animations["walk"]);
   
    (this.sprite as any).position.set(pos.x, pos.y);
    (this.sprite as any).scale.set(config.scale, config.scale);
    (this.sprite as any).anchor.set(0.5, 1);
    this.sprite.animationSpeed = 0.1;
  }

  protected _addListeners() {
    this.sprite.on('follow_herdsman', (index: number) => {
      const pos: Point = {
        x: Herdsman.destination.x + ((index + 1) * CONFIG.game.herd.distance),
        y: Herdsman.destination.y
      }
      
      this.isFolowing = true;    
      this.move(pos);
    });

    this.sprite.once('get_to_corral', (pos: Point) => {
      this.move(pos);
    }) 
  }

  move(point: Point) {
    const config = CONFIG.game.sheep;
    this.sprite.scale.x = (point.x > this.sprite.x) ? config.scale : -config.scale;

    if (this._walk && !this._walk.completed) {
      this._walk.remove(this.sprite.position);
    }

    this._walk = anime({
      targets: (this.sprite as any).position,
      easing: "linear",
      x: point.x,      
      y: point.y,      
      duration: this.isRunningAway ? config.walkDuration * 3 : config.walkDuration,
      loop: false,
      complete: () => {
        this.sprite.stop();
        if (this.isRunningAway) {
          this.sprite.emit('lost');
        }        
      }      
    });

    this._walk.play();
    this.sprite.play();
  }
}