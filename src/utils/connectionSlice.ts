import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Connection } from "./types";

const connectionSlice = createSlice({
  name: "connections",
  initialState: null as Connection[] | null,
  reducers: {
    addConnections: (state, action: PayloadAction<Connection[]>) =>
      action.payload,
    removeConnections: () => null,
    removeConnection: (state, action: PayloadAction<string>) => {
      if (!state) return null;
      return state.filter((connection) => connection._id !== action.payload);
    },
  },
});

export const { addConnections, removeConnections, removeConnection } =
  connectionSlice.actions;

export default connectionSlice.reducer;
