<template>
  <button class="delete-trip" @click="deleteTrip">Delete Trip</button>
</template>

<script>
import { herdingCatsstore } from '@/stores/counter.js'
export default {
  name: 'DeleteButton',
  props: {},
  data() {
    return {
      state: herdingCatsstore(),
      tripId: this.$route.params.id
    }
  },
  methods: {
    async deleteTrip() {
      await fetch(`${this.state.apiUrl}events/${this.tripId}`, {
        method: 'DELETE'
      })

      const usersResponse = await fetch(`${this.state.apiUrl}users`)
      const users = await usersResponse.json()

      const loggedUser = JSON.parse(localStorage.getItem('loggedUser'))
      let updatedLoggedUser = null

      const updateUsersPromises = users.map(async (user) => {
        if (user.trips.includes(this.tripId)) {
          const updatedTrips = user.trips.filter((trip) => trip !== this.tripId)
          const updatedUser = { ...user, trips: updatedTrips }

          if (user.id === loggedUser.id) {
            updatedLoggedUser = updatedUser
            localStorage.setItem('loggedUser', JSON.stringify(updatedLoggedUser))
          }

          return fetch(`${this.state.apiUrl}users/${user.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedUser)
          })
        }
      })

      await Promise.all(updateUsersPromises)

      this.$router.push({ name: 'alltravels' })
    }
  }
}
</script>
<style scoped>
.delete-trip {
  background-color: var(--required-red);
  margin-top: 2rem;
}
</style>
