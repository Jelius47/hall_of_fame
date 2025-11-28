import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Save, Upload, MessageSquare } from 'lucide-react';
import DrawingBoard from '../components/canvas/DrawingBoard';
import Toolbar from '../components/canvas/Toolbar';
import ArtClaim from '../components/quest/ArtClaim';
import useAuthStore from '../stores/useAuthStore';
import useCanvasStore from '../stores/useCanvasStore';
import { artworksAPI } from '../services/api';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  color: var(--ink);
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: var(--textLight);
  font-size: 1.125rem;
  font-family: var(--font-ui);
`;

const CanvasSection = styled.div`
  margin-bottom: 2rem;
`;

const MetadataSection = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(44, 62, 80, 0.1);
`;

const MetadataTitle = styled.h3`
  color: var(--ink);
  margin-bottom: 1rem;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const InputGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  color: var(--ink);
  font-family: var(--font-ui);
  font-weight: 500;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid var(--border);
  border-radius: 8px;
  font-family: 'Caveat', cursive;
  font-size: 1.25rem;
  color: var(--ink);
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: var(--gold);
  }

  &::placeholder {
    color: var(--textLight);
    opacity: 0.6;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid var(--border);
  border-radius: 8px;
  font-family: 'Caveat', cursive;
  font-size: 1.25rem;
  color: var(--ink);
  min-height: 100px;
  resize: vertical;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: var(--gold);
  }

  &::placeholder {
    color: var(--textLight);
    opacity: 0.6;
  }
`;

const Actions = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: ${props => props.$primary ? 'linear-gradient(135deg, var(--gold), var(--bronze))' : 'white'};
  color: ${props => props.$primary ? 'white' : 'var(--ink)'};
  border: 2px solid ${props => props.$primary ? 'transparent' : 'var(--border)'};
  border-radius: 8px;
  font-family: var(--font-ui);
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px ${props => props.$primary ? 'rgba(212, 175, 55, 0.3)' : 'rgba(0, 0, 0, 0.15)'};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const Message = styled.div`
  padding: 1rem;
  background: ${props => props.$error ? 'rgba(220, 20, 60, 0.1)' : 'rgba(135, 169, 107, 0.1)'};
  border: 2px solid ${props => props.$error ? 'var(--crimson)' : 'var(--sage)'};
  border-radius: 8px;
  color: ${props => props.$error ? 'var(--crimson)' : 'var(--sage)'};
  text-align: center;
  margin-top: 1rem;
`;

const Create = () => {
  const navigate = useNavigate();
  const stageRef = useRef(null);
  const [showClaim, setShowClaim] = useState(false);
  const [artworkPreview, setArtworkPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState(null);
  const [quote, setQuote] = useState('');
  const [title, setTitle] = useState('');

  const { isAuthenticated } = useAuthStore();
  const { lines, getCanvasData } = useCanvasStore();

  const canSave = lines.length > 0;

  const handleExport = () => {
    const stage = document.querySelector('canvas');
    if (!stage) return;

    const dataURL = stage.toDataURL();
    setArtworkPreview(dataURL);

    if (!isAuthenticated) {
      setShowClaim(true);
    } else {
      handleUpload(dataURL);
    }
  };

  const handleUpload = async (dataURL) => {
    setUploading(true);
    setMessage(null);

    try {
      // Convert data URL to blob
      const blob = await (await fetch(dataURL)).blob();

      // Create form data
      const formData = new FormData();
      formData.append('file', blob, 'artwork.png');
      formData.append('canvas_data', getCanvasData());
      formData.append('width', '800');
      formData.append('height', '600');

      // Add title and quote if provided
      if (title.trim()) {
        formData.append('title', title.trim());
      }
      if (quote.trim()) {
        formData.append('description', quote.trim());
      }

      // Upload artwork
      const response = await artworksAPI.upload(formData);

      setMessage({ text: 'Artwork uploaded successfully!', error: false });

      // Redirect to gallery after a delay
      setTimeout(() => {
        navigate('/gallery');
      }, 2000);
    } catch (error) {
      console.error('Upload error:', error);
      setMessage({
        text: error.response?.data?.detail || 'Failed to upload artwork',
        error: true
      });
    } finally {
      setUploading(false);
    }
  };

  const handleClaim = async (user) => {
    setShowClaim(false);

    // User is now authenticated, upload the artwork
    if (artworkPreview) {
      await handleUpload(artworkPreview);
    }
  };

  return (
    <Container>
      <Header>
        <Title>Create Your Masterpiece</Title>
        <Subtitle>
          Let your imagination flow. Every stroke tells your story.
        </Subtitle>
      </Header>

      <CanvasSection>
        <Toolbar onExport={handleExport} />
        <DrawingBoard ref={stageRef} />
      </CanvasSection>

      <MetadataSection>
        <MetadataTitle>
          <MessageSquare size={24} color="#d4af37" />
          Add Your Story (Optional)
        </MetadataTitle>

        <InputGroup>
          <Label>Artwork Title</Label>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Give your masterpiece a name..."
            maxLength={200}
          />
        </InputGroup>

        <InputGroup>
          <Label>Your Quote or Message</Label>
          <TextArea
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            placeholder="Share your thoughts, inspiration, or a meaningful quote..."
            maxLength={500}
          />
        </InputGroup>
      </MetadataSection>

      <Actions>
        <Button
          onClick={handleExport}
          disabled={!canSave || uploading}
          $primary
        >
          {uploading ? (
            <>
              <div className="spinner" style={{ width: 20, height: 20 }}></div>
              Saving...
            </>
          ) : (
            <>
              <Save size={20} />
              {isAuthenticated ? 'Save to Gallery' : 'Save & Claim Art'}
            </>
          )}
        </Button>
      </Actions>

      {message && (
        <Message $error={message.error}>
          {message.text}
        </Message>
      )}

      {showClaim && (
        <ArtClaim
          artworkPreview={artworkPreview}
          onClaim={handleClaim}
          onClose={() => setShowClaim(false)}
        />
      )}
    </Container>
  );
};

export default Create;
