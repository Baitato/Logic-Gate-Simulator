import { ApplicationWrapper } from './core/app';
import { MyViewport } from './core/viewport';
import { Grid } from './core/grid';
import { Toolbox } from './tools/toolbox';
import { simulationService } from './core/simulator/SimulationService';
import { setAppInstance, setViewportInstance, setGridInstance, setToolboxInstance } from './core/instances';
import { StateManager } from './state/StateManager';

async function initializeApp() {
    try {
        console.log('Initializing Logic Gate Simulator...');

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

        // Initialize toolbox
        const toolbox = await Toolbox.create();
        setToolboxInstance(toolbox);
        console.log('Toolbox created');

        // Initialize state manager
        StateManager.initialize();
        console.log('State manager initialized');

        // Assemble the scene
        document.body.appendChild(app.canvas);
        app.stage.addChild(viewport);
        app.stage.addChild(toolbox);
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