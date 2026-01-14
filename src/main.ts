import {Application} from "pixi.js";
import {SlotGame} from "./SlotGame.ts";

(async () => {
  // Create a new application
  const app = new Application();

  // Initialize the application
  await app.init({
    width: 800,
    height: 700,
    background: 0x1a1a2e,
    // antialias: true
  });

  document.body.appendChild(app.canvas);

  SlotGame(app)

})();
