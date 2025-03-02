import { viewport } from "./viewportModule";
import { app } from "./app";
import { grid } from "./grid";
import { Sprite, Assets } from "pixi.js";
// import { sideMenu } from "./sidemenu/sideMenu";
import { toolboxContainer } from "./ui/toolBox";
import { LogicGate } from "./world-objects/logicGate";

app.stage.addChild(viewport);
viewport.addChild(grid);

const xnorTexture512x512 = await Assets.load({
  src: "assets/56x56/xnor.svg",
});
var sprite = new Sprite(xnorTexture512x512);
sprite.width = 50;
sprite.height = 50;
// sprite.scale.set(1 / 3);
sprite.x = 0;
sprite.y = 0;

var gate = new LogicGate("xor");
gate.width = 50;
gate.height = 50;
gate.x = 75;
gate.y = 75;

viewport.addChild(gate);
viewport.addChild(sprite);
// app.stage.addChild(sideMenu);
app.stage.addChild(toolboxContainer);
