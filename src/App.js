import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NewWeb3Provider from "./components/ProviderExample";
import Home from "./components/Home";
import NotFound from "./components/NotFound";
import { ThemeProvider } from "@mui/material";
import theme from "./components/CSS/Theme";
import { initializeConnector } from "@web3-react/core";
import { MetaMask } from "@web3-react/metamask";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swap from "./components/Swap";

// export const [metaMask, hooks] = initializeConnector(
//   (actions) => new MetaMask({ actions }),
// );

export default function App() {
  return (
    <>
      <NewWeb3Provider>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <Routes>
              <Route exact path="/" element={<Home />} />
              <Route exact path="/swap" element={<Swap />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          <ToastContainer position="bottom-center" theme="colored" />
        </ThemeProvider>
      </NewWeb3Provider>
    </>
  );
}
