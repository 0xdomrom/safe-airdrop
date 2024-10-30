import { BaseTransaction } from "@safe-global/safe-apps-sdk";

import { Transfer } from "../hooks/useCsvParser";

export function buildTransfers(transferData: Transfer[]): BaseTransaction[] {
  return transferData.map((transfer) => {
    return {
      to: transfer.address,
      value: transfer.value,
      data: transfer.calldata,
    };
  });
}
