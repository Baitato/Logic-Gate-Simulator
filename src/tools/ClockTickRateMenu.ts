import { Container, Graphics, Text, TextStyle } from "pixi.js";
import { Input, Slider } from "@pixi/ui";
import { PlaceableListener } from "../observer/PlaceableObserver";
import { Placeable } from "../models/Placeable";
import { ViewportListener } from "../observer/ViewportObserver";
import { PlaceableType } from "../enums/PlaceableType";
import { Clock } from "../models/Clock";
import { ViewportWrapper } from "../core/ViewportWrapper";

export class ClockTickRateMenu extends Container implements PlaceableListener, ViewportListener {
    static #instance: ClockTickRateMenu;
    static #initialized = false;
    private selected: Clock | null = null;
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
        ViewportWrapper.getInstance().addViewportListener(this.#instance);
    }

    public static getInstance(): ClockTickRateMenu {
        if (!this.#instance) {
            this.init();
        }
        return this.#instance;
    }

    /** Gets the actual stored value (1-1000) from the slider */
    public getValue(): number {
        return Math.round(this.slider.value);
    }

    /** Sets the value programmatically (1-1000), updates both slider and input display */
    public setValue(value: number): void {
        if (value < 1) {
            value = 1;
        } else if (value > 1000) {
            value = 1000;
        }

        value = Math.round(value);

        this.slider.value = value;

        this.valueInput.value = `${value * 2}`;

        this.selected?.setTickRate(value);
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

        titleText.anchor.set(0.5, 0);
        titleText.position.set(backgroundWidth / 2, 10);

        this.addChild(titleText);

        const sliderWidth = 200;
        const sliderBG = new Graphics()
            .roundRect(0, 0, sliderWidth, 8, 4)
            .fill({ color: 0x555555 });

        const sliderFill = new Graphics()
            .roundRect(0, 0, sliderWidth, 8, 4)
            .fill({ color: 0x4a9eff });

        const sliderHandle = new Graphics()
            .regularPoly(0, 0, 12, 32)
            .fill({ color: 0xffffff });

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

        this.valueInput.pivot.set(inputWidth / 2, 0);
        this.valueInput.position.set(backgroundWidth / 2, 95);
        this.addChild(this.valueInput);

        this.slider.onUpdate.connect((value) => {
            const roundedValue = Math.round(value);
            const displayValue = roundedValue * 2;
            this.valueInput.value = `${displayValue}`;

            // Update the clock in real-time
            this.handleInputChange(`${displayValue}`);
        });

    }

    private handleInputChange(inputValue: string): void {
        let displayValue = parseInt(inputValue, 10);

        if (isNaN(displayValue)) {
            this.valueInput.value = `${Math.round(this.slider.value) * 2}`;
            return;
        }

        if (displayValue < 2) {
            displayValue = 2;
        } else if (displayValue > 2000) {
            displayValue = 2000;
        }

        if (displayValue % 2 !== 0) {
            displayValue = displayValue - 1;
        }

        this.setValue(displayValue / 2);
    }

    public onPlaceableClick(placeable: Placeable): void {
        if (placeable.type !== PlaceableType.CLOCK)
            return;

        this.visible = true;
        this.selected = placeable as Clock;
        this.setValue(this.selected.getTickRate());
    }

    public onViewportClick(): void {
        this.visible = false;;
        this.selected = null;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public onKeyPress(_event: KeyboardEvent): void {
        // No action needed for clock tick rate menu on key press
    }
}