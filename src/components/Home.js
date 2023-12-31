import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";
import { currentGasPrice, truncateAddress } from "./CommonFunctions";
import tokenDepositABI from "../ABI/tokenDeposit.json";
import boneABI from "../ABI/boneABI.json";
import fromExponential from "from-exponential";
import Loader from "./Loader";
import ConnectWallet, { style } from "../components/connectorCards/WalletModal";
import jwtDecode from "jwt-decode";
import Header from "./Header";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Modal,
  Tooltip,
  IconButton,
} from "@mui/material";
import { makeStyles } from "tss-react/mui";
import { toast } from "react-toastify";
import WrongChain from "./WrongChain";

const Home = (props) => {
  const { classes } = useStyles();
  const { account, provider, connector } = useWeb3React();
  const lib = provider;
  const web3 = new Web3(lib?.provider);
  const [showLoader, setShowLoader] = useState(false);
  const [openWallets, setOpenWallets] = React.useState(false);
  const [paymentData, setPaymentData] = useState({});
  const [open, setOpen] = React.useState(false);
  const [approvalModal, setApprovalModal] = useState(false);
  const [isUserValid, setIsUserValid] = useState(false);
  const [isFinalTsx, setIsfinalTsx] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  async function fetchData(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  const getPaymentDetails = (data) => {
    setShowLoader(true);
    try {
      const apiUrl =
        data.base_url + "/" + data.end_point + "/" + data.document_id;
      fetchData(apiUrl)
        .then((data) => {
          if (data.message === "Document already updated") {
            setShowLoader(false);
            toast.error(data.message);
          } else {
            const decode = jwtDecode(data.token);
            setPaymentData(decode);
            if (account.toLowerCase() !== decode.user_address.toLowerCase()) {
              setIsUserValid(false);
              checkAllowance(decode);
            } else {
              setIsUserValid(true);
              setShowLoader(false);
            }
          }
        })
        .catch((error) => {
          console.error("Fetch error:", error);
          setShowLoader(false);
        });
    } catch (err) {
      setShowLoader(true);
    }
  };
  const submitHashToDb = async (hash) => {
    const url = paymentData.save_transaction;
    const data = {
      txn_hash: hash,
      document_id: paymentData.document_id,
      document_amount: paymentData.doc_amount,
      wallet_address: account,
      contract_address: paymentData.contract_address,
      token_address: paymentData.token_address,
      token_name: paymentData.symbol,
      transaction_amount: parseFloat(paymentData.doc_amount),
      decimal: paymentData.tokenDecimal,
      network: paymentData.token_network,
    };

    await fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response data
        console.log(data);
        setTimeout(() => {
          window.location.href = paymentData.callback_url;
        }, 3000);
      })
      .catch((error) => {
        // Handle errors
        console.error("Error:", error);
      });
  };

  const openExplorle = () => {
    window.open(paymentData.explorer + paymentData.hash);
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    // console.log("Query Parameters:", queryParams);
    const token = queryParams.get("token");
    if (!token) {
      console.error("Token is missing in the URL");
    } else {
      const data = jwtDecode(token);
      console.log(data);
      setPaymentData({
        callback_url: data.base_url + "/document/create/" + data.document_id, // https://app-dev.certicos.io/document/create/DOCS5I5ML5JWKRCC4S
      });
      if (account) {
        setOpenWallets(false);
      }
      if (token && account && provider) {
        setShowLoader(false);
        console.log({ token: token, length: token.split("").length });
        if (token.split("").length) {
          getPaymentDetails(jwtDecode(token));
        }
      }
    }
  }, [account, provider]);

  const checkAllowance = async (data) => {
    setShowLoader(true);
    try {
      const token = data.token_address;
      const instance = new web3.eth.Contract(boneABI, token);
      const allowance = Number(
        await instance.methods
          .allowance(account, data.contract_address)
          .call({ from: account }),
      );
      const symbol = await instance.methods.symbol().call();
      const tokenDecimal = Number(await instance.methods.decimals().call());
      const balance = Number(
        await instance.methods.balanceOf(account).call({ from: account }),
      );
      let approvalNedded;
      if (
        parseFloat(allowance / Math.pow(10, tokenDecimal)) >=
        parseFloat(data.doc_amount)
      ) {
        approvalNedded = false;
      } else {
        approvalNedded = true;
      }
      setPaymentData((pre) => ({
        ...pre,
        allowance,
        symbol,
        approvalNedded,
        tokenDecimal,
        balance: +balance / Math.pow(10, tokenDecimal),
      }));
      setShowLoader(false);
    } catch (err) {
      console.log(err);
      setShowLoader(false);
    }
  };

  const approveSender = async () => {
    setShowLoader(true);
    setApprovalModal(false);
    try {
      const user = account;
      const token = paymentData.token_address;
      const amount = web3.utils.toBN(
        fromExponential(
          parseFloat(paymentData.doc_amount) *
            Math.pow(10, paymentData.tokenDecimal),
        ),
      );
      const instance = new web3.eth.Contract(boneABI, token);
      const gasFee = await instance.methods
        .approve(paymentData.contract_address, amount)
        .estimateGas({ from: user });
      const encodedAbi = await instance.methods
        .approve(paymentData.contract_address, amount)
        .encodeABI();
      const CurrentgasPrice = await currentGasPrice(web3);
      await web3.eth
        .sendTransaction({
          from: user,
          to: token,
          gas: parseFloat(gasFee + 20000).toString(),
          gasPrice: CurrentgasPrice,
          data: encodedAbi,
        })
        .on("transactionHash", (res) => {
          console.log(res, "hash");
          setPaymentData((pre) => ({ ...pre, hash: res }));
        })
        .on("receipt", (res) => {
          console.log(res, "receipt");
          setShowLoader(false);
          setOpen(true);
        })
        .on("error", (res) => {
          console.log(res, "error");
          if (res.code === 4001) {
            toast.error("Transaction Denied!");
          } else {
            toast.error(res.message);
          }
          setApprovalModal(false);
          setShowLoader(false);
        });
    } catch (error) {
      console.log(error);
      setApprovalModal(false);
      setShowLoader(false);
    }
  };
  const callDepositToken = async () => {
    setShowLoader(true);
    try {
      const user = account;
      const amount = web3.utils.toBN(
        fromExponential(
          parseFloat(paymentData.doc_amount) *
            Math.pow(10, paymentData.tokenDecimal),
        ),
      );
      const instance = new web3.eth.Contract(
        tokenDepositABI,
        paymentData.contract_address,
      );
      const gasFee = await instance.methods
        .depositToken(amount)
        .estimateGas({ from: user });
      const encodedAbi = await instance.methods
        .depositToken(amount)
        .encodeABI();
      const CurrentgasPrice = await currentGasPrice(web3);
      await web3.eth
        .sendTransaction({
          from: user,
          to: paymentData.contract_address,
          gas: (parseFloat(gasFee) + 20000).toString(),
          gasPrice: CurrentgasPrice,
          data: encodedAbi,
        })
        .on("transactionHash", async (res) => {
          console.log(res, "hash");
          await submitHashToDb(res);
          setPaymentData((pre) => ({ ...pre, hash: res }));
          setShowLoader(false);
          setIsfinalTsx(true);
          setOpen(true);
        })
        .on("receipt", (res) => {
          console.log(res, "receipt");
        })
        .on("error", (res) => {
          console.log(res, "error test 1");
          if (res.code === 4001) {
            toast.error("Transaction Denied!");
          } else {
            toast.error(res.message);
          }
          setShowLoader(false);
        });
    } catch (error) {
      setShowLoader(false);
      console.log(error);
    }
  };

  const handlePaymentBtn = async () => {
    if (account) {
      if (paymentData.approvalNedded) {
        setApprovalModal(true);
      } else {
        await callDepositToken();
      }
    } else {
      setOpenWallets(true);
    }
  };

  const handleSuccessPopup = () => {
    if (isFinalTsx) {
      window.location.href = paymentData.callback_url;
    } else {
      setOpen(false);
      checkAllowance(paymentData);
    }
  };

  const handleCopyClick = () => {
    setIsCopied(true);
    navigator.clipboard.writeText(paymentData.hash);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  const handleButton = () => {
    if (account && paymentData) {
      if (paymentData.balance < parseFloat(paymentData.doc_amount)) {
        return "Insufficient Funds";
      } else if (paymentData.approvalNedded) {
        return "Accept Amount go to Approve";
      } else {
        return "Make Payment";
      }
    } else {
      return "Connect Wallet";
    }
  };

  return (
    <div>
      <Header url={paymentData.callback_url} />
      {showLoader && <Loader />}
      {openWallets && (
        <ConnectWallet handleClose={() => setOpenWallets(false)} />
      )}
      <WrongChain
        paymentData={paymentData}
        connector={connector}
        setShowLoader={setShowLoader}
      />
      <Container maxWidth={false} className={classes.mainContainder}>
        <Grid container className={classes.mainGrd}>
          <Grid item md={8} sm={10} className={classes.card}>
            <Box className={classes.hading}>
              <Typography align="center" className={classes.headingtext}>
                {account
                  ? paymentData.approvalNedded
                    ? "Document Transaction Price Details"
                    : "Payment Details"
                  : "Allow Certicos to Connect to your wallet"}
              </Typography>
            </Box>
            <Box sx={{ padding: "40px" }}>
              <Box>
                {account ? (
                  <Box>
                    <Box className={classes.contnet}>
                      <Box className={classes.contnet}>
                        <Typography className={classes.innerTExt}>
                          Price
                        </Typography>
                      </Box>
                      <Typography className={classes.innerTExt}>-</Typography>
                      <Typography className={classes.innerTExtleft}>
                        {paymentData.doc_amount} {paymentData.symbol}
                      </Typography>
                    </Box>
                    <Box className={classes.contnet}>
                      <Box className={classes.contnet}>
                        <Typography className={classes.innerTExt}>
                          Doc Size
                        </Typography>
                      </Box>
                      <Typography className={classes.innerTExt}>-</Typography>
                      <Typography className={classes.innerTExtleft}>
                        {paymentData.doc_size_in_kb
                          ? Number.parseFloat(
                              paymentData.doc_size_in_kb,
                            ).toFixed(2) + " KB"
                          : ""}
                      </Typography>
                    </Box>
                    <Box className={classes.contnet}>
                      <Box className={classes.contnet}>
                        <Typography className={classes.innerTExt}>
                          Selected Coin/Token
                        </Typography>
                      </Box>
                      <Typography className={classes.innerTExt}>-</Typography>
                      <Typography className={classes.innerTExtleft}>
                        {paymentData.symbol}
                      </Typography>
                    </Box>
                  </Box>
                ) : (
                  <Box className={classes.accountNot}>
                    <Typography
                      align="center"
                      className={classes.noAccountText}
                    >
                      Click to see available wallets and {"\n"}Web3 Dapps to
                      connect
                    </Typography>
                  </Box>
                )}
                <Button
                  onClick={() => handlePaymentBtn()}
                  variant="contained"
                  className={classes.buttonMain}
                  disabled={handleButton() === "Insufficient Funds"}
                >
                  {handleButton()}
                </Button>
                <Button
                  onClick={() => {
                    window.location.href = paymentData.callback_url;
                  }}
                  variant="contained"
                  className={classes.buttonCancel}
                >
                  Cancel
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
      <Modal
        open={open}
        onClose={() => handleSuccessPopup()}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className={classes.responsiveModal}>
          <Box className={classes.hading2}>
            <Typography align="center" className={classes.headingtext}>
              {paymentData.approvalNedded
                ? "Transaction Approved"
                : "CONGRATULATIONS !"}
            </Typography>
          </Box>
          <Grid sx={{ padding: "20px" }}>
            <Typography
              align="center"
              style={{ padding: "20px", fontSize: "15px", fontWeight: "600" }}
            >
              {paymentData.approvalNedded
                ? "Transaction Approved Successfully"
                : "Payment Submitted Successfully"}
            </Typography>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                paddingBottom: "5px",
              }}
            >
              <Typography align="center" className={classes.Txhash}>
                {truncateAddress(paymentData.hash)}
              </Typography>
              <Tooltip title={isCopied ? "Copied!" : "Copy Hash"}>
                <IconButton
                  className={classes.copyBtn}
                  onClick={(e) => handleCopyClick()}
                >
                  <ContentCopyIcon />
                </IconButton>
              </Tooltip>
            </div>
            <Typography
              onClick={() => openExplorle()}
              align="center"
              className={classes.TxCopy}
            >
              View on Explorer
            </Typography>
            <Button
              onClick={() => handleSuccessPopup()}
              variant="contained"
              className={classes.buttonMain}
            >
              Close
            </Button>
          </Grid>
        </Box>
      </Modal>
      <Modal
        open={approvalModal}
        onClose={() => setApprovalModal()}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className={classes.responsiveModal}>
          <Box className={classes.hading2}>
            <Typography align="center" className={classes.headingtext}>
              Approve Transaction
            </Typography>
          </Box>
          <Grid sx={{ padding: "20px" }}>
            <Typography
              align="center"
              style={{ padding: "10px", fontSize: "15px", fontWeight: "600" }}
            >
              Transaction approval needed!{" "}
            </Typography>
            <Box>
              <Typography align="center">
                Your final Approval is required to deduct The{" "}
                <b>
                  {paymentData.doc_amount} {paymentData.symbol}
                </b>{" "}
                from your wallet to Complete the transaction and submit your
                document to the Approver.
              </Typography>
            </Box>
            <Button
              onClick={() => approveSender()}
              variant="contained"
              className={classes.buttonMain}
            >
              Continue
            </Button>
          </Grid>
        </Box>
      </Modal>
      <Modal
        open={isUserValid}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className={classes.responsiveModal}>
          <Box className={classes.hading2}>
            <Typography align="center" className={classes.headingtext}>
              Unregistered Connection
            </Typography>
          </Box>
          <Grid sx={{ padding: "20px" }}>
            <Typography
              align="center"
              style={{ padding: "10px", fontSize: "15px", fontWeight: "600" }}
            >
              Unregistered Account Address!{" "}
            </Typography>
            <Box>
              <Typography align="center">
                Your Wallet address "<b>{truncateAddress(account)}</b>" is not
                same with the address you have given while registration, Kindly
                establish a connection with the "
                <b>{truncateAddress(paymentData.user_address)}</b>" in order to
                successfully finalize the transaction
              </Typography>
            </Box>
            <Button
              onClick={() => {
                window.location.href = paymentData.callback_url;
              }}
              variant="contained"
              className={classes.buttonCancel}
            >
              Cancel
            </Button>
          </Grid>
        </Box>
      </Modal>
    </div>
  );
};

export default Home;

export const useStyles = makeStyles()((theme) => {
  return {
    responsiveModal: {
      ...style,
      [theme.breakpoints.down("xs")]: {
        maxWidth: "300px",
      },
    },
    noAccountText: {
      fontSize: "20px",
      fontWeight: "600",
      lineHeight: "20px",
      padding: "30px 0",
    },
    accountNot: {},
    Txhash: {
      fontSize: "20px",
      fontWeight: "600",
      lineHeight: "20px",
    },
    modalH: {
      backgroundColor: "#00B5B8",
      width: "100%",
    },
    buttonMain: {
      width: "100%",
      color: "#FFFFFF",
      marginTop: "10px",
      textTransform: "none",
      fontSize: "18px",
    },
    buttonCancel: {
      width: "100%",
      color: "#FFFFFF",
      marginTop: "10px",
      textTransform: "none",
      fontSize: "18px",
      backgroundColor: "grey",
      "&:hover": {
        backgroundColor: "grey",
      },
    },
    copyBtn: {
      padding: "0px 5px",
    },
    TxCopy: {
      cursor: "pointer",
      padding: "0px",
      fontSize: "14px",
      color: "gray",
      textDecorationLine: "underline",
      paddingBottom: "10px",
      fontWeight: "bold",
      "&:hover": {
        color: "#00B5B8",
      },
    },
    headingtext: {
      fontSize: "20px",
      color: "#FFFFFF",
      fontWeight: "600",
    },
    innerTExt: {
      fontSize: "18px",
      color: "#404E67",
      fontWeight: "400",
    },
    innerTExtleft: {
      fontSize: "18px",
      color: "#404E67",
      fontWeight: "600",
    },
    contnet: {
      padding: "8px 0",
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
    },
    hading: {
      backgroundColor: "#00B5B8",
      width: "100%",
      padding: "15px 0",
    },
    hading2: {
      backgroundColor: "#00B5B8",
      width: "100%",
      padding: "15px 0",
      borderTopRightRadius: "12px",
      borderTopLeftRadius: "12px",
    },
    card: {
      margin: "auto",
      borderRadius: "14px",
      minWidth: "500px",
      boxShadow: "0px 4px 34px 0px rgba(0, 0, 0, 0.08)",
      [theme.breakpoints.down("xs")]: {
        minWidth: "300px",
      },
      [theme.breakpoints.between("sm", "xs")]: {
        minWidth: "350px",
      },
    },
    mainContainder: {
      paddingTop: "150px",
      width: "100%",
      height: "100vh",
    },
    mainGrd: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignContent: "center",
    },
  };
});
