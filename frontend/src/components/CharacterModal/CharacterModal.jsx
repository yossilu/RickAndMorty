import React from 'react';
import { Modal, Box, Fade, IconButton, Typography } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

const CharacterModal = ({ open, data, onClose }) => {
  const isCharacter = !!data?.species;

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
    >
      <Fade in={open}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80%',
          maxWidth: 600,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          outline: 0,
          borderRadius: 1,
        }}>
          <IconButton
            sx={{ position: 'absolute', top: 8, right: 8 }}
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>
          {data && (
            <div className="modal-content">
              <Typography variant="h4" align="center">{data.name}</Typography>
              {isCharacter && <img src={data.image} alt={data.name} style={{ display: 'block', margin: '0 auto' }} />}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
                <div>
                  {isCharacter ? (
                    <>
                      <Typography variant="body1">Type: {data?.type || 'N/A'}</Typography>
                      <Typography variant="body1">Species: {data?.species}</Typography>
                      <Typography variant="body1">Gender: {data?.gender}</Typography>
                      <Typography variant="body1">Status: {data?.status}</Typography>
                      <Typography variant="body1">Origin: {data?.origin.name}</Typography>
                      <Typography variant="body1">Location: {data?.location.name}</Typography>
                      <Typography variant="body1">Created: {new Date(data?.created).toLocaleDateString()}</Typography>
                    </>
                  ) : (
                    <>
                      <Typography variant="body1">Type: {data?.type}</Typography>
                      <Typography variant="body1">Dimension: {data?.dimension}</Typography>
                      <Typography variant="body1">Residents: {data?.residents?.length}</Typography>
                      <Typography variant="body1">Created: {new Date(data?.created).toLocaleDateString()}</Typography>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </Box>
      </Fade>
    </Modal>
  );
};

export default CharacterModal;
