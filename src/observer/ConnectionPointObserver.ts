import { ConnectionPoint } from '../models/ConnectionPoint';

export interface ConnectionPointPublisher {
    addConnectionPointListener(listener: ConnectionPointListener): void;
}

export interface ConnectionPointListener {
    onConnectionPointClick(connectionPoint: ConnectionPoint): void;
}