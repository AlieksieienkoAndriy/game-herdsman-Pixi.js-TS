import * as PIXI from "pixi.js";
import { MainScene } from "./MainScene";

export class App {
    canvas: HTMLElement | null = null;
    app!: PIXI.Application
    scenes: any[] = [];

    async run() {
        this.canvas = document.getElementById("canvas");
        this.app = new PIXI.Application({
            view: this.canvas as HTMLCanvasElement,
            width: 1440,
            height: 810,

            // width: window.innerWidth,
            // height: window.innerWidth * 9 / 16,

            // resizeTo: window,
            // transparent: true,
        });
        (globalThis as any).__PIXI_APP__ = this.app;
        window.onresize = this.onResize;
        this.onResize();

        const manifest: PIXI.AssetInitOptions = {
            manifest: {
                bundles: [
                    {
                        name: "images",
                        assets: {
                            "bg": "resources/sprites/background.png",                                                       
                        }
                    }                    
                ]
            }
        }
        
        await PIXI.Assets.init(manifest);
        await PIXI.Assets.loadBundle(["images"]);
        const mainScene = new MainScene(this.app);
        this.scenes.push(mainScene);

        this.app.stage.addChild(mainScene.container);
        this.app.ticker.add(() => mainScene.update());
    }

    onResize() {
        const style = this.canvas!.style;
        
        let width;
        let height;
        let margin;

        if (window.innerWidth > (window.innerHeight * 1440) / 810) {
            width = (window.innerHeight / 810) * 1440;
            height = window.innerHeight;
            margin = (window.innerWidth - width) / 2;

            style!.width = `${width}px`;
            style!.height = `${height}px`;
            style!.marginTop = `0`;
            style!.marginLeft = `${margin}px`;
        } else {
            width = window.innerWidth;
            height = (window.innerWidth / 1440) * 810;
            margin = (window.innerHeight - height) / 2;

            style!.width = `${width}px`;
            style!.height = `${height}px`;
            style!.marginTop = `${margin}px`;
            style!.marginLeft = `0`;
        }
    }
}
