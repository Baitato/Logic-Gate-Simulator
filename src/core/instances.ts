import { ApplicationWrapper } from './app';
import { MyViewport } from './viewport';
import { Grid } from './grid';
import { Toolbox } from '../tools/toolbox';
import { ClockTickRateMenu } from '../tools/ClockTickRateMenu';
import type { PlaceableState } from '../state/PlaceableState';
import type { WireState } from '../state/WireState';
import type { UnplacedWireState } from '../state/UnplacedWireState';

// Global singleton instances
let appInstance: ApplicationWrapper | null = null;
let viewportInstance: MyViewport | null = null;
let gridInstance: Grid | null = null;
let toolboxInstance: Toolbox | null = null;
let tickRateMenuInstance: ClockTickRateMenu | null = null;
let placeableStateInstance: PlaceableState | null = null;
let wireStateInstance: WireState | null = null;
let unplacedWireStateInstance: UnplacedWireState | null = null;

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

export function setTickRateMenuInstance(instance: ClockTickRateMenu): void {
    tickRateMenuInstance = instance;
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

export function getTickRateMenu(): ClockTickRateMenu {
    if (!tickRateMenuInstance) {
        throw new Error('TickRateMenu not initialized. Call initializeApp() first.');
    }
    return tickRateMenuInstance;
}

export function setPlaceableStateInstance(instance: PlaceableState): void {
    placeableStateInstance = instance;
}

export function setWireStateInstance(instance: WireState): void {
    wireStateInstance = instance;
}

export function setUnplacedWireStateInstance(instance: UnplacedWireState): void {
    unplacedWireStateInstance = instance;
}

export function getPlaceableState(): PlaceableState {
    if (!placeableStateInstance) {
        throw new Error('PlaceableState not initialized. Call initializeApp() first.');
    }
    return placeableStateInstance;
}

export function getWireState(): WireState {
    if (!wireStateInstance) {
        throw new Error('WireState not initialized. Call initializeApp() first.');
    }
    return wireStateInstance;
}

export function getUnplacedWireState(): UnplacedWireState {
    if (!unplacedWireStateInstance) {
        throw new Error('UnplacedWireState not initialized. Call initializeApp() first.');
    }
    return unplacedWireStateInstance;
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

export const tickRateMenu = new Proxy({} as ClockTickRateMenu, {
    get(_target, prop) {
        return getTickRateMenu()[prop as keyof ClockTickRateMenu];
    },
    set(_target, prop, value) {
        (getTickRateMenu() as unknown as Record<string | symbol, unknown>)[prop] = value;
        return true;
    }
});

export const placeableState = new Proxy({} as PlaceableState, {
    get(_target, prop) {
        return getPlaceableState()[prop as keyof PlaceableState];
    },
    set(_target, prop, value) {
        (getPlaceableState() as unknown as Record<string | symbol, unknown>)[prop] = value;
        return true;
    }
});

export const wireState = new Proxy({} as WireState, {
    get(_target, prop) {
        return getWireState()[prop as keyof WireState];
    },
    set(_target, prop, value) {
        (getWireState() as unknown as Record<string | symbol, unknown>)[prop] = value;
        return true;
    }
});

export const unplacedWireState = new Proxy({} as UnplacedWireState, {
    get(_target, prop) {
        return getUnplacedWireState()[prop as keyof UnplacedWireState];
    },
    set(_target, prop, value) {
        (getUnplacedWireState() as unknown as Record<string | symbol, unknown>)[prop] = value;
        return true;
    }
});
