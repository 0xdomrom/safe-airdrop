import { useCallback } from "react";
import { usePapaParse } from "react-papaparse";
import { validateRow } from "src/parser/validation";
import { CodeWarning } from "src/stores/slices/messageSlice";

export type Transfer = AssetTransfer;

export interface AssetTransfer {
  address: string;
  value: string;
  calldata: string;
}

export type CSVRow = {
  address: string;
  value: string;
  calldata: string;
};

enum HEADER_FIELDS {
  ADDRESS = "address",
  VALUE = "value",
  CALLDATA = "calldata",
}

const generateWarnings = (
  // We need the row parameter because of the api of fast-csv
  _row: Transfer,
  rowNumber: number,
  warnings: string[],
) => {
  const messages: CodeWarning[] = warnings.map((warning: string) => ({
    message: warning,
    severity: "warning",
    lineNum: rowNumber,
  }));
  return messages;
};

const countLines = (text: string) => text.split(/\r\n|\r|\n/).length;

export const useCsvParser = (): { parseCsv: (csvText: string) => Promise<[Transfer[], CodeWarning[]]> } => {
  const { readString } = usePapaParse();

  const parseCsv = useCallback(
    async (csvText: string): Promise<[Transfer[], CodeWarning[]]> => {
      return new Promise<[Transfer[], CodeWarning[]]>((resolve, reject) => {
        const numLines = countLines(csvText);
        // Hard limit at 500 lines of txs
        if (numLines > 501) {
          reject("Max number of lines exceeded. Due to the block gas limit transactions are limited to 500 lines.");
          return;
        }

        readString(csvText, {
          header: true,
          worker: true,
          complete: async (results) => {
            // Check headers
            const unknownFields = results.meta.fields?.filter(
              (field) => !Object.values<string>(HEADER_FIELDS).includes(field),
            );

            if ((unknownFields && unknownFields?.length > 0) || results.meta.fields?.length !== 3) {
              resolve([
                [],
                [
                  {
                    lineNum: 0,
                    message: `Unknown header field(s): ${unknownFields.join(", ")}`,
                    severity: "error",
                  },
                ],
              ]);
              return;
            }
            const csvRows = results.data as CSVRow[];
            const numberedRows = csvRows
              .map((row, idx) => ({ content: row, lineNum: idx + 1 }))
              // Empty rows have no receiver
              .filter((row) => row.content.address !== undefined && row.content.address !== "");
            const transformedRows: (Transfer & { lineNum: number })[] = await Promise.all(
              numberedRows.map((row) => {
                return {
                  ...row.content,
                  lineNum: row.lineNum,
                };
              }),
            );

            // validation warnings
            const resultingWarnings = transformedRows.map((row) => {
              const validationWarnings = validateRow(row);
              return generateWarnings(row, row.lineNum, validationWarnings);
            });

            // add syntax errors
            resultingWarnings.push(
              results.errors.map((error) => ({
                lineNum: error.row + 1,
                message: error.message,
                severity: "error",
              })),
            );

            const validRows = transformedRows.filter((_, idx) => resultingWarnings[idx]?.length === 0) as Transfer[];
            resolve([validRows, resultingWarnings.flat()]);
          },
        });
      });
    },
    [readString],
  );

  return {
    parseCsv,
  };
};
