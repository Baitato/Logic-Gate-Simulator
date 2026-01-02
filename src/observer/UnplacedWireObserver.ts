import { FederatedPointerEvent } from "pixi.js";
export interface UnplacedWirePublisher {

    addUnplacedWireListener(listener: UnplacedWireListener): void;
}

export interface UnplacedWireListener {
    onUnplacedWireClick(event: FederatedPointerEvent): void;
}