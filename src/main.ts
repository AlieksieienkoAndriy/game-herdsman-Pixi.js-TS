// import { App } from "./modules/App";


// const app = new App();
// app.run();
import { CONFIG } from "./config";
import { SceneManager } from "./modules/SceneManager";
import { LoaderScene } from "./modules/scenes/LoaderScene";



SceneManager.initialize(CONFIG.canvas.width, CONFIG.canvas.height);

const loady: LoaderScene = new LoaderScene();
SceneManager.changeScene(loady);