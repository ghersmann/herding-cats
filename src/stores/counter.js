import { defineStore } from 'pinia'

export const herdingCatsstore = defineStore('registration', {
  state: () => ({
      apiUrl:  import.meta.env.VITE_VERCEL_SERVERLESS_API_URL,
      user: null,
      userData: null,
      userTrips: [],
      userSearchedTrips: [],
      tripData: [],
      isDataLoaded: false
  }),
  actions: {
    async loadUserData() {
      const response = await fetch(`${this.apiUrl}?pathname=users`)
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
        const response = await fetch(`${this.apiUrl}?pathname=events&id=${tripId}`)
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
          const response = await fetch(`${this.apiUrl}?pathname=events&id=${tripId}`);
          const apiTripData = await response.json();
          this.tripData = [apiTripData];
        }
        return this.tripData;
      },

    async deleteItem(id) {
      console.log('pinia deleteItem')

      try {
        const response = await fetch(`${this.apiUrl}?pathname=events&id=${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.tripData[0]), 
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Failed to update event: ${errorData.error}`);
        } else {
          console.log('pinia ', this.tripData[0])
        }
      } catch (error) {
        console.error('Error updating event:', error);
        alert('Failed to update event. Please try again.');
      }
    }
  },
})
