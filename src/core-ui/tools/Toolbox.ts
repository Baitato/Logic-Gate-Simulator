import { Application, Container, Graphics, Size } from "pixi.js";
import { List } from "@pixi/ui";
import { AssetMap } from "../../util/constants";
import { ToolFactory } from "./ToolFactory";
import { BaseTool } from "./BaseTool";

const toolAssetSize: Size = {
    width: 30,
    height: 30,
};

const padding = 10;

const TOOLS = {
    NOT: AssetMap.NOT,
    AND: AssetMap.AND,
    NAND: AssetMap.NAND,
    OR: AssetMap.OR,
    NOR: AssetMap.NOR,
    XOR: AssetMap.XOR,
    XNOR: AssetMap.XNOR,
    BUFFER: AssetMap.BUFFER,
    // BULB: AssetMap.BULB_OFF,
    // SWITCH: AssetMap.SWITCH_OFF,
    // EXPORT: AssetMap.EXPORT,
    // IMPORT: AssetMap.IMPORT,
    // CLOCK: AssetMap.CLOCK,
}

export class Toolbox extends Container {
    private toolList!: List;

    constructor(app: Application) {
        super();
        app.stage.addChild(this);

        this.position.set(10, 10);
        this._createToolbox();
    }

    private _createToolbox(): void {
        this._populateToolbox();
        this._addBackground();
    }

    private _populateToolbox() {
        const toolSprites: BaseTool[] = Object.values(TOOLS).map((asset) => {
            return ToolFactory.createTool(asset, toolAssetSize);
        });

        this.toolList = new List({
            children: toolSprites,
            maxWidth: 4 * toolAssetSize.width,
            elementsMargin: 20,
            padding: padding,
        })
        this.addChild(this.toolList);
    }

    private _addBackground() {
        const bg = new Graphics();
        bg.roundRect(0, 0, padding * 2 + this.toolList.width, padding * 2 + this.toolList.height, 20);
        bg.fill({ color: 0x333333, alpha: 0.33 });
        this.addChildAt(bg, 0);
    }
}