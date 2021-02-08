<template>
  <PostWriter :post="post" @save="save" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import PostWriter from './PostWriter.vue';
import { useStore } from './store';
import { Post } from './types';

export default defineComponent({
  components: { PostWriter },
  async setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();
    const id = route.params.id as string;

    if (!store.getState().posts.loaded) {
      await store.fetchPosts();
    }

    const post = store.getState().posts.all[id];
    const canEdit =
      post.authorId === parseInt(store.getState().authors.currentUserId!, 10);

    if (!canEdit) {
      router.push('/');
    }

    const save = async (post: Post) => {
      console.log('edited post', post);
      await store.updatePost(post);
      router.push('/');
    };

    return {
      post,
      save,
      to: `/posts/${post.id}/edit`,
    };
  },
});
</script>
