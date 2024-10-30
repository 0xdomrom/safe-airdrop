import { Box, Typography } from "@mui/material";
import React, { memo } from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { areEqual, FixedSizeList as List } from "react-window";

import { AssetTransfer } from "../../hooks/useCsvParser";

type TransactionTableProps = {
  transferContent: AssetTransfer[];
};

type RowProps = {
  index: number;
  style: any;
  data: AssetTransfer[];
};

type ListHeaderProps = {
  width: number;
};

const ListHeader = (props: ListHeaderProps) => {
  const { width } = props;
  return (
    <Box
      sx={{
        width,
        height: 60,
        display: "flex",
        flexDirection: "row",
        borderBottom: ({ palette }) => `1px solid ${palette.border.main}`,
        overflow: "hidden",
      }}
    >
      <div style={{ flex: 1, padding: 16, minWidth: 144 }}>
        <Typography>Address</Typography>
      </div>
      <div style={{ flex: 1, padding: 16, minWidth: 144 }}>
        <Typography>Eth Value</Typography>
      </div>
      <div style={{ flex: 1, padding: 16, minWidth: 80 }}>
        <Typography>Calldata</Typography>
      </div>
    </Box>
  );
};

const Row = memo((props: RowProps) => {
  const { index, style, data } = props;
  const row = data[index];
  return (
    <div style={style}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          borderBottom: ({ palette }) => `1px solid ${palette.border.light}`,
          alignItems: "center",
        }}
      >
        <div style={{ flex: "1", padding: 16, minWidth: 80 }}>
          <Typography>{row.address}</Typography>
        </div>
        <div style={{ flex: "1", padding: 16, minWidth: 80 }}>
          <Typography>{row.value}</Typography>
        </div>
        <div style={{ flex: "1", padding: 16, minWidth: 80 }}>
          <Typography>{row.calldata}</Typography>
        </div>
      </Box>
    </div>
  );
}, areEqual);

export const TransactionTable = (props: TransactionTableProps) => {
  const { transferContent } = props;
  return (
    <Box
      sx={{
        borderTop: ({ palette }) => `1px solid ${palette.border.main}`,
      }}
    >
      <AutoSizer disableHeight>
        {({ width }) => (
          <>
            <ListHeader width={width} />
            <List
              height={Math.min(460, transferContent.length * 64)}
              itemCount={transferContent.length}
              itemSize={64}
              width={width}
              itemData={transferContent}
            >
              {Row}
            </List>
          </>
        )}
      </AutoSizer>
    </Box>
  );
};
