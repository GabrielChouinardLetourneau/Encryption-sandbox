import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { decryptInfos, encryptInfos, loginToAPI } from '../../service/user.api';
import { DecryptInfosResponse, EncryptInfosResponse, LoginResponse, PrivateInfos, PrivateInfosKey, User } from './user.types';

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
    infos?: string
  };
  userStatus: UserStatus;
  status: {
    ok: boolean;
    message: string;
  };
  loadingStatus: LoadingStatus;
}

const initialState: UserState = {
  currentUser: {
    username: '',
    pw: '',
  },
  status: {
    ok: false,
    message: '',
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
  async (infos: PrivateInfos): Promise<EncryptInfosResponse> => {
    const response = await encryptInfos(infos);
    return response;
  }
);

export const retrieveInfos = createAsyncThunk(
  'user/retrieveInfos',
  async (key: PrivateInfosKey): Promise<DecryptInfosResponse> => {
    const response = await decryptInfos(key);
    return response;
  }
);

export const userSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: (builder) => {
    const sharedPendingReducers = (state: UserState) => {
      if (state.loadingStatus !== LoadingStatus.LOADING) {
        state.loadingStatus = LoadingStatus.LOADING;
      }
    }

    builder.addCase(loginUser.pending, sharedPendingReducers);
    builder.addCase(loginUser.fulfilled, 
      (state, action) => {
        if (state.loadingStatus !== LoadingStatus.IDLE) {
          state.loadingStatus = LoadingStatus.IDLE;
          
          if (action.payload.loggedIn) sessionStorage.setItem("loggedIn", "true");
          state.status.message = action.payload.message;
          state.status.ok = action.payload.ok;
        }
      }
    );

    builder.addCase(sendInfos.pending, sharedPendingReducers);
    builder.addCase(sendInfos.fulfilled, 
      (state, action) => {
        if (state.loadingStatus !== LoadingStatus.IDLE) {
          state.loadingStatus = LoadingStatus.IDLE;

          state.status.message = action.payload.message;
          state.status.ok = action.payload.ok;
          sessionStorage.setItem("key", action.payload.key)
        }
      }
    );

    builder.addCase(retrieveInfos.pending, sharedPendingReducers);
    builder.addCase(retrieveInfos.fulfilled, 
      (state, action) => {
        if (state.loadingStatus !== LoadingStatus.IDLE) {
          state.loadingStatus = LoadingStatus.IDLE;

          state.status.message = action.payload.message;
          state.status.ok = action.payload.ok;
          state.currentUser.infos = action.payload.infos;    
        }
      }
    );
  },
});

export const { reset } = userSlice.actions;

export const selectUser = (state: RootState) => state.user;

export default userSlice.reducer;
