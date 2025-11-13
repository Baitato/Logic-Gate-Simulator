import { viewport } from './core/viewport';
import { grid } from './core/grid';
import { app } from './core/app';
import { toolbox } from './tools/toolbox';

document.body.appendChild(app.canvas);
app.stage.addChild(viewport);
app.stage.addChild(toolbox);
viewport.addChild(grid);

console.log(app.renderer.name)