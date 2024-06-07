import { Spine } from "pixi-spine";
import * as PIXI from "pixi.js";
import { CONFIG } from "../config";
import { ControllerParams, Utils, Point, State, Subscription } from "../utils/helpers";
import { Herd } from "./Herd";
import { Herdsman } from "./Herdsman";
import { MainScene } from "./MainScene";
import { events } from "../utils/events";
import { Listener } from "../utils/Listener";

export class SheepController {
  herd: Herd
  herdsman: Herdsman;
  corral: PIXI.Sprite;
  score: PIXI.Text;
  lives: PIXI.Container;
  listener: Listener = Listener.getInstance();
  decreaseLivesSubscription!: Subscription

  constructor({herd, herdsman, corral, score, lives}: ControllerParams) {
    this.herd = herd;
    this.herdsman = herdsman;
    this.corral = corral;
    this.score = score;
    this.lives = lives;

    this.addListeners();
    this._runAwaySheep();

  }

  addListeners() {    
    this.decreaseLivesSubscription = {
      event: 'decrease_lives',
      func: this.decreaseLives,
      context: this
    };
    this.listener.add(this.decreaseLivesSubscription);
  }
  
  checkSheeps() {
    const followingSheep = this.herd.lawnGroup.find((sheep) =>
      Utils.hitRectangle(
        this.herdsman.spine as Spine,
        sheep.sprite as PIXI.Container
      )
    );

    if (followingSheep) {
      if (!followingSheep.isFolowing) {
        this.herd.addSheepToHerdsman(followingSheep);

        if(followingSheep.isRunningAway) {
          followingSheep.isRunningAway = false;
          this._runAwaySheep();

        }
        followingSheep.sprite?.emit("follow_herdsman", this.herd.herdsmanGroup.indexOf(followingSheep));
      }
    }
  }

  checkCorral() {
    if (Utils.hitRectangle(this.herdsman.spine as Spine, this.corral as PIXI.Container)) {
      this.herd.herdsmanGroup.forEach((sheep) => {
        const pos: Point = {
          x: this.corral.x - 30 - (this.herd.corralGroup.length * 15),
          y: this.corral.y,
        };

        this.herd.addSheepToCorral(sheep, pos);
        this.increaseScore();

        if (this.herd.lawnGroup.length === 0 && this.herd.herdsmanGroup.length === 0) {
          MainScene.state = State.won;
          this.listener.dispath(events.finishGameEvent);
        }
      });
    }
  }

  protected _runAwaySheep() {
    const time = Utils.getRandomNum(3, 5);
    setTimeout(() => {
      this.herd.runAwaySheep();      
    }, time * 1000)
  }

  increaseScore() {
    MainScene.scoreValue++;
    this.score.text = `Score: ${MainScene.scoreValue}`;
  }

  decreaseLives() {
    this.lives.children.pop();

    if (this.lives.children.length === 0) {
      MainScene.state = State.lose;
      this.listener.dispath(events.finishGameEvent);
    } else {
      this._runAwaySheep();
    }
  }

  destroy() {
    this.listener.remove(this.decreaseLivesSubscription);
  }

  update() {
    if (this.herdsman.isMoving && (this.herd.herdsmanGroup?.length < CONFIG.game.herd.groupLimit)) {
      this.checkSheeps();
    }

    if (this.herd.herdsmanGroup.length !== 0) {
      this.checkCorral();
    }
  }
}