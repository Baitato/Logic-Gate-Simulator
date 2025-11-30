import { Container, Graphics } from "pixi.js";
import { PlaceableTool } from "./PlaceableTool";
import { ScrollBox } from "@pixi/ui";
import { place } from "../services/viewport/placementService";
import { AssetName } from "../enums/AssetName";
import { PlaceableType } from "../enums/PlaceableType";
import { BaseTool } from "./BaseTool";
import { ImportTool } from "./ImportTool";
import { ExportTool } from "./ExportTool";
import { MiscTool } from "./MiscTool";

const toolboxWidth = 145;
const elementpadding = 20;
const scrollBarPadding = { x: 20, y: 20 };

export class Toolbox extends Container {

    private constructor() {
        super();
        this.isRenderGroup = true;
        this.zIndex = 1000;
    }

    static async create(): Promise<Toolbox> {
        const toolbox = new Toolbox();
        await toolbox.initializeToolbox();
        return toolbox;
    }

    private async initializeToolbox(): Promise<void> {
        const tools: BaseTool[] = this.getPlaceableToolIcons();
        tools.push(...this.getMiscToolIcons());

        const toolboxContainer = new Container();
        const itemSize = 50;
        const gap = 20;

        tools.forEach((tool, i) => {
            const col = i % 2;
            const row = Math.floor(i / 2);

            tool.position.set(col * (itemSize + gap), row * (itemSize + gap));

            if (tool instanceof PlaceableTool)
                tool.on("pointerdown", (event) => place(event, tool.type));

            if (tool instanceof MiscTool)
                tool.on("pointerup", () => tool.onClick());

            toolboxContainer.addChild(tool);
        });

        const toolboxHeight = Math.min(toolboxContainer.height + scrollBarPadding.y * 2, window.innerHeight - 40);

        const scrollBox = new ScrollBox({
            width: toolboxWidth - scrollBarPadding.x,
            height: toolboxHeight - scrollBarPadding.y,
            radius: 20,
            elementsMargin: elementpadding,
            items: [toolboxContainer],
        });
        scrollBox.position.set(scrollBarPadding.x, scrollBarPadding.y);

        const background = new Graphics()
            .filletRect(
                0.005 * window.innerWidth,
                0.005 * window.innerWidth,
                toolboxWidth,
                scrollBox.height,
                20
            )
            .fill({ color: 0x333333, alpha: 0.33 });

        background.addChild(scrollBox);
        this.addChild(background);
    }

    private getPlaceableToolIcons(): PlaceableTool[] {
        const placeableToolIcons: PlaceableTool[] = [
            new PlaceableTool(AssetName.AND, PlaceableType.AND),
            new PlaceableTool(AssetName.NAND, PlaceableType.NAND),
            new PlaceableTool(AssetName.OR, PlaceableType.OR),
            new PlaceableTool(AssetName.NOR, PlaceableType.NOR),
            new PlaceableTool(AssetName.XOR, PlaceableType.XOR),
            new PlaceableTool(AssetName.XNOR, PlaceableType.XNOR),
            new PlaceableTool(AssetName.NOT, PlaceableType.NOT),
            new PlaceableTool(AssetName.BUFFER, PlaceableType.BUFFER),
            new PlaceableTool(AssetName.SWITCH_OFF, PlaceableType.SWITCH),
            new PlaceableTool(AssetName.BULB_OFF, PlaceableType.BULB),
            new PlaceableTool(AssetName.CLOCK, PlaceableType.CLOCK),
        ];

        return placeableToolIcons;
    }

    private getMiscToolIcons(): BaseTool[] {
        const miscToolIcons: BaseTool[] = [
            new ImportTool(AssetName.IMPORT),
            new ExportTool(AssetName.EXPORT),
        ];

        return miscToolIcons;
    }
}