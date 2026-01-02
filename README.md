# Logic Gate Simulator

An interactive logic gate simulator built with TypeScript and PixiJS. Design, visualize, and simulate digital logic circuits directly in your browser.

## 🎯 Description

Logic Gate Simulator is a web-based application that allows you to build and simulate digital logic circuits. It provides an intuitive drag-and-drop interface for placing logic gates, switches, bulbs, and wires on an infinite canvas. The simulation runs in real-time, allowing you to see how signals propagate through your circuit.

### Features

- **Logic Gates**: AND, OR, NOT, NAND, NOR, XOR, XNOR, and BUFFER gates
- **Input/Output Components**: Switches (toggleable inputs) and Bulbs (visual outputs)
- **Clock Signal**: Built-in clock component with adjustable tick rate
- **Wire Connections**: Connect components with wires to create circuits
- **Real-time Simulation**: Watch your circuit operate in real-time
- **Pan & Zoom**: Navigate large circuits with an infinite canvas
- **Selection Tools**: Select, copy, paste, and delete components
- **Import/Export**: Save and load your circuit designs
- **Rotation**: Rotate gates to fit your circuit layout

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- npm (comes with Node.js)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/baitato/Logic-Gate-Simulator.git
   cd Logic-Gate-Simulator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

#### Development Mode

Start the development server with hot reload:

```bash
npm run dev
```

or

```bash
npm start
```

The application will be available at `http://localhost:5173` (or the next available port).

#### Production Build

Build the application for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

#### Deploy to GitHub Pages

```bash
npm run deploy
```

## 🎮 How to Use

1. **Place Components**: Select a component from the toolbox on the left side and click on the canvas to place it
2. **Connect Components**: Click on connection points to create wires between components
3. **Toggle Switches**: Click on switches to toggle their state (ON/OFF)
4. **Rotate Gates**: Use the rotation widget to orient gates as needed
5. **Pan Canvas**: Click and drag on empty space to pan the view
6. **Zoom**: Use the scroll wheel to zoom in/out
7. **Select Components**: Click and drag to create a selection box
8. **Copy/Paste**: Use Ctrl+C and Ctrl+V to copy and paste selected components
9. **Delete**: Select components and press Delete to remove them
10. **Import/Export**: Use the import/export tools to save and load circuits

## 🛠️ Tech Stack

- **TypeScript** - Type-safe JavaScript
- **PixiJS** - 2D WebGL renderer for high-performance graphics
- **pixi-viewport** - Pan and zoom functionality
- **@pixi/ui** - UI components (ScrollBox)
- **Vite** - Fast build tool and development server

## 📁 Project Structure

```
src/
├── main.ts                 # Application entry point
├── core/                   # Core application modules
│   ├── AppInitializer.ts   # Initialization phases
│   ├── ApplicationWrapper.ts
│   ├── Grid.ts             # Canvas grid
│   ├── ViewportWrapper.ts  # Pan/zoom viewport
│   └── simulator/          # Simulation engine
├── models/                 # Component models
│   ├── logic-gate/         # Gate implementations
│   ├── Bulb.ts
│   ├── Switch.ts
│   ├── Wire.ts
│   └── ...
├── services/               # Application services
│   ├── ConnectionService.ts
│   ├── CopyPasteService.ts
│   ├── PlacementService.ts
│   └── ...
├── tools/                  # Toolbox and tools
├── enums/                  # TypeScript enums
├── types/                  # TypeScript type definitions
└── utils/                  # Utility functions
```

## 🌐 Live Demo

Try the simulator online: [https://baitato.github.io/Logic-Gate-Simulator/](https://baitato.github.io/Logic-Gate-Simulator/)

## 📝 License

This project is licensed under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
