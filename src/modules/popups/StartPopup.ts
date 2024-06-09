import * as PIXI from "pixi.js";
import anime from "animejs";

import { events } from "../../utils/events";
import { CONFIG } from "../../config";
import { Popup } from "./Popup";

export class StartPopup extends Popup{
  createText() {
    const title = `HERDSMAN`;

    const container_title = new PIXI.Text(title, CONFIG.textStyles.popup as PIXI.ITextStyle);
    container_title.anchor.set(0.5);
    container_title.position.set(CONFIG.canvas.width / 2, 200);
    this.container.addChild(container_title);

    const rule = 
    `Try to herd all the sheep into the lawn - 
    just walk next to the sheep and it'll follow you.
    But be carefull, some sheep don't mind running away,
    and they also don't like to walk in groups of more than five sheep.
    `;
    const container_rule = new PIXI.Text(rule, CONFIG.textStyles.rule as PIXI.ITextStyle);
    container_rule.anchor.set(0.5);
    container_rule.position.set(CONFIG.canvas.width / 2, 400);
    this.container.addChild(container_rule);
  }

  createButton() {
    const button = new PIXI.Sprite(PIXI.Assets.get('restart_button'));
    button.anchor.set(0.5);
    button.position.set(CONFIG.canvas.width / 2, 600);
    
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