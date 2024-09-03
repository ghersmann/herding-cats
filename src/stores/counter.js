import { defineStore } from 'pinia'

export const herdingCatsstore = defineStore('registration', {
  state: () => {
    return {
      apiUrl: 'http://localhost:3000/'|| import.meta.env.VITE_API_URL,
      user: null,
      userData: null,
      tripData: [],
      userTrips: [],
      userSearchedTrips: [],
      isDataLoaded: false
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
        const existingTrip = this.tripData.find((trip) => trip.id === tripId);
      
        if (!existingTrip) {
          const response = await fetch(this.apiUrl + 'events/' + tripId);
          const apiTripData = await response.json();
          this.tripData = [apiTripData];
        }
        
        return this.tripData;
    }
  }
})
