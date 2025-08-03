import {
  createSelector,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import TokenStorage from "../../services/tokenStorage";
import type { RootState } from "../store";
import storage from "redux-persist/lib/storage";
import persistReducer from "redux-persist/es/persistReducer";

const accessToken = TokenStorage.getAccessToken();
const refreshToken = TokenStorage.getRefreshToken();

// Types
interface TokenPair {
  access: string;
  refresh: string;
}

interface User {
  email: string;
  first_name: string;
  last_name: string;
  username: string;
  role: "manager" | "staff";
  id: number;
  is_active: boolean;
}

interface AuthState {
  tokens: TokenPair | null;
  user: User | null;
  isAuthenticated: boolean;
}

interface LoginPayload {
  tokens: TokenPair;
  user: User;
}

const initialState: AuthState = {
  tokens: {
    access: accessToken!,
    refresh: refreshToken!,
  },
  user: null,
  isAuthenticated: !!accessToken,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<LoginPayload>) => {
      const { tokens, user } = action.payload;

      state.tokens = tokens;
      state.user = user;
      state.isAuthenticated = true;

      TokenStorage.setTokens({
        accessToken: state.tokens.access,
        refreshToken: state.tokens.refresh,
      });
    },

    logout: (state) => {
      state.tokens = null;
      state.user = null;
      state.isAuthenticated = false;

      TokenStorage.clearTokens();
    },
  },
});

const persistConfig = {
  key: "user-profile",
  storage,
  whitelist: ["user"],
  debug: true,
};

const persistedProfileReducer = persistReducer(
  persistConfig,
  authSlice.reducer
);

export const { login, logout } = authSlice.actions;

export const selectAuth = (state: RootState) => state.auth;

export const getIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;

export const getUserProfile = createSelector([selectAuth], (auth) => ({
  user: auth.user,
}));

export default persistedProfileReducer;
