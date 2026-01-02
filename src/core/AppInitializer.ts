import { ApplicationWrapper } from './ApplicationWrapper';
import { ViewportWrapper } from './ViewportWrapper';
import { Grid } from './Grid';
import { StorageManager } from '../state/StateManager';
import { ImportService } from '../services/ImportService';
import { SelectionService } from '../services/SelectionService';
import { ConnectionService } from '../services/ConnectionService';
import { RotationService } from '../services/RotationService';
import { CopyPasteService } from '../services/CopyPasteService';
import { DeletionService } from '../services/DeletionService';
import { RotationWidget } from '../models/logic-gate/RotationWidget';
import { Toolbox } from '../tools/Toolbox';
import { ClockTickRateMenu } from '../tools/ClockTickRateMenu';
import { PlacementService } from '../services/PlacementService';

type InitStep = { name: string; init: () => void | Promise<void> };

// Core components that must initialize first
const corePhase: InitStep[] = [
    { name: 'Application', init: () => ApplicationWrapper.init() },
    { name: 'Viewport', init: () => ViewportWrapper.init() },
    { name: 'Grid', init: () => Grid.init() },
    { name: 'ClockTickRateMenu', init: () => ClockTickRateMenu.init() },
];

// State management
const statePhase: InitStep[] = [
    { name: 'StateManager', init: () => StorageManager.init() },
];

// UI widgets that services depend on
const widgetsPhase: InitStep[] = [
    { name: 'RotationWidget', init: () => RotationWidget.init() },
];

// Services that depend on state
const servicesPhase: InitStep[] = [
    { name: 'ImportService', init: () => ImportService.init() },
    { name: 'PlacementService', init: () => PlacementService.init() },
    { name: 'SelectionService', init: () => SelectionService.init() },
    { name: 'ConnectionService', init: () => ConnectionService.init() },
    { name: 'RotationService', init: () => RotationService.init() },
    { name: 'CopyPasteService', init: () => CopyPasteService.init() },
    { name: 'DeletionService', init: () => DeletionService.init() },
];

// UI components that need everything else ready
const uiPhase: InitStep[] = [
    { name: 'Toolbox', init: () => Toolbox.init() },
];

export const initializationPhases: InitStep[] = [
    ...corePhase,
    ...statePhase,
    ...widgetsPhase,
    ...servicesPhase,
    ...uiPhase,
];
