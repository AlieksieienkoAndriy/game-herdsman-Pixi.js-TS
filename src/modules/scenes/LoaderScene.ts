import * as PIXI from "pixi.js";
import { SceneManager } from "../SceneManager";
import { manifest } from "../../assets";
import { GameScene } from "./GameScene";
import { CONFIG } from "../../config";
import { IScene } from "../../utils/types";

export class LoaderScene extends PIXI.Container implements IScene {
  private loaderBar!: PIXI.Container;
  private loaderBarBoder!: PIXI.Graphics;
  private loaderBarFill!: PIXI.Graphics;
  private progress!: PIXI.Text;

  constructor() {
    super();

    this.createLoaderBar();
    this.createText();

    this.initializeLoader().then(() => {
      this.gameLoaded();
    })
  }

  private createLoaderBar() {
    const loaderBarWidth = SceneManager.width * 0.75;

    this.loaderBarFill = new PIXI.Graphics();
    this.loaderBarFill.beginFill(0x008800, 1)
    this.loaderBarFill.drawRect(0, 0, loaderBarWidth, 30);
    this.loaderBarFill.endFill();
    this.loaderBarFill.scale.x = 0;

    this.loaderBarBoder = new PIXI.Graphics();
    this.loaderBarBoder.lineStyle(2, 0xffffff, 1);
    this.loaderBarBoder.drawRect(0, 0, loaderBarWidth, 30);

    this.loaderBar = new PIXI.Container();
    this.loaderBar.addChild(this.loaderBarFill as PIXI.DisplayObject);
    this.loaderBar.addChild(this.loaderBarBoder as PIXI.DisplayObject);
    this.loaderBar.position.x = (SceneManager.width - this.loaderBar.width) / 2;
    this.loaderBar.position.y = (SceneManager.height - this.loaderBar.height) / 2;
    this.addChild(this.loaderBar as PIXI.DisplayObject);
  }

  private createText() {
    const text = new PIXI.Text('Loading...', CONFIG.textStyles.game as PIXI.ITextStyle);
    text.anchor.set(0.5);
    text.position.set(SceneManager.width / 2, this.loaderBar.y - 50);
    this.addChild(text as PIXI.DisplayObject);

    this.progress = new PIXI.Text('0%', CONFIG.textStyles.game as PIXI.ITextStyle);
    this.progress.anchor.set(0.5);
    this.progress.position.set(
      this.loaderBar.x + this.loaderBar.width / 2, 
      this.loaderBar.y + this.loaderBar.height / 2
    );
    this.addChild(this.progress as PIXI.DisplayObject);
  }

  public async initializeLoader(): Promise<void> {
    await PIXI.Assets.init(manifest);

    const bundleIds = (manifest.manifest as any).bundles.map((bundle: { name: any }) => bundle.name);
    await PIXI.Assets.loadBundle(bundleIds, this.downloadProgress.bind(this));
  }

  private downloadProgress(progressRatio: number): void {
    this.loaderBarFill.scale.x = progressRatio;
    this.progress.text = (progressRatio * 100).toFixed(0) + '%';
  }

  private gameLoaded(): void {
    SceneManager.changeScene(new GameScene());
  }

  public update(_framesPassed: number): void {
    
  }

  destroyScene(){}
}