import { Asset } from "../type/Asset";

const assetsPath = "assets/56x56";

export const cellSize = 50;

export const AssetMap: Record<string, Asset> = {
    NOT: { name: "not", path: `${assetsPath}/not.svg` },
    AND: { name: "and", path: `${assetsPath}/and.svg` },
    NAND: { name: "nand", path: `${assetsPath}/nand.svg` },
    OR: { name: "or", path: `${assetsPath}/or.svg` },
    NOR: { name: "nor", path: `${assetsPath}/nor.svg` },
    XOR: { name: "xor", path: `${assetsPath}/xor.svg` },
    XNOR: { name: "xnor", path: `${assetsPath}/xnor.svg` },
    BUFFER: { name: "buffer", path: `${assetsPath}/buffer.svg` },
    BULB_OFF: { name: "light-off", path: `${assetsPath}/light-off.svg` },
    BULB_ON: { name: "light-on", path: `${assetsPath}/light-on.svg` },
    SWITCH_OFF: { name: "switch-empty", path: `${assetsPath}/switch-empty.svg` },
    SWITCH_ON: { name: "on-switch", path: `${assetsPath}/on-switch.svg` },
    EXPORT: { name: "export", path: `${assetsPath}/export.svg` },
    IMPORT: { name: "import", path: `${assetsPath}/import.svg` },
    CLOCK: { name: "clock", path: `${assetsPath}/clock.svg` },
    ROTATION_WIDGET: { name: "rotate", path: `${assetsPath}/rotate.svg` },
}
