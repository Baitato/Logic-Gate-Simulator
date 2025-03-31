import { viewport } from "./core/viewport";
import { app } from "./core/app";
import { grid } from "./core/grid";
import { toolboxContainer } from "./components/toolbox";

app.stage.addChild(viewport);
viewport.addChild(grid);

app.stage.addChild(toolboxContainer);
