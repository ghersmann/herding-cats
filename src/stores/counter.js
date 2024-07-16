//import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const herdingCatsstore = defineStore('registration', {
  state: () => {
    return {
      apiUrl: 'http://localhost:3000/',
      user: null,
      userData: null,
      tripData: [],
      userTrips: [],
      userSearchedTrips: []
    }
  },
  actions: {
    async loadUserData() {
      const response = await fetch(this.apiUrl + 'users')
      const apiUserData = await response.json()
      this.userData = apiUserData
      return this.userData
    },

    async loadUserTripData() {
      this.userTrips = []
      const uniqueTripIds = [...new Set(this.user.trips)]
      for (const tripId of uniqueTripIds) {
        await this.loadUserTrips(tripId)
      }
    },

    async loadUserTrips(tripId) {
      const existingTrip = this.userTrips.find((trip) => trip.id === tripId)
      if (!existingTrip) {
        const response = await fetch(this.apiUrl + 'events/' + tripId)
        const apiTripData = await response.json()
        this.userTrips.push(apiTripData)
        return this.userTrips
      } else {
        return this.userTrips
      }
    },

    async loadTripData(tripId) {
      this.tripData = []
      const existingTrip = this.tripData.find((trip) => trip.id === tripId)
      if (!existingTrip) {
        const response = await fetch(this.apiUrl + 'events/' + tripId)
        const apiTripData = await response.json()
        this.tripData.push(apiTripData)
        return this.tripData
      } else {
        return this.tripData
      }
    }
  }
})
