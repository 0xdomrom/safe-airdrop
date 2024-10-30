import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Accordion, AccordionSummary, AccordionDetails, Typography, Box, IconButton } from "@mui/material";
import { useDarkMode } from "src/hooks/useDarkMode";

import { Transfer } from "../hooks/useCsvParser";
import AssetIconDarkMode from "../static/assets-light.svg";
import AssetIcon from "../static/assets.svg";

import { TransactionTable } from "./assets/TransactionTable";

type SummaryProps = {
  transfers: Transfer[];
};

export const Summary = (props: SummaryProps): JSX.Element => {
  const { transfers } = props;
  const txCount = transfers.length;
  const darkMode = useDarkMode();
  return (
    <Box>
      <Typography mb={2} variant="h6" fontWeight={700}>
        Summary
      </Typography>

      <Accordion disabled={txCount === 0} sx={{ maxWidth: 1400, mb: 2, "&.Mui-expanded": { mb: 2 } }}>
        <AccordionSummary
          expandIcon={
            <IconButton size="small">
              <ExpandMoreIcon color="border" />
            </IconButton>
          }
          sx={{ "&.Mui-expanded": { backgroundColor: ({ palette }) => `${palette.background.paper} !important` } }}
        >
          <div
            style={{
              display: "flex",
              gap: "8px",
              width: "100%",
              alignItems: "center",
              justifyContent: "flex-start",
              flexDirection: "row",
            }}
          >
            <img src={darkMode ? AssetIconDarkMode : AssetIcon} alt="assets" width={26} height={26} />

            <Typography className="subtitle1" fontWeight={700}>
              Transactions
            </Typography>
            <div style={{ flex: 4 }}>
              <Typography>
                {`${txCount > 0 ? txCount : "no"} transactions${txCount > 1 || txCount === 0 ? "s" : ""}`}
              </Typography>
            </div>
          </div>
        </AccordionSummary>
        <AccordionDetails sx={{ padding: 0 }}>
          {txCount > 0 && <TransactionTable transferContent={transfers} />}
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};
