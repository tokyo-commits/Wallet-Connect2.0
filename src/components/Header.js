import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { makeStyles } from "tss-react/mui";
import { pallete } from "../components/CSS/common";

export default function PrimarySearchAppBar({ url }) {
  const { classes } = useStyles();
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Box
            onClick={() => (window.location.href = url)}
            className={classes.toolBar}
          >
            <img className={classes.appLogo} src="logo.png" alt="" />
            <Typography
              color="secondary"
              variant="h2"
              sx={{ margin: "auto 0" }}
            >
              CERTICOS
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

const useStyles = makeStyles()((theme) => {
  return {
    buttons: {
      display: "flex",
      [theme.breakpoints.down("lg")]: {
        display: "flex",
      },
    },
    loginBtn: {
      backgroundColor: pallete.darkPrimary,
      padding: "15px 25px",
      fontSize: "16px",
      lineHeight: "20px",
      borderRadius: "15px",
      margin: "0 5px",
      "&:hover": {
        backgroundColor: pallete.primaryOrange,
      },
    },
    loginBtn2: {
      backgroundColor: "#FFFFFF",
      border: "1px solid #000",
      color: pallete.darkPrimary,
      padding: "15px 25px",
      fontSize: "16px",
      lineHeight: "20px",
      borderRadius: "15px",
      margin: "0 5px",
      "&:hover": {
        backgroundColor: pallete.primaryOrange,
        color: "#FFFFFF",
        border: "1px solid #FFFFFF",
      },
    },
    crossIcon: {
      [theme.breakpoints.up("sm")]: {
        display: "none",
      },
      position: "fixed",
      top: 0,
      right: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      color: "#FFFFFF",
    },
    options: {
      cursor: "pointer",
      margin: "auto 20px",
    },
    moreOptions: {
      display: "flex",
      cursor: "pointer",
      margin: "auto 20px",
    },
    textHover: {
      color: pallete.darkPrimary,
      fontSize: "16px",
      lineHeight: "20px",
      "&:hover": {
        color: pallete.primaryOrange,
      },
    },
    btns: {
      width: "90%",
      margin: "0 5px",
      fontSize: "14px",
      padding: "5px 10px",
    },
    mainMenu: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    },
    downArrow: {
      margin: "auto 10px",
    },
    appLogo: {
      height: "60px",
      borderRadius: "4px",
      width: "60px",
      padding: "0 10px ",
      [theme.breakpoints.down("sm")]: {
        height: "50px",
        borderRadius: "4px",
        width: "50px",
      },
    },
    renderMoile: {
      color: "#110d2e",
    },
    appBar: {
      backgroundColor: "#FFFFFF",
      padding: "10px",
      zIndex: 0,
      [theme.breakpoints.up("md")]: {
        padding: "10px 30px",
      },
    },
    toolBar: {
      display: "flex",
      flexDirection: "row",
      cursor: "pointer",
    },
    menuicon: {
      display: "flex",
      [theme.breakpoints.up("lg")]: {
        display: "none",
      },
    },
    navOptions: {
      display: "none",
      [theme.breakpoints.up("lg")]: {
        display: "flex",
      },
    },
    searchBar: {
      backgroundColor: "#FFFFFF",
      [theme.breakpoints.down("xs")]: {
        display: "none",
      },
    },
  };
});
