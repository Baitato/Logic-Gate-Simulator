/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApplicationWrapper } from './core/ApplicationWrapper';
import { ViewportWrapper } from './core/ViewportWrapper';
import { Grid } from './core/Grid';
import { Toolbox } from './tools/Toolbox';
import { StateManager } from './state/StateManager';
import { PlaceableState } from './state/PlaceableState';
import { WireState } from './state/WireState';
import { UnplacedWireState } from './state/UnplacedWireState';
import { ClockTickRateMenu } from './tools/ClockTickRateMenu';
import { RotationHandler } from './models/logic-gate/RotationHandler';
import { SelectionService } from './services/SelectionService';
import { CopyPasteService } from './services/CopyPasteService';
import { ImportService } from './services/ImportService';
import { SimulationService } from './core/simulator/SimulationService';
import { FederatedPointerEvent } from 'pixi.js';

async function initializeApp() {
    try {
        console.log('Initializing Logic Gate Simulator...');

        const rotationHandler = await RotationHandler.getInstance();
        console.log('Rotation Handler initialized');

        const tickRateMenu = await ClockTickRateMenu.getInstance();
        console.log('Tick Rate Menu created');

        const simulationService = SimulationService.getInstance();
        console.log('Simulation Service initialized');

        const placeableState = await PlaceableState.getInstance();
        console.log('Placeable State class loaded');

        const wireState = await WireState.getInstance();
        console.log('Wire State class loaded');

        const unplacedWireState = await UnplacedWireState.getInstance();
        console.log('Unplaced Wire State class loaded');

        console.log('State instances created');

        // Initialize app first
        const app = await ApplicationWrapper.getInstance();
        console.log('App created');

        // Initialize viewport
        const viewport = await ViewportWrapper.getInstance();
        console.log('Viewport created');

        // Initialize grid
        const grid = await Grid.getInstance();
        console.log('Grid created');

        const importService = await ImportService.getInstance();
        console.log('Import service initialized');

        // Initialize toolbox
        const toolbox = await Toolbox.getInstance();
        console.log('Toolbox created');

        // Initialize state manager
        const stateManager = StateManager.getInstance();
        console.log('State manager initialized');

        const selectionService = await SelectionService.getInstance();
        console.log('Copy service initialized');

        const copyPasteService = await CopyPasteService.getInstance();
        console.log('Selection service initialized');

        window.addEventListener('keydown', (event: KeyboardEvent) => {
            if (event.ctrlKey && event.key === 'c') {
                copyPasteService.copy();
            }
        });

        window.addEventListener('keydown', async (event: KeyboardEvent) => {
            if (event.ctrlKey && event.key === 'v') {
                const interaction = app.renderer.events;
                const pos = interaction.pointer.global;

                await copyPasteService.initializeDisplayPastePreview(pos);
                const wires = importService.getWires();
                const placeables = importService.getPlaceables();

                const onMove = async (event: FederatedPointerEvent) => {
                    const movePos = interaction.pointer.global;
                    await copyPasteService.displayPastePreview(movePos, wires, placeables);
                };

                viewport.on('pointermove', onMove);

                viewport.once('pointerdown', async () => {
                    await copyPasteService.paste(pos)
                    viewport.off('pointermove', onMove);
                });
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