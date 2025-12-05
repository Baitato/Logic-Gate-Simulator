import { ApplicationWrapper } from './core/app';
import { MyViewport } from './core/viewport';
import { Grid } from './core/grid';
import { Toolbox } from './tools/toolbox';
import { simulationService } from './core/simulator/SimulationService';
import { setAppInstance, setViewportInstance, setGridInstance, setToolboxInstance, setPlaceableStateInstance, setWireStateInstance, setUnplacedWireStateInstance, setTickRateMenuInstance, setRotationHandlerInstance, setSelectionServiceInstance, setCopyPasteServiceInstance, setImportServiceInstance } from './core/instances';
import { StateManager } from './state/StateManager';
import { PlaceableState } from './state/PlaceableState';
import { WireState } from './state/WireState';
import { UnplacedWireState } from './state/UnplacedWireState';
import { ClockTickRateMenu } from './tools/ClockTickRateMenu';
import { RotationHandler } from './models/logic-gate/RotationHandler';
import { SelectionService } from './services/SelectionService';
import { CopyPasteService } from './services/CopyPasteService';
import { ImportService } from './services/ImportService';

async function initializeApp() {
    try {
        console.log('Initializing Logic Gate Simulator...');

        const rotationHandler = await new RotationHandler().setupRotationHandler();
        setRotationHandlerInstance(rotationHandler);

        const tickRateMenu = await ClockTickRateMenu.create();
        setTickRateMenuInstance(tickRateMenu);
        console.log('Tick Rate Menu created');

        // Initialize state instances first (before any models that need them)
        setPlaceableStateInstance(new PlaceableState(simulationService, rotationHandler, tickRateMenu));
        setWireStateInstance(new WireState());
        setUnplacedWireStateInstance(new UnplacedWireState());
        console.log('State instances created');

        // Initialize app first
        const app = await ApplicationWrapper.create();
        setAppInstance(app);
        console.log('App created');

        // Initialize viewport
        const viewport = new MyViewport(app);
        setViewportInstance(viewport);
        console.log('Viewport created');

        // Initialize grid
        const grid = new Grid(viewport);
        setGridInstance(grid);
        console.log('Grid created');

        const importService = new ImportService();
        setImportServiceInstance(importService);
        console.log('Import service initialized');

        // Initialize toolbox
        const toolbox = await Toolbox.create();
        setToolboxInstance(toolbox);
        console.log('Toolbox created');

        // Initialize state manager
        StateManager.initialize();
        console.log('State manager initialized');

        const selectionService = new SelectionService(viewport);
        setSelectionServiceInstance(selectionService);
        console.log('Copy service initialized');

        const copyPasteService = new CopyPasteService(importService, selectionService);
        setCopyPasteServiceInstance(copyPasteService);
        console.log('Selection service initialized');

        window.addEventListener('keydown', (event: KeyboardEvent) => {
            if (event.ctrlKey && event.key === 'c') {
                copyPasteService.copy();
            }
        });

        window.addEventListener('keydown', (event: KeyboardEvent) => {
            if (event.ctrlKey && event.key === 'v') {
                const interaction = app.renderer.events;
                const pos = interaction.pointer.global;

                copyPasteService.paste(pos);
            }
        });

        // Assemble the scene
        document.body.appendChild(app.canvas);
        app.stage.addChild(viewport);
        app.stage.addChild(toolbox);
        app.stage.addChild(tickRateMenu);
        viewport.addChild(grid);

        app.ticker.add(() => {
            simulationService.nextIteration();
        });

        console.log('Logic Gate Simulator initialized successfully');
        console.log('Renderer:', app.renderer.name);
    } catch (error) {
        console.error('Failed to initialize Logic Gate Simulator:', error);
        document.body.innerHTML = `<div style="color: white; padding: 20px; font-family: monospace;">
            <h2>Error initializing application</h2>
            <p>${error instanceof Error ? error.message : String(error)}</p>
            <p>Check console for details.</p>
        </div>`;
    }
}

initializeApp();