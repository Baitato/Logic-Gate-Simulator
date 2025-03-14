import { Sprite } from "pixi.js";
import { loadTexture } from "../managers/assetManager";
import { app } from "../core/app";

export class RotationHandler {
  constructor(parentGate) {
    this.parentGate = parentGate;
    this.rotationHandle = null;
    this.startPointerAngle = 0;
    this.startRotation = 0;
    this.handlePointerMove = null;
    this.handlePointerUp = null;
  }

  async createRotationHandle() {
    if (this.rotationHandle) return;

    this.rotationHandle = new Sprite(await loadTexture("rotate"));
    const handleOffset = -this.parentGate.gateSprite.height / 2 - 10;
    this.rotationHandle.anchor.set(0.5);
    this.rotationHandle.y = handleOffset;
    this.rotationHandle.width = 10;
    this.rotationHandle.height = 10;
    this.rotationHandle.eventMode = "static";
    this.rotationHandle.cursor = "pointer";
    this.rotationHandle.zIndex = -10;
    this.rotationHandle.on(
      "pointerdown",
      this.onRotationHandleClick.bind(this)
    );

    this.parentGate.addChild(this.rotationHandle);
  }

  removeRotationHandle() {
    if (!this.rotationHandle) return;

    this.parentGate.removeChild(this.rotationHandle);
    this.rotationHandle.destroy();
    this.rotationHandle = null;
  }

  onRotationHandleClick(event) {
    event.stopPropagation(); // Prevent gate click

    // Store initial rotation and pointer angle
    this.startRotation = this.parentGate.rotation;
    const localPos = this.parentGate.toLocal(event.global);
    this.startPointerAngle = Math.atan2(localPos.y, localPos.x);

    this.setupRotationEvents();
  }

  setupRotationEvents() {
    // Define the handlers as class properties so they can be removed later
    this.handlePointerMove = (event) => {
      // Get pointer position in local coordinates
      const localPos = this.parentGate.toLocal(event.global);
      const currentAngle = Math.atan2(localPos.y, localPos.x);

      // Calculate the delta angle
      const deltaAngle = currentAngle - this.startPointerAngle;

      // Apply smoothed rotation relative to the starting rotation
      const targetRotation = this.startRotation + deltaAngle;
      this.parentGate.rotation = this.smoothRotation(
        this.parentGate.rotation,
        targetRotation
      );
    };

    this.handlePointerUp = () => {
      // Snap the rotation to the nearest 90-degree increment
      const snappedRotation =
        Math.round(this.parentGate.rotation / (Math.PI / 2)) * (Math.PI / 2);
      this.parentGate.rotation = snappedRotation;

      // Clean up event listeners
      this.cleanupRotationEvents();
    };

    // Add event listeners
    app.stage.on("pointermove", this.handlePointerMove);
    app.stage.on("pointerup", this.handlePointerUp);
  }

  cleanupRotationEvents() {
    if (this.handlePointerMove) {
      app.stage.off("pointermove", this.handlePointerMove);
      this.handlePointerMove = null;
    }
    
    if (this.handlePointerUp) {
      app.stage.off("pointerup", this.handlePointerUp);
      this.handlePointerUp = null;
    }
  }

  smoothRotation(currentRotation, targetRotation, smoothingFactor = 0.2) {
    return (
      currentRotation + (targetRotation - currentRotation) * smoothingFactor
    );
  }
}
