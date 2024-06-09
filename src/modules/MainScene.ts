import "pixi-spine";
import * as PIXI from "pixi.js";
import { Herdsman } from "./Herdsman";
import { Sheep } from "./Sheep";
import { SheepController } from "./controllers/SheepController";
import { CONFIG } from "../config";
import { FinalPopup } from "./popups/FinalPopup";
import { Listener } from "../utils/Listener";
import { ScoreControllerParams, SheepControllerParams, State, Subscription } from "../utils/types";
import { ScoreController } from "./controllers/ScoreController";
import { StartPopup } from "./popups/StartPopup";
import { events } from "../utils/events";

export class MainScene {
  static state = State.idle;
  static scoreValue: number = 0;

  app: PIXI.Application;
  container: PIXI.Container;
  corral!: PIXI.Sprite;  
  herdsman!: Herdsman;
  score!: PIXI.Text;
  sheep_left_sprites!: PIXI.Container;
  sheepController!: SheepController;
  scoreController!: ScoreController;
  listener: Listener = Listener.getInstance();
  startGameSubscription!: Subscription;
  finishGameSubscription!: Subscription;

  constructor(app: PIXI.Application) {
    this.app = app;
    this.container = new PIXI.Container();

    this._createBackground();
    this._createUI();
    this._createHerdsman();
    this._createSheepController();
    this._createScoreController();
    this.showStartPopup();

    this.addListeners();
  }

  addListeners() {
    this.finishGameSubscription = {
      event: 'finish_game',
      func: this.showFinalPopup,
      context: this
    }
    this.listener.add(this.finishGameSubscription);

    this.startGameSubscription = {
      event: 'start_game',
      func: this.startGame,
      context: this
    }
    this.listener.add(this.startGameSubscription);
  }

  protected _createBackground() {
    const bg = new PIXI.Sprite(PIXI.Assets.get('bg'));
    bg.scale.set(0.5);
    this.container.addChild(bg);

    this.corral = new PIXI.Sprite(
      PIXI.Assets.get('corral')
    );
    this.corral.anchor.set(1);
    this.corral.scale.set(0.3);
    this.corral.position.set(this.app.view.width, this.app.view.height);
    this.container.addChild(this.corral);
  }

  protected _createUI() {
    const ui = new PIXI.Container();
    const bg = new PIXI.Sprite(PIXI.Assets.get('black_bg'));
    ui.addChild(bg);

    this.score = new PIXI.Text(`Score: ${MainScene.scoreValue}`, CONFIG.game.textStyle);
    this.score.position.set(0, (ui.height - this.score.height) / 2);
    ui.addChild(this.score);
    
    const sheep_left = new PIXI.Container();
    const sheep_left_text = new PIXI.Text(`Sheep: `, CONFIG.game.textStyle);
    sheep_left.addChild(sheep_left_text);

    this.sheep_left_sprites = new PIXI.Container();
    
    for (let i = 0; i < 3; i++) {
      const sheep = new PIXI.Sprite(
        PIXI.Assets.get('sheeps').textures["Sheep_1.png"]
      );
      sheep.position.set(i * (sheep.width + 10) + sheep_left_text.width, 0);
      this.sheep_left_sprites.addChild(sheep);
    }
    sheep_left.addChild(this.sheep_left_sprites);
    sheep_left_text.position.set(
      0,
      (sheep_left.height - sheep_left_text.height) / 2
    );
    sheep_left.position.set(
      this.app.screen.width / 2 - sheep_left.width / 2,
      (ui.height - sheep_left.height) / 2
    );
    ui.addChild(sheep_left);

    this.container.addChild(ui);
  };

  protected _createHerdsman() {
    this.herdsman = new Herdsman();
    this.container.addChild(this.herdsman.spine as any);
    this.container.on("pointerdown", (e: PIXI.FederatedPointerEvent) => {
      if (MainScene.state === State.idle) {
        MainScene.state = State.play;
      }

      this.herdsman.move(e.data.global);

      if (this.sheepController.herdsmanGroup.amount !== 0) {
        this.sheepController.herdsmanGroup.sheep.forEach((sheep) => {
          sheep.sprite.emit("follow_herdsman", this.sheepController.herdsmanGroup.sheep.indexOf(sheep));
        });
      }
    });
  }

  protected _createSheepController() {
    const params: SheepControllerParams = {
      herdsman: this.herdsman,
      corral: this.corral
    }

    this.sheepController = new SheepController(params);

    this.sheepController.lawnGroup.sheep.forEach((sheep: Sheep) => {
      this.container.addChild(sheep.sprite as PIXI.Sprite);
    });
  }
  protected _createScoreController() {
    const params: ScoreControllerParams = {      
      score: this.score,
      lives: this.sheep_left_sprites
    }

    this.scoreController = new ScoreController(params);    
  }

  startGame() {
    this.container.interactive = true;
    this.listener.dispath(events.runAwayEvent);
    this.listener.remove(this.startGameSubscription);
  }

  showStartPopup() {
    const popup = new StartPopup();
    this.container.addChild(popup.container);   
  }

  showFinalPopup() {
    console.log('Game over');
    this.container.interactive = false;
    const popup = new FinalPopup();
    this.container.addChild(popup.container);   
  }

  destroy() {
    this.listener.remove(this.finishGameSubscription);
    this.sheepController.destroy();    
    this.scoreController.destroy();    

    MainScene.state = State.idle;
    MainScene.scoreValue = 0;
  }

  update() {
    this.sheepController.update();
  }
};