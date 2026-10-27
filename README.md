# 🟡 NEO-PAC AI — Autonomous Pac-Man Intelligent Agent

> A fast, smooth, minimalistic high-definition **Pac-Man AI Agent** simulation built with **Next.js 16**, **React 19**, and **Tailwind CSS v4**. Features real-time **A\* Search** with Manhattan distance heuristics and **Breadth-First Search (BFS)** multi-agent adversarial pursuit on HTML5 Canvas.

---

## 🚀 Key Features

- **High-Definition Retina Rendering**: Automatic DPI scaling ensures crisp geometric rendering without blurriness on 4K and Apple Retina displays.
- **Smooth Sub-pixel Motion**: Continuous floating-point interpolation (`progress` lerp) eliminates tile-by-tile jumpiness for buttery 60 FPS arcade movement.
- **Live AI Trajectory Visualizer**: Toggleable animated dashed lines indicate the exact planned paths for Pac-Man (emerald) and all four ghosts.
- **Dynamic Threat Field**: Visualizes ghost danger zones with radial threat auras and automatic danger-avoidance path weighting.
- **Microsecond Execution Speed**: Low-level `Int16Array` and `Uint8Array` allocations minimize garbage collector pauses and keep search execution under **0.1 milliseconds**.
- **Interactive Speed Modulators**: Instant simulation speed adjustment from `0.8x` (slow-motion analysis) up to `3.5x` (lightning blitz).
- **Web Audio API Sound Engine**: Zero-asset, synthesized retro audio effects for chimes, energizers, and ghost crunches with an instant mute toggle.
- **Scroll-Aware Floating Navigation**: Modern floating navbar that hides on downward scrolling and smoothly reappears upon scrolling up.
- **Accessibility & UX**: Descriptive `title` tooltips, ARIA labels, and `cursor-pointer` indicators on every interactive control.

---

## 🧠 AI Search Algorithms

- **Pac-Man (A\* Search)**: Uses $f(n) = g(n) + h(n)$ with Manhattan distance heuristic ($h(n) = |\Delta row| + |\Delta col|$) to compute the optimal path to the nearest food pellet while actively routing around ghost-occupied threat tiles.
- **Ghosts (BFS Search)**: Blinky, Pinky, Inky, and Clyde use Breadth-First Search to find the shortest path to Pac-Man in Chase mode, or flee to corners in Frightened mode.

---

## 📁 Clean Project Structure

```
AI_Project/
├── src/
│   ├── app/
│   │   ├── favicon.ico             # App icon
│   │   ├── globals.css             # Tailwind v4 theme, custom scrollbar & smooth scrolling
│   │   ├── layout.js               # Metadata, OpenGraph cards, fonts, and viewport settings
│   │   └── page.js                 # Minimalist main page layout
│   ├── components/
│   │   ├── BrandLogo.js            # Vector SVG brand logo
│   │   ├── FloatingNavbar.js       # Scroll-aware hide/reveal floating header
│   │   ├── PacmanGame.js           # 60 FPS HD Canvas engine, HUD telemetry, and control deck
│   │   └── Footer.js               # Compact brandable footer
│   ├── constants/
│   │   └── gameConfig.js           # Grid dimensions, tile enums, profiles, and color palette
│   └── lib/
│       ├── mazeMap.js              # 21x19 primary maze matrix and query utilities
│       ├── searchAlgorithms.js     # TypedArray-optimized A* and BFS search engines
│       └── soundEffects.js         # Self-contained Web Audio API synthesizer
├── next.config.mjs                 # Security headers (HSTS, CSP, X-Frame-Options) & Turbopack
├── jsconfig.json                   # Path alias mappings (@/* -> src/*)
├── package.json                    # Project dependencies and script declarations
└── README.md                       # Documentation
```

---

## 🎮 Controls & Hotkeys

All interactive elements feature descriptive hover tooltips (`title`) and `cursor-pointer` indicators:

| Action | Control | Hotkey | Description |
|---|---|---|---|
| **Play / Pause** | `▶ Start AI` / `⏸ Pause` Button | `[Space]` | Toggle continuous simulation loop |
| **Reset** | `↺ Reset` Button | `[R]` | Re-seed food pellets and reset agent locations |
| **Path Trajectories** | `Paths` Toggle | `[P]` | Toggle animated dashed vectors for A* and BFS |
| **Threat Zones** | `Danger` Toggle | `[D]` | Toggle ghost threat aura radial heatmaps |
| **Audio Effects** | `🔊 SFX` / `🔇 Mute` | `[M]` | Toggle Web Audio synthesized arcade chimes |
| **Speed Multiplier** | `0.8x`, `1.2x`, `2.0x`, `3.5x` | — | Adjust simulation velocity in real time |
| **Canvas Direct Play** | Click on Canvas | `[Space]` | Click anywhere on the maze to launch |

---

## 💻 Quickstart

```bash
# 1. Install dependencies
npm install

# 2. Run development server
npm run dev

# 3. Build for production
npm run build
npm run start
```

The app will be accessible at **[http://localhost:3000](http://localhost:3000)**.
