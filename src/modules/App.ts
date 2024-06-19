// import * as PIXI from "pixi.js";
// import { CONFIG } from "../config.js";

// import { MainScene } from "./scenes/GameScene.js";
// import { manifest } from "../assets.js";
// import { Listener } from "../utils/Listener.js";
// import { State, Subscription } from "../utils/types.js";


// export class App {
//   static gameState = State.idle;

//   canvas: HTMLElement | null = null;
//   app: PIXI.Application | null = null;
//   scenes: any[] = [];

//   loader: PIXI.Loader | null = null;
//   preloader: Promise<unknown> | null = null;
//   listener = Listener.getInstance();
//   restartGameSubscription!: Subscription
//   static canvas: any;

//   async run() {
//     this.canvas = document.getElementById("canvas");
//     this.app = new PIXI.Application({
//       view: this.canvas as HTMLCanvasElement,
//       width: CONFIG.canvas.width,
//       height: CONFIG.canvas.height,
//     });
//     (globalThis as any).__PIXI_APP__ = this.app;
//     window.onresize = this.onResize;
//     this.onResize();
    
//     await PIXI.Assets.init(manifest);
//     await PIXI.Assets.loadBundle(["images", "atlasses", "fonts", "spines"]);

//     this.createMainState();

//     this.restartGameSubscription = {
//       event: 'restart_game',
//       func: this.resetGame,
//       context: this
//     };
//     this.listener.add(this.restartGameSubscription);
//   }

//   createMainState() {
//     const mainScene = new MainScene(this.app!);
//     this.scenes.push(mainScene);

//     this.app!.stage.addChild(mainScene.container as PIXI.DisplayObject);
//     this.app!.ticker.add(() => mainScene.update());
//   }

//   resetGame() {
//     App.gameState = State.play;

//     const mainScene: MainScene = this.scenes[0]
//     this.app!.stage.removeChild(mainScene.container as PIXI.DisplayObject)    
//     this.app!.ticker.remove(() => mainScene.update());
//     mainScene.destroy();
    
//     this.scenes.length = 0;

//     this.createMainState();
//   }

//   public onResize(): void {
//     const screenWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
//     const screenHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

//     const scale = Math.min(screenWidth / CONFIG.canvas.width, screenHeight / CONFIG.canvas.height);

//     const enlargedWidth = Math.floor(scale * CONFIG.canvas.width);
//     const enlargedHeight = Math.floor(scale * CONFIG.canvas.height);

//     const horizontalMargin = (screenWidth - enlargedWidth) / 2;
//     const verticalMargin = (screenHeight - enlargedHeight) / 2;

//     const style = this.canvas!.style;

//     style!.width = `${enlargedWidth}px`;
//     style!.height = `${enlargedHeight}px`;
//     (style as any)!.marginLeft = (style as any)!.marginRight = `${horizontalMargin}px`;
//     (style as any)!.marginTop = (style as any)!.marginBottom = `${verticalMargin}px`;
//   }
// }
