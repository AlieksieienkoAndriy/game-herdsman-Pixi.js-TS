import { CONFIG } from "./config";
import { SceneManager } from "./modules/SceneManager";
import { LoaderScene } from "./modules/scenes/LoaderScene";

SceneManager.initialize(CONFIG.canvas.width, CONFIG.canvas.height);

const loaderScene: LoaderScene = new LoaderScene();
SceneManager.changeScene(loaderScene);