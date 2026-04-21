import { createSlice } from "@reduxjs/toolkit";

const storySlice = createSlice({
  name: "story",
  initialState: {
    items: [],
  },
  reducers: {
    setStories: (state, action) => {
      state.items = action.payload;
    },
  },
});

export const { setStories } = storySlice.actions;
export default storySlice.reducer;