# ⚡ Logic Gates — Digital Logic Simulator & Timing Graph

An interactive, clean digital logic gate simulator and waveform timing graph explorer built for computer science students, teachers, and electrical engineers.

🌐 **Live 24/7 Website:** [https://samarthjainsj2005-sketch.github.io/Logic-Gate-project/](https://samarthjainsj2005-sketch.github.io/Logic-Gate-project/)

---

## 🌟 Key Features

### 1. Interactive Logic Gate Simulation
- Covers all 7 essential logic gates:
  - **Basic Gates**: AND, OR, NOT
  - **Universal Gates**: NAND, NOR
  - **Exclusive / Arithmetic Gates**: XOR, XNOR
- **Step 1: Select a Gate** — Clean vector schematic outlines and IEEE standard symbols.
- **Step 2: Set Inputs** — Tactile bit toggles (`0` and `1`), interactive rocker switches, and combination presets (`A=0, B=0`, `A=0, B=1`, etc.).
- **Step 3: Result & Deduction** — Instant output evaluation (`0.0V / GND` vs `5.0V / VCC`), step-by-step boolean calculation breakdown, and plain-English logic explanations.

### 2. Digital Waveform Timing Graph (Oscilloscope)
- Real-time square-wave timing diagram plotting **Input A** (Amber), **Input B** (Purple), and **Output Y** (Emerald green).
- **▶ Run 4-Step Clock**: Cycles through all binary permutations (`00 → 01 → 10 → 11`) to draw a complete 4-period timing diagram automatically.

### 3. Gate Types Differentiation & Comparator Tab
- Deep, structured breakdown of the 3 fundamental gate families.
- **Multi-Gate Comparator**: Toggle inputs and observe all 7 gates computing outputs simultaneously.
- **Comparative Output Logic Level Graph**: Plots comparative signal response ($0\text{V}$ vs $5\text{V}$) across all gates side-by-side.
- Master comparison matrix table with boolean laws and applications.

### 4. Interactive Truth Table
- Synchronized truth table that dynamically highlights the active combination.
- Click any row in the table to immediately load and simulate that state.

---

## 🚀 How to Run Locally

### Option A: 1-Click Launch (Windows)
Double-click `start_server.bat` in File Explorer.

### Option B: Python Server
```bash
python server.py --open
```
The server will start on `http://localhost:3000` and automatically detect your Wi-Fi IP so friends on the same network can access it at `http://<YOUR-IP>:3000`.

### Option C: Direct Browser Opening
Simply double-click `index.html` to open it in Chrome, Edge, or Firefox without any server required.

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|---|---|
| <kbd>A</kbd> | Toggle Input A (0 ↔ 1) |
| <kbd>B</kbd> | Toggle Input B (0 ↔ 1) |
| <kbd>1</kbd> – <kbd>7</kbd> | Switch between AND, OR, NOT, NAND, NOR, XOR, XNOR |
| <kbd>Enter</kbd> | Evaluate output |
| <kbd>R</kbd> | Reset all inputs to 0 |

---

## 🛠️ Tech Stack
- Vanilla HTML5 / Semantic Layout
- Vanilla CSS3 (Custom design system, Inter typography, responsive grid)
- Vanilla JavaScript (Reactive state engine, HTML5 Canvas waveform plotting, Web Audio API feedback)
- Zero external dependencies / npm builds required.

---

Developed by **Samarth Jain** for Discrete Structures & Theory of Logic (DSTL).
