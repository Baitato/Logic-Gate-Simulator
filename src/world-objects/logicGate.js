import { Container, Sprite, Graphics } from "pixi.js";
import { loadTexture } from "../assetLoader/assetLoading";
import { app } from "../app";

export class LogicGate extends Container {
  static selectedGate = null; // Static property to track the currently selected gate

  constructor(type) {
    super();
    this.type = type;
    this.selected = false; // Track selection state
    this.rotationHandle = null; // Rotation handle
    this.gateSprite = null; // Main gate sprite

    // Variables for rotation drag state
    this._startPointerAngle = 0;
    this._startRotation = 0;

    this.setupGate();
  }

  async setupGate() {
    // Load texture and setup sprite
    const texture = await loadTexture(this.type);
    this.gateSprite = new Sprite(texture);
    this.gateSprite.anchor.set(0.5);
    this.gateSprite.eventMode = "static";
    this.gateSprite.cursor = "pointer";
    this.gateSprite.on("pointerdown", this.onGateClick.bind(this));
    this.addChild(this.gateSprite);
  }

  onGateClick() {
    // Deselect the previously selected gate (if any)
    if (LogicGate.selectedGate && LogicGate.selectedGate !== this) {
      LogicGate.selectedGate.deselect();
    }

    // Toggle selection for the current gate
    this.selected = !this.selected;
    this.updateSelectionUI();

    // Update the static reference to the currently selected gate
    if (this.selected) {
      LogicGate.selectedGate = this;
    } else {
      LogicGate.selectedGate = null;
    }
  }

  deselect() {
    this.selected = false;
    this.updateSelectionUI();
  }

  updateSelectionUI() {
    if (this.selected) {
      // Create rotation handle if it doesn't exist
      if (!this.rotationHandle) {
        this.rotationHandle = new Graphics();
        const handleSize = 15;
        const handleOffset = -this.gateSprite.height / 2 - 10;
        this.rotationHandle.beginFill(0xffffff);
        this.rotationHandle.drawCircle(0, handleOffset, handleSize / 2);
        this.rotationHandle.endFill();
        this.rotationHandle.eventMode = "static";
        this.rotationHandle.cursor = "pointer";
        this.rotationHandle.zIndex = -10;
        this.rotationHandle.on(
          "pointerdown",
          this.onRotationHandleClick.bind(this)
        );
        // Add to the gate container
        this.addChild(this.rotationHandle);
        console.log("Rotation handle created and added to gate.");
      }
    } else {
      // Remove rotation handle if not selected
      if (this.rotationHandle) {
        this.removeChild(this.rotationHandle);
        this.rotationHandle.destroy(); // Clean up the handle
        this.rotationHandle = null;
        console.log("Rotation handle removed and destroyed.");
      }
    }
  }

  onRotationHandleClick(event) {
    event.stopPropagation(); // Prevent gate click

    // Store initial rotation and pointer angle (in local coordinates)
    this._startRotation = this.rotation;
    const localPos = this.toLocal(event.global);
    this._startPointerAngle = Math.atan2(localPos.y, localPos.x);

    console.log("Rotation handle clicked. Starting rotation.");

    this.startRotation();
  }

  startRotation() {
    const onPointerMove = (event) => {
      // Get pointer position in local coordinates
      const localPos = this.toLocal(event.global);
      const currentAngle = Math.atan2(localPos.y, localPos.x);

      // Calculate the delta angle
      const deltaAngle = currentAngle - this._startPointerAngle;

      // Apply smoothed rotation relative to the starting rotation
      const targetRotation = this._startRotation + deltaAngle;
      this.rotation = this.smoothRotation(this.rotation, targetRotation);
    };

    const onPointerUp = () => {
      // Snap the rotation to the nearest 90-degree increment
      const snappedRotation =
        Math.round(this.rotation / (Math.PI / 2)) * (Math.PI / 2);
      this.rotation = snappedRotation;

      // Clean up event listeners
      app.stage.off("pointermove", onPointerMove);
      app.stage.off("pointerup", onPointerUp);
      console.log("Rotation ended. Rotation snapped to 90-degree increment.");
    };

    app.stage.on("pointermove", onPointerMove);
    app.stage.on("pointerup", onPointerUp);
  }

  smoothRotation(currentRotation, targetRotation, smoothingFactor = 0.2) {
    // Apply linear interpolation (lerp) for smooth rotation
    return (
      currentRotation + (targetRotation - currentRotation) * smoothingFactor
    );
  }
}
