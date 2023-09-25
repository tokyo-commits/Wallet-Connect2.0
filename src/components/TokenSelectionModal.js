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
import ETH_ICON from "../assests/eth.png";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
const TokenSelectionModal = ({ isOpen, onClose, onSelectToken }) => {
  const [searchTerm, setSearchTerm] = useState("");
 
  const tokenList = [
    {
      id: "01coin",
      symbol: "zoc",
      name: "01coin",
      platforms: {},
    },
    {
      id: "0chain",
      symbol: "zcn",
      name: "Zus",
      platforms: {
        ethereum: "0xb9ef770b6a5e12e45983c5d80545258aa38f3b78",
        "polygon-pos": "0x8bb30e0e67b11b978a5040144c410e1ccddcba30",
      },
    },
    {
      id: "0-knowledge-network",
      symbol: "0kn",
      name: "0 Knowledge Network",
      platforms: {
        ethereum: "0x4594cffbfc09bc5e7ecf1c2e1c1e24f0f7d29036",
      },
    },
  ];

  const handleTokenSelect = (token) => {
    onSelectToken(token);
    onClose();
  };

  const filteredTokens = tokenList.filter((token) => {
    const searchString = `${token.name} ${token.symbol} ${Object.values(
      token.platforms
    ).join(" ")}`.toLowerCase();
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
