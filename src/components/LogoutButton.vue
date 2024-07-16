<template>
  <button @click="logOutUser">Log Out</button>
</template>

<script>
import { herdingCatsstore } from '@/stores/counter.js'
export default {
  data() {
    return {
      name: 'LogoutButton',
      state: herdingCatsstore()
    }
  },
  methods: {
    logOutUser() {
      this.state.user = null
      localStorage.removeItem('loggedUser')
      this.$router.push({ name: 'logout' })
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
