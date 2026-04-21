import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { api } from "../../services/api";

export const fetchFeed = createAsyncThunk("feed/fetch", async (page = 1) => {
  const { data } = await api.get(`/posts/feed?page=${page}&limit=10`);
  return data;
});

const feedSlice = createSlice({
  name: "feed",
  initialState: {
    items: [],
    page: 1,
    hasMore: true,
    loading: false,
  },
  reducers: {
    prependPost: (state, action) => {
      state.items.unshift(action.payload);
    },
    resetFeed: (state) => {
      state.items = [];
      state.page = 1;
      state.hasMore = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.meta.arg === 1 ? action.payload.items : [...state.items, ...action.payload.items];
        state.page = action.payload.page;
        state.hasMore = action.payload.hasMore;
      })
      .addCase(fetchFeed.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { prependPost, resetFeed } = feedSlice.actions;
export default feedSlice.reducer;