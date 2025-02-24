import { Container, Graphics } from "pixi.js";
import { SideMenuButton } from "./sideMenuButton";

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

let sideMenuElements = [
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

for (let i = 0; i < sideMenuElements.length; i++) {
  const sideMenuButton = new SideMenuButton(
    "assets/56x56/" + sideMenuElements[i] + ".svg"
  );
  addSideMenuElement(sideMenuButton.getSprite(), i + 1);
}

export { sideMenu };
