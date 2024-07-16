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
      const storedUser = localStorage.getItem('loggedUser')
      if (storedUser !== null) {
        return (this.state.user = JSON.parse(storedUser))
      } else {
        return (this.state.user = {})
      }
    }
  },
  created() {
    this.state.loadUserData()
    this.checkLoggedInUser()
  }
}
</script>
