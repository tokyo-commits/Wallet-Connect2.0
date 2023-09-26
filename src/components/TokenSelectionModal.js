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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

export const tokenList = [
  {
    id: "1",
    symbol: "CDUMMY",
    name: "CDUMMY",
    tokenAddress: "0x7D93245bFD798D1E118974d6F1b5b4b6d86bc264",
  },
];

const TokenSelectionModal = ({ isOpen, onClose, onSelectToken }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleTokenSelect = (token) => {
    onSelectToken(token);
    onClose();
  };

  const filteredTokens = tokenList.filter((token) => {
    const searchString =
      `${token.name} ${token.symbol} ${token.tokenAddress}).join(" ")}`.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

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
          borderRadius: "12px",
          boxShadow: 24,
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
          <Button onClick={onClose}>
            <CloseIcon />
          </Button>
        </Box>
        <Box sx={{ display: "flex", alignItems: "flex-end" }}>
          <InputAdornment
            position="start"
            sx={{ color: "action.active", mr: 1, my: "auto" }}
          >
            <SearchIcon color="action" />
          </InputAdornment>

          <TextField
            label="Search name or paste address"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Box>

        <List>
          {filteredTokens.map((token) => (
            <ListItem key={token.name} onClick={() => handleTokenSelect(token)}>
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
