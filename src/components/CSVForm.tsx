import { Box, Grid, Stack, Typography } from "@mui/material";

import { CSVEditor } from "./CSVEditor";

export interface CSVFormProps {}

export const CSVForm = (props: CSVFormProps): JSX.Element => {
  return (
    <Stack spacing={2}>
      <Box display="flex" mb={3} flexDirection="column" alignItems="center" gap={1}>
        <Typography variant="h6" fontWeight={700}>
          Paste your transaction CSV
        </Typography>
        <Typography variant="caption" sx={{ fontFamily: "monospace" }}>
          (address,calldata,value)
        </Typography>
      </Box>
      <Grid direction="row" container alignItems="start">
        <Grid item xs={12} md={11}>
          <CSVEditor />
        </Grid>
      </Grid>
    </Stack>
  );
};
