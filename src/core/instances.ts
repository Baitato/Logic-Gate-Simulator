import { ApplicationWrapper } from './app';
import { MyViewport } from './viewport';
import { Grid } from './grid';
import { Toolbox } from '../tools/toolbox';

// Global singleton instances
let appInstance: ApplicationWrapper | null = null;
let viewportInstance: MyViewport | null = null;
let gridInstance: Grid | null = null;
let toolboxInstance: Toolbox | null = null;

export function setAppInstance(instance: ApplicationWrapper): void {
    appInstance = instance;
}

export function setViewportInstance(instance: MyViewport): void {
    viewportInstance = instance;
}

export function setGridInstance(instance: Grid): void {
    gridInstance = instance;
}

export function setToolboxInstance(instance: Toolbox): void {
    toolboxInstance = instance;
}

export function getApp(): ApplicationWrapper {
    if (!appInstance) {
        throw new Error('App not initialized. Call initializeApp() first.');
    }
    return appInstance;
}

export function getViewport(): MyViewport {
    if (!viewportInstance) {
        throw new Error('Viewport not initialized. Call initializeApp() first.');
    }
    return viewportInstance;
}

export function getGrid(): Grid {
    if (!gridInstance) {
        throw new Error('Grid not initialized. Call initializeApp() first.');
    }
    return gridInstance;
}

export function getToolbox(): Toolbox {
    if (!toolboxInstance) {
        throw new Error('Toolbox not initialized. Call initializeApp() first.');
    }
    return toolboxInstance;
}

// Compatibility exports for existing code
export const viewport = new Proxy({} as MyViewport, {
    get(_target, prop) {
        return getViewport()[prop as keyof MyViewport];
    }
});

export const app = new Proxy({} as ApplicationWrapper, {
    get(_target, prop) {
        return getApp()[prop as keyof ApplicationWrapper];
    }
});

export const grid = new Proxy({} as Grid, {
    get(_target, prop) {
        return getGrid()[prop as keyof Grid];
    }
});

export const toolbox = new Proxy({} as Toolbox, {
    get(_target, prop) {
        return getToolbox()[prop as keyof Toolbox];
    }
});
