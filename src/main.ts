import { app } from './core/app';
import { viewport } from './core/viewport';
import { grid } from './core/grid';
import { Toolbox } from './tools/Toolbox';

document.body.appendChild(app.canvas);
app.stage.addChild(viewport);
app.stage.addChild(new Toolbox());
viewport.addChild(grid);