import { mount } from '@vue/test-utils';
import ShowPost from './ShowPost.vue';
import flushPromises from 'flush-promises';
import * as mockData from './mocks';
import { createStore, initialState, State } from './store';
import { makeRouter } from './router';

jest.mock('axios', () => ({
  get: (url: string) => ({
    data: [mockData.todayPost],
  })
}));

const createShowPost = async (initialState: State = undefined) => {
  const store = createStore(initialState);
  const router = makeRouter();
  await router.push('/posts/1');

  return mount(ShowPost, {
    global: {
      provide: {
        store,
      },
      plugins: [router]
    }
  });
};

describe('ShowPost', () => {
  it('does not render an edit link when no user is logged in', async () => {
    const wrapper = await createShowPost();
    await flushPromises();

    expect(wrapper.find('[data-test="can-edit"]').exists()).toBe(false);
  });

  it('does not render an edit link when not authorized', async () => {
    const wrapper = await createShowPost({
      ...initialState(),
      authors: {
        ...initialState().authors,
        currentUserId: '2',
      },
    });
    await flushPromises();

    console.log('wrapper.html()', wrapper.html());

    expect(wrapper.find('[data-test="can-edit"]').exists()).toBe(false);
  });

  it('renders an edit link when authorized', async () => {
    const wrapper = await createShowPost({
      ...initialState(),
      authors: {
        ...initialState().authors,
        currentUserId: '1',
      },
    });
    await flushPromises();

    expect(wrapper.find('[data-test="can-edit"]').exists()).toBe(true);
  });
});
