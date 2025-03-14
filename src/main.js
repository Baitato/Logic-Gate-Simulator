import { viewport } from "./core/viewport";
import { app } from "./core/app";
import { grid } from "./core/grid";
import { toolboxContainer } from "./components/toolbox";
import { LogicGate } from "./entities/logicGate";

app.stage.addChild(viewport);
viewport.addChild(grid);

var gate2 = new LogicGate("nor");
gate2.x = 25;
gate2.y = 25;

var gate = new LogicGate("xor");
gate.x = 25;
gate.y = 75;

viewport.addChild(gate);
viewport.addChild(gate2);

app.stage.addChild(toolboxContainer);
