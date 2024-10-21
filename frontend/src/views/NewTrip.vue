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

    async makeTrip() {
      if (this.tripName !== '' && this.tripStart !== '' && this.tripEnd !== '') {
        this.tripId = (Date.now() + Math.floor(Math.random() * 10)).toString()
        await this.updateUserData(this.tripId)
        await this.sendTripData(this.tripId)
        this.$router.push(`/trip/${this.tripId}`);
      } else {
        alert("Please make sure you've filled out all required fields.")
      }
    },

    async updateUserData(tripId){
      this.state.user.trips.push(tripId.toString())
      await this.state.updateUserState(this.state.user.id)
    },

   async sendTripData(tripId) {
  const tripStartFormatted = this.convertDate(this.tripStart);
  const tripEndFormatted = this.convertDate(this.tripEnd);
  const requestData = {
    id: tripId,
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
    const createResponse = await fetch(`${this.state.apiUrl}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    });

    if (createResponse.ok) {
      const responseData = await createResponse.json();
      } 
     else {
      alert('Server Error. Failed to create trip. Sorry.');
      this.$router.push('/AllTravels/');
    }
  } catch (error) {
    alert('Server Error. Failed to create trip. Sorry.');
    this.$router.push('/AllTravels/');
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
