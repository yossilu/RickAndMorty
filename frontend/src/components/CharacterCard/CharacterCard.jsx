import React from 'react';
import { Card, CardContent, CardMedia, Typography } from '@mui/material';

const CharacterCard = ({ data, isAdmin, onClick }) => {
  const isCharacter = !!data.species;

  return (
    <Card 
      className={isAdmin ? "hoverable-card" : ""}
      onClick={onClick}
    >
      {isCharacter ? (
        <CardMedia
          component="img"
          height="140"
          image={data.image}
          alt={data.name}
        />
      ) : null}
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {data.name}
        </Typography>
        {isCharacter ? (
          <>
            <Typography variant="body2" color="text.secondary">
              Type: {data.type || 'N/A'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Species: {data.species}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Gender: {data.gender}
            </Typography>
          </>
        ) : (
          <>
            <Typography variant="body2" color="text.secondary">
              Type: {data.type}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Dimension: {data.dimension}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Residents: {data.residents.length}
            </Typography>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default CharacterCard;
