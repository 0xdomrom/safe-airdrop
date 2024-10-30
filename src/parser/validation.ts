import { BigNumber } from "bignumber.js";
import { utils } from "ethers";

import { AssetTransfer, Transfer } from "../hooks/useCsvParser";

export const validateRow = (row: Transfer): string[] => {
  return [...areAddressesValid(row), ...isAmountPositive(row), ...isCalldataValid(row)];
};

const areAddressesValid = (row: Transfer): string[] => {
  const warnings: string[] = [];
  if (!(row.address === null || utils.isAddress(row.address))) {
    warnings.push(`Invalid Token Address: ${row.address}`);
  }
  if (row.address.includes(":")) {
    warnings.push(`The chain prefix must match the current network: ${row.address}`);
  } else {
    if (!utils.isAddress(row.address)) {
      warnings.push(`Invalid Receiver Address: ${row.address}`);
    }
  }
  return warnings;
};

const isAmountPositive = (row: AssetTransfer): string[] =>
  new BigNumber(row.value).isGreaterThanOrEqualTo(0) ? [] : ["Only positive amounts/values possible: " + row.value];

const isCalldataValid = (row: AssetTransfer): string[] =>
  row.calldata.match(/0x.*/) ? [] : [`Invalid calldata format, must be 0x...`];
