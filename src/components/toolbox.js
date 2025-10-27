import { ScrollBox } from "@pixi/ui";
import { Container, Graphics } from "pixi.js";
import { onToolClick } from "../managers/toolManager";
import { loadSprite } from "../managers/assetManager";
import { gates } from "../utils/constants";

const toolboxWidth = 150;
const toolboxHeight = 0.98 * window.innerHeight;
const itemSize = 50;
const elementpadding = 20;
const scrollBarPadding = { x: 25, y: 20 };

const toolboxContainer = new Container();
const toolboxBackground = new Graphics()
  .filletRect(
    0.005 * window.innerWidth,
    0.005 * window.innerWidth,
    toolboxWidth,
    toolboxHeight,
    20
  )
  .fill({ color: 0x333333, alpha: 0.33 });

toolboxContainer.addChild(toolboxBackground);

const sideMenuElementNames = ["select", "eraser", "switch-empty"];

sideMenuElementNames.push(...gates);

async function createToolbox() {
  const items = await Promise.all(
    sideMenuElementNames.map((name) => loadSprite(name, itemSize))
  );

  const toolsScrollBox = new ScrollBox({
    width: toolboxWidth - scrollBarPadding.x,
    height: toolboxHeight - scrollBarPadding.y,
    radius: 20,
    elementsMargin: elementpadding,
    items: [],
  });

  toolsScrollBox.x = scrollBarPadding.x;
  toolsScrollBox.y = scrollBarPadding.y;

  items.forEach((sprite) => {
    sprite.on("pointerdown", (event) => onToolClick(event, sprite));
    toolsScrollBox.addItem(sprite);
  });

  toolboxContainer.addChild(toolsScrollBox);
}

createToolbox();

export { toolboxContainer };
