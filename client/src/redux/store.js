import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice.js";
import feedReducer from "./slices/feedSlice.js";
import storyReducer from "./slices/storySlice.js";
import reelsReducer from "./slices/reelsSlice.js";
import messageReducer from "./slices/messageSlice.js";
import notificationReducer from "./slices/notificationSlice.js";
import premiumReducer from "./slices/premiumSlice.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    feed: feedReducer,
    story: storyReducer,
    reels: reelsReducer,
    message: messageReducer,
    notification: notificationReducer,
    premium: premiumReducer,
  },
});