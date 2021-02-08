import moment from 'moment';
import { createStore, initialState, State, store } from './store';

const mockPost = {
  id: 1,
  authorId: 1,
  title: 'Test post',
  markdown: 'hello',
  html: 'hello',
  created: moment(),
};

jest.mock('axios', () => ({
  get: () => {
    return {
      data: [mockPost],
    };
  }
}));

describe('fetchPosts', () => {
  it('fetches posts and updates the store', async () => {
    const expected: State = {
      ...initialState(),
      posts: {
        ...initialState().posts,
        all: {
          1: mockPost,
        },
        ids: ['1'],
        loaded: true,
      },
    };

    const store = createStore();
    await store.fetchPosts();

    expect(store.getState()).toEqual(expected);
  });
});
