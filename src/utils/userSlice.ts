import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "./types";

const userSlice = createSlice({
  name: "user",
  initialState: null as User | null,
  reducers: {
    addUser: (state, action: PayloadAction<User>) => action.payload,
    removeUser: () => null,
  },
});

export const { addUser, removeUser } = userSlice.actions;
export default userSlice.reducer;
