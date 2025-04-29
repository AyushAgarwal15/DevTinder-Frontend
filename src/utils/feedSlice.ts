import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "./types";

const feedSlice = createSlice({
  name: "feed",
  initialState: null as User[] | null,
  reducers: {
    addUserToTheFeed: (state, action: PayloadAction<User[]>) => action.payload,
    removeUserFromFeed: (state, action: PayloadAction<string>) => {
      if (!state) return null;
      return state.filter((user) => user._id !== action.payload);
    },
    removeFeed: () => null,
  },
});

export const { addUserToTheFeed, removeUserFromFeed, removeFeed } =
  feedSlice.actions;
export default feedSlice.reducer;
