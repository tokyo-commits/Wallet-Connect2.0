import React, { useState } from "react";
import { Modal, Box } from "@mui/material";
import MetaMaskCard from "./MetaMaskCard";
import WalletConnectV2Card from "./WalletConnectV2Card";
import CoinbaseWalletCard from "./CoinbaseWalletCard";

export const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 450,
  borderRadius: "10px",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 2,
};

const WalletModal = ({handleClose}) => {
  const [open, setOpen] = useState(true);

  const onClose = () => {
    handleClose();
    setOpen(false);
  };
  return (
    <Modal
      open={open}
      onClose={() => onClose()}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{zIndex: 9}}
    >
      <Box sx={style}>
        <Box>
            <MetaMaskCard />
            <WalletConnectV2Card />
            <CoinbaseWalletCard />
        </Box>
      </Box>
    </Modal>
  );
};

export default WalletModal;
