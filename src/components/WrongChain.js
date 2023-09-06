import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useWeb3React } from "@web3-react/core";
import { Grid } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 450,
  borderRadius: "10px",
  bgcolor: "background.paper",
  boxShadow: 24,
};

export default function TransitionsModal({ paymentData }) {
  const { account, chainId, provider } = useWeb3React();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (account && Object.keys(paymentData).length) {
      if (chainId !== parseInt(paymentData.chain_id)) {
        setOpen(true);
      } else {
        setOpen(false);
      }
    } else {
      setOpen(false);
    }
  }, [account, chainId, paymentData]);

  const switchNetwork = async () => {
    const params = parseInt(paymentData.chain_id);
    try {
      await provider?.send("wallet_switchEthereumChain", [
        { chainId: `0x${params.toString(16)}` },
        account,
      ]);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (switchError) {
      if (switchError.code === 4902) {
        const chainConfig = {
          chainId: `0x${params.toString(16)}`, // This should be the appropriate chain ID for the Ethereum chain you're adding
          chainName: 'BNB Smart Chain Testnet', // Replace with the actual name of the chain
          nativeCurrency: {
            name: 'tBNB', // Replace with the native currency's name
            symbol: 'tBNB', // Replace with the currency's symbol
            decimals: 18, // Replace with the currency's decimals
          },
          rpcUrls: ['https://data-seed-prebsc-1-s3.binance.org:8545/'], // Replace with the actual RPC URL of the chain
          blockExplorerUrls: ['https://testnet.bscscan.com/'], // Replace with the actual block explorer URL
        };
        try {
          await provider?.send("wallet_addEthereumChain", [chainConfig]);
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } catch (addError) {
          console.error(`Add chain error ${addError}`);
          console.log(addError)
        }
      }
      console.error(`Switch chain error ${switchError}`);
    }
  };

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Box style={styles.hading2}>
              <Typography align="center" style={styles.headingtext}>
                Your Wallet is setup on the wrong chain
              </Typography>
            </Box>
            <Grid sx={{ padding: "20px" }}>
              <Typography
                align="center"
                style={{ padding: "10px", fontSize: "18px", fontWeight: "600" }}
              >
                Switch Network!{" "}
              </Typography>
              <Box>
                <Typography align="center" sx={{ padding: "10px 0" }}>
                  Click to switch your wallet chain to align with the {paymentData.token_network} token
                  selected for transaction
                </Typography>
              </Box>
              <Button
                onClick={() => switchNetwork()}
                variant="contained"
                style={styles.connectBtn}
              >
                Switch to {paymentData.token_network}
              </Button>
            </Grid>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}

const styles = {
  connectBtn: {
    width: "100%",
    color: "#FFFFFF",
    marginTop: "10px",
    textTransform: "none",
    fontSize: "18px",
  },
  headingtext: {
    fontSize: "20px",
    color: "#FFFFFF",
    fontWeight: "600",
  },
  hading2: {
    backgroundColor: "#00B5B8",
    width: "100%",
    padding: "15px 0",
    borderTopRightRadius: "12px",
    borderTopLeftRadius: "12px",
  },
  text: {
    fontSize: "25px",
    padding: "2px",
    fontWeight: "600",
  },
  para: {
    fontSize: "16px",
    padding: "20px 5px",
    fontWeight: "400",
  },
};
