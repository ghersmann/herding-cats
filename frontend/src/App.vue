<template>
  <router-view />
</template>

<script>
import { herdingCatsstore } from '@/stores/counter.js'
export default {
  data() {
    return {
      state: herdingCatsstore()
    }
  },
  methods: {
    checkLoggedInUser() {
    const storedUser = localStorage.getItem('loggedUser');
    const expiresAt = localStorage.getItem('expiresAt');

    if (storedUser && expiresAt) {
        if (Date.now() > parseInt(expiresAt)) {
            // Session expired, remove user from localStorage
            localStorage.removeItem('loggedUser');
            localStorage.removeItem('expiresAt');
            alert("Session expired. Please log in again.");
            this.$router.push({ name: 'home' });
            return (this.state.user = {});
        } else {
            return (this.state.user = JSON.parse(storedUser));
        }
    } else {
        return (this.state.user = {});
    }
}
  },
  created() {
    this.checkLoggedInUser()
  }
}
</script>
