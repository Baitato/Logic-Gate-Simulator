import { viewport } from "../viewportModule";
import { Sprite } from "pixi.js";
import { loadTexture } from "../assetLoader/assetLoading";
import { save } from "./objectManager";

let gateMoveEvent, gatePlaceEvent, currentSprite;

export function onToolClick(event, gate) {
  cleanupPreviousTool();
  onGateClick(event, gate);
}

function cleanupPreviousTool() {
  if (currentSprite) {
    viewport.removeChild(currentSprite);
    currentSprite = null;
  }

  if (gateMoveEvent) {
    viewport.off("pointermove", gateMoveEvent);
    gateMoveEvent = null;
  }

  if (gatePlaceEvent) {
    viewport.off("pointerdown", gatePlaceEvent);
    gatePlaceEvent = null;
  }
}

async function onGateClick(event, gate) {
  const sprite = new Sprite(await loadTexture(gate));
  const worldPos = viewport.toWorld(event.global);
  sprite.x = worldPos.x;
  sprite.y = worldPos.y;
  sprite.anchor.set(0.5);
  sprite.alpha = 0.6;
  sprite.eventMode = "dynamic";
  sprite.cursor = "pointer";
  sprite.width = 50;
  sprite.height = 50;
  sprite.gate = gate;

  currentSprite = sprite;

  viewport.addChild(sprite);
  gateMoveEvent = (event) => onGateMove(event, sprite);
  viewport.on("pointermove", gateMoveEvent);
}

function moveRelativeToMouseOnViewport(event, sprite) {
  const gridSize = 50;
  const worldPos = viewport.toWorld(event.global);

  sprite.x = Math.floor(worldPos.x / gridSize) * gridSize + gridSize / 2;
  sprite.y = Math.floor(worldPos.y / gridSize) * gridSize + gridSize / 2;
}

function onGateMove(event, sprite) {
  moveRelativeToMouseOnViewport(event, sprite);
  gatePlaceEvent = (event) => onGatePlace(event, sprite);
  viewport.on("pointerdown", gatePlaceEvent);
}

function onGatePlace(event, sprite) {
  moveRelativeToMouseOnViewport(event, sprite);

  sprite.alpha = 1;

  save(sprite.x, sprite.y, sprite.gate);

  viewport.off("pointermove", gateMoveEvent);
  viewport.off("pointerdown", gatePlaceEvent);

  gateMoveEvent = null;
  gatePlaceEvent = null;
  currentSprite = null;
}
