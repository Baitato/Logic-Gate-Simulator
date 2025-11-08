import { Container, Graphics } from "pixi.js";
import { GateTool } from "./GateTool";
import { ScrollBox } from "@pixi/ui";
import { place } from "../services/viewport/placementService";
import { GateType } from "../enums/GateType";

const toolboxWidth = 145;
const elementpadding = 20;
const scrollBarPadding = { x: 25, y: 20 };

export class Toolbox extends Container {
    constructor() {
        super();
        this.isRenderGroup = true;
        this.zIndex = 1000;
        // Reorder: First get gates and compute height, then add background and ScrollBox
        this.initializeToolbox();
    }

    async initializeToolbox() {
        const gates: GateTool[] = await this.getGateIcons();
        // Calculate dynamic toolbox height based on content
        const toolboxHeight = this.calculateToolboxHeight(gates);
        this.addBackground(toolboxHeight);
        this.addScrollBox(gates, toolboxHeight);
    }

    addBackground(toolboxHeight: number) {
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

    addScrollBox(gates: GateTool[], toolboxHeight: number) {
        gates.forEach((gate) => { gate.on("pointerdown", (event) => place(event, gate.type)) });

        const scrollBox = new ScrollBox({
            width: toolboxWidth - scrollBarPadding.x,
            height: toolboxHeight - scrollBarPadding.y,
            radius: 20,
            elementsMargin: elementpadding,
            items: gates,
        });

        scrollBox.position.set(scrollBarPadding.x, scrollBarPadding.y);

        this.addChild(scrollBox);
    }

    calculateToolboxHeight(gates: GateTool[]): number {
        if (gates.length === 0) return 0;
        // Sum heights of all gates + margins between them + top/bottom padding
        const totalGatesHeight = (Math.ceil(gates.length / 2)) * gates[0].height;
        const totalMargins = (gates.length) * elementpadding;
        return totalGatesHeight / 2 + totalMargins + scrollBarPadding.y * 2; // Add padding for top and bottom
    }

    async getGateIcons(): Promise<GateTool[]> {
        const gateIcons: GateTool[] = [
            new GateTool(GateType.AND),
            new GateTool(GateType.NAND),
            new GateTool(GateType.OR),
            new GateTool(GateType.NOR),
            new GateTool(GateType.XOR),
            new GateTool(GateType.XNOR),
            new GateTool(GateType.NOT),
        ];

        return gateIcons;
    }
}