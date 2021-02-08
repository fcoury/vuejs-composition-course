import { mount } from '@vue/test-utils';
import Home from './Home.vue';
import flushPromises from 'flush-promises';
import * as mockData from './mocks';
import { createStore } from './store';

jest.mock('axios', () => ({
  get: (url: string) => ({
    data: [mockData.thisWeek, mockData.todayPost, mockData.thisMonth],
  })
}));

const createHome = () => {
  return mount(Home, {
    global: {
      provide: {
        store: createStore(),
      },
      components: {
        RouterLink: {
          template: '<div />',
        }
      }
    }
  });
};

describe('Home', () => {
  it('renders a loader', () => {
    const wrapper = createHome();
    expect(wrapper.find('[data-test="progress"]').exists()).toBe(true);
  });

  it('renders 3 time periods', async () => {
    const wrapper = createHome();
    await flushPromises();
    expect(wrapper.findAll('[data-test="period"]')).toHaveLength(3);
  });

  it('updates the period when clicked', async () => {
    const wrapper = createHome();
    await flushPromises();

    const [$today, $thisWeek, $thisMonth] = wrapper.findAll('[data-test="period"]');
    expect($today.classes()).toContain('is-active');

    await $thisWeek.trigger('click');
    expect($today.classes()).not.toContain('is-active');
    expect($thisWeek.classes()).toContain('is-active');

    await $thisMonth.trigger('click');
    expect($thisWeek.classes()).not.toContain('is-active');
    expect($thisMonth.classes()).toContain('is-active');
  });

  it(`renders today's post by default`, async () => {
    const wrapper = createHome();
    await flushPromises();

    expect(wrapper.findAll('[data-test="post"]')).toHaveLength(1);
  });

  it('renders selected post types', async () => {
    const wrapper = createHome();
    await flushPromises();

    expect(wrapper.findAll('[data-test="post"]')).toHaveLength(1);

    const [$today, $thisWeek, $thisMonth] = wrapper.findAll('[data-test="period"]');

    await $thisWeek.trigger('click');
    expect(wrapper.findAll('[data-test="post"]')).toHaveLength(2);

    await $thisMonth.trigger('click');
    expect(wrapper.findAll('[data-test="post"]')).toHaveLength(3);

    await $today.trigger('click');
    expect(wrapper.findAll('[data-test="post"]')).toHaveLength(1);
  });
});
