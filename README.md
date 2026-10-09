# ⚡ Logic Gates — Digital Logic Simulator & Timing Graph

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Online%2024%2F7-10b981?style=for-the-badge&logo=googlechrome&logoColor=white)](https://samarthjainsj2005-sketch.github.io/Logic-Gate-project/)
[![GitHub Pages](https://img.shields.io/badge/Hosted%20on-GitHub%20Pages-181717?style=for-the-badge&logo=github&logoColor=white)](https://samarthjainsj2005-sketch.github.io/Logic-Gate-project/)
[![Repository](https://img.shields.io/badge/Repository-GitHub-6366f1?style=for-the-badge&logo=github)](https://github.com/samarthjainsj2005-sketch/Logic-Gate-project)

An interactive, clean digital logic gate simulator and waveform timing graph explorer built for computer science students, teachers, and electrical engineers.

> 🌐 **Live 24/7 Simulator Website:**  
> **[https://samarthjainsj2005-sketch.github.io/Logic-Gate-project/](https://samarthjainsj2005-sketch.github.io/Logic-Gate-project/)**

---

## 🌟 Key Features

### 1. Interactive Logic Gate Simulation
- Covers all 7 essential logic gates:
  - **Basic Gates**: AND, OR, NOT
  - **Universal Gates**: NAND, NOR
  - **Exclusive / Arithmetic Gates**: XOR, XNOR
- **Step 1: Select a Gate & Input Mode** — Clean vector schematic outlines, IEEE standard symbols, and instant toggle between **2-Input Mode (A, B)** and **3-Input Mode (A, B, C)**.
- **Step 2: Set Inputs** — Tactile bit toggles (`0` and `1`), interactive rocker switches, and combination presets (`0,0`, `0,1`, `1,0`, `1,1` or 8-step presets for 3 inputs).
- **Step 3: Result & Deduction** — Instant output evaluation (`0.0V / GND` vs `5.0V / VCC`), step-by-step boolean calculation breakdown, and plain-English logic explanations.

### 2. Digital Waveform Timing Graph (Oscilloscope)
- Real-time square-wave timing diagram plotting **Input A** (Amber), **Input B** (Purple), **Input C** (Cyan), and **Output Y** (Emerald green).
- **▶ Run 4-Step / 8-Step Clock**: Cycles through all binary permutations (`00 → 11` or `000 → 111`) to draw a complete timing diagram automatically.

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
| <kbd>C</kbd> | Toggle Input C (0 ↔ 1) |
| <kbd>M</kbd> | Switch between 2-Input and 3-Input modes |
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

Developed by **Samarth Jain** for Discrete Structure and Theory of Logic (DSTL).
