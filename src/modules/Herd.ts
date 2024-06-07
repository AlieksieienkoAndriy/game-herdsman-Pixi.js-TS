import { CONFIG } from "../config";
import { events } from "../utils/events";
import { Utils, Point } from "../utils/helpers";
import { Listener } from "../utils/Listener";
import { Sheep } from "./Sheep";


export class Herd {
  lawnGroup: Sheep[] = [];
  herdsmanGroup: Sheep[] = [];
  corralGroup: Sheep[] = [];
  listener: Listener = Listener.getInstance();

  constructor() {
    this._init();
  }

  protected _init() {
    const config = CONFIG.game.herd;
    const sheepAmount: number = Utils.getRandomNum(config.sheepAmount.from, config.sheepAmount.to);
    const positions: Point[] = this._generateRandomPos(sheepAmount);

    positions.forEach((pos) => {
        const sheep = new Sheep(pos);
        this.addSheepToLawn(sheep);
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

  addSheepToLawn(sheep: Sheep) {
    this.lawnGroup.push(sheep);
  }

  addSheepToHerdsman(sheep: Sheep) {
    this.herdsmanGroup.push(sheep);
    const index = this.lawnGroup.indexOf(sheep);
    this.lawnGroup.splice(index, 1);
  }
  
  addSheepToCorral(sheep: Sheep, pos: Point) {
    this.corralGroup.push(sheep);
    const index = this.herdsmanGroup.indexOf(sheep);
    this.herdsmanGroup.splice(index, 1);

    sheep.sprite.emit('get_to_corral', pos);
    sheep.sprite.off('follow_herdsman');
    sheep.isFolowing = false;    
  }

  runAwaySheep() {
    if (this.lawnGroup.length === 0) {
      return;
    }

    const config = CONFIG.game.herd;

    const sheep: Sheep = this.lawnGroup[0];

    const targetX = (sheep.sprite.x < CONFIG.canvas.width / 2) ? -config.distance * 2 : CONFIG.canvas.width + config.distance * 2;
    const targetY = Utils.getRandomNum(0, CONFIG.canvas.height);

    const targetPos: Point = {x: targetX, y: targetY};

    sheep.isRunningAway = true;
    sheep.move(targetPos);
    sheep.sprite.once('ran_away', () => {
      this.removeSheep(sheep)      
    });
  }

  removeSheep(sheep: Sheep) {
    const index = this.lawnGroup.indexOf(sheep);
    this.lawnGroup.splice(index, 1);

    this.listener.dispath(events.decreaseLivesEvent);    
  }
}