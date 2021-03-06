import { createApp } from 'vue';
import axios from 'axios';
import * as mockData from './mocks';
import 'highlight.js/styles/solarized-dark.css';
import random from 'lodash/random';

import { router } from './router';

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// @ts-ignore
axios.get = async (url: string) => {
  if (url === '/posts') {
    await delay(500);
    return Promise.resolve({
      data: [mockData.thisWeek, mockData.todayPost, mockData.thisMonth],
    });
  }
};

// @ts-ignore
axios.post = async (url: string, payload: Post) => {
  if (url === '/posts') {
    await delay(500);
    return Promise.resolve({
      data: { ...payload, id: random(100, 1000) },
    });
  }

  if (url === '/users') {
    await delay(500);
    const { id, password, ...rest } = payload;
    return Promise.resolve({
      data: { id: random(100, 1000), ...rest },
    });
  }
};

// @ts-ignore
axios.put = async (url: string, payload: Post) => {
  if (url === '/posts') {
    await delay(500);
    return Promise.resolve({
      data: payload,
    });
  }
};

import App from './App.vue';
console.log(App);

const app = createApp(App);
app.use(router);
app.mount('#app');
