import { Placeable } from "../models/Placeable";

export interface PlaceablePublisher {
    addPlaceableListener(listener: PlaceableListener): void;
}

export interface PlaceableListener {
    onPlaceableClick(placeable: Placeable): void;
}