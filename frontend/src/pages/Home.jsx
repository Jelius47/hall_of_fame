import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QuestIntro from '../components/quest/QuestIntro';
import useAuthStore from '../stores/useAuthStore';

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const handleStart = () => {
    navigate('/create');
  };

  return <QuestIntro onStart={handleStart} />;
};

export default Home;
