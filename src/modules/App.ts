import * as PIXI from "pixi.js";
import { CONFIG } from "../config.js";

import { MainScene } from "./MainScene.js";
import { manifest } from "../assets.js";
import { Listener } from "../utils/Listener.js";
import { State, Subscription } from "../utils/types.js";


export class App {
  static gameState = State.idle;

  canvas: HTMLElement | null = null;
  app: PIXI.Application | null = null;
  scenes: any[] = [];

  loader: PIXI.Loader | null = null;
  preloader: Promise<unknown> | null = null;
  listener = Listener.getInstance();
  restartGameSubscription!: Subscription

  async run() {
    this.canvas = document.getElementById("canvas");
    this.app = new PIXI.Application({
      view: this.canvas as HTMLCanvasElement,
      width: CONFIG.canvas.width,
      height: CONFIG.canvas.height,
    });
    (globalThis as any).__PIXI_APP__ = this.app;
    window.onresize = this.onResize;
    this.onResize();
    
    await PIXI.Assets.init(manifest);
    await PIXI.Assets.loadBundle(["images", "atlasses", "fonts", "spines"]);

    this.createMainState();

    this.restartGameSubscription = {
      event: 'restart_game',
      func: this.resetGame,
      context: this
    };
    this.listener.add(this.restartGameSubscription);
  }

  createMainState() {
    const mainScene = new MainScene(this.app!);
    this.scenes.push(mainScene);

    this.app!.stage.addChild(mainScene.container);
    this.app!.ticker.add(() => mainScene.update());
  }

  resetGame() {
    App.gameState = State.play;

    const mainScene: MainScene = this.scenes[0]
    this.app!.stage.removeChild(mainScene.container)    
    this.app!.ticker.remove(() => mainScene.update());
    mainScene.destroy();
    
    this.scenes.length = 0;

    this.createMainState();
  }

  onResize() {
    const style = this.canvas!.style;
    let width;
    let height;
    let margin;

    if (window.innerWidth > (window.innerHeight * CONFIG.canvas.width) / CONFIG.canvas.height) {
      width = (window.innerHeight / CONFIG.canvas.height) * CONFIG.canvas.width;
      height = window.innerHeight;
      margin = (window.innerWidth - width) / 2;

      style.width = `${width}px`;
      style.height = `${height}px`;
      style.marginTop = `0`;
      style.marginLeft = `${margin}px`;
    } else {
      width = window.innerWidth;
      height = (window.innerWidth / CONFIG.canvas.width) * CONFIG.canvas.height;
      margin = (window.innerHeight - height) / 2;

      style.width = `${width}px`;
      style.height = `${height}px`;
      style.marginTop = `${margin}px`;
      style.marginLeft = `0`;
    }
  }
}
