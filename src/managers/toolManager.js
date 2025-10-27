import { viewport } from "../core/viewport";
import { Sprite } from "pixi.js";
import { loadTexture } from "./assetManager";
import { getObject, save } from "./objectManager";
import { gateSpriteDimensions } from "../utils/constants";
import { getCellCenter } from "../utils/constants";
import { gates } from "../utils/constants";

let gateMoveEvent, gatePlaceEvent, currentSprite;

export function onToolClick(event, tool) {
  cleanupPreviousTool();

  console.log(tool.spriteName);

  if (gates.includes(tool.spriteName)) onGateClick(event, tool.spriteName);
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
    viewport.off("clicked", gatePlaceEvent);
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
  sprite.width = gateSpriteDimensions.x;
  sprite.height = gateSpriteDimensions.y;
  sprite.gate = gate;

  currentSprite = sprite;

  viewport.addChild(sprite);

  if (gateMoveEvent == null) {
    gateMoveEvent = (event) => onGateMove(event, sprite);
    viewport.on("pointermove", gateMoveEvent);
  }
}

function moveRelativeToMouseOnViewport(event, sprite) {
  const gridSize = 50;
  const worldPos = viewport.toWorld(event.global);

  const cellCenter = getCellCenter(worldPos.x, worldPos.y);

  sprite.x = cellCenter.x;
  sprite.y = cellCenter.y;

  if (getObject(sprite.x, sprite.y) == null) {
    sprite.alpha = 0.6;
  } else {
    sprite.alpha = 0;
  }
}

function onGateMove(event, sprite) {
  moveRelativeToMouseOnViewport(event, sprite);
  if (gatePlaceEvent == null) {
    gatePlaceEvent = (event) => {
      event = event.event;
      onGatePlace(event, sprite);
    };
    viewport.on("clicked", gatePlaceEvent);
  }
}

function onGatePlace(event, sprite) {
  if (getObject(sprite.x, sprite.y) != null) {
    return;
  }

  moveRelativeToMouseOnViewport(event, sprite);

  save(sprite.x, sprite.y, sprite.gate);

  viewport.removeChild(sprite);
  sprite.destroy({ children: true, baseTexture: true });
  sprite = null;

  viewport.off("pointermove", gateMoveEvent);
  viewport.off("clicked", gatePlaceEvent);

  gateMoveEvent = null;
  gatePlaceEvent = null;
  currentSprite = null;
}
