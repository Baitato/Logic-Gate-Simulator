
export interface ViewportPublisher {
    addViewportListener(listener: ViewportListener): void;
}

export interface ViewportListener {
    onViewportClick(): void;
    onKeyPress(_event: KeyboardEvent): void;
}