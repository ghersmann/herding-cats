import { defineStore } from 'pinia'

export const herdingCatsstore = defineStore('registration', {
  state: () => ({
      apiUrl:  import.meta.env.VITE_MONGO_URI,
      user: null,
      userData: null,
      userTrips: [],
      userSearchedTrips: [],
      tripData: [],
      isUserThere: false,
      isDataLoaded: false,
      isModalOpen: false,
      isMenuOpen: false
  }),
  actions: {
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
        const response = await fetch(`${this.apiUrl}/events?id=${tripId}`)
        const apiTripData = await response.json()
        this.userTrips.push(apiTripData)
        return this.userTrips
      } else {
        return this.userTrips
      }
    },
    
    async loadTripIds() {
      try {
            const response = await fetch(`${this.apiUrl}/events/ids`);
            const tripIds = await response.json();
            this.allTripIds = tripIds;
            return this.allTripIds;
          } catch (error) {
            console.error('Failed to fetch trip IDs:', error);
            throw error;
          }
        },

    async loadTripData(tripId) {
      const existingTrip = this.tripData.find((trip) => trip.id === tripId);
      if (existingTrip) {
        return existingTrip; 
            } else {
            try {
              const response = await fetch(`${this.apiUrl}/events?id=${tripId}`);
              if (!response.ok) {
                alert('Looks like youre trying to load a trip that doesnt exist. Sorry mate.')
                throw new Error('Failed to fetch trip data');
              }
              const apiTripData = await response.json();
              this.tripData = [apiTripData];
          
              return apiTripData; 
            } catch (error) {
              console.error('Error fetching trip data:', error);
              throw error;
            }}
          },
        
    async updateTripState(tripId) {
       await fetch(`${this.apiUrl}/events?id=${tripId}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(this.tripData[0])
            });
          },

    async updateUserState(userId) {
      await fetch(`${this.apiUrl}/users?id=${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.user)
      });
      localStorage.setItem('loggedUser', JSON.stringify(this.user));
    },
       
    async checkUser() {
      if (this.user === null || Object.keys(this.user).length === 0) {
        this.isUserThere = false
      } else {
        this.isUserThere = true
      }
    }
  },
})
