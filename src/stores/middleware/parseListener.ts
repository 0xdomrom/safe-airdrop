import { Transfer } from "src/hooks/useCsvParser";

import { setTransfers, startParsing, stopParsing, updateCsvContent } from "../slices/csvEditorSlice";
import { CodeWarning, setCodeWarnings, setMessages } from "../slices/messageSlice";
import { AppStartListening } from "../store";

export const setupParserListener = (
  startListening: AppStartListening,
  parseCsv: (csvText: string) => Promise<[Transfer[], CodeWarning[]]>,
) => {
  const subscription = startListening({
    actionCreator: updateCsvContent,
    effect: async (action, listenerApi) => {
      const { csvContent } = action.payload;
      listenerApi.cancelActiveListeners();
      await listenerApi.delay(750);
      listenerApi.dispatch(startParsing());
      try {
        let [transfers, codeWarnings] = await parseCsv(csvContent);
        transfers = transfers.map((transfer, idx) => ({ ...transfer, position: idx + 1 }));
        listenerApi.dispatch(setTransfers(transfers));
        listenerApi.dispatch(setCodeWarnings(codeWarnings));
        listenerApi.dispatch(stopParsing());
      } catch (err) {
        listenerApi.dispatch(
          setMessages([
            {
              message: JSON.stringify(err),
              severity: "error",
            },
          ]),
        );
        listenerApi.dispatch(stopParsing());
      }
    },
  });

  return () => subscription();
};
