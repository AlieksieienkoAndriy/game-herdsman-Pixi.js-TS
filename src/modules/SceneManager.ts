import { Application } from "pixi.js";
import { IScene, State } from "../utils/types";
import { GameScene } from "./scenes/GameScene";

export class SceneManager {
  private constructor() { /*this class is purely static*/ }

  private static app: Application;
  private static currentScene: IScene;
  static gameState = State.idle;

  private static _width: number;
  private static _height: number;

  public static get width(): number {
    return SceneManager._width;
  }
  public static get height(): number {
    return SceneManager._height;
  }

  public static initialize(width: number, height: number): void {

    SceneManager._width = width;
    SceneManager._height = height;

    SceneManager.app = new Application<HTMLCanvasElement>({
      view: document.getElementById("canvas") as HTMLCanvasElement,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
      backgroundColor: 0x000000,
      width: width,
      height: height
    });

    (globalThis as any).__PIXI_APP__ = SceneManager.app;

    SceneManager.app.ticker.add(SceneManager.update)

    window.addEventListener('resize', SceneManager.resize);
    SceneManager.resize();
  }

  public static changeScene(newScene: IScene): void {
    if (SceneManager.currentScene) {
      SceneManager.app.stage.removeChild(SceneManager.currentScene);
      SceneManager.currentScene.destroy();
    }

    SceneManager.currentScene = newScene;
    SceneManager.app.stage.addChild(SceneManager.currentScene);
  }

  public static resetGame() {
    SceneManager.gameState = State.play;
    SceneManager.currentScene.destroyScene();
    SceneManager.changeScene(new GameScene());
  }

  public static resize(): void {
    const screenWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    const screenHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

    const scale = Math.min(screenWidth / SceneManager.width, screenHeight / SceneManager.height); // canvas adapts to screen

    const enlargedWidth = Math.floor(scale * SceneManager.width);
    const enlargedHeight = Math.floor(scale * SceneManager.height);

    const horizontalMargin = (screenWidth - enlargedWidth) / 2;
    const verticalMargin = (screenHeight - enlargedHeight) / 2;

    const canvasStyle = SceneManager.app.view.style;

    canvasStyle!.width = `${enlargedWidth}px`;
    canvasStyle!.height = `${enlargedHeight}px`;
    (canvasStyle as any)!.marginLeft = (canvasStyle as any)!.marginRight = `${horizontalMargin}px`;
    (canvasStyle as any)!.marginTop = (canvasStyle as any)!.marginBottom = `${verticalMargin}px`;
  }

  private static update(framesPassed: number): void {
    if (SceneManager.currentScene) {
      SceneManager.currentScene.update(framesPassed);
    }
  }
}

