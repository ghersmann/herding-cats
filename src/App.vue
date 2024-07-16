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

<style>
@import '../node_modules/@syncfusion/ej2-base/styles/material.css';
@import '../node_modules/@syncfusion/ej2-buttons/styles/material.css';
@import '../node_modules/@syncfusion/ej2-vue-calendars/styles/material.css';
</style>
