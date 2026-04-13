import { Application } from "pixi.js";
import { Screen } from "./core-ui/Screen";
import { Grid } from "./core-ui/Grid";
import { preloadAssets } from "./util/preloadAssets";
import { Toolbox } from "./core-ui/tools/Toolbox";
import { Placeable } from "./core-ui/objects/Placeable";
import { AssetMap } from "./util/constants";

export const app = new Application();

async function init() {
    await app.init({
        resolution: Math.max(window.devicePixelRatio, 2),
        resizeTo: window,
    });

    document.body.appendChild(app.canvas);

    const world = new Screen(app);
    new Grid(world, app);

    await preloadAssets();

    new Toolbox(app);

    world.addChild(new Placeable(AssetMap.AND, { width: 50, height: 50 }, { x: 0, y: 0 }));
}

init();