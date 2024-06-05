import "pixi-spine";
import * as PIXI from "pixi.js";

export class MainScene {
    container: PIXI.Container;
    app: PIXI.Application;
    bg!: PIXI.Sprite;

    constructor(app: PIXI.Application) {
        this.app = app;

        this.container = new PIXI.Container();

        this.createBackground();
    }

    createBackground() {        
        this.bg = new PIXI.Sprite(PIXI.Assets.get('bg'));
        this.container.addChild(this.bg);
    }    

    update() {

    };
};