import { createSlice } from "@reduxjs/toolkit";

const reelsSlice = createSlice({
  name: "reels",
  initialState: {
    items: [],
  },
  reducers: {
    setReels: (state, action) => {
      state.items = action.payload;
    },
  },
});

export const { setReels } = reelsSlice.actions;
export default reelsSlice.reducer;