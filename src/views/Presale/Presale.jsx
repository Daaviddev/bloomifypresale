import { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import TabPanel from "../../components/TabPanel";
import { changeApproval, changeDeposit } from "../../slices/PresaleThunk";
import { useWeb3Context } from "src/hooks/web3Context";
import { isPendingTxn, txnButtonText } from "src/slices/PendingTxnsSlice";
import {
  Paper,
  Grid,
  Typography,
  Box,
  Zoom,
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
} from "@material-ui/core";
import { trim } from "../../helpers";
import "./presale.scss";
import { Skeleton } from "@material-ui/lab";
import { error, info } from "../../slices/MessagesSlice";
import { ethers, BigNumber } from "ethers";

function Presale() {
  const dispatch = useDispatch();
  let isLoad = false;
  const { provider, address, connected, connect, chainID } = useWeb3Context();

  const signer = provider.getSigner();
  console.log('debug', signer)
  const [quantity, setQuantity] = useState("");
  const pendingTransactions = useSelector(state => {
    return state.pendingTransactions;
  });
  const price = useSelector(state => {
    return state.app.price;
  });
  const usdcBalance = useSelector(state => {
    return state.account.balances && state.account.balances.usdc;
  });
  const isAddedWhitelist = useSelector(state => {
    return state.account.presale && state.account.presale.isWhiteList;
  });
  const minusdcBalance = useSelector(state => {
    return state.app.minUsdtLimit;
  });
  const tokenAmount = useSelector(state => {
    return state.app.totalTokenAmount
  }); 
  const totalTokenAmountToDistribute = useSelector(state => {
    return state.app.totalTokenAmountToDistribute;
  });
  const isList = useSelector(state => {
    return state.app.isList;
  });
  const isPresaleOpen = useSelector(state => {
    return state.app.isPresaleOpen;
  });
  
  if (!isLoad && usdcBalance && (Number(usdcBalance) - Number(minusdcBalance) < 0)) {
    dispatch(info("You got not enough $USDC.e."));
    isLoad = true;
  }
  if (isList && !isAddedWhitelist) {
    dispatch(info("You are not on the whitelist."));
  }
  const setMax = () => {
    setQuantity(usdcBalance);
  };
  
  const onSeekApproval = async token => {
    await dispatch(changeApproval({ address, token, provider, networkID: chainID }));
  };
  const presaleAllowance = useSelector(state => {
    return state.account.presale && state.account.presale.presaleAllowance;
  });
  const tokenBought = totalTokenAmountToDistribute / 1000000000000000000;
  const tokensRemain = tokenAmount - tokenBought;
  const onChangeDeposit = async action => {
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(quantity) || quantity === 0 || quantity === "") {
      // eslint-disable-next-line no-alert
      return dispatch(error("Please enter a value!"));
    }

    // 1st catch if quantity > balance
    let gweiValue = ethers.utils.parseUnits(quantity, "mwei");

    if (action === "presale" && gweiValue.gt(ethers.utils.parseUnits(usdcBalance, "mwei"))) {
      return dispatch(error("You cannot deposit more than your USDC.e balance."));
    }

    await dispatch(changeDeposit({ address, action, value: quantity.toString(), provider, networkID: chainID }));
  };
  const hasAllowance = useCallback(
    token => {
      if (token === "usdc") return presaleAllowance > 0;
      return 0;
    },
    [presaleAllowance],
  );
  const isAllowanceDataLoading = presaleAllowance == null;
  return (
    <div id="dashboard-view">
      <div className="presale-header">
        <h1 className = "headtext">Bloomify Presale</h1>
        {/* <p>Whitelist is needed for this presale!</p> */}
      </div>
      <Paper className={`ohm-card`}>
        <Grid container direction="column" spacing={2}>
          <Grid item>
            <div className="card-header">
              <Typography variant="h5">BLOOMIFY PRESALE</Typography>
            </div>
          </Grid>
           <Grid item>
            <div className="stake-top-metrics">
              <Typography className="presale-items">You are able to purchase up to 500 <span className="">$pNCTR</span> tokens.</Typography>
            </div>
          </Grid> 
          {totalTokenAmountToDistribute && totalTokenAmountToDistribute && 
            <Grid item>
              <div className="stake-top-metrics data-row-centered" style={{marginBottom: "18px"}}>
                <Typography className="presale-items">Tokens bought:</Typography>
                <Typography className="presale-items" style={{marginLeft: "16px"}}><span className="">{tokenBought.toFixed(3)} $pNCTR</span></Typography>
              </div>
              <div className="stake-top-metrics data-row-centered" style={{marginBottom: "18px"}}>
                <Typography className="presale-items">Tokens left:</Typography>
                <Typography className="presale-items" style={{marginLeft: "16px"}}><span className="">{tokensRemain.toFixed(3)} $pNCTR</span></Typography>
              </div>
            </Grid>
          }
          
           <Grid item>
            <div className="stake-top-metrics" style={{ whiteSpace: "normal" }}>
              <Box alignItems="center" justifyContent="center" flexDirection="column" display="flex">
                {address && !isAllowanceDataLoading ? (
                  !hasAllowance("usdc") ? (
                    <Box className="help-text">
                      <Typography variant="body1" className="stake-note" color="textSecondary">
                        <>
                          First time deposit <b>USDC.e</b>?
                          <br />
                          Please approve NCTR to use your <b>USDC.e</b> for presale.
                        </>
                      </Typography>
                    </Box>
                  ) : (
                    <>
                      {/* <Grid item xs={12} sm={3} md={3} lg={3} /> */}
                      <Box item xs={12} sm={6} md={6} lg={6}>
                        <FormControl className="ohm-input" variant="outlined" color="primary">
                          <InputLabel htmlFor="amount-input"></InputLabel>
                          <OutlinedInput
                            id="amount-input"
                            type="number"
                            placeholder="Enter an amount"
                            className="stake-input"
                            value={quantity}
                            width="100%"
                            onChange={e => setQuantity(e.target.value)}
                            labelWidth={0}
                            endAdornment={
                              <InputAdornment position="end">
                                <Button variant="text" onClick={setMax} color="inherit">
                                  Max
                                </Button>
                              </InputAdornment>
                            }
                          />
                        </FormControl>
                      </Box>
                    </>
                  )
                ) : (
                  <Skeleton width="35%" />
                )}

                {isAllowanceDataLoading ? (
                  <Skeleton width="35%" />
                ) : address && hasAllowance("usdc") ? (
                  <>
                    {/* <Grid item xs={12} sm={2} md={2} lg={2} /> */}
                    <Box alignItems="center" justifyContent="center" flexDirection="column" display="flex">
                      <Typography className="typop" style={{marginTop: "16px"}}>Enter Amount in $USDC.e</Typography>
                      <Typography className="typop" style={{marginTop: "16px"}}>1 $pNCTR = 1 $USDC.e</Typography>
                      <Typography className="typop" style={{marginTop: "16px"}}>Min Buy: 100 $USDC.e</Typography>
                      <Typography className="typop" style={{marginTop: "16px"}}>Max Buy: 500 $USDC.e</Typography>     
                      <Typography className="typop" style={{marginTop: "16px"}}>Buy 500 $pNCTR get free</Typography>   
                      <Typography className="typop" style={{marginTop: "16px"}}>deer ntf/bloom nft/20% bonus</Typography>                     
                      <Button
                        className="stake-button"
                        variant="contained"
                        color="primary"
                        disabled={isPendingTxn(pendingTransactions, "deposit")}
                        style={{marginTop: "16px"}}
                        onClick={() => {
                          onChangeDeposit("presale");
                        }}
                      >
                        {txnButtonText(pendingTransactions, "deposit", "BUY")}
                      </Button>
                    </Box>
                  </>
                ) : (
                  <Box>
                    <Button
                      className="stake-button"
                      variant="contained"
                      color="primary"
                      disabled={isPendingTxn(pendingTransactions, "approve_deposit")}
                      onClick={() => {
                        onSeekApproval("usdc");
                      }}
                    >
                      {txnButtonText(pendingTransactions, "approve_deposit", "Approve")}
                    </Button>
                  </Box>
                )}
              </Box>
            </div>
          </Grid>
          <Grid item>
            <Typography className="presale-items" varient="h4"></Typography>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
}

export default Presale;
