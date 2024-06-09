import * as PIXI from "pixi.js";
import { Listener } from "../../utils/Listener";
import { ScoreControllerParams, State, Subscription } from "../../utils/types";
import { MainScene } from "../MainScene";
import { events } from "../../utils/events";
import { App } from "../App";


export class ScoreController {
    score: PIXI.Text;
    lives: PIXI.Container;
    listener: Listener = Listener.getInstance();
    decreaseLivesSubscription!: Subscription;
    increaseScoreSubscription!: Subscription;

    constructor({ score, lives }: ScoreControllerParams) {
        this.score = score;
        this.lives = lives;

        this.addListeners();
    }

    addListeners() {
        this.increaseScoreSubscription = {
            event: 'increase_score',
            func: this.increaseScore,
            context: this
        };
        this.listener.add(this.increaseScoreSubscription);

        this.decreaseLivesSubscription = {
            event: 'decrease_lives',
            func: this.decreaseLives,
            context: this
        };
        this.listener.add(this.decreaseLivesSubscription);
    }

    increaseScore() {
        MainScene.scoreValue++;
        this.score.text = `Score: ${MainScene.scoreValue}`;
    }

    decreaseLives() {
        this.lives.children.pop();

        if (this.lives.children.length === 0) {
            App.gameState = State.lose;
            this.listener.dispath(events.finishGameEvent);
        } else {
            this.listener.dispath(events.runAwayEvent);
        }
    }

    destroy() {
        this.listener.remove(this.increaseScoreSubscription);
        this.listener.remove(this.decreaseLivesSubscription);
    }
}