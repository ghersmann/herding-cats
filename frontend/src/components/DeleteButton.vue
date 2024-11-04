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
    }
  },
  methods: {
    async deleteTrip() {
      const confirmed = confirm("Are you sure you want to delete this trip?");
      if (!confirmed) return; 
      await this.deleteApiTrip();
      await this.deleteTripFromUserTrips();
      this.$router.push({ name: 'alltravels' });
    },

    // Function to delete trip from the API
    async deleteApiTrip() {
      try {
        const result = await fetch(`${this.state.apiUrl}/events?id=${this.$route.params.id}`, {
          method: 'DELETE',
        });
      } catch (error) {
        console.error('Error deleting trip:', error);
      }
    },

    // Function to delete the trip from user's trips array and update API and local storage
    async deleteTripFromUserTrips() {

      // Get logged-in user from localStorage
      const loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
      if (!loggedUser) {
        console.error('No logged user found');
        return;
      }

      // Remove the trip ID from the user's trips array
      const updatedTrips = loggedUser.trips.filter(trip => trip !== this.$route.params.id);

      // Create a new updated user object
      const updatedUser = { ...loggedUser, trips: updatedTrips };
      this.state.user = updatedUser;

      // Update the user in the API
      await this.state.updateUserState(this.state.user.id)
    },
  },
};
</script>

<style scoped>
.delete-trip {
  background-color: var(--required-red);
  margin-top: 2rem;
}
</style>
