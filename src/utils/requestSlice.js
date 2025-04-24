import { createSlice } from "@reduxjs/toolkit";

const requestSlice = createSlice({
  name: "requests",
  initialState: null,
  reducers: {
    addRequests: (state, action) => action.payload,
    removeRequests: (state, action) => {
      if (!action.payload) return null;

      const updatedRequests = state.filter(
        (request) => request._id !== action.payload
      );
      return updatedRequests;
    },
  },
});

export const { addRequests, removeRequests } = requestSlice.actions;

export default requestSlice.reducer;
