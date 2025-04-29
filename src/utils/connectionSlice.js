import { createSlice } from "@reduxjs/toolkit";

const connectionSlice = createSlice({
  name: "connections",
  initialState: null,
  reducers: {
    addConnections: (state, action) => action.payload,
    removeConnections: () => null,
    removeConnection: (state, action) => {
      if (!state) return null;
      return state.filter((connection) => connection._id !== action.payload);
    },
  },
});

export const { addConnections, removeConnections, removeConnection } =
  connectionSlice.actions;

export default connectionSlice.reducer;
