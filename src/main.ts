import { app } from './core/app';
import { viewport } from './core/viewport';
import { grid } from './core/grid';
import { Toolbox } from './tools/Toolbox';
import { GateType } from './enums/GateType';
import { Gate } from './models/logic-gate/Gate';

document.body.appendChild(app.canvas);
app.stage.addChild(viewport);
app.stage.addChild(new Toolbox());
viewport.addChild(grid);

const gate = Gate.create(25, 25, GateType.AND);
viewport.addChild(gate);