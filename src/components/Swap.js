import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Card,
} from "@mui/material";
import { makeStyles } from "tss-react/mui";
import { toast } from "react-toastify";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import KeyboardDoubleArrowDownRoundedIcon from "@mui/icons-material/KeyboardDoubleArrowDownRounded";
import ETH_ICON from "../assests/eth.png";
import TokenSelectionModal from "./TokenSelectionModal";

const Swap = () => {
  const { classes } = useStyles();
  const [isModalOpenPay, setIsModalOpenPay] = useState(false);
  const [isModalOpenReceive, setIsModalOpenReceive] = useState(false);
  const [selectedTokenPay, setSelectedTokenPay] = useState({
    name: "ETH",
    iconUrl: ETH_ICON,
  });
  const [selectedTokenReceive, setSelectedTokenReceive] = useState({
    name: "CTS",
    iconUrl: ETH_ICON,
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

  const InputBox = ({ inputText, selectedToken, onSelectToken }) => {
    const defaultToken = "ETH";
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
          >
            <img
              src={selectedToken.iconUrl || ETH_ICON}
              alt="icon"
              className={classes.defaultTokenIcon}
            />
            {selectedToken.name || defaultToken}
          </Button>

          <Typography align="right" className={classes.balancetext}>
            Balance: 0.00
          </Typography>
        </Box>
      </Box>
    );
  };

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
