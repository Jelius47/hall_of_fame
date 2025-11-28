import React, { useState } from 'react';
import styled from 'styled-components';
import { Pen, Eraser, Circle, Square, Type, Smile, Undo2, Redo2, Trash2, Download, Sticker, PenLine } from 'lucide-react';
import useCanvasStore from '../../stores/useCanvasStore';

const ToolbarContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(44, 62, 80, 0.1);
  flex-wrap: wrap;
  margin-bottom: 1rem;
`;

const ToolGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  padding-right: 1rem;
  border-right: 2px solid var(--border);

  &:last-child {
    border-right: none;
    padding-right: 0;
  }
`;

const ToolButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: ${props => props.$active ? 'var(--gold)' : 'transparent'};
  color: ${props => props.$active ? 'white' : 'var(--ink)'};
  border: 2px solid ${props => props.$active ? 'var(--gold)' : 'var(--border)'};
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.$active ? 'var(--gold)' : 'rgba(212, 175, 55, 0.1)'};
    border-color: var(--gold);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ColorPicker = styled.input`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: 2px solid var(--border);
  cursor: pointer;
  transition: border-color 0.3s ease;

  &:hover {
    border-color: var(--gold);
  }
`;

const SizeSlider = styled.input`
  width: 100px;
  cursor: pointer;
`;

const Label = styled.label`
  font-family: var(--font-ui);
  font-size: 0.875rem;
  color: var(--ink);
  font-weight: 500;
`;

const Select = styled.select`
  padding: 0.5rem;
  border-radius: 6px;
  border: 2px solid var(--border);
  font-family: var(--font-ui);
  font-size: 0.875rem;
  color: var(--ink);
  background: white;
  cursor: pointer;
  transition: border-color 0.3s ease;

  &:hover {
    border-color: var(--gold);
  }

  &:focus {
    outline: none;
    border-color: var(--gold);
  }
`;

const EmojiPicker = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 0.5rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  display: ${props => props.$show ? 'grid' : 'none'};
  grid-template-columns: repeat(6, 1fr);
  gap: 0.5rem;
  z-index: 1000;
  max-width: 300px;
`;

const EmojiButton = styled.button`
  font-size: 1.5rem;
  padding: 0.5rem;
  border: 2px solid transparent;
  border-radius: 6px;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: var(--parchment);
    border-color: var(--gold);
    transform: scale(1.1);
  }
`;

const EmojiGroup = styled.div`
  position: relative;
`;

const StickerPicker = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 0.5rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  display: ${props => props.$show ? 'grid' : 'none'};
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
  z-index: 1000;
  max-width: 280px;
`;

const StickerButton = styled.button`
  font-size: 2rem;
  padding: 0.75rem;
  border: 2px solid transparent;
  border-radius: 6px;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: var(--parchment);
    border-color: var(--gold);
    transform: scale(1.1);
  }
`;

const Toolbar = ({ onExport }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showStickerPicker, setShowStickerPicker] = useState(false);

  const {
    tool,
    color,
    brushSize,
    fontSize,
    fontFamily,
    setTool,
    setColor,
    setBrushSize,
    setFontSize,
    setFontFamily,
    undo,
    redo,
    clearCanvas,
    history,
    historyStep
  } = useCanvasStore();

  const tools = [
    { name: 'pen', icon: Pen, label: 'Pen' },
    { name: 'eraser', icon: Eraser, label: 'Eraser' },
    { name: 'text', icon: Type, label: 'Text' },
    { name: 'signature', icon: PenLine, label: 'Signature' },
  ];

  const fonts = [
    { value: 'Virgil', label: 'Virgil (Excalidraw)' },
    { value: 'Arial', label: 'Arial' },
    { value: 'Georgia', label: 'Georgia' },
    { value: 'Courier New', label: 'Courier' },
    { value: 'Comic Sans MS', label: 'Comic Sans' },
  ];

  const emojis = [
    '😀', '😂', '😍', '🤔', '😎', '🤩',
    '😭', '😱', '🔥', '💯', '✨', '❤️',
    '👍', '👎', '👏', '🙌', '💪', '🎉',
    '🎨', '🖌️', '✏️', '📝', '💡', '⭐',
  ];

  const stickers = [
    // Shapes
    { icon: '■', name: 'square' },
    { icon: '●', name: 'circle' },
    { icon: '▲', name: 'triangle' },
    { icon: '♦', name: 'diamond' },
    // Arrows
    { icon: '→', name: 'arrow-right' },
    { icon: '←', name: 'arrow-left' },
    { icon: '↑', name: 'arrow-up' },
    { icon: '↓', name: 'arrow-down' },
    { icon: '↗', name: 'arrow-diagonal' },
    { icon: '↻', name: 'arrow-circle' },
    { icon: '⇒', name: 'double-arrow' },
    { icon: '⇄', name: 'bidirectional' },
    // Decorative
    { icon: '★', name: 'star' },
    { icon: '☆', name: 'star-outline' },
    { icon: '♥', name: 'heart' },
    { icon: '☀', name: 'sun' },
    { icon: '☁', name: 'cloud' },
    { icon: '☂', name: 'umbrella' },
    { icon: '✓', name: 'checkmark' },
    { icon: '✗', name: 'cross' },
  ];

  const canUndo = historyStep > 0;
  const canRedo = historyStep < history.length - 1;

  return (
    <ToolbarContainer>
      {/* Drawing Tools */}
      <ToolGroup>
        {tools.map(({ name, icon: Icon, label }) => (
          <ToolButton
            key={name}
            $active={tool === name}
            onClick={() => setTool(name)}
            title={label}
          >
            <Icon size={20} />
          </ToolButton>
        ))}
      </ToolGroup>

      {/* Emoji Picker */}
      <EmojiGroup>
        <ToolButton
          $active={showEmojiPicker}
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          title="Add Emoji"
        >
          <Smile size={20} />
        </ToolButton>
        <EmojiPicker $show={showEmojiPicker}>
          {emojis.map((emoji, index) => (
            <EmojiButton
              key={index}
              onClick={() => {
                setTool('emoji');
                setShowEmojiPicker(false);
                // Emoji will be placed on canvas click
                useCanvasStore.setState({ selectedEmoji: emoji });
              }}
            >
              {emoji}
            </EmojiButton>
          ))}
        </EmojiPicker>
      </EmojiGroup>

      {/* Sticker Picker */}
      <EmojiGroup>
        <ToolButton
          $active={showStickerPicker}
          onClick={() => setShowStickerPicker(!showStickerPicker)}
          title="Add Sticker"
        >
          <Sticker size={20} />
        </ToolButton>
        <StickerPicker $show={showStickerPicker}>
          {stickers.map((sticker, index) => (
            <StickerButton
              key={index}
              onClick={() => {
                setTool('sticker');
                setShowStickerPicker(false);
                useCanvasStore.setState({ selectedSticker: sticker });
              }}
            >
              {sticker.icon}
            </StickerButton>
          ))}
        </StickerPicker>
      </EmojiGroup>

      {/* Color Picker */}
      <ToolGroup>
        <Label>Color</Label>
        <ColorPicker
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
      </ToolGroup>

      {/* Brush Size */}
      {(tool === 'pen' || tool === 'eraser') && (
        <ToolGroup>
          <Label>Size: {brushSize}px</Label>
          <SizeSlider
            type="range"
            min="1"
            max="20"
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
          />
        </ToolGroup>
      )}

      {/* Text Options */}
      {tool === 'text' && (
        <>
          <ToolGroup>
            <Label>Font</Label>
            <Select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)}>
              {fonts.map((font) => (
                <option key={font.value} value={font.value}>
                  {font.label}
                </option>
              ))}
            </Select>
          </ToolGroup>
          <ToolGroup>
            <Label>Size: {fontSize}px</Label>
            <SizeSlider
              type="range"
              min="12"
              max="72"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
            />
          </ToolGroup>
        </>
      )}

      {/* History Controls */}
      <ToolGroup>
        <ToolButton
          onClick={undo}
          disabled={!canUndo}
          title="Undo"
        >
          <Undo2 size={20} />
        </ToolButton>
        <ToolButton
          onClick={redo}
          disabled={!canRedo}
          title="Redo"
        >
          <Redo2 size={20} />
        </ToolButton>
      </ToolGroup>

      {/* Actions */}
      <ToolGroup>
        <ToolButton
          onClick={clearCanvas}
          title="Clear Canvas"
        >
          <Trash2 size={20} />
        </ToolButton>
        {onExport && (
          <ToolButton
            onClick={onExport}
            title="Export"
          >
            <Download size={20} />
          </ToolButton>
        )}
      </ToolGroup>
    </ToolbarContainer>
  );
};

export default Toolbar;
