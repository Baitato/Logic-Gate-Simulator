import { WireUnplaced } from "../models/WireUnplaced";

class UnplacedWireState {
    selected: WireUnplaced | null = null;

    public unselect() {
        if (this.selected == null)
            return;
    }

    public delete() {
        if (this.selected == null)
            return;
        this.selected.destroy();
        this.selected = null;
    }
}

export const unplacedWireState = new UnplacedWireState();