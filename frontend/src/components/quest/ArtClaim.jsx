import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Sparkles, Mail } from 'lucide-react';
import useAuthStore from '../../stores/useAuthStore';

const Modal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(44, 62, 80, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled(motion.div)`
  background: var(--parchment);
  border-radius: 16px;
  padding: 3rem;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 20px 40px rgba(44, 62, 80, 0.3);
  border: 3px solid var(--gold);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(45deg, var(--gold), var(--bronze), var(--gold));
    border-radius: 16px;
    z-index: -1;
    animation: shimmer 3s linear infinite;
  }

  @keyframes shimmer {
    0% { opacity: 0.5; }
    50% { opacity: 1; }
    100% { opacity: 0.5; }
  }
`;

const Title = styled.h2`
  text-align: center;
  color: var(--ink);
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const Subtitle = styled.p`
  text-align: center;
  color: var(--textLight);
  margin-bottom: 2rem;
  font-size: 1.125rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-family: var(--font-ui);
  font-weight: 600;
  color: var(--ink);
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Input = styled.input`
  padding: 0.875rem;
  border: 2px solid var(--border);
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;

  &:focus {
    outline: none;
    border-color: var(--gold);
    box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
  }

  &::placeholder {
    color: #bdc3c7;
  }
`;

const Button = styled.button`
  padding: 1rem 2rem;
  background: linear-gradient(135deg, var(--gold), var(--bronze));
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.125rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: var(--font-heading);
  box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(212, 175, 55, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ErrorMessage = styled.div`
  padding: 0.875rem;
  background: rgba(220, 20, 60, 0.1);
  border: 2px solid var(--crimson);
  border-radius: 8px;
  color: var(--crimson);
  font-size: 0.875rem;
  text-align: center;
`;

const ArtPreview = styled.div`
  width: 100%;
  height: 150px;
  background: white;
  border-radius: 8px;
  border: 3px solid var(--gold);
  margin-bottom: 1.5rem;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const ArtClaim = ({ artworkPreview, onClaim, onClose }) => {
  const [artistName, setArtistName] = useState('');
  const [email, setEmail] = useState('');
  const { claimArt, loading, error, clearError } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    if (!artistName || artistName.length < 3) {
      return;
    }

    const result = await claimArt(artistName, email || null);

    if (result.success) {
      onClaim && onClaim(result.user);
    }
  };

  return (
    <Modal
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <ModalContent
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <Title>
          <Sparkles size={28} color="#d4af37" />
          Claim Your Masterpiece
        </Title>
        <Subtitle>
          This legendary artwork needs its creator!
        </Subtitle>

        {artworkPreview && (
          <ArtPreview>
            <img src={artworkPreview} alt="Your artwork" />
          </ArtPreview>
        )}

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label>
              Artist Name *
            </Label>
            <Input
              type="text"
              value={artistName}
              onChange={(e) => setArtistName(e.target.value)}
              placeholder="Enter your artist name"
              minLength={3}
              maxLength={100}
              required
              autoFocus
            />
          </InputGroup>

          <InputGroup>
            <Label>
              <Mail size={16} />
              Email (Optional)
            </Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
            />
          </InputGroup>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <Button type="submit" disabled={loading || !artistName || artistName.length < 3}>
            {loading ? 'Claiming...' : 'Claim My Place in History'}
          </Button>
        </Form>
      </ModalContent>
    </Modal>
  );
};

export default ArtClaim;
