import counterReducer, {
  UserState,
} from './user.slice';

describe('counter reducer', () => {
  const initialState: UserState = {
    currentUser: {
      name: 'foo',
      pw: 'bar'
    },
    loggedIn: false,
    status: 'idle',
  };
  it('should handle initial state', () => {
    expect(counterReducer(undefined, { type: 'unknown' })).toEqual({
      value: 0,
      loggedIn: false,
      status: 'idle',
    });
  });

  // it('should handle incrementByAmount', () => {
  //   const actual = counterReducer(initialState, incrementByAmount(2));
  //   expect(actual.value).toEqual(5);
  // });
});
