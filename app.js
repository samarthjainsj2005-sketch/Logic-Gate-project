/**
 * Logic Gates — Digital Logic Simulator & Waveform Engine
 * Interactive Workbench, Gate Differentiation & Real-Time Waveform Graphs
 */

(function () {
  'use strict';

  // --- Audio Feedback Engine ---
  const AudioEngine = {
    ctx: null,
    enabled: true,

    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) this.ctx = new AudioCtx();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    },

    playClick(isHigh) {
      if (!this.enabled) return;
      try {
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(isHigh ? 580 : 360, now);
        osc.frequency.exponentialRampToValueAtTime(isHigh ? 720 : 200, now + 0.04);

        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.045);
      } catch (e) {
        // Audio error suppression
      }
    }
  };

  // --- Logic Gates Knowledge Base ---
  const GATES = [
    {
      id: 'and',
      name: 'AND Gate',
      category: 'Basic Gate',
      categoryType: 'basic',
      inputs: 2,
      formula: 'Y = A · B',
      summary: 'Outputs 1 (HIGH) only when BOTH inputs A and B are 1.',
      eval: (a, b) => (a === 1 && b === 1 ? 1 : 0),
      table: [
        { a: 0, b: 0, y: 0 },
        { a: 0, b: 1, y: 0 },
        { a: 1, b: 0, y: 0 },
        { a: 1, b: 1, y: 1 }
      ],
      note: 'Analogy: Two light switches in series. Current passes only when both are closed.',
      svg: `
        <path d="M 0 10 L 70 10 C 130 10 150 45 150 90 C 150 135 130 170 70 170 L 0 170 Z" class="gate-body-path" />
        <path d="M 150 90 L 170 90" class="schematic-wire" />
        <text x="65" y="96" text-anchor="middle" class="gate-label-text">AND</text>
      `,
      tabSvg: `
        <svg viewBox="0 0 60 30" class="tab-icon-svg" fill="none">
          <path d="M 10 5 L 32 5 C 48 5 52 15 52 15 C 52 15 48 25 32 25 L 10 25 Z" stroke="currentColor" stroke-width="2" />
        </svg>
      `
    },
    {
      id: 'or',
      name: 'OR Gate',
      category: 'Basic Gate',
      categoryType: 'basic',
      inputs: 2,
      formula: 'Y = A + B',
      summary: 'Outputs 1 (HIGH) if AT LEAST ONE input (A or B) is 1.',
      eval: (a, b) => (a === 1 || b === 1 ? 1 : 0),
      table: [
        { a: 0, b: 0, y: 0 },
        { a: 0, b: 1, y: 1 },
        { a: 1, b: 0, y: 1 },
        { a: 1, b: 1, y: 1 }
      ],
      note: 'Analogy: Two light switches in parallel. Current passes if either switch is closed.',
      svg: `
        <path d="M 0 10 Q 30 90 0 170 Q 75 165 150 90 Q 75 15 0 10 Z" class="gate-body-path" />
        <path d="M 150 90 L 170 90" class="schematic-wire" />
        <text x="65" y="96" text-anchor="middle" class="gate-label-text">OR</text>
      `,
      tabSvg: `
        <svg viewBox="0 0 60 30" class="tab-icon-svg" fill="none">
          <path d="M 8 5 Q 20 15 8 25 Q 32 24 52 15 Q 32 6 8 5 Z" stroke="currentColor" stroke-width="2" />
        </svg>
      `
    },
    {
      id: 'not',
      name: 'NOT Gate',
      category: 'Basic Gate',
      categoryType: 'basic',
      inputs: 1,
      formula: 'Y = A̅',
      summary: 'Inverts the digital input: 0 becomes 1, and 1 becomes 0.',
      eval: (a) => (a === 1 ? 0 : 1),
      table: [
        { a: 0, y: 1 },
        { a: 1, y: 0 }
      ],
      note: 'Single-input gate (Inverter). Crucial for generating opposite states and clock oscillators.',
      svg: `
        <polygon points="10,20 135,90 10,160" class="gate-body-path" />
        <circle cx="145" cy="90" r="9" class="gate-bubble" />
        <path d="M 154 90 L 170 90" class="schematic-wire" />
        <text x="60" y="96" text-anchor="middle" class="gate-label-text">NOT</text>
      `,
      tabSvg: `
        <svg viewBox="0 0 60 30" class="tab-icon-svg" fill="none">
          <polygon points="12,6 42,15 12,24" stroke="currentColor" stroke-width="2" />
          <circle cx="48" cy="15" r="3.5" stroke="currentColor" stroke-width="2" fill="none" />
        </svg>
      `
    },
    {
      id: 'nand',
      name: 'NAND Gate',
      category: 'Universal Gate',
      categoryType: 'universal',
      inputs: 2,
      formula: 'Y = (A · B)̅',
      summary: 'Outputs 0 (LOW) only when both inputs are 1. Otherwise outputs 1.',
      eval: (a, b) => (a === 1 && b === 1 ? 0 : 1),
      table: [
        { a: 0, b: 0, y: 1 },
        { a: 0, b: 1, y: 1 },
        { a: 1, b: 0, y: 1 },
        { a: 1, b: 1, y: 0 }
      ],
      note: 'Universal Gate: Any boolean function can be built exclusively using NAND gates.',
      svg: `
        <path d="M 0 10 L 60 10 C 115 10 135 45 135 90 C 135 135 115 170 60 170 L 0 170 Z" class="gate-body-path" />
        <circle cx="145" cy="90" r="9" class="gate-bubble" />
        <path d="M 154 90 L 170 90" class="schematic-wire" />
        <text x="60" y="96" text-anchor="middle" class="gate-label-text">NAND</text>
      `,
      tabSvg: `
        <svg viewBox="0 0 60 30" class="tab-icon-svg" fill="none">
          <path d="M 10 5 L 30 5 C 44 5 46 15 46 15 C 46 15 44 25 30 25 L 10 25 Z" stroke="currentColor" stroke-width="2" />
          <circle cx="51" cy="15" r="3" stroke="currentColor" stroke-width="2" fill="none" />
        </svg>
      `
    },
    {
      id: 'nor',
      name: 'NOR Gate',
      category: 'Universal Gate',
      categoryType: 'universal',
      inputs: 2,
      formula: 'Y = (A + B)̅',
      summary: 'Outputs 1 (HIGH) only when both inputs are 0. Otherwise outputs 0.',
      eval: (a, b) => (a === 0 && b === 0 ? 1 : 0),
      table: [
        { a: 0, b: 0, y: 1 },
        { a: 0, b: 1, y: 0 },
        { a: 1, b: 0, y: 0 },
        { a: 1, b: 1, y: 0 }
      ],
      note: 'Universal Gate: De Morgan’s equivalent is (A + B)̅ = A̅ · B̅.',
      svg: `
        <path d="M 0 10 Q 25 90 0 170 Q 65 165 135 90 Q 65 15 0 10 Z" class="gate-body-path" />
        <circle cx="145" cy="90" r="9" class="gate-bubble" />
        <path d="M 154 90 L 170 90" class="schematic-wire" />
        <text x="55" y="96" text-anchor="middle" class="gate-label-text">NOR</text>
      `,
      tabSvg: `
        <svg viewBox="0 0 60 30" class="tab-icon-svg" fill="none">
          <path d="M 8 5 Q 18 15 8 25 Q 28 24 44 15 Q 28 6 8 5 Z" stroke="currentColor" stroke-width="2" />
          <circle cx="50" cy="15" r="3" stroke="currentColor" stroke-width="2" fill="none" />
        </svg>
      `
    },
    {
      id: 'xor',
      name: 'XOR Gate',
      category: 'Exclusive Gate',
      categoryType: 'exclusive',
      inputs: 2,
      formula: 'Y = A ⊕ B',
      summary: 'Outputs 1 (HIGH) when inputs are DIFFERENT (one is 1, the other is 0).',
      eval: (a, b) => (a ^ b),
      table: [
        { a: 0, b: 0, y: 0 },
        { a: 0, b: 1, y: 1 },
        { a: 1, b: 0, y: 1 },
        { a: 1, b: 1, y: 0 }
      ],
      note: 'Arithmetic building block: Generates the Sum bit in binary Half Adders.',
      svg: `
        <path d="M -12 10 Q 18 90 -12 170" class="schematic-wire" fill="none" stroke-width="3" />
        <path d="M 5 10 Q 35 90 5 170 Q 80 165 150 90 Q 80 15 5 10 Z" class="gate-body-path" />
        <path d="M 150 90 L 170 90" class="schematic-wire" />
        <text x="68" y="96" text-anchor="middle" class="gate-label-text">XOR</text>
      `,
      tabSvg: `
        <svg viewBox="0 0 60 30" class="tab-icon-svg" fill="none">
          <path d="M 6 5 Q 14 15 6 25" stroke="currentColor" stroke-width="2" />
          <path d="M 12 5 Q 20 15 12 25 Q 34 24 52 15 Q 34 6 12 5 Z" stroke="currentColor" stroke-width="2" />
        </svg>
      `
    },
    {
      id: 'xnor',
      name: 'XNOR Gate',
      category: 'Exclusive Gate',
      categoryType: 'exclusive',
      inputs: 2,
      formula: 'Y = (A ⊕ B)̅',
      summary: 'Outputs 1 (HIGH) when inputs are IDENTICAL (both 0 or both 1).',
      eval: (a, b) => (a === b ? 1 : 0),
      table: [
        { a: 0, b: 0, y: 1 },
        { a: 0, b: 1, y: 0 },
        { a: 1, b: 0, y: 0 },
        { a: 1, b: 1, y: 1 }
      ],
      note: 'Equivalence comparator: Checks whether two digital bits are equal.',
      svg: `
        <path d="M -12 10 Q 18 90 -12 170" class="schematic-wire" fill="none" stroke-width="3" />
        <path d="M 5 10 Q 35 90 5 170 Q 75 165 135 90 Q 75 15 5 10 Z" class="gate-body-path" />
        <circle cx="145" cy="90" r="9" class="gate-bubble" />
        <path d="M 154 90 L 170 90" class="schematic-wire" />
        <text x="65" y="96" text-anchor="middle" class="gate-label-text">XNOR</text>
      `,
      tabSvg: `
        <svg viewBox="0 0 60 30" class="tab-icon-svg" fill="none">
          <path d="M 6 5 Q 14 15 6 25" stroke="currentColor" stroke-width="2" />
          <path d="M 12 5 Q 20 15 12 25 Q 30 24 44 15 Q 30 6 12 5 Z" stroke="currentColor" stroke-width="2" />
          <circle cx="50" cy="15" r="3" stroke="currentColor" stroke-width="2" fill="none" />
        </svg>
      `
    }
  ];

  // --- Natural Plain-English Explanations ---
  function getExplanation(gateId, a, b, y) {
    switch (gateId) {
      case 'and':
        if (a === 1 && b === 1) {
          return 'Both Input A and Input B are 1 (HIGH). Because the AND condition requires all inputs to be 1, the circuit closes and produces 1.';
        } else if (a === 0 && b === 0) {
          return 'Both inputs are 0 (LOW). Since neither input is active, the AND gate produces an output of 0.';
        } else {
          const zero = a === 0 ? 'A' : 'B';
          return `Input ${zero} is 0 (LOW). The AND gate requires BOTH inputs to be 1, so the output is 0.`;
        }
      case 'or':
        if (a === 1 || b === 1) {
          const which = (a === 1 && b === 1) ? 'both inputs are 1' : (a === 1 ? 'Input A is 1' : 'Input B is 1');
          return `Because ${which}, the OR condition ("at least one input is active") is satisfied, producing an output of 1.`;
        } else {
          return 'Both inputs are 0. The OR gate produces 0 only when all inputs are 0.';
        }
      case 'not':
        if (a === 1) {
          return 'Input A is 1 (HIGH). The NOT gate inverts the logic level, pulling the output down to 0.';
        } else {
          return 'Input A is 0 (LOW). The NOT gate inverts the logic level, pulling the output up to 1.';
        }
      case 'nand':
        if (a === 1 && b === 1) {
          return 'Both inputs are 1, making AND equal to 1. The NAND gate inverts this result to 0.';
        } else {
          return 'At least one input is 0, so the AND condition is not met (AND = 0). The inverted NAND output is 1.';
        }
      case 'nor':
        if (a === 0 && b === 0) {
          return 'Both inputs are 0, making OR equal to 0. The NOR gate inverts this result to 1.';
        } else {
          return 'At least one input is 1, making OR equal to 1. The inverted NOR output is 0.';
        }
      case 'xor':
        if (a !== b) {
          return `Inputs differ (A = ${a}, B = ${b}). The Exclusive OR (XOR) gate produces 1 when inputs are unequal.`;
        } else {
          return `Inputs are identical (both are ${a}). The XOR gate produces 0 when inputs are equal.`;
        }
      case 'xnor':
        if (a === b) {
          return `Inputs are identical (both are ${a}). The XNOR (Equivalence) gate produces 1 when inputs match.`;
        } else {
          return `Inputs differ (A = ${a}, B = ${b}). The XNOR gate produces 0 when inputs do not match.`;
        }
      default:
        return `Output is ${y}.`;
    }
  }

  function getCalculationString(gate, a, b, y) {
    if (gate.inputs === 1) {
      return `${a}̅ = ${y}`;
    }
    const symbolMap = { and: '·', or: '+', nand: '·', nor: '+', xor: '⊕', xnor: '⊙' };
    const s = symbolMap[gate.id] || '·';
    if (gate.id === 'nand') return `(${a} · ${b})̅ = ${y}`;
    if (gate.id === 'nor') return `(${a} + ${b})̅ = ${y}`;
    if (gate.id === 'xnor') return `(${a} ⊕ ${b})̅ = ${y}`;
    return `${a} ${s} ${b} = ${y}`;
  }

  // --- App State ---
  const state = {
    currentView: 'simulator',
    gateId: 'and',
    inputA: 0,
    inputB: 0,
    liveUpdate: true,
    clockRunning: false,
    clockTimer: null,
    waveformSamples: [],

    // Multi-Gate Tab State
    multiA: 0,
    multiB: 0
  };

  // --- DOM Elements ---
  const DOM = {
    // Top View Switchers
    tabSimulator: document.getElementById('tabSimulator'),
    tabDifferentiation: document.getElementById('tabDifferentiation'),
    paneSimulator: document.getElementById('paneSimulator'),
    paneDifferentiation: document.getElementById('paneDifferentiation'),

    // Simulator Elements
    gateGrid: document.getElementById('gateGrid'),
    gateTypeBadge: document.getElementById('gateTypeBadge'),
    gateHeading: document.getElementById('gateHeading'),
    gateSummary: document.getElementById('gateSummary'),
    gateEquationCode: document.getElementById('gateEquationCode'),

    // Input Terminal Blocks
    terminalBlockA: document.getElementById('terminalBlockA'),
    terminalBlockB: document.getElementById('terminalBlockB'),
    badgeInputA: document.getElementById('badgeInputA'),
    badgeInputB: document.getElementById('badgeInputB'),
    rockerSwitchA: document.getElementById('rockerSwitchA'),
    rockerSwitchB: document.getElementById('rockerSwitchB'),
    singleInputNotice: document.getElementById('singleInputNotice'),
    autoUpdateCheckbox: document.getElementById('autoUpdateCheckbox'),

    // Schematic Wires & Nodes
    wireA: document.getElementById('wireA'),
    wireB: document.getElementById('wireB'),
    nodeA: document.getElementById('nodeA'),
    nodeB: document.getElementById('nodeB'),
    wireTextA: document.getElementById('wireTextA'),
    wireTextB: document.getElementById('wireTextB'),
    wireOut: document.getElementById('wireOut'),
    nodeOut: document.getElementById('nodeOut'),
    wireTextOut: document.getElementById('wireTextOut'),
    schematicGateContainer: document.getElementById('schematicGateContainer'),

    // Output Indicators
    outputIndicatorBox: document.getElementById('outputIndicatorBox'),
    outputValLarge: document.getElementById('outputValLarge'),
    outputStatusLabel: document.getElementById('outputStatusLabel'),

    // Waveform Graph Elements
    waveformCanvas: document.getElementById('waveformCanvas'),
    runClockCycleBtn: document.getElementById('runClockCycleBtn'),
    clearWaveformBtn: document.getElementById('clearWaveformBtn'),
    legendB: document.getElementById('legendB'),

    // Presets & Buttons
    presetPills: document.getElementById('presetPills'),
    manualComputeBtn: document.getElementById('manualComputeBtn'),
    resetBtn: document.getElementById('resetBtn'),

    // Result & Explanation Card
    resultPillLarge: document.getElementById('resultPillLarge'),
    resDigit: document.getElementById('resDigit'),
    resStateText: document.getElementById('resStateText'),
    resVoltageText: document.getElementById('resVoltageText'),
    breakdownCode: document.getElementById('breakdownCode'),
    explanationParagraph: document.getElementById('explanationParagraph'),

    // Truth Table
    thB: document.getElementById('thB'),
    truthTableBody: document.getElementById('truthTableBody'),
    gateNotesBody: document.getElementById('gateNotesBody'),

    // Differentiation Tab Elements
    multiOutputGrid: document.getElementById('multiOutputGrid'),
    comparativeBarCanvas: document.getElementById('comparativeBarCanvas'),
    btnPreset00: document.getElementById('btnPreset00'),
    btnPreset01: document.getElementById('btnPreset01'),
    btnPreset10: document.getElementById('btnPreset10'),
    btnPreset11: document.getElementById('btnPreset11'),

    // Modal & Sound
    soundToggleBtn: document.getElementById('soundToggleBtn'),
    guideModalBtn: document.getElementById('guideModalBtn'),
    helpModal: document.getElementById('helpModal'),
    closeHelpModalBtn: document.getElementById('closeHelpModalBtn'),
    modalDismissBtn: document.getElementById('modalDismissBtn')
  };

  let waveCtx = DOM.waveformCanvas ? DOM.waveformCanvas.getContext('2d') : null;
  let compCtx = DOM.comparativeBarCanvas ? DOM.comparativeBarCanvas.getContext('2d') : null;

  function getActiveGate() {
    return GATES.find(g => g.id === state.gateId) || GATES[0];
  }

  // --- Initial Setup ---
  function init() {
    initWaveformHistory();
    renderGateTabs();
    setupEventListeners();
    selectGate('and');
    renderMultiOutputGrid();
    updateComparativeGraph();
  }

  // Switch View Panes
  function switchView(viewName) {
    state.currentView = viewName;
    DOM.tabSimulator.classList.toggle('active', viewName === 'simulator');
    DOM.tabDifferentiation.classList.toggle('active', viewName === 'differentiation');
    DOM.paneSimulator.classList.toggle('active', viewName === 'simulator');
    DOM.paneDifferentiation.classList.toggle('active', viewName === 'differentiation');

    if (viewName === 'differentiation') {
      updateMultiGateOutputs();
      updateComparativeGraph();
    } else {
      renderWaveformGraph();
    }
  }

  // Render Step 1 Gate Selection Tabs
  function renderGateTabs() {
    DOM.gateGrid.innerHTML = '';
    GATES.forEach(gate => {
      const tab = document.createElement('div');
      tab.className = `gate-card-tab ${gate.id === state.gateId ? 'active' : ''}`;
      tab.dataset.gate = gate.id;
      tab.setAttribute('role', 'tab');
      tab.innerHTML = `
        ${gate.tabSvg}
        <span class="tab-name">${gate.name.replace(' Gate', '')}</span>
        <span class="tab-formula">${gate.formula.replace('Y = ', '')}</span>
      `;
      tab.addEventListener('click', () => {
        selectGate(gate.id);
        AudioEngine.playClick(true);
      });
      DOM.gateGrid.appendChild(tab);
    });
  }

  // Switch Selected Gate
  function selectGate(gateId) {
    const gate = GATES.find(g => g.id === gateId);
    if (!gate) return;

    state.gateId = gate.id;

    // Update active tab highlight
    const tabs = DOM.gateGrid.querySelectorAll('.gate-card-tab');
    tabs.forEach(t => t.classList.toggle('active', t.dataset.gate === gateId));

    // Update Banner
    DOM.gateTypeBadge.textContent = gate.category;
    DOM.gateHeading.textContent = gate.name;
    DOM.gateSummary.textContent = gate.summary;
    DOM.gateEquationCode.textContent = gate.formula;
    DOM.gateNotesBody.textContent = gate.note;

    // Inject schematic SVG path
    DOM.schematicGateContainer.innerHTML = gate.svg;

    // Adjust for single-input NOT gate
    const isSingle = gate.inputs === 1;
    if (isSingle) {
      DOM.terminalBlockB.classList.add('hidden');
      DOM.singleInputNotice.classList.remove('hidden');
      DOM.legendB.style.display = 'none';
      DOM.thB.style.display = 'none';

      // Route Wire A cleanly straight into center of NOT gate
      DOM.wireA.setAttribute('d', 'M 10 100 L 150 100');
      DOM.nodeA.setAttribute('cy', '100');
      DOM.wireTextA.setAttribute('y', '90');
      DOM.wireB.style.display = 'none';
      DOM.nodeB.style.display = 'none';
      DOM.wireTextB.style.display = 'none';
    } else {
      DOM.terminalBlockB.classList.remove('hidden');
      DOM.singleInputNotice.classList.add('hidden');
      DOM.legendB.style.display = 'inline-flex';
      DOM.thB.style.display = 'table-cell';

      DOM.wireA.setAttribute('d', 'M 10 50 L 140 50');
      DOM.nodeA.setAttribute('cy', '50');
      DOM.wireTextA.setAttribute('y', '40');
      DOM.wireB.style.display = 'block';
      DOM.nodeB.style.display = 'block';
      DOM.wireTextB.style.display = 'block';
    }

    renderPresetButtons(gate);
    renderTruthTable(gate);
    evaluateCircuit();
  }

  // Render Preset Combination Buttons
  function renderPresetButtons(gate) {
    DOM.presetPills.innerHTML = '';
    if (gate.inputs === 1) {
      const presets = [
        { label: 'A = 0', a: 0 },
        { label: 'A = 1', a: 1 }
      ];
      presets.forEach(p => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `preset-pill ${state.inputA === p.a ? 'active' : ''}`;
        btn.textContent = p.label;
        btn.addEventListener('click', () => {
          state.inputA = p.a;
          AudioEngine.playClick(p.a === 1);
          syncInputControls();
          evaluateCircuit();
        });
        DOM.presetPills.appendChild(btn);
      });
    } else {
      const presets = [
        { label: 'A=0, B=0', a: 0, b: 0 },
        { label: 'A=0, B=1', a: 0, b: 1 },
        { label: 'A=1, B=0', a: 1, b: 0 },
        { label: 'A=1, B=1', a: 1, b: 1 }
      ];
      presets.forEach(p => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `preset-pill ${state.inputA === p.a && state.inputB === p.b ? 'active' : ''}`;
        btn.textContent = p.label;
        btn.addEventListener('click', () => {
          state.inputA = p.a;
          state.inputB = p.b;
          AudioEngine.playClick(p.a || p.b);
          syncInputControls();
          evaluateCircuit();
        });
        DOM.presetPills.appendChild(btn);
      });
    }
  }

  // Sync Input Buttons and Terminal States
  function syncInputControls() {
    // Input A
    const btnsA = DOM.terminalBlockA.querySelectorAll('.bit-btn');
    btnsA.forEach(b => b.classList.toggle('active', parseInt(b.dataset.bit, 10) === state.inputA));
    DOM.terminalBlockA.classList.toggle('is-high', state.inputA === 1);
    DOM.badgeInputA.textContent = state.inputA ? '1 (HIGH)' : '0 (LOW)';

    // Input B
    const btnsB = DOM.terminalBlockB.querySelectorAll('.bit-btn');
    btnsB.forEach(b => b.classList.toggle('active', parseInt(b.dataset.bit, 10) === state.inputB));
    DOM.terminalBlockB.classList.toggle('is-high', state.inputB === 1);
    DOM.badgeInputB.textContent = state.inputB ? '1 (HIGH)' : '0 (LOW)';

    // Preset pills highlight
    const gate = getActiveGate();
    const pills = DOM.presetPills.querySelectorAll('.preset-pill');
    pills.forEach(p => {
      if (gate.inputs === 1) {
        p.classList.toggle('active', p.textContent.includes(String(state.inputA)));
      } else {
        p.classList.toggle('active', p.textContent === `A=${state.inputA}, B=${state.inputB}`);
      }
    });
  }

  // Calculate and Update Circuit Schematic, Output & Graph
  function evaluateCircuit() {
    const gate = getActiveGate();
    const a = state.inputA;
    const b = gate.inputs === 1 ? 0 : state.inputB;
    const output = gate.eval(a, b);

    syncInputControls();

    // 1. Update Wires & Schematic Nodes
    DOM.wireA.classList.toggle('is-high', a === 1);
    DOM.nodeA.classList.toggle('is-high', a === 1);
    DOM.wireTextA.classList.toggle('is-high', a === 1);
    DOM.wireTextA.textContent = `A = ${a}`;

    if (gate.inputs === 2) {
      DOM.wireB.classList.toggle('is-high', b === 1);
      DOM.nodeB.classList.toggle('is-high', b === 1);
      DOM.wireTextB.classList.toggle('is-high', b === 1);
      DOM.wireTextB.textContent = `B = ${b}`;
    }

    DOM.wireOut.classList.toggle('is-high', output === 1);
    DOM.nodeOut.classList.toggle('is-high', output === 1);
    DOM.wireTextOut.classList.toggle('is-high', output === 1);
    DOM.wireTextOut.textContent = `Y = ${output}`;

    // Gate path highlight
    const gateBody = DOM.schematicGateContainer.querySelector('.gate-body-path');
    const gateBubble = DOM.schematicGateContainer.querySelector('.gate-bubble');
    if (gateBody) gateBody.classList.toggle('is-high', output === 1);
    if (gateBubble) gateBubble.classList.toggle('is-high', output === 1);

    // 2. Output Indicator Box (Right of schematic)
    DOM.outputIndicatorBox.classList.toggle('is-high', output === 1);
    DOM.outputValLarge.textContent = output;
    DOM.outputStatusLabel.textContent = output ? 'HIGH (5.0 V)' : 'LOW (0.0 V)';

    // 3. Step 3 Result & Explanation Card
    DOM.resultPillLarge.classList.toggle('is-high', output === 1);
    DOM.resDigit.textContent = output;
    DOM.resStateText.textContent = output ? 'HIGH (1)' : 'LOW (0)';
    DOM.resVoltageText.textContent = output ? '5.0 Volts (VCC)' : '0.0 Volts (GND)';

    DOM.breakdownCode.textContent = getCalculationString(gate, a, b, output);
    DOM.explanationParagraph.textContent = getExplanation(gate.id, a, b, output);

    // 4. Highlight Truth Table row
    highlightTruthTableRow(a, b);

    // 5. Push point to Waveform Graph history & redraw graph
    recordWaveformSample(a, b, output);
  }

  // --- Waveform Timing Graph Engine ---
  function initWaveformHistory() {
    state.waveformSamples = [];
    const gate = getActiveGate();
    const a = state.inputA;
    const b = gate.inputs === 1 ? 0 : state.inputB;
    const y = gate.eval(a, b);
    for (let i = 0; i < 24; i++) {
      state.waveformSamples.push({ a, b, y });
    }
  }

  function recordWaveformSample(a, b, y) {
    state.waveformSamples.push({ a, b, y });
    if (state.waveformSamples.length > 36) {
      state.waveformSamples.shift();
    }
    renderWaveformGraph();
  }

  function renderWaveformGraph() {
    if (!waveCtx || !DOM.waveformCanvas) return;
    const w = DOM.waveformCanvas.width;
    const h = DOM.waveformCanvas.height;
    const gate = getActiveGate();
    const isSingle = gate.inputs === 1;

    waveCtx.clearRect(0, 0, w, h);

    // Background horizontal rail lines (0V and 5V reference guides)
    waveCtx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    waveCtx.lineWidth = 1;

    const tracks = isSingle
      ? [
          { name: 'A', highY: 28, lowY: 62, color: '#f59e0b' },
          { name: 'Y', highY: 105, lowY: 145, color: '#10b981' }
        ]
      : [
          { name: 'A', highY: 22, lowY: 48, color: '#f59e0b' },
          { name: 'B', highY: 72, lowY: 98, color: '#a855f7' },
          { name: 'Y', highY: 124, lowY: 154, color: '#10b981' }
        ];

    tracks.forEach(tr => {
      // Dotted high rail (5V)
      waveCtx.setLineDash([3, 4]);
      waveCtx.beginPath();
      waveCtx.moveTo(40, tr.highY);
      waveCtx.lineTo(w - 10, tr.highY);
      waveCtx.stroke();

      // Dotted low rail (0V)
      waveCtx.beginPath();
      waveCtx.moveTo(40, tr.lowY);
      waveCtx.lineTo(w - 10, tr.lowY);
      waveCtx.stroke();
      waveCtx.setLineDash([]);

      // Track label (A, B, Y)
      waveCtx.fillStyle = tr.color;
      waveCtx.font = '600 11px Inter, sans-serif';
      waveCtx.fillText(`${tr.name}:`, 12, (tr.highY + tr.lowY) / 2 + 4);
    });

    const samples = state.waveformSamples;
    if (samples.length < 2) return;

    const startX = 40;
    const drawWidth = w - 50;
    const stepX = drawWidth / (samples.length - 1);

    // Draw square wave digital traces
    tracks.forEach(tr => {
      waveCtx.beginPath();
      waveCtx.strokeStyle = tr.color;
      waveCtx.lineWidth = 2.5;
      waveCtx.lineCap = 'round';
      waveCtx.lineJoin = 'miter';

      let prevVal = samples[0][tr.name.toLowerCase()];
      let prevY = prevVal === 1 ? tr.highY : tr.lowY;
      waveCtx.moveTo(startX, prevY);

      for (let i = 1; i < samples.length; i++) {
        const curVal = samples[i][tr.name.toLowerCase()];
        const curY = curVal === 1 ? tr.highY : tr.lowY;
        const curX = startX + i * stepX;

        if (curVal !== prevVal) {
          waveCtx.lineTo(curX, prevY);
          waveCtx.lineTo(curX, curY);
        } else {
          waveCtx.lineTo(curX, curY);
        }
        prevVal = curVal;
        prevY = curY;
      }
      waveCtx.stroke();
    });
  }

  // Simulate 4-step Clock Sequence (00 -> 01 -> 10 -> 11)
  function runClockCycleSequence() {
    if (state.clockRunning) return;
    state.clockRunning = true;
    DOM.runClockCycleBtn.textContent = '⏹ Running Clock...';

    const gate = getActiveGate();
    const seq = gate.inputs === 1
      ? [{ a: 0, b: 0 }, { a: 1, b: 0 }, { a: 0, b: 0 }, { a: 1, b: 0 }]
      : [{ a: 0, b: 0 }, { a: 0, b: 1 }, { a: 1, b: 0 }, { a: 1, b: 1 }];

    let step = 0;
    state.clockTimer = setInterval(() => {
      if (step >= seq.length) {
        clearInterval(state.clockTimer);
        state.clockRunning = false;
        DOM.runClockCycleBtn.textContent = '▶ Run 4-Step Clock';
        return;
      }
      state.inputA = seq[step].a;
      state.inputB = seq[step].b;
      AudioEngine.playClick(state.inputA || state.inputB);
      evaluateCircuit();
      step++;
    }, 700);
  }

  // --- Differentiation Tab Multi-Gate Engine ---
  function renderMultiOutputGrid() {
    DOM.multiOutputGrid.innerHTML = '';
    GATES.forEach(gate => {
      const card = document.createElement('div');
      card.className = 'multi-gate-card';
      card.id = `multiCard_${gate.id}`;
      card.innerHTML = `
        <span class="mg-name">${gate.name.replace(' Gate', '')}</span>
        <span class="mg-val" id="multiVal_${gate.id}">0</span>
        <span class="mg-state" id="multiState_${gate.id}">LOW (0V)</span>
      `;
      DOM.multiOutputGrid.appendChild(card);
    });
    updateMultiGateOutputs();
  }

  function setMultiInputs(a, b) {
    state.multiA = a;
    state.multiB = b;

    // Update bit buttons in differentiation tab
    document.querySelectorAll('.multi-bit-btn').forEach(btn => {
      const term = btn.dataset.terminal;
      const bit = parseInt(btn.dataset.bit, 10);
      const isMatch = term === 'a' ? bit === a : bit === b;
      btn.classList.toggle('active', isMatch);
    });

    // Update preset pills
    DOM.btnPreset00.classList.toggle('active', a === 0 && b === 0);
    DOM.btnPreset01.classList.toggle('active', a === 0 && b === 1);
    DOM.btnPreset10.classList.toggle('active', a === 1 && b === 0);
    DOM.btnPreset11.classList.toggle('active', a === 1 && b === 1);

    updateMultiGateOutputs();
    updateComparativeGraph();
  }

  function updateMultiGateOutputs() {
    const a = state.multiA;
    const b = state.multiB;

    GATES.forEach(gate => {
      const card = document.getElementById(`multiCard_${gate.id}`);
      const valEl = document.getElementById(`multiVal_${gate.id}`);
      const stateEl = document.getElementById(`multiState_${gate.id}`);
      if (!card || !valEl || !stateEl) return;

      const y = gate.inputs === 1 ? gate.eval(a) : gate.eval(a, b);
      card.classList.toggle('is-high', y === 1);
      valEl.textContent = y;
      stateEl.textContent = y ? 'HIGH (5V)' : 'LOW (0V)';
    });
  }

  // Comparative Output Logic Level Graph (5V vs 0V)
  function updateComparativeGraph() {
    if (!compCtx || !DOM.comparativeBarCanvas) return;
    const w = DOM.comparativeBarCanvas.width;
    const h = DOM.comparativeBarCanvas.height;

    compCtx.clearRect(0, 0, w, h);

    // Reference rail guide
    compCtx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    compCtx.lineWidth = 1;
    compCtx.setLineDash([3, 4]);

    const highY = 40;  // 5V level
    const lowY = 135;  // 0V level

    compCtx.beginPath();
    compCtx.moveTo(60, highY);
    compCtx.lineTo(w - 20, highY);
    compCtx.stroke();

    compCtx.beginPath();
    compCtx.moveTo(60, lowY);
    compCtx.lineTo(w - 20, lowY);
    compCtx.stroke();
    compCtx.setLineDash([]);

    // Voltage labels on axis
    compCtx.fillStyle = '#10b981';
    compCtx.font = '600 11px JetBrains Mono, monospace';
    compCtx.fillText('+5.0V (HIGH)', 10, highY + 4);

    compCtx.fillStyle = '#64748b';
    compCtx.fillText(' 0.0V (LOW)', 10, lowY + 4);

    const a = state.multiA;
    const b = state.multiB;
    const colWidth = (w - 90) / GATES.length;

    GATES.forEach((gate, idx) => {
      const y = gate.inputs === 1 ? gate.eval(a) : gate.eval(a, b);
      const x = 70 + idx * colWidth;
      const barY = y === 1 ? highY : lowY;

      // Color coding per category
      const color = gate.categoryType === 'universal'
        ? '#10b981'
        : (gate.categoryType === 'exclusive' ? '#a855f7' : '#3b82f6');

      // Logic level pulse bar / pillar
      compCtx.fillStyle = y === 1 ? color : '#334155';
      compCtx.beginPath();
      compCtx.roundRect(x + 10, barY, colWidth - 20, lowY - barY + 4, [4, 4, 0, 0]);
      compCtx.fill();

      // Top pulse value indicator
      compCtx.fillStyle = y === 1 ? '#ffffff' : '#64748b';
      compCtx.font = '700 13px JetBrains Mono, monospace';
      compCtx.textAlign = 'center';
      compCtx.fillText(String(y), x + colWidth / 2, barY - 8);

      // Gate label under column
      compCtx.fillStyle = '#cbd5e1';
      compCtx.font = '600 11px Inter, sans-serif';
      compCtx.fillText(gate.name.replace(' Gate', ''), x + colWidth / 2, lowY + 24);
    });

    compCtx.textAlign = 'left';
  }

  // --- Truth Table ---
  function renderTruthTable(gate) {
    DOM.truthTableBody.innerHTML = '';
    const isSingle = gate.inputs === 1;

    gate.table.forEach(row => {
      const tr = document.createElement('tr');
      tr.dataset.a = row.a;
      tr.dataset.b = isSingle ? 0 : row.b;

      if (isSingle) {
        tr.innerHTML = `
          <td><span class="row-badge ${row.a ? 'is-1' : 'is-0'}">${row.a}</span></td>
          <td><span class="row-badge ${row.y ? 'is-1' : 'is-0'}">${row.y}</span></td>
        `;
      } else {
        tr.innerHTML = `
          <td><span class="row-badge ${row.a ? 'is-1' : 'is-0'}">${row.a}</span></td>
          <td><span class="row-badge ${row.b ? 'is-1' : 'is-0'}">${row.b}</span></td>
          <td><span class="row-badge ${row.y ? 'is-1' : 'is-0'}">${row.y}</span></td>
        `;
      }

      // Clicking any row applies that combination
      tr.addEventListener('click', () => {
        state.inputA = row.a;
        if (!isSingle) state.inputB = row.b;
        AudioEngine.playClick(true);
        evaluateCircuit();
      });

      DOM.truthTableBody.appendChild(tr);
    });

    highlightTruthTableRow(state.inputA, state.inputB);
  }

  function highlightTruthTableRow(a, b) {
    const gate = getActiveGate();
    const rows = DOM.truthTableBody.querySelectorAll('tr');
    rows.forEach(tr => {
      const rowA = parseInt(tr.dataset.a, 10);
      const rowB = parseInt(tr.dataset.b, 10);
      const isMatch = gate.inputs === 1 ? rowA === a : (rowA === a && rowB === b);
      tr.classList.toggle('row-active', isMatch);
    });
  }

  // --- Event Listeners Setup ---
  function setupEventListeners() {
    // Top View Switchers
    DOM.tabSimulator.addEventListener('click', () => switchView('simulator'));
    DOM.tabDifferentiation.addEventListener('click', () => switchView('differentiation'));

    // Input A Bit Buttons (0 and 1)
    DOM.terminalBlockA.querySelectorAll('.bit-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        state.inputA = parseInt(btn.dataset.bit, 10);
        AudioEngine.playClick(state.inputA === 1);
        if (state.liveUpdate) evaluateCircuit();
        else syncInputControls();
      });
    });

    // Input B Bit Buttons (0 and 1)
    DOM.terminalBlockB.querySelectorAll('.bit-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        state.inputB = parseInt(btn.dataset.bit, 10);
        AudioEngine.playClick(state.inputB === 1);
        if (state.liveUpdate) evaluateCircuit();
        else syncInputControls();
      });
    });

    // Rocker Switch toggles
    DOM.rockerSwitchA.addEventListener('click', () => {
      state.inputA = state.inputA ? 0 : 1;
      AudioEngine.playClick(state.inputA === 1);
      if (state.liveUpdate) evaluateCircuit();
      else syncInputControls();
    });

    DOM.rockerSwitchB.addEventListener('click', () => {
      const gate = getActiveGate();
      if (gate.inputs === 1) return;
      state.inputB = state.inputB ? 0 : 1;
      AudioEngine.playClick(state.inputB === 1);
      if (state.liveUpdate) evaluateCircuit();
      else syncInputControls();
    });

    // Manual Evaluate Output Button
    DOM.manualComputeBtn.addEventListener('click', () => {
      evaluateCircuit();
      AudioEngine.playClick(true);
    });

    // Reset Button
    DOM.resetBtn.addEventListener('click', () => {
      state.inputA = 0;
      state.inputB = 0;
      AudioEngine.playClick(false);
      evaluateCircuit();
    });

    // Live update toggle
    DOM.autoUpdateCheckbox.addEventListener('change', (e) => {
      state.liveUpdate = e.target.checked;
      if (state.liveUpdate) evaluateCircuit();
    });

    // Waveform Graph Controls
    DOM.runClockCycleBtn.addEventListener('click', runClockCycleSequence);
    DOM.clearWaveformBtn.addEventListener('click', () => {
      initWaveformHistory();
      renderWaveformGraph();
    });

    // Multi-Gate Differentiation Tab Controls
    document.querySelectorAll('.multi-bit-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const term = btn.dataset.terminal;
        const bit = parseInt(btn.dataset.bit, 10);
        if (term === 'a') setMultiInputs(bit, state.multiB);
        else setMultiInputs(state.multiA, bit);
        AudioEngine.playClick(bit === 1);
      });
    });

    DOM.btnPreset00.addEventListener('click', () => setMultiInputs(0, 0));
    DOM.btnPreset01.addEventListener('click', () => setMultiInputs(0, 1));
    DOM.btnPreset10.addEventListener('click', () => setMultiInputs(1, 0));
    DOM.btnPreset11.addEventListener('click', () => setMultiInputs(1, 1));

    // Sound toggle
    DOM.soundToggleBtn.addEventListener('click', () => {
      AudioEngine.enabled = !AudioEngine.enabled;
      DOM.soundToggleBtn.querySelector('.btn-text').textContent = AudioEngine.enabled ? 'Sound: On' : 'Sound: Off';
      DOM.soundToggleBtn.querySelector('.btn-icon-sound').textContent = AudioEngine.enabled ? '🔊' : '🔇';
    });

    // Modal events
    DOM.guideModalBtn.addEventListener('click', () => {
      DOM.helpModal.classList.remove('hidden');
    });

    DOM.closeHelpModalBtn.addEventListener('click', () => {
      DOM.helpModal.classList.add('hidden');
    });

    DOM.modalDismissBtn.addEventListener('click', () => {
      DOM.helpModal.classList.add('hidden');
    });

    DOM.helpModal.addEventListener('click', (e) => {
      if (e.target === DOM.helpModal) DOM.helpModal.classList.add('hidden');
    });

    // Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      const key = e.key.toLowerCase();

      if (key === 'a') {
        state.inputA = state.inputA ? 0 : 1;
        AudioEngine.playClick(state.inputA === 1);
        if (state.liveUpdate) evaluateCircuit();
        else syncInputControls();
      } else if (key === 'b') {
        const gate = getActiveGate();
        if (gate.inputs === 2) {
          state.inputB = state.inputB ? 0 : 1;
          AudioEngine.playClick(state.inputB === 1);
          if (state.liveUpdate) evaluateCircuit();
          else syncInputControls();
        }
      } else if (key === 'enter') {
        e.preventDefault();
        evaluateCircuit();
        AudioEngine.playClick(true);
      } else if (key === 'r') {
        state.inputA = 0;
        state.inputB = 0;
        AudioEngine.playClick(false);
        evaluateCircuit();
      } else if (['1', '2', '3', '4', '5', '6', '7'].includes(key)) {
        const idx = parseInt(key, 10) - 1;
        if (GATES[idx]) {
          selectGate(GATES[idx].id);
          AudioEngine.playClick(true);
        }
      } else if (key === 'escape') {
        DOM.helpModal.classList.add('hidden');
      }
    });

    window.addEventListener('resize', () => {
      renderWaveformGraph();
      updateComparativeGraph();
    });
  }

  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
