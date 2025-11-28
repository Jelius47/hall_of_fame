import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Home, Palette, Trophy, User, LogOut } from 'lucide-react';
import useAuthStore from '../../stores/useAuthStore';

const Nav = styled.nav`
  position: sticky;
  top: 0;
  z-index: 100;
  background: white;
  box-shadow: 0 2px 8px rgba(44, 62, 80, 0.1);
  padding: 1rem 2rem;
`;

const NavContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
`;

const Logo = styled(Link)`
  font-family: var(--font-heading);
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, var(--gold), var(--bronze));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-decoration: none;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;

  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.$active ? 'var(--gold)' : 'var(--ink)'};
  font-family: var(--font-ui);
  font-weight: ${props => props.$active ? '600' : '500'};
  text-decoration: none;
  transition: color 0.3s ease;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  background: ${props => props.$active ? 'rgba(212, 175, 55, 0.1)' : 'transparent'};

  &:hover {
    color: var(--gold);
    background: rgba(212, 175, 55, 0.05);
  }

  @media (max-width: 768px) {
    span {
      display: none;
    }
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserName = styled.span`
  font-family: var(--font-ui);
  font-weight: 600;
  color: var(--ink);

  @media (max-width: 768px) {
    display: none;
  }
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: transparent;
  color: var(--crimson);
  border: 2px solid var(--crimson);
  border-radius: 8px;
  font-family: var(--font-ui);
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    background: var(--crimson);
    color: white;
  }

  @media (max-width: 768px) {
    padding: 0.5rem;

    span {
      display: none;
    }
  }
`;

const Navigation = () => {
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuthStore();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/create', icon: Palette, label: 'Create' },
    { path: '/gallery', icon: Trophy, label: 'Gallery' },
  ];

  return (
    <Nav>
      <NavContainer>
        <Logo to="/">Neurotech Hall of Fame</Logo>

        <NavLinks>
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              $active={location.pathname === item.path}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </NavLinks>

        <UserSection>
          {isAuthenticated && user ? (
            <>
              <UserName>{user.artist_name}</UserName>
              <Button onClick={logout}>
                <LogOut size={18} />
                <span>Logout</span>
              </Button>
            </>
          ) : null}
        </UserSection>
      </NavContainer>
    </Nav>
  );
};

export default Navigation;
