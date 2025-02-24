import { Container, Graphics } from "pixi.js";
import { SideMenuButton } from "./sideMenuButton";

const sideMenuElementNames = [
  "select",
  "eraser",
  "wire",
  "and",
  "nand",
  "not",
  "or",
  "nor",
  "xor",
  "xnor",
];

const sideMenu = new Container();

const sideMenuContainerGraphics = new Graphics()
  .filletRect(
    0.005 * window.innerWidth,
    0.005 * window.innerWidth,
    150,
    0.98 * window.innerHeight,
    20
  )
  .fill({ color: 0x333333, alpha: 0.33 });

sideMenu.addChild(sideMenuContainerGraphics);

export function addSideMenuElement(sprite, position) {
  const baseX = sideMenuContainerGraphics.x + 25;
  const baseY = sideMenuContainerGraphics.y + 25;

  sprite.x = baseX + (position % 2 == 0 ? 1 : 0) * 75;
  sprite.y = baseY + Math.floor((position - 1) / 2) * 75;
  sideMenu.addChild(sprite);
}

const sideMenuElements = new Map();

for (let i = 0; i < sideMenuElementNames.length; i++) {
  const sideMenuButton = new SideMenuButton(sideMenuElementNames[i]);
  sideMenuElements.set(sideMenuElementNames[i], sideMenuButton);
  addSideMenuElement(sideMenuButton.getSprite(), i + 1);
}

export { sideMenu };
