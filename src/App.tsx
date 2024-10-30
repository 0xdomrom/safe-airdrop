import { Box, Button, Card, CircularProgress, Grid, Typography, useTheme } from "@mui/material";
import { useSafeAppsSDK } from "@safe-global/safe-apps-react-sdk";
import { GatewayTransactionDetails } from "@safe-global/safe-apps-sdk";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Unsubscribe } from "redux";

import { CSVForm } from "./components/CSVForm";
import { MessageSnackbar } from "./components/MessageSnackbar";
import { Summary } from "./components/Summary";
import { TransactionStatusScreen } from "./components/TransactionStatusScreen";
import { useCsvParser } from "./hooks/useCsvParser";
import CheckIcon from "./static/check.svg";
import AppIcon from "./static/logo.png";
import { setupParserListener } from "./stores/middleware/parseListener";
import { setSafeInfo } from "./stores/slices/safeInfoSlice";
import { RootState, startAppListening } from "./stores/store";
import { buildTransfers } from "./transfers/transfers";

import "./styles/globals.css";

const App: React.FC = () => {
  const theme = useTheme();
  const { sdk, safe } = useSafeAppsSDK();

  const { messages } = useSelector((state: RootState) => state.messages);
  const errorMessages = useMemo(() => messages.filter((msg) => msg.severity !== "success"), [messages]);
  const { transfers, parsing } = useSelector((state: RootState) => state.csvEditor);

  const [pendingTx, setPendingTx] = useState<GatewayTransactionDetails>();
  const { parseCsv } = useCsvParser();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSafeInfo(safe));
    const subscriptions: Unsubscribe[] = [setupParserListener(startAppListening, parseCsv)];
    return () => subscriptions.forEach((unsubscribe) => unsubscribe());
  }, [dispatch, safe, sdk, parseCsv]);

  const submitTx = useCallback(async () => {
    try {
      const sendTxResponse = await sdk.txs.send({ txs: buildTransfers(transfers) });
      const safeTx = await sdk.txs.getBySafeTxHash(sendTxResponse.safeTxHash);
      setPendingTx(safeTx);
    } catch (e) {
      console.error(e);
    }
  }, [transfers, sdk.txs]);

  return (
    <Box
      sx={{
        maxWidth: "950px",
        paddingTop: "24px",
        position: "relative",
        margin: "auto",
      }}
    >
      <Box display="flex" flexDirection="column" justifyContent="left">
        {
          <>
            <Box display="flex" flexDirection="column" gap={2}>
              <Grid container>
                <Grid item xs={4}>
                  <Box>
                    <Typography mb={2} variant="h3" fontWeight={700} display="flex" alignItems="center" gap={1}>
                      <img src={AppIcon} width="32px" height="32px" alt="logo" /> CSV Transactions
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs display="flex" alignItems="center" gap={2}>
                  <img
                    src={CheckIcon}
                    alt="check"
                    width={24}
                    height={24}
                    style={{ background: theme.palette.background.light, borderRadius: "12px" }}
                  />
                  <Typography>
                    Send arbitrary transactions defined by address and raw calldata to multiple recipients at once.
                  </Typography>
                </Grid>
              </Grid>

              {!pendingTx && (
                <Card sx={{ padding: 2 }}>
                  <CSVForm />
                </Card>
              )}
              <Card sx={{ padding: 2 }}>
                <Summary transfers={transfers} />
                {pendingTx ? (
                  <TransactionStatusScreen tx={pendingTx} reset={() => setPendingTx(undefined)} />
                ) : (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Button
                      variant="contained"
                      sx={{ alignSelf: "flex-start", display: "flex", marginTop: 2, marginBottom: 2, gap: 1 }}
                      size="stretched"
                      color={messages.length === 0 ? "primary" : "error"}
                      onClick={submitTx}
                      disabled={parsing || transfers.length === 0}
                    >
                      {parsing && <CircularProgress size={24} color="primary" />}
                      {errorMessages.length === 0 ? "Submit" : "Submit with errors"}
                    </Button>
                    <MessageSnackbar />
                  </Box>
                )}
              </Card>
            </Box>
          </>
        }
      </Box>
    </Box>
  );
};

export default App;
