import { Container, Graphics, Assets, Text } from "pixi.js";
import { IScene } from "../../utils/types";
import { SceneManager } from "../SceneManager";
import { manifest } from "../../assets";
import { GameScene } from "./GameScene";

// import { manifest } from "src/";

export class LoaderScene extends Container implements IScene {
  private loaderBar: Container;
  private loaderBarBoder: Graphics;
  private loaderBarFill: Graphics;
  private progress: Text;

  constructor() {
    super();

    const loaderBarWidth = SceneManager.width * 0.75;

    this.loaderBarFill = new Graphics();
    this.loaderBarFill.beginFill(0x008800, 1)
    this.loaderBarFill.drawRect(0, 0, loaderBarWidth, 30);
    this.loaderBarFill.endFill();
    this.loaderBarFill.scale.x = 0;

    this.loaderBarBoder = new Graphics();
    this.loaderBarBoder.lineStyle(2, 0xffffff, 1);
    this.loaderBarBoder.drawRect(0, 0, loaderBarWidth, 30);

    this.loaderBar = new Container();
    this.loaderBar.addChild(this.loaderBarFill);
    this.loaderBar.addChild(this.loaderBarBoder);
    this.loaderBar.position.x = (SceneManager.width - this.loaderBar.width) / 2;
    this.loaderBar.position.y = (SceneManager.height - this.loaderBar.height) / 2;
    this.addChild(this.loaderBar);

    const text = new Text('Loading...', {
      fontSize: 32,
      fill: "white",
    });
    text.anchor.set(0.5);
    text.position.set(SceneManager.width / 2, this.loaderBar.y - 50);
    this.addChild(text);

    this.progress = new Text('0%', {
      fontSize: 32,
      fill: "white",
    });
    this.progress.anchor.set(0.5);
    this.progress.position.set(
      this.loaderBar.x + this.loaderBar.width / 2, 
      this.loaderBar.y + this.loaderBar.height / 2
    );
    this.addChild(this.progress);

    this.initializeLoader().then(() => {
      this.gameLoaded();
    })
  }

  public async initializeLoader(): Promise<void> {
    await Assets.init(manifest);

    const bundleIds = (manifest.manifest as any).bundles.map((bundle: { name: any }) => bundle.name);
    console.log(bundleIds);

    await Assets.loadBundle(bundleIds, this.downloadProgress.bind(this));
  }

  private downloadProgress(progressRatio: number): void {
    this.loaderBarFill.scale.x = progressRatio;
    this.progress.text = (progressRatio * 100).toFixed(0) + '%';
  }

  private gameLoaded(): void {
    // Change scene to the game scene!
    SceneManager.changeScene(new GameScene());
  }

  public update(framesPassed: number): void {
    // console.log(framesPassed);
  }

  destroyScene(){}
}