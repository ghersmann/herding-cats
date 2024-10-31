<template>
  <button @click="logOutUser">Log Out</button>
</template>

<script>
import { herdingCatsstore } from '@/stores/counter.js'

export default {
  data() {
    return {
      name: 'LogoutButton',
      state: herdingCatsstore(),
    };
  },
  methods: {
    logOutUser() {
      // Navigate first, then clear user data to avoid access errors
      this.$router.push({ name: 'logout' }).then(() => {
        this.state.user = null;
        localStorage.removeItem('loggedUser');
      }).catch(err => {
        console.error('Error during logout navigation:', err);
      });
    }
  }
}
</script>


<style scoped>
button {
  background-color: var(--required-red);
  margin-top: 2rem;
}
</style>
