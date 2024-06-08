import * as PIXI from "pixi.js";
import anime from "animejs";

import { MainScene } from "./MainScene";
import { events } from "../utils/events";
import { Listener } from "../utils/Listener";
import { State } from "../utils/types";

export class FinalPopup {
  app: PIXI.Application;
  container: PIXI.Container;
  listener: Listener = Listener.getInstance();

  constructor(app: PIXI.Application) {
    this.app = app;    
    this.container = new PIXI.Container();
    
    this.createBackground();
    this.createText();
    this.createButton();    
  }

  createBackground() {
    const bg = new PIXI.Sprite(PIXI.Texture.WHITE);
    bg.tint = 0x000000;
    bg.width = 1440;
    bg.height = 810;
    bg.alpha = 0.7;
    this.container.addChild(bg);
  };

  createText() {
    let text;
    if (MainScene.state === State.won) {
      text = "CONGRATULATIONS!!!\nYou won!";
    } else {
      text = `GAME OVER\nYou gathered ${MainScene.scoreValue} sheep`;
    }

    const container_text = new PIXI.Text(text, {
      fontFamily: "DoHyeon",
      fontSize: 48,
      fill: "white",
      align: "center",
      lineHeight: 100,
    });
    container_text.anchor.set(0.5);
    container_text.position.set(this.app.screen.width / 2, 200);
    this.container.addChild(container_text);
  }

  createButton() {
    const button = new PIXI.Sprite(PIXI.Assets.get('restart_button'));
    button.anchor.set(0.5);
    button.position.set(this.app.screen.width / 2, 400);
    
    const button_text = new PIXI.Text("Restart", {
      fontFamily: "DoHyeon",
      fontSize: 24,
      fill: "white"
    });
    button_text.anchor.set(0.5);    
    button.addChild(button_text);

    button.interactive = true;
    // button.buttonMode = true;
    button.once("pointerdown", () => {
      anime({
        targets: button.scale,
        x: 0.9,
        y: 0.9,
        duration: 150,
        easing: "linear",
        complete: () => {
          button.scale.set(1);

          this.listener.dispath(events.restartGameEvent);
        }
      });
    });
    
    this.container.addChild(button);
  }
}