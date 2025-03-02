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
  viewport.moveCenter(0, 0); // Center the viewport at (0, 0)
  viewport.setZoom(1, true); // Reset zoom to default (1:1 scale)
}

function handleResize() {
  app.renderer.resize(window.innerWidth, window.innerHeight);
  viewport.screenWidth = window.innerWidth;
  viewport.screenHeight = window.innerHeight;
}

window.addEventListener("resize", handleResize);

document.addEventListener("keydown", function (event) {
  if (event.code === "Space") {
    event.preventDefault(); // Prevent default spacebar action (e.g., page scroll)
    resetViewport();
  }
});

resetViewport();
viewport.drag().pinch().wheel().decelerate();

export { viewport };
