import { Container, Graphics, Text, TextStyle } from "pixi.js";
import { Input, Slider } from "@pixi/ui";

export class ClockTickRateMenu extends Container {
    static #instance: ClockTickRateMenu;
    static #initialized = false;
    private slider!: Slider;
    private valueInput!: Input;

    private constructor() {
        super();
        this.zIndex = 1000;
        this.visible = false;
        this.position.set(window.innerWidth - 300, window.innerHeight - 175);
    }

    public static init(): void {
        if (this.#initialized) return;
        this.#instance = new ClockTickRateMenu();
        this.#instance.initializeMenu();
        this.#initialized = true;
    }

    public static getInstance(): ClockTickRateMenu {
        if (!this.#instance) {
            throw new Error('ClockTickRateMenu not initialized. Call init() first.');
        }
        return this.#instance;
    }

    /** Gets the actual stored value (1-1000) from the slider */
    public getValue(): number {
        return Math.round(this.slider.value);
    }

    /** Sets the value programmatically (1-1000), updates both slider and input display */
    public setValue(value: number): void {
        // Clamp to bounds [1, 1000]
        if (value < 1) {
            value = 1;
        } else if (value > 1000) {
            value = 1000;
        }

        value = Math.round(value);

        // Update slider
        this.slider.value = value;

        // Update input display (shows value * 2)
        this.valueInput.value = `${value * 2}`;
    }

    private initializeMenu(): void {
        const backgroundWidth = 275;
        const backgroundHeight = 150;

        const background = new Graphics()
            .filletRect(
                0,
                0,
                backgroundWidth,
                backgroundHeight,
                20
            )
            .fill({ color: 0x333333, alpha: 0.33 });

        this.addChild(background);

        const titleStyle = new TextStyle({
            fontFamily: 'Arial',
            fontSize: 25,
            fontWeight: 'bold',
            fill: 0xffffff,
        });

        const titleText = new Text({
            text: 'Ticks Per Second',
            style: titleStyle,
        });

        // Position at top middle of background
        titleText.anchor.set(0.5, 0);  // Center horizontally
        titleText.position.set(backgroundWidth / 2, 10);  // Center X, 10px from top

        this.addChild(titleText);

        // Create slider track (background)
        const sliderWidth = 200;
        const sliderBG = new Graphics()
            .roundRect(0, 0, sliderWidth, 8, 4)
            .fill({ color: 0x555555 });

        // Create slider fill
        const sliderFill = new Graphics()
            .roundRect(0, 0, sliderWidth, 8, 4)
            .fill({ color: 0x4a9eff });

        // Create slider handle with smooth circle (use regularPoly for smoother edges)
        const sliderHandle = new Graphics()
            .regularPoly(0, 0, 12, 32)  // 32 sides for a smooth circle
            .fill({ color: 0xffffff });

        // Create slider
        this.slider = new Slider({
            bg: sliderBG,
            fill: sliderFill,
            slider: sliderHandle,
            min: 1,
            max: 1000,
            value: 1,
        });

        this.slider.position.set((backgroundWidth - sliderWidth) / 2, 70);
        this.addChild(this.slider);

        // Create editable input for value display (shows value * 2)
        const inputWidth = 80;
        const inputHeight = 30;

        const inputBg = new Graphics()
            .roundRect(0, 0, inputWidth, inputHeight, 5)
            .fill({ color: 0x222222 });

        const inputStyle = new TextStyle({
            fontFamily: 'Arial',
            fontSize: 18,
            fill: 0xffffff,
            align: 'center',
        });

        this.valueInput = new Input({
            bg: inputBg,
            textStyle: inputStyle,
            placeholder: '',
            value: `${this.slider.value * 2}`,
            padding: [6, 0, 6, 0],
            align: 'center',
            maxLength: 4,
        });

        // Center the input field
        this.valueInput.pivot.set(inputWidth / 2, 0);
        this.valueInput.position.set(backgroundWidth / 2, 95);
        this.addChild(this.valueInput);

        // Track if slider is being dragged to avoid conflicts
        let isSliderDragging = false;

        // Update input when slider changes (only if not currently editing input)
        this.slider.onUpdate.connect((value) => {
            isSliderDragging = true;
            const displayValue = Math.round(value) * 2;
            this.valueInput.value = `${displayValue}`;
            isSliderDragging = false;
        });

        // Handle input changes - validate and update slider only on Enter
        this.valueInput.onEnter.connect((value) => {
            if (!isSliderDragging) {
                this.handleInputChange(value);
            }
        });
    }

    private handleInputChange(inputValue: string): void {
        let displayValue = parseInt(inputValue, 10);

        // If not a valid number, reset to current slider value
        if (isNaN(displayValue)) {
            this.valueInput.value = `${Math.round(this.slider.value) * 2}`;
            return;
        }

        // Clamp to bounds [2, 2000]
        if (displayValue < 2) {
            displayValue = 2;
        } else if (displayValue > 2000) {
            displayValue = 2000;
        }

        // If odd, drop down to previous even number
        if (displayValue % 2 !== 0) {
            displayValue = displayValue - 1;
        }

        // Use setValue with the actual value (displayValue / 2)
        this.setValue(displayValue / 2);
    }
}