import { Container, Graphics, Text, TextStyle } from "pixi.js";
import { PlaceableTool } from "./PlaceableTool";
import { ScrollBox } from "@pixi/ui";
import { AssetName } from "../enums/AssetName";
import { PlaceableType } from "../enums/PlaceableType";
import { BaseTool } from "./BaseTool";
import { ImportTool } from "./ImportTool";
import { ExportTool } from "./ExportTool";
import { MiscTool } from "./MiscTool";
import { ImportService } from '../services/ImportService';
import { PlacementService } from '../services/viewport/PlacementService';

// Layout constants - all dimensions derive from these
const ITEM_SIZE = 50;
const ITEM_GAP = 20;
const COLUMNS = 3;
const CONTENT_WIDTH = COLUMNS * ITEM_SIZE + (COLUMNS - 1) * ITEM_GAP; // 190px
const CONTENT_PADDING = 12;
const TOOLBOX_WIDTH = CONTENT_WIDTH + CONTENT_PADDING * 2; // 214px
const TOOLBOX_POSITION = { x: 10, y: 10 }; // Position from screen edge
const HEADER_HEIGHT = 30;
const CATEGORY_GAP = 10;
const MAX_CATEGORY_HEIGHT = 600; // Max height for each category's scrollbox

interface ToolCategory {
    name: string;
    tools: BaseTool[];
    collapsed: boolean;
}

export class Toolbox extends Container {
    static #instance: Toolbox;
    static #initialized = false;
    private importService: ImportService;
    private placementService: PlacementService;
    private categories: ToolCategory[] = [];
    private toolboxContainer!: Container;
    private background!: Container;
    private bgGraphics!: Graphics;

    private constructor(importService: ImportService, placementService: PlacementService) {
        super();
        this.importService = importService;
        this.placementService = placementService;
        this.isRenderGroup = true;
        this.zIndex = 1000;
    }

    public static init(): void {
        if (this.#initialized) return;
        const importService = ImportService.getInstance();
        const placementService = PlacementService.getInstance();
        this.#instance = new Toolbox(importService, placementService);
        this.#instance.initializeToolbox();
        this.#initialized = true;
    }

    public static getInstance(): Toolbox {
        if (!this.#instance) {
            throw new Error('Toolbox not initialized. Call init() first.');
        }
        return this.#instance;
    }

    private initializeToolbox(): void {
        // Create categories
        this.categories = [
            {
                name: "Logic Gates",
                tools: this.getLogicGateTools(),
                collapsed: false
            },
            {
                name: "I/O",
                tools: this.getIOTools(),
                collapsed: false
            },
            {
                name: "Import/Export",
                tools: this.getImportExportTools(),
                collapsed: false
            }
        ];

        // Create background container
        this.background = new Container();
        this.background.position.set(TOOLBOX_POSITION.x, TOOLBOX_POSITION.y);

        this.bgGraphics = new Graphics();
        this.background.addChild(this.bgGraphics);

        this.toolboxContainer = new Container();
        this.toolboxContainer.position.set(CONTENT_PADDING, CONTENT_PADDING);

        this.background.addChild(this.toolboxContainer);
        this.addChild(this.background);

        // Render categories
        this.renderCategories();
    }

    private updateBackground(): void {
        const toolboxHeight = this.toolboxContainer.height + CONTENT_PADDING * 2;

        // Redraw background to match content size
        this.bgGraphics.clear();
        this.bgGraphics
            .roundRect(0, 0, TOOLBOX_WIDTH, toolboxHeight, 20)
            .fill({ color: 0x333333, alpha: 0.33 });
    }

    private renderCategories(): void {
        this.toolboxContainer.removeChildren();

        let currentY = 0;

        this.categories.forEach((category) => {
            // Create category header
            const header = this.createCategoryHeader(category.name, category.collapsed);
            header.position.set(0, currentY);

            header.eventMode = 'static';
            header.cursor = 'pointer';
            header.on('pointerdown', () => {
                category.collapsed = !category.collapsed;
                this.renderCategories();
            });

            this.toolboxContainer.addChild(header);
            currentY += HEADER_HEIGHT + CATEGORY_GAP;

            // Add tools if not collapsed
            if (!category.collapsed) {
                const categoryContent = this.createCategoryContent(category.tools);
                categoryContent.position.set(0, currentY);
                this.toolboxContainer.addChild(categoryContent);
                currentY += categoryContent.height + CATEGORY_GAP;
            }
        });

        // Update background to match content size
        this.updateBackground();
    }

    private createCategoryContent(tools: BaseTool[]): Container {
        const wrapper = new Container();
        const toolsContainer = new Container();

        tools.forEach((tool, i) => {
            const col = i % COLUMNS;
            const row = Math.floor(i / COLUMNS);

            tool.position.set(col * (ITEM_SIZE + ITEM_GAP), row * (ITEM_SIZE + ITEM_GAP));

            if (tool instanceof PlaceableTool)
                tool.on("pointerdown", (event) => this.placementService.place(event, tool.type));

            if (tool instanceof MiscTool)
                tool.on("pointerup", () => tool.onClick());

            toolsContainer.addChild(tool);
        });

        // If content is taller than max height, wrap in scrollbox
        const contentHeight = toolsContainer.height;
        if (contentHeight > MAX_CATEGORY_HEIGHT) {
            const scrollBox = new ScrollBox({
                width: CONTENT_WIDTH,
                height: MAX_CATEGORY_HEIGHT,
                radius: 5,
                elementsMargin: 0,
                items: [toolsContainer],
            });
            wrapper.addChild(scrollBox);
        } else {
            wrapper.addChild(toolsContainer);
        }

        return wrapper;
    }

    private createCategoryHeader(name: string, collapsed: boolean): Container {
        const header = new Container();

        const background = new Graphics()
            .roundRect(0, 0, CONTENT_WIDTH, 25, 5)
            .fill({ color: 0x555555, alpha: 0.5 });

        const textStyle = new TextStyle({
            fontFamily: 'Arial',
            fontSize: 17,
            fill: 0xffffff,
        });

        const arrow = collapsed ? '►' : '▼';
        const text = new Text({ text: `${arrow} ${name}`, style: textStyle });
        text.position.set(5, 3);

        header.addChild(background);
        header.addChild(text);

        return header;
    }

    private getLogicGateTools(): PlaceableTool[] {
        return [
            new PlaceableTool(AssetName.AND, PlaceableType.AND),
            new PlaceableTool(AssetName.NAND, PlaceableType.NAND),
            new PlaceableTool(AssetName.OR, PlaceableType.OR),
            new PlaceableTool(AssetName.NOR, PlaceableType.NOR),
            new PlaceableTool(AssetName.XOR, PlaceableType.XOR),
            new PlaceableTool(AssetName.XNOR, PlaceableType.XNOR),
            new PlaceableTool(AssetName.NOT, PlaceableType.NOT),
            new PlaceableTool(AssetName.BUFFER, PlaceableType.BUFFER),
        ];
    }

    private getIOTools(): PlaceableTool[] {
        return [
            new PlaceableTool(AssetName.SWITCH_OFF, PlaceableType.SWITCH),
            new PlaceableTool(AssetName.BULB_OFF, PlaceableType.BULB),
            new PlaceableTool(AssetName.CLOCK, PlaceableType.CLOCK),
        ];
    }

    private getImportExportTools(): BaseTool[] {
        return [
            new ImportTool(AssetName.IMPORT, this.importService),
            new ExportTool(AssetName.EXPORT),
        ];
    }
}