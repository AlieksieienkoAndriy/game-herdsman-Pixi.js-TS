import "pixi-spine";
import * as PIXI from "pixi.js";
import { Herdsman } from "../Herdsman";
import { Sheep } from "../Sheep";
import { SheepController } from "../controllers/SheepController";
import { CONFIG } from "../../config";
import { FinalPopup } from "../popups/FinalPopup";
import { Listener } from "../../utils/Listener";
import { IScene, ScoreControllerParams, SheepControllerParams, State, Subscription } from "../../utils/types";
import { ScoreController } from "../controllers/ScoreController";
import { StartPopup } from "../popups/StartPopup";
import { events } from "../../utils/events";
import { Popup } from "../popups/Popup";
import { SceneManager } from "../SceneManager";

export class GameScene extends PIXI.Container implements IScene {
  static scoreValue: number = 0;  
  corral!: PIXI.Sprite;  
  herdsman!: Herdsman;
  score!: PIXI.BitmapText;
  sheep_left_sprites!: PIXI.Container;
  sheepController!: SheepController;
  scoreController!: ScoreController;

  listener: Listener = Listener.getInstance();
  startGameSubscription!: Subscription;
  finishGameSubscription!: Subscription;
  restartGameSubscription!: Subscription;

  constructor() {    
    super();
    this.interactive = true;

    this._createBackground();
    this._createUI();
    this._createHerdsman();
    this._createSheepController();
    this._createScoreController();

    if (SceneManager.gameState === State.idle) {
      this.showPopup(new StartPopup());
    } else {
      this.listener.dispath(events.runAwayEvent);
    }

    this.addListeners();
  }

  addListeners() {
    this.finishGameSubscription = {
      event: 'finish_game',
      func: () => {
        this.showPopup(new FinalPopup())
      },
      context: this
    }
    this.listener.add(this.finishGameSubscription);

    this.startGameSubscription = {
      event: 'start_game',
      func: this.startGame,
      context: this
    }
    this.listener.add(this.startGameSubscription);

    this.restartGameSubscription = {
      event: 'restart_game',
      func: SceneManager.resetGame,
      context: SceneManager
    };
    this.listener.add(this.restartGameSubscription);
  }

  protected _createBackground() {
    const bg = new PIXI.Sprite(PIXI.Assets.get('bg'));
    bg.scale.set(0.5);
    this.addChild(bg as PIXI.DisplayObject);

    this.corral = PIXI.Sprite.from("corral.png");
    this.corral.anchor.set(1);
    this.corral.scale.set(0.3);
    this.corral.position.set(SceneManager.width, SceneManager.height);
    this.addChild(this.corral as PIXI.DisplayObject);
  }

  protected _createUI() {
    const ui = new PIXI.Container();
    const bg = PIXI.Sprite.from('black_bg.png');
    ui.addChild(bg as PIXI.DisplayObject);

    this.score = new PIXI.BitmapText(`Score: ${GameScene.scoreValue}`, CONFIG.textStyles.bitmapStyle);
    this.score.position.set(0, (ui.height - this.score.height) / 2);
    ui.addChild(this.score as PIXI.DisplayObject);
    
    const sheep_left = new PIXI.Container();
    const sheep_left_text = new PIXI.BitmapText(`Sheep: `, CONFIG.textStyles.bitmapStyle);
    sheep_left.addChild(sheep_left_text as PIXI.DisplayObject);

    this.sheep_left_sprites = new PIXI.Container();
    
    for (let i = 0; i < 3; i++) {
      const sheep = new PIXI.Sprite(
        PIXI.Assets.get('sheeps').textures["Sheep_1.png"]
      );
      sheep.position.set(i * (sheep.width + 10) + sheep_left_text.width, 0);
      this.sheep_left_sprites.addChild(sheep as PIXI.DisplayObject);
    }
    this.sheep_left_sprites.pivot.y = this.sheep_left_sprites.height / 2;
    this.sheep_left_sprites.position.y = sheep_left.height / 2;

    sheep_left.addChild(this.sheep_left_sprites as PIXI.DisplayObject);
    sheep_left_text.position.set(
      0,
      (sheep_left.height - sheep_left_text.height) / 2
    );
    sheep_left.position.set(
      SceneManager.width / 2 - sheep_left.width / 2,
      (ui.height - sheep_left.height) / 2
    );
    ui.addChild(sheep_left as PIXI.DisplayObject);

    this.addChild(ui as PIXI.DisplayObject);
  };

  protected _createHerdsman() {
    this.herdsman = new Herdsman();
    this.sortableChildren = true;
    this.herdsman.spine.zIndex = 1;
    this.addChild(this.herdsman.spine as any);
    this
    this.on("pointerdown", (e: PIXI.FederatedPointerEvent) => {
      if (SceneManager.gameState === State.idle) {
        SceneManager.gameState = State.play;
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
      this.addChild(sheep.sprite as PIXI.DisplayObject);
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
    this.interactive = true;
    this.listener.dispath(events.runAwayEvent);
    this.listener.remove(this.startGameSubscription);
  }  

  showPopup(popup: Popup) {
    this.interactive = false;    
    this.addChild(popup.container as PIXI.DisplayObject);   
  }

  destroyScene() {
    this.listener.remove(this.finishGameSubscription);
    this.listener.remove(this.restartGameSubscription);
    this.sheepController.destroy();
    this.scoreController.destroy();

    GameScene.scoreValue = 0;
  }

  update(_framesPassed: number): void {
    this.sheepController.update();
  }
};