import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { API_BASE_URL, api, setAuthToken } from "../../services/api";
import { connectSocket, disconnectSocket } from "../../socket/socket";

const initialToken = localStorage.getItem("peekpost_access_token") || "";
const initialUser = localStorage.getItem("peekpost_user");

if (initialToken) {
  setAuthToken(initialToken);
  connectSocket(initialToken);
}

const getApiErrorMessage = (error) => {
  if (!error.response) {
    return `Unable to reach server at ${API_BASE_URL}. Check frontend env VITE_API_BASE_URL (or VITE_API_URL) and backend CORS.`;
  }

  return error.response?.data?.message || error.message || "Something went wrong";
};

export const login = createAsyncThunk("auth/login", async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post("/auth/login", payload);
    return data;
  } catch (error) {
    return rejectWithValue(getApiErrorMessage(error));
  }
});

export const register = createAsyncThunk("auth/register", async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post("/auth/register", payload);
    return data;
  } catch (error) {
    return rejectWithValue(getApiErrorMessage(error));
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: initialUser ? JSON.parse(initialUser) : null,
    accessToken: initialToken,
    loading: false,
    error: null,
  },
  reducers: {
    logoutLocal: (state) => {
      state.user = null;
      state.accessToken = "";
      localStorage.removeItem("peekpost_access_token");
      localStorage.removeItem("peekpost_user");
      setAuthToken("");
      disconnectSocket();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        localStorage.setItem("peekpost_access_token", action.payload.accessToken);
        localStorage.setItem("peekpost_user", JSON.stringify(action.payload.user));
        setAuthToken(action.payload.accessToken);
        connectSocket(action.payload.accessToken);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        localStorage.setItem("peekpost_access_token", action.payload.accessToken);
        localStorage.setItem("peekpost_user", JSON.stringify(action.payload.user));
        setAuthToken(action.payload.accessToken);
        connectSocket(action.payload.accessToken);
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { logoutLocal } = authSlice.actions;
export default authSlice.reducer;
