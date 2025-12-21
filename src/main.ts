import { ApplicationWrapper } from './core/ApplicationWrapper';
import { ViewportWrapper } from './core/ViewportWrapper';
import { Grid } from './core/Grid';
import { Toolbox } from './tools/Toolbox';
import { ClockTickRateMenu } from './tools/ClockTickRateMenu';
import { CopyPasteService } from './services/CopyPasteService';
import { ImportService } from './services/ImportService';
import { SimulationService } from './core/simulator/SimulationService';
import { getAssetNames, preloadAllAssets } from './utils/assetLoader';
import { PlaceableState } from './state/PlaceableState';
import { RotationHandler } from './models/logic-gate/RotationHandler';
import { PlacementService } from './services/viewport/PlacementService';
import { SelectionService } from './services/SelectionService';
import { StateManager } from './state/StateManager';

const loadingScreen = document.getElementById('loading-screen')!;
const progressBar = document.getElementById('progress-bar') as HTMLDivElement;
const progressText = document.getElementById('progress-text')!;
const errorContainer = document.getElementById('error-container')!;
const errorMessage = document.getElementById('error-message')!;

function getPercent(completed: number, total: number): number {
    return Math.floor((completed / total) * 100);
}

function updateProgress(percent: number, text: string) {
    progressBar.style.width = `${percent}%`;
    progressText.textContent = text;
}

function showError(error: Error) {
    errorContainer.style.display = 'block';
    errorMessage.textContent = error.message + '\n\n' + error.stack;
    console.error('Initialization failed:', error);
}

async function initializeApp() {
    try {
        // Define initialization phases
        const initSteps: Array<{ name: string; init: () => void | Promise<void> }> = [
            { name: 'Application', init: () => ApplicationWrapper.init() },
            { name: 'Viewport', init: () => ViewportWrapper.init() },
            { name: 'Grid', init: () => Grid.init() },
            { name: 'RotationHandler', init: () => RotationHandler.init() },
            { name: 'ClockTickRateMenu', init: () => ClockTickRateMenu.init() },
            { name: 'PlaceableState', init: () => PlaceableState.init() },
            { name: 'ImportService', init: () => ImportService.init() },
            { name: 'PlacementService', init: () => PlacementService.init() },
            { name: 'SelectionService', init: () => SelectionService.init() },
            { name: 'CopyPasteService', init: () => CopyPasteService.init() },
            { name: 'StateManager', init: () => StateManager.init() },
            { name: 'Toolbox', init: () => Toolbox.init() },
        ];

        const totalSteps = getAssetNames().length + initSteps.length;
        let stepCount = 0;

        updateProgress(0, 'Loading assets...');
        await preloadAllAssets((current, total, assetName) => {
            updateProgress(getPercent(++stepCount, totalSteps), `Loading assets... ${current}/${total} (${assetName})`);
        });

        for (let i = 0; i < initSteps.length; i++) {
            const step = initSteps[i];
            updateProgress(getPercent(++stepCount, totalSteps), `Initializing ${step.name}...`);
            await step.init();
        }

        updateProgress(100, 'Initialization complete!');

        const app = ApplicationWrapper.getInstance();
        const viewport = ViewportWrapper.getInstance();
        const grid = Grid.getInstance();
        const toolbox = Toolbox.getInstance();
        const tickRateMenu = ClockTickRateMenu.getInstance();
        const simulationService = SimulationService.getInstance();

        document.body.appendChild(app.canvas);
        app.stage.addChild(viewport);
        app.stage.addChild(toolbox);
        app.stage.addChild(tickRateMenu);
        viewport.addChild(grid);

        let isIterating = false;

        app.ticker.add(() => {
            if (isIterating) return;
            isIterating = true;

            simulationService.nextIteration()
                .then(() => isIterating = false);
        });

        console.log('Renderer:', app.renderer.name);

        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 150);
    } catch (error) {
        showError(error instanceof Error ? error : new Error(String(error)));
    }
}

initializeApp();