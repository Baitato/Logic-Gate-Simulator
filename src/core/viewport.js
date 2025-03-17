import { Viewport } from "pixi-viewport";
import { app } from "./app";

const worldWidth = 100;
const worldHeight = 100;

const viewport = new Viewport({
  screenWidth: window.innerWidth,
  screenHeight: window.innerHeight,
  worldWidth: worldWidth,
  worldHeight: worldHeight,
  events: app.renderer.events,
});

function resetViewport() {
  viewport.moveCenter(0, 0);
  viewport.setZoom(1, true);
}

function handleResize() {
  app.renderer.resize(window.innerWidth, window.innerHeight);
  viewport.screenWidth = window.innerWidth;
  viewport.screenHeight = window.innerHeight;
}

window.addEventListener("resize", handleResize);

document.addEventListener("keydown", function (event) {
  if (event.code === "Space") {
    event.preventDefault();
    resetViewport();
  }
});

resetViewport();
viewport.drag().pinch().wheel().decelerate();

export { viewport };
