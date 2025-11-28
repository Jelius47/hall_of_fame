import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Heart, Eye, User } from 'lucide-react';
import useGalleryStore from '../../stores/useGalleryStore';
import { format } from 'date-fns';

const GalleryContainer = styled.div`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  margin-bottom: 1rem;
  background: linear-gradient(135deg, var(--gold), var(--bronze));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  color: var(--ink);
  font-family: var(--font-body);
  font-style: italic;
  margin-bottom: 0.5rem;
`;

const BrandingLine = styled.p`
  font-size: 1rem;
  color: var(--textLight);
  font-family: var(--font-ui);

  span {
    font-weight: 700;
    color: var(--gold);
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ArtworkCard = styled(motion.div)`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(44, 62, 80, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 24px rgba(212, 175, 55, 0.2);
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  height: 250px;
  background: var(--parchment);
  position: relative;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const FeaturedBadge = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background: linear-gradient(135deg, var(--gold), var(--bronze));
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-family: var(--font-ui);
  font-size: 0.75rem;
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
`;

const CardContent = styled.div`
  padding: 1.5rem;
`;

const ArtworkTitle = styled.h3`
  font-size: 1.25rem;
  color: var(--ink);
  margin-bottom: 0.5rem;
  font-family: var(--font-heading);
`;

const ArtistInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--textLight);
  font-family: var(--font-ui);
  font-size: 0.875rem;
  margin-bottom: 1rem;
`;

const QuoteText = styled.p`
  font-family: 'Caveat', cursive;
  font-size: 1.15rem;
  color: var(--ink);
  font-style: italic;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: rgba(212, 175, 55, 0.05);
  border-left: 3px solid var(--gold);
  border-radius: 4px;
  line-height: 1.4;

  &:before {
    content: '"';
    color: var(--gold);
    font-size: 1.5rem;
    margin-right: 0.25rem;
  }

  &:after {
    content: '"';
    color: var(--gold);
    font-size: 1.5rem;
    margin-left: 0.25rem;
  }
`;

const Stats = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border);
`;

const Stat = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--textLight);
  font-family: var(--font-ui);
  font-size: 0.875rem;

  svg {
    color: var(--gold);
  }
`;

const HeartButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: ${props => props.$liked ? 'var(--crimson)' : 'transparent'};
  color: ${props => props.$liked ? 'white' : 'var(--crimson)'};
  border: 2px solid var(--crimson);
  border-radius: 20px;
  font-family: var(--font-ui);
  font-weight: 600;
  transition: all 0.3s ease;
  margin-left: auto;

  &:hover {
    background: var(--crimson);
    color: white;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: var(--crimson);
  font-size: 1.125rem;
`;

const GalleryView = () => {
  const { artworks, featured, loading, error, fetchGallery, addHeart } = useGalleryStore();
  const [likedArtworks, setLikedArtworks] = useState(new Set());

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleHeart = async (e, artworkId) => {
    e.stopPropagation();

    if (!likedArtworks.has(artworkId)) {
      await addHeart(artworkId);
      setLikedArtworks(prev => new Set([...prev, artworkId]));
    }
  };

  const handleArtworkClick = (artwork) => {
    // Could navigate to artwork detail page or open modal
    console.log('View artwork:', artwork);
  };

  if (loading && artworks.length === 0) {
    return (
      <LoadingContainer>
        <div className="spinner"></div>
      </LoadingContainer>
    );
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  return (
    <GalleryContainer>
      <Header>
        <Title>Neurotech Hall of Fame</Title>
        <Subtitle>Celebrating Creativity & Innovation</Subtitle>
        <BrandingLine>
          Powered by <span>Sarufi</span> (parent of <span>ghala</span>) × <span>Neurotech</span>
        </BrandingLine>
      </Header>

      <Grid>
        {artworks.map((artwork, index) => (
          <ArtworkCard
            key={artwork.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => handleArtworkClick(artwork)}
          >
            <ImageContainer>
              <img
                src={`http://localhost:8000/${artwork.thumbnail_path || artwork.file_path}`}
                alt={artwork.title || 'Artwork'}
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="250"%3E%3Crect fill="%23f4f1e8" width="300" height="250"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%232c3e50" font-size="20"%3EArtwork%3C/text%3E%3C/svg%3E';
                }}
              />
              {artwork.is_featured && <FeaturedBadge>Featured</FeaturedBadge>}
            </ImageContainer>

            <CardContent>
              <ArtworkTitle>{artwork.title || 'Untitled'}</ArtworkTitle>

              <ArtistInfo>
                <User size={16} />
                {artwork.artist?.artist_name || 'Unknown Artist'}
              </ArtistInfo>

              {artwork.description && (
                <QuoteText>{artwork.description}</QuoteText>
              )}

              <Stats>
                <Stat>
                  <Eye size={16} />
                  {artwork.views}
                </Stat>

                <HeartButton
                  $liked={likedArtworks.has(artwork.id)}
                  onClick={(e) => handleHeart(e, artwork.id)}
                >
                  <Heart
                    size={16}
                    fill={likedArtworks.has(artwork.id) ? 'white' : 'none'}
                  />
                  {artwork.hearts}
                </HeartButton>
              </Stats>
            </CardContent>
          </ArtworkCard>
        ))}
      </Grid>
    </GalleryContainer>
  );
};

export default GalleryView;
