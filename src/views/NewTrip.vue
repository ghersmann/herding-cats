<template>
<CatHeader />

  <main class="container">
    <h2 class="title">Create new trip</h2>

    <label class="required">Name your trip</label>
    <input v-model="tripName" type="text" />

    <label class="required">Start of trip</label>
    <input v-model="tripStart" type="datetime-local" />

    <label class="required">End of trip</label>
    <input v-model="tripEnd" type="datetime-local" />

    <button class="create-btn" @click="makeTrip">Create Trip</button>
    <router-link :to="{ name: 'alltravels' }">
      <button class="cancel-btn">Cancel</button>
    </router-link>
  </main>
</template>

<script>
import { herdingCatsstore } from '@/stores/counter.js'
import router from '@/router/index.js'
import CatHeader from '@/components/CatHeader.vue';
export default {
  data() {
    return {
      state: herdingCatsstore(),
      tripId: '',
      tripName: '',
      tripStart: '',
      tripEnd: ''
    }
  },

  components: {
    CatHeader
  },
  methods: {
    convertDate(date) {
      if (date.length >= 1) {
        const year = date.slice(0, 4)
        const month = date.slice(5, 7)
        const day = date.slice(8, 10)
        const time = date.slice(11, 16)
        const convertedDate = day + '.' + month + '.' + year + ' - ' + time
        return convertedDate
      }
    },

    makeTrip() {
      if (this.tripName !== '') {
        this.tripId = (Date.now() + Math.floor(Math.random() * 10)).toString()
        this.sendData()
      }
    },

    async sendData() {
  const tripStartFormatted = this.convertDate(this.tripStart);
  const tripEndFormatted = this.convertDate(this.tripEnd);
  const requestData = {
    id: this.tripId,
    admins: [{ userId: this.state.user.id }],
    tripTitle: this.tripName,
    tripStart: tripStartFormatted,
    tripEnd: tripEndFormatted,
    public: false,
    details: {
      transport: [],
      lodging: [],
      activity: [],
      groupmembers: [],
      packlist: [],
      notes: []
    }
  };

  try {
    // Send POST request to create a new trip (event)
    const createResponse = await fetch(`${this.state.apiUrl}?pathname=events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    });

    if (createResponse.ok) {
      // Successfully created the trip, push the user to the trip page
      const responseData = await createResponse.json(); // Parse the response JSON
      const createdTripId = responseData.id || this.tripId; // Use response ID or the sent one
      const currentUser = { ...this.state.user }; // Copy the current user state

      // Add the newly created trip's ID to the current user's trip array
      currentUser.trips.push(createdTripId.toString());

      const updateUserRequestData = currentUser;

      // Send PUT request to update the user with the new trip ID
      const updateUserResponse = await fetch(`${this.state.apiUrl}?pathname=users&id=${this.state.user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateUserRequestData)
      });

      if (updateUserResponse.ok) {
        // Save the updated user data locally after the user is updated on the server
        localStorage.setItem('loggedUser', JSON.stringify(updateUserRequestData));

        // Navigate to the created trip's page
        router.push(`/trip/${createdTripId}`);
      } else {
        // Error in updating user data
        alert('Server Error. Failed to update user data with the new trip.');
      }
    } else {
      // Error in creating the trip
      alert('Server Error. Failed to create trip. Sorry.');
      router.push('/AllTravels/');
    }
  } catch (error) {
    // Catch any other errors and display a message
    alert('Server Error. Failed to create trip. Sorry.');
    router.push('/AllTravels/');
  }
}

  }
}
</script>

<style scoped>
.container {
  min-height: 10rem;
  background-color: var(--turqoise-notes);
}

label {
  margin-top: 2rem;
  font-family: 'Satoshi-Variable';
  font-style: normal;
  font-weight: 400;
  font-size: 2rem;
  color: #000000;
}
.create-btn {
  margin-top: 4rem;
  background-color: var(--green-packing-list);
}
.cancel-btn {
  margin-top: 2rem;
}
</style>
