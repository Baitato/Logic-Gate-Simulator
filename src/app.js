import { Application } from "pixi.js";

const app = new Application();

await app.init({
  background: 0x101012,
  resizeTo: window,
  sharedTicker: true,
  autoStart: true,
});

app.renderer.resolution = window.devicePixelRatio;

document.body.appendChild(app.canvas);
app.stage.eventMode = "static";

export { app };
