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
      isMenuOpen: false,
      allTripTitles: []
  }),

  actions: {
    async loadUserTripData() {
      if (!Array.isArray(this.user?.trips)) {
        this.userTrips = []
        return
      }

      const uniqueTripIds = [...new Set(this.user.trips)]

      const results = await Promise.all(
        uniqueTripIds.map(async (tripId) => {
          try {
            const response = await fetch(`${this.apiUrl}/events?id=${tripId}`)
            if (!response.ok) {
              return null
            }

            const trip = await response.json()

            if (
              !trip ||
              typeof trip !== 'object' ||
              !trip.id ||
              !trip.tripStart ||
              !trip.tripEnd
            ) {
              console.warn(
                `Dropped invalid tripId "${tripId}" — malformed trip data returned`,
                trip
              )
              return null
            }
            return trip

          } catch (error) {
            console.error(`[${tripId}] Fetch failed`)
            return null
          }
        })
      )

      const filteredOutIds = uniqueTripIds.filter(
        (_, index) => results[index] === null
      )

      this.userTrips = results.filter(Boolean)
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

    async loadTripTitlesAndIds() {
      try {
            const response = await fetch (`${this.apiUrl}/events/titles`);
            const tripTitles = await response.json();
            this.allTripTitles = tripTitles;
            return this.allTripTitles;
          } catch (error) {
            console.error('Failed to fetch triptitles', error);
            throw error
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
