import * as PIXI from "pixi.js";
import anime from "animejs";

import { GameScene } from "../scenes/GameScene";
import { events } from "../../utils/events";
import { State } from "../../utils/types";
import { CONFIG } from "../../config";
import { Popup } from "./Popup";
import { SceneManager } from "../SceneManager";

export class FinalPopup extends Popup {
  createText() {
    let text;
    if (SceneManager.gameState === State.won) {
      text = "CONGRATULATIONS!!!\nYou won!";
    } else {
      text = `GAME OVER\nYou gathered ${GameScene.scoreValue} sheep`;
    }

    const container_text = new PIXI.Text(text, CONFIG.textStyles.popup as PIXI.ITextStyle);
    container_text.anchor.set(0.5);
    container_text.position.set(CONFIG.canvas.width / 2, 200);
    this.container.addChild(container_text as PIXI.DisplayObject);
  }

  createButton() {
    const button = new PIXI.Sprite(PIXI.Assets.get('restart_button'));
    button.anchor.set(0.5);
    button.position.set(CONFIG.canvas.width / 2, 400);
    
    const button_text = new PIXI.Text("Restart", CONFIG.textStyles.game);
    button_text.anchor.set(0.5);    
    button.addChild(button_text as PIXI.DisplayObject);

    button.interactive = true;
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
    
    this.container.addChild(button as PIXI.DisplayObject);
  }
}