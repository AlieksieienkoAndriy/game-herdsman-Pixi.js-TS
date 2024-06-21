import * as PIXI from "pixi.js";
import * as particles from '@pixi/particle-emitter';

import { Listener } from "../../utils/Listener";
import { ScoreControllerParams, State, Subscription } from "../../utils/types";
import { GameScene } from "../scenes/GameScene";
import { events } from "../../utils/events";
import { SceneManager } from "../SceneManager";


export class ScoreController {
    score: PIXI.BitmapText;
    lives: PIXI.Container;
    listener: Listener = Listener.getInstance();
    decreaseLivesSubscription!: Subscription;
    increaseScoreSubscription!: Subscription;
    emitter!: particles.Emitter

    constructor({ score, lives }: ScoreControllerParams) {
        this.score = score;
        this.lives = lives;

        this.addListeners();
        this._createParticles();
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
        GameScene.scoreValue++;
        this.score.text = `Score: ${GameScene.scoreValue}`;

        this.emitter.autoUpdate = true;
        this.emitter.emit = true;
    }

    decreaseLives() {
        this.lives.children.pop();

        if (this.lives.children.length === 0) {
            SceneManager.gameState = State.lose;
            this.listener.dispath(events.finishGameEvent);
        } else {
            this.listener.dispath(events.runAwayEvent);
        }
    }

    protected _createParticles() {
        const config = {
            lifetime: {
                min: 0.5,
                max: 0.5
            },
            frequency: 0.008,
            spawnChance: 1,
            particlesPerWave: 1,
            emitterLifetime: 0.1,
            maxParticles: 100,
            pos: {
                x: 0,
                y: 0
            },
            addAtBack: false,
            behaviors: [
                {
                    type: 'alpha',
                    config: {
                        alpha: {
                            list: [
                                {
                                    value: 0.8,
                                    time: 0
                                },
                                {
                                    value: 0.1,
                                    time: 1
                                }
                            ],
                        },
                    }
                },
                {
                    type: 'scale',
                    config: {
                        scale: {
                            list: [
                                {
                                    value: 0.5,
                                    time: 0
                                },
                                {
                                    value: 0.4,
                                    time: 1
                                }
                            ],
                        },
                    }
                },
                {
                    type: 'moveSpeed',
                    config: {
                        speed: {
                            list: [
                                {
                                    value: 200,
                                    time: 0
                                },
                                {
                                    value: 100,
                                    time: 1
                                }
                            ],
                            isStepped: false
                        },
                    }
                },
                {
                    type: 'rotationStatic',
                    config: {
                        min: 0,
                        max: 360
                    }
                },
                {
                    type: 'spawnShape',
                    config: {
                        type: 'torus',
                        data: {
                            x: 0,
                            y: 0,
                            radius: 10
                        }
                    }
                },
                {
                    type: 'textureSingle',
                    config: {
                        texture: PIXI.Texture.from('star.png')
                    }
                }
            ],
        }
        const emitterContainer = new PIXI.Container();
        const offsetX = -10;
        const offsetY = 2;
        emitterContainer.position.set(
            this.score.width + offsetX,
            this.score.height / 2 + offsetY);

        this.emitter = new particles.Emitter(emitterContainer, config);
        this.score.addChild(emitterContainer);
    }

    destroy() {
        this.listener.remove(this.increaseScoreSubscription);
        this.listener.remove(this.decreaseLivesSubscription);
    }
}