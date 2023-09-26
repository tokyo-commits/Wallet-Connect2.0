import React, { useState, useEffect, useCallback } from "react";
import { Box, Button, Container, Grid, Typography, Card } from "@mui/material";
import { makeStyles } from "tss-react/mui";
// import { toast } from "react-toastify";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import KeyboardDoubleArrowDownRoundedIcon from "@mui/icons-material/KeyboardDoubleArrowDownRounded";
import ETH_ICON from "../assests/eth.png";
import TokenSelectionModal, { tokenList } from "./TokenSelectionModal";
import { useWeb3React } from "@web3-react/core";
import Web3 from "web3";
import boneABI from "../ABI/boneABI.json";

const InputBox = ({
  inputText,
  selectedToken,
  onSelectToken,
  isDisabled = false,
}) => {
  const { classes } = useStyles();
  return (
    <Box className={classes.InputBox}>
      <Box>
        <Typography>{inputText}</Typography>
        <input className={classes.mainInput} placeholder="0.00" />
      </Box>
      <Box className={classes.modalButtonBox}>
        <Button
          className={classes.modalButton}
          variant="contained"
          endIcon={<KeyboardArrowDownRoundedIcon fontSize="large" />}
          onClick={onSelectToken}
          disabled={isDisabled}
        >
          <img
            src={selectedToken.iconUrl || ETH_ICON}
            alt="icon"
            className={classes.defaultTokenIcon}
          />
          {selectedToken.name || tokenList[0].name}
        </Button>

        <Typography align="right" className={classes.balancetext}>
          Balance: {selectedToken.balance}
        </Typography>
      </Box>
    </Box>
  );
};

const Swap = () => {
  const { classes } = useStyles();

  const { account, provider, connector } = useWeb3React();
  const lib = provider;
  const web3 = new Web3(lib?.provider);

  const [isModalOpenPay, setIsModalOpenPay] = useState(false);
  const [isModalOpenReceive, setIsModalOpenReceive] = useState(false);
  const [selectedTokenPay, setSelectedTokenPay] = useState(tokenList[0]);
  const [selectedTokenReceive, setSelectedTokenReceive] = useState({
    name: "CTS",
    iconUrl: ETH_ICON,
    tokenAddress: "0xEDd26a862b25232319E19B8B94d927054B5030BE",
  });

  const handleOpenModalPay = () => {
    setIsModalOpenPay(true);
  };

  const handleCloseModalPay = () => {
    setIsModalOpenPay(false);
  };

  const handleOpenModalReceive = () => {
    setIsModalOpenReceive(true);
  };

  const handleCloseModalReceive = () => {
    setIsModalOpenReceive(false);
  };

  const handleTokenSelectPay = (token) => {
    setSelectedTokenPay(token);
    handleCloseModalPay();
  };

  const handleTokenSelectReceive = (token) => {
    setSelectedTokenReceive(token);
    handleCloseModalReceive();
  };

  const getBalance = async (token) => {
    console.log({ token, account });
    const instance = new web3.eth.Contract(boneABI, token);
    const balance = await instance.methods
      .balanceOf(account)
      .call({ from: account });
    const tokenDecimal = await instance.methods.decimals().call();
    setSelectedTokenReceive((pre) => ({...pre, balance: balance / Math.pow(10, tokenDecimal)}));
  };

  useEffect(() => {
    if (account) {
      getBalance(selectedTokenReceive.tokenAddress);
    }
  }, [account]);

  return (
    <Container maxWidth={false}>
      <Grid container className={classes.centeredGrid}>
        <Grid item xs={12} md={10} lg={6}>
          <Card className={classes.centeredCard}>
            <Typography variant="h5">Swap</Typography>

            <InputBox
              selectedToken={selectedTokenPay}
              inputText="You pay"
              onSelectToken={handleOpenModalPay}
              // tokenBalance={getBalance(selectedTokenPay.tokenAddress)}
            />

            <Box className={classes.centerArrowBox}>
              <KeyboardDoubleArrowDownRoundedIcon
                className={classes.centerIcon}
              />
            </Box>

            <InputBox
              selectedToken={selectedTokenReceive}
              inputText="You receive"
              onSelectToken={handleOpenModalReceive}
              isDisabled={true}
              // tokenBalance={getBalance(selectedTokenReceive.tokenAddress)}
            />

            <Button variant="contained" className={classes.bottmButtom}>
              Select Token
            </Button>

            <TokenSelectionModal
              isOpen={isModalOpenPay}
              onClose={handleCloseModalPay}
              onSelectToken={handleTokenSelectPay}
            />
            <TokenSelectionModal
              isOpen={isModalOpenReceive}
              onClose={handleCloseModalReceive}
              onSelectToken={handleTokenSelectReceive}
            />
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Swap;

export const useStyles = makeStyles()((theme) => {
  return {
    bottmButtom: {
      width: "100%",
      padding: "10px",
      borderRadius: "12px",
      marginTop: "10px",
      fontSize: "16px",
      color: "#FFFFFF",
      textTransform: "none",
      // margin:'0 4px'
    },
    balancetext: {
      padding: "5px",
    },
    modalButton: {
      borderRadius: "12px",
      color: "#FFFFFF",
      padding: "10px 15px",
      fontSize: "16px",
    },
    defaultTokenIcon: {
      height: "24px",
      width: "24px",
      padding: "0 5px",
    },
    modalButtonBox: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end",
      margin: "auto 0",
    },
    mainInput: {
      height: "50px",
      width: "100%",
      fontSize: "20px",
      padding: "0 10px",
      outline: "none",
      borderRadius: "12px",
      margin: "10px 5px",
      border: "1px solid #ccc" /* Your regular border style */,
      boxShadow: "0 0 0 transparent" /* Transparent box shadow by default */,
      transition:
        "box-shadow 0.2s ease" /* Smooth transition for the box shadow */,
      "&:focus": {
        border: "1px solid #007bff" /* Replace with your desired focus style */,
        boxShadow:
          "0 0 5px rgba(0, 123, 255, 0.5)" /* Add a subtle shadow for focus */,
      },
      [theme.breakpoints.down("xs")]: {
        width: "80%",
      },
    },
    centerArrowBox: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
    },
    centerIcon: {
      backgroundColor: "rgb(249, 249, 249);",
      borderRadius: "12px",
      padding: "10px",
      margin: "2px",
    },
    centeredGrid: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh", // Make the grid full height of the viewport
    },
    centeredCard: {
      borderRadius: "12px",
      maxWidth: "550px",
      margin: "auto", // This centers the card horizontally
      marginTop: "10px", // Add top margin
      marginBottom: "10px", // Add bottom margin,
      padding: "15px",
      [theme.breakpoints.down("xs")]: {
        maxWidth: "300px",
      },
      [theme.breakpoints.between("sm", "xs")]: {
        maxWidth: "450px",
      },
    },
    InputBox: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      backgroundColor: "rgb(249, 249, 249);",
      borderRadius: "12px",
      padding: "15px",
      margin: "10px",
      [theme.breakpoints.down("xs")]: {
        flexDirection: "column",
      },
    },
  };
});
