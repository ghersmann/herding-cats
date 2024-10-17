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
        console.log('local storage user is here', JSON.parse(storedUser))
        return (this.state.user = JSON.parse(storedUser))
      } else {
        console.log('local storage user is NOT here')
        return (this.state.user = {})
      }
    }
  },
  created() {
    this.checkLoggedInUser()
  }
}
</script>
