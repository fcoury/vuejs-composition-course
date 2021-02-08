<template>
  <div>
    <div class="columns">
      <div class="column">
        <div class="field">
          <div class="label">Post Title</div>
          <div class="control">
            <input
              data-test="post-title"
              v-model="title"
              type="text"
              class="input"
            />
            {{ title }}
          </div>
        </div>
      </div>
    </div>

    <div class="columns">
      <div class="column is-one-half">
        <div
          contenteditable
          data-test="markdown"
          id="markdown"
          ref="contentEditable"
          @input="handleEdit"
        />
      </div>
      <div class="column is-one-half">
        <div v-html="html" />
      </div>
    </div>

    <div class="columns">
      <div class="column">
        <button
          data-test="submit-post"
          @click="submit"
          class="button is-primary is-pulled-right"
        >
          Submit
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { parse, MarkedOptions } from 'marked';
import { highlightAuto } from 'highlight.js';
import { defineComponent, onMounted, ref, watch } from 'vue';
import debounce from 'lodash/debounce';

import { Post } from './types';

export default defineComponent({
  name: 'PostWriter',
  props: {
    post: {
      type: Object as () => Post,
      required: true,
    },
  },
  emits: ['save'],

  setup(props, ctx) {
    const title = ref(props.post.title);
    const contentEditable = ref<null | HTMLDivElement>(null);
    const markdown = ref(props.post.markdown);
    const html = ref('');

    const options: MarkedOptions = {
      highlight: (code: string) => highlightAuto(code).value,
    };

    const handleEdit = () => {
      markdown.value = contentEditable.value.innerText;
    };

    const submit = () => {
      const post: Post = {
        ...props.post,
        title: title.value,
        markdown: markdown.value,
        html: html.value,
      };
      ctx.emit('save', post);
    };

    const update = (value: string) => (html.value = parse(value, options));
    watch(() => markdown.value, debounce(update, 500), { immediate: true });

    onMounted(() => {
      contentEditable.value.innerText = markdown.value;
    });

    return {
      title,
      contentEditable,
      handleEdit,
      markdown,
      html,
      submit,
    };
  },
});
</script>
