import { ApplicationWrapper } from './core/ApplicationWrapper';
import { ViewportWrapper } from './core/ViewportWrapper';
import { Grid } from './core/Grid';
import { Toolbox } from './tools/Toolbox';
import { ClockTickRateMenu } from './tools/ClockTickRateMenu';
import { SimulationService } from './core/simulator/SimulationService';
import { getAssetNames, preloadAllAssets } from './utils/assetLoader';
import { initializationPhases } from './core/AppInitializer';

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
        const totalSteps = getAssetNames().length + initializationPhases.length;
        let stepCount = 0;

        updateProgress(0, 'Loading assets...');
        await preloadAllAssets((current, total, assetName) => {
            updateProgress(getPercent(++stepCount, totalSteps), `Loading assets... ${current}/${total} (${assetName})`);
        });

        for (const step of initializationPhases) {
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