import { Container, Graphics } from "pixi.js";
import { GateTool } from "./GateTool";
import { ScrollBox } from "@pixi/ui";
import { place } from "../services/viewport/placementService";
import { GateType } from "../enums/GateType";

const toolboxWidth = 150;
const toolboxHeight = 0.98 * window.innerHeight;
const elementpadding = 20;
const scrollBarPadding = { x: 25, y: 20 };

export class Toolbox extends Container {
    constructor() {
        super();
        this.zIndex = 1000;
        this.addBackground();
        this.addScrollBox();
    }

    addBackground() {
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

    async addScrollBox() {
        const gates: GateTool[] = await this.getGateIcons();
        gates.forEach((gate) => { gate.on("pointerdown", (event) => place(event, gate.type)) })

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

    async getGateIcons(): Promise<GateTool[]> {
        const gateIcons: GateTool[] = [
            new GateTool(GateType.AND),
            new GateTool(GateType.NAND),
            new GateTool(GateType.OR),
            new GateTool(GateType.NOR),
            new GateTool(GateType.XOR),
            new GateTool(GateType.XNOR),
            new GateTool(GateType.NOT),
        ]

        return gateIcons;
    }
}