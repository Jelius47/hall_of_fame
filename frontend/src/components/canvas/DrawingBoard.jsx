import React, { useRef, useState, useEffect } from 'react';
import { Stage, Layer, Line, Rect, Circle, Text } from 'react-konva';
import styled from 'styled-components';
import useCanvasStore from '../../stores/useCanvasStore';

const CanvasContainer = styled.div`
  position: relative;
  width: 100%;
  height: 600px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 8px 16px rgba(44, 62, 80, 0.12);
  overflow: hidden;

  /* Parchment texture */
  background-image:
    repeating-linear-gradient(
      0deg,
      rgba(212, 175, 55, 0.02) 0px,
      transparent 1px,
      transparent 2px,
      rgba(212, 175, 55, 0.02) 3px
    );
`;

const CanvasInfo = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(244, 241, 232, 0.95);
  padding: 8px 12px;
  border-radius: 4px;
  font-family: var(--font-ui);
  font-size: 0.875rem;
  color: var(--ink);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const TextInput = styled.input`
  position: absolute;
  padding: 4px 8px;
  border: 2px solid var(--gold);
  background: rgba(255, 255, 255, 0.95);
  border-radius: 4px;
  outline: none;
  font-family: ${props => props.$fontFamily || 'Virgil'};
  font-size: ${props => props.$fontSize || 24}px;
  color: ${props => props.$color || '#2c3e50'};
  min-width: 100px;
  box-shadow: 0 2px 8px rgba(212, 175, 55, 0.3);
  z-index: 1000;
`;

const DrawingBoard = () => {
  const stageRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentLine, setCurrentLine] = useState(null);
  const [isEditingText, setIsEditingText] = useState(false);
  const [textPosition, setTextPosition] = useState({ x: 0, y: 0 });
  const [textValue, setTextValue] = useState('');
  const textInputRef = useRef(null);

  const {
    tool,
    color,
    brushSize,
    fontSize,
    fontFamily,
    lines,
    texts,
    emojis,
    stickers,
    signatures,
    selectedEmoji,
    selectedSticker,
    addLine,
    addText,
    addEmoji,
    addSticker,
    addSignature,
    generateSignature,
    saveToHistory,
    canvasWidth,
    canvasHeight
  } = useCanvasStore();

  // Focus text input when it appears
  useEffect(() => {
    if (isEditingText && textInputRef.current) {
      textInputRef.current.focus();
    }
  }, [isEditingText]);

  const handleTextInputComplete = () => {
    if (textValue.trim()) {
      addText({
        text: textValue,
        x: textPosition.x,
        y: textPosition.y,
        fontSize,
        fontFamily,
        fill: color,
      });
      saveToHistory();
    }
    setIsEditingText(false);
    setTextValue('');
  };

  const handleTextInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleTextInputComplete();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsEditingText(false);
      setTextValue('');
    }
  };

  const handleMouseDown = (e) => {
    // Don't handle canvas clicks while editing text
    if (isEditingText) {
      return;
    }

    const stage = e.target.getStage();
    const point = stage.getPointerPosition();

    if (tool === 'pen' || tool === 'eraser') {
      setIsDrawing(true);
      setCurrentLine({
        tool: tool,
        points: [point.x, point.y],
        color: tool === 'eraser' ? 'white' : color,
        strokeWidth: brushSize,
      });
    } else if (tool === 'text') {
      // Show text input at click position
      setTextPosition({ x: point.x, y: point.y });
      setIsEditingText(true);
      setTextValue('');
    } else if (tool === 'emoji' && selectedEmoji) {
      // Add emoji at click position
      addEmoji({
        emoji: selectedEmoji,
        x: point.x,
        y: point.y,
        fontSize: 48,
      });
      saveToHistory();
    } else if (tool === 'sticker' && selectedSticker) {
      // Add sticker at click position
      addSticker({
        sticker: selectedSticker.icon,
        name: selectedSticker.name,
        x: point.x,
        y: point.y,
        fontSize: 48,
        fill: color,
      });
      saveToHistory();
    } else if (tool === 'signature') {
      // Prompt for name and generate signature
      const name = prompt('Enter name for signature:');
      if (name && name.trim()) {
        const signatureLines = generateSignature(name.trim(), point.x, point.y);
        addSignature({
          name: name.trim(),
          lines: signatureLines,
          x: point.x,
          y: point.y,
        });
        saveToHistory();
      }
    }
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;

    const stage = e.target.getStage();
    const point = stage.getPointerPosition();

    if (currentLine) {
      setCurrentLine({
        ...currentLine,
        points: [...currentLine.points, point.x, point.y],
      });
    }
  };

  const handleMouseUp = () => {
    if (!isDrawing) return;

    setIsDrawing(false);

    if (currentLine && currentLine.points.length > 2) {
      addLine(currentLine);
      saveToHistory();
    }

    setCurrentLine(null);
  };

  return (
    <CanvasContainer>
      <Stage
        ref={stageRef}
        width={canvasWidth}
        height={canvasHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
      >
        <Layer>
          {/* Render saved lines */}
          {lines.map((line, i) => (
            <Line
              key={`line-${i}`}
              points={line.points}
              stroke={line.color}
              strokeWidth={line.strokeWidth}
              tension={0.5}
              lineCap="round"
              lineJoin="round"
              globalCompositeOperation={
                line.tool === 'eraser' ? 'destination-out' : 'source-over'
              }
            />
          ))}

          {/* Render texts */}
          {texts.map((text, i) => (
            <Text
              key={`text-${i}`}
              x={text.x}
              y={text.y}
              text={text.text}
              fontSize={text.fontSize}
              fontFamily={text.fontFamily}
              fill={text.fill}
              draggable
            />
          ))}

          {/* Render emojis */}
          {emojis.map((emoji, i) => (
            <Text
              key={`emoji-${i}`}
              x={emoji.x}
              y={emoji.y}
              text={emoji.emoji}
              fontSize={emoji.fontSize}
              draggable
            />
          ))}

          {/* Render stickers */}
          {stickers.map((sticker, i) => (
            <Text
              key={`sticker-${i}`}
              x={sticker.x}
              y={sticker.y}
              text={sticker.sticker}
              fontSize={sticker.fontSize}
              fill={sticker.fill}
              draggable
            />
          ))}

          {/* Render signatures */}
          {signatures.map((signature, i) => (
            signature.lines.map((line, j) => (
              <Line
                key={`signature-${i}-line-${j}`}
                points={line.points}
                stroke={line.color}
                strokeWidth={line.strokeWidth}
                tension={0.5}
                lineCap="round"
                lineJoin="round"
              />
            ))
          ))}

          {/* Render current line being drawn */}
          {currentLine && (
            <Line
              points={currentLine.points}
              stroke={currentLine.color}
              strokeWidth={currentLine.strokeWidth}
              tension={0.5}
              lineCap="round"
              lineJoin="round"
              globalCompositeOperation={
                currentLine.tool === 'eraser' ? 'destination-out' : 'source-over'
              }
            />
          )}
        </Layer>
      </Stage>

      <CanvasInfo>
        {canvasWidth} x {canvasHeight}
      </CanvasInfo>

      {/* Direct text input on canvas */}
      {isEditingText && (
        <TextInput
          ref={textInputRef}
          type="text"
          value={textValue}
          onChange={(e) => setTextValue(e.target.value)}
          onKeyDown={handleTextInputKeyDown}
          $fontFamily={fontFamily}
          $fontSize={fontSize}
          $color={color}
          style={{
            left: `${textPosition.x}px`,
            top: `${textPosition.y}px`,
          }}
          placeholder="Type text... (Press Enter)"
          autoComplete="off"
        />
      )}
    </CanvasContainer>
  );
};

export default DrawingBoard;
