import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  List,
  ListItem,
  ListItemText,
  Button,
  InputAdornment,
  Avatar,
  IconButton,
} from "@mui/material";
import ETH_ICON from "../assests/eth.png";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";

const TokenSelectionModal = ({ isOpen, onClose, onSelectToken }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const tokenList = [
    {
      name: 'Token 1',
      iconUrl: ETH_ICON,
    },
    {
      name: 'Token 2',
      iconUrl: ETH_ICON,
    },
    {
      name: 'Token 3',
      iconUrl: ETH_ICON,
    },
  ];

  const handleTokenSelect = (token) => {
    onSelectToken(token);
    onClose();
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 300,
          bgcolor: "background.paper",
          borderRadius: "10px",
          p: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 2,
          }}
        >
          <Typography variant="h6">Select Token</Typography>
          <IconButton onClick={onClose} sx={{ p: 1 }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <TextField
          label="Search name or paste address"
          fullWidth
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <List>
          {tokenList
            .filter((token) =>
              token.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((token) => (
              <ListItem
                button
                key={token.name} 
                onClick={() => handleTokenSelect(token)}
              >
                <Avatar
                  src={token.iconUrl}
                  alt={`${token.name} icon`}
                  sx={{ marginRight: 2 }}
                />
                <ListItemText primary={token.name} />
              </ListItem>
            ))}
        </List>
       
      </Box>
    </Modal>
  );
};

export default TokenSelectionModal;
