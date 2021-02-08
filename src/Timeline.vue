<template>
  <nav class="is-primary panel">
    <p class="panel-tabs">
      <a
        v-for="period in periods"
        data-test="period"
        :key="period"
        :class="[period === selectedPeriod ? 'is-active' : '']"
        @click="setPeriod(period)"
      >
        {{ period }}
      </a>
    </p>

    <TimelinePost v-for="post in posts" :key="post.id" :post="post" />
  </nav>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent, ref } from 'vue';
import moment from 'moment';

import TimelinePost from './TimelinePost.vue';
import { Period, Post } from './types';
import { useStore } from './store';

export default defineComponent({
  components: {
    TimelinePost,
  },

  async setup() {
    const periods: Period[] = ['today', 'this week', 'this month'];
    const selectedPeriod = ref<Period>('today');

    const store = useStore();
    if (!store.getState().posts.loaded) {
      await store.fetchPosts();
    }

    const allPosts = store.getState().posts.ids.reduce<Post[]>((acc, id) => {
      const post = store.getState().posts.all[id];
      return acc.concat(post);
    }, []);

    const posts: ComputedRef<Post[]> = computed(() =>
      allPosts.filter((post) => {
        if (selectedPeriod.value === 'today') {
          return post.created.isAfter(moment().subtract(1, 'day'));
        } else if (selectedPeriod.value === 'this week') {
          return post.created.isAfter(moment().subtract(7, 'days'));
        } else if (selectedPeriod.value === 'this month') {
          return post.created.isAfter(moment().subtract(1, 'month'));
        }

        return false;
      }),
    );

    const setPeriod = (period: Period) => {
      selectedPeriod.value = period;
    };

    return {
      periods,
      selectedPeriod,
      posts,
      setPeriod,
    };
  },
});
</script>
