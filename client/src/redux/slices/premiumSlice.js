import { createSlice } from "@reduxjs/toolkit";

const premiumSlice = createSlice({
  name: "premium",
  initialState: {
    status: {
      isPremium: false,
      premiumPlan: null,
      premiumExpiry: null,
      premiumBadge: false,
    },
  },
  reducers: {
    setPremiumStatus: (state, action) => {
      state.status = action.payload;
    },
  },
});

export const { setPremiumStatus } = premiumSlice.actions;
export default premiumSlice.reducer;