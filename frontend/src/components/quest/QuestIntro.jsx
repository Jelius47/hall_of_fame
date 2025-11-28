import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Palette, Trophy, Sparkles } from 'lucide-react';

const IntroContainer = styled(motion.div)`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(135deg, var(--parchment) 0%, #e8e4d9 100%);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(212, 175, 55, 0.05) 1px, transparent 1px);
    background-size: 50px 50px;
    animation: float 20s ease-in-out infinite;
  }
`;

const Content = styled.div`
  max-width: 800px;
  text-align: center;
  position: relative;
  z-index: 1;
`;

const Logo = styled(motion.h1)`
  font-size: 4rem;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, var(--gold), var(--bronze));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Tagline = styled(motion.p)`
  font-size: 1.5rem;
  color: var(--ink);
  margin-bottom: 3rem;
  font-family: var(--font-body);
  font-style: italic;

  @media (max-width: 768px) {
    font-size: 1.125rem;
  }
`;

const Features = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const Feature = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(44, 62, 80, 0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const FeatureIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--gold), var(--bronze));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const FeatureTitle = styled.h3`
  font-size: 1.125rem;
  color: var(--ink);
`;

const FeatureText = styled.p`
  font-size: 0.875rem;
  color: var(--textLight);
  font-family: var(--font-ui);
`;

const CTAButton = styled(motion.button)`
  padding: 1.25rem 3rem;
  font-size: 1.5rem;
  font-weight: 700;
  font-family: var(--font-heading);
  color: white;
  background: linear-gradient(135deg, var(--gold), var(--bronze));
  border: none;
  border-radius: 50px;
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(212, 175, 55, 0.4);
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 12px 30px rgba(212, 175, 55, 0.5);
  }

  &:active {
    transform: scale(0.98);
  }

  @media (max-width: 768px) {
    font-size: 1.25rem;
    padding: 1rem 2rem;
  }
`;

const QuestIntro = ({ onStart }) => {
  const features = [
    {
      icon: Palette,
      title: 'Create Freely',
      text: 'Draw your masterpiece with intuitive tools'
    },
    {
      icon: Sparkles,
      title: 'Claim Your Art',
      text: 'Set your artist name and make it yours'
    },
    {
      icon: Trophy,
      title: 'Hall of Fame',
      text: 'Join the legendary gallery of creators'
    }
  ];

  return (
    <IntroContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <Content>
        <Logo
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          Neurotech Hall of Fame
        </Logo>

        <Tagline
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          Powered by Sarufi & ghala - Where Legends Are Made
        </Tagline>

        <Features
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          {features.map((feature, index) => (
            <Feature key={index}>
              <FeatureIcon>
                <feature.icon size={30} />
              </FeatureIcon>
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureText>{feature.text}</FeatureText>
            </Feature>
          ))}
        </Features>

        <CTAButton
          onClick={onStart}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Begin Your Quest
        </CTAButton>
      </Content>
    </IntroContainer>
  );
};

export default QuestIntro;
