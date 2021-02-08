import { inject, provide, reactive, readonly } from 'vue';
import axios from 'axios';
import { Author, Post, User } from './types';
import string from '*.txt';

interface PostState {
  ids: string[];
  all: Record<string, Post>;
  loaded: boolean;
}

interface AuthorState {
  ids: string[];
  all: Record<string, Author>;
  loaded: boolean;
  currentUserId?: string;
}

export interface State {
  authors: AuthorState;
  posts: PostState;
}

const initialPostsState = (): PostState => ({
  all: {},
  ids: [],
  loaded: false,
});

const initialAuthorsState = (): AuthorState => ({
  all: {},
  ids: [],
  loaded: false,
  currentUserId: undefined,
});

export const initialState = (): State => ({
  authors: initialAuthorsState(),
  posts: initialPostsState(),
});

class Store {
  protected state: State;

  constructor(initialState: State) {
    this.state = reactive(initialState);
  }

  public getState() {
    return readonly(this.state);
  }

  async createUser(user: User) {
    const response = await axios.post<Author>('/users', user);
    this.state.authors.all[response.data.id] = response.data;
    this.state.authors.ids.push(response.data.id.toString());
    this.state.authors.currentUserId = response.data.id.toString();
  }

  async createPost(post: Post) {
    const response = await axios.post<Post>('/posts', post);
    this.state.posts.all[response.data.id] = response.data;
    this.state.posts.ids.push(response.data.id.toString());
  }

  async updatePost(post: Post) {
    const response = await axios.put<Post>('/posts', post);
    console.log('response.data', response.data);
    this.state.posts.all[response.data.id] = response.data;
  }

  async fetchPosts() {
    const response = await axios.get<Post[]>('/posts');

    for (const post of response.data) {
      if (!this.state.posts.ids.includes(post.id.toString())) {
        this.state.posts.ids.push(post.id.toString());
      }
      this.state.posts.all[post.id] = post;
    }

    this.state.posts.loaded = true;
  }
}

export const store = new Store(initialState());
store.getState();

export const provideStore = () => {
  provide('store', store);
};

export const createStore = (init: State = initialState()) => {
  return new Store(init);
};

export const useStore = (): Store => {
  const store = inject<Store>('store');
  return store;
};
