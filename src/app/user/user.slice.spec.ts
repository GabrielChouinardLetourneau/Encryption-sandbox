import counterReducer, {
  LoadingStatus,
  UserState, UserStatus,
} from './user.slice';

describe('counter reducer', () => {
  const initialState: UserState = {
    currentUser: {
      username: 'foo',
      pw: 'bar'
    },
    userStatus: UserStatus.LOGGED_OUT,
    loadingStatus: LoadingStatus.IDLE,
  };
  it('should handle initial state', () => {
    expect(counterReducer(undefined, { type: 'unknown' })).toEqual({
      currentUser: {
        username: 'foo',
        pw: 'bar'
      },
      loggedIn: false,
      status: 'idle',
    });
  });

});
