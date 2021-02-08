<template>
  <div class="field">
    <label :for="name" class="label">{{ name }}</label>
    <div class="control">
      <input
        :id="name"
        @input="handleInput"
        :value="modelValue"
        :type="type"
        class="input"
      />
      <p class="help is-danger" v-if="error">{{ error }}</p>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: 'text',
    },
    error: {
      type: String,
    },
    modelValue: {
      type: String,
      required: true,
    },
  },

  setup(propx, ctx) {
    const handleInput = (event: any) => {
      ctx.emit('update:modelValue', event.target.value);
    };

    return {
      handleInput,
    };
  },
});
</script>
