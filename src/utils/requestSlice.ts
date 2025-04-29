import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ConnectionRequest } from "./types";

const requestSlice = createSlice({
  name: "requests",
  initialState: null as ConnectionRequest[] | null,
  reducers: {
    addRequests: (state, action: PayloadAction<ConnectionRequest[]>) =>
      action.payload,
    removeRequests: (state, action: PayloadAction<string | null>) => {
      if (!action.payload || !state) return null;

      return state.filter((request) => request._id !== action.payload);
    },
  },
});

export const { addRequests, removeRequests } = requestSlice.actions;

export default requestSlice.reducer;
