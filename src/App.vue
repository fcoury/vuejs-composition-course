<template>
  <div class="modal" :style="style">
    <div class="modal-background"></div>
    <div class="modal-content">
      <div id="modal"></div>
    </div>
    <button
      class="modal-close is-large"
      aria-label="close"
      @click="modal.hideModal()"
    ></button>
  </div>
  <section class="section">
    <div class="container">
      <NavBar />
      <router-view />
    </div>
  </section>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { required, length, validate, Status } from './validators';
import NavBar from './NavBar.vue';
import FormInput from './FormInput.vue';
import { useModal } from './useModal';
import { provideStore } from './store';

export default defineComponent({
  name: 'App',
  components: {
    NavBar,
    FormInput,
  },

  setup() {
    provideStore();
    const modal = useModal();
    const username = ref('username');
    const usernameStatus = computed<Status>(() => {
      return validate(username.value, [
        required(),
        length({ min: 5, max: 10 }),
      ]);
    });

    const style = computed(() => ({
      display: modal.visible.value ? 'block' : 'none',
    }));
    return {
      style,
      modal,
      username,
      usernameStatus,
    };
  },
});
</script>
