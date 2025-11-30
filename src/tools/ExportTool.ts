import { AssetName } from "../enums/AssetName";
import { StateManager } from "../state/StateManager";
import { MiscTool } from "./MiscTool";

export class ExportTool extends MiscTool {
    constructor(assetName: AssetName) {
        super(assetName);
    }

    public onClick(): void {
        let content = "";

        StateManager.placeableById.forEach((placeable) => {
            content += placeable.exportAsString() + "\n";
        });
        StateManager.wireById.forEach((wire) => {
            content += wire.exportAsString() + "\n";
        });

        const blob = new Blob([content], { type: 'text/plain' });

        // Create a temporary URL for the blob
        const url = URL.createObjectURL(blob);

        // Create a temporary anchor element
        const link = document.createElement("a");
        link.href = url;
        link.download = "export.txt"; // Set the filename

        // Trigger the download
        document.body.appendChild(link);
        link.click();

        // Clean up
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
}