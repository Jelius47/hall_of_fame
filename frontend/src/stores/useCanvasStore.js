import { create } from 'zustand';

const useCanvasStore = create((set, get) => ({
  // Canvas state
  tool: 'pen',
  color: '#2c3e50',
  brushSize: 2,
  lines: [],
  shapes: [],
  texts: [],
  emojis: [],
  stickers: [],
  isDrawing: false,

  // Text settings
  fontSize: 24,
  fontFamily: 'Virgil',
  textInput: '',

  // Emoji settings
  selectedEmoji: '',

  // Sticker settings
  selectedSticker: null,

  // Signature settings
  signatures: [],

  // Canvas dimensions
  canvasWidth: 800,
  canvasHeight: 600,

  // History for undo/redo
  history: [],
  historyStep: 0,

  // Set tool
  setTool: (tool) => set({ tool }),

  // Set color
  setColor: (color) => set({ color }),

  // Set brush size
  setBrushSize: (size) => set({ brushSize: size }),

  // Set font size
  setFontSize: (size) => set({ fontSize: size }),

  // Set font family
  setFontFamily: (family) => set({ fontFamily: family }),

  // Set text input
  setTextInput: (text) => set({ textInput: text }),

  // Add line
  addLine: (line) => set((state) => ({
    lines: [...state.lines, line]
  })),

  // Add shape
  addShape: (shape) => set((state) => ({
    shapes: [...state.shapes, shape]
  })),

  // Add text
  addText: (text) => set((state) => ({
    texts: [...state.texts, text]
  })),

  // Add emoji
  addEmoji: (emoji) => set((state) => ({
    emojis: [...state.emojis, emoji]
  })),

  // Add sticker
  addSticker: (sticker) => set((state) => ({
    stickers: [...state.stickers, sticker]
  })),

  // Add signature
  addSignature: (signature) => set((state) => ({
    signatures: [...state.signatures, signature]
  })),

  // Generate signature lines (creates a unique handwritten-style path)
  generateSignature: (name, x, y) => {
    const state = get();
    // Generate a stylized signature path from the name
    const signatureLines = [];
    const baseY = y;
    const baseX = x;
    let currentX = baseX;

    // Create flowing curves for each character
    name.split('').forEach((char, i) => {
      const charWidth = 15 + Math.random() * 10;
      const amplitude = 5 + Math.random() * 8;
      const points = [];

      // Generate wavy line for character
      for (let t = 0; t <= 10; t++) {
        const px = currentX + (charWidth / 10) * t;
        const py = baseY + Math.sin((t / 10) * Math.PI * 2) * amplitude + (Math.random() - 0.5) * 3;
        points.push(px, py);
      }

      signatureLines.push({
        tool: 'pen',
        points: points,
        color: state.color,
        strokeWidth: 2 + Math.random(),
      });

      currentX += charWidth;
    });

    // Add flourish at the end
    const flourishPoints = [];
    for (let t = 0; t <= 15; t++) {
      const px = currentX + t * 3;
      const py = baseY + Math.sin((t / 5) * Math.PI) * 10;
      flourishPoints.push(px, py);
    }

    signatureLines.push({
      tool: 'pen',
      points: flourishPoints,
      color: state.color,
      strokeWidth: 1.5,
    });

    return signatureLines;
  },

  // Clear canvas
  clearCanvas: () => set({
    lines: [],
    shapes: [],
    texts: [],
    emojis: [],
    stickers: [],
    signatures: [],
    history: [],
    historyStep: 0
  }),

  // Save to history
  saveToHistory: () => {
    const state = get();
    const currentState = {
      lines: state.lines,
      shapes: state.shapes,
      texts: state.texts,
      emojis: state.emojis,
      stickers: state.stickers,
      signatures: state.signatures
    };

    set((state) => ({
      history: [...state.history.slice(0, state.historyStep + 1), currentState],
      historyStep: state.historyStep + 1
    }));
  },

  // Undo
  undo: () => {
    const state = get();
    if (state.historyStep > 0) {
      const prevState = state.history[state.historyStep - 1];
      set({
        lines: prevState.lines,
        shapes: prevState.shapes,
        texts: prevState.texts,
        emojis: prevState.emojis,
        stickers: prevState.stickers,
        signatures: prevState.signatures,
        historyStep: state.historyStep - 1
      });
    }
  },

  // Redo
  redo: () => {
    const state = get();
    if (state.historyStep < state.history.length - 1) {
      const nextState = state.history[state.historyStep + 1];
      set({
        lines: nextState.lines,
        shapes: nextState.shapes,
        texts: nextState.texts,
        emojis: nextState.emojis,
        stickers: nextState.stickers,
        signatures: nextState.signatures,
        historyStep: state.historyStep + 1
      });
    }
  },

  // Export canvas data
  getCanvasData: () => {
    const state = get();
    return JSON.stringify({
      lines: state.lines,
      shapes: state.shapes,
      texts: state.texts,
      emojis: state.emojis,
      stickers: state.stickers,
      signatures: state.signatures,
      width: state.canvasWidth,
      height: state.canvasHeight
    });
  },

  // Load canvas data
  loadCanvasData: (data) => {
    try {
      const parsed = JSON.parse(data);
      set({
        lines: parsed.lines || [],
        shapes: parsed.shapes || [],
        texts: parsed.texts || [],
        emojis: parsed.emojis || [],
        stickers: parsed.stickers || [],
        signatures: parsed.signatures || [],
        canvasWidth: parsed.width || 800,
        canvasHeight: parsed.height || 600
      });
    } catch (error) {
      console.error('Failed to load canvas data:', error);
    }
  }
}));

export default useCanvasStore;
