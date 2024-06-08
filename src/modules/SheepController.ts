import { Spine } from "pixi-spine";
import * as PIXI from "pixi.js";
import { CONFIG } from "../config";
import { Utils } from "../utils/helpers";
import { Herdsman } from "./Herdsman";
import { MainScene } from "./MainScene";
import { events } from "../utils/events";
import { Listener } from "../utils/Listener";
import { ControllerParams, Point, State, Subscription } from "../utils/types";
import { SheepGroup } from "./groups/SheepGroup";
import { Sheep } from "./Sheep";

export class SheepController {
  herdsman: Herdsman;
  corral: PIXI.Sprite;
  score: PIXI.Text;
  lives: PIXI.Container;
  listener: Listener = Listener.getInstance();
  decreaseLivesSubscription!: Subscription;


  lawnGroup: SheepGroup = new SheepGroup();
  herdsmanGroup: SheepGroup = new SheepGroup();
  corralGroup: SheepGroup = new SheepGroup();

  constructor({herdsman, corral, score, lives}: ControllerParams) {
    this.herdsman = herdsman;
    this.corral = corral;
    this.score = score;
    this.lives = lives;

    this.fillLawnGroup();

    this.addListeners();
    this._runAwaySheep();

  }

  fillLawnGroup() {
    const config = CONFIG.game.herd;
    const sheepAmount: number = Utils.getRandomNum(config.sheepAmount.from, config.sheepAmount.to);
    const positions: Point[] = this._generateRandomPos(sheepAmount);

    positions.forEach((pos) => {
        const sheep = new Sheep(pos);
        this.lawnGroup.addSheep(sheep);
    }) 
  }

  protected _generateRandomPos(posAmount: number): Point[] {
    const config = CONFIG.game.herd;
    const positions: Point[] = [];

    for(let i = 0; i < posAmount; i++) {      
      let currentX = 0;
      let currentY = 0;

      do {
        currentX = Utils.getRandomNum(config.distance, CONFIG.canvas.width - config.distance * 2);
      } while (
        positions.length > 0 &&
        positions.some(
          (pos) =>
            pos.x + config.distance / 3 > currentX &&
            pos.x - config.distance / 3 < currentX
        )
      );
      
      do {
        currentY = Utils.getRandomNum(config.distance * 2, CONFIG.canvas.height - config.distance * 2);
      } while (
        positions.length > 0 &&
        positions.some(
          (pos) =>
            pos.y + config.distance / 3 > currentY &&
            pos.y - config.distance / 3 < currentY
        )
      );

      const pos: Point = {x: currentX, y: currentY};
      positions.push(pos);
    }
    return positions;
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
    const followingSheep = this.lawnGroup.sheep.find((sheep) =>
      Utils.hitRectangle(
        this.herdsman.spine as Spine,
        sheep.sprite as PIXI.Container
      )
    );

    if (followingSheep) {
      if (!followingSheep.isFolowing) {
        this.lawnGroup.removeSheep(followingSheep);
        this.herdsmanGroup.addSheep(followingSheep);

        if(followingSheep.isRunningAway) {
          followingSheep.isRunningAway = false;
          this._runAwaySheep();

        }
        followingSheep.sprite?.emit("follow_herdsman", this.herdsmanGroup.sheep.indexOf(followingSheep));
      }
    }
  }

  checkCorral() {
    if (Utils.hitRectangle(this.herdsman.spine as Spine, this.corral as PIXI.Container)) {
      this.herdsmanGroup.sheep.forEach((sheep) => {
        const pos: Point = {
          x: this.corral.x - 30 - (this.corralGroup.amount * 15),
          y: this.corral.y,
        };

        this.corralGroup.addSheep(sheep);
        this.herdsmanGroup.removeSheep(sheep);
        sheep.sprite.emit('get_to_corral', pos);
        sheep.sprite.off('follow_herdsman');
        sheep.isFolowing = false;

        this.increaseScore();

        if (this.lawnGroup.amount === 0 && this.herdsmanGroup.amount === 0) {
          MainScene.state = State.won;
          this.listener.dispath(events.finishGameEvent);
        }
      });
    }
  }

  protected _runAwaySheep() {
    const time = Utils.getRandomNum(3, 5);
    setTimeout(() => {
      if (this.lawnGroup.amount === 0) {
        return;
      }
  
      const config = CONFIG.game.herd;
  
      const sheep: Sheep = this.lawnGroup.sheep[0];
  
      const targetX = (sheep.sprite.x < CONFIG.canvas.width / 2) ? -config.distance * 2 : CONFIG.canvas.width + config.distance * 2;
      const targetY = Utils.getRandomNum(0, CONFIG.canvas.height);
  
      const targetPos: Point = {x: targetX, y: targetY};
  
      sheep.isRunningAway = true;
      sheep.move(targetPos);
      sheep.sprite.once('ran_away', () => {
        this.lawnGroup.removeSheep(sheep);
        this.listener.dispath(events.decreaseLivesEvent);
      });
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
    if (this.herdsman.isMoving && (this.herdsmanGroup.amount < CONFIG.game.herd.groupLimit)) {
      this.checkSheeps();
    }

    if (this.herdsmanGroup.amount !== 0) {
      this.checkCorral();
    }
  }
}