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
      console.log('Delete trip initiated');
      await this.deleteApiTrip();
      await this.deleteTripFromUserTrips();
      this.$router.push({ name: 'alltravels' });
    },

    // Function to delete trip from the API
    async deleteApiTrip() {
      console.log('Delete API trip started');
      try {
        const result = await fetch(`${this.state.apiUrl}/events?id=${this.$route.params.id}`, {
          method: 'DELETE',
        });
        if (result.ok) {
          console.log('Trip deleted:', result);
        } else {
          console.log('Trip not found for deletion');
        }
      } catch (error) {
        console.error('Error deleting trip:', error);
      }
    },

    // Function to delete the trip from user's trips array and update API and local storage
    async deleteTripFromUserTrips() {
      console.log('deleteTripFromUserTrips started');

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
      try {
        const response = await fetch(`${this.state.apiUrl}/users?id=${loggedUser.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedUser),
        });

        if (response.ok) {
          console.log('User updated successfully in the API');
          // Update the user in localStorage
          localStorage.setItem('loggedUser', JSON.stringify(updatedUser));
        } else {
          console.error('Failed to update user in the API');
        }
        const localUser = JSON.parse(localStorage.getItem('loggedUser'))
        console.log('LocalUser', localUser)
      } catch (error) {
        console.error('Error updating user in the API:', error);
      }
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
