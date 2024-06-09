import * as PIXI from "pixi.js";
import anime from "animejs";

import { events } from "../../utils/events";
import { Listener } from "../../utils/Listener";
import { CONFIG } from "../../config";

export class StartPopup {  
  container: PIXI.Container;
  listener: Listener = Listener.getInstance();

  constructor() {
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
    const text = `HERDSMAN`;
    
      

    const container_text = new PIXI.Text(text, CONFIG.textStyles.popup as PIXI.ITextStyle);
    container_text.anchor.set(0.5);
    container_text.position.set(CONFIG.canvas.width / 2, 200);
    this.container.addChild(container_text);
  }

  createButton() {
    const button = new PIXI.Sprite(PIXI.Assets.get('restart_button'));
    button.anchor.set(0.5);
    button.position.set(CONFIG.canvas.width / 2, 400);
    
    const button_text = new PIXI.Text("Play", CONFIG.textStyles.game);
    button_text.anchor.set(0.5);    
    button.addChild(button_text);

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

          this.container.visible = false;
          this.listener.dispath(events.startGameEvent);
        }
      });
    });
    
    this.container.addChild(button);
  }
}