<template>
  <nav class="navbar">
    <div class="navbar-end">
      <div class="buttons" v-if="auth">
        <router-link class="button" to="/posts/new">New Post</router-link>
        <button class="button" @click="signout">Signout</button>
      </div>

      <div class="buttons" v-if="!auth">
        <button class="button" @click="signup">Signup</button>
        <button class="button" @click="signin">Signin</button>
      </div>
    </div>
    <teleport to="#modal" v-if="modal.visible.value">
      <component :is="component" />
    </teleport>
  </nav>
</template>

<script lang="ts">
import { computed, defineComponent, markRaw } from 'vue';
import Signup from './Signup.vue';
import { useStore } from './store';
import { useModal } from './useModal';

export default defineComponent({
  components: { Signup },
  setup() {
    const store = useStore();
    const auth = computed(() => store.getState().authors.currentUserId);
    const modal = useModal();

    const signup = () => {
      modal.showModal();
      modal.component.value = markRaw(Signup);
    };
    const signin = () => {
      modal.showModal();
    };

    return {
      component: modal.component,
      modal,
      auth,
      signup,
      signin,
    };
  },
});
</script>
