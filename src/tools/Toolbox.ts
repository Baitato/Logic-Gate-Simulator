import { Container, Graphics } from "pixi.js";
import { PlaceableTool } from "./PlaceableTool";
import { ScrollBox } from "@pixi/ui";
import { place } from "../services/viewport/placementService";
import { PlaceableType } from "../enums/PlaceableType";

const toolboxWidth = 145;
const elementpadding = 20;
const scrollBarPadding = { x: 25, y: 20 };

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
        const tools: PlaceableTool[] = await this.getPlaceableToolIcons();
        // Calculate dynamic toolbox height based on content
        const toolboxHeight = this.calculateToolboxHeight(tools);
        this.addBackground(toolboxHeight);
        this.addScrollBox(tools, toolboxHeight);
    }

    private addBackground(toolboxHeight: number): void {
        const background: Graphics = new Graphics()
            .filletRect(
                0.005 * window.innerWidth,
                0.005 * window.innerWidth,
                toolboxWidth,
                toolboxHeight,
                20
            )
            .fill({ color: 0x333333, alpha: 0.33 });

        this.addChild(background);
    }

    private addScrollBox(tool: PlaceableTool[], toolboxHeight: number): void {
        tool.forEach((tool) => { tool.on("pointerdown", (event) => place(event, tool.type)) });

        const scrollBox = new ScrollBox({
            width: toolboxWidth - scrollBarPadding.x,
            height: toolboxHeight - scrollBarPadding.y,
            radius: 20,
            elementsMargin: elementpadding,
            items: tool,
        });
        scrollBox.position.set(scrollBarPadding.x, scrollBarPadding.y);

        this.addChild(scrollBox);
    }

    private calculateToolboxHeight(tools: PlaceableTool[]): number {
        if (tools.length === 0) return 0;

        // Sum heights of all tools + margins between them + top/bottom padding
        const totalToolsHeight = (Math.ceil(tools.length / 2)) * tools[0].height;
        const totalMargins = Math.ceil((tools.length) / 2) * elementpadding * 2;

        return totalToolsHeight / 2 + totalMargins + scrollBarPadding.y;
    }

    private async getPlaceableToolIcons(): Promise<PlaceableTool[]> {
        const placeableToolIcons: PlaceableTool[] = [
            new PlaceableTool(PlaceableType.AND),
            new PlaceableTool(PlaceableType.NAND),
            new PlaceableTool(PlaceableType.OR),
            new PlaceableTool(PlaceableType.NOR),
            new PlaceableTool(PlaceableType.XOR),
            new PlaceableTool(PlaceableType.XNOR),
            new PlaceableTool(PlaceableType.NOT),
            new PlaceableTool(PlaceableType.BUFFER),
            new PlaceableTool(PlaceableType.SWITCH)
        ];

        return placeableToolIcons;
    }
}