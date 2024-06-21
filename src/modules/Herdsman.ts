import anime from "animejs";
import * as PIXI from "pixi.js";
import * as pixiSound from "@pixi/sound";

import { Spine } from "pixi-spine";
import { CONFIG } from "../config";
import { Point } from "../utils/types";


export class Herdsman {
  static destination: Point;

  spine!: Spine;
  isMoving: boolean = false;
  protected _walk: any;

  constructor() {
    this._init();
  }

  protected _init() {
    const config = CONFIG.game.herdsman;

    this.spine = new Spine(PIXI.Assets.get("spineboy").spineData);
    (this.spine as any).position.set(config.startPos.x, config.startPos.y);
    (this.spine as any).scale.set(-config.scale, config.scale);
  }

  move(point: Point) {
    const config = CONFIG.game.herdsman;

    if (point.y < config.limitY) {
      point.y = config.limitY
    }

    Herdsman.destination = point;
    this.isMoving = true;
    (this.spine as any).scale.x = (point.x > (this.spine as any).x) ? config.scale : -config.scale;
    this.spine.state.setAnimation(0, 'walk', true);

    if (this._walk && !this._walk.completed) {
      this._walk.remove((this.spine as any).position);
    }

    pixiSound.sound.play('steps_sound', {
      loop: true,
    });

    this._walk = anime({
      targets: (this.spine as any).position,
      easing: "linear",
      x: point.x,      
      y: point.y,      
      duration: config.walkDuration,
      loop: false,

      complete: () => {
        pixiSound.sound.stop('steps_sound');
        this.isMoving = false;
        this.idle();
      }
    });

    this._walk.play();
  }

  idle() {
    this.spine.state.clearTrack(0);
    this.spine.skeleton.setToSetupPose();
  }
}