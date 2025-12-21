import { AssetName } from "../enums/AssetName";
import { MiscTool } from "./MiscTool";
import { ImportService } from '../services/ImportService';
import PositionService from '../services/viewport/PositionService';

export class ImportTool extends MiscTool {
    private importService: ImportService;

    constructor(assetName: AssetName, importService: ImportService) {
        super(assetName);
        this.importService = importService;
    }

    public async onClick(): Promise<void> {
        document.getElementById("fileInput")?.click();

        const fileInput = document.getElementById("fileInput") as HTMLInputElement;

        fileInput.addEventListener('change', (event) => {
            const file = (event.target as HTMLInputElement).files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.readAsText(file);

                reader.onload = async (e) => {
                    const content = e.target?.result as string;

                    const lines = content.split('\n');

                    this.importService.import(lines);
                    PositionService.clearAll();
                };
            }
        });
    }
}