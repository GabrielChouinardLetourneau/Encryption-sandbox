import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { encryptInfos, loginToAPI } from '../../service/user.api';
import { LoginResponse, User } from './user.types';

export enum LoadingStatus {
  IDLE = "idle",
  LOADING = "loading",
  FAILED = "failed"
}

export enum UserStatus {
  LOGGED_IN = "logged-in",
  LOGGED_OUT = "logged-out",
}

export interface UserState {
  currentUser: {
    username: string
    pw: string
  };
  userStatus: UserStatus;
  statusMessage?: string;
  loadingStatus: LoadingStatus;
}

const initialState: UserState = {
  currentUser: {
    username: '',
    pw: '',
  },
  userStatus: UserStatus.LOGGED_OUT,
  loadingStatus: LoadingStatus.IDLE,
};

export const loginUser = createAsyncThunk(
  'user/login',
  async (user: User): Promise<LoginResponse> => {
    const response = await loginToAPI(user);
    return response;
  }
);

export const sendInfos = createAsyncThunk(
  'user/sendInfos',
  async (infos: string): Promise<LoginResponse> => {
    const response = await encryptInfos(infos);
    console.log("sendInfos---", response);
    return response;
  }
);

export const userSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    reset: (state) => {
      state = initialState;
    }
  },
  extraReducers: (builder) => {
    const sharedPendingReducers = (state: UserState) => {
      if (state.loadingStatus !== LoadingStatus.LOADING) {
        state.loadingStatus = LoadingStatus.LOADING;
      }
    }

    builder.addCase(loginUser.pending, sharedPendingReducers);
    builder.addCase(loginUser.fulfilled, (state, action) => {
        if (state.loadingStatus !== LoadingStatus.IDLE) {
          state.loadingStatus = LoadingStatus.IDLE;
          console.log(action);

          state.statusMessage = action.payload.message;
          state.userStatus = UserStatus.LOGGED_IN;
        }
      });

    builder.addCase(sendInfos.pending, sharedPendingReducers);
    builder.addCase(sendInfos.fulfilled, (state, action) => {
        if (state.loadingStatus !== LoadingStatus.IDLE) {
          state.loadingStatus = LoadingStatus.IDLE;

          state.statusMessage = action.payload.message;
        }
      });
  },
});

export const { reset } = userSlice.actions;

export const selectUser = (state: RootState) => state.user;

export default userSlice.reducer;
